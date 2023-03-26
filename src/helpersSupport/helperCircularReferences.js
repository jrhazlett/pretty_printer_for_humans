"use strict";

import * as helperEnumDataTypes from "./helperEnumDataTypes.js";
import HelperObjectForStack from "./helperObjectForStack.js";

export default function HelperCircularReferences() {
    this.fieldSetOfObjectIds = new Set();

    /**
     * This function checks if an object as already been traversed. If it hasn't, then this function add the tracking data to the argument and then
     * record that entry in a Set for tracking nodes, to avoid repeatedly revisiting the same node.
     *
     * If it has already been traversed, return true
     *
     * If the object hasn't already been traversed, tag and record it. Then return false at the end
     * of the function
     *
     * @param {object} argArrayOrObject
     * @returns boolean
     * */
    this.isAlreadyTraversed = (argArrayOrObject) => {
        if (argArrayOrObject instanceof Object) {
            if (this.fieldSetOfObjectIds.has(argArrayOrObject)) return true;
            else this.fieldSetOfObjectIds.add(argArrayOrObject);
        }
        return false;
    };

    /**
     * This function checks if an object as already been traversed. If it hasn't, then this function add the tracking data to the argument and then
     * record that entry in a Set for tracking nodes, to avoid repeatedly revisiting the same node.
     *
     * If it has already been traversed, return true
     *
     * If the object hasn't already been traversed, tag and record it. Then return false at the end
     * of the function
     *
     * @param {HelperObjectForStack[]} argArrayStackToUpdate
     * @param {HelperObjectForStack} argObjectChildForStack
     * @param {HelperObjectForStack} argObjectFromStack
     * @returns boolean
     * */
    this.updateStackWithCircularReferenceMessage = (
        argArrayStackToUpdate,
        argObjectChildForStack,
        argObjectFromStack
    ) => {
        if (this.isAlreadyTraversed(argObjectChildForStack.fieldValue)) {
            argArrayStackToUpdate.push(
                new HelperObjectForStack(
                    helperEnumDataTypes.fieldCircularReference,
                    argObjectFromStack.fieldIntLayersIn,
                    argObjectChildForStack.fieldKey,
                    argObjectChildForStack.fieldIntDataType ===
                    helperEnumDataTypes.fieldArray
                        ? `[ CIRCULAR REFERENCE ]`
                        : `{ CIRCULAR REFERENCE }`
                )
            );
            return true;
        }
        return false;
    };
}
