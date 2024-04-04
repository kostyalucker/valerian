export function checkObjectProperties(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (!obj[key] && obj[key] !== false) {
        return false;
      }
    }
  }
  return true;
}
