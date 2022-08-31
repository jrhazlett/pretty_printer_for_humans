"use strict";
/*
This class prevents infinite loops from circular references if the option is enabled in the pretty printer.

Its only instantiated if the option is enabled, and its scope is limited to only pformatSync()

The scope of this class' instance is limited exclusively to each pformatSync() run. This prevents cross-
contamination and potential 'races to the finish.'
*/
import helperEnumDataTypes from "./helperEnumDataTypes.js";
import HelperObjectForStack from "./helperObjectForStack.js";

export default class HelperCircularReferences {
    /**
     * WARNING: This function changes the argument
     *
     * This function goes through goes through the argument and its children and removes the attribute associated with
     * HelperCircularReferences.fieldStringNamePropertyForTracking
     *
     * @param {any} argToUpdate
     * */
    static getObjectWithoutTrackingAttributes = (argToUpdate) => {
        const arrayToProcess =
            HelperCircularReferences._getArrayOfObjectsWithTrackingAttributes(
                argToUpdate
            );
        for (
            let itemIntIndex = 0, intLength = arrayToProcess.length;
            itemIntIndex < intLength;
            itemIntIndex++
        ) {
            HelperCircularReferences._deleteTrackingAttributeFromArg(
                arrayToProcess[itemIntIndex]
            );
        }
        return argToUpdate;
    };

    /**
     * @param {any} argToUpdate
     * @returns []
     * */
    static _getArrayOfObjectsWithTrackingAttributes = (argToUpdate) => {
        const arrayToReturn = [];
        const setForTracking = new Set();
        if (
            Object.hasOwn(
                argToUpdate,
                HelperCircularReferences.fieldStringNamePropertyForTracking
            )
        ) {
            setForTracking.add(
                HelperCircularReferences._getIdAtAttributeForTracking(
                    argToUpdate
                )
            );
            arrayToReturn.push(argToUpdate);
        }

        const arrayStackToProcess = [
            [argToUpdate, helperEnumDataTypes.getEnumDataType(argToUpdate)],
        ];
        while (arrayStackToProcess.length > 0) {
            const [itemFromStack, itemEnumDataType] = arrayStackToProcess.pop();
            switch (itemEnumDataType) {
                case helperEnumDataTypes.fieldArray:
                    for (
                        let itemIntIndex = 0, intLength = itemFromStack.length;
                        itemIntIndex < intLength;
                        itemIntIndex++
                    ) {
                        const itemSub = itemFromStack[itemIntIndex];
                        if (
                            Object.hasOwn(
                                itemSub,
                                HelperCircularReferences.fieldStringNamePropertyForTracking
                            )
                        ) {
                            const itemId =
                                HelperCircularReferences._getIdAtAttributeForTracking(
                                    itemSub
                                );
                            //
                            // If object is unique, then tag it for processing, otherwise exclude it
                            //
                            if (!setForTracking.has(itemId)) {
                                arrayToReturn.push(itemSub);
                                arrayStackToProcess.push([
                                    itemSub,
                                    helperEnumDataTypes.getEnumDataType(
                                        itemSub
                                    ),
                                ]);
                                setForTracking.add(itemId);
                            }
                        }
                    }
                    break;

                case helperEnumDataTypes.fieldObject:
                    const itemArrayOfKeys = Object.keys(itemFromStack);
                    for (
                        let itemIntIndex = 0,
                            intLength = itemArrayOfKeys.length;
                        itemIntIndex < intLength;
                        itemIntIndex++
                    ) {
                        const itemSub =
                            itemFromStack[itemArrayOfKeys[itemIntIndex]];
                        if (
                            Object.hasOwn(
                                itemSub,
                                HelperCircularReferences.fieldStringNamePropertyForTracking
                            )
                        ) {
                            const itemId =
                                HelperCircularReferences._getIdAtAttributeForTracking(
                                    itemSub
                                );
                            //
                            // If object is unique, then tag it for processing, otherwise exclude it
                            //
                            if (!setForTracking.has(itemId)) {
                                arrayToReturn.push(itemSub);
                                arrayStackToProcess.push([
                                    itemSub,
                                    helperEnumDataTypes.getEnumDataType(
                                        itemSub
                                    ),
                                ]);
                                setForTracking.add(itemId);
                            }
                        }
                    }
                    break;

                default:
                    break;
            }
        }
        return arrayToReturn;
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
     * @param {object} argArrayOrObject
     * @returns boolean
     * */
    isAlreadyTraversed = (argArrayOrObject) => {
        //
        // Check if argArrayOrObject is an Object (arrays will trigger this too)
        //
        if (argArrayOrObject instanceof Object) {
            //
            // Check if argArrayOrObject has the 'id' attribute
            //
            if (
                Object.hasOwn(
                    argArrayOrObject,
                    HelperCircularReferences.fieldStringNamePropertyForTracking
                )
            ) {
                //
                // Return true if set already contains the object id
                //
                if (
                    this.fieldSetOfObjectIds.has(
                        HelperCircularReferences._getIdAtAttributeForTracking(
                            argArrayOrObject
                        )
                    )
                ) {
                    return true;
                }
            }
        }
        //
        // If we get this far, then create the id and add it to the set
        //
        this._setIdAtAttributeForTracking(argArrayOrObject);
        //
        // Return false if we get this far and haven't returned true
        //
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
     * @param {[]} argArrayStackToUpdate
     * @param {HelperObjectForStack} argObjectChildForStack
     * @param {HelperObjectForStack} argObjectFromStack
     * @returns boolean
     * */
    updateStackWithCircularReferenceMessage = (
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
    //
    // Private
    //
    /**
     * Reminder: The attribute is set in the following places for convenience...
     * fieldStringNamePropertyForTracking
     * _deleteTrackingAttributeFromArg()
     * _getIdAtAttributeForTracking()
     * _setIdAtAttributeForTracking()
     * */
    static fieldStringNamePropertyForTracking = `____zzzPrettyPrinterIdForObjectForHumans____`;

    /**
     * This function removes the tracking attribute from a given object.
     *
     * @param {object} arg
     * */
    static _deleteTrackingAttributeFromArg = (arg) =>
        delete arg.____zzzPrettyPrinterIdForObjectForHumans____;

    /**
     * This function gets the attribute responsible for tracking whether or not an object has been visited.
     *
     * @param {object} arg
     * @returns number
     * */
    static _getIdAtAttributeForTracking = (arg) =>
        arg.____zzzPrettyPrinterIdForObjectForHumans____;

    /**
     * This function assigns a tracking number to an object for tracking within the Set.
     *
     * @param {object} arg
     * */
    _setIdAtAttributeForTracking = (arg) => {
        arg.____zzzPrettyPrinterIdForObjectForHumans____ =
            this.fieldIntIdCounter;
        this.fieldSetOfObjectIds.add(this.fieldIntIdCounter);
        this.fieldIntIdCounter++;
    };
    //
    // Setup
    //
    constructor() {
        this.fieldIntIdCounter = 0;
        this.fieldSetOfObjectIds = new Set();
    }
}
