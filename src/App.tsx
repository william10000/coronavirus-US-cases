import React, { useEffect } from "react";
import { ChartsToPlot, StatesToInclude } from "./constants/Constants";
import TimeSeries from "./components/TimeSeries";
import { StateSelect } from "./components/StateSelect";
import Grid from "@material-ui/core/Grid";
import Loader from "./components/Loader";
import { useFilteredData } from "./state/filteredData";

const covidtrackingURL = "https://api.covidtracking.com/v1/states/daily.json";
// https://simple.wikipedia.org/wiki/U.S._postal_abbreviations for key to 2 letter abbreviations

// TODO:
// bug? reducer called twice per update
// could store selectedStates locally in StateSelect component
// shift data to days since 10?
// normalize data to population?

const App = () => {
  const [
    filteredData,
    initializeFilteredData,
    updateFilteredData,
  ] = useFilteredData();

  useEffect(() => {
    fetch(covidtrackingURL)
      .then((response) => response.json())
      .then((data) => {
        initializeFilteredData(data, StatesToInclude);
      });
  }, [initializeFilteredData]);

  const TimeSeriesCharts = filteredData.noSelectedStates
    ? []
    : ChartsToPlot.map((chart) => (
        <TimeSeries
          // @ts-ignore
          data={filteredData.data[chart.fieldName]}
          title={chart.title}
          key={chart.title}
        />
      ));

  if (filteredData.status === "ready") {
    return (
      <Grid container direction="column" alignItems="center">
        <Grid>
          {/* @ts-ignore */}
          <StateSelect
            // @ts-ignore
            data={filteredData}
            selectedStateUpdateHandler={updateFilteredData}
          />
        </Grid>
        <Grid>{TimeSeriesCharts.length > 0 && TimeSeriesCharts}</Grid>
      </Grid>
    );
  } else {
    return (
      <div>
        <Loader />
      </div>
    );
  }
};

export default App;
