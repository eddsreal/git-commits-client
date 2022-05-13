export const dynamicSort = (property: string, order: number) => {
  if (property[0] === "-") {
    property = property.substring(1);
  }
  return function (a: any, b: any) {
    const result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * order;
  };
};
