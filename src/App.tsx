import React, { useState, useEffect } from "react";
import { ChartsToPlot, StatesToInclude } from "./constants/Constants";
import TimeSeries from "./components/TimeSeries";
import { StateSelect } from "./components/StateSelect";
import { processData, filterData } from "./utils/utils";
import Grid from "@material-ui/core/Grid";
import { AppContext } from "./AppContext";

const covidtrackingURL = "https://covidtracking.com/api/states/daily";
// https://simple.wikipedia.org/wiki/U.S._postal_abbreviations for key to 2 letter abbreviations

// TODO:
// update plots when states are updated
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
  const [uniqueStates, setUniqueStates] = useState();

  useEffect(() => {
    fetch(covidtrackingURL)
      .then((response) => response.json())
      .then((data) => {
        let processedDataTemp = processData(data);
        setProcessedData(processedDataTemp);
        setFilteredData(filterData(processedDataTemp, StatesToInclude));
        // @ts-ignore
        setUniqueStates(processedDataTemp.uniqueStates);
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

  const contextValues = {
    uniqueStates: uniqueStates,
  };

  return (
    <AppContext.Provider value={contextValues}>
      <Grid container direction="column" alignItems="center">
        <Grid>
          <StateSelect />
        </Grid>
        <Grid>{TimeSeriesCharts}</Grid>
      </Grid>
    </AppContext.Provider>
  );
};

export default App;
