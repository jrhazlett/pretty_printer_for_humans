"use strict";
/*
This class prevents infinite loops from circular references if the option is enabled in the pretty printer.

Its only instantiated if the option is enabled, and its scope is limited to only pformat()

The scope of this class' instance is limited exclusively to each pformat() run. This prevents cross-
contamination and potential 'races to the finish.'
*/
import helperEnumDataTypes from "./helperEnumDataTypes.js";
import HelperObjectForStack from "./helperObjectForStack.js";

export default class HelperCircularReferences {
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
      // If arg is already in the set, then return true
      //
      if (this.fieldSetOfObjectIds.has(argArrayOrObject)) {
        return true;
      } else {
        //
        // If the object hasn't already been traversed, then add it to the set
        //
        this.fieldSetOfObjectIds.add(argArrayOrObject);
      }
    }
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
  // Setup
  //
  constructor() {
    this.fieldSetOfObjectIds = new Set();
  }
}
