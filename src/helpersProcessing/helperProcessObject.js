"use strict";
/*
This module processes objects and routes their children to one of the
'helperProcessChild' modules.
*/
import * as helperEnumDataTypes from "../helpersSupport/helperEnumDataTypes.js";
import * as helperFormatting from "../helpersSupport/helperFormatting.js";
import HelperObjectForStack from "../helpersSupport/helperObjectForStack.js";
import HelperOptions, {
    enumSortOptions,
} from "../helpersSupport/helperOptions.js";
import processChild from "../helpersProcessingChildren/helperProcessChild.js";
import processChildComplexLast from "../helpersProcessingChildren/helperProcessChildComplexLast.js";

/**
 * Process object's keys and associated children
 *
 * @param {HelperObjectForStack[]} argArrayStackToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {HelperOptions} argHelperOptions
 * @param {HelperObjectForStack} argObjectFromStack
 * */
const processObject = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    switch (argHelperOptions.argEnumSortOption) {
        case enumSortOptions.fieldOptionPrintAlphabetical:
            processObjectPrintAlphabetical(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        case enumSortOptions.fieldOptionPrintComplexLast:
            processObjectPrintComplexLast(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        case enumSortOptions.fieldOptionPrintOriginalOrder:
            processObjectPrintOriginalOrder(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        default:
            processObjectPrintComplexLast(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
    }
};
export default processObject;

/**
 * @param {HelperObjectForStack[]} argArrayStackToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {HelperOptions} argHelperOptions
 * @param {HelperObjectForStack} argObjectFromStack
 * */
const processObjectPrintAlphabetical = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    let arrayOfKeys = helperFormatting.getArrayOfStringsSortedCaseInsensitive(
        Object.keys(argObjectFromStack.fieldValue)
    );
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
    let itemIntIndex = arrayOfKeys.length;
    while (--itemIntIndex >= 0) {
        const itemKey = arrayOfKeys[itemIntIndex];
        const itemValue = argObjectFromStack.fieldValue[itemKey];
        processChild(
            argArrayStackToUpdate,
            argHelperCircularReferences,
            argHelperOptions,
            new HelperObjectForStack(
                helperEnumDataTypes.getEnumDataType(itemValue),
                intLayersIn,
                itemKey,
                itemValue
            ),
            argObjectFromStack
        );
    }
};

/**
 * @param {HelperObjectForStack[]} argArrayStackToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {HelperOptions} argHelperOptions
 * @param {HelperObjectForStack} argObjectFromStack
 * */
const processObjectPrintComplexLast = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    const arrayOfKeys = helperFormatting.getArrayOfStringsSortedCaseInsensitive(
        Object.keys(argObjectFromStack.fieldValue)
    );
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
    let arrayOfPairsKeysAndTypesComplex = [];
    let arrayOfPairsKeysAndTypesSimple = [];
    let itemIntIndex;
    if (argHelperOptions.argBoolHandleCircularReferences) {
        itemIntIndex = -1;
        const intLength = arrayOfKeys.length;
        while (++itemIntIndex < intLength) {
            const itemKey = arrayOfKeys[itemIntIndex];
            routeKeysToComplexOrSimple(
                arrayOfKeys,
                arrayOfPairsKeysAndTypesComplex,
                arrayOfPairsKeysAndTypesSimple,
                itemKey,
                argObjectFromStack
            );
        }
    } else {
        let itemIntIndex = -1;
        const intLength = arrayOfKeys.length;
        while (++itemIntIndex < intLength)
            routeKeysToComplexOrSimple(
                arrayOfKeys,
                arrayOfPairsKeysAndTypesComplex,
                arrayOfPairsKeysAndTypesSimple,
                arrayOfKeys[itemIntIndex],
                argObjectFromStack
            );
    }
    itemIntIndex = arrayOfPairsKeysAndTypesComplex.length;
    while (--itemIntIndex >= 0) {
        const [itemKey, itemValue, itemEnumDataType] =
            arrayOfPairsKeysAndTypesComplex[itemIntIndex];
        processChildComplexLast(
            argArrayStackToUpdate,
            argHelperCircularReferences,
            argHelperOptions,
            new HelperObjectForStack(
                itemEnumDataType,
                intLayersIn,
                itemKey,
                itemValue
            ),
            argObjectFromStack
        );
    }
    itemIntIndex = arrayOfPairsKeysAndTypesSimple.length;
    while (--itemIntIndex >= 0) {
        const [itemKey, itemValue, itemEnumDataType] =
            arrayOfPairsKeysAndTypesSimple[itemIntIndex];
        processChildComplexLast(
            argArrayStackToUpdate,
            argHelperCircularReferences,
            argHelperOptions,
            new HelperObjectForStack(
                itemEnumDataType,
                intLayersIn,
                itemKey,
                itemValue
            ),
            argObjectFromStack
        );
    }
};

/**
 * @param {any[]} argArrayOfKeys
 * @param {(any|any|number)[]} argArrayOfPairsKeysValuesTypesComplexToUpdate
 * @param {[]} argArrayOfPairsKeysValuesTypesSimpleToUpdate
 * @param {any} argKey
 * @param {object} argObjectFromStack
 * */
const routeKeysToComplexOrSimple = (
    argArrayOfKeys,
    argArrayOfPairsKeysValuesTypesComplexToUpdate,
    argArrayOfPairsKeysValuesTypesSimpleToUpdate,
    argKey,
    argObjectFromStack
) => {
    const itemValue = argObjectFromStack.fieldValue[argKey];
    const itemEnumType = helperEnumDataTypes.getEnumDataType(itemValue);
    if (helperEnumDataTypes.isComplexEnumType(itemEnumType))
        argArrayOfPairsKeysValuesTypesComplexToUpdate.push([
            argKey,
            itemValue,
            itemEnumType,
        ]);
    else
        argArrayOfPairsKeysValuesTypesSimpleToUpdate.push([
            argKey,
            itemValue,
            itemEnumType,
        ]);
};

/**
 * @param {HelperObjectForStack[]} argArrayStackToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {HelperOptions} argHelperOptions
 * @param {HelperObjectForStack} argObjectFromStack
 * */
const processObjectPrintOriginalOrder = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    const arrayOfKeys = Object.keys(argObjectFromStack.fieldValue);
    const intLayersInt = argObjectFromStack.fieldIntLayersIn + 1;
    let itemIntIndex = arrayOfKeys.length;
    while (--itemIntIndex >= 0) {
        const itemKey = arrayOfKeys[itemIntIndex];
        const itemValue = argObjectFromStack.fieldValue[itemKey];
        processChild(
            argArrayStackToUpdate,
            argHelperCircularReferences,
            argHelperOptions,
            new HelperObjectForStack(
                helperEnumDataTypes.getEnumDataType(itemValue),
                intLayersInt,
                itemKey,
                itemValue
            ),
            argObjectFromStack
        );
    }
};
