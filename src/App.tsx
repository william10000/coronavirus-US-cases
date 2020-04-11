import React, { useState, useEffect } from "react";
import { ChartsToPlot } from "./constants/Constants";
import { TimeSeries } from "./components/TimeSeries";
import { processData } from "./utils/utils";

const covidtrackingURL = "https://covidtracking.com/api/states/daily";

// TODO: add dropdown for states
// see if regular highchart react wrapper has better performance
// use suspense to show spinner when doing data stuff

const App = () => {
  const [processedData, setProcessedData] = useState(
    ChartsToPlot.reduce(
      (initialProcessedData, chart) => ({
        ...initialProcessedData,
        [chart.fieldName]: [],
      }),
      {}
    )
  );
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    fetch(covidtrackingURL)
      .then((response) => response.json())
      .then((data) => {
        setRawData(data);
        setProcessedData(processData(data));
      });
  }, []);

  const TimeSeriesCharts = ChartsToPlot.map((chart) => (
    <TimeSeries
      // @ts-ignore
      data={processedData[chart.fieldName]}
      title={chart.title}
      key={chart.title}
    />
  ));

  return <>{TimeSeriesCharts}</>;
};

export default App;
