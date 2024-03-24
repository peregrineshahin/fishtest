import { workerName, diffDate, deltaDate } from "../../Utils/Utils";
import { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { Context } from "../../Components/Context/Context";
import {Link} from "react-router-dom"

function Tasks(props) {
  const { tasksCount, runId, tasksShown } = props;
  const context = useContext(Context);

  const fetchTasks = async () => {
    const response = await fetch(
      `http://172.23.43.179/api/tests/tasks/${runId}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const { data, error, isLoading } = useQuery(
    "tasks",
    () => fetchTasks(runId),
    {
      enabled: !context.fetchedTasksBefore,
    }
  );

  useEffect(() => {
    if (tasksShown) show();
  }, [tasksShown]);

  useEffect(() => {
    if (data) {
      context.setTasks(data);
    }
  }, [data, context]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching tasks:", error.message);
    }
  }, [error]);

  function show() {
    context.setFetchedTasksBefore(true);
    context.setShowTasks(true);
  }

  function handleToggle() {
    if (!context.showTasks && !context.fetchedTasksBefore) {
      context.setFetchedTasksBefore(true);
    }
    context.setShowTasks(!context.showTasks);
  }

  function RenderTasks({ run, approver, showTask }) {
    if (!run?.tasks) return;

    
    const tasks = run["tasks"].concat(run["bad_tasks"] || []);

    return tasks.map((task, idx) => {
      if ("bad" in task && idx < tasks.length) {
        return null;
      }

      const task_id = task["task_id"] || idx;
      const stats = task["stats"] || {};

      if (!("stats" in task)) {
        return null;
      }

      let active_style = "";
      if (task_id === showTask) {
        active_style = "highlight";
      } else if (task["active"]) {
        active_style = "info";
      }

      let workerInfo;
      if (approver && task["worker_info"]["username"] !== "Unknown_worker") {
        workerInfo = (
          <Link to={`/workers/${workerName(task["worker_info"], true)}`}>
            {workerName(task["worker_info"])}
          </Link>
        );
      } else if ("worker_info" in task) {
        workerInfo = workerName(task["worker_info"]);
      } else {
        workerInfo = "-";
      }

      const gcc_version = task["worker_info"]["gcc_version"].join(".");
      const compiler = task["worker_info"]["compiler"] || "g++";
      const python_version = task["worker_info"]["python_version"].join(".");
      const version = task["worker_info"]["version"];
      const ARCH = task["worker_info"]["ARCH"];

      let residualCell;
      if (!run["args"]["spsa"]) {
        if ("residual" in task && task["residual"] !== Infinity) {
          residualCell = (
            <td style={{ backgroundColor: task["residual_color"] }}>
              {`${task["residual"].toFixed(3)}`}
            </td>
          );
        } else {
          residualCell = <td>-</td>;
        }
      }

      let pentanomialCell;
      if (!run["results"]["pentanomial"]) {
        const p = stats["pentanomial"] || [0, 0, 0, 0, 0];
        pentanomialCell = (
          <td>
            [{p[0]}, {p[1]}, {p[2]}, {p[3]}, {p[4]}]
          </td>
        );
      } else {
        pentanomialCell = (
          <>
            <td>{stats["wins"] || "-"}</td>
            <td>{stats["losses"] || "-"}</td>
            <td>{stats["draws"] || "-"}</td>
          </>
        );
      }

      return (
        <tr key={`task${task_id}`} className={active_style}>
          <td>
            <Link to={`/api/pgn/${run["_id"]}-${task_id}.pgn`}>{task_id}</Link>
          </td>
          <td
            style={{
              textDecoration: task["bad"] ? "line-through" : "",
              backgroundColor: task["bad"] ? "#ffebeb" : "",
            }}
          >
            {workerInfo}
          </td>
          <td>
            os: {task["worker_info"]["uname"]}; ram:{" "}
            {task["worker_info"]["max_memory"]}MiB; compiler: {compiler}{" "}
            {gcc_version}; python: {python_version}; worker: {version}; arch:{" "}
            {ARCH}
          </td>
          <td>{String(task["last_updated"]).split(".")[0]}</td>
          <td>{`${stats["wins"] + stats["losses"] + stats["draws"]} / ${
            task["num_games"]
          }`}</td>
          {pentanomialCell}
          <td>{stats["crashes"] || "-"}</td>
          <td>{stats["time_losses"] || "-"}</td>
          {residualCell}
        </tr>
      );
    });
  }

  return (
    <>
      <h4>
        <Link
          id="tasks-button"
          class="btn btn-sm btn-light border"
          data-bs-toggle="collapse"
          to="#tasks"
          role="button"
          aria-expanded="false"
          aria-controls="tasks"
          onClick={handleToggle}
        >
          {context.showTasks ? "Hide" : "Show"}
        </Link>{" "}
        Tasks {tasksCount}
      </h4>
      {context.showTasks && (
        <section id="tasks" className="overflow-auto collapse show">
          <table className="table table-striped table-sm">
            <thead id="tasks-head" class="sticky-top">
              <tr>
                <th>Idx</th>
                <th>Worker</th>
                <th>Info</th>
                <th>Last Updated</th>
                <th>Played</th>
                {context.tasks.run &&
                !context.tasks.run.results?.pentanomial ? (
                  <React.Fragment>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>Draws</th>
                  </React.Fragment>
                ) : (
                  <th>Pentanomial&nbsp;[0&#8209;2]</th>
                )}
                <th>Crashes</th>
                <th>Time</th>
                {context.tasks.run && !context.tasks.run.spsa && (
                  <th>Residual</th>
                )}
              </tr>
            </thead>

            <tbody>
              <RenderTasks
                run={context.tasks.run}
                approver={context.tasks.approver}
                showTask={context.tasks.show_task}
              />
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}

export default Tasks;
