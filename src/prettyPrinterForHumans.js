"use strict";
/*
Reminders for updating library support...

## All types need additions here:

src/helpersSupport/helperEnumDataTypes.js
-Add a numerical type to helperEnumDataTypes

src/helpersProcessing
-In all modules, add a switch entry for the data type

src/helpersProcessingChildren
-In all modules, add a switch entry for the data type


## When adding a complex type, make the following additions:

src/helpersProcessing
-Add a support module here

Note: For complex types, make sure to do the necessary print-friendly data conversions,
since not all data types are print-friendly by default.

src/helpersSupport/helperEnumDataTypes.js
-Add the data type to helperEnumDataTypes.fieldSetOfEnumsComplexTypes
Reminder: This is necessary to achieve the desired effect for fieldOptionPrintComplexLast
*/
import HelperCircularReferences from "./helpersSupport/helperCircularReferences.js";
import helperEnumDataTypes from "./helpersSupport/helperEnumDataTypes.js";
import helperFormatting from "./helpersSupport/helperFormatting.js";
import helperGlobals from "./helpersSupport/helperGlobals.js";
import HelperObjectForStack from "./helpersSupport/helperObjectForStack.js";
import HelperOptions from "./helpersSupport/helperOptions.js";
import helperProcessArray from "./helpersProcessing/helperProcessArray.js";
import helperProcessMap from "./helpersProcessing/helperProcessMap.js";
import helperProcessObject from "./helpersProcessing/helperProcessObject.js";
import helperProcessSet from "./helpersProcessing/helperProcessSet.js";
//
// Public
//
export default class prettyPrinterForHumans {
    //
    // Public - fields
    //
    /**
     * This is a reference to HelperOptions so the developer doesn't need to import it independently
     * */
    static fieldHelperOptions = HelperOptions;
    //
    // Public - get
    //
    /**
     * @param {any} arg
     * @returns []
     * */
    static getArrayOfPathsInArg = (arg) => {
        const helperCircularReferences = new HelperCircularReferences();
        const arrayToReturn = [];
        const stackToProcess = [
            [arg, helperEnumDataTypes.getEnumDataType(arg), []],
        ];
        while (stackToProcess.length > 0) {
            const [item, itemEnumDataType, itemArrayPath] =
                stackToProcess.pop();
            switch (itemEnumDataType) {
                case helperEnumDataTypes.fieldArray:
                    this._getArrayOfPathsInArgArray(
                        item,
                        itemArrayPath,
                        arrayToReturn,
                        helperCircularReferences,
                        stackToProcess
                    );
                    break;
                case helperEnumDataTypes.fieldMap:
                    this._getObjectOfPathsInArgMap(
                        itemArrayPath,
                        arrayToReturn,
                        helperCircularReferences,
                        item,
                        stackToProcess
                    );
                    break;
                case helperEnumDataTypes.fieldObject:
                    prettyPrinterForHumans._getObjectOfPathsInArgObject(
                        itemArrayPath,
                        arrayToReturn,
                        helperCircularReferences,
                        item,
                        stackToProcess
                    );
                    break;
            }
        }
        return helperFormatting.getArrayOfStringsSortedCaseInsensitive(
            arrayToReturn
        );
    };

    /**
     * @param {any[]} argArray
     * @param {any[]} argArrayPath
     * @param {any[]} argArrayToReturnToUpdate
     * @param {HelperCircularReferences} argHelperCircularReferences
     * @param {(any|number|[])[]} argStackToProcessToUpdate
     * */
    static _getArrayOfPathsInArgArray = (
        argArray,
        argArrayPath,
        argArrayToReturnToUpdate,
        argHelperCircularReferences,
        argStackToProcessToUpdate
    ) => {
        let itemIntIndex = 0;
        const intLength = argArray.length;
        while (++itemIntIndex < intLength) {
            const itemSub = argArray[itemIntIndex];
            const itemEnumDataType =
                helperEnumDataTypes.getEnumDataType(itemSub);
            const itemArrayPathSub = prettyPrinterForHumans._getArrayPath(
                argArrayPath,
                itemIntIndex
            );
            if (argHelperCircularReferences.isAlreadyTraversed(itemSub)) {
                argArrayToReturnToUpdate.push(
                    prettyPrinterForHumans._getArrayPathWithCircularReference(
                        itemArrayPathSub,
                        itemEnumDataType
                    )
                );
            } else {
                argArrayToReturnToUpdate.push(itemArrayPathSub);
                argStackToProcessToUpdate.push([
                    itemSub,
                    itemEnumDataType,
                    itemArrayPathSub,
                ]);
            }
        }
    };

