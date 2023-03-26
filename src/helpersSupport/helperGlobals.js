/*
This module stores functions which benefit from being global, but don't necessarily fit anywhere else.

Everything here is const, so it should only exist in memory once.
*/
import * as helperEnumDataTypes from "./helperEnumDataTypes.js";

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;
/**
 * @param {Function} argFunction
 * @returns string[]
 * */
export const getArrayOfNamesForParameters = (argFunction) => {
    const stringFromCallback = argFunction
        .toString()
        .replace(STRIP_COMMENTS, ``);
    const arrayToReturn = stringFromCallback
        .slice(
            stringFromCallback.indexOf("(") + 1,
            stringFromCallback.indexOf(")")
        )
        .match(ARGUMENT_NAMES);
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
export const getStringFromArg = (arg) =>
    typeof arg === "symbol" ? arg.toString() : `${arg}`;

/**
 * Javascript's `${}` doesn't work in *all* cases, so this function is necessary to compensate.
 *
 * @param {any} arg
 * @param {number} argEnumDataType
 * @returns string
 * */
export const getStringFromArgViaEnumDataType = (arg, argEnumDataType) =>
    argEnumDataType === helperEnumDataTypes.fieldSymbol
        ? arg.toString()
        : `${arg}`;

/**
 * @param {any[]} argIterable
 * @return string
 * */
export const getStringPrintableFromIterable = (argIterable) => {
    const arrayFromArg = Array.from(argIterable);
    return arrayFromArg.length === 0
        ? "[]"
        : `[ ${arrayFromArg
              .map((item) => getStringFromArg(item))
              .reduce(
                  (itemStringPrev, itemString) =>
                      itemStringPrev + ", " + itemString
              )} ]`;
};

export const optionsForLocaleCompare = { sensitivity: "base" };

/**
 * @param {string} argStringOne
 * @param {string} argStringTwo
 * @returns boolean
 *
 * Reminder: How localeCompare() works...
 * If there's a clean one-to-one match, then it returns 0
 * All other scenarios, then it returns a positive or negative number
 *
 * Processing-wise, this apparently carries a performance boost over lower-case compares
 * */
export const areStringsEqualCaseInsensitive = (argStringOne, argStringTwo) =>
    argStringOne.localeCompare(
        argStringTwo,
        undefined,
        optionsForLocaleCompare
    ) === 0;
