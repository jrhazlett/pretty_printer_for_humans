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

  /**
   * @param {any} arg
   * @returns number
   * */
  static getEnumDataType = (arg) => {
    if (arg instanceof Function) {
      return helperEnumDataTypes.fieldFunction;
    }

    if (Array.isArray(arg)) {
      return helperEnumDataTypes.fieldArray;
    }

    if (arg === null) {
      return helperEnumDataTypes.fieldEitherNonIterableOrString;
    }

    // Check if object is anything ( results like null / undefined will return false )
    if (arg) {
      // If constructor is an Object then return the object as the type
      if (arg instanceof Object) {
        if (arg instanceof Error) {
          return helperEnumDataTypes.fieldError;
        }

        if (arg instanceof Promise) {
          return helperEnumDataTypes.fieldPromise;
        }

        return helperEnumDataTypes.fieldObject;
      }
    }
    // If we get this far, then all other possibilities have been ruled out
    return helperEnumDataTypes.fieldEitherNonIterableOrString;
  };
}
