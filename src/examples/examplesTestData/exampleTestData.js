"use strict";

export default class exampleTestData {
    //
    // Arrays
    //
    /**
     * @returns []
     * */
    static getArrayNestedSimple = () => [
        "zero",
        "one",
        "two",
        "three",
        ["four", "five", "six"],
        "seven",
        "eight",
        "nine",
    ];
    /**
     * @param {number} argIntSize
     * */
    static getArrayOfNumbers = (argIntSize) => [...Array(argIntSize).keys()];
    /**
     * @returns []
     * */
    static getArraySimple = () => ["one", "two", "three"];

    static getArrayWithCallback = () => [
        "one",
        "two",
        "three",
        (argOne, argTwo, argThree) => console.log(`argOne = ${argOne}`),
    ];

    static getArrayWithError = () => [1, 2, Error("3")];
    //
    // Objects
    //
    /**
     * @returns object
     * */
    static getObjectNestedComplex = () => ({
        //
        // Single values
        //
        int: 1,
        string: "testString",
        zero: 0,
        //
        // Arrays
        //
        array: ["array.0", "array.1", "array.2"],
        arrayOfArrays: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ],
        //
        // Object
        //
        object: { "object.0": 0, "object.1": 1, "object.2": 2 },
        objectOfObjects: {
            "objectOfObjects.0": {
                "objectSub.0.0": 0,
                "objectSub.0.1": 1,
                "objectSub.0.2": 2,
            },
            "objectOfObjects.1": {
                "objectSub.1.3": 3,
                "objectSub.1.4": 4,
                "objectSub.1.5": 5,
            },
            "objectOfObjects.2": {
                "objectSub.2.6": 6,
                "objectSub.2.7": 7,
                "objectSub.2.8": 8,
            },
        },
    });

    /**
     * @returns object
     * */
    static getObjectNestedComplexUltra = () => ({
        //
        // Single values
        //
        int: 1,
        string: "testString",
        zero: 0,
        aaa: "aaaZ",
        //
        // Arrays
        //
        array: ["array.0", "array.1", "array.2"],
        arrayOfArrays: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ],
        //
        // Object
        //
        object: { "object.0": 0, "object.1": 1, "object.2": 2 },
        objectOfObjects: {
            "objectOfObjects.0": {
                "objectSub.0.0": 0,
                "objectSub.0.1": 1,
                "objectSub.0.2": 2,
            },
            "objectOfObjects.1": {
                "objectSub.1.3": 3,
                "objectSub.1.4": 4,
                "objectSub.1.5": 5,
            },
            "objectOfObjects.2": {
                "objectSub.2.6": 6,
                "objectSub.2.7": 7,
                "objectSub.2.8": 8,
            },
        },
        callbackNoArgs: () => {
            console.log(`TEST`);
        },
        callbackOneArg: (argOne) => {
            console.log(`argOne = ${argOne}`);
        },
        callbackTwoArg: (argOne, argTwo) => {
            console.log(`argOne = ${argOne}`);
        },
        error: Error("testError"),
        promise: new Promise((resolve) => {
            resolve();
        }),
    });
    /**
     * @returns object
     * */
    static getObjectNestedComplexUltraScrambled = () => ({
        int: 1,
        string: "testString",
        arrayOfArrays: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ],
        zero: 0,
        aaa: "aaaZ",
        object: { "object.1": 1, "object.0": 0, "object.2": 2 },
        objectOfObjects: {
            "objectOfObjects.0": {
                "objectSub.0.1": 1,
                "objectSub.0.0": 0,

                "objectSub.0.2": 2,
            },
            "objectOfObjects.1": {
                "objectSub.1.4": 4,
                "objectSub.1.3": 3,
                "objectSub.1.5": 5,
            },
            "objectOfObjects.2": {
                "objectSub.2.8": 8,
                "objectSub.2.6": 6,
                "objectSub.2.7": 7,
            },
        },
        array: ["array.0", "array.1", "array.2"],
        callbackNoArgs: () => {
            console.log(`TEST`);
        },
        callbackOneArg: (argOne) => {
            console.log(`argOne = ${argOne}`);
        },
        callbackTwoArg: (argOne, argTwo) => {
            console.log(`argOne = ${argOne}`);
        },
        error: Error("testError"),
        promise: new Promise((resolve) => {
            resolve();
        }),
    });
    /**
     * @returns object
     * */
    static getObjectNestedSimple = () => ({
        //
        // Arrays
        //
        array: ["array.0", "array.1", "array.2"],
        //
        // Object
        //
        object: { "object.0": 0, "object.1": 1, "object.2": 2 },
        //
        // Single values
        //
        int: 1,
        string: "testString",
        zero: 0,
    });

    /**
     * @returns object
     * */
    static getObjectNestedSimpleScrambled = () => ({
        object: { "object.0": 0, "object.1": 1, "object.2": 2 },
        string: "testString",
        array: ["array.0", "array.1", "array.2"],
        zero: 0,
        int: 1,
    });

    /**
     * @returns object
     * */
    static getObjectWithAttributeForTracking = () => ({
        1: "one",
        2: "two",
        3: "three",
        ____zzzPrettyPrinterIdForObjectForHumans____: 1,
        4: {
            5: "five",
            ____zzzPrettyPrinterIdForObjectForHumans____: 2,
        },
    });

    /**
     * @returns object
     * */
    static getObjectWithCircularReference = () => {
        const objectCircularReference = {
            F: 6,
        };

        objectCircularReference["actualReference"] = objectCircularReference;

        return {
            A: 1,
            B: 2,
            object: {
                C: 3,
                D: 4,
                E: 5,
            },
            objectCircularReference: objectCircularReference,
        };
    };
    //
    // Strings
    //
    /**
     * @returns string
     * */
    static getStringUrlExampleCom = () => "http://example.com/";
}
