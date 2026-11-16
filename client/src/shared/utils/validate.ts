export const required = (value: string) => (value ? undefined : "Required");

export const minLength = (min: number) => (value: string) =>
  value.length >= min ? undefined : `min length is ${min}`;

export const email = (value: string) =>
  !value || /^[^s@]+@[^s@]+.[^s@]+$/.test(value) ? undefined : "invalid email";

export const onlyLetters = (value: string) => value.replace(/[^a-zA-Z]/g, "");
