"use strict";
/*
This module consolidates formatting functionality.

Sources:
https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
*/
import helperEnumDataTypes from "./helperEnumDataTypes.js";
import HelperObjectForStack from "./helperObjectForStack.js";

export default class helperFormatting {
  /**
   * @param {[]} argArray
   * @returns []
   * */
  static getArrayOfStringsSortedCaseInsensitive = (argArray) =>
    argArray.sort((itemStringPrev, itemString) =>
      `${itemStringPrev}`
        .toLowerCase()
        .localeCompare(`${itemString}`.toLowerCase())
    );
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
      helperFormatting._getArrayOfNamesForParameters(argFunction);
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
   * @param {[]} argArrayStackToProcess
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * @returns string
   * */
  static getStringPrefixWhitespacePlusValuePlusComma = (
    argArrayStackToProcess,
    argHelperOptions,
    argObjectFromStack
  ) =>
    helperFormatting._getStringPlusComma(
      argArrayStackToProcess,
      argHelperOptions.argStringIndentation.repeat(
        argObjectFromStack.fieldIntLayersIn + 1
      ) + argObjectFromStack.fieldValue
    );

  /**
   * @param {[]} argArrayStackToProcess
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * @returns string
   * */
  static getStringWhitespacePlusKeyPlusValuePlusComma = (
    argArrayStackToProcess,
    argHelperOptions,
    argObjectFromStack
  ) =>
    helperFormatting._getStringPlusComma(
      argArrayStackToProcess,
      argHelperOptions.argStringIndentation.repeat(
        argObjectFromStack.fieldIntLayersIn + 1
      ) +
        argObjectFromStack.fieldKey +
        " : " +
        argObjectFromStack.fieldValue
    );

  static regexIsClosure = new RegExp("/[" + "[" + "{" + "]{1}$/g");

  /**
   * @param {[]} argArrayStackToProcess
   * @param {string} argString
   * */
  static _getStringPlusComma = (argArrayStackToProcess, argString) =>
    argArrayStackToProcess.length > 0 &&
    !helperFormatting.regexIsClosure.test(argString)
      ? argString + `,`
      : argString;

  static STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  static ARGUMENT_NAMES = /([^\s,]+)/g;
  /**
   * @param {Function} argFunction
   * @returns []
   * */
  static _getArrayOfNamesForParameters = (argFunction) => {
    const stringFromCallback = argFunction
      .toString()
      .replace(helperFormatting.STRIP_COMMENTS, ``);

    const arrayToReturn = stringFromCallback
      .slice(
        stringFromCallback.indexOf("(") + 1,
        stringFromCallback.indexOf(")")
      )
      .match(helperFormatting.ARGUMENT_NAMES);

    return arrayToReturn === null ? [] : arrayToReturn;
  };
}
