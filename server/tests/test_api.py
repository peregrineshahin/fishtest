import base64
import copy
import gzip
import io
import sys
import unittest
from datetime import datetime, timezone

from fishtest.api import WORKER_VERSION, ApiView
from pyramid.httpexceptions import HTTPUnauthorized
from pyramid.testing import DummyRequest
from util import get_rundb


def cleanup(request):
    request.json_body["worker_info"].pop("remote_addr", None)
    request.json_body["worker_info"].pop("country_code", None)
    return request


def new_run(self, add_tasks=0):
    num_tasks = 4
    num_games = num_tasks * self.chunk_size
    run_id = self.rundb.new_run(
        "master",
        "master",
        num_games,
        "10+0.01",
        "10+0.01",
        "book",
        "10",
        1,
        "",
        "",
        info="The ultimate patch",
        resolved_base="347d613b0e2c47f90cbf1c5a5affe97303f1ac3d",
        resolved_new="347d613b0e2c47f90cbf1c5a5affe97303f1ac3d",
        msg_base="Bad stuff",
        msg_new="Super stuff",
        base_signature="123456",
        new_signature="654321",
        base_net="nn-0000000000a0.nnue",
        new_net="nn-0000000000a0.nnue",
        rescheduled_from="653db116cc309ae839563103",
        base_same_as_master=False,
        tests_repo="https://google.com",
        auto_purge=False,
        username="travis",
        start_time=datetime.now(timezone.utc),
    )
    run = self.rundb.get_run(run_id)
    run["approved"] = True
    if add_tasks > 0:
        run["workers"] = run["cores"] = 0
        for i in range(add_tasks):
            worker_info = copy.deepcopy(self.worker_info)
            worker_info["remote_addr"] = self.remote_addr
            worker_info["country_code"] = self.country_code
            task = {
                "num_games": self.chunk_size,
                "stats": {
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "crashes": 0,
                    "time_losses": 0,
                    "pentanomial": [0, 0, 0, 0, 0],
                },
                "active": True,
                "last_updated": datetime.now(timezone.utc),
                "start": 1234,
                "worker_info": worker_info,
            }
            run["workers"] += 1
            run["cores"] += self.worker_info["concurrency"]
            run["tasks"].append(task)
    self.rundb.buffer(run, True)
    return str(run_id)


def stop_all_runs(self):
    runs = self.rundb.runs.find({})
    stopped = []
    for run in runs:
        run_ = self.rundb.get_run(str(run["_id"]))
        run_["finished"] = True
        for task in run_["tasks"]:
            task["active"] = False
        stopped.append(str(run_["_id"]))
        self.rundb.buffer(run_, True)
    return stopped


