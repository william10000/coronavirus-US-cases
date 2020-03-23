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
import * as d3 from "d3";

const confirmedCasesURL =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
const deathsURL =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";

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
  const [confirmedCaseData, setConfirmedCaseData] = useState([
    { state: "", data: [] }
  ]);
  const [deathsData, setDeathsData] = useState([{ state: "", data: [] }]);

  const [firstLoad, setFirstLoad] = useState(true);

  // current filter is for US states and excludes specific US cities
  const dataRowFilter = dataRow =>
    dataRow["Country/Region"] === "US" &&
    // !dataRow["Province/State"].includes(",") &&
    [
      "Georgia",
      "Texas",
      "Massachusetts",
      "California",
      "Washington",
      "Colorado",
      "New York"
    ].includes(dataRow["Province/State"]);

  const convertDateToUNIXTime = date => {
    const dateParts = date.split("/");
    return new Date(
      `20${dateParts[2]}-${dateParts[0].padStart(2, "0")}-${dateParts[1]}`
    ).getTime();
  };

  const getSeriesData = data =>
    Object.keys(data)
      .filter(key => /^\d{1,2}\/\d{1,2}\/\d{2}$/.test(key))
      .map(key => [convertDateToUNIXTime(key), parseInt(data[key], 10)]);

  const processData = rawData =>
    rawData
      .filter(dataRow => dataRowFilter(dataRow))
      .map(dataRow => ({
        state: dataRow["Province/State"],
        data: getSeriesData(dataRow)
      }));

  if (firstLoad) {
    d3.csv(confirmedCasesURL).then(data => {
      setFirstLoad(false);
      console.log(data);
      console.log(processData(data));
      setConfirmedCaseData(processData(data));
    });
    d3.csv(deathsURL).then(data => {
      setFirstLoad(false);
      console.log(data);
      console.log(processData(data));
      setDeathsData(processData(data));
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

  let confirmedCasesSplines = confirmedCaseData.map(region => (
    <SplineSeries
      key={region.state}
      id={region.state}
      name={region.state}
      data={region.data}
    />
  ));

  let deaths = deathsData.map(region => (
    <SplineSeries
      key={region.state}
      id={region.state}
      name={region.state}
      data={region.data}
    />
  ));
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
          {confirmedCasesSplines}
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
          {deaths}
        </YAxis>
      </HighchartsChart>
    </>
  );
};

export default App;
