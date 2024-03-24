import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import EloInfo from "../../Components/EloInfo/EloInfo";
import Tasks from "../../Components/Tasks/Tasks";

function testStats(props) {
  const { testId } = useParams();
  const [testStats, setTestStats] = useState({});

  const fetchTestStats = async () => {
    const response = await fetch(
      `http://172.23.43.179/api/tests/stats/${testId}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const { data, error, isLoading } = useQuery("testStats", fetchTestStats);

  useEffect(() => {
    if (data) {
      document.title = `Statistics - ${data.page_title} | Stockfish Testing`;
      debugger;
      setTestStats(data);
    }
  }, [data]);

  const MyComponent = (props) => {
    if (!props || JSON.stringify(props.testStats) === "{}") return;
    const {
      run,
      has_spsa,
      has_sprt,
      has_pentanomial,
      alpha,
      beta,
      elo_model,
      elo0,
      elo1,
      batch_size_games,
      draw_ratio,
      pentanomial_draw_ratio,
      drawelo,
      lelo0,
      nelo0,
      belo0,
      score0,
      lelo1,
      nelo1,
      belo1,
      score1,
      elo5,
      elo5_l,
      elo5_u,
      LOS5,
      LLR5,
      LLR5_l,
      LLR5_u,
      LLR5_exact,
      LLR5_alt,
      LLR5_alt2,
      LLR5_normalized,
      LLR5_normalized_alt,
      games5,
      results5,
      pdf5_s,
      results5_DD_prob,
      results5_WL_prob,
      avg5,
      var5,
      skewness5,
      exkurt5,
      avg5_l,
      avg5_u,
      var5_per_game,
      var5_per_game_l,
      var5_per_game_u,
      stdev5_per_game,
      stdev5_per_game_l,
      stdev5_per_game_u,
      var3_l,
      var3_u,
      nelo5,
      nelo5_l,
      nelo5_u,
      LLRjumps5,
      o0,
      o1,
      elo3,
      elo3_l,
      elo3_u,
      LOS3,
      LLR3,
      LLR3_l,
      LLR3_u,
      LLR3_exact,
      LLR3_alt,
      LLR3_alt2,
      LLR3_normalized,
      LLR3_normalized_alt,
      LLR3_be,
      games3,
      results3,
      pdf3_s,
      avg3,
      var3,
      skewness3,
      exkurt3,
      avg3_l,
      avg3_u,
      var5_per_game_3,
      var5_per_game_l_3,
      var5_per_game_u_3,
      stdev3,
      stdev3_l,
      stdev3_u,
      nelo3,
      nelo3_l,
      nelo3_u,
      LLRjumps3,
      ratio,
      var_diff,
      RMS_bias,
      RMS_bias_elo,
    } = props.testStats;

    let content;

    if (has_spsa) {
      content = (
        <h2>
          SPSA tests do no have raw statistics:{" "}
          <a href={`/tests/view/${run._id}`}>{run._id}</a>
        </h2>
      );
    } else {
      content = (
        <div>
          <h2>
            Raw Statistics for test{" "}
            <a href={`/tests/view/${run._id}`}>{run._id}</a>
          </h2>
          <em>
            Unless otherwise specified, all Elo quantities below are logistic.
          </em>
          <div className="row">
            <div className="col-12">
              <h4>Context</h4>
              {run.args && (
                <table className="statistics-table table table-striped table-sm">
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td>Base TC</td>
                      <td>{run.args.tc || "?"}</td>
                    </tr>
                    <tr>
                      <td>Test TC</td>
                      <td>{run.args.new_tc || run.args.tc || "?"}</td>
                    </tr>
                    <tr>
                      <td>Book</td>
                      <td>{run.args.book || "?"}</td>
                    </tr>
                    <tr>
                      <td>Threads</td>
                      <td>{run.args.threads || "?"}</td>
                    </tr>
                    <tr>
                      <td>Base options</td>
                      <td>{run.args.base_options || "?"}</td>
                    </tr>
                    <tr>
                      <td>New options</td>
                      <td>{run.args.new_options || "?"}</td>
                    </tr>
                  </tbody>
                </table>
              )}
              {has_sprt && (
                <React.Fragment>
                  <h4>SPRT parameters</h4>
                  <table className="table table-striped table-sm">
                    <thead></thead>
                    <tbody>
                      <tr>
                        <td>Alpha</td>
                        <td>{alpha}</td>
                      </tr>
                      <tr>
                        <td>Beta</td>
                        <td>{beta}</td>
                      </tr>
                      <tr>
                        <td>Elo0 ({elo_model})</td>
                        <td>{elo0}</td>
                      </tr>
                      <tr>
                        <td>Elo1 ({elo_model})</td>
                        <td>{elo1}</td>
                      </tr>
                      <tr>
                        <td>Batch size (games) </td>
                        <td>{batch_size_games}</td>
                      </tr>
                    </tbody>
                  </table>
                </React.Fragment>
              )}
              <h4>Draws</h4>
              <table className="table table-striped table-sm">
                <thead></thead>
                <tbody>
                  <tr>
                    <td>Draw ratio</td>
                    <td>{draw_ratio.toFixed(5)}</td>
                  </tr>
                  {has_pentanomial && (
                    <tr>
                      <td>Pentanomial draw ratio</td>
                      <td>{pentanomial_draw_ratio.toFixed(5)}</td>
                    </tr>
                  )}
                  <tr>
                    <td>DrawElo (BayesElo)</td>
                    <td>{drawelo.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              {has_sprt && (
                <React.Fragment>
                  <h4>SPRT bounds</h4>
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Logistic</th>
                        <th>Normalized</th>
                        <th>BayesElo</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>H0</td>
                        <td>{lelo0.toFixed(3)}</td>
                        <td>{nelo0.toFixed(3)}</td>
                        <td>{belo0.toFixed(3)}</td>
                        <td>{score0.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>H1</td>
                        <td>{lelo1.toFixed(3)}</td>
                        <td>{nelo1.toFixed(3)}</td>
                        <td>{belo1.toFixed(3)}</td>
                        <td>{score1.toFixed(5)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <em>
                    Note: normalized Elo is inversely proportional to the square
                    root of the number of games it takes on average to detect a
                    given strength difference with a given level of
                    significance. It is given by
                    logistic_elo/(2*standard_deviation_per_game). In other words
                    if the draw ratio is zero and Elo differences are small then
                    normalized Elo and logistic Elo coincide.
                  </em>
                </React.Fragment>
              )}
              {has_pentanomial && (
                <React.Fragment>
                  <h4>Pentanomial statistics</h4>
                  <h5>Basic statistics</h5>
                  <table className="table table-striped table-sm">
                    <thead></thead>
                    <tbody>
                      <tr>
                        <td>Elo</td>
                        <td>{`${elo5.toFixed(4)} [${elo5_l.toFixed(
                          4
                        )}, ${elo5_u.toFixed(4)}]`}</td>
                      </tr>
                      <tr>
                        <td>LOS(1-p)</td>
                        <td>{LOS5.toFixed(5)}</td>
                      </tr>
                      {has_sprt && (
                        <tr>
                          <td>LLR</td>
                          <td>{`${LLR5.toFixed(4)} [${LLR5_l.toFixed(
                            4
                          )}, ${LLR5_u.toFixed(4)}]`}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {has_sprt && (
                    <React.Fragment>
                      <h5>Generalized Log Likelihood Ratio</h5>
                      <table className="table table-striped table-sm">
                        <thead></thead>
                        <tbody>
                          <tr>
                            <td>Logistic (exact)</td>
                            <td>{LLR5_exact.toFixed(5)}</td>
                          </tr>
                          <tr>
                            <td>Logistic (alt)</td>
                            <td>{LLR5_alt.toFixed(5)}</td>
                          </tr>
                          <tr>
                            <td>Logistic (alt2)</td>
                            <td>{LLR5_alt2.toFixed(5)}</td>
                          </tr>
                          <tr>
                            <td>Normalized (exact)</td>
                            <td>{LLR5_normalized.toFixed(5)}</td>
                          </tr>
                          <tr>
                            <td>Normalized (alt)</td>
                            <td>{LLR5_normalized_alt.toFixed(5)}</td>
                          </tr>
                        </tbody>
                      </table>
                      <em>
                        Note: The quantities labeled alt and alt2 are various
                        approximations for the exact quantities. Simulations
                        indicate that the exact quantities perform better under
                        extreme conditions.
                      </em>
                    </React.Fragment>
                  )}
                  <h5>Auxiliary statistics</h5>
                  <table className="table table-striped table-sm">
                    <thead></thead>
                    <tbody>
                      <tr>
                        <td>Games</td>
                        <td>{games5}</td>
                      </tr>
                      <tr>
                        <td>Results [0-2]</td>
                        <td>{results5}</td>
                      </tr>
                      <tr>
                        <td>Distribution</td>
                        <td>{pdf5_s}</td>
                      </tr>
                      <tr>
                        <td>(DD,WL) split</td>
                        <td>{`(${results5_DD_prob.toFixed(
                          5
                        )}, ${results5_WL_prob.toFixed(5)})`}</td>
                      </tr>
                      <tr>
                        <td>Expected value</td>
                        <td>{avg5.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>Variance</td>
                        <td>{var5.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>Skewness</td>
                        <td>{skewness5.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>Excess kurtosis</td>
                        <td>{exkurt5.toFixed(5)}</td>
                      </tr>
                      {has_sprt && (
                        <tr>
                          <td>Score</td>
                          <td>{avg5.toFixed(5)}</td>
                        </tr>
                      )}
                      <tr>
                        <td>Variance/game</td>
                        <td>{`${var5_per_game.toFixed(
                          5
                        )} [${var5_per_game_l.toFixed(
                          5
                        )}, ${var5_per_game_u.toFixed(5)}]`}</td>
                      </tr>
                      <tr>
                        <td>Stdev/game</td>
                        <td>{`${stdev5_per_game.toFixed(
                          5
                        )} [${stdev5_per_game_l.toFixed(
                          5
                        )}, ${stdev5_per_game_u.toFixed(5)}]`}</td>
                      </tr>
                      {has_sprt && (
                        <tr>
                          <td>Normalized Elo</td>
                          <td>{nelo5.toFixed(2)}</td>
                        </tr>
                      )}
                      {has_sprt && (
                        <React.Fragment>
                          <tr>
                            <td>LLR jumps [0-2]</td>
                            <td>{LLRjumps5}</td>
                          </tr>
                          <tr>
                            <td>Expected overshoot [H0,H1]</td>
                            <td>{`[${o0.toFixed(5)}, ${o1.toFixed(5)}]`}</td>
                          </tr>
                        </React.Fragment>
                      )}
                    </tbody>
                  </table>
                </React.Fragment>
              )}
              <h4>Trinomial statistics</h4>
              {has_pentanomial && (
                <em>
                  Note: The following quantities are computed using the
                  incorrect trinomial model and so they should be taken with a
                  grain of salt. The trinomial quantities are listed because
                  they serve as a sanity check for the correct pentanomial
                  quantities and moreover it is possible to extract some
                  genuinely interesting information from the comparison between
                  the two.
                </em>
              )}
              <h5>Basic statistics</h5>
              <table className="table table-striped table-sm">
                <thead></thead>
                <tbody>
                  <tr>
                    <td>Elo</td>
                    <td>{`${elo3.toFixed(4)} [${elo3_l.toFixed(
                      4
                    )}, ${elo3_u.toFixed(4)}]`}</td>
                  </tr>
                  <tr>
                    <td>LOS(1-p)</td>
                    <td>{LOS3.toFixed(5)}</td>
                  </tr>
                  {has_sprt && (
                    <tr>
                      <td>LLR</td>
                      <td>{`${LLR3.toFixed(4)} [${LLR3_l.toFixed(
                        4
                      )}, ${LLR3_u.toFixed(4)}]`}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {has_sprt && (
                <React.Fragment>
                  <h5>Generalized Log Likelihood Ratio</h5>
                  <table className="table table-striped table-sm">
                    <thead></thead>
                    <tbody>
                      <tr>
                        <td>Logistic (exact)</td>
                        <td>{LLR3_exact.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>Logistic (alt)</td>
                        <td>{LLR3_alt.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>Logistic (alt2)</td>
                        <td>{LLR3_alt2.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>Normalized (exact)</td>
                        <td>{LLR3_normalized.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>Normalized (alt)</td>
                        <td>{LLR3_normalized_alt.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>BayesElo</td>
                        <td>{LLR3_be.toFixed(5)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <em>
                    Note: BayesElo is the LLR as computed using the BayesElo
                    model. It is not clear how to generalize it to the
                    pentanomial case.
                  </em>
                </React.Fragment>
              )}
              <h5>Auxiliary statistics</h5>
              <table className="table table-striped table-sm">
                <thead></thead>
                <tbody>
                  <tr>
                    <td>Games</td>
                    <td>{games3}</td>
                  </tr>
                  <tr>
                    <td>Results [losses, draws, wins]</td>
                    <td>{results3}</td>
                  </tr>
                  <tr>
                    <td>
                      Distribution {"{loss ratio, draw ratio, win ratio)}"}
                    </td>
                    <td>{pdf3_s}</td>
                  </tr>
                  <tr>
                    <td>Expected value</td>
                    <td>{avg3.toFixed(5)}</td>
                  </tr>
                  <tr>
                    <td>Variance</td>
                    <td>{var3.toFixed(5)}</td>
                  </tr>
                  <tr>
                    <td>Skewness</td>
                    <td>{skewness3.toFixed(5)}</td>
                  </tr>
                  <tr>
                    <td>Excess kurtosis</td>
                    <td>{exkurt3.toFixed(5)}</td>
                  </tr>
                  {has_sprt && (
                    <tr>
                      <td>Score</td>
                      <td>{avg3.toFixed(5)}</td>
                    </tr>
                  )}
                  <tr>
                    <td>Variance/game</td>
                    <td>{`${var3.toFixed(5)} [${var3_l.toFixed(
                      5
                    )}, ${var3_u.toFixed(5)}]`}</td>
                  </tr>
                  <tr>
                    <td>Stdev/game</td>
                    <td>{`${stdev3.toFixed(5)} [${stdev3_l.toFixed(
                      5
                    )}, ${stdev3_u.toFixed(5)}]`}</td>
                  </tr>
                  {has_sprt && (
                    <tr>
                      <td>Normalized Elo</td>
                      <td>{nelo3.toFixed(2)}</td>
                    </tr>
                  )}
                  {has_sprt && (
                    <React.Fragment>
                      <tr>
                        <td>LLR jumps [loss, draw, win]</td>
                        <td>{LLRjumps3}</td>
                      </tr>
                    </React.Fragment>
                  )}
                </tbody>
              </table>
              {has_pentanomial && (
                <React.Fragment>
                  <h4>Comparison</h4>
                  <table className="table table-striped table-sm">
                    <thead></thead>
                    <tbody>
                      <tr>
                        <td>Variance ratio (pentanomial/trinomial)</td>
                        <td>{ratio.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>Variance difference (trinomial-pentanomial)</td>
                        <td>{var_diff.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>RMS bias</td>
                        <td>{RMS_bias.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td>RMS bias (Elo)</td>
                        <td>{RMS_bias_elo.toFixed(3)}</td>
                      </tr>
                    </tbody>
                  </table>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      );
    }

    return <div>{content}</div>;
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching machines:", error.message);
    }
  }, [error]);

  if (!testStats) return;
  return <MyComponent testStats={testStats} />;
}

export default testStats;
