"use strict";
/*
This is used for identifying and encoding data types.

Its 100% static, so it should only exist in memory once.
*/
export default class helperEnumDataTypes {
  // These data types are iterated through, but aren't actually directly printed to output
  static fieldArray = 1;
  static fieldObject = 2;

  // These data types trigger debugging messages
  static fieldError = 3;
  static fieldPromise = 4;
  static fieldCircularReference = 5;

  // This data type requires special formatting to avoid dumping the function
  // defs onto the screen
  static fieldFunction = 6;

  // This data type is generally what gets printed to the output
  static fieldEitherNonIterableOrString = 7;

  static fieldSymbol = 8;

  /**
   * @param {any} arg
   * @returns number
   * */
  static getEnumDataType = (arg) => {
    switch (typeof arg) {
      //
      // Function
      //
      case "function":
        return helperEnumDataTypes.fieldFunction;
      //
      // Object
      //
      case "object":
        //
        // Reminder: typeof [] = 'object'
        //
        if (Array.isArray(arg)) {
          return helperEnumDataTypes.fieldArray;
        }
        if (arg instanceof Error) {
          return helperEnumDataTypes.fieldError;
        }
        if (arg === null) {
          return helperEnumDataTypes.fieldEitherNonIterableOrString;
        }
        if (arg instanceof Promise) {
          return helperEnumDataTypes.fieldPromise;
        }
        return helperEnumDataTypes.fieldObject;
      //
      // Symbol
      //
      case "symbol":
        // Reminder: This is important because symbols do *not* support `${}` string conversions
        return helperEnumDataTypes.fieldSymbol;

      case "undefined":
        return helperEnumDataTypes.fieldEitherNonIterableOrString;
      //
      // All other cases
      //
      default:
        // If we get this far, then all other possibilities have been ruled out
        return helperEnumDataTypes.fieldEitherNonIterableOrString;
    }
  };
}
