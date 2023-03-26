"use strict";
/*
This module processes arrays and routes their children to one of the
'helperProcessChild' modules.
*/
import HelperCircularReferences from "../helpersSupport/helperCircularReferences.js";
import * as helperEnumDataTypes from "../helpersSupport/helperEnumDataTypes.js";
import * as helperGlobals from "../helpersSupport/helperGlobals.js";
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
const processSet = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    switch (argHelperOptions.argEnumSortOption) {
        case enumSortOptions.fieldOptionPrintAlphabetical:
            processSetOriginalOrder(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        case enumSortOptions.fieldOptionPrintComplexLast:
            processSetComplexLast(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        case enumSortOptions.fieldOptionPrintOriginalOrder:
            processSetOriginalOrder(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
        default:
            processSetOriginalOrder(
                argArrayStackToUpdate,
                argHelperCircularReferences,
                argHelperOptions,
                argObjectFromStack
            );
            break;
    }
};
export default processSet;

/**
 * @param {HelperObjectForStack[]} argArrayStackToUpdate
 * @param {HelperCircularReferences} argHelperCircularReferences
 * @param {HelperOptions} argHelperOptions
 * @param {HelperObjectForStack} argObjectFromStack
 * */
const processSetOriginalOrder = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    const arrayFromSet = getArrayFromSet(argObjectFromStack.fieldValue);
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
    let itemIntIndex = arrayFromSet.length;
    while (--itemIntIndex >= 0) {
        const itemValue = arrayFromSet[itemIntIndex];
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
const processSetComplexLast = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
) => {
    const arrayFromSet = getArrayFromSet(argObjectFromStack.fieldValue);
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
    let itemIntIndex = arrayFromSet.length;
    while (--itemIntIndex >= 0) {
        let itemValue = arrayFromSet[itemIntIndex];
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

/**
 * @param {Set} argSet
 * @returns any[]
 * */
const getArrayFromSet = (argSet) => {
    /*
    Reminders:
    This custom function is needed here to solve a couple of challenges...

    - Since sets aren't really meant to maintain their order, it makes sense to just sort the values
    - Since we're doing the sort attempt, complex objects should move to the end
    - To avoid Symbol() from breaking the sort, all values need to go through the generic string converter
    */
    const arrayFromSet = Array.from(argSet);
    const arrayFromSetPrimitive = [];
    const arrayFromSetComplex = [];
    let itemIntIndex = -1;
    const intLength = arrayFromSet.length;
    while (++itemIntIndex < intLength) {
        const item = arrayFromSet[itemIntIndex];
        if (helperEnumDataTypes.isComplexArg(item))
            arrayFromSetComplex.push(item);
        else arrayFromSetPrimitive.push(helperGlobals.getStringFromArg(item));
    }
    return [...arrayFromSetPrimitive.sort(), ...arrayFromSetComplex.sort()];
};
