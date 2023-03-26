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

/**
 * This is a reference to HelperOptions so the developer doesn't need to import it independently
 * */
const fieldHelperOptions = HelperOptions;

const fieldStringPathWorkerExp = `${dirname(
    fileURLToPath(import.meta.url)
)}/worker.js`;

/**
 * This returns a sorted array of strings.
 *
 * @param {any} arg
 * @returns Promise
 * */
export const getArrayOfPathsInArgAsync = async (arg) =>
    new Promise((resolve, reject) => {
        const worker = new Worker(fieldStringPathWorkerExp, {
            type: `module`,
        });
        worker.once(`message`, (argResponseFromWorker) =>
            resolve(argResponseFromWorker)
        );
        worker.onerror = (err) =>
            reject(`${fieldStringPathWorkerExp}: err = ${err}`);
        worker.postMessage({
            arg: arg,
            argArrayOfKeysInOrder: ["arg"],
            argStringNameForFunction: "getArrayOfStringsPathsInArg",
        });
    });

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
export const getValueAtPathInArgAsync = (argArrayPath, arg) =>
    new Promise((resolve, reject) => {
        const worker = new Worker(fieldStringPathWorkerExp, { type: `module` });
        worker.once(`message`, (argResponseFromWorker) =>
            resolve(argResponseFromWorker)
        );
        worker.onerror = (err) =>
            reject(`${fieldStringPathWorkerExp}: err = ${err}`);
        worker.postMessage({
            argArrayPath: argArrayPath,
            arg: arg,
            argArrayOfKeysInOrder: ["argArrayPath", "arg"],
            argStringNameForFunction: "getValueAtPathInArg",
        });
    });

/**
 * This function returns true if the key is detected anywhere in the data structure.
 * If arg is not an array / object, then this will default to false.
 *
 * @param {any} arg
 * @param {any} argKey
 * @param {boolean} argBoolCaseSensitive
 * @returns Promise
 * */
export const isKeyInArgAsync = async (
    arg,
    argKey,
    argBoolCaseSensitive = true
) =>
    new Promise((resolve, reject) => {
        const worker = new Worker(fieldStringPathWorkerExp, {
            type: `module`,
        });
        worker.once(`message`, (argResponseFromWorker) =>
            resolve(argResponseFromWorker)
        );
        worker.onerror = (err) =>
            reject(`${fieldStringPathWorkerExp}: err = ${err}`);
        worker.postMessage({
            arg: arg,
            argKey: argKey,
            argBoolCaseSensitive: argBoolCaseSensitive,
            argArrayOfKeysInOrder: ["arg", "argKey", "argBoolCaseSensitive"],
            argStringNameForFunction: "isKeyInArg",
        });
    });

/**
 * @param {any[]} argArrayPath
 * @param {any} arg
 * @returns Promise
 * */
export const isPathInArgAsync = (argArrayPath, arg) =>
    new Promise((resolve, reject) => {
        const worker = new Worker(fieldStringPathWorkerExp, { type: `module` });
        worker.once(`message`, (argResponseFromWorker) =>
            resolve(argResponseFromWorker)
        );
        worker.onerror = (err) =>
            reject(`${fieldStringPathWorkerExp}: err = ${err}`);
        worker.postMessage({
            argArrayPath: argArrayPath,
            arg: arg,
            argArrayOfKeysInOrder: ["argArrayPath", "arg"],
            argStringNameForFunction: "isPathInArg",
        });
    });

/**
 * This function is the same as pformat(), except it executes asynchronously on another thread
 * and returns a promise
 *
 * @param {any} arg
 * @param {HelperOptions|{}} argHelperOptions
 * @returns Promise
 * */
export const pformatAsync = async (arg, argHelperOptions = {}) =>
    new Promise((resolve, reject) => {
        const worker = new Worker(fieldStringPathWorkerExp, {
            type: `module`,
        });
        worker.once(`message`, (argResponseFromWorker) =>
            resolve(argResponseFromWorker)
        );
        worker.onerror = (err) =>
            reject(`${fieldStringPathWorkerExp}: err = ${err}`);
        worker.postMessage({
            arg: arg,
            argHelperOptions: argHelperOptions,
            argArrayOfKeysInOrder: ["arg", "argHelperOptions"],
            argStringNameForFunction: "pformat",
        });
    });
