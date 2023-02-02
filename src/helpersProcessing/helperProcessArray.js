"use strict";
/*
This module processes arrays and routes their children to one of the
'helperProcessChild' modules.
*/
import helperEnumDataTypes from "../helpersSupport/helperEnumDataTypes.js";
import HelperObjectForStack from "../helpersSupport/helperObjectForStack.js";
import HelperOptions from "../helpersSupport/helperOptions.js";
import helperProcessChild from "../helpersProcessingChildren/helperProcessChild.js";
import helperProcessChildComplexLast from "../helpersProcessingChildren/helperProcessChildComplexLast.js";
//
// Public
//
export default class helperProcessArray {
    /**
     * Go through all indexes in array and routes its children to the stack in a printable format
     *
     * @param {HelperObjectForStack[]} argArrayStackToUpdate
     * @param {HelperCircularReferences} argHelperCircularReferences
     * @param {HelperOptions} argHelperOptions
     * @param {HelperObjectForStack} argObjectFromStack
     * */
    static processArray = (
        argArrayStackToUpdate,
        argHelperCircularReferences,
        argHelperOptions,
        argObjectFromStack
    ) => {
        const enumSortOptions = HelperOptions.fieldEnumSortOptions;
        switch (argHelperOptions.argEnumSortOption) {
            case enumSortOptions.fieldOptionPrintAlphabetical:
                this._processArray(
                    argArrayStackToUpdate,
                    argHelperCircularReferences,
                    argHelperOptions,
                    argObjectFromStack
                );
                break;
            case enumSortOptions.fieldOptionPrintComplexLast:
                this._processArrayComplexLast(
                    argArrayStackToUpdate,
                    argHelperCircularReferences,
                    argHelperOptions,
                    argObjectFromStack
                );
                break;
            case enumSortOptions.fieldOptionPrintOriginalOrder:
                this._processArray(
                    argArrayStackToUpdate,
                    argHelperCircularReferences,
                    argHelperOptions,
                    argObjectFromStack
                );
                break;
            default:
                this._processArray(
                    argArrayStackToUpdate,
                    argHelperCircularReferences,
                    argHelperOptions,
                    argObjectFromStack
                );
                break;
        }
    };
    //
    // Private
    //
    /**
     * @param {HelperObjectForStack[]} argArrayStackToUpdate
     * @param {HelperCircularReferences} argHelperCircularReferences
     * @param {HelperOptions} argHelperOptions
     * @param {HelperObjectForStack} argObjectFromStack
     * */
    static _processArray = (
        argArrayStackToUpdate,
        argHelperCircularReferences,
        argHelperOptions,
        argObjectFromStack
    ) => {
        const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
        let itemIntIndex = argObjectFromStack.fieldValue.length;
        while (--itemIntIndex >= 0) {
            const itemValue = argObjectFromStack.fieldValue[itemIntIndex];
            helperProcessChild.processChild(
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
    static _processArrayComplexLast = (
        argArrayStackToUpdate,
        argHelperCircularReferences,
        argHelperOptions,
        argObjectFromStack
    ) => {
        const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
        let itemIntIndex = argObjectFromStack.fieldValue.length;
        while (--itemIntIndex >= 0) {
            let itemValue = argObjectFromStack.fieldValue[itemIntIndex];
            helperProcessChildComplexLast.processChild(
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
}
