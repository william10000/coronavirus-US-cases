import { ChartsToPlot } from "../constants/Constants";

// converts m/d/yy to yyyy-mm-dd
export const convertDateToUNIXTime = (date) =>
  new Date(
    `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`
  ).getTime();

// used for data returned by https://covidtracking.com/api/
export const processData = (rawData) => {
  let processedDataTemp = {};
  let uniqueStates = new Set();

  rawData.forEach((rawDataRow) => {
    const formattedDate = convertDateToUNIXTime(rawDataRow.date.toString(10));

    ChartsToPlot.forEach((chart) => {
      if (processedDataTemp[chart.fieldName] === undefined) {
        processedDataTemp[chart.fieldName] = {};
      }

      if (processedDataTemp[chart.fieldName][rawDataRow.state] === undefined) {
        processedDataTemp[chart.fieldName][rawDataRow.state] = [];
      }

      processedDataTemp[chart.fieldName][rawDataRow.state].push([
        formattedDate,
        rawDataRow[chart.fieldName],
      ]);
    });
  });

  // sort by date
  Object.keys(processedDataTemp).forEach((field) => {
    let fieldStates = Object.keys(processedDataTemp[field]);
    fieldStates.forEach((state) => {
      processedDataTemp[field][state].sort((a, b) => a[0] - b[0]);
    });
    // each field could have data from different states so we want a union of states from all fields
    uniqueStates = new Set([...uniqueStates, ...fieldStates]);
  });

  processedDataTemp.uniqueStates = [...uniqueStates]; // b/c we'll later want to do array stuff on this
  return processedDataTemp;
};

// filters data by statesToInclude, expects data to be in the format returned by processData
export const filterData = (processedData, statesToInclude) => {
  let filteredData = {};
  Object.keys(processedData).forEach((field) => {
    statesToInclude.forEach((state) => {
      if (filteredData[field] === undefined) {
        filteredData[field] = {};
      }
      filteredData[field][state] = processedData[field][state];
    });
  });
  return filteredData;
};