    /**
     * @param {any[]} argArrayPath
     * @param {any[]} argArrayToReturnToUpdate
     * @param {HelperCircularReferences} argHelperCircularReferences
     * @param {Object} argObject
     * @param {(any|number|[])[]} argStackToProcessToUpdate
     * */
    static _getObjectOfPathsInArgObject = (
        argArrayPath,
        argArrayToReturnToUpdate,
        argHelperCircularReferences,
        argObject,
        argStackToProcessToUpdate
    ) => {
        const arrayOfKeys = Object.keys(argObject);
        let itemIntIndex = -1;
        const intLength = arrayOfKeys.length;
        while (++itemIntIndex < intLength) {
            const itemKeySub = arrayOfKeys[itemIntIndex];
            const itemSub = argObject[itemKeySub];
            const itemEnumDataType =
                helperEnumDataTypes.getEnumDataType(itemSub);
            const itemArrayPathSub = prettyPrinterForHumans._getArrayPath(
                argArrayPath,
                itemKeySub
            );
            if (argHelperCircularReferences.isAlreadyTraversed(itemSub)) {
                argArrayToReturnToUpdate.push(
                    prettyPrinterForHumans._getArrayPathWithCircularReference(
                        itemArrayPathSub,
                        itemEnumDataType
                    )
                );
            } else {
                argArrayToReturnToUpdate.push(itemArrayPathSub);
                argStackToProcessToUpdate.push([
                    itemSub,
                    itemEnumDataType,
                    itemArrayPathSub,
                ]);
            }
        }
    };

    /**
     * @param {any[]} argArrayPath
     * @param {any[]} argArrayToReturnToUpdate
     * @param {HelperCircularReferences} argHelperCircularReferences
     * @param {Map} argMap
     * @param {(any|number|[])[]} argStackToProcessToUpdate
     * */
    static _getObjectOfPathsInArgMap = (
        argArrayPath,
        argArrayToReturnToUpdate,
        argHelperCircularReferences,
        argMap,
        argStackToProcessToUpdate
    ) => {
        const arrayOfKeys = argMap.keys();
        let itemIntIndex = -1;
        const intLength = arrayOfKeys.length;
        while (++itemIntIndex < intLength) {
            const itemKeySub = arrayOfKeys[itemIntIndex];
            const itemSub = argMap.get(itemKeySub);
            const itemEnumDataType =
                helperEnumDataTypes.getEnumDataType(itemSub);
            const itemArrayPathSub = prettyPrinterForHumans._getArrayPath(
                argArrayPath,
                itemKeySub
            );
            if (argHelperCircularReferences.isAlreadyTraversed(itemSub)) {
                argArrayToReturnToUpdate.push(
                    prettyPrinterForHumans._getArrayPathWithCircularReference(
                        itemArrayPathSub,
                        itemEnumDataType
                    )
                );
            } else {
                argArrayToReturnToUpdate.push(itemArrayPathSub);
                argStackToProcessToUpdate.push([
                    itemSub,
                    itemEnumDataType,
                    itemArrayPathSub,
                ]);
            }
        }
    };

    /**
     * @param {any[]} argArrayPath
     * @param {number} argEnumDataType
     * @returns any[]
     * */
    static _getArrayPathWithCircularReference = (
        argArrayPath,
        argEnumDataType
    ) => {
        switch (argEnumDataType) {
            case helperEnumDataTypes.fieldArray:
                return [...argArrayPath, "[ CIRCULAR REFERENCE ]"];

            case helperEnumDataTypes.fieldObject:
                return [...argArrayPath, "{ CIRCULAR REFERENCE }"];

            default:
                return argArrayPath;
        }
    };

    /**
     * @param {any[]} argArrayPathPrefix
     * @param {any} argKeyNew
     * @returns any[]
     * */
    static _getArrayPath = (argArrayPathPrefix, argKeyNew) => [
        ...argArrayPathPrefix,
        argKeyNew,
    ];

