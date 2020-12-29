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

  const fieldMap = ChartsToPlot.reduce(
    (map, chart) => ({
      ...map,
      [chart.fieldName]: chart,
    }),
    {}
  );

  // sort by date and get moving average if specified in ChartsToPlot
  Object.keys(processedDataTemp).forEach((field) => {
    let fieldStates = Object.keys(processedDataTemp[field]);
    fieldStates.forEach((state) => {
      processedDataTemp[field][state].sort((a, b) => a[0] - b[0]);
      if (fieldMap[field].movingAverage) {
        processedDataTemp[field][state] = getMovingAverage(
          processedDataTemp[field][state],
          fieldMap[field].movingAverage
        );
      }
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

// calculates a moving average of 'values' based on number of elements specified by window arg
// expects an array of [time, value] arrays
// TODO: get rid of the tail of zeros at the elements 0-window-1
const getMovingAverage = (data, window) => {
  for (let i = data.length; i >= window; i--) {
    data[i - 1][1] =
      data.slice(i - window, i).reduce((sum, element) => sum + element[1], 0) /
      window;
  }
  return data.slice(window - 1, data.length);
};
