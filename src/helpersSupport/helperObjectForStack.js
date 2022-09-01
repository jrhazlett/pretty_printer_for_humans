"use strict";
/*
If data is getting added to the stack, its gonna get wrapped in this object. This object
accounts for all the necessary information to process, format, and route data.

The lifespan of each instance should only last until its contends are mined for simple
data types.

Garbage collection:
Their scope is limited to the stack and all processing sub-functions. Once all those finish
execution, the number of references should drop to zero.
*/
export default class HelperObjectForStack {
  /**
   * @param {number} argIntDataType
   * @param {number} argIntLayersIn
   * @param {any} argKey
   * @param {any} argValue
   * */
  constructor(argIntDataType, argIntLayersIn, argKey, argValue) {
    this.fieldIntDataType = argIntDataType;
    this.fieldIntLayersIn = argIntLayersIn;
    this.fieldKey = argKey;
    this.fieldValue = argValue;
  }
}
