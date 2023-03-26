import * as helperEnumDataTypes from "./helperEnumDataTypes.js";
import * as helperFormatting from "./helperFormatting.js";

import HelperCircularReferences from "./helperCircularReferences.js";

/**
 * @param {any} arg
 * @returns {string[]}
 * */
export const getArrayOfPathsInArg = (arg) => {
    const helperCircularReferences = new HelperCircularReferences();
    const arrayToReturn = [];
    const stackToProcess = [
        [arg, helperEnumDataTypes.getEnumDataType(arg), []],
    ];
    while (stackToProcess.length > 0) {
        const [item, itemEnumDataType, itemArrayPath] = stackToProcess.pop();
        switch (itemEnumDataType) {
            case helperEnumDataTypes.fieldArray:
                getArrayOfPathsInArgArray(
                    item,
                    itemArrayPath,
                    arrayToReturn,
                    helperCircularReferences,
                    stackToProcess
                );
                break;
            case helperEnumDataTypes.fieldMap:
                getObjectOfPathsInArgMap(
                    itemArrayPath,
                    arrayToReturn,
                    helperCircularReferences,
                    item,
                    stackToProcess
                );
                break;
            case helperEnumDataTypes.fieldObject:
                getObjectOfPathsInArgObject(
                    itemArrayPath,
                    arrayToReturn,
                    helperCircularReferences,
                    item,
                    stackToProcess
                );
                break;
        }
    }
    return helperFormatting.getArrayOfStringsSortedCaseInsensitive(
        arrayToReturn
    );
};

/**
 * @param {any[]} argArray
 * @param {any[]} argArrayPath
 * @param {any[]} argArrayToReturnToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {(any|number|[])[]} argStackToProcessToUpdate
 * */
const getArrayOfPathsInArgArray = (
    argArray,
    argArrayPath,
    argArrayToReturnToUpdate,
    argHelperCircularReferences,
    argStackToProcessToUpdate
) => {
    let itemIntIndex = 0;
    const intLength = argArray.length;
    while (++itemIntIndex < intLength) {
        const itemSub = argArray[itemIntIndex];
        const itemEnumDataType = helperEnumDataTypes.getEnumDataType(itemSub);
        const itemArrayPathSub = getArrayPath(argArrayPath, itemIntIndex);
        if (argHelperCircularReferences.isAlreadyTraversed(itemSub)) {
            argArrayToReturnToUpdate.push(
                getArrayPathWithCircularReference(
                    itemArrayPathSub,
                    itemEnumDataType
                )
            );
        } else {
            argArrayToReturnToUpdate.push(itemArrayPathSub);
            argStackToProcessToUpdate.push([
                itemSub,
                itemEnumDataType,
                itemArrayPathSub,
            ]);
        }
    }
};

/**
 * @param {any[]} argArrayPath
 * @param {any[]} argArrayToReturnToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {Object} argObject
 * @param {(any|number|[])[]} argStackToProcessToUpdate
 * */
const getObjectOfPathsInArgObject = (
    argArrayPath,
    argArrayToReturnToUpdate,
    argHelperCircularReferences,
    argObject,
    argStackToProcessToUpdate
) => {
    const arrayOfKeys = Object.keys(argObject);
    let itemIntIndex = -1;
    const intLength = arrayOfKeys.length;
    while (++itemIntIndex < intLength) {
        const itemKeySub = arrayOfKeys[itemIntIndex];
        const itemSub = argObject[itemKeySub];
        const itemEnumDataType = helperEnumDataTypes.getEnumDataType(itemSub);
        const itemArrayPathSub = getArrayPath(argArrayPath, itemKeySub);
        if (argHelperCircularReferences.isAlreadyTraversed(itemSub)) {
            argArrayToReturnToUpdate.push(
                getArrayPathWithCircularReference(
                    itemArrayPathSub,
                    itemEnumDataType
                )
            );
        } else {
            argArrayToReturnToUpdate.push(itemArrayPathSub);
            argStackToProcessToUpdate.push([
                itemSub,
                itemEnumDataType,
                itemArrayPathSub,
            ]);
        }
    }
};

/**
 * @param {any[]} argArrayPath
 * @param {any[]} argArrayToReturnToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {Map} argMap
 * @param {(any|number|[])[]} argStackToProcessToUpdate
 * */
const getObjectOfPathsInArgMap = (
    argArrayPath,
    argArrayToReturnToUpdate,
    argHelperCircularReferences,
    argMap,
    argStackToProcessToUpdate
) => {
    const arrayOfKeys = argMap.keys();
    let itemIntIndex = -1;
    const intLength = arrayOfKeys.length;
    while (++itemIntIndex < intLength) {
        const itemKeySub = arrayOfKeys[itemIntIndex];
        const itemSub = argMap.get(itemKeySub);
        const itemEnumDataType = helperEnumDataTypes.getEnumDataType(itemSub);
        const itemArrayPathSub = getArrayPath(argArrayPath, itemKeySub);
        if (argHelperCircularReferences.isAlreadyTraversed(itemSub)) {
            argArrayToReturnToUpdate.push(
                getArrayPathWithCircularReference(
                    itemArrayPathSub,
                    itemEnumDataType
                )
            );
        } else {
            argArrayToReturnToUpdate.push(itemArrayPathSub);
            argStackToProcessToUpdate.push([
                itemSub,
                itemEnumDataType,
                itemArrayPathSub,
            ]);
        }
    }
};

/**
 * @param {any[]} argArrayPath
 * @param {number} argEnumDataType
 * @returns any[]
 * */
const getArrayPathWithCircularReference = (argArrayPath, argEnumDataType) => {
    switch (argEnumDataType) {
        case helperEnumDataTypes.fieldArray:
            return [...argArrayPath, "[ CIRCULAR REFERENCE ]"];

        case helperEnumDataTypes.fieldObject:
            return [...argArrayPath, "{ CIRCULAR REFERENCE }"];

        default:
            return argArrayPath;
    }
};

/**
 * @param {any[]} argArrayPathPrefix
 * @param {any} argKeyNew
 * @returns any[]
 * */
const getArrayPath = (argArrayPathPrefix, argKeyNew) => [
    ...argArrayPathPrefix,
    argKeyNew,
];
