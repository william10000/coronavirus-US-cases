import React, { useEffect, useReducer } from "react";
import { ChartsToPlot, StatesToInclude } from "./constants/Constants";
import TimeSeries from "./components/TimeSeries";
import { StateSelect } from "./components/StateSelect";
import { processData, filterData } from "./utils/utils";
import Grid from "@material-ui/core/Grid";
import Loader from "./components/Loader";

const covidtrackingURL = "https://covidtracking.com/api/states/daily";
// https://simple.wikipedia.org/wiki/U.S._postal_abbreviations for key to 2 letter abbreviations

// TODO:
// bug? reducer called twice per update
// move reducer and states to a directory or file
// shift data to days since 10? cases
// normalize data to population

const App = () => {
  // @ts-ignore
  const filteredDataReducer = (state, action) => {
    switch (action.type) {
      case "INITIALIZE":
        return {
          processedData: action.processedData,
          selectedStates: action.selectedStates || state.selectedStates,
          data: filterData(action.processedData, action.selectedStates),
          status:
            action.selectedStates || state.selectedStates
              ? "ready"
              : "not-ready",
        };
      case "UPDATE_FILTERED_DATA":
        return {
          ...state,
          selectedStates: action.selectedStates,
          data: filterData(state.processedData, action.selectedStates),
        };
      default:
        throw new Error();
    }
  };

  const [filteredData, filteredDataDispatch] = useReducer(filteredDataReducer, {
    processedData: {},
    selectedStates: [],
    data: {},
  });

  useEffect(() => {
    fetch(covidtrackingURL)
      .then((response) => response.json())
      .then((data) => {
        filteredDataDispatch({
          type: "INITIALIZE",
          processedData: processData(data),
          selectedStates: StatesToInclude,
        });
      });
  }, []);

  // @ts-ignore
  const handleSelectedStateUpdate = (selectedStates) => {
    filteredDataDispatch({
      type: "UPDATE_FILTERED_DATA",
      selectedStates: selectedStates,
    });
  };

  const TimeSeriesCharts =
    filteredData.selectedStates.length > 0
      ? ChartsToPlot.map((chart) => (
          <TimeSeries
            // @ts-ignore
            data={filteredData.data[chart.fieldName]}
            title={chart.title}
            key={chart.title}
          />
        ))
      : [];

  if (filteredData.status === "ready") {
    return (
      <Grid container direction="column" alignItems="center">
        <Grid>
          {/* @ts-ignore */}
          <StateSelect
            // @ts-ignore
            data={filteredData}
            selectedStateUpdateHandler={handleSelectedStateUpdate}
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
