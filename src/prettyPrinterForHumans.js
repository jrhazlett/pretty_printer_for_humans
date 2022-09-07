"use strict";

import HelperCircularReferences from "./helpersSupport/helperCircularReferences.js";
import helperEnumDataTypes from "./helpersSupport/helperEnumDataTypes.js";
import helperFormatting from "./helpersSupport/helperFormatting.js";
import helperLogic from "./helpersSupport/helperLogic.js";
import HelperObjectForStack from "./helpersSupport/helperObjectForStack.js";
import helperProcessArray from "./helpersProcessing/helperProcessArray.js";
import helperProcessObject from "./helpersProcessing/helperProcessObject.js";
import HelperOptions from "./helpersSupport/helperOptions.js";

class _HelperOptionsIsKeyInArg {
  constructor({ argBoolCaseSensitive }) {
    this.argBoolCaseSensitive =
      argBoolCaseSensitive === undefined ? true : argBoolCaseSensitive;
  }
}

export default class prettyPrinterForHumans {
  /**
   * This is a reference to HelperOptions so the developer doesn't need to import it independently
   * */
  static fieldHelperOptions = HelperOptions;

  //
  // Get
  //
  /**
   * This returns a sorted array of strings.
   *
   * @param {any} arg
   * @returns []
   * */
  static getArrayOfStringsPathsInArg = (arg) => {
    const helperCircularReferences = new HelperCircularReferences();

    const arrayToReturn = [];

    const stackToProcess = [
      [arg, helperEnumDataTypes.getEnumDataType(arg), ""],
    ];

    while (stackToProcess.length > 0) {
      const [item, itemEnumDataType, itemStringPath] = stackToProcess.pop();
      switch (itemEnumDataType) {
        case helperEnumDataTypes.fieldArray:
          for (
            let itemIntIndex = 0, intLength = item.length;
            itemIntIndex < intLength;
            itemIntIndex++
          ) {
            const itemSub = item[itemIntIndex];
            const itemEnumDataType =
              helperEnumDataTypes.getEnumDataType(itemSub);
            const itemStringPathSub = prettyPrinterForHumans._getStringPath(
              itemStringPath,
              `${itemIntIndex}`
            );

            if (helperCircularReferences.isAlreadyTraversed(itemSub)) {
              arrayToReturn.push(
                prettyPrinterForHumans._getStringPathWithCircularReference(
                  itemStringPathSub,
                  itemEnumDataType
                )
              );
            } else {
              arrayToReturn.push(itemStringPathSub);
              stackToProcess.push([
                itemSub,
                itemEnumDataType,
                itemStringPathSub,
              ]);
            }
          }
          break;

        case helperEnumDataTypes.fieldObject:
          const arrayOfKeys = Object.keys(item);
          for (
            let itemIntIndex = 0, intLength = arrayOfKeys.length;
            itemIntIndex < intLength;
            itemIntIndex++
          ) {
            const itemKeySub = arrayOfKeys[itemIntIndex];
            const itemSub = item[itemKeySub];
            const itemEnumDataType =
              helperEnumDataTypes.getEnumDataType(itemSub);
            const itemStringPathSub = prettyPrinterForHumans._getStringPath(
              itemStringPath,
              `${itemKeySub}`
            );

            if (helperCircularReferences.isAlreadyTraversed(itemSub)) {
              arrayToReturn.push(
                prettyPrinterForHumans._getStringPathWithCircularReference(
                  itemStringPathSub,
                  itemEnumDataType
                )
              );
            } else {
              arrayToReturn.push(itemStringPathSub);
              stackToProcess.push([
                itemSub,
                itemEnumDataType,
                itemStringPathSub,
              ]);
            }
          }
          break;
      }
    }

    return helperFormatting.getArrayOfStringsSortedCaseInsensitive(
      arrayToReturn
    );
  };

  /**
   * @param {string} argStringPath
   * @param {number} argEnumDataType
   * @returns string
   * */
  static _getStringPathWithCircularReference = (
    argStringPath,
    argEnumDataType
  ) => {
    switch (argEnumDataType) {
      case helperEnumDataTypes.fieldArray:
        return argStringPath + " [ CIRCULAR REFERENCE ]";

      case helperEnumDataTypes.fieldObject:
        return argStringPath + " { CIRCULAR REFERENCE }";

      default:
        return argStringPath;
    }
  };

