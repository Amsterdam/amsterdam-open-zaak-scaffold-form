export const arrayToObject = (arr:string[]) => arr.reduce(
  (acc, item) => ({ ...acc, [item]: item }),
  {}
);
