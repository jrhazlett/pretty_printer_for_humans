export default class helperLogic {
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
        helperLogic.optionsForLocaleCompare
      ) === 0
    );
  };
}
