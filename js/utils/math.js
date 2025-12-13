export const generateRandomDataSet = (size, min, max) => {
  const values = [];
  for (let i = 0; i < size; i++) {
    values.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  
  const sortedValues = [...values].sort((a, b) => a - b);
  const totalCount = values.length;
  
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  const mean = Number((sum / totalCount).toFixed(2));

  let median;
  const mid = Math.floor(totalCount / 2);
  if (totalCount % 2 === 0) {
    median = (sortedValues[mid - 1] + sortedValues[mid]) / 2;
  } else {
    median = sortedValues[mid];
  }

  const q1Index = Math.ceil(totalCount / 4) - 1;
  const q1 = sortedValues[q1Index];

  const q3Index = Math.ceil((3 * totalCount) / 4) - 1;
  const q3 = sortedValues[q3Index];

  const range = sortedValues[totalCount - 1] - sortedValues[0];
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

export const getFrequencyData = (values) => {
  const freqMap = {};
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

