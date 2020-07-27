import React, { useEffect, useReducer } from "react";
import { ChartsToPlot, StatesToInclude } from "./constants/Constants";
import TimeSeries from "./components/TimeSeries";
import { StateSelect } from "./components/StateSelect";
import { processData, filterData } from "./utils/utils";
import Grid from "@material-ui/core/Grid";
import { AppContext } from "./AppContext";

const covidtrackingURL = "https://covidtracking.com/api/states/daily";
// https://simple.wikipedia.org/wiki/U.S._postal_abbreviations for key to 2 letter abbreviations

// TODO:
// bug? reducer called twice per update
// pass props instead of context
// use suspense to show spinner when doing data stuff
// shift data to days since 10? cases
// normalize data to population

const App = () => {
  // @ts-ignore
  const filteredDataReducer = (state, action) => {
    switch (action.type) {
      case "INITIALIZE":
        return {
          processedData: action.processedData,
          selectedStates: action.selectedStates,
          data: filterData(action.processedData, action.selectedStates),
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
  const handleSelectedStateUpdate = (event) => {
    filteredDataDispatch({
      type: "UPDATE_FILTERED_DATA",
      selectedStates: event.target.value,
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

  const contextValues = {
    filteredData: filteredData,
    filteredDataDispatch: filteredDataDispatch,
    handleSelectedStateUpdate: handleSelectedStateUpdate,
  };

  if (filteredData.processedData && filteredData.data) {
    return (
      <AppContext.Provider value={contextValues}>
        <Grid container direction="column" alignItems="center">
          <Grid>
            <StateSelect />
          </Grid>
          <Grid>{TimeSeriesCharts.length > 0 && TimeSeriesCharts}</Grid>
        </Grid>
      </AppContext.Provider>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default App;
