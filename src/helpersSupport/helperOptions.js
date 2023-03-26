"use strict";
/*
This module receives optional values and generates defaults for anything left undefined.

Garbage collection:
Its instance scope is limited to pformat() and all references should break upon the
function's conclusion.
*/
export const enumSortOptions = {
    /**
     * DEFAULT
     * Prints all objects keys in alphabetical
     * This does not affect the order of arrays
     * */
    fieldOptionPrintAlphabetical: 1,
    /**
     * Prints complex objects like arrays and objects at the bottom of each layer
     * Beyond that, everything is handled the same as the alphabetical option
     * */
    fieldOptionPrintComplexLast: 2,

    /**
     * This prints the data in the same order as the argument
     * */
    fieldOptionPrintOriginalOrder: 3,
};

export let objectOptionDefaults = {
    fieldEnumSortOptions: enumSortOptions,

    argBoolHandleCircularReferences: true,
    argBoolPrintErrorOnErrorObject: true,
    argBoolPrintWarningOnCircularReference: true,

    argBoolPrintWarningOnPromise: true,

    argEnumSortOption: enumSortOptions.fieldOptionPrintAlphabetical,

    argIntDepthToPrint: undefined,
    argStringIndentation: `    `,
    argStringNameToOutput: undefined,
    argStringTrailingSpace: undefined,
};

/**
 * @param {boolean} argBoolHandleCircularReferences
 * This argument prevents infinite loops due to circular references.
 * Set to false if you are sure there are no circular references in the data
 * and you want to avoid adding the tracking property to the individual data members.
 *
 * NOTE: prettyPrinter will not print the created property, *unless* this option is false,
 * then the library will treat the data as if its any other property.
 *
 * Default setting: true
 *
 * @param {boolean} argBoolPrintErrorOnErrorObject
 * This argument prints an error message upon detecting an Error object
 * Default setting: true
 *
 * @param {boolean} argBoolPrintWarningOnCircularReference
 * This argument prints a warning message upon detecting a circular reference
 *
 * @param {boolean} argBoolPrintWarningOnPromise
 * This argument prints a warning message upon detecting an unresolved Promise
 * Default setting: true
 *
 * @param {number} argEnumSortOption
 * This argument determines the sort order of tree contents
 * Its defined through the enum HelperOptions.fieldEnumSortOptions
 * Default setting: _enumSortOptions.fieldOptionPrintAlphabetical
 *
 * @param {number} argIntDepthToPrint
 * If defined, this limits the number of layers printed to screen
 * User cannot go below one layer printed
 * Default setting: undefined
 *
 * @param {string} argStringIndentation
 * Sets the default indentation used to distinguish between layers
 * Default setting: string consisting of four spaces
 *
 * @param {string} argStringNameToOutput
 * When defined creates a header, which is `${argStringNameToOutput} =\n`
 * Default setting: undefined
 *
 * @param {string} argStringTrailingSpace
 * When defined, inserts argStringTrailingSpace as a string one line below the data contents
 * If undefined, then there is no empty space below the raw output from pformat()
 * Default setting: undefined
 *
 * */
export default function HelperOptions({
    argBoolHandleCircularReferences,
    argBoolPrintErrorOnErrorObject,
    argBoolPrintWarningOnCircularReference,
    argBoolPrintWarningOnPromise,
    argEnumSortOption,
    argIntDepthToPrint,
    argStringIndentation,
    argStringNameToOutput,
    argStringTrailingSpace,
}) {
    /**
     * This is an accessor property for accessing the available sort options
     * */
    this.fieldEnumSortOptions = enumSortOptions;

    this.argBoolHandleCircularReferences =
        argBoolHandleCircularReferences === undefined
            ? objectOptionDefaults.argBoolHandleCircularReferences
            : argBoolHandleCircularReferences;
    this.argBoolPrintErrorOnErrorObject =
        argBoolPrintErrorOnErrorObject === undefined
            ? objectOptionDefaults.argBoolPrintErrorOnErrorObject
            : argBoolPrintErrorOnErrorObject;
    this.argBoolPrintWarningOnCircularReference =
        argBoolPrintWarningOnCircularReference === undefined
            ? objectOptionDefaults.argBoolPrintWarningOnCircularReference
            : argBoolPrintWarningOnCircularReference;
    this.argBoolPrintWarningOnPromise =
        argBoolPrintWarningOnPromise === undefined
            ? objectOptionDefaults.argBoolPrintWarningOnPromise
            : argBoolPrintWarningOnPromise;
    this.argEnumSortOption =
        argEnumSortOption === undefined
            ? objectOptionDefaults.argEnumSortOption
            : argEnumSortOption;
    this.argIntDepthToPrint =
        argIntDepthToPrint === undefined
            ? objectOptionDefaults.argIntDepthToPrint
            : argIntDepthToPrint - 1;
    this.argStringIndentation =
        argStringIndentation === undefined
            ? objectOptionDefaults.argStringIndentation
            : argStringIndentation;
    this.argStringNameToOutput =
        argStringNameToOutput === undefined
            ? objectOptionDefaults.argStringNameToOutput
            : argStringNameToOutput;
    this.argStringTrailingSpace =
        argStringTrailingSpace === undefined
            ? objectOptionDefaults.argStringTrailingSpace
            : argStringTrailingSpace;
}
//export let helperOptions = new HelperOptions({})
