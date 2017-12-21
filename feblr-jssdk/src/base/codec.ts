export function encode(obj: Object): string {
  let parts: string[] = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }

  return parts.join('&');
}

export function decode(str: string): Object {
  let obj = {};

  let parts: string[] = str.split('&');
  for (let index in parts) {
    let part = parts[index];
    let kv = part.split('=');
    let key = decodeURIComponent(kv[0]);
    let value = decodeURIComponent(kv[1]);

    obj[key] = value;
  }

  return obj;
}
