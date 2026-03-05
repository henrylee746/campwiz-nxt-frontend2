export type ResponseSingle<T> = {
  data: T;
};
export type ResponseList<T> = {
  data: T[];
  next?: string;
  prev?: string;
};

export type ResponseError = {
  detail: string;
};
export type WikimediaUsername = string;
export type IDType = string;
export type CommonFilter = {
  limit: number;
  offset: number;
};
export const dateFormater = new Intl.DateTimeFormat("en", {
  dateStyle: "full",
  timeStyle: "long",
});
