import { workerName, diffDate, deltaDate } from "../../Utils/Utils";
import { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { Context } from "../../Components/Context/Context";

const fetchMachines = async () => {
  const response = await fetch("http://172.23.43.179/api/machines");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

function Machines(props) {
  const { machinesCount } = props;
  const context = useContext(Context);

  const { data, error, isLoading } = useQuery("machines", fetchMachines, {
    enabled: !context.fetchedMachinesBefore,
  });

  useEffect(() => {
    if (data) {
      context.setMachines(data);
    }
  }, [data, context]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching machines:", error.message);
    }
  }, [error]);

  function handleToggle() {
    
    if (!context.showMachines && !context.fetchedMachinesBefore) {
      context.setFetchedMachinesBefore(true);
    }
    context.setShowMachines(!context.showMachines);
  }

  return (
    <>
      <h4>
        <a
          id="machines-button"
          className="btn btn-sm btn-light border"
          data-bs-toggle="collapse"
          href="#machines"
          role="button"
          aria-expanded="true"
          aria-controls="machines"
          onClick={handleToggle}
        >
          {context.showMachines ? "Hide" : "Show"}
        </a>
        <span id="workers-count"> Workers - {machinesCount || 0} machines</span>
      </h4>
      {context.showMachines && (
        <section id="machines" className="overflow-auto collapse show">
          <table className="table table-striped table-sm">
            <thead className="sticky-top">
              <tr>
                <th>Machine</th>
                <th>Cores</th>
                <th>UUID</th>
                <th>MNps</th>
                <th>RAM</th>
                <th>System</th>
                <th>Compiler</th>
                <th>Python</th>
                <th>Worker</th>
                <th>Running on</th>
                <th>Last updated</th>
              </tr>
            </thead>
            <tbody>
              {context.machines &&
                context.machines.length !== 0 &&
                context.machines?.map((machine, index) => {
                  let workerInfo = machine.worker_info;
                  let gccVersion = workerInfo["gcc_version"]?.join(".");
                  let compiler = workerInfo["compiler"] || "g++";
                  let pythonVersion = workerInfo["python_version"]?.join(".");
                  let version =
                    workerInfo["version"] + "*".repeat(workerInfo["modified"]);
                  let workerName_ = workerName(workerInfo, true);
                  let diffTime = diffDate(machine["last_updated"]);
                  let lastUpdated = deltaDate(diffTime);

                  return (
                    <tr key={index}>
                      <td>{workerInfo["username"]}</td>
                      <td>
                        {workerInfo.country_code && (
                          <div
                            className={`flag flag-${workerInfo.country_code.toLowerCase()}`}
                            style={{ display: "inline-block" }}
                          ></div>
                        )}
                        {workerInfo.concurrency}
                      </td>
                      <td>
                        <a href={"/worker/" + workerName_}>
                          {workerInfo["unique_key"].split("-")[0]}
                        </a>
                      </td>
                      <td>{`${(workerInfo["nps"] / 1000000).toFixed(2)}`}</td>
                      <td>{workerInfo["max_memory"]}</td>
                      <td>{workerInfo["uname"]}</td>
                      <td>{compiler + " " + gccVersion}</td>
                      <td>{pythonVersion}</td>
                      <td>{version}</td>
                      <td>
                        <a
                          href={`/tests/view/${machine["run"]["_id"]}?show_task=${machine["task_id"]}`}
                        >
                          {`${machine["run"]["args"]["new_tag"]}/${machine["task_id"]}`}
                        </a>
                      </td>
                      <td>{lastUpdated}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}

export default Machines;
