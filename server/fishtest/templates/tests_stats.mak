<%inherit file="base.mak"/>


<div>
  % if has_spsa:
    <h2>SPSA tests do no have raw statistics: <a href="/tests/view/${str(run['_id'])}">${str(run['_id'])}</a></h2>
  % else:  ## not has_spsa
    <h2>Raw Statistics for test <a href="/tests/view/${str(run['_id'])}">${str(run['_id'])}</a></h2>
    <em>Unless otherwise specified, all Elo quantities below are logistic.</em>
    <div class="row">
      <div class="col-12">
        <h4>Context</h4>
        <table class="statistics-table table table-striped table-sm">
          <thead></thead>
          <tbody>
            <tr><td>Base TC</td><td>${run['args'].get('tc','?')}</td></tr>
            <tr><td>Test TC</td><td>${run['args'].get('new_tc',run['args'].get('tc','?'))}</td></tr>
            <tr><td>Book</td><td>${run['args'].get('book','?')}</td></tr>
            <tr><td>Threads</td><td>${run['args'].get('threads','?')}</td></tr>
            <tr><td>Base options</td><td>${run['args'].get('base_options','?')}</td></tr>
            <tr><td>New options</td><td>${run['args'].get('new_options','?')}</td></tr>
          </tbody>
        </table>
        % if has_sprt:
          <h4>SPRT parameters</h4>
          <table class="table table-striped table-sm">
            <thead></thead>
            <tbody>
              <tr><td>Alpha</td><td>${alpha}</td></tr>
              <tr><td>Beta</td><td>${beta}</td></tr>
              <tr><td>Elo0 (${elo_model})</td><td>${elo0}</td></tr>
              <tr><td>Elo1 (${elo_model})</td><td>${elo1}</td></tr>
              <tr><td>Batch size (games) </td><td>${batch_size_games}</td></tr>
            </tbody>
          </table>
        % endif  ## has_sprt
        <h4>Draws</h4>
        <table class="table table-striped table-sm">
          <thead></thead>
          <tbody>
            <tr><td>Draw ratio</td><td>${f"{draw_ratio:.5f}"}</td></tr>
            % if has_pentanomial:
              <tr><td>Pentanomial draw ratio</td><td>${f"{pentanomial_draw_ratio:.5f}"}</td></tr>
            % endif
            <tr><td>DrawElo (BayesElo)</td><td>${f"{drawelo:.2f}"}</td></tr>
          </tbody>
        </table>
        % if has_sprt:
          <h4>SPRT bounds</h4>
          <table class="table table-striped table-sm">
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
                <td>${f"{lelo0:.3f}"}</td>
                <td>${f"{nelo0:.3f}"}</td>
                <td>${f"{belo0:.3f}"}</td>
                <td>${f"{score0:.5f}"}</td>
              </tr>
              <tr>
                <td>H1</td>
                <td>${f"{lelo1:.3f}"}</td>
                <td>${f"{nelo1:.3f}"}</td>
                <td>${f"{belo1:.3f}"}</td>
                <td>${f"{score1:.5f}"}</td>
              </tr>
            </tbody>
          </table>
          <em>
          Note: normalized Elo is inversely proportional to the square root of the number of games it takes on average to
          detect a given strength difference with a given level of significance. It is given by
          logistic_elo/(2*standard_deviation_per_game). In other words if the draw ratio is zero and Elo differences are small
          then normalized Elo and logistic Elo coincide.
          </em>
        % endif  ## has_sprt
        % if has_pentanomial:
          <h4>Pentanomial statistics</h4>
          <h5>Basic statistics</h5>
          <table class="table table-striped table-sm">
            <thead></thead>
            <tbody>
              <tr><td>Elo</td><td>${f"{elo5:.4f} [{elo5_l:.4f}, {elo5_u:.4f}]"}</td></tr>
              <tr><td>LOS(1-p)</td><td>${f"{LOS5:.5f}"}</td></tr>
              % if has_sprt:
                <tr><td>LLR</td><td>${f"{LLR5:.4f} [{LLR5_l:.4f}, {LLR5_u:.4f}]"}</td></tr>
              % endif  ## has_sprt
            </tbody>
          </table>
          % if has_sprt:
            <h5>Generalized Log Likelihood Ratio</h5>
            <table class="table table-striped table-sm">
              <thead></thead>
              <tbody>
                <tr><td>Logistic (exact)</td><td>${f"{LLR5_exact:.5f}"}</td></tr>
                <tr><td>Logistic (alt)</td><td>${f"{LLR5_alt:.5f}"}</td></tr>
                <tr><td>Logistic (alt2)</td><td>${f"{LLR5_alt2:.5f}"}</td></tr>
                <tr><td>Normalized (exact)</td><td>${f"{LLR5_normalized:.5f}"}</td></tr>
                <tr><td>Normalized (alt)</td><td>${f"{LLR5_normalized_alt:.5f}"}</td></tr>              
              </tbody>
            </table>
            <em>
            Note: The quantities labeled alt and alt2 are various approximations for the
            exact quantities. Simulations indicate that the exact quantities perform
            better under extreme conditions.
            </em>
          % endif ## has_sprt
          <h5>Auxilliary statistics</h5>
          <table class="table table-striped table-sm">
            <thead></thead>
            <tbody>
              <tr><td>Games</td><td>${int(games5)}</td></tr>
              <tr><td>Results [0-2]</td><td>${results5}</td></tr>
              <tr><td>Distribution</td><td>${pdf5_s}</td></tr>
              <tr><td>(DD,WL) split</td><td>${f"({results5_DD_prob:.5f}, {results5_WL_prob:.5f})"}</td></tr>
              <tr><td>Expected value</td><td>${f"{avg5:.5f}"}</td></tr>
              <tr><td>Variance</td><td>${f"{var5:.5f}"}</td></tr>
              <tr><td>Skewness</td><td>${f"{skewness5:.5f}"}</td></tr>
              <tr><td>Excess kurtosis</td><td>${f"{exkurt5:.5f}"}</td></tr>
              % if has_sprt:
                <tr><td>Score</td><td>${f"{avg5:.5f}"}</td></tr>
              % else:
                <tr><td>Score</td><td>${f"{avg5:.5f} [{avg5_l:.5f}, {avg5_u:.5f}]"}</td></tr>
              % endif ## has_sprt
              <tr><td>Variance/game</td><td>${f"{var5_per_game:.5f} [{var5_per_game_l:.5f}, {var5_per_game_u:.5f}]"}</td></tr>
              <tr><td>Stdev/game</td><td>${f"{stdev5_per_game:.5f} [{stdev5_per_game_l:.5f}, {stdev5_per_game_u:.5f}]"}</td></tr>
              % if has_sprt:
                <tr><td>Normalized Elo</td><td>${f"{nelo5:.2f}"}</td></tr>
              % else:
                <tr><td>Normalized Elo</td><td>${f"{nelo5:.2f} [{nelo5_l:.2f}, {nelo5_u:.2f}]"}</td></tr>
              % endif  ## has_sprt
              % if has_sprt:
                <tr><td>LLR jumps [0-2]</td><td>${LLRjumps5}</td></tr>
                <tr><td>Expected overshoot [H0,H1]</td><td>${f"[{o0:.5f}, {o1:.5f}]"}</td></tr>
              % endif  ## has_sprt
            </tbody>
          </table>
        % endif  ## has_pentanomial
        <h4>Trinomial statistics</h4>
        % if has_pentanomial:
          <em>
          Note: The following quantities are computed using the incorrect trinomial model and so they should
          be taken with a grain of salt. The trinomial quantities are listed because they serve as a sanity check
          for the correct pentanomial quantities and moreover it is possible to extract some genuinely
          interesting information from the comparison between the two.
          </em>
        % endif  ## has_pentanomial
        <h5>Basic statistics</h5>
        <table class="table table-striped table-sm">
          <thead></thead>
          <tbody>
            <tr><td>Elo</td><td>${f"{elo3:.4f} [{elo3_l:.4f}, {elo3_u:.4f}]"}</td></tr>
            <tr><td>LOS(1-p)</td><td>${f"{LOS3:.5f}"}</td></tr>
            % if has_sprt:
              <tr><td>LLR</td><td>${f"{LLR3:.4f} [{LLR3_l:.4f}, {LLR3_u:.4f}]"}</td></tr>
            % endif  ## has_sprt
          </tbody>
        </table>
        % if has_sprt:
          <h5>Generalized Log Likelihood Ratio</h5>
          <table class="table table-striped table-sm">
            <thead></thead>
            <tbody>
              <tr><td>Logistic (exact)</td><td>${f"{LLR3_exact:.5f}"}</td></tr>
              <tr><td>Logistic (alt)</td><td>${f"{LLR3_alt:.5f}"}</td></tr>
              <tr><td>Logistic (alt2)</td><td>${f"{LLR3_alt2:.5f}"}</td></tr>
              <tr><td>Normalized (exact)</td><td>${f"{LLR3_normalized:.5f}"}</td></tr>
              <tr><td>Normalized (alt)</td><td>${f"{LLR3_normalized_alt:.5f}"}</td></tr>
              <tr><td>BayesElo</td><td>${f"{LLR3_be:.5f}"}</td></tr>
            </tbody>
          </table>
          <em>
          Note: BayesElo is the LLR as computed using the BayesElo model. It is not clear how to
          generalize it to the pentanomial case.
          </em>
        % endif  ## has_sprt
        <h5>Auxilliary statistics</h5>
        <table class="table table-striped table-sm">
          <thead></thead>
          <tbody>
            <tr><td>Games</td><td>${int(games3)}</td></tr>
            <tr><td>Results [losses, draws, wins]</td><td>${results3}</td></tr>
            <tr><td>Distribution {loss ratio, draw ratio, win ratio}</td><td>${pdf3_s}</td></tr>
            <tr><td>Expected value</td><td>${f"{avg3:.5f}"}</td></tr>
            <tr><td>Variance</td><td>${f"{var3:.5f}"}</td></tr>
            <tr><td>Skewness</td><td>${f"{skewness3:.5f}"}</td></tr>
            <tr><td>Excess kurtosis</td><td>${f"{exkurt3:.5f}"}</td></tr>
            % if has_sprt:
              <tr><td>Score</td><td>${f"{avg3:.5f}"}</td></tr>
            % else:
              <tr><td>Score</td><td>${f"{avg3:.5f} [{avg3_l:.5f}, {avg3_u:.5f}]"}</td></tr>
            % endif  ## has_sprt
            <tr><td>Variance/game</td><td>${f"{var3:.5f} [{var3_l:.5f}, {var3_u:.5f}]"}</td></tr>
            <tr><td>Stdev/game</td><td>${f"{stdev3:.5f} [{stdev3_l:.5f}, {stdev3_u:.5f}]"}</td></tr>
            % if has_sprt:
              <tr><td>Normalized Elo</td><td>${f"{nelo3:.2f}"}</td></tr>
            % else:
              <tr><td>Normalized Elo</td><td>${f"{nelo3:.2f} [{nelo3_l:.2f}, {nelo3_u:.2f}]"}</td></tr>
            % endif  ## has_sprt
            % if has_sprt:
              <tr><td>LLR jumps [loss, draw, win]</td><td>${LLRjumps3}</td></tr>
            % endif  ## has_sprt
          </tbody>
        </table>
        % if has_pentanomial:
          <h4>Comparison</h4>
          <table class="table table-striped table-sm">
            <thead></thead>
            <tbody>
              <tr><td>Variance ratio (pentanomial/trinomial)</td><td>${f"{ratio:.5f}"}</td></tr>
              <tr><td>Variance difference (trinomial-pentanomial)</td><td>${f"{var_diff:.5f}"}</td></tr>
              <tr><td>RMS bias</td><td>${f"{RMS_bias:.5f}"}</td></tr>
              <tr><td>RMS bias (Elo)</td><td>${f"{RMS_bias_elo:.3f}"}</td></tr>
            </tbody>
          </table>
        % endif  ## has_pentanomial
      </div>
    </div>
  % endif  ## has_spsa
</div>
