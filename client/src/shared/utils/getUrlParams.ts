export type FetchParams = Record<string, string>;

export const getRequestParams = (params: FetchParams) => {
  return Object.entries(params).reduce(
    (result, item, index) =>
      result + `${index > 0 ? "&" : ""}` + item[0] + "=" + item[1],
    ""
  );
};
