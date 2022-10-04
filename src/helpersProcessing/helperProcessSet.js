"use strict";
/*
This module processes arrays and routes their children to one of the
'helperProcessChild' modules.
*/
import HelperCircularReferences from "../helpersSupport/helperCircularReferences.js";
import helperEnumDataTypes from "../helpersSupport/helperEnumDataTypes.js";
import helperGlobals from "../helpersSupport/helperGlobals.js";
import HelperObjectForStack from "../helpersSupport/helperObjectForStack.js";
import HelperOptions from "../helpersSupport/helperOptions.js";
import helperProcessChild from "../helpersProcessingChildren/helperProcessChild.js";
import helperProcessChildComplexLast from "../helpersProcessingChildren/helperProcessChildComplexLast.js";

export default class helperProcessSet {
  /**
   * Go through all indexes in array and routes its children to the stack in a printable format
   *
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static processSet = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
  ) => {
    const enumSortOptions = HelperOptions.fieldEnumSortOptions;
    switch (argHelperOptions.argEnumSortOption) {
      case enumSortOptions.fieldOptionPrintAlphabetical:
        this._processSet(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectFromStack
        );
        break;
      case enumSortOptions.fieldOptionPrintComplexLast:
        this._processSetComplexLast(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectFromStack
        );
        break;
      case enumSortOptions.fieldOptionPrintOriginalOrder:
        this._processSet(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectFromStack
        );
        break;
      default:
        this._processSet(
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
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static _processSet = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
  ) => {
    const arrayFromSet = helperProcessSet._getArrayFromSet(
      argObjectFromStack.fieldValue
    );
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
    for (
      let itemIntIndex = arrayFromSet.length - 1, intLength = 0;
      itemIntIndex >= intLength;
      itemIntIndex--
    ) {
      const itemValue = arrayFromSet[itemIntIndex];
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
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static _processSetComplexLast = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
  ) => {
    const arrayFromSet = helperProcessSet._getArrayFromSet(
      argObjectFromStack.fieldValue
    );
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
    for (
      let itemIntIndex = arrayFromSet.length - 1, intLength = 0;
      itemIntIndex >= intLength;
      itemIntIndex--
    ) {
      let itemValue = arrayFromSet[itemIntIndex];
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

  /**
   * @param {Set} argSet
   * @returns []
   * */
  static _getArrayFromSet = (argSet) => {
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
    for (
      let itemIntIndex = 0, intLength = arrayFromSet.length;
      itemIntIndex < intLength;
      itemIntIndex++
    ) {
      const item = arrayFromSet[itemIntIndex];
      if (helperEnumDataTypes.isComplexArg(item)) {
        arrayFromSetComplex.push(item);
      } else {
        // Reminder: We need to do a string conversion here to prevent Symbol() from crashing the sort attempt
        arrayFromSetPrimitive.push(helperGlobals.getStringFromArg(item));
      }
    }
    return [...arrayFromSetPrimitive.sort(), ...arrayFromSetComplex.sort()];
  };
}
