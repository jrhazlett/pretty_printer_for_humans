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

  static fieldMap = 9;

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
        return helperEnumDataTypes._getEnumDataTypeForObject(arg);
      //
      // Symbol
      //
      // Reminder: This is important because symbols do *not* support `${}` string conversions
      case "symbol":
        return helperEnumDataTypes.fieldSymbol;

      case "undefined":
        return helperEnumDataTypes.fieldEitherNonIterableOrString;
      //
      // All other cases
      //
      // If we get this far, then all other possibilities have been ruled out
      default:
        return helperEnumDataTypes.fieldEitherNonIterableOrString;
    }
  };

  /**
   * @param {Object} argObject
   * @return number
   * */
  static _getEnumDataTypeForObject = (argObject) => {
    switch (true) {
      case Array.isArray(argObject):
        return helperEnumDataTypes.fieldArray;

      case argObject instanceof Error:
        return helperEnumDataTypes.fieldError;

      case argObject instanceof Map:
        return helperEnumDataTypes.fieldMap;

      case argObject === null:
        return helperEnumDataTypes.fieldEitherNonIterableOrString;

      case argObject instanceof Promise:
        return helperEnumDataTypes.fieldPromise;

      default:
        return helperEnumDataTypes.fieldObject;
    }
  };

  static fieldSetOfEnumsComplexTypes = new Set([
    helperEnumDataTypes.fieldArray,
    helperEnumDataTypes.fieldMap,
    helperEnumDataTypes.fieldObject,
  ]);

  /**
   * @param {number} argEnumType
   * @returns boolean
   * */
  static isComplex = (argEnumType) =>
    helperEnumDataTypes.fieldSetOfEnumsComplexTypes.has(argEnumType);
}
