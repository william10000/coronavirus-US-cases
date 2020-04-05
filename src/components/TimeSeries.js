import React from "react";
import {
  HighchartsChart,
  Chart,
  XAxis,
  YAxis,
  Title,
  SplineSeries,
  Tooltip
} from "react-jsx-highcharts";

const xAxis = {
  type: "datetime",
  tickInterval: 1000 * 60 * 60 * 24,
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
  height: 400
};

// assume title is same as y-axis label
// data is an object like { "TX": [[data, #]]}
export const TimeSeries = ({ data, title }) => {
  let dataSplines = Object.keys(data).map(state => (
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
      <YAxis id="number">
        <YAxis.Title>{title}</YAxis.Title>
        {dataSplines}
      </YAxis>
    </HighchartsChart>
  );
};
