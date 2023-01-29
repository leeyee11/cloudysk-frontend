export const humanizeSize = (size: number) => {
  const sizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
  let currSize = size;
  let i = 0;
  while (currSize > 1024) {
    currSize /= 1024;
    i++;
  }
  return Math.round(currSize * 10) / 10 + sizeUnits[i];
};
