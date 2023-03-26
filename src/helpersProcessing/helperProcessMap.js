"use strict";
/*
This module processes objects and routes their children to one of the
'helperProcessChild' modules.
*/
import * as helperEnumDataTypes from "../helpersSupport/helperEnumDataTypes.js";
import * as helperFormatting from "../helpersSupport/helperFormatting.js";
import * as helperGlobals from "../helpersSupport/helperGlobals.js";
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
const processMap = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    switch (argHelperOptions.argEnumSortOption) {
        case enumSortOptions.fieldOptionPrintAlphabetical:
            processMapPrintAlphabetical(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        case enumSortOptions.fieldOptionPrintComplexLast:
            processMapPrintComplexLast(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        case enumSortOptions.fieldOptionPrintOriginalOrder:
            processMapPrintOriginalOrder(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        default:
            processMapPrintComplexLast(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
    }
};
export default processMap;

/**
 * @param {HelperObjectForStack[]} argArrayStackToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {HelperOptions} argHelperOptions
 * @param {HelperObjectForStack} argObjectFromStack
 * */
const processMapPrintAlphabetical = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    let arrayOfKeys = helperFormatting.getArrayOfStringsSortedCaseInsensitive([
        ...argObjectFromStack.fieldValue.keys(),
    ]);
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;

    let itemIntIndex = arrayOfKeys.length;
    while (--itemIntIndex >= 0) {
        const itemKey = arrayOfKeys[itemIntIndex];
        const itemValue = argObjectFromStack.fieldValue.get(itemKey);
        processChild(
            argArrayStackToUpdate,
            argHelperCircularReferences,
            argHelperOptions,
            new HelperObjectForStack(
                helperEnumDataTypes.getEnumDataType(itemValue),
                intLayersIn,
                helperGlobals.getStringFromArg(itemKey),
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
const processMapPrintComplexLast = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    const arrayOfKeys = helperFormatting.getArrayOfStringsSortedCaseInsensitive(
        [...argObjectFromStack.fieldValue.keys()]
    );

    let arrayOfPairsKeysAndTypesComplex = [];
    let arrayOfPairsKeysAndTypesSimple = [];
    if (argHelperOptions.argBoolHandleCircularReferences) {
        let itemIntIndex = -1;
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
        while (++itemIntIndex < intLength) {
            routeKeysToComplexOrSimple(
                arrayOfKeys,
                arrayOfPairsKeysAndTypesComplex,
                arrayOfPairsKeysAndTypesSimple,
                arrayOfKeys[itemIntIndex],
                argObjectFromStack
            );
        }
    }

    let itemIntIndex;
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
                argObjectFromStack.fieldIntLayersIn + 1,
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
                argObjectFromStack.fieldIntLayersIn + 1,
                helperGlobals.getStringFromArg(itemKey),
                itemValue
            ),
            argObjectFromStack
        );
    }
};

/**
 * @param {any[]} argArrayOfKeys
 * @param {(any|any)[]} argArrayOfPairsKeysValuesTypesComplexToUpdate
 * @param {(any|any)[]} argArrayOfPairsKeysValuesTypesSimpleToUpdate
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
    const itemValue = argObjectFromStack.fieldValue.get(argKey);
    const itemEnumType = helperEnumDataTypes.getEnumDataType(itemValue);
    if (helperEnumDataTypes.isComplexEnumType(itemEnumType)) {
        argArrayOfPairsKeysValuesTypesComplexToUpdate.push([
            argKey,
            itemValue,
            itemEnumType,
        ]);
    } else {
        argArrayOfPairsKeysValuesTypesSimpleToUpdate.push([
            argKey,
            itemValue,
            itemEnumType,
        ]);
    }
};

/**
 * @param {HelperObjectForStack[]} argArrayStackToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {HelperOptions} argHelperOptions
 * @param {HelperObjectForStack} argObjectFromStack
 * */
const processMapPrintOriginalOrder = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    const arrayOfKeys = [...argObjectFromStack.fieldValue.keys()];
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;

    let itemIntIndex = arrayOfKeys.length;
    while (--itemIntIndex >= 0) {
        const itemKey = arrayOfKeys[itemIntIndex];
        const itemValue = argObjectFromStack.fieldValue.get(itemKey);
        processChild(
            argArrayStackToUpdate,
            argHelperCircularReferences,
            argHelperOptions,
            new HelperObjectForStack(
                helperEnumDataTypes.getEnumDataType(itemValue),
                intLayersIn,
                helperGlobals.getStringFromArg(itemKey),
                itemValue
            ),
            argObjectFromStack
        );
    }
};
