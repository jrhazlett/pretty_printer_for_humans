"use strict";
/*
This module processes objects and routes their children to one of the
'helperProcessChild' modules.
*/
import helperEnumDataTypes from "../helpersSupport/helperEnumDataTypes.js";
import helperFormatting from "../helpersSupport/helperFormatting.js";
import helperGlobals from "../helpersSupport/helperGlobals.js";
import HelperObjectForStack from "../helpersSupport/helperObjectForStack.js";
import HelperOptions from "../helpersSupport/helperOptions.js";
import helperProcessChild from "../helpersProcessingChildren/helperProcessChild.js";
import helperProcessChildComplexLast from "../helpersProcessingChildren/helperProcessChildComplexLast.js";

export default class helperProcessMap {
  /**
   * Process object's keys and associated children
   *
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static processMap = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
  ) => {
    const enumSortOptions = HelperOptions.fieldEnumSortOptions;
    switch (argHelperOptions.argEnumSortOption) {
      case enumSortOptions.fieldOptionPrintAlphabetical:
        helperProcessMap._processMapPrintAlphabetical(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectFromStack
        );
        break;
      case enumSortOptions.fieldOptionPrintComplexLast:
        helperProcessMap._processMapPrintComplexLast(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectFromStack
        );
        break;
      case enumSortOptions.fieldOptionPrintOriginalOrder:
        helperProcessMap._processMapPrintOriginalOrder(
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
        helperProcessMap._processMapPrintComplexLast(
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
  static _processMapPrintAlphabetical = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
  ) => {
    let arrayOfKeys = helperFormatting.getArrayOfStringsSortedCaseInsensitive([
      ...argObjectFromStack.fieldValue.keys(),
    ]);
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
      const itemValue = argObjectFromStack.fieldValue.get(itemKey);
      helperProcessChild.processChild(
        argArrayStackToUpdate,
        argHelperCircularReferences,
        argHelperOptions,
        new HelperObjectForStack(
          helperEnumDataTypes.getEnumDataType(itemValue),
          intLayersIn,
          // Reminder: This prevents a crash relating to Symbol() keys.
          // This call is happening here, rather than in the lower modules to keep the type checks and processing low.
          helperGlobals.getStringFromArg(itemKey),
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
  static _processMapPrintComplexLast = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
  ) => {
    const arrayOfKeys = helperFormatting.getArrayOfStringsSortedCaseInsensitive(
      [...argObjectFromStack.fieldValue.keys()]
    );
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
        helperProcessMap._routeKeysToComplexOrSimple(
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
        helperProcessMap._routeKeysToComplexOrSimple(
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
          argObjectFromStack.fieldIntLayersIn + 1,
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
          argObjectFromStack.fieldIntLayersIn + 1,
          // Reminder: This prevents a crash relating to Symbol() keys.
          // This call is happening here, rather than in the lower modules to keep the type checks and processing low.
          helperGlobals.getStringFromArg(itemKey),
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
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static _processMapPrintOriginalOrder = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectFromStack
  ) => {
    const arrayOfKeys = [...argObjectFromStack.fieldValue.keys()];
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
      const itemValue = argObjectFromStack.fieldValue.get(itemKey);
      helperProcessChild.processChild(
        argArrayStackToUpdate,
        argHelperCircularReferences,
        argHelperOptions,
        new HelperObjectForStack(
          helperEnumDataTypes.getEnumDataType(itemValue),
          intLayersIn,
          // Reminder: This prevents a crash relating to Symbol() keys.
          // This call is happening here, rather than in the lower modules to keep the type checks and processing low.
          helperGlobals.getStringFromArg(itemKey),
          itemValue
        ),
        argObjectFromStack
      );
    }
  };
}