  static _getStringPath = (argStringPathPrefix, argStringKeyNew) =>
    argStringPathPrefix.length === 0
      ? argStringKeyNew
      : argStringPathPrefix + "." + argStringKeyNew;
  //
  // Is
  //
  /**
   * This function returns true if the key is detected anywhere in the data structure.
   * If arg is not an array / object, then this will default to false.
   *
   * @param {any} arg
   * @param {any} argKey
   * @param {boolean} argBoolCaseSensitive
   * */
  static isKeyInArg = (arg, argKey, argBoolCaseSensitive = true) => {
    const helperCircularReferences = new HelperCircularReferences();

    const enumDataTypeForArg = helperEnumDataTypes.getEnumDataType(arg);

    const stackToProcess = [[arg, enumDataTypeForArg]];

    while (stackToProcess.length > 0) {
      const [item, itemEnumDataType] = stackToProcess.pop();
      switch (itemEnumDataType) {
        case helperEnumDataTypes.fieldArray:
          for (
            let itemIntIndex = 0, intLength = item.length;
            itemIntIndex < intLength;
            itemIntIndex++
          ) {
            const itemSub = item[itemIntIndex];
            if (!helperCircularReferences.isAlreadyTraversed(itemSub)) {
              stackToProcess.push([
                itemSub,
                helperEnumDataTypes.getEnumDataType(itemSub),
              ]);
            }
          }
          break;

        case helperEnumDataTypes.fieldObject:
          //
          // If key exists in the object, then return true
          //
          if (
            prettyPrinterForHumans._isKeyInObject(
              item,
              argKey,
              argBoolCaseSensitive
            )
          ) {
            return true;
          }
          //
          // If we get this far, then the key hasn't been found yet. Go through each child and add them to the stack.
          //
          const itemArrayOfValues = Object.values(item);
          for (
            let itemIntIndex = 0, intLength = itemArrayOfValues.length;
            itemIntIndex < intLength;
            itemIntIndex++
          ) {
            const itemSub = itemArrayOfValues[itemIntIndex];
            if (!helperCircularReferences.isAlreadyTraversed(itemSub)) {
              stackToProcess.push([
                itemSub,
                helperEnumDataTypes.getEnumDataType(itemSub),
              ]);
            }
          }
          break;
      }
    }
    //
    // If we get this far, then the key was never found
    //
    return false;
  };

  /**
   * @param {Object} argObject
   * @param {any} argKey
   * @param {boolean} argBoolCaseSensitive
   * */
  static _isKeyInObject = (argObject, argKey, argBoolCaseSensitive) => {
    if (argBoolCaseSensitive) {
      return argObject.hasOwnProperty(argKey);
    } else {
      const stringKey = `${argKey}`;
      const arrayOfKeys = Object.keys(argObject);
      for (
        let itemIntIndex = 0, intLength = arrayOfKeys.length;
        itemIntIndex < intLength;
        itemIntIndex++
      ) {
        if (
          helperLogic.logicAreStringsEqualCaseInsensitive(
            `${arrayOfKeys[itemIntIndex]}`,
            stringKey
          )
        ) {
          return true;
        }
      }
      return false;
    }
  };

