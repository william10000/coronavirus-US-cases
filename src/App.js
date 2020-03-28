import React, { useState, useEffect } from "react";
import {
  HighchartsChart,
  Chart,
  XAxis,
  YAxis,
  Title,
  SplineSeries,
  Tooltip
} from "react-jsx-highcharts";

// https://covidtracking.com/api/
const covidtrackingURL = "https://covidtracking.com/api/states/daily";

const dataAttributes = {
  death: { title: "Deaths" },
  hospitalized: { title: "Hospitalizations" },
  positive: { title: "Confirmed Cases" }
};

const xAxis = {
  type: "datetime",
  tickInterval: 4 * 3600 * 1000,
  dateTimeLabelFormats: {
    hour: "%l %p",
    day: "%b %e '%y",
    week: "%b %e '%y",
    month: "%b '%y",
    year: "%y"
  }
};

const plotOptions = {
  series: {
    turboThreshold: 100000
  }
};

const cchart = {
  type: "Spline",
  zoomType: "x",
  spacingBottom: 25,
  spacingTop: 10,
  spacingLeft: 20,
  spacingRight: 10,
  width: null,
  height: 600
};

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

  let dataSplines = Object.keys(dataAttributes).reduce(
    (splines, key) => ({
      ...splines,
      [key]: Object.keys(processedData[key]).map(region => (
        <SplineSeries
          key={region}
          id={region}
          name={region}
          data={processedData[key][region]}
        />
      ))
    }),
    {}
  );
  console.log(dataSplines);

  return (
    <>
      <HighchartsChart plotOptions={plotOptions}>
        <Chart {...cchart} />

        <Title>Confirmed cases</Title>

        <XAxis {...xAxis}>
          <XAxis.Title>Date</XAxis.Title>
        </XAxis>
        <Tooltip shared={true} />
        <YAxis id="number">
          <YAxis.Title>Confirmed cases</YAxis.Title>
          {dataSplines.positive}
        </YAxis>
      </HighchartsChart>

      <HighchartsChart plotOptions={plotOptions}>
        <Chart {...cchart} />

        <Title>Hospitalizations</Title>

        <XAxis {...xAxis}>
          <XAxis.Title>Date</XAxis.Title>
        </XAxis>
        <Tooltip shared={true} />
        <YAxis id="number">
          <YAxis.Title>Hospitalizations</YAxis.Title>
          {dataSplines.hospitalized}
        </YAxis>
      </HighchartsChart>

      <HighchartsChart plotOptions={plotOptions}>
        <Chart {...cchart} />

        <Title>Deaths</Title>

        <XAxis {...xAxis}>
          <XAxis.Title>Date</XAxis.Title>
        </XAxis>
        <Tooltip shared={true} />
        <YAxis id="number">
          <YAxis.Title>Deaths</YAxis.Title>
          {dataSplines.death}
        </YAxis>
      </HighchartsChart>
    </>
  );
};

export default App;
