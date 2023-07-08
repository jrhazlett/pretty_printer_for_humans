"use strict";
/*
Reminders for updating library support...

## All types need additions here:

src/helpersSupport/helperEnumDataTypes.js
-Add a numerical type to helperEnumDataTypes

src/helpersProcessing
-In all modules, add a switch entry for the data type

src/helpersProcessingChildren
-In all modules, add a switch entry for the data type


## When adding a complex type, make the following additions:

src/helpersProcessing
-Add a support module here

Note: For complex types, make sure to do the necessary print-friendly data conversions,
since not all data types are print-friendly by default.

src/helpersSupport/helperEnumDataTypes.js
-Add the data type to helperEnumDataTypes.fieldSetOfEnumsComplexTypes
Reminder: This is necessary to achieve the desired effect for fieldOptionPrintComplexLast
*/
import * as helperEnumDataTypes from "./helpersSupport/helperEnumDataTypes.js";
import * as helperFormatting from "./helpersSupport/helperFormatting.js";
import * as helperGlobals from "./helpersSupport/helperGlobals.js";

import * as helperGetArrayOfPathsInArg from "./helpersSupport/helperGetArrayOfPathsInArg.js";
import * as helperGetValueAtPathInArg from "./helpersSupport/helperGetValueAtPathInArg.js";

import HelperCircularReferences from "./helpersSupport/helperCircularReferences.js";
import HelperObjectForStack from "./helpersSupport/helperObjectForStack.js";
import HelperOptions, {
    objectOptionDefaults,
} from "./helpersSupport/helperOptions.js";

import processArray from "./helpersProcessing/helperProcessArray.js";
import processMap from "./helpersProcessing/helperProcessMap.js";
import processObject from "./helpersProcessing/helperProcessObject.js";
import processSet from "./helpersProcessing/helperProcessSet.js";

/**
 * This is a reference to HelperOptions so the developer doesn't need to import it independently
 * */
export const fieldHelperOptions = objectOptionDefaults;

/**
 * This provides a sorted list of paths which exist within the argument
 *
 * @param {any} arg
 * @returns {string[]}
 * */
export const getArrayOfPathsInArg =
    helperGetArrayOfPathsInArg.getArrayOfPathsInArg;

/**
 * This attempts to get the value stored at the end of path
 * If the path fails, then this function returns an Error object answering
 * the following questions:
 * - What key failed?
 * - What is the path used?
 * - Which part of the path exists?
 * - Which part of the path is missing?
 *
 * @param {any} arg
 * @param {any[]} argArrayPath
 * @returns any
 * */
export const getValueAtPathInArg =
    helperGetValueAtPathInArg.getValueAtPathInArg;

/**
 * This attempts to get the value stored at the end of path
 * If the path fails, then this function returns an Error object answering
 * the following questions:
 * - What key failed?
 * - What is the path used?
 * - Which part of the path exists?
 * - Which part of the path is missing?
 *
 * @param {any} arg
 * @param {any[]} argArrayPath
 * @returns any
 * */
export const getValueAtPathInArgAsync = (argArrayPath, arg) =>
    new Promise((resolve, reject) => {
        const result = getValueAtPathInArg(argArrayPath, arg);
        if (result instanceof Error) reject(result);
        else resolve(result);
    });

/**
 * This function returns true if the key is detected anywhere in the data structure.
 * If arg is not an array / object, then this will default to false.
 *
 * @param {any} arg
 * @param {any} argKey
 * @param {boolean} argBoolCaseSensitive
 * @returns boolean
 * */
