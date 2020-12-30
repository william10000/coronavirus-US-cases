// TODO: ratio of tests vs. positive
export const ChartsToPlot = [
  { title: "Confirmed Cases", fieldName: "positive" },
  { title: "Hospitalizations", fieldName: "hospitalized" },
  {
    title: "Hospitalized increase",
    fieldName: "hospitalizedIncrease",
    movingAverage: 7,
  },
  { title: "Deaths", fieldName: "death" },
  { title: "Death increase", fieldName: "deathIncrease", movingAverage: 7 },
];

export const StatesToInclude = ["CA", "CO", "GA", "MA", "NY", "PA", "TX"];