class TestApi(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.chunk_size = 200
        self.rundb = get_rundb()
        # Set up an API user (a worker)
        self.username = "JoeUserWorker"
        self.password = "secret"
        self.unique_key = "unique key"
        self.remote_addr = "127.0.0.1"
        self.country_code = "US"
        self.concurrency = 7

        self.worker_info = {
            "uname": "Linux 5.11.0-40-generic",
            "architecture": ["64bit", "ELF"],
            "concurrency": self.concurrency,
            "max_memory": 5702,
            "min_threads": 1,
            "username": self.username,
            "version": WORKER_VERSION,
            "python_version": [
                sys.version_info.major,
                sys.version_info.minor,
                sys.version_info.micro,
            ],
            "gcc_version": [
                9,
                3,
                0,
            ],
            "compiler": "g++",
            "unique_key": "unique key",
            "modified": True,
            "near_github_api_limit": False,
            "ARCH": "?",
            "nps": 0.0,
        }
        self.rundb.userdb.create_user(self.username, self.password, "email@email.email")
        user = self.rundb.userdb.get_user(self.username)
        user["blocked"] = False
        user["machine_limit"] = 50
        self.rundb.userdb.save_user(user)

        self.rundb.userdb.user_cache.insert_one(
            {"username": self.username, "cpu_hours": 0}
        )

    @classmethod
    def tearDownClass(self):
        self.rundb.runs.delete_many({})
        self.rundb.userdb.users.delete_many({"username": self.username})
        self.rundb.userdb.clear_cache()
        self.rundb.userdb.user_cache.delete_many({"username": self.username})
        self.rundb.stop()
        self.rundb.runs.drop()

    def build_json_request(self, json_body):
        return DummyRequest(
            rundb=self.rundb,
            userdb=self.rundb.userdb,
            actiondb=self.rundb.actiondb,
            remote_addr=self.remote_addr,
            json_body=json_body,
        )

    def invalid_password_request(self):
        return self.build_json_request(
            {
                "password": "wrong password",
                "worker_info": copy.deepcopy(self.worker_info),
            }
        )

    def correct_password_request(self, json_body={}):
        return self.build_json_request(
            {
                "password": self.password,
                "worker_info": copy.deepcopy(self.worker_info),
                **json_body,
            }
        )

    def test_get_active_runs(self):
        run_id = new_run(self)
        request = DummyRequest(rundb=self.rundb)
        response = ApiView(request).active_runs()
        self.assertTrue(run_id in response)

    def test_get_run(self):
        run_id = new_run(self)
        request = DummyRequest(rundb=self.rundb, matchdict={"id": run_id})
        response = ApiView(request).get_run()
        self.assertEqual(run_id, response["_id"])

    def test_get_elo(self):
        run_id = new_run(self)
        request = DummyRequest(rundb=self.rundb, matchdict={"id": run_id})
        response = ApiView(request).get_elo()
        # /api/get_elo only works for SPRT
        self.assertFalse(response)

    def test_request_task(self):
        stop_all_runs(self)

        runs = [new_run(self), new_run(self), new_run(self)]

        request = self.invalid_password_request()
        with self.assertRaises(HTTPUnauthorized):
            response = ApiView(request).request_task()
            self.assertTrue("error" in response)
            print(response["error"])

        request = self.correct_password_request()
        response = ApiView(request).request_task()

        run = response["run"]
        run_id = str(run["_id"])
        task_id = response["task_id"]

        self.assertTrue(run_id in runs)

        run = self.rundb.get_run(run_id)
        self.assertEqual(len(run["tasks"]), 1)
        self.assertEqual(run["workers"], 1)
        self.assertEqual(run["cores"], self.concurrency)
        task = run["tasks"][task_id]
        self.assertTrue(task["active"])

    def test_update_task(self):
        run_id = new_run(self, add_tasks=1)
        run = self.rundb.get_run(run_id)
        self.assertFalse(run["results_stale"])

        # Request fails if username/password is invalid
        with self.assertRaises(HTTPUnauthorized):
            response = ApiView(self.invalid_password_request()).update_task()
            self.assertTrue("error" in response)
            print(response["error"])

        # Task is active after calling /api/update_task with the first set of results
        request = self.correct_password_request(
            {
                "run_id": run_id,
                "task_id": 0,
                "stats": {
                    "wins": 2,
                    "draws": 0,
                    "losses": 0,
                    "crashes": 0,
                    "time_losses": 0,
                    "pentanomial": [0, 0, 0, 0, 1],
                },
            }
        )
        response = ApiView(cleanup(request)).update_task()
        self.assertTrue(response["task_alive"])
        self.assertFalse(self.rundb.get_run(run_id)["results_stale"])

        # Task is still active
        cs = self.chunk_size
        w, d = cs // 2 - 10, cs // 2
        request.json_body["stats"] = {
            "wins": w,
            "draws": d,
            "losses": 0,
            "crashes": 0,
            "time_losses": 0,
            "pentanomial": [0, 0, d // 2, 0, w // 2],
        }
        response = ApiView(cleanup(request)).update_task()
        self.assertTrue(response["task_alive"])
        self.assertFalse(self.rundb.get_run(run_id)["results_stale"])

        # Task is still active. Odd update.
        request.json_body["stats"] = {
            "wins": w + 1,
            "draws": d,
            "losses": 0,
            "crashes": 0,
            "time_losses": 0,
            "pentanomial": [0, 0, d // 2, 0, w // 2],
        }
        response = ApiView(cleanup(request)).update_task()
        self.assertFalse(response["task_alive"])

        request.json_body["stats"] = {
            "wins": w + 2,
            "draws": d,
            "losses": 0,
            "crashes": 0,
            "time_losses": 0,
            "pentanomial": [0, 0, d // 2, 0, w // 2 + 1],
        }
        response = ApiView(cleanup(request)).update_task()
        self.assertFalse(response["task_alive"])

        response = ApiView(cleanup(request)).update_task()
        self.assertTrue("info" in response)
        print(response["info"])

        # revive the task
        run["tasks"][0]["active"] = True
        self.rundb.buffer(run, True)

        request.json_body["stats"] = {
            "wins": w + 2,
            "draws": d,
            "losses": 0,
            "crashes": 0,
            "time_losses": 0,
            "pentanomial": [0, 0, d // 2, 0, w // 2 + 1],
        }
        response = ApiView(cleanup(request)).update_task()
        self.assertTrue(response["task_alive"])
        # Go back in time
        request.json_body["stats"] = {
            "wins": w,
            "draws": d,
            "losses": 0,
            "crashes": 0,
            "time_losses": 0,
            "pentanomial": [0, 0, d // 2, 0, w // 2],
        }
        response = ApiView(cleanup(request)).update_task()
        self.assertFalse(response["task_alive"])

        # revive the task
        run["tasks"][0]["active"] = True
        self.rundb.buffer(run, True)

        # Task is finished when calling /api/update_task with results where the number of
        # games played is the same as the number of games in the task
        task_num_games = run["tasks"][0]["num_games"]
        request.json_body["stats"] = {
            "wins": task_num_games,
            "draws": 0,
            "losses": 0,
            "crashes": 0,
            "time_losses": 0,
            "pentanomial": [0, 0, 0, 0, task_num_games // 2],
        }
        response = ApiView(cleanup(request)).update_task()
        self.assertFalse(self.rundb.get_run(run_id)["results_stale"])
        self.assertFalse(response["task_alive"])
        run = self.rundb.get_run(run_id)
        task = run["tasks"][0]
        self.assertFalse(task["active"])

    def test_failed_task(self):
        run_id = new_run(self, add_tasks=1)
        run = self.rundb.get_run(run_id)
        # Request fails if username/password is invalid
        request = self.invalid_password_request()
        with self.assertRaises(HTTPUnauthorized):
            response = ApiView(self.invalid_password_request()).update_task()
            self.assertTrue("error" in response)
            print(response["error"])

        self.assertTrue(run["tasks"][0]["active"])
        message = "Sorry but I can't run this"
        request = self.correct_password_request(
            {"run_id": run_id, "task_id": 0, "message": message}
        )
        response = ApiView(request).failed_task()
        response.pop("duration", None)
        self.assertEqual(response, {})
        self.assertFalse(run["tasks"][0]["active"])

        request = self.correct_password_request({"run_id": run_id, "task_id": 0})
        response = ApiView(request).failed_task()
        self.assertTrue("info" in response)
        print(response["info"])
        self.assertFalse(run["tasks"][0]["active"])

        # revive task
        run["tasks"][0]["active"] = True
        self.rundb.buffer(run, True)
        request = self.correct_password_request(
            {"run_id": run_id, "task_id": 0, "message": message}
        )
        response = ApiView(request).failed_task()
        response.pop("duration", None)
        self.assertTrue(response == {})
        self.assertFalse(run["tasks"][0]["active"])

    def test_stop_run(self):
        run_id = new_run(self, add_tasks=1)
        with self.assertRaises(HTTPUnauthorized):
            response = ApiView(self.invalid_password_request()).stop_run()
            self.assertTrue("error" in response)
            print(response["error"])

        run = self.rundb.get_run(run_id)
        self.assertFalse(run["finished"])

        message = "/api/stop_run request"
        request = self.correct_password_request(
            {"run_id": run_id, "task_id": 0, "message": message}
        )
        with self.assertRaises(HTTPUnauthorized):
            response = ApiView(request).stop_run()
            self.assertTrue("error" in response)
            self.assertFalse(run["tasks"][0]["active"])

        self.rundb.userdb.user_cache.update_one(
            {"username": self.username}, {"$set": {"cpu_hours": 10000}}
        )

        response = ApiView(request).stop_run()
        response.pop("duration", None)
        self.assertTrue(response == {})

        self.assertTrue(run["finished"])

    def test_upload_pgn(self):
        run_id = new_run(self, add_tasks=1)
        task_id = 0
        pgn_text = "1. e4 e5 2. d4 d5"
        with io.BytesIO() as gz_buffer:
            with gzip.GzipFile(
                filename=f"{run_id}-{task_id}.pgn.gz", mode="wb", fileobj=gz_buffer
            ) as gz:
                gz.write(pgn_text.encode())
            request = self.correct_password_request(
                {
                    "run_id": run_id,
                    "task_id": task_id,
                    "pgn": base64.b64encode(gz_buffer.getvalue()).decode(),
                }
            )
        response = ApiView(request).upload_pgn()
        response.pop("duration", None)
        self.assertTrue(response == {})

        pgn_filename_prefix = "{}-{}".format(run_id, task_id)
        zip_pgn = self.rundb.get_pgn(pgn_filename_prefix)
        with gzip.GzipFile(fileobj=io.BytesIO(zip_pgn), mode="rb") as gz:
            pgn = gz.read().decode()
        self.assertEqual(pgn, pgn_text)
        self.rundb.pgndb.delete_one({"run_id": pgn_filename_prefix})

    def test_request_spsa(self):
        run_id = new_run(self, add_tasks=1)
        run = self.rundb.get_run(run_id)
        run["args"]["spsa"] = {
            "iter": 1,
            "num_iter": 10,
            "alpha": 1,
            "gamma": 1,
            "A": 1,
            "params": [
                {"name": "param name", "a": 1, "c": 1, "theta": 1, "min": 0, "max": 100}
            ],
        }
        request = self.correct_password_request({"run_id": run_id, "task_id": 0})
        response = ApiView(request).request_spsa()
        self.assertTrue(response["task_alive"])
        self.assertTrue(response["w_params"] is not None)
        self.assertTrue(response["b_params"] is not None)

    def test_request_version(self):
        with self.assertRaises(HTTPUnauthorized):
            response = ApiView(self.invalid_password_request()).request_version()
            self.assertTrue("error" in response)
            print(response["error"])

        response = ApiView(self.correct_password_request()).request_version()
        self.assertEqual(WORKER_VERSION, response["version"])

    def test_beat(self):
        run_id = new_run(self, add_tasks=1)

        with self.assertRaises(HTTPUnauthorized):
            response = ApiView(self.invalid_password_request()).beat()
            self.assertTrue("error" in response)
            print(response["error"])

        request = self.correct_password_request({"run_id": run_id, "task_id": 0})
        response = ApiView(request).beat()
        response.pop("duration", None)
        self.assertEqual(response, {})


class TestRunFinished(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.chunk_size = 200
        self.rundb = get_rundb()
        # Set up an API user (a worker)
        self.username = "JoeUserWorker"
        self.password = "secret"
        self.unique_key = "unique key"
        self.remote_addr = "127.0.0.1"
        self.concurrency = 7

        self.worker_info = {
            "uname": "Linux 5.11.0-40-generic",
            "architecture": ["64bit", "ELF"],
            "concurrency": self.concurrency,
            "max_memory": 5702,
            "min_threads": 1,
            "username": self.username,
            "version": WORKER_VERSION,
            "python_version": [
                sys.version_info.major,
                sys.version_info.minor,
                sys.version_info.micro,
            ],
            "gcc_version": [
                9,
                3,
                0,
            ],
            "compiler": "g++",
            "unique_key": "unique key",
            "near_github_api_limit": False,
            "modified": True,
            "ARCH": "?",
            "nps": 0.0,
        }
        self.rundb.userdb.create_user(self.username, self.password, "email@email.email")
        user = self.rundb.userdb.get_user(self.username)
        user["blocked"] = False
        user["machine_limit"] = 50
        self.rundb.userdb.save_user(user)

        self.rundb.userdb.user_cache.insert_one(
            {"username": self.username, "cpu_hours": 0}
        )

    @classmethod
    def tearDownClass(self):
        self.rundb.userdb.users.delete_many({"username": self.username})
        self.rundb.userdb.clear_cache()
        self.rundb.userdb.user_cache.delete_many({"username": self.username})
        self.rundb.stop()
        self.rundb.runs.drop()

    def build_json_request(self, json_body):
        return DummyRequest(
            rundb=self.rundb,
            userdb=self.rundb.userdb,
            actiondb=self.rundb.actiondb,
            remote_addr=self.remote_addr,
            json_body=json_body,
        )

    def correct_password_request(self, json_body={}):
        return self.build_json_request(
            {
                "password": self.password,
                "worker_info": copy.deepcopy(self.worker_info),
                **json_body,
            }
        )

    def test_duplicate_workers(self):
        stop_all_runs(self)
        run_id = new_run(self)
        run = self.rundb.get_run(run_id)
        self.rundb.buffer(run, True)
        # Request task 1 of 2
        request = self.correct_password_request()
        response = ApiView(request).request_task()
        self.assertFalse("error" in response)
        # Request task 2 of 2
        request = self.correct_password_request()
        response = ApiView(request).request_task()
        self.assertTrue("error" in response)

    def test_auto_purge_runs(self):
        stop_all_runs(self)
        run_id = new_run(self)
        run = self.rundb.get_run(run_id)
        num_games = 1200
        run["args"]["num_games"] = num_games
        self.rundb.buffer(run, True)

        # Request task 1 of 2
        request = self.correct_password_request()
        response = ApiView(request).request_task()
        self.assertEqual(response["run"]["_id"], str(run["_id"]))
        self.assertEqual(response["task_id"], 0)
        task1 = self.rundb.get_run(run_id)["tasks"][0]
        task_size1 = task1["num_games"]

        # Finish task 1 of 2
        n_wins = task_size1 // 5
        n_losses = task_size1 // 5
        n_draws = task_size1 - n_wins - n_losses

        request = self.correct_password_request(
            {
                "run_id": run_id,
                "task_id": 0,
                "stats": {
                    "wins": n_wins,
                    "draws": n_draws,
                    "losses": n_losses,
                    "crashes": 0,
                    "time_losses": 0,
                    "pentanomial": [n_losses // 2, 0, n_draws // 2, 0, n_wins // 2],
                },
            }
        )
        response = ApiView(request).update_task()
        self.assertFalse(response["task_alive"])
        run = self.rundb.get_run(run_id)
        self.assertFalse(run["finished"])

        # Request task 2 of 2
        request = self.correct_password_request()
        response = ApiView(request).request_task()
        self.assertEqual(response["run"]["_id"], str(run["_id"]))
        self.assertEqual(response["task_id"], 1)
        task2 = self.rundb.get_run(run_id)["tasks"][1]
        task_size2 = task2["num_games"]
        task_start2 = task2["start"]

        self.assertEqual(task_start2, task_size1)

        # Finish task 2 of 2
        n_wins = task_size2 // 5
        n_losses = task_size2 // 5
        n_draws = task_size2 - n_wins - n_losses

        request = self.correct_password_request(
            {
                "run_id": run_id,
                "task_id": 1,
                "stats": {
                    "wins": n_wins,
                    "draws": n_draws,
                    "losses": n_losses,
                    "crashes": 0,
                    "time_losses": 0,
                    "pentanomial": [n_losses // 2, 0, n_draws // 2, 0, n_wins // 2],
                },
            }
        )
        response = ApiView(request).update_task()
        self.assertFalse(response["task_alive"])

        # The run should be marked as finished after the last task completes
        run = self.rundb.get_run(run_id)
        self.assertTrue(run["finished"])
        self.assertFalse(run["results_stale"])
        self.assertTrue(all([not t["active"] for t in run["tasks"]]))
        self.assertTrue("Total: {}".format(num_games) in run["results_info"]["info"][1])


if __name__ == "__main__":
    unittest.main()
