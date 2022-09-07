"use strict";
/*
To import:

import prettyPrinterForHumansMultiThreading from
        "./src/prettyPrinterForHumansMultiThreading/prettyPrinterForHumansMultiThreading.js";
*/
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Worker } from "node:worker_threads";

import HelperOptions from "../../src/helpersSupport/helperOptions.js";

export default class prettyPrinterForHumansMultiThreading {
  /**
   * This is a reference to HelperOptions so the developer doesn't need to import it independently
   * */
  static fieldHelperOptions = HelperOptions;

  static fieldStringPathWorker = `${dirname(
    fileURLToPath(import.meta.url)
  )}/worker.js`;
  /**
   * This function is the same as pformatSync, except it executes asynchronously on another thread
   * and returns a promise
   *
   * @param {any} arg
   * @param {HelperOptions} argHelperOptions
   * @returns Promise
   * */
  static pformatAsyncMultiThreaded = async (arg, argHelperOptions = {}) =>
    new Promise((resolve, reject) => {
      //
      // Create worker with module type
      //
      const worker = new Worker(
        prettyPrinterForHumansMultiThreading.fieldStringPathWorker,
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
          `${prettyPrinterForHumansMultiThreading.fieldStringPathWorker}: err = ${err}`
        );
      //
      // Run worker
      //
      worker.postMessage({
        arg: arg,
        argHelperOptions: argHelperOptions,
      });
    });
}
