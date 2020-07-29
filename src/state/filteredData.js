import { useReducer, useCallback } from "react";
import { processData, filterData } from "../utils/utils";

export const useFilteredData = () => {
  const filteredDataReducer = (state, action) => {
    switch (action.type) {
      case "INITIALIZE":
        return {
          ...state,
          processedData: action.processedData,
          selectedStates: action.selectedStates || state.selectedStates,
          data: filterData(action.processedData, action.selectedStates),
          status: action.processedData ? "ready" : "not-ready",
        };
      case "UPDATE_FILTERED_DATA":
        return {
          ...state,
          selectedStates: action.selectedStates,
          data: filterData(state.processedData, action.selectedStates),
          noSelectedStates: action.selectedStates.length > 0 ? false : true,
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

  const initializeFilteredData = useCallback(
    (rawData, initialStates) =>
      filteredDataDispatch({
        type: "INITIALIZE",
        processedData: processData(rawData),
        selectedStates: initialStates,
      }),
    [filteredDataDispatch]
  );

  const updateFilteredData = useCallback(
    (selectedStates) =>
      filteredDataDispatch({
        type: "UPDATE_FILTERED_DATA",
        selectedStates: selectedStates,
      }),
    [filteredDataDispatch]
  );

  return [filteredData, initializeFilteredData, updateFilteredData];
};
