// 指定范围内获取随机数
export const generateRandom = (low: number, high: number): number => {
  const RANDOM = Math.random();
  const RANGE = high - low + 1;

  return Math.floor(RANDOM * RANGE) + low;
};
