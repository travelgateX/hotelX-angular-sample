/**
 * Returns an array
 * @param num
 * @param zero
 */
export function getArrayUses(num: number, zero: boolean = true): Array<number> {
  return zero
    ? Array(num)
        .fill(NaN)
        .map((x, i) => i)
    : Array(num)
        .fill(NaN)
        .map((x, i) => i)
        .slice(1);
}

/**
 * Get type of a variable
 */
export function getType(obj: any) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

export function formatHoursToDaysHours(hoursBefore: number): string {
  if (hoursBefore < 24 && hoursBefore !== 0) {
    return hoursBefore + ' h';
  } else if ((hoursBefore / 24) % 1 !== 0) {
    return (
      Math.floor(hoursBefore / 24) +
      ' d ' +
      ((hoursBefore / 24) % 1) * 24 +
      ' h'
    );
  } else {
    return String(hoursBefore / 24);
  }
}

/**
 * Test if the variable contains something. If not returns the class "disabled" to css styles.
 * @param variableToTest Test if the variable contains something
 * @param actualClass Actual classes from the element tag "Class"
 */
export function getDisabled(variableToTest: any, actualClass: string): string {
  return !variableToTest ? 'disabled ' + actualClass : actualClass;
}

/**
 * Transforms an enumerate into an a printable array
 * @param enumerate
 */
export function enumToArray(enumerate: any) {
  const enumMaped = [];
  Object.keys(enumerate).map((e, i) => {
    enumMaped[i] = { name: enumerate[e], value: e };
  });
  return enumMaped;
}

/**
 * Function that catches click events. It's used to close a datepicker if the user clicks outside of it (or some other datepicker)
 * @param event
 * @param datepicker
 */
export function decideClosure(event, datepicker) {
  const path = event.path.map(p => p.localName);
  if (!path.includes('ngb-datepicker')) {
    datepicker.close();
  }
}
