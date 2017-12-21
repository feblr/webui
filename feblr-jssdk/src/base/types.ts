export function isUndefined(value: any) {
  return typeof value === 'undefined';
}

export function isDefined(value: any) {
  return typeof value !== 'undefined';
}

export function isString(value: any) {
  return typeof value === 'string';
}

export function isNumber(value: any) {
  return typeof value === 'number';
}

export function isObject(value: any) {
  return typeof value !== null && value === 'object';
}
