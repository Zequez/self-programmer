export function identity<T>(v: T): T {
  return v;
}

export function pick<T extends Record<string, unknown>, U extends keyof T>(
  obj: T,
  paths: Array<U>,
): Pick<T, U> {
  const ret = Object.create(null);
  for (const k of paths) {
    ret[k] = obj[k];
  }
  return ret;
}
