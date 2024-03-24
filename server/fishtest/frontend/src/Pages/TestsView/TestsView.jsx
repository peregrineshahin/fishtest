import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import EloInfo from "../../Components/EloInfo/EloInfo";
import Tasks from "../../Components/Tasks/Tasks";

function TestsView(props) {
  const { testId } = useParams();
  const [testView, setTestView] = useState({});

  const fetchTestView = async () => {
    const response = await fetch(
      `http://172.23.43.179/api/tests/view/${testId}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const { data, error, isLoading } = useQuery("testView", fetchTestView);

  useEffect(() => {
    if (data) {
      document.title = `${data.page_title} | Stockfish Testing`;

      setTestView(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching tests view:", error.message);
    }
  }, [error]);

  const SpecialRows = ({ runArgs, approver }) => {
    if (!runArgs) return null;
    return runArgs.map((arg) => {
      if (arg[2].length === 0) {
        if (arg[0] === "username") {
          return (
            <tr key={arg[0]}>
              <td>{arg[0]}</td>
              <td>
                <Link to={`/tests/user/${arg[1]}`}>{arg[1]}</Link>
                {approver === true && (
                  <span>
                    (<Link to={`/user/${arg[1]}`}>user admin</Link>)
                  </span>
                )}
              </td>
            </tr>
          );
        } else if (arg[0] === "spsa") {
          return (
            <tr key={arg[0]}>
              <td>{arg[0]}</td>
              <td>
                {arg[1][0]}
                <br />
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>param</th>
                      <th>value</th>
                      <th>start</th>
                      <th>min</th>
                      <th>max</th>
                      <th>c</th>
                      <th>c_end</th>
                      <th>r</th>
                      <th>r_end</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arg[1].slice(1).map((row, index) => (
                      <tr key={index} className="spsa-param-row">
                        {row.map((element, idx) => (
                          <td key={idx}>{element}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          );
        } else if (arg[0] === "resolved_new" || arg[0] === "resolved_base") {
          return (
            <tr key={arg[0]}>
              <td>{arg[0]}</td>
              <td>{arg[1].slice(0, 10)}</td>
            </tr>
          );
        } else if (arg[0] === "rescheduled_from") {
          return (
            <tr key={arg[0]}>
              <td>{arg[0]}</td>
              <td>
                <Link to={`/tests/view/${arg[1]}`}>{arg[1]}</Link>
              </td>
            </tr>
          );
        } else if (arg[0] === "itp") {
          return (
            <tr key={arg[0]}>
              <td>{arg[0]}</td>
              <td>{parseFloat(arg[1]).toFixed(2)}</td>
            </tr>
          );
        } else {
          return (
            <tr key={arg[0]}>
              <td>{arg[0]}</td>
              <td className={arg[0] === "info" ? "run-info" : ""}>
                {arg[1].split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </td>
            </tr>
          );
        }
      } else {
        return (
          <tr key={arg[0]}>
            <td>{arg[0]}</td>
            <td>
              <Link to={arg[2]} target="_blank" rel="noopener">
                {arg[1]}
              </Link>
            </td>
          </tr>
        );
      }
    });
  };

  const Actions = ({ canModifyRun, run, sameUser }) => {
    if (!run) return;
    return (
      <div className="row g-2 mb-2">
        {canModifyRun === true && !run.finished && (
          <div className="col-12 col-sm">
            <form
              action="/tests/stop"
              method="POST"
              onSubmit={() => handleStopDeleteButton(run._id)}
            >
              <input type="hidden" name="run-id" value={run._id} />
              <button type="submit" className="btn btn-danger w-100">
                Stop
              </button>
            </form>
          </div>
        )}

        {canModifyRun === true && !run.approved && !sameUser && (
          <div className="col-12 col-sm">
            <form action="/tests/approve" method="POST">
              <input type="hidden" name="run-id" value={run._id} />
              <button
                type="submit"
                id="approve-btn"
                className={`btn ${
                  run?.base_same_as_master || run.args.spsa
                    ? "btn-success"
                    : "btn-warning"
                } w-100`}
              >
                Approve
              </button>
            </form>
          </div>
        )}

        {run.finished && (
          <div className="col-12 col-sm">
            <form action="/tests/purge" method="POST">
              <input type="hidden" name="run-id" value={run._id} />
              <button type="submit" className="btn btn-danger w-100">
                Purge
              </button>
            </form>
          </div>
        )}

        <div className="col-12 col-sm">
          <a
            className="btn btn-light border w-100"
            href={`/tests/run?id=${run._id}`}
          >
            Reschedule
          </a>
        </div>
      </div>
    );
  };

  const OtherActions = ({ run, canModifyRun, sameUser, chi2 }) => {
    if (!run) return;

    return (
      <React.Fragment>
        {run?.base_same_as_master !== null && (
          <>
            {run?.base_same_as_master ? (
              <div id="master-diff" className="alert alert-success">
                Base branch same as Stockfish master
              </div>
            ) : (
              !run?.args?.spsa && (
                <div id="master-diff" className="alert alert-danger mb-2">
                  Base branch not same as Stockfish master
                </div>
              )
            )}
          </>
        )}

        {!run.args?.spsa &&
          run.args?.base_signature === run.args?.new_signature && (
            <div className="alert alert-info mb-2">
              Note: The new signature is the same as base signature.
            </div>
          )}

        {!run.args?.spsa && !run?.base_same_as_master && (
          <div className="alert alert-warning">
            <a
              className="alert-link"
              href={h.master_diff_url(run)}
              target="_blank"
              rel="noopener"
            >
              Master diff
            </a>
          </div>
        )}

        <hr />

        {canModifyRun === true && (
          <form className="form" action="/tests/modify" method="POST">
            <div className="mb-3">
              <label className="form-label" htmlFor="modify-num-games">
                Number of games
              </label>
              <input
                type="number"
                className="form-control"
                name="num-games"
                id="modify-num-games"
                min="0"
                step="1000"
                value={run.args.num_games}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="modify-priority">
                Priority (higher is more urgent)
              </label>
              <input
                type="number"
                className="form-control"
                name="priority"
                id="modify-priority"
                value={run.args.priority}
              />
            </div>

            <label className="form-label" htmlFor="modify-throughput">
              Throughput
            </label>
            <div className="mb-3 input-group">
              <input
                type="number"
                className="form-control"
                name="throughput"
                id="modify-throughput"
                min="0"
                value={run.args.throughput || 1000}
              />
              <span className="input-group-text">%</span>
            </div>

            {sameUser && (
              <div className="mb-3">
                <label htmlFor="info" className="form-label">
                  Info
                </label>
                <textarea
                  id="modify-info"
                  name="info"
                  placeholder="Defaults to submitted message."
                  className="form-control"
                  rows="4"
                  style={{ height: "149px" }}
                ></textarea>
              </div>
            )}

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="auto-purge"
                name="auto_purge"
                checked={run.args.auto_purge}
              />
              <label className="form-check-label" htmlFor="auto-purge">
                Auto-purge
              </label>
            </div>

            <input type="hidden" name="run" value={run._id} />
            <button
              type="submit"
              className="btn btn-primary col-12 col-md-auto"
            >
              Modify
            </button>
          </form>
        )}

        {!run.args?.spsa && (
          <>
            <hr />

            <h4>Stats</h4>
            <table className="table table-striped table-sm">
              <thead></thead>
              <tbody>
                <tr>
                  <td>chi^2</td>
                  <td>{`${
                    !isNaN(chi2.chi2) && chi2.parseFloat(chi2).toFixed(2)
                  }`}</td>
                </tr>
                <tr>
                  <td>dof</td>
                  <td>{chi2.dof}</td>
                </tr>
                <tr>
                  <td>p-value</td>
                  <td>{`${(chi2.p * 100).toFixed(2)}%`}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        <hr />

        <h4>Time</h4>
        <table className="table table-striped table-sm">
          <thead></thead>
          <tbody>
            <tr>
              <td>start time</td>
              <td>{run.start_time}</td>
            </tr>
            <tr>
              <td>last updated</td>
              <td>{run.last_updated}</td>
            </tr>
          </tbody>
        </table>

        <hr />

        {!run.finished && (
          <>
            <h4>Notifications</h4>
            <button
              id={`follow_button_${run._id}`}
              className="btn btn-primary col-12 col-md-auto"
              onClick={() => handleFollowButton(run._id)}
              style={{ display: "none", marginTop: "0.2em" }}
            ></button>
            <hr style={{ visibility: "hidden" }} />
          </>
        )}
      </React.Fragment>
    );
  };

  if (!testView?.run) return;
  return (
    <div id="enclosure">
      <h2>
        <span>{testView?.page_title}</span>
        <Link to="{h.diff_url(run)}" target="_blank" rel="noopener">
          {" "}diff
        </Link>
      </h2>
      <div className="elo-results-top">
        {testView?.run && <EloInfo run={testView?.run} />}
      </div>
      <div className="row">
        <div className="col-12 col-lg-9">
          <div id="diff-section">
            <h4>
              <button
                id="diff-toggle"
                className="btn btn-sm btn-light border mb-2"
              >
                Show
              </button>
              {" "}Diff
              <span id="diff-num-comments">(0 comments){" "}</span>
              <Link
                to="${h.diff_url(run)}"
                className="btn btn-primary bg-light-primary border-0 mb-2"
                target="_blank"
                rel="noopener"
              >
                View on GitHub
              </Link>
              <Link
                // to="javascript:"
                id="copy-diff"
                className="btn btn-secondary bg-light-secondary border-0 mb-2"
                style={{ display: "none" }}
              >
                Copy apply-diff command
              </Link>
              <span
                className="text-success copied text-nowrap"
                style={{ display: "none" }}
              >
                Copied!
              </span>
            </h4>
            <pre id="diff-contents" style={{ display: "none" }}>
              <code className="diff"></code>
            </pre>
          </div>
          <div>
            <h4 style={{ marginTop: "9px" }}>Details</h4>
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead></thead>
                <tbody>
                  <SpecialRows
                    runArgs={testView?.run_args}
                    approver={testView?.approver}
                  />
                  <tr>
                    <td>events</td>
                    <td>
                      <Link to={"/actions?run_id=" + testView.run._id}>
                        /actions?run_id={testView.run._id}
                      </Link>
                    </td>
                  </tr>
                  {testView.run && !testView.run.args?.spsa && (
                    <tr>
                      <td>raw statistics</td>
                      <td>
                        <Link to={"/tests/stats/" + testView.run._id}>
                          /tests/stats/{testView.run._id}
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-3">
          <h4>Actions</h4>
          {
            <Actions
              canModifyRun={testView.can_modify_run}
              run={testView.run}
              sameUser={testView.same_user}
            />
          }

          {
            <OtherActions
              canModifyRun={testView.can_modify_run}
              run={testView.run}
              sameUser={testView.same_ser}
              chi2={testView.chi2}
            />
          }
        </div>
      </div>
      {testView.run.args.spsa && (
        <React.Fragment>
          <div id="spsa_preload" className="col-lg-3">
            <div className="pt-1 text-center">Loading graph...</div>
          </div>
          <div id="chart_toolbar">
            Gaussian Kernel Smoother&nbsp;&nbsp;
            <div className="btn-group">
              <button id="btn_smooth_plus" className="btn">
                &nbsp;&nbsp;&nbsp;+&nbsp;&nbsp;&nbsp;
              </button>
              <button id="btn_smooth_minus" className="btn">
                &nbsp;&nbsp;&nbsp;−&nbsp;&nbsp;&nbsp;
              </button>
            </div>
            <div className="btn-group">
              <button
                id="btn_view_individual"
                type="button"
                className="btn btn-default dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                View Individual Parameter<span className="caret"></span>
              </button>
              <ul
                className="dropdown-menu"
                role="menu"
                id="dropdown_individual"
              ></ul>
            </div>
            <button id="btn_view_all" className="btn">
              View All
            </button>
          </div>
          <div className="overflow-auto">
            <div id="spsa_history_plot"></div>
          </div>
        </React.Fragment>
      )}

      {testView.run._id && (
        <Tasks runId={testView.run._id} tasksCount={testView.totals}  tasksShown={testView.tasks_shown}/>
      )}
    </div>
  );
}

export default TestsView;
