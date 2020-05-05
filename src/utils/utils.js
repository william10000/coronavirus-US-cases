import { ChartsToPlot } from "../constants/Constants";

// converts m/d/yy to yyyy-mm-dd
export const convertDateToUNIXTime = (date) =>
  new Date(
    `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`
  ).getTime();

// used for data returned by https://covidtracking.com/api/
export const processData = (rawData) => {
  let processedDataTemp = {};

  rawData.forEach((rawDataRow) => {
    const formattedDate = convertDateToUNIXTime(rawDataRow.date.toString(10));

    ChartsToPlot.forEach((chart) => {
      if (!processedDataTemp[chart.fieldName]) {
        processedDataTemp[chart.fieldName] = {};
      }

      if (!processedDataTemp[chart.fieldName][rawDataRow.state]) {
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
    Object.keys(processedDataTemp[field]).forEach((state) => {
      processedDataTemp[field][state].sort((a, b) => a[0] - b[0]);
    });
  });

  return processedDataTemp;
};

export const filterData = (rawData, statesToInclude) => {
  let filteredData = {};
  Object.keys(rawData).forEach((field) => {
    statesToInclude.forEach((state) => {
      if (!filteredData[field]) {
        filteredData[field] = {};
      }
      filteredData[field][state] = rawData[field][state];
    });
  });
  return filteredData;
};
