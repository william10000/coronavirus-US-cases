import React, { useState } from "react";
import { ChartsToPlot } from "./constants/Constants";
import TimeSeries from "./components/TimeSeries";
import { processData } from "./utils/utils";

const covidtrackingURL = "https://covidtracking.com/api/states/daily";

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
  const [firstLoad, setFirstLoad] = useState(true);

  if (firstLoad) {
    fetch(covidtrackingURL)
      .then((response) => response.json())
      .then((data) => {
        setFirstLoad(false);
        setRawData(data);
        setProcessedData(processData(data));
      });
  }

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
