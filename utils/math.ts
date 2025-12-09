import { DataSet } from '../types';

export const generateRandomDataSet = (size: number, min: number, max: number): DataSet => {
  const values: number[] = [];
  for (let i = 0; i < size; i++) {
    values.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  
  const sortedValues = [...values].sort((a, b) => a - b);
  const totalCount = values.length;
  
  // Calculate Mean (Moyenne)
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  const mean = Number((sum / totalCount).toFixed(2));

  // Calculate Median (Médiane)
  let median: number;
  const mid = Math.floor(totalCount / 2);
  if (totalCount % 2 === 0) {
    median = (sortedValues[mid - 1] + sortedValues[mid]) / 2;
  } else {
    median = sortedValues[mid];
  }

  // Calculate Quartiles (Collège method: rank based)
  // Q1: value at rank ceil(N/4)
  const q1Index = Math.ceil(totalCount / 4) - 1;
  const q1 = sortedValues[q1Index];

  // Q3: value at rank ceil(3N/4)
  const q3Index = Math.ceil((3 * totalCount) / 4) - 1;
  const q3 = sortedValues[q3Index];

  // Calculate Range (Étendue)
  const range = sortedValues[totalCount - 1] - sortedValues[0];

  // Calculate Interquartile Range (Écart inter-quartile)
  const interquartileRange = q3 - q1;

  return {
    values,
    sortedValues,
    mean,
    median,
    range,
    totalCount,
    q1,
    q3,
    interquartileRange
  };
};

export const getFrequencyData = (values: number[]) => {
  const freqMap: Record<number, number> = {};
  values.forEach(v => {
    freqMap[v] = (freqMap[v] || 0) + 1;
  });
  
  return Object.keys(freqMap)
    .map(key => ({
      value: Number(key),
      count: freqMap[Number(key)]
    }))
    .sort((a, b) => a.value - b.value);
};