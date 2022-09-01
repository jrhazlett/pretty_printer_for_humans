"use strict";
/*
Note: This all runs on a secondary thread
*/
import { parentPort } from "node:worker_threads";

import prettyPrinterForHumans from "../prettyPrinterForHumans.js";
//
// NOTE: This runs on the 2nd thread
//
parentPort.once(`message`, (argMessageReceived) =>
  parentPort.postMessage(
    prettyPrinterForHumans.pformatSync(
      argMessageReceived.arg,
      argMessageReceived.argHelperOptions
    )
  )
);
