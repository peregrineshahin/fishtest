import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import LiveEloCharts from "../../Components/LiveEloCharts/LiveEloCharts";

function LiveCharts() {
  const { testId } = useParams();

  const fetchElo = async () => {
    const response = await fetch(`http://172.23.43.179/api/get_elo/${testId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const { data, isLoading, isError } = useQuery(
    ["data", testId],
    () => fetchElo(testId),
    {
      refetchInterval: 20000,
    }
  );

  useEffect(() => {
    if (data) {
      if (data.args.sprt.state) return;
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      console.log("Network error occurred");
    }
  }, [isError]);

  return (
    <React.Fragment>
      <h2>
        Live Elo for SPRT test{" "}
        <Link to={"/tests/view/" + testId}>{testId}</Link>
      </h2>

      <div className="row">
        <div className="col-12 d-flex justify-content-center align-items-center flex-column flex-sm-row">
          {data && <LiveEloCharts data={data} />}
        </div>
        <h4>Details</h4>
        {data && (
          <div className="col-12 table-responsive-lg">
            <table
              id="data"
              className="details-table table table-striped table-sm"
            >
              <thead></thead>
              <tbody>
                <tr>
                  <td>Commit</td>
                  <td>
                    <Link
                      to={`${data.args.tests_repo}/compare/${data.args.resolved_base}...${data.args.resolved_new}`}
                      id="commit"
                      target="_blank"
                      rel="noopener noreferrer"
                    >{`${data.args.new_tag} (${data.args.msg_new})`}</Link>
                  </td>
                </tr>
                <tr>
                  <td>Info</td>
                  <td id="info">{data.args.info}</td>
                </tr>
                <tr>
                  <td>Submitter</td>
                  <td>
                    <Link
                      to={`/tests/user/${data.args.username}`}
                      id="username"
                    >
                      {data.args.username}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>TC</td>
                  <td id="tc">{data.args.tc}</td>
                </tr>
                <tr>
                  <td>SPRT</td>
                  <td id="sprt">
                    {`elo0: ${data.args.sprt.elo1?.toFixed(2)} 
                      alpha: ${data.args.sprt.alpha?.toFixed(2)} 
                      elo1: ${data.args.sprt.elo1?.toFixed(2)} 
                      beta: ${data.args.sprt.beta?.toFixed(2)}
                      (${data.args.sprt.elo_model || ""})
                    `}
                  </td>
                </tr>
                <tr>
                  <td>LLR</td>
                  <td id="LLR">
                    {`
                  ${data.elo.LLR?.toFixed(2) || 0}
                  [${data.elo.a?.toFixed(2) || 0},${
                      data.elo.b?.toFixed(2) || 0
                    }]
                  ${data.args.sprt.state ? `(${data.args.sprt.state})` : ""}
                `}
                  </td>
                </tr>
                <tr>
                  <td>Elo</td>
                  <td id="elo">
                    {` ${data.elo.elo.toFixed(2)}
                    [${data.elo.ci[0].toFixed(2)},${data.elo.ci[1].toFixed(2)}]
                    (${100 * (1 - 0.05).toFixed(2)}%) `}
                  </td>
                </tr>
                <tr>
                  <td>LOS</td>
                  <td id="LOS">{`${(100 * data.elo.LOS).toFixed(1)}%`}</td>
                </tr>
                <tr>
                  <td>Games</td>
                  <td id="games">
                    {data.results.wins +
                      data.results.losses +
                      data.results.draws}
                  </td>
                </tr>
                <tr>
                  <td>Pentanomial</td>
                  <td id="pentanomial">
                    [{(data.results?.pentanomial || []).slice(0, 5).join(", ")}]
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default LiveCharts;