export const isKeyInArg = (arg, argKey, argBoolCaseSensitive = true) => {
    const helperCircularReferences = new HelperCircularReferences();
    const enumDataTypeForArg = helperEnumDataTypes.getEnumDataType(arg);
    const stackToProcess = [[arg, enumDataTypeForArg]];
    while (stackToProcess.length > 0) {
        const [item, itemEnumDataType] = stackToProcess.pop();
        let itemIntIndex;
        let intLength;
        switch (itemEnumDataType) {
            case helperEnumDataTypes.fieldArray:
                itemIntIndex = -1;
                intLength = item.length;
                while (++itemIntIndex < intLength) {
                    const itemSub = item[itemIntIndex];
                    if (!helperCircularReferences.isAlreadyTraversed(itemSub))
                        stackToProcess.push([
                            itemSub,
                            helperEnumDataTypes.getEnumDataType(itemSub),
                        ]);
                }
                break;
            case helperEnumDataTypes.fieldObject:
                if (_isKeyInObject(item, argKey, argBoolCaseSensitive))
                    return true;
                const itemArrayOfValues = Object.values(item);
                itemIntIndex = -1;
                intLength = itemArrayOfValues.length;
                while (++itemIntIndex < intLength) {
                    const itemSub = itemArrayOfValues[itemIntIndex];
                    if (!helperCircularReferences.isAlreadyTraversed(itemSub))
                        stackToProcess.push([
                            itemSub,
                            helperEnumDataTypes.getEnumDataType(itemSub),
                        ]);
                }
                break;
        }
    }
    return false;
};

/**
 * @param {Object} argObject
 * @param {any} argKey
 * @param {boolean} argBoolCaseSensitive
 * */
export const _isKeyInObject = (argObject, argKey, argBoolCaseSensitive) => {
    if (argBoolCaseSensitive) return Object.hasOwnProperty.bind( argObject )(argKey);
    const stringKey = `${argKey}`;
    const arrayOfKeys = Object.keys(argObject);
    let itemIntIndex = -1;
    const intLength = arrayOfKeys.length;
    while (++itemIntIndex < intLength) {
        if (
            helperGlobals.areStringsEqualCaseInsensitive(
                `${arrayOfKeys[itemIntIndex]}`,
                stringKey
            )
        )
            return true;
    }
    return false;
};

/**
 * This function returns true if the key is detected anywhere in the data structure.
 * If arg is not an array / object, then this will default to false.
 *
 * @param {any} arg
 * @param {any} argKey
 * @param {boolean} argBoolCaseSensitive
 * @returns Promise
 * */
export const isKeyInArgAsync = async (
    arg,
    argKey,
    argBoolCaseSensitive = true
) =>
    new Promise((resolve) =>
        resolve(isKeyInArg(arg, argKey, argBoolCaseSensitive))
    );

/**
 * @param {any[]} argArrayPath
 * @param {any} arg
 * @returns boolean
 * */
export const isPathInArg = (argArrayPath, arg) => {
    let item = arg;
    let itemIntIndex = -1;
    const intLength = argArrayPath.length;
    while (++itemIntIndex < intLength) {
        let itemKey = argArrayPath[itemIntIndex];
        switch (helperEnumDataTypes.getEnumDataType(item)) {
            case helperEnumDataTypes.fieldArray:
                const itemIndex = getIntIndexFromKey(itemKey);
                if (itemIndex !== undefined) {
                    if (0 <= itemIndex && itemIndex < item.length)
                        item = item[itemIndex];
                    else return false;
                } else return false;
                break;
            case helperEnumDataTypes.fieldObject:
                if (Object.hasOwnProperty.bind( item )(itemKey)) item = item[itemKey];
                else return false;
                break;
            default:
                return false;
        }
    }
    return true;
};

/**
 * @param {any[]} argArrayPath
 * @param {any} arg
 * @returns Promise
 * */
export const isPathInArgAsync = (argArrayPath, arg) =>
    new Promise((resolve) => resolve(isPathInArg(argArrayPath, arg)));

/**
 * This function returns true if the top layer children has at least one array or object
 *
 * @param {any} arg
 * @returns boolean
 * */
