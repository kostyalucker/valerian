export function checkAllPropertyValues(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] && obj[key].length) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
