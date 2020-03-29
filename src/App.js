import React, { useState, useEffect } from "react";
import { dataAttributes } from "./Constants/Constants";
import { TimeSeries } from "./Components/TimeSeries";

// https://covidtracking.com/api/
const covidtrackingURL = "https://covidtracking.com/api/states/daily";

const App = () => {
  const [processedData, setProcessedData] = useState({
    hospitalized: [{ state: "", data: [] }],
    positive: [{ state: "", data: [] }],
    death: [{ state: "", data: [] }]
  });
  const [firstLoad, setFirstLoad] = useState(true);

  // current filter is for US states and excludes specific US cities
  const dataRowFilter = dataRow =>
    [
      "GA",
      "TX",
      "MA",
      "CA",
      "WA",
      "CO",
      "NY",
      "PA"
      // "MI",
      // "DE",
      // "SC",
      // "IN",
      // "MO"
    ].includes(dataRow["state"]);

  // converts m/d/yy to yyyy-mm-dd
  const convertDateToUNIXTime = date => {
    return new Date(
      `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`
    ).getTime();
  };

  // keys: death, hospitalized, positive
  const processData = rawData => {
    let processedDataTemp = {};
    const filteredData = rawData.filter(dataRow => dataRowFilter(dataRow));

    filteredData.forEach(rawDataRow => {
      const formattedDate = convertDateToUNIXTime(
        rawDataRow["date"].toString(10)
      );

      Object.keys(dataAttributes).forEach(key => {
        if (!processedDataTemp[key]) {
          processedDataTemp[key] = {};
        }

        if (!processedDataTemp[key][rawDataRow["state"]]) {
          processedDataTemp[key][rawDataRow["state"]] = [];
        }

        processedDataTemp[key][rawDataRow["state"]].push([
          formattedDate,
          rawDataRow[key]
        ]);
      });
    });

    return processedDataTemp;
  };

  if (firstLoad) {
    fetch(covidtrackingURL)
      .then(response => response.json())
      .then(data => {
        setFirstLoad(false);
        setProcessedData(processData(data));
      });
  }

  // useEffect(() => {
  //   d3.csv(dataURL).then(data => {
  //     setFirstLoad(false);
  //     console.log(data);
  //     console.log(processConfirmedCasesData(data));
  //     setConfirmedCaseData(processConfirmedCasesData(data));
  //   });
  // }, []);

  const sortedAttributes = Object.keys(dataAttributes).sort((a, b) => {
    console.log(a, b);
    if (dataAttributes[a].order > dataAttributes[b].order) {
      return 1;
    }
    if (dataAttributes[b].order > dataAttributes[a].order) {
      return -1;
    }

    return 0;
  });

  console.log(sortedAttributes);
  const TimeSeriesCharts = sortedAttributes.map(attribute => (
    <TimeSeries
      data={processedData[attribute]}
      title={dataAttributes[attribute].title}
      key={attribute}
    />
  ));

  return <>{TimeSeriesCharts}</>;
};

export default App;