export const isRecursive = (arg) => {
    const enumTypeForRoot = helperEnumDataTypes.getEnumDataType(arg);
    let itemIntIndex;
    let intLength;
    switch (enumTypeForRoot) {
        case helperEnumDataTypes.fieldArray:
            itemIntIndex = -1;
            intLength = arg.length;
            while (++itemIntIndex < intLength) {
                const itemEnumDataType = helperEnumDataTypes.getEnumDataType(
                    arg[itemIntIndex]
                );
                switch (itemEnumDataType) {
                    case helperEnumDataTypes.fieldArray:
                        return true;

                    case helperEnumDataTypes.fieldObject:
                        if (Object.keys(itemEnumDataType).length > 0)
                            return true;
                        break;

                    default:
                        break;
                }
            }
            break;

        case helperEnumDataTypes.fieldObject:
            const arrayOfKeys = Object.keys(arg);
            itemIntIndex = -1;
            intLength = arrayOfKeys.length;
            while (++itemIntIndex < intLength) {
                const itemValue = arg[arrayOfKeys[itemIntIndex]];
                switch (helperEnumDataTypes.getEnumDataType(itemValue)) {
                    case helperEnumDataTypes.fieldArray:
                        return true;

                    case helperEnumDataTypes.fieldObject:
                        if (Object.keys(itemValue).length > 0) return true;
                        break;

                    default:
                        break;
                }
            }
            break;
    }
    return false;
};

/**
 * This function is meant to format a given variable similarly to Python's PrettyPrint library
 *
 * @param {any} arg
 * @param {HelperOptions|{}} argHelperOptions
 * @returns string
 * */
export const pformat = (arg, argHelperOptions = {}) => {
    argHelperOptions = new HelperOptions(argHelperOptions);
    let helperCircularReferences;

    if (argHelperOptions.argBoolHandleCircularReferences)
        helperCircularReferences = new HelperCircularReferences();
    const arrayOfStringsOutput = [];
    const enumTypeForRoot = helperEnumDataTypes.getEnumDataType(arg);
    let stringClosure;
    switch (enumTypeForRoot) {
        case helperEnumDataTypes.fieldArray:
            arrayOfStringsOutput.push(`[`);
            stringClosure = `]`;
            break;
        case helperEnumDataTypes.fieldMap:
            arrayOfStringsOutput.push(`Map(`);
            stringClosure = `)`;
            break;
        case helperEnumDataTypes.fieldObject:
            arrayOfStringsOutput.push(`{`);
            stringClosure = `}`;
            break;
        case helperEnumDataTypes.fieldSet:
            arrayOfStringsOutput.push(`Set(`);
            stringClosure = `)`;
            break;
        default:
            stringClosure = ``;
            break;
    }
    const arrayStackToProcess = [
        new HelperObjectForStack(
            helperEnumDataTypes.fieldEitherNonIterableOrString,
            -1,
            ``,
            stringClosure
        ),
        new HelperObjectForStack(enumTypeForRoot, 0, ``, arg),
    ];
    while (arrayStackToProcess.length > 0) {
        const itemObjectFromStack = arrayStackToProcess.pop();
        switch (itemObjectFromStack.fieldIntDataType) {
            case helperEnumDataTypes.fieldArray:
                processArray(
                    arrayStackToProcess,
                    helperCircularReferences,
                    argHelperOptions,
                    itemObjectFromStack
                );
                break;
            case helperEnumDataTypes.fieldMap:
                processMap(
                    arrayStackToProcess,
                    helperCircularReferences,
                    argHelperOptions,
                    itemObjectFromStack
                );
                break;
            case helperEnumDataTypes.fieldObject:
                processObject(
                    arrayStackToProcess,
                    helperCircularReferences,
                    argHelperOptions,
                    itemObjectFromStack
                );
                break;
            case helperEnumDataTypes.fieldSet:
                processSet(
                    arrayStackToProcess,
                    helperCircularReferences,
                    argHelperOptions,
                    itemObjectFromStack
                );
                break;
            case helperEnumDataTypes.fieldCircularReference:
                if (argHelperOptions.argBoolPrintWarningOnCircularReference)
                    arrayOfStringsOutput.push(
                        `WARNING: value is a circular reference`
                    );
                arrayOfStringsOutput.push(
                    helperFormatting.getStringWhitespacePlusKeyPlusValuePlusComma(
                        arrayOfStringsOutput,
                        arrayStackToProcess,
                        argHelperOptions,
                        itemObjectFromStack
                    )
                );
                break;
            case helperEnumDataTypes.fieldError:
                if (argHelperOptions.argBoolPrintErrorOnErrorObject)
                    arrayOfStringsOutput.push(
                        `ERROR: value is an error object`
                    );
                arrayOfStringsOutput.push(
                    helperFormatting.getStringWhitespacePlusKeyPlusValuePlusComma(
                        arrayOfStringsOutput,
                        arrayStackToProcess,
                        argHelperOptions,
                        itemObjectFromStack
                    )
                );
                break;
            case helperEnumDataTypes.fieldFunction:
                arrayOfStringsOutput.push(
                    helperFormatting.getStringWhitespacePlusKeyPlusValuePlusComma(
                        arrayOfStringsOutput,
                        arrayStackToProcess,
                        argHelperOptions,
                        itemObjectFromStack
                    )
                );
                break;
            case helperEnumDataTypes.fieldPromise:
                if (argHelperOptions.argBoolPrintWarningOnPromise)
                    arrayOfStringsOutput.push(`WARNING: value is a promise`);
                arrayOfStringsOutput.push(
                    helperFormatting.getStringWhitespacePlusKeyPlusValuePlusComma(
                        arrayOfStringsOutput,
                        arrayStackToProcess,
                        argHelperOptions,
                        itemObjectFromStack
                    )
                );
                break;

            default:
                if (itemObjectFromStack.fieldKey.length === 0)
                    arrayOfStringsOutput.push(
                        helperFormatting.getStringPrefixWhitespacePlusValuePlusComma(
                            arrayOfStringsOutput,
                            arrayStackToProcess,
                            argHelperOptions,
                            itemObjectFromStack
                        )
                    );
                else
                    arrayOfStringsOutput.push(
                        helperFormatting.getStringWhitespacePlusKeyPlusValuePlusComma(
                            arrayOfStringsOutput,
                            arrayStackToProcess,
                            argHelperOptions,
                            itemObjectFromStack
                        )
                    );
                break;
        }
    }
    let stringToReturn =
        arrayOfStringsOutput.length > 0
            ? arrayOfStringsOutput.reduce(
                  (itemStringPrev, itemString) =>
                      itemStringPrev + `\n` + itemString
              )
            : ``;
    if (argHelperOptions.argStringNameToOutput !== undefined)
        stringToReturn = `${argHelperOptions.argStringNameToOutput} =\n${stringToReturn}`;
    if (argHelperOptions.argStringTrailingSpace !== undefined)
        stringToReturn += `\n${argHelperOptions.argStringTrailingSpace}`;
    return stringToReturn;
};

