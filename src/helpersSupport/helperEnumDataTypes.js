"use strict";
/*
This is used for identifying and encoding data types.

Its 100% static, so it should only exist in memory once.
*/

// These data types are iterated through, but aren't actually directly printed to output
export const fieldArray = 1;
export const fieldObject = 2;

// These data types trigger debugging messages
export const fieldError = 3;
export const fieldPromise = 4;
export const fieldCircularReference = 5;

// This data type requires special formatting to avoid dumping the function
// defs onto the screen
export const fieldFunction = 6;

// This data type is generally what gets printed to the output
export const fieldEitherNonIterableOrString = 7;

export const fieldSymbol = 8;

export const fieldMap = 9;

export const fieldSet = 10;

/**
 * @param {any} arg
 * @returns number
 * */
export const getEnumDataType = (arg) => {
    switch (typeof arg) {
        case "function":
            return fieldFunction;
        case "object":
            return getEnumDataTypeForObject(arg);
        case "symbol":
            return fieldSymbol;

        case "undefined":
            return fieldEitherNonIterableOrString;
        default:
            return fieldEitherNonIterableOrString;
    }
};

/**
 * @param {Object} argObject
 * @return number
 * */
const getEnumDataTypeForObject = (argObject) => {
    switch (true) {
        case Array.isArray(argObject):
            return fieldArray;
        case argObject instanceof Error:
            return fieldError;
        case argObject instanceof Map:
            return fieldMap;
        case argObject === null:
            return fieldEitherNonIterableOrString;
        case argObject instanceof Promise:
            return fieldPromise;
        case argObject instanceof Set:
            return fieldSet;
        default:
            return fieldObject;
    }
};

/**
 * @param {any} arg
 * @returns string
 * */
export const getStringDataType = (arg) => {
    const stringDataType = typeof arg;
    switch (stringDataType) {
        case "object":
            switch (true) {
                case Array.isArray(arg):
                    return "array";
                case arg instanceof Error:
                    return "error";
                case arg instanceof Map:
                    return "map";
                case arg === null:
                    return "null";
                case arg instanceof Promise:
                    return "promise";
                case arg instanceof Set:
                    return "set";
                default:
                    return "object";
            }
        default:
            return stringDataType;
    }
};

export const fieldSetOfEnumsComplexTypes = new Set([
    fieldArray,
    fieldMap,
    fieldObject,
    fieldSet,
]);

/**
 * @param {any} arg
 * @returns boolean
 * */
export const isComplexArg = (arg) =>
    fieldSetOfEnumsComplexTypes.has(getEnumDataType(arg));

/**
 * @param {number} argEnumType
 * @returns boolean
 * */
export const isComplexEnumType = (argEnumType) =>
    fieldSetOfEnumsComplexTypes.has(argEnumType);
