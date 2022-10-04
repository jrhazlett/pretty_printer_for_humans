/*
This module stores functions which benefit from being global, but don't necessarily fit anywhere else.

Everything here is static, so it should only exist in memory once.
*/
import helperEnumDataTypes from "./helperEnumDataTypes.js";

export default class helperGlobals {
  static STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  static ARGUMENT_NAMES = /([^\s,]+)/g;
  /**
   * @param {Function} argFunction
   * @returns []
   * */
  static getArrayOfNamesForParameters = (argFunction) => {
    const stringFromCallback = argFunction
      .toString()
      .replace(helperGlobals.STRIP_COMMENTS, ``);
    const arrayToReturn = stringFromCallback
      .slice(
        stringFromCallback.indexOf("(") + 1,
        stringFromCallback.indexOf(")")
      )
      .match(helperGlobals.ARGUMENT_NAMES);
    return arrayToReturn === null
      ? []
      : arrayToReturn.filter((itemStringNameArg) =>
          itemStringNameArg.startsWith("arg")
        );
  };

  /**
   * This function is a less efficient version of getStringFromArgViaEnumDataType()
   * It exists to functions with simpler overhead like getValueAtPath()
   *
   * Javascript's `${}` doesn't work in *all* cases, so this function is necessary to compensate.
   *
   * @param {any} arg
   * @returns string
   * */
  static getStringFromArg = (arg) => {
    switch (typeof arg) {
      //
      // Reminder: symbols do *not* support `${}`
      //
      case "symbol":
        return arg.toString();
      default:
        return `${arg}`;
    }
  };

  /**
   * Javascript's `${}` doesn't work in *all* cases, so this function is necessary to compensate.
   *
   * @param {any} arg
   * @param {number} argEnumDataType
   * @returns string
   * */
  static getStringFromArgViaEnumDataType = (arg, argEnumDataType) => {
    switch (argEnumDataType) {
      //
      // Reminder: symbols do *not* support `${}`
      //
      case helperEnumDataTypes.fieldSymbol:
        return arg.toString();
      default:
        return `${arg}`;
    }
  };

  /**
   * @param {[]} argIterable
   * @return string
   * */
  static getStringPrintableFromIterable = (argIterable) => {
    const arrayFromArg = Array.from(argIterable);
    if (arrayFromArg.length === 0) {
      return "[]";
    }
    const arrayToReturn = new Array(arrayFromArg.length);
    for (
      let itemIntIndex = 0, intLength = arrayFromArg.length;
      itemIntIndex < intLength;
      itemIntIndex++
    ) {
      arrayToReturn[itemIntIndex] = helperGlobals.getStringFromArg(
        arrayFromArg[itemIntIndex]
      );
    }
    return `[ ${arrayToReturn.reduce(
      (itemStringPrev, itemString) => itemStringPrev + ", " + itemString
    )} ]`;
  };

  static optionsForLocaleCompare = { sensitivity: "base" };

  /**
   * @param {string} argStringOne
   * @param {string} argStringTwo
   * @returns boolean
   * */
  static logicAreStringsEqualCaseInsensitive = (argStringOne, argStringTwo) => {
    //
    // Reminder: How localeCompare() works...
    // If there's a clean one-to-one match, then it returns 0
    // All other scenarios, then it returns a positive or negative number
    //
    // Processing-wise, this apparently carries a performance boost over lower-case compares
    //
    return (
      argStringOne.localeCompare(
        argStringTwo,
        undefined,
        helperGlobals.optionsForLocaleCompare
      ) === 0
    );
  };
}
