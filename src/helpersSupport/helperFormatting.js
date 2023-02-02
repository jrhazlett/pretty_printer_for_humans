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
     * @param {string[]} argArray
     * @returns string[]
     *
     * Reminder: Apparently this approach carries a performance boost over doing a lower case comparison.
     * Source:
     * https://stackoverflow.com/questions/8996963/how-to-perform-case-insensitive-sorting-array-of-string-in-javascript
     * */
    static getArrayOfStringsSortedCaseInsensitive = (argArray) =>
        argArray.sort((itemStringPrev, itemString) =>
            `${helperGlobals.getStringFromArg(itemStringPrev)}`.localeCompare(
                `${helperGlobals.getStringFromArg(itemString)}`,
                undefined,
                helperFormatting.optionsForLocaleCompare
            )
        );
    /**
     * @param {HelperObjectForStack[]} argArrayStackToUpdate
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
                      (itemStringPrev, itemString) =>
                          itemStringPrev + ", " + itemString
                  ) +
                  " )") + " => { ... }"
        );
    };

    /**
     * @param {string[]} argArrayOfStringsOutput
     * @param {HelperObjectForStack[]} argArrayStackToProcess
     * @param {HelperOptions} argHelperOptions
     * @param {HelperObjectForStack} argObjectFromStack
     * @returns string
     * */
    static getStringPrefixWhitespacePlusValuePlusComma = (
        argArrayOfStringsOutput,
        argArrayStackToProcess,
        argHelperOptions,
        argObjectFromStack
    ) =>
        helperFormatting._isSingleItemObject(
            argArrayOfStringsOutput,
            argArrayStackToProcess
        )
            ? argObjectFromStack.fieldValue
            : helperFormatting._getStringPlusComma(
                  argArrayOfStringsOutput,
                  argArrayStackToProcess,
                  argHelperOptions.argStringIndentation.repeat(
                      argObjectFromStack.fieldIntLayersIn + 1
                  ) + argObjectFromStack.fieldValue
              );

    /**
     * @param {string[]} argArrayOfStringsOutput
     * @param {HelperObjectForStack[]} argArrayStackToProcess
     * @param {HelperOptions} argHelperOptions
     * @param {HelperObjectForStack} argObjectFromStack
     * @returns string
     * */
    static getStringWhitespacePlusKeyPlusValuePlusComma = (
        argArrayOfStringsOutput,
        argArrayStackToProcess,
        argHelperOptions,
        argObjectFromStack
    ) =>
        helperFormatting._isSingleItemObject(
            argArrayOfStringsOutput,
            argArrayStackToProcess
        )
            ? argObjectFromStack.fieldValue
            : helperFormatting._getStringPlusComma(
                  argArrayOfStringsOutput,
                  argArrayStackToProcess,
                  argHelperOptions.argStringIndentation.repeat(
                      argObjectFromStack.fieldIntLayersIn + 1
                  ) +
                      argObjectFromStack.fieldKey +
                      " : " +
                      argObjectFromStack.fieldValue
              );

    /**
     * @param {string[]} argArrayOfStringsOutput
     * @param {HelperObjectForStack[]} argArrayStackToProcess
     * @returns boolean
     * */
    static _isSingleItemObject = (
        argArrayOfStringsOutput,
        argArrayStackToProcess
    ) =>
        argArrayOfStringsOutput.length === 0 &&
        argArrayStackToProcess.length === 1;

    static regexIsClosure = /[\[{]{1}|[Map(]$/;

    /**
     * @param {string[]} argArrayOfStringsOutput
     * @param {HelperObjectForStack[]} argArrayStackToProcess
     * @param {string} argString
     * */
    static _getStringPlusComma = (
        argArrayOfStringsOutput,
        argArrayStackToProcess,
        argString
    ) =>
        argArrayOfStringsOutput.length === 0 &&
        argArrayStackToProcess.length === 1
            ? argString
            : argArrayStackToProcess.length > 0 &&
              !helperFormatting.regexIsClosure.test(argString)
            ? argString + `,`
            : argString;
}
