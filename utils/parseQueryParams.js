export default (params) => {
  const parseParams = {};
  Object.entries(params).map(
    (property) => (parseParams[property[0]] = property[1])
  );
  return parseParams;
};
