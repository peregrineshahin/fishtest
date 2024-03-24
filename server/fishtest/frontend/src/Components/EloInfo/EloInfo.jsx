import React from "react";
import { parseStyle } from "../../Utils/Utils";
import { Link } from "react-router-dom";

function EloInfo(props) {
  const { run } = props;
  const style = run.results_info?.style
    ? parseStyle(run.results_info.style)
    : null;
  let classes = "rounded elo-results results-pre";
  const tc = run.args?.tc;
  const new_tc = run.args?.new_tc || tc;
  if (tc !== new_tc) {
    classes += " time-odds";
  }

  return (
    <Link to={`/tests/live_elo/${run["_id"]}`}>
      <pre className={classes} style={style}>
        {run.results_info?.info.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </pre>
    </Link>
  );
}

export default EloInfo;
