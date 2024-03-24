import React from "react";
import { Chart } from "react-google-charts";

function LiveEloCharts(props) {
  const { data } = props;
  debugger;

  return (
    <React.Fragment>
      <Chart
        className="gauge"
        width={170}
        height={150}
        chartType="Gauge"
        data={[
          ["Label", "Value"],
          ["LLR", Math.round(100 * data.elo.LLR) / 100],
        ]}
        options={(data) => {
          const a = Math.round(100 * data.elo.a) / 100;
          const b = Math.round(100 * data.elo.b) / 100;
          const LLR_chart_options = {
            width: 500,
            height: 150,
            greenFrom: b,
            greenTo: b * 1.04,
            redFrom: a * 1.04,
            redTo: a,
            yellowFrom: a,
            yellowTo: b,
            max: b,
            min: a,
            minorTicks: 3,
          };
          return LLR_chart_options;
        }}
        rootProps={{ "data-testid": "1" }}
      />

      <Chart
        className="gauge"
        width={170}
        height={150}
        chartType="Gauge"
        loader={<div>Loading Chart</div>}
        data={[
          ["Label", "Value"],
          ["LOS", Math.round(1000 * data.elo.LOS) / 10],
        ]}
        options={{
          greenFrom: 95,
          greenTo: 100,
          yellowFrom: 5,
          yellowTo: 95,
          redFrom: 0,
          redTo: 5,
          minorTicks: 5,
        }}
        rootProps={{ "data-testid": "2" }}
      />

      <Chart
        className="gauge"
        width={170}
        height={150}
        chartType="Gauge"
        data={[
          ["Label", "Value"],
          ["Elo", Math.round(100 * data.elo.elo) / 100],
        ]}
        options={() => {
          debugger;
          const ci_lower = data.elo.ci[0];
          const ci_upper = data.elo.ci[1];
          const ELO_chart_options = {
            width: 500,
            height: 150,
            max: 4,
            min: -4,
            minorTicks: 4,
          };
          if (ci_lower < 0 && ci_upper > 0) {
            ELO_chart_options.redFrom = ci_lower;
            ELO_chart_options.redTo = 0;
            ELO_chart_options.yellowFrom = 0;
            ELO_chart_options.yellowTo = 0;
            ELO_chart_options.greenFrom = 0;
            ELO_chart_options.greenTo = ci_upper;
          } else if (ci_lower >= 0) {
            ELO_chart_options.redFrom = ci_lower;
            ELO_chart_options.redTo = ci_lower;
            ELO_chart_options.yellowFrom = ci_lower;
            ELO_chart_options.yellowTo = ci_lower;
            ELO_chart_options.greenFrom = ci_lower;
            ELO_chart_options.greenTo = ci_upper;
          } else if (ci_upper <= 0) {
            ELO_chart_options.redFrom = ci_lower;
            ELO_chart_options.redTo = ci_upper;
            ELO_chart_options.yellowFrom = ci_upper;
            ELO_chart_options.yellowTo = ci_upper;
            ELO_chart_options.greenFrom = ci_upper;
            ELO_chart_options.greenTo = ci_upper;
          }
          return ELO_chart_options;
        }}
        rootProps={{ "data-testid": "3" }}
      />
    </React.Fragment>
  );
}

export default LiveEloCharts;