  /**
   * This function returns true if the top layer children has at least one array or object
   *
   * @param {any} arg
   * @returns boolean
   * */
  static isRecursive = (arg) => {
    //
    // Get the argument's type, so we can begin making decisions
    //
    const enumTypeForRoot = helperEnumDataTypes.getEnumDataType(arg);
    //
    // Prep stack for processing data structure
    //
    switch (enumTypeForRoot) {
      case helperEnumDataTypes.fieldArray:
        for (
          let itemIntIndex = 0, intLength = arg.length;
          itemIntIndex < intLength;
          itemIntIndex++
        ) {
          const itemEnumDataType = helperEnumDataTypes.getEnumDataType(
            arg[itemIntIndex]
          );
          switch (itemEnumDataType) {
            case helperEnumDataTypes.fieldArray:
              return true;

            case helperEnumDataTypes.fieldObject:
              if (Object.keys(itemEnumDataType).length > 0) {
                return true;
              }
              break;

            default:
              break;
          }
        }
        break;

      case helperEnumDataTypes.fieldObject:
        const arrayOfKeys = Object.keys(arg);
        for (
          let itemIntIndex = 0, intLength = arrayOfKeys.length;
          itemIntIndex < intLength;
          itemIntIndex++
        ) {
          const itemValue = arg[arrayOfKeys[itemIntIndex]];
          switch (helperEnumDataTypes.getEnumDataType(itemValue)) {
            case helperEnumDataTypes.fieldArray:
              return true;

            case helperEnumDataTypes.fieldObject:
              if (Object.keys(itemValue).length > 0) {
                return true;
              }
              break;

            default:
              break;
          }
        }
        break;
    }
    return false;
  };

