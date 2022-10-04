"use strict";
/*
This module processes objects and routes their children to one of the
'helperProcessChild' modules.
*/
import helperEnumDataTypes from "../helpersSupport/helperEnumDataTypes.js";
import helperFormatting from "../helpersSupport/helperFormatting.js";
import HelperObjectForStack from "../helpersSupport/helperObjectForStack.js";
import HelperOptions from "../helpersSupport/helperOptions.js";
import helperProcessChild from "../helpersProcessingChildren/helperProcessChild.js";
import helperProcessChildComplexLast from "../helpersProcessingChildren/helperProcessChildComplexLast.js";

export default class helperProcessObject {
  /**
   * Process object's keys and associated children
   *
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static processObject = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
  ) => {
    const enumSortOptions = HelperOptions.fieldEnumSortOptions;
    switch (argHelperOptions.argEnumSortOption) {
      case enumSortOptions.fieldOptionPrintAlphabetical:
        helperProcessObject._processObjectPrintAlphabetical(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectFromStack
        );
        break;
      case enumSortOptions.fieldOptionPrintComplexLast:
        helperProcessObject._processObjectPrintComplexLast(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectFromStack
        );
        break;
      case enumSortOptions.fieldOptionPrintOriginalOrder:
        helperProcessObject._processObjectPrintOriginalOrder(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectFromStack
        );
        break;
      //
      // If no option is selected, then default to complex objects last
      //
      default:
        helperProcessObject._processObjectPrintComplexLast(
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
  static _processObjectPrintAlphabetical = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
  ) => {
    let arrayOfKeys = helperFormatting.getArrayOfStringsSortedCaseInsensitive(
      Object.keys(argObjectFromStack.fieldValue)
    );
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
    //
    // Go through each key and process the associated value
    //
    for (
      let itemIntIndex = arrayOfKeys.length - 1, intLength = 0;
      itemIntIndex >= intLength;
      itemIntIndex--
    ) {
      const itemKey = arrayOfKeys[itemIntIndex];
      const itemValue = argObjectFromStack.fieldValue[itemKey];
      helperProcessChild.processChild(
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
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static _processObjectPrintComplexLast = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
  ) => {
    const arrayOfKeys = helperFormatting.getArrayOfStringsSortedCaseInsensitive(
      Object.keys(argObjectFromStack.fieldValue)
    );
    const intLayersIn = argObjectFromStack.fieldIntLayersIn + 1;
    //
    // Route keys to complex and simple
    //
    let arrayOfPairsKeysAndTypesComplex = [];
    let arrayOfPairsKeysAndTypesSimple = [];
    if (argHelperOptions.argBoolHandleCircularReferences) {
      for (
        let itemIntIndex = 0, intLength = arrayOfKeys.length;
        itemIntIndex < intLength;
        itemIntIndex++
      ) {
        const itemKey = arrayOfKeys[itemIntIndex];
        helperProcessObject._routeKeysToComplexOrSimple(
          arrayOfKeys,
          arrayOfPairsKeysAndTypesComplex,
          arrayOfPairsKeysAndTypesSimple,
          itemKey,
          argObjectFromStack
        );
      }
    } else {
      for (
        let itemIntIndex = 0, intLength = arrayOfKeys.length;
        itemIntIndex < intLength;
        itemIntIndex++
      ) {
        helperProcessObject._routeKeysToComplexOrSimple(
          arrayOfKeys,
          arrayOfPairsKeysAndTypesComplex,
          arrayOfPairsKeysAndTypesSimple,
          arrayOfKeys[itemIntIndex],
          argObjectFromStack
        );
      }
    }
    //
    // Append complex objects to stack
    //
    for (
      let itemIntIndex = arrayOfPairsKeysAndTypesComplex.length - 1,
        intLength = 0;
      itemIntIndex >= intLength;
      itemIntIndex--
    ) {
      const [itemKey, itemValue, itemEnumDataType] =
        arrayOfPairsKeysAndTypesComplex[itemIntIndex];
      helperProcessChildComplexLast.processChild(
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
    //
    // Append simple objects to output
    //

    for (
      let itemIntIndex = arrayOfPairsKeysAndTypesSimple.length - 1,
        intLength = 0;
      itemIntIndex >= intLength;
      itemIntIndex--
    ) {
      const [itemKey, itemValue, itemEnumDataType] =
        arrayOfPairsKeysAndTypesSimple[itemIntIndex];
      helperProcessChildComplexLast.processChild(
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
   * @param {[]} argArrayOfKeys
   * @param {[]} argArrayOfPairsKeysValuesTypesComplexToUpdate
   * @param {[]} argArrayOfPairsKeysValuesTypesSimpleToUpdate
   * @param {any} argKey
   * @param {object} argObjectFromStack
   * */
  static _routeKeysToComplexOrSimple = (
    argArrayOfKeys,
    argArrayOfPairsKeysValuesTypesComplexToUpdate,
    argArrayOfPairsKeysValuesTypesSimpleToUpdate,
    argKey,
    argObjectFromStack
  ) => {
    const itemValue = argObjectFromStack.fieldValue[argKey];
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
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static _processObjectPrintOriginalOrder = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
  ) => {
    const arrayOfKeys = Object.keys(argObjectFromStack.fieldValue);
    const intLayersInt = argObjectFromStack.fieldIntLayersIn + 1;
    //
    // Go through each key and process the associated value
    //
    for (
      let itemIntIndex = arrayOfKeys.length - 1, intLength = 0;
      itemIntIndex >= intLength;
      itemIntIndex--
    ) {
      const itemKey = arrayOfKeys[itemIntIndex];
      const itemValue = argObjectFromStack.fieldValue[itemKey];
      helperProcessChild.processChild(
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
}
