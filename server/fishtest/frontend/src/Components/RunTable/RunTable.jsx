import { useState } from "react";
import { diffUrl } from "../../Helper/Helper";
import DeleteButton from "../DeleteButton/DeleteButton";
import { getCookie } from "../../Utils/Utils";
import { Link } from "react-router-dom";
import EloInfo from "../EloInfo/EloInfo";

function RunTable(props) {
  const { tableId, tableName, tableContent, showDelete, alt } = props;
  const cookieJson = getCookie(tableName.toLowerCase() + "_state");
  const cookie = cookieJson ? JSON.parse(cookieJson) : false;
  const [showTable, setShowTable] = useState(cookie);

  function handleToggle() {
    document.cookie =
      tableName.toLowerCase() +
      "_state" +
      "=" +
      !showTable +
      "; max-age=${60 * 60 * 24 * 365 * 10}; SameSite=Lax";
    setShowTable(!showTable);
  }

  return (
    <>
      <h4>
        <a
          id={tableName + "-button"}
          className="btn btn-sm btn-light border"
          data-bs-toggle="collapse"
          href={"#" + tableId}
          role="button"
          aria-expanded="true"
          aria-controls={tableId}
          onClick={handleToggle}
        >
          {showTable ? "Hide" : "Show"}
        </a>
        <span id="workers-count">
          {" " + tableName} - {tableContent?.length || 0} tests
        </span>
      </h4>

      {showTable && (
        <div className="table-responsive-lg">
          <table className="table table-striped table-sm run-table">
            <thead></thead>
            <tbody>
              {tableContent?.map((run, index) => {
                return (
                  <tr key={index}>
                    {showDelete && <DeleteButton run={run} />}

                    <td style={{ width: "6%" }} className="run-date">
                      {new Date(run["start_time"]).toLocaleDateString("en-US")}
                    </td>

                    <td style={{ width: "2%" }} className="run-user">
                      <Link
                        to={`/tests/user/${run["args"]["username"]}`}
                        title="${run['args'].get('username', '')}"
                      >
                        {run.args["username"]?.substring(0, 3)}
                      </Link>
                    </td>

                    {!run["finished"] && (
                      <td
                        className="run-notification"
                        style={{ width: "3em", textAlign: "center" }}
                      >
                        <div
                          id="notification_${run['_id']}"
                          className="notifications"
                          style={{ display: "inline-block", cursor: "pointer" }}
                        ></div>
                      </td>
                    )}

                    <td style={{ width: "16%" }} className="run-view">
                      <Link to={`/tests/view/${run["_id"]}`}>
                        {run["args"]["new_tag"]?.substring(0, 23)}
                      </Link>
                    </td>

                    <td style={{ width: "2%" }} className="run-diff">
                      <a href={diffUrl(run)} target="_blank" rel="noopener"></a>
                    </td>

                    <td style={{ width: "1%" }} className="run-elo">
                      <EloInfo run={run} />
                    </td>

                    <td style={{ width: "13%" }} className="run-live">
                      <span
                        className={
                          run.is_active_sprt_ltc
                            ? "rounded ltc-highlight me-1"
                            : "me-1"
                        }
                      >
                        {run.args.hasOwnProperty("sprt") ? (
                          <a
                            href={`/tests/live_elo/${run._id}`}
                            target="_blank"
                          >
                            sprt
                          </a>
                        ) : (
                          `${run.args.num_games}`
                        )}
                        @ {`${run.args.tc}`} th {`${run.args.threads || 1}`}
                      </span>
                      {!run.finished && (
                        <div>
                          {`cores: ${run.cores || ""} (${run.workers || ""})`}
                        </div>
                      )}
                    </td>

                    <td className="run-info">{run["args"]["info"] || ""}</td>
                  </tr>
                );
              })}

              {(!tableContent || tableContent.length === 0) && (
                <tr>
                  <td> {alt} </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default RunTable;
