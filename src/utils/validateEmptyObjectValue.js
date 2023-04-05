export function validateEmptyObjectValue(obj) {
  const isValid = Object.keys(obj).reduce((acc, curr ) => {
    if (!obj[curr]) {
      acc = false;
    }

    return acc;
  }, true);

  return isValid;
}