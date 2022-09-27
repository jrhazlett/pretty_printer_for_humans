"use strict";
/*
This module consolidates formatting functionality.

Sources:
https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
*/
import helperEnumDataTypes from "./helperEnumDataTypes.js";
import helperGlobals from "./helperGlobals.js";
import HelperObjectForStack from "./helperObjectForStack.js";

export default class helperFormatting {
  static optionsForLocaleCompare = { sensitivity: "base" };

  /**
   * @param {[]} argArray
   * @returns []
   * */
  static getArrayOfStringsSortedCaseInsensitive = (argArray) => {
    //
    // Reminder: Apparently this approach carries a performance boost over doing a lower case comparison.
    // Source:
    // https://stackoverflow.com/questions/8996963/how-to-perform-case-insensitive-sorting-array-of-string-in-javascript
    //
    return argArray.sort((itemStringPrev, itemString) =>
      `${helperGlobals.getStringFromArg(itemStringPrev)}`.localeCompare(
        `${helperGlobals.getStringFromArg(itemString)}`,
        undefined,
        helperFormatting.optionsForLocaleCompare
      )
    );
  };
  /**
   * @param {[]} argArrayStackToUpdate
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * @param {string} argStringKey
   * @param {string} argStringSummaryBrackets
   * @returns boolean
   * */
  static getBoolAfterAttemptingToAddObjectFormattedForExceededLayer = (
    argArrayStackToUpdate,
    argHelperOptions,
    argObjectFromStack,
    argStringKey,
    argStringSummaryBrackets
  ) => {
    if (argHelperOptions.argIntDepthToPrint !== undefined) {
      if (
        argObjectFromStack.fieldIntLayersIn >=
        argHelperOptions.argIntDepthToPrint
      ) {
        argArrayStackToUpdate.push(
          new HelperObjectForStack(
            helperEnumDataTypes.fieldEitherNonIterableOrString,
            argObjectFromStack.fieldIntLayersIn,
            argStringKey,
            argStringSummaryBrackets
          )
        );
        return true;
      }
    }
    return false;
  };

  /**
   * @param {Function} argFunction
   * */
  static getStringFunctionSignature = (argFunction) => {
    const arrayOfArguments =
      helperGlobals.getArrayOfNamesForParameters(argFunction);
    return (
      (arrayOfArguments.length === 0
        ? "()"
        : "( " +
          arrayOfArguments.reduce(
            (itemStringPrev, itemString) => itemStringPrev + ", " + itemString
          ) +
          " )") + " => { ... }"
    );
  };

  /**
   * @param {[]} argArrayOfStringsOutput
   * @param {[]} argArrayStackToProcess
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * @returns string
   * */
  static getStringPrefixWhitespacePlusValuePlusComma = (
    argArrayOfStringsOutput,
    argArrayStackToProcess,
    argHelperOptions,
    argObjectFromStack
  ) => {
    if (
      helperFormatting._isSingleItemObject(
        argArrayOfStringsOutput,
        argArrayStackToProcess
      )
    ) {
      return argObjectFromStack.fieldValue;
    } else {
      return helperFormatting._getStringPlusComma(
        argArrayOfStringsOutput,
        argArrayStackToProcess,
        argHelperOptions.argStringIndentation.repeat(
          argObjectFromStack.fieldIntLayersIn + 1
        ) + argObjectFromStack.fieldValue
      );
    }
  };

  /**
   * @param {[]} argArrayOfStringsOutput
   * @param {[]} argArrayStackToProcess
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * @returns string
   * */
  static getStringWhitespacePlusKeyPlusValuePlusComma = (
    argArrayOfStringsOutput,
    argArrayStackToProcess,
    argHelperOptions,
    argObjectFromStack
  ) => {
    let stringToReturn;
    if (
      helperFormatting._isSingleItemObject(
        argArrayOfStringsOutput,
        argArrayStackToProcess
      )
    ) {
      stringToReturn = argObjectFromStack.fieldValue;
    } else {
      stringToReturn = helperFormatting._getStringPlusComma(
        argArrayOfStringsOutput,
        argArrayStackToProcess,
        argHelperOptions.argStringIndentation.repeat(
          argObjectFromStack.fieldIntLayersIn + 1
        ) +
          argObjectFromStack.fieldKey +
          " : " +
          argObjectFromStack.fieldValue
      );
    }
    return stringToReturn;
  };

  /**
   * @param {[]} argArrayOfStringsOutput
   * @param {[]} argArrayStackToProcess
   * @returns boolean
   * */
  static _isSingleItemObject = (
    argArrayOfStringsOutput,
    argArrayStackToProcess
  ) => {
    return (
      argArrayOfStringsOutput.length === 0 &&
      argArrayStackToProcess.length === 1
    );
  };

  static regexIsClosure = /[\[{]{1}|[Map(]$/;

  /**
   * @param {[]} argArrayOfStringsOutput
   * @param {[]} argArrayStackToProcess
   * @param {string} argString
   * */
  static _getStringPlusComma = (
    argArrayOfStringsOutput,
    argArrayStackToProcess,
    argString
  ) => {
    let stringToReturn;
    if (
      argArrayOfStringsOutput.length === 0 &&
      argArrayStackToProcess.length === 1
    ) {
      stringToReturn = argString;
    } else {
      stringToReturn =
        argArrayStackToProcess.length > 0 &&
        !helperFormatting.regexIsClosure.test(argString)
          ? argString + `,`
          : argString;
    }
    return stringToReturn;
  };
}
