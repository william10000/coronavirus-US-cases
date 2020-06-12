import React, { useState, useEffect } from "react";
import { ChartsToPlot, StatesToInclude } from "./constants/Constants";
import TimeSeries from "./components/TimeSeries";
import { StateSelect } from "./components/StateSelect";
import { processData, filterData } from "./utils/utils";
import Grid from "@material-ui/core/Grid";

const covidtrackingURL = "https://covidtracking.com/api/states/daily";

// TODO: add dropdown for states
// use suspense to show spinner when doing data stuff
// shift data to days since 10? cases
// normalize data to population

const App = () => {
  const initialData = ChartsToPlot.reduce(
    (initialProcessedData, chart) => ({
      ...initialProcessedData,
      [chart.fieldName]: [],
    }),
    {}
  );
  const [processedData, setProcessedData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);

  useEffect(() => {
    fetch(covidtrackingURL)
      .then((response) => response.json())
      .then((data) => {
        let processedDataTemp = processData(data);
        setProcessedData(processedDataTemp);
        setFilteredData(filterData(processedDataTemp, StatesToInclude));
      });
  }, []);

  const TimeSeriesCharts = ChartsToPlot.map((chart) => (
    <TimeSeries
      // @ts-ignore
      data={filteredData[chart.fieldName]}
      title={chart.title}
      key={chart.title}
    />
  ));

  return (
    <Grid container direction="column" alignItems="center">
      <Grid>
        <StateSelect />
      </Grid>
      <Grid>{TimeSeriesCharts}</Grid>
    </Grid>
  );
};

export default App;
