import React from "react";
import {
  withHighcharts,
  HighchartsChart,
  Chart,
  XAxis,
  YAxis,
  Title,
  SplineSeries,
  Tooltip,
} from "react-jsx-highcharts";
import Highcharts from "highcharts";

const xAxis = {
  type: "datetime",
  tickInterval: 1000 * 60 * 60 * 24,
  dateTimeLabelFormats: {
    hour: "%l %p",
    day: "%b %e '%y",
    week: "%b %e '%y",
    month: "%b '%y",
    year: "%y",
  },
};

const yAxis = {
  type: "logarithmic",
};

const plotOptions = {
  series: {
    turboThreshold: 100000,
  },
};

const cchart = {
  type: "Spline",
  zoomType: "x",
  spacingBottom: 25,
  spacingTop: 10,
  spacingLeft: 20,
  spacingRight: 10,
  width: 800,
  height: 600,
};

// assume title is same as y-axis label
// data is an object like { "TX": [[data, #]]}
const TimeSeries = ({ data, title }) => {
  let dataSplines = Object.keys(data).map((state) => (
    <SplineSeries key={state} id={state} name={state} data={data[state]} />
  ));

  return (
    <HighchartsChart plotOptions={plotOptions} key={title}>
      <Chart {...cchart} />

      <Title>{title}</Title>

      <XAxis {...xAxis}>
        <XAxis.Title>Date</XAxis.Title>
      </XAxis>
      <Tooltip shared={true} />
      <YAxis {...yAxis}>
        <YAxis.Title>{title}</YAxis.Title>
        {dataSplines}
      </YAxis>
    </HighchartsChart>
  );
};

export default withHighcharts(TimeSeries, Highcharts);