    /**
     * This attempts to get the value stored at the end of path
     * If the path fails, then this function returns an Error object answering
     * the following questions:
     * - What key failed?
     * - What is the path used?
     * - Which part of the path exists?
     * - Which part of the path is missing?
     *
     * @param {any} arg
     * @param {any[]} argArrayPath
     * @returns any
     * */
    static getValueAtPathInArg = (argArrayPath, arg) => {
        const arrayOfKeysThatExist = [];
        let item = arg;
        let itemIntIndex = -1;
        const intLength = argArrayPath.length;
        while (++itemIntIndex < intLength) {
            let itemKey = argArrayPath[itemIntIndex];
            switch (helperEnumDataTypes.getEnumDataType(item)) {
                //
                // Array
                //
                case helperEnumDataTypes.fieldArray:
                    item = prettyPrinterForHumans._getValueAtPathInArgArray(
                        item,
                        arrayOfKeysThatExist,
                        argArrayPath,
                        itemKey
                    );
                    if (item instanceof Error) return item;
                    break;
                //
                //
                //
                case helperEnumDataTypes.fieldMap:
                    item = prettyPrinterForHumans._getValueAtPathInArgMap(
                        arrayOfKeysThatExist,
                        argArrayPath,
                        itemKey,
                        item
                    );
                    if (item instanceof Error) return item;
                    break;
                //
                // Object
                //
                case helperEnumDataTypes.fieldObject:
                    item = prettyPrinterForHumans._getValueAtPathInArgObject(
                        arrayOfKeysThatExist,
                        argArrayPath,
                        itemKey,
                        item
                    );
                    if (item instanceof Error) return item;
                    break;
                //
                // In all other cases, the path failed
                //
                default:
                    return prettyPrinterForHumans._getErrorBecausePathFailed(
                        item,
                        argArrayPath,
                        arrayOfKeysThatExist,
                        itemKey
                    );
            }
        }
        //
        // If we get this far, then return the resulting item
        //
        return item;
    };

    /**
     * @param {any[]} argArray
     * @param {any[]} argArrayOfKeysThatExistToUpdate
     * @param {any[]} argArrayPath
     * @param {any} argKey
     * @returns any
     * */
    static _getValueAtPathInArgArray = (
        argArray,
        argArrayOfKeysThatExistToUpdate,
        argArrayPath,
        argKey
    ) => {
        //
        // Convert key to an index for the array
        //
        const intIndex = prettyPrinterForHumans._getIntIndexFromKey(argKey);
        //
        // If intIndex is defined, then continue processing it. Otherwise,
        // return an Error.
        //
        if (intIndex !== undefined) {
            //
            // If index is within the range of the array, then update...
            // argArray
            // arrayOfKeysThatExist
            //
            // Otherwise, return Error.
            //
            if (0 <= intIndex && intIndex < argArray.length) {
                argArrayOfKeysThatExistToUpdate.push(argKey);
                return argArray[intIndex];
            } else {
                return prettyPrinterForHumans._getErrorBecausePathFailed(
                    argArray,
                    argArrayPath,
                    argArrayOfKeysThatExistToUpdate,
                    argKey
                );
            }
        } else {
            return prettyPrinterForHumans._getErrorBecausePathFailed(
                argArray,
                argArrayPath,
                argArrayOfKeysThatExistToUpdate,
                argKey
            );
        }
    };

    /**
     * @param {any[]} argArrayOfKeysThatExistToUpdate
     * @param {any[]} argArrayPath
     * @param {any} argKey
     * @param {Map} argMap
     * */
    static _getValueAtPathInArgMap = (
        argArrayOfKeysThatExistToUpdate,
        argArrayPath,
        argKey,
        argMap
    ) => {
        //
        // If the key exists, then update item and arrayOfKeysThatExist
        // Otherwise, return Error.
        //
        if (argMap.has(argKey)) {
            argArrayOfKeysThatExistToUpdate.push(argKey);
            return argMap.get(argKey);
        } else {
            return prettyPrinterForHumans._getErrorBecausePathFailed(
                argMap,
                argArrayPath,
                argArrayOfKeysThatExistToUpdate,
                argKey
            );
        }
    };

    /**
     * @param {any[]} argArrayOfKeysThatExistToUpdate
     * @param {any[]} argArrayPath
     * @param {any} argKey
     * @param {Object} argObject
     * @returns any
     * */
    static _getValueAtPathInArgObject = (
        argArrayOfKeysThatExistToUpdate,
        argArrayPath,
        argKey,
        argObject
    ) => {
        //
        // If the key exists, then update item and arrayOfKeysThatExist
        // Otherwise, return Error.
        //
        if (argObject.hasOwnProperty(argKey)) {
            argArrayOfKeysThatExistToUpdate.push(argKey);
            return argObject[argKey];
        } else {
            return prettyPrinterForHumans._getErrorBecausePathFailed(
                argObject,
                argArrayPath,
                argArrayOfKeysThatExistToUpdate,
                argKey
            );
        }
    };