  /**
   * This function is meant to format a given variable similarly to Python's PrettyPrint library
   *
   * @param {any} arg
   * @param {HelperOptions} argHelperOptions
   * @returns string
   * */
  static pformatSync = (arg, argHelperOptions = {}) => {
    argHelperOptions = new HelperOptions(argHelperOptions);

    let helperCircularReferences;
    if (argHelperOptions.argBoolHandleCircularReferences) {
      helperCircularReferences = new HelperCircularReferences();
    }
    //
    // Prep array for output
    //
    const arrayOfStringsOutput = [];
    //
    // Get the argument's type, so we can begin making decisions
    //
    const enumTypeForRoot = helperEnumDataTypes.getEnumDataType(arg);
    //
    // Printing complex structures
    //
    let stringClosure;
    switch (enumTypeForRoot) {
      //
      // Output opener for array
      //
      case helperEnumDataTypes.fieldArray:
        arrayOfStringsOutput.push(`[`);
        stringClosure = `]`;
        break;
      //
      // Output opener for object
      //
      case helperEnumDataTypes.fieldObject:
        arrayOfStringsOutput.push(`{`);
        stringClosure = `}`;
        break;
      //
      // This should never run, but its here to be explicit
      //
      default:
        stringClosure = ``;
        break;
    }
    //
    // Prep stack for processing data structure
    //
    const arrayStackToProcess = [
      new HelperObjectForStack(
        helperEnumDataTypes.fieldEitherNonIterableOrString,
        -1,
        ``,
        stringClosure
      ),
      new HelperObjectForStack(enumTypeForRoot, 0, ``, arg),
    ];
    //
    // Process stack
    //
    while (arrayStackToProcess.length > 0) {
      //
      // Unpack item from stack
      //
      const itemObjectFromStack = arrayStackToProcess.pop();
      switch (itemObjectFromStack.fieldIntDataType) {
        //
        // Array
        //
        case helperEnumDataTypes.fieldArray:
          helperProcessArray.processArray(
            arrayStackToProcess,
            helperCircularReferences,
            argHelperOptions,
            itemObjectFromStack
          );
          break;
        //
        // Object
        //
        case helperEnumDataTypes.fieldObject:
          helperProcessObject.processObject(
            arrayStackToProcess,
            helperCircularReferences,
            argHelperOptions,
            itemObjectFromStack
          );
          break;

        //
        //
        //
        case helperEnumDataTypes.fieldCircularReference:
          //
          // If the option is active, then print a warning message that the printer detected a
          // circular reference
          //
          if (argHelperOptions.argBoolPrintWarningOnCircularReference) {
            arrayOfStringsOutput.push(`WARNING: value is a circular reference`);
          }
          arrayOfStringsOutput.push(
            helperFormatting.getStringWhitespacePlusKeyPlusValuePlusComma(
              arrayOfStringsOutput,
              arrayStackToProcess,
              argHelperOptions,
              itemObjectFromStack
            )
          );
          break;
        //
        // Error
        //
        case helperEnumDataTypes.fieldError:
          //
          // If the option is active, then print a warning message that the printer detected an
          // error
          //
          if (argHelperOptions.argBoolPrintErrorOnErrorObject) {
            arrayOfStringsOutput.push(`ERROR: value is an error object`);
          }
          arrayOfStringsOutput.push(
            helperFormatting.getStringWhitespacePlusKeyPlusValuePlusComma(
              arrayOfStringsOutput,
              arrayStackToProcess,
              argHelperOptions,
              itemObjectFromStack
            )
          );
          break;
        //
        // Function
        //
        case helperEnumDataTypes.fieldFunction:
          arrayOfStringsOutput.push(
            helperFormatting.getStringWhitespacePlusKeyPlusValuePlusComma(
              arrayOfStringsOutput,
              arrayStackToProcess,
              argHelperOptions,
              itemObjectFromStack
            )
          );
          break;
        //
        // Promise
        //
        case helperEnumDataTypes.fieldPromise:
          //
          // If the option is active, then print a warning message that the printer detected an
          // unresolved promise
          //
          if (argHelperOptions.argBoolPrintWarningOnPromise) {
            arrayOfStringsOutput.push(`WARNING: value is a promise`);
          }
          arrayOfStringsOutput.push(
            helperFormatting.getStringWhitespacePlusKeyPlusValuePlusComma(
              arrayOfStringsOutput,
              arrayStackToProcess,
              argHelperOptions,
              itemObjectFromStack
            )
          );
          break;

        default:
          //
          // If the string is empty, then
          //
          if (itemObjectFromStack.fieldKey.length === 0) {
            arrayOfStringsOutput.push(
              helperFormatting.getStringPrefixWhitespacePlusValuePlusComma(
                arrayOfStringsOutput,
                arrayStackToProcess,
                argHelperOptions,
                itemObjectFromStack
              )
            );
            //
            // If the key is empty, then fieldValue is a closure
            //
          } else {
            arrayOfStringsOutput.push(
              helperFormatting.getStringWhitespacePlusKeyPlusValuePlusComma(
                arrayOfStringsOutput,
                arrayStackToProcess,
                argHelperOptions,
                itemObjectFromStack
              )
            );
          }
          break;
      }
    }
    //
    // Build the string to return
    //
    // Reminder:
    // - reduce() will throw an error if ran against an empty array, so do a size check ahead of time
    // - reduce() is a bit more performant than join()
    //
    //let stringToReturn = arrayOfStringsOutput.length > 0 ? arrayOfStringsOutput.reduce( (itemStringPrev, itemString) => itemStringPrev + `\n` + itemString ) : ``;

    let stringToReturn;
    if (arrayOfStringsOutput.length > 0) {
      stringToReturn = arrayOfStringsOutput.reduce(
        (itemStringPrev, itemString) => itemStringPrev + `\n` + itemString
      );
    } else {
      stringToReturn = ``;
    }

    if (argHelperOptions.argStringNameToOutput !== undefined) {
      stringToReturn = `${argHelperOptions.argStringNameToOutput} =\n${stringToReturn}`;
    }

    if (argHelperOptions.argStringTrailingSpace !== undefined) {
      stringToReturn += `\n${argHelperOptions.argStringTrailingSpace}`;
    }

    return stringToReturn;
  };

  /**
   * This function is the same as pformatSync, except it executes asynchronously by returning
   * a promise
   *
   * @param {any} arg
   * @param {HelperOptions} argHelperOptions
   * @returns Promise
   * */
  static pformatAsyncSingleThread = async (
    arg,
    argHelperOptions = {
      argBoolHandleCircularReferences: true,
      argBoolPrintComplexLast: false,
      argBoolPrintErrorOnErrorObject: true,
      argBoolPrintWarningOnPromise: true,
      argStringIndentation: "    ",
    }
  ) =>
    new Promise((resolve) =>
      resolve(prettyPrinterForHumans.pformatSync(arg, argHelperOptions))
    );

  /**
   * This function prints the value returned by pformatSync.
   * For deterministic purposes, there is no async variation of this function.
   *
   * @param {any} arg
   * @param {HelperOptions} argHelperOptions
   * */
  static pprint = (arg, argHelperOptions = {}) => {
    console.log(prettyPrinterForHumans.pformatSync(arg, argHelperOptions));
  };
}
