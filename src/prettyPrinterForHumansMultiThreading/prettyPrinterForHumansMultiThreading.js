"use strict";
/*
To import:

(Local dev)
import prettyPrinterForHumansMultiThreading from
    "./src/prettyPrinterForHumansMultiThreading/prettyPrinterForHumansMultiThreading.js";

(From library)
import prettyPrinterForHumansMultiThreading from
    "pretty_printer_for_humans/src/prettyPrinterForHumansMultiThreading/prettyPrinterForHumansMultiThreading.js"
*/
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Worker } from "node:worker_threads";

import HelperOptions from "../../src/helpersSupport/helperOptions.js";

export default class prettyPrinterForHumansMultiThreading {
  //
  // Public
  //
  /**
   * This is a reference to HelperOptions so the developer doesn't need to import it independently
   * */
  static fieldHelperOptions = HelperOptions;

  static fieldStringPathWorkerExp = `${dirname(
    fileURLToPath(import.meta.url)
  )}/worker.js`;

  /**
   * This returns a sorted array of strings.
   *
   * @param {any} arg
   * @returns Promise
   * */
  static getArrayOfStringsPathsInArgAsync = async (arg) => {
    return new Promise((resolve, reject) => {
      //
      // Create worker with module type
      //
      const worker = new Worker(
        prettyPrinterForHumansMultiThreading.fieldStringPathWorkerExp,
        {
          type: `module`,
        }
      );
      //
      // Return on success
      //
      worker.once(`message`, (argResponseFromWorker) =>
        resolve(argResponseFromWorker)
      );
      //
      // Return on error
      //
      worker.onerror = (err) =>
        reject(
          `${prettyPrinterForHumansMultiThreading.fieldStringPathWorkerExp}: err = ${err}`
        );
      //
      // Run worker
      //
      worker.postMessage({
        arg: arg,
        argArrayOfKeysInOrder: ["arg"],
        argStringNameForFunction: "getArrayOfStringsPathsInArg",
      });
    });
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
  static isKeyInArgAsync = async (arg, argKey, argBoolCaseSensitive = true) => {
    return new Promise((resolve, reject) => {
      //
      // Create worker with module type
      //
      const worker = new Worker(
        prettyPrinterForHumansMultiThreading.fieldStringPathWorkerExp,
        {
          type: `module`,
        }
      );
      //
      // Return on success
      //
      worker.once(`message`, (argResponseFromWorker) =>
        resolve(argResponseFromWorker)
      );
      //
      // Return on error
      //
      worker.onerror = (err) =>
        reject(
          `${prettyPrinterForHumansMultiThreading.fieldStringPathWorkerExp}: err = ${err}`
        );
      //
      // Run worker
      //
      worker.postMessage({
        arg: arg,
        argKey: argKey,
        argBoolCaseSensitive: argBoolCaseSensitive,
        argArrayOfKeysInOrder: ["arg", "argKey", "argBoolCaseSensitive"],
        argStringNameForFunction: "isKeyInArg",
      });
    });
  };

  /**
   * This function is the same as pformat(), except it executes asynchronously on another thread
   * and returns a promise
   *
   * @param {any} arg
   * @param {HelperOptions} argHelperOptions
   * @returns Promise
   * */
  static pformatAsync = async (arg, argHelperOptions = {}) => {
    return new Promise((resolve, reject) => {
      //
      // Create worker with module type
      //
      const worker = new Worker(
        prettyPrinterForHumansMultiThreading.fieldStringPathWorkerExp,
        {
          type: `module`,
        }
      );
      //
      // Return on success
      //
      worker.once(`message`, (argResponseFromWorker) =>
        resolve(argResponseFromWorker)
      );
      //
      // Return on error
      //
      worker.onerror = (err) =>
        reject(
          `${prettyPrinterForHumansMultiThreading.fieldStringPathWorkerExp}: err = ${err}`
        );
      //
      // Run worker
      //
      worker.postMessage({
        arg: arg,
        argHelperOptions: argHelperOptions,
        argArrayOfKeysInOrder: ["arg", "argHelperOptions"],
        argStringNameForFunction: "pformat",
      });
    });
  };
}
