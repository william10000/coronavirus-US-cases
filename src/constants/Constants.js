// TODO: ratio of tests vs. positive
export const ChartsToPlot = [
  { title: "Confirmed cases", fieldName: "positive" },
  {
    title: "Confirmed cases increase",
    fieldName: "positiveIncrease",
    movingAverage: 7,
  },
  { title: "Hospitalizations", fieldName: "hospitalized" },
  {
    title: "Hospitalized increase",
    fieldName: "hospitalizedIncrease",
    movingAverage: 7,
  },
  { title: "Deaths", fieldName: "death" },
  { title: "Death increase", fieldName: "deathIncrease", movingAverage: 7 },
];

export const StatesToInclude = ["GA", "LA", "MA", "TX"];
