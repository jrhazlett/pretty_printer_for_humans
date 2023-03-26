"use strict";
/*
This module processes arrays and routes their children to one of the
'helperProcessChild' modules.
*/
import * as helperEnumDataTypes from "../helpersSupport/helperEnumDataTypes.js";
import HelperObjectForStack from "../helpersSupport/helperObjectForStack.js";
import HelperOptions, {
    enumSortOptions,
} from "../helpersSupport/helperOptions.js";
import processChild from "../helpersProcessingChildren/helperProcessChild.js";
import processChildComplexLast from "../helpersProcessingChildren/helperProcessChildComplexLast.js";

/**
 * Go through all indexes in array and routes its children to the stack in a printable format
 *
 * @param {HelperObjectForStack[]} argArrayStackToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {HelperOptions} argHelperOptions
 * @param {HelperObjectForStack} argObjectFromStack
 * */
const processArray = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    switch (argHelperOptions.argEnumSortOption) {
        case enumSortOptions.fieldOptionPrintAlphabetical:
            processArrayInOrder(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        case enumSortOptions.fieldOptionPrintComplexLast:
            processArrayComplexLast(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        case enumSortOptions.fieldOptionPrintOriginalOrder:
            processArrayInOrder(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        default:
            processArrayInOrder(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
    }
};
export default processArray;

/**
 * @param {HelperObjectForStack[]} argArrayStackToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {HelperOptions} argHelperOptions
 * @param {HelperObjectForStack} argObjectFromStack
 * */
const processArrayInOrder = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
    let itemIntIndex = argObjectFromStack.fieldValue.length;
    while (--itemIntIndex >= 0) {
        const itemValue = argObjectFromStack.fieldValue[itemIntIndex];
        processChild(
            argArrayStackToUpdate,
            argHelperCircularReferences,
            argHelperOptions,
            new HelperObjectForStack(
                helperEnumDataTypes.getEnumDataType(itemValue),
                intLayersIn,
                itemIntIndex,
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
const processArrayComplexLast = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
    let itemIntIndex = argObjectFromStack.fieldValue.length;
    while (--itemIntIndex >= 0) {
        let itemValue = argObjectFromStack.fieldValue[itemIntIndex];
        processChildComplexLast(
            argArrayStackToUpdate,
            argHelperCircularReferences,
            argHelperOptions,
            new HelperObjectForStack(
                helperEnumDataTypes.getEnumDataType(itemValue),
                intLayersIn,
                itemIntIndex,
                itemValue
            ),
            argObjectFromStack
        );
    }
};