    /**
     * This attempts to get the value stored at the end of path
     * If the path fails, then this function returns an Error object answering
     * the following questions:
     * - What key failed?
     * - What is the path used?
     * - Which part of the path exists?
     * - Which part of the path is missing?
     *
     * @param {any} arg
     * @param {any[]} argArrayPath
     * @returns any
     * */
    static getValueAtPathInArgAsync = (argArrayPath, arg) =>
        new Promise((resolve, reject) => {
            const result = prettyPrinterForHumans.getValueAtPathInArg(
                argArrayPath,
                arg
            );
            if (result instanceof Error) reject(result);
            else resolve(result);
        });

    /**
     * @param {any} arg
     * @param {any[]} argArrayPath
     * @param {any[]} argArrayPathThatExists
     * @param {any} argKeyAtFailure
     * @returns Error
     * */
    static _getErrorBecausePathFailed = (
        arg,
        argArrayPath,
        argArrayPathThatExists,
        argKeyAtFailure
    ) => {
        const arrayToReturn = [
            `Failed to navigate path`,
            `keyAtFailure = ${helperGlobals.getStringFromArg(argKeyAtFailure)}`,
            `arrayPath = ${helperGlobals.getStringPrintableFromIterable(
                argArrayPath
            )}`,
            `arrayPathThatExists = ${argArrayPathThatExists}`,
            `arrayPathMissing = ${helperGlobals.getStringPrintableFromIterable(
                argArrayPath.slice(argArrayPathThatExists.length)
            )}`,
        ];

        switch (typeof arg) {
            case "object":
                switch (true) {
                    case arg === null:
                        arrayToReturn.push(
                            `No keys available because node is null`
                        );
                        break;
                    case Array.isArray(arg):
                        arrayToReturn.push(
                            `rangeOfIndexesAvailable = 0 - ${arg.length - 1}`
                        );
                        break;
                    case arg instanceof Map:
                        arrayToReturn.push(
                            `arrayOfAvailableKeysAtFailure = ${helperGlobals.getStringPrintableFromIterable(
                                arg.keys()
                            )}`
                        );
                        break;
                    default:
                        arrayToReturn.push(
                            `arrayOfAvailableKeysAtFailure = ${helperGlobals.getStringPrintableFromIterable(
                                Object.keys(arg)
                            )}`
                        );
                        break;
                }
                break;
            default:
                arrayToReturn.push(
                    `No keys available because node is not a type of object`
                );
                break;
        }
        arrayToReturn.push(
            `dataTypeAtFailure = ${helperEnumDataTypes.getStringDataType(arg)}`
        );
        return Error(
            arrayToReturn.reduce(
                (itemStringPrev, itemString) =>
                    itemStringPrev + "\n" + itemString
            )
        );
    };

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
     * @returns boolean
     * */
    static isKeyInArg = (arg, argKey, argBoolCaseSensitive = true) => {
        const helperCircularReferences = new HelperCircularReferences();
        const enumDataTypeForArg = helperEnumDataTypes.getEnumDataType(arg);
        const stackToProcess = [[arg, enumDataTypeForArg]];
        while (stackToProcess.length > 0) {
            const [item, itemEnumDataType] = stackToProcess.pop();
            let itemIntIndex;
            let intLength;
            switch (itemEnumDataType) {
                case helperEnumDataTypes.fieldArray:
                    itemIntIndex = -1;
                    intLength = item.length;
                    while (++itemIntIndex < intLength) {
                        const itemSub = item[itemIntIndex];
                        if (
                            !helperCircularReferences.isAlreadyTraversed(
                                itemSub
                            )
                        )
                            stackToProcess.push([
                                itemSub,
                                helperEnumDataTypes.getEnumDataType(itemSub),
                            ]);
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
                    )
                        return true;
                    //
                    // If we get this far, then the key hasn't been found yet. Go through each child and add them to the stack.
                    //
                    const itemArrayOfValues = Object.values(item);
                    itemIntIndex = -1;
                    intLength = itemArrayOfValues.length;
                    while (++itemIntIndex < intLength) {
                        const itemSub = itemArrayOfValues[itemIntIndex];
                        if (
                            !helperCircularReferences.isAlreadyTraversed(
                                itemSub
                            )
                        )
                            stackToProcess.push([
                                itemSub,
                                helperEnumDataTypes.getEnumDataType(itemSub),
                            ]);
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
        if (argBoolCaseSensitive) return argObject.hasOwnProperty(argKey);
        const stringKey = `${argKey}`;
        const arrayOfKeys = Object.keys(argObject);
        let itemIntIndex = -1;
        const intLength = arrayOfKeys.length;
        while (++itemIntIndex < intLength) {
            if (
                helperGlobals.logicAreStringsEqualCaseInsensitive(
                    `${arrayOfKeys[itemIntIndex]}`,
                    stringKey
                )
            )
                return true;
        }
        return false;
    };

    /**
     * This function returns true if the key is detected anywhere in the data structure.
     * If arg is not an array / object, then this will default to false.
     *
     * @param {any} arg
     * @param {any} argKey
     * @param {boolean} argBoolCaseSensitive
     * @returns Promise
     * */
    static isKeyInArgAsync = async (arg, argKey, argBoolCaseSensitive = true) =>
        new Promise((resolve) =>
            resolve(
                prettyPrinterForHumans.isKeyInArg(
                    arg,
                    argKey,
                    argBoolCaseSensitive
                )
            )
        );

    /**
     * @param {any[]} argArrayPath
     * @param {any} arg
     * @returns boolean
     * */
    static isPathInArg = (argArrayPath, arg) => {
        let item = arg;
        let itemIntIndex = -1;
        const intLength = argArrayPath.length;
        while (++itemIntIndex < intLength) {
            let itemKey = argArrayPath[itemIntIndex];
            switch (helperEnumDataTypes.getEnumDataType(item)) {
                //
                // Array
                //
                case helperEnumDataTypes.fieldArray:
                    const itemIndex =
                        prettyPrinterForHumans._getIntIndexFromKey(itemKey);
                    //
                    // If we don't get a viable result from the int function, then the key isn't
                    // viable as an array index. Return false in that case.
                    //
                    if (itemIndex !== undefined) {
                        //
                        // If index is outside the array's range, then return false, otherwise update
                        // item.
                        //
                        if (0 <= itemIndex && itemIndex < item.length)
                            item = item[itemIndex];
                        else return false;
                    } else return false;
                    break;
                //
                // Object
                //
                case helperEnumDataTypes.fieldObject:
                    //
                    // If item contains key, then update item, otherwise, return false since
                    // the path failed.
                    //
                    if (item.hasOwnProperty(itemKey)) item = item[itemKey];
                    else return false;
                    break;
                //
                //
                //
                default:
                    return false;
            }
        }
        //
        // If we get this far, then all checks passed
        //
        return true;
    };

    /**
     * @param {any[]} argArrayPath
     * @param {any} arg
     * @returns Promise
     * */
    static isPathInArgAsync = (argArrayPath, arg) =>
        new Promise((resolve) =>
            resolve(prettyPrinterForHumans.isPathInArg(argArrayPath, arg))
        );

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
        let itemIntIndex;
        let intLength;
        switch (enumTypeForRoot) {
            case helperEnumDataTypes.fieldArray:
                itemIntIndex = -1;
                intLength = arg.length;
                while (++itemIntIndex < intLength) {
                    const itemEnumDataType =
                        helperEnumDataTypes.getEnumDataType(arg[itemIntIndex]);
                    switch (itemEnumDataType) {
                        case helperEnumDataTypes.fieldArray:
                            return true;

                        case helperEnumDataTypes.fieldObject:
                            if (Object.keys(itemEnumDataType).length > 0)
                                return true;
                            break;

                        default:
                            break;
                    }
                }
                break;

            case helperEnumDataTypes.fieldObject:
                const arrayOfKeys = Object.keys(arg);
                itemIntIndex = -1;
                intLength = arrayOfKeys.length;
                while (++itemIntIndex < intLength) {
                    const itemValue = arg[arrayOfKeys[itemIntIndex]];
                    switch (helperEnumDataTypes.getEnumDataType(itemValue)) {
                        case helperEnumDataTypes.fieldArray:
                            return true;

                        case helperEnumDataTypes.fieldObject:
                            if (Object.keys(itemValue).length > 0) return true;
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
     * @param {HelperOptions|{}} argHelperOptions
     * @returns string
     * */
    static pformat = (arg, argHelperOptions = {}) => {
        argHelperOptions = new HelperOptions(argHelperOptions);
        let helperCircularReferences;
        if (argHelperOptions.argBoolHandleCircularReferences)
            helperCircularReferences = new HelperCircularReferences();
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

            case helperEnumDataTypes.fieldMap:
                arrayOfStringsOutput.push(`Map(`);
                stringClosure = `)`;
                break;
            //
            // Output opener for object
            //
            case helperEnumDataTypes.fieldObject:
                arrayOfStringsOutput.push(`{`);
                stringClosure = `}`;
                break;
            case helperEnumDataTypes.fieldSet:
                arrayOfStringsOutput.push(`Set(`);
                stringClosure = `)`;
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
                // Map
                //
                case helperEnumDataTypes.fieldMap:
                    helperProcessMap.processMap(
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
                // Set
                //
                case helperEnumDataTypes.fieldSet:
                    helperProcessSet.processSet(
                        arrayStackToProcess,
                        helperCircularReferences,
                        argHelperOptions,
                        itemObjectFromStack
                    );
                    break;
                //
                // Circular reference
                //
                case helperEnumDataTypes.fieldCircularReference:
                    //
                    // If the option is active, then print a warning message that the printer detected a
                    // circular reference
                    //
                    if (argHelperOptions.argBoolPrintWarningOnCircularReference)
                        arrayOfStringsOutput.push(
                            `WARNING: value is a circular reference`
                        );
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
                    if (argHelperOptions.argBoolPrintErrorOnErrorObject)
                        arrayOfStringsOutput.push(
                            `ERROR: value is an error object`
                        );
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
                    if (argHelperOptions.argBoolPrintWarningOnPromise)
                        arrayOfStringsOutput.push(
                            `WARNING: value is a promise`
                        );
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
                    if (itemObjectFromStack.fieldKey.length === 0)
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
                    else
                        arrayOfStringsOutput.push(
                            helperFormatting.getStringWhitespacePlusKeyPlusValuePlusComma(
                                arrayOfStringsOutput,
                                arrayStackToProcess,
                                argHelperOptions,
                                itemObjectFromStack
                            )
                        );
                    break;
            }
        }
        //
        // Build the string to return
        //
        let stringToReturn =
            arrayOfStringsOutput.length > 0
                ? arrayOfStringsOutput.reduce(
                      (itemStringPrev, itemString) =>
                          itemStringPrev + `\n` + itemString
                  )
                : ``;
        if (argHelperOptions.argStringNameToOutput !== undefined)
            stringToReturn = `${argHelperOptions.argStringNameToOutput} =\n${stringToReturn}`;
        if (argHelperOptions.argStringTrailingSpace !== undefined)
            stringToReturn += `\n${argHelperOptions.argStringTrailingSpace}`;
        return stringToReturn;
    };

    /**
     * This function is the same as pformat, except it executes asynchronously by returning
     * a promise
     *
     * @param {any} arg
     * @param {HelperOptions} argHelperOptions
     * @returns Promise
     * */
    static pformatAsync = async (
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
            resolve(prettyPrinterForHumans.pformat(arg, argHelperOptions))
        );

    /**
     * This function prints the value returned by pformat().
     * For deterministic purposes, there is no async variation of this function.
     *
     * @param {any} arg
     * @param {HelperOptions|{}} argHelperOptions
     * */
    static pprint = (arg, argHelperOptions = {}) =>
        console.log(prettyPrinterForHumans.pformat(arg, argHelperOptions));

    /**
     * @param {any} argKey
     * @returns bigint|number
     * */
    static _getIntIndexFromKey = (argKey) => {
        switch (typeof argKey) {
            //
            // Reminder: In tests, this appears to be 'ok' for using to reference arrays
            //
            case "bigint":
                return argKey;
            //
            // If the data type is a number, then it needs to be an int to be valid
            //
            case "number":
                return Number.isInteger(argKey) ? argKey : undefined;
            //
            // If the key is a string, then check it for only digits and return the
            // the resulting int
            //
            case "string":
                return /^\d+$/.test(argKey) ? parseInt(argKey) : undefined;
            //
            // In all other cases, return undefined
            //
            default:
                return undefined;
        }
    };
}
