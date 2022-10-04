"use strict";
/*
This module does all prep work for pushing data to the stack.

If the value is simple, then it will print to the output array upon being popped from the stack.

Performance / architecture notes:

While pushing these values to the stack rather than directly to the output array is slightly less efficient,
this keeps the output responsibilities outside of this module, which makes the library more robust
in the long-term.
*/
import HelperCircularReferences from "../helpersSupport/helperCircularReferences.js";
import helperEnumDataTypes from "../helpersSupport/helperEnumDataTypes.js";
import helperFormatting from "../helpersSupport/helperFormatting.js";
import helperGlobals from "../helpersSupport/helperGlobals.js";
import HelperObjectForStack from "../helpersSupport/helperObjectForStack.js";

export default class helperProcessChildComplexLast {
  /**
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectChildForStack
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static processChild = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectChildForStack,
    argObjectFromStack
  ) => {
    switch (argObjectChildForStack.fieldIntDataType) {
      case helperEnumDataTypes.fieldArray:
        helperProcessChildComplexLast._processArray(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectChildForStack,
          argObjectFromStack
        );
        break;
      case helperEnumDataTypes.fieldMap:
        helperProcessChildComplexLast._processMap(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectChildForStack,
          argObjectFromStack
        );
        break;
      case helperEnumDataTypes.fieldObject:
        helperProcessChildComplexLast._processObject(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectChildForStack,
          argObjectFromStack
        );
        break;
      case helperEnumDataTypes.fieldSet:
        helperProcessChildComplexLast._processSet(
          argArrayStackToUpdate,
          argHelperCircularReferences,
          argHelperOptions,
          argObjectChildForStack,
          argObjectFromStack
        );
        break;
      case helperEnumDataTypes.fieldError:
        argArrayStackToUpdate.push(
          new HelperObjectForStack(
            helperEnumDataTypes.fieldError,
            argObjectFromStack.fieldIntLayersIn,
            `${argObjectChildForStack.fieldKey}`,
            `${argObjectChildForStack.fieldValue}`
          )
        );
        break;
      case helperEnumDataTypes.fieldFunction:
        argArrayStackToUpdate.push(
          new HelperObjectForStack(
            helperEnumDataTypes.fieldFunction,
            argObjectFromStack.fieldIntLayersIn,
            `${argObjectChildForStack.fieldKey}`,
            helperFormatting.getStringFunctionSignature(
              argObjectChildForStack.fieldValue
            )
          )
        );
        break;
      case helperEnumDataTypes.fieldPromise:
        argArrayStackToUpdate.push(
          new HelperObjectForStack(
            helperEnumDataTypes.fieldPromise,
            argObjectFromStack.fieldIntLayersIn,
            `${argObjectChildForStack.fieldKey}`,
            `${argObjectChildForStack.fieldValue}`
          )
        );
        break;
      //
      // Non-iterable (incl. strings)
      //
      default:
        //
        // Print content to output
        //
        argArrayStackToUpdate.push(
          new HelperObjectForStack(
            helperEnumDataTypes.fieldEitherNonIterableOrString,
            argObjectFromStack.fieldIntLayersIn,
            helperGlobals.getStringFromArgViaEnumDataType(
              argObjectChildForStack.fieldKey,
              argObjectChildForStack.fieldIntDataType
            ),
            helperGlobals.getStringFromArgViaEnumDataType(
              argObjectChildForStack.fieldValue,
              argObjectChildForStack.fieldIntDataType
            )
          )
        );
        break;
    }
  };

  /**
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectChildForStack
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static _processArray = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectChildForStack,
    argObjectFromStack
  ) => {
    //
    // If int layers are defined, then print a summary value
    //
    if (
      helperFormatting.getBoolAfterAttemptingToAddObjectFormattedForExceededLayer(
        argArrayStackToUpdate,
        argHelperOptions,
        argObjectFromStack,
        `${argObjectChildForStack.fieldKey}`,
        `[ ... ]`
      )
    ) {
      return;
    }

    if (argHelperCircularReferences) {
      if (
        argHelperCircularReferences.updateStackWithCircularReferenceMessage(
          argArrayStackToUpdate,
          argObjectChildForStack,
          argObjectFromStack
        )
      ) {
        return;
      }
    }
    //
    // Append closure to stack for processing
    //
    argArrayStackToUpdate.push(
      new HelperObjectForStack(
        helperEnumDataTypes.fieldEitherNonIterableOrString,
        argObjectFromStack.fieldIntLayersIn,
        ``,
        `]`
      )
    );
    //
    // Append content to stack for processing
    //
    argArrayStackToUpdate.push(argObjectChildForStack);
    //
    // Append opener to stack for processing
    //
    argArrayStackToUpdate.push(
      new HelperObjectForStack(
        helperEnumDataTypes.fieldEitherNonIterableOrString,
        argObjectFromStack.fieldIntLayersIn,
        `${argObjectChildForStack.fieldKey}`,
        `[`
      )
    );
  };

  /**
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectChildForStack
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static _processMap = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectChildForStack,
    argObjectFromStack
  ) => {
    //
    // If int layers are defined, then print a summary value
    //
    if (
      helperFormatting.getBoolAfterAttemptingToAddObjectFormattedForExceededLayer(
        argArrayStackToUpdate,
        argHelperOptions,
        argObjectFromStack,
        `${argObjectChildForStack.fieldKey}`,
        `Map( ... )`
      )
    ) {
      return;
    }

    if (argHelperCircularReferences) {
      if (
        argHelperCircularReferences.updateStackWithCircularReferenceMessage(
          argArrayStackToUpdate,
          argObjectChildForStack,
          argObjectFromStack
        )
      ) {
        return;
      }
    }
    //
    // Append closure to stack for processing
    //
    argArrayStackToUpdate.push(
      new HelperObjectForStack(
        helperEnumDataTypes.fieldEitherNonIterableOrString,
        argObjectFromStack.fieldIntLayersIn,
        ``,
        `)`
      )
    );
    //
    // Append content to stack for processing
    //
    argArrayStackToUpdate.push(argObjectChildForStack);
    //
    // Append opener to stack for processing
    //
    argArrayStackToUpdate.push(
      new HelperObjectForStack(
        helperEnumDataTypes.fieldEitherNonIterableOrString,
        argObjectFromStack.fieldIntLayersIn,
        `${argObjectChildForStack.fieldKey}`,
        `Map(`
      )
    );
  };

  /**
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectChildForStack
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static _processObject = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectChildForStack,
    argObjectFromStack
  ) => {
    //
    // If int layers are defined, then print a summary value
    //
    if (
      helperFormatting.getBoolAfterAttemptingToAddObjectFormattedForExceededLayer(
        argArrayStackToUpdate,
        argHelperOptions,
        argObjectFromStack,
        `${argObjectChildForStack.fieldKey}`,
        `{ ... }`
      )
    ) {
      return;
    }

    if (argHelperCircularReferences) {
      if (
        argHelperCircularReferences.updateStackWithCircularReferenceMessage(
          argArrayStackToUpdate,
          argObjectChildForStack,
          argObjectFromStack
        )
      ) {
        return;
      }
    }
    //
    // Append closure to stack for processing
    //
    argArrayStackToUpdate.push(
      new HelperObjectForStack(
        helperEnumDataTypes.fieldEitherNonIterableOrString,
        argObjectFromStack.fieldIntLayersIn,
        ``,
        `}`
      )
    );
    //
    // Append content to stack for processing
    //
    argArrayStackToUpdate.push(argObjectChildForStack);
    //
    // Append opener to stack for processing
    //
    argArrayStackToUpdate.push(
      new HelperObjectForStack(
        helperEnumDataTypes.fieldEitherNonIterableOrString,
        argObjectFromStack.fieldIntLayersIn,
        `${argObjectChildForStack.fieldKey}`,
        `{`
      )
    );
  };

  /**
   * @param {[]} argArrayStackToUpdate
   * @param {HelperCircularReferences} argHelperCircularReferences
   * @param {HelperOptions} argHelperOptions
   * @param {HelperObjectForStack} argObjectChildForStack
   * @param {HelperObjectForStack} argObjectFromStack
   * */
  static _processSet = (
    argArrayStackToUpdate,
    argHelperCircularReferences,
    argHelperOptions,
    argObjectChildForStack,
    argObjectFromStack
  ) => {
    //
    // If int layers are defined, then print a summary value
    //
    if (
      helperFormatting.getBoolAfterAttemptingToAddObjectFormattedForExceededLayer(
        argArrayStackToUpdate,
        argHelperOptions,
        argObjectFromStack,
        `${argObjectChildForStack.fieldKey}`,
        `Set( ... )`
      )
    ) {
      return;
    }

    if (argHelperCircularReferences) {
      if (
        argHelperCircularReferences.updateStackWithCircularReferenceMessage(
          argArrayStackToUpdate,
          argObjectChildForStack,
          argObjectFromStack
        )
      ) {
        return;
      }
    }
    //
    // Append closure to stack for processing
    //
    argArrayStackToUpdate.push(
      new HelperObjectForStack(
        helperEnumDataTypes.fieldEitherNonIterableOrString,
        argObjectFromStack.fieldIntLayersIn,
        ``,
        `)`
      )
    );
    //
    // Append content to stack for processing
    //
    argArrayStackToUpdate.push(argObjectChildForStack);
    //
    // Append opener to stack for processing
    //
    argArrayStackToUpdate.push(
      new HelperObjectForStack(
        helperEnumDataTypes.fieldEitherNonIterableOrString,
        argObjectFromStack.fieldIntLayersIn,
        `${argObjectChildForStack.fieldKey}`,
        `Set(`
      )
    );
  };
}