/**
 * This function is the same as pformat, except it executes asynchronously by returning
 * a promise
 *
 * @param {any} arg
 * @param {HelperOptions} argHelperOptions
 * @returns Promise
 * */
export const pformatAsync = async (
    arg,
    argHelperOptions = {
        argBoolHandleCircularReferences: true,
        argBoolPrintComplexLast: false,
        argBoolPrintErrorOnErrorObject: true,
        argBoolPrintWarningOnPromise: true,
        argStringIndentation: "    ",
    }
) => new Promise((resolve) => resolve(pformat(arg, argHelperOptions)));

/**
 * This function prints the value returned by pformat().
 * For deterministic purposes, there is no async variation of this function.
 *
 * @param {any} arg
 * @param {HelperOptions|{}} argHelperOptions
 * */
export const pprint = (arg, argHelperOptions = {}) =>
    console.log(pformat(arg, argHelperOptions));

/**
 * @param {any} argKey
 * @returns bigint|number
 * */
export const getIntIndexFromKey = (argKey) => {
    switch (typeof argKey) {
        case "bigint":
            return argKey;
        case "number":
            return Number.isInteger(argKey) ? argKey : undefined;
        case "string":
            return /^\d+$/.test(argKey) ? parseInt(argKey) : undefined;
        default:
            return undefined;
    }
};
