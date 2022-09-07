/*
This module stores functions which benefit from being global, but don't necessarily fit anywhere else.

Everything here is static, so it should only exist in memory once.
*/
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
