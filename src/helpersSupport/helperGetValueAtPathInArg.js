import * as helperEnumDataTypes from "./helperEnumDataTypes.js";
import * as helperGlobals from "./helperGlobals.js";

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
export const getValueAtPathInArg = (argArrayPath, arg) => {
    const arrayOfKeysThatExist = [];
    let item = arg;
    let itemIntIndex = -1;
    const intLength = argArrayPath.length;
    while (++itemIntIndex < intLength) {
        let itemKey = argArrayPath[itemIntIndex];
        switch (helperEnumDataTypes.getEnumDataType(item)) {
            case helperEnumDataTypes.fieldArray:
                item = getValueAtPathInArgArray(
                    item,
                    arrayOfKeysThatExist,
                    argArrayPath,
                    itemKey
                );
                if (item instanceof Error) return item;
                break;
            case helperEnumDataTypes.fieldMap:
                item = getValueAtPathInArgMap(
                    arrayOfKeysThatExist,
                    argArrayPath,
                    itemKey,
                    item
                );
                if (item instanceof Error) return item;
                break;
            case helperEnumDataTypes.fieldObject:
                item = getValueAtPathInArgObject(
                    arrayOfKeysThatExist,
                    argArrayPath,
                    itemKey,
                    item
                );
                if (item instanceof Error) return item;
                break;
            default:
                return getErrorBecausePathFailed(
                    item,
                    argArrayPath,
                    arrayOfKeysThatExist,
                    itemKey
                );
        }
    }
    return item;
};

/**
 * @param {any[]} argArray
 * @param {any[]} argArrayOfKeysThatExistToUpdate
 * @param {any[]} argArrayPath
 * @param {any} argKey
 * @returns any
 * */
const getValueAtPathInArgArray = (
    argArray,
    argArrayOfKeysThatExistToUpdate,
    argArrayPath,
    argKey
) => {
    const intIndex = getIntIndexFromKey(argKey);
    if (intIndex !== undefined) {
        if (0 <= intIndex && intIndex < argArray.length) {
            argArrayOfKeysThatExistToUpdate.push(argKey);
            return argArray[intIndex];
        } else {
            return getErrorBecausePathFailed(
                argArray,
                argArrayPath,
                argArrayOfKeysThatExistToUpdate,
                argKey
            );
        }
    } else {
        return getErrorBecausePathFailed(
            argArray,
            argArrayPath,
            argArrayOfKeysThatExistToUpdate,
            argKey
        );
    }
};

/**
 * @param {any[]} argArrayOfKeysThatExistToUpdate
 * @param {any[]} argArrayPath
 * @param {any} argKey
 * @param {Map} argMap
 * */
const getValueAtPathInArgMap = (
    argArrayOfKeysThatExistToUpdate,
    argArrayPath,
    argKey,
    argMap
) => {
    if (argMap.has(argKey)) {
        argArrayOfKeysThatExistToUpdate.push(argKey);
        return argMap.get(argKey);
    } else {
        return getErrorBecausePathFailed(
            argMap,
            argArrayPath,
            argArrayOfKeysThatExistToUpdate,
            argKey
        );
    }
};

/**
 * @param {any[]} argArrayOfKeysThatExistToUpdate
 * @param {any[]} argArrayPath
 * @param {any} argKey
 * @param {Object} argObject
 * @returns any
 * */
const getValueAtPathInArgObject = (
    argArrayOfKeysThatExistToUpdate,
    argArrayPath,
    argKey,
    argObject
) => {
    if (Object.hasOwnProperty.bind( argObject )(argKey)) {
        argArrayOfKeysThatExistToUpdate.push(argKey);
        return argObject[argKey];
    } else {
        return getErrorBecausePathFailed(
            argObject,
            argArrayPath,
            argArrayOfKeysThatExistToUpdate,
            argKey
        );
    }
};

/**
 * @param {any} arg
 * @param {any[]} argArrayPath
 * @param {any[]} argArrayPathThatExists
 * @param {any} argKeyAtFailure
 * @returns Error
 * */
const getErrorBecausePathFailed = (
    arg,
    argArrayPath,
    argArrayPathThatExists,
    argKeyAtFailure
) => {
    const arrayToReturn = [
        `Failed to navigate path`,
        `keyAtFailure = ${helperGlobals.getStringFromArg(argKeyAtFailure)}`,
        `arrayPath = ${helperGlobals.getStringPrintableFromIterable(
            argArrayPath
        )}`,
        `arrayPathThatExists = ${argArrayPathThatExists}`,
        `arrayPathMissing = ${helperGlobals.getStringPrintableFromIterable(
            argArrayPath.slice(argArrayPathThatExists.length)
        )}`,
    ];

    switch (typeof arg) {
        case "object":
            switch (true) {
                case arg === null:
                    arrayToReturn.push(
                        `No keys available because node is null`
                    );
                    break;
                case Array.isArray(arg):
                    arrayToReturn.push(
                        `rangeOfIndexesAvailable = 0 - ${arg.length - 1}`
                    );
                    break;
                case arg instanceof Map:
                    arrayToReturn.push(
                        `arrayOfAvailableKeysAtFailure = ${helperGlobals.getStringPrintableFromIterable(
                            arg.keys()
                        )}`
                    );
                    break;
                default:
                    arrayToReturn.push(
                        `arrayOfAvailableKeysAtFailure = ${helperGlobals.getStringPrintableFromIterable(
                            Object.keys(arg)
                        )}`
                    );
                    break;
            }
            break;
        default:
            arrayToReturn.push(
                `No keys available because node is not a type of object`
            );
            break;
    }
    arrayToReturn.push(
        `dataTypeAtFailure = ${helperEnumDataTypes.getStringDataType(arg)}`
    );
    return Error(
        arrayToReturn.reduce(
            (itemStringPrev, itemString) => itemStringPrev + "\n" + itemString
        )
    );
};

/**
 * @param {any} argKey
 * @returns bigint|number
 * */
const getIntIndexFromKey = (argKey) => {
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
