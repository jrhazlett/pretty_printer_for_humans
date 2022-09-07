"use strict";
/*
This module receives optional values and generates defaults for anything left undefined.

Garbage collection:
Its instance scope is limited to pformat() and all references should break upon the
function's conclusion.
*/
class _enumSortOptions {
  /**
   * DEFAULT
   * Prints all objects keys in alphabetical
   * This does not affect the order of arrays
   * */
  static fieldOptionPrintAlphabetical = 1;
  /**
   * Prints complex objects like arrays and objects at the bottom of each layer
   * Beyond that, everything is handled the same as the alphabetical option
   * */
  static fieldOptionPrintComplexLast = 2;

  /**
   * This prints the data in the same order as the argument
   * */
  static fieldOptionPrintOriginalOrder = 3;
}

export default class HelperOptions {
  /**
   * This is an accessor property for accessing the available sort options
   * */
  static fieldEnumSortOptions = _enumSortOptions;

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
  constructor({
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
    this.argBoolHandleCircularReferences =
      argBoolHandleCircularReferences === undefined
        ? true
        : argBoolHandleCircularReferences;
    this.argBoolPrintErrorOnErrorObject =
      argBoolPrintErrorOnErrorObject === undefined
        ? true
        : argBoolPrintErrorOnErrorObject;
    this.argBoolPrintWarningOnCircularReference =
      argBoolPrintWarningOnCircularReference === undefined
        ? true
        : argBoolPrintWarningOnCircularReference;
    this.argBoolPrintWarningOnPromise =
      argBoolPrintWarningOnPromise === undefined
        ? true
        : argBoolPrintWarningOnPromise;
    this.argEnumSortOption =
      argEnumSortOption === undefined
        ? _enumSortOptions.fieldOptionPrintAlphabetical
        : argEnumSortOption;
    this.argIntDepthToPrint =
      argIntDepthToPrint === undefined ? undefined : argIntDepthToPrint - 1;
    this.argStringIndentation =
      argStringIndentation === undefined ? `    ` : argStringIndentation;
    this.argStringNameToOutput =
      argStringNameToOutput === undefined ? undefined : argStringNameToOutput;
    this.argStringTrailingSpace =
      argStringTrailingSpace === undefined ? undefined : argStringTrailingSpace;
  }
}
