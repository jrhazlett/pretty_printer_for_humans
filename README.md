# Pretty Printer For Humans

Author: James Hazlett

Email: james.hazlett.npm@gmail.com

License: MIT

Github: https://github.com/jrhazlett/pretty_printer_for_humans

---

"Stare at the data long enough, and sometimes the data stares back."

If you've ever ran an especially large json package through a pretty printing library only for it to print keys in its
original order, or any of the other issues experienced with JSON.stringify() or some other libraries, then you've come
to the right place.

Top features:

- Automatic indentation
- Auto-sort all keys ( can also sort data so complex objects display below simple entries )
- No recursion limit
- No external dependencies
- Auto-handles circular references by default
- Multi-threading support
- Set number of layers to display ( layers beyond set layer will auto-summarize; ie `{ ... }` )
- Map support

Note: Update log at bottom of document

## Notes on data safety

This library doesn't make any changes to the input.

## To install...

npm i pretty_printer_for_humans

## Definitions

- 'The stack' - When I refer to this, I mean the custom stack used to process the entire data packages in
  prettyPrinterForHumans.
- 'The main function' - This refers to pformat() if its not clear within the context of its use.
- 'Function' - Technically every 'function' in this library is a method, but I think more people will understand
  'function' than method.

## Public functions

## Functions in prettyPrinterForHumans

To import:<br>
import prettyPrinterForHumans from "pretty_printer_for_humans";

NOTE: ALL 'async' functions part of this import are **single-threaded**.

### 'The main function': `pformat( arg, { /*options*/ } )`

This is the 'workhorse' function for the library. This function takes 'arg', which can be of any data type, and outputs
a string formatted in a human-friendly way.

NOTE: Any function responsible for getting the resulting string value or printing data to the screen, will ALL call
this function.

NOTE: By design, the resulting string will include a function signature in a data structure, but not its definition.
Also, ALL functions will appear with the following template: `( /* args */ ) => { ... }` The printer does not
distinguish between arrow functions and non-arrow functions.

### Available argument options:

NOTE: Developer can (optionally) access the helper for options, prettyPrinterForHumans has it as a member
attribute: `prettyPrinterForHumans.fieldHelperOptions`. This is not actually needed to pass options to any of the
functions.

#### argBoolHandleCircularReferences

If true, this option prevents infinite loops due to circular references. It does this by adding an object, and storing
it in a set. If the id already exists in the set at a later point then the script will not process that reference a 2nd
time.

### argBoolPrintWarningOnCircularReference

```
import prettyPrinterForHumans from "pretty_printer_for_humans";

const objectCircularReference = { F: 6 };

objectCircularReference["actualReference"] = objectCircularReference;

const inputData = {
    A: 1,
    B: 2,
    object: {
        C: 3,
        D: 4,
        E: 5,
    },
    objectCircularReference: objectCircularReference,
}

const result = await prettyPrinterForHumans.pformatAsync(
    inputData,
    {
        argEnumSortOption: prettyPrinterForHumans.fieldHelperOptions.fieldEnumSortOptions.fieldOptionPrintAlphabetical,
        argStringNameToOutput: "result",
    },
)

// Output if printed

result =
{
    A : 1,
    B : 2,
    object : {,
        C : 3,
        D : 4,
        E : 5,
    },
    objectCircularReference : {,
WARNING: value is a circular reference
        actualReference : { CIRCULAR REFERENCE },
        F : 6,
    },
}
```

#### argBoolPrintErrorOnErrorObject

If true, this prints "ERROR: value is an error object" above any error object within the output.

NOTE: This string will never indent.

##### Example

```
import prettyPrinterForHumans from "pretty_printer_for_humans";

const result = await prettyPrinterForHumans.pformatAsync(
    [ 1, 2, Error( "3" ), ],
    {
        argEnumSortOption: prettyPrinterForHumans.fieldHelperOptions.fieldEnumSortOptions.fieldOptionPrintAlphabetical,
        argStringNameToOutput: "result",
    },
)

// Output if printed

result =
[
    0 : 1,
    1 : 2,
ERROR: value is an error object
    2 : Error: 3,
]
```

#### argBoolPrintWarningOnPromise

If true, this prints "WARNING: value is a promise" above any promise object within the output. Otherwise, its pretty
much the same as argBoolPrintErrorOnErrorObject.

NOTE: This string will never indent.

#### argEnumSortOption

This takes one of three values. All of which can be pulled from:
HelperOptions.fieldEnumSortOptions

The options are ( see examples further down for how this looks ):

---

(DEFAULT) HelperOptions.fieldEnumSortOptions.fieldOptionPrintAlphabetical

This prints all keys in order. Array indexes are displayed in numerical order. Object keys display in string-centric
alphabetical order, and is **not** case-sensitive.

```
import prettyPrinterForHumans from "pretty_printer_for_humans";

const result = prettyPrinterForHumans.pformat(
  {
    "object" : { "object.0" : 0, "object.1" : 1, "object.2" : 2, },
    "zero" : 0,
    "array" : [ "array.0", "array.1", "array.2", ],
    "int" : 1,
    "string" : "testString",
  },
  {
    argEnumSortOption: prettyPrinterForHumans.fieldHelperOptions.fieldEnumSortOptions.fieldOptionPrintComplexLast,
    argStringNameToOutput: "result",
  },
)

// Output if printed

result =
{
    array : [
        0 : array.0,
        1 : array.1,
        2 : array.2,
    ],
    int : 1,
    object : {
        object.0 : 0,
        object.1 : 1,
        object.2 : 2,
    },
    string : testString,
    zero : 0,
}
```

---

HelperOptions.fieldEnumSortOptions.fieldOptionPrintComplexLast

This also prints keys in alphabetical order **but** it distinguishes between values with children and those without.
The values with children print at the bottom of a given layer.

```
import prettyPrinterForHumans from "pretty_printer_for_humans";

const result = prettyPrinterForHumans.pformat(
{
    "object" : { "object.0" : 0, "object.1" : 1, "object.2" : 2, },
    "zero" : 0,
    "array" : [ "array.0", "array.1", "array.2", ],
    "int" : 1,
    "string" : "testString",
  },
  {
    argEnumSortOption: prettyPrinterForHumans.fieldHelperOptions.fieldEnumSortOptions.fieldOptionPrintComplexLast,
    argStringNameToOutput: "result",
  },
)

// Output if printed

result =
{
    int : 1,
    string : testString,
    zero : 0,
    array : [
        0 : array.0,
        1 : array.1,
        2 : array.2,
    ],
    object : {
        object.0 : 0,
        object.1 : 1,
        object.2 : 2,
    },
}
```

Note: Strings do not count as 'having children'.

---

HelperOptions.fieldEnumSortOptions.fieldOptionPrintOriginalOrder

This prints keys in their original order.

#### argIntDepthToPrint

This sets how far into a data structure the script will print data. i.e. If an object is passed to the function and
this value is set to 1, then the output will only include the keys in that object. If a child also has children, then
it will print a summary value instead.
i.e.
`[ ... ]` for arrays
`Map( ... )` for maps
`{ ... }` for objects

The default value for this option is 'undefined', and this means the printer will attempt to print all layers.

If this option is set to 1, the printer will only query the immediate argument passed to pformat(). If the value
is set to 2, then the function will query both the immediate argument, and any children.

If the number exceeds the depth of the argument, then this will result in the entire data structure getting processed.

NOTE: Any value <= 1 will provide the same output.

```
import prettyPrinterForHumans from "pretty_printer_for_humans";

const result = prettyPrinterForHumans.pformat(
  [ "zero", "one", "two", "three", [ "four", "five", "six", ], ],
  {
    argStringNameToOutput: "result",
    argIntDepthToPrint: 1,
  },
)

// Output if printed

result =
[
    0 : zero,
    1 : one,
    2 : two,
    3 : three,
    4 : [ ... ],
]
```

#### argStringIndentation

This sets the whitespace indentation for each layer. This defaults to four spaces. There aren't any restrictions on
what this string can contain.

#### argStringNameToOutput

This adds a header for the returned string, with an " =" sign. This is why 'result =' appears at the top of each
example. If this option is never set then the related line is never added.

#### argStringTrailingSpace

This adds lines to the bottom of the returned string. This is mostly meant to add whitespace between the output and
whatever is printed next, but the value for this can be any string.

#### OPTION DESCRIPTORS END HERE

---

## Additional single-thread functions

NOTE: All these functions take the same arguments as `pformat()`

### Functions that expand on pformat()

`pformatAsync( arg, { /*options*/ } )`

This takes the same 'arg' and options as the original function. What this does is it runs `pformat()` in a Promise
wrapper to prevent code blocking.

`pprint( arg, { /*options*/ } )`

This takes the same 'arg' and options as the original function. This runs `pformat()` and passes the result to
console.log().

NOTE: There is no async equivalent to this function. The assumption is if you call it, its because you want it to print
immediately.

### Other functions (outside of pformat)...

`getArrayOfPathsInArg( arg )`

Returns a sorted array of possible paths within arg.
If arg is not an array / object, the returned array will be empty.

Note: The resulting array _should_ still be sorted.

`getValueInArgAtPath( arg, argArrayPath )`

Returns the stored value accessed via a given path.
Yes, you can include array indexes. How they work: <br>

- They can be string or number
- **Must** be convertible to an int. Decimal values will be treated like 'bad keys'.
- All keys are case-sensitive

```
import prettyPrinterForHumans from "pretty_printer_for_humans"

const data = {
    "A" : "VAL_A",
    "B" : "VAL_B",
    "ARRAY" : [
        1,
        2,
        [ 3, 4, 5 ]
    ],
    "Object" : {
        "C" : "VAL_C",
        "D" : "VAL_D",
        "Object.2" : {
            "E": "VAL_E",
            "F": "VAL_F",
        }
    }
}

console.log( prettyPrinterForHumans.getValueInArgAtPath(
    [
        "Object",
        "Object.2",
        "F",
    ],
    data
) )

// Output after running

VAL_F
```

_**If the path to the value does not exist...**_

Note: This is the result of the console logging an Error() object. This will not interrupt the
library or the app.

```
import prettyPrinterForHumans from "pretty_printer_for_humans"

    const data = {
        "A" : "VAL_A",
        "B" : "VAL_B",
        "ARRAY" : [
            1,
            2,
            [ 3, 4, 5 ]
        ],
        "Object" : {
            "C" : "VAL_C",
            "D" : "VAL_D",
            "Object.2" : {
                "E": "VAL_E",
                "F": "VAL_F",
            }
        }
    }

    const err = prettyPrinterForHumans.getValueInArgAtPath(
        [
            "Object",
            "Object.2",
            "BROKEN_KEY",
            "BROKEN_KEY2",
            "BROKEN_KEY3"
        ],
        data
    )

    console.log( err )

// Output after running

Error: Failed to navigate path
keyAtFailure = BROKEN_KEY
arrayPath = Object,Object.2,BROKEN_KEY,BROKEN_KEY2,BROKEN_KEY3
arrayPathThatExists = Object,Object.2
arrayPathMissing = BROKEN_KEY,BROKEN_KEY2,BROKEN_KEY3
arrayOfAvailableKeysAtFailure = E,F
dataTypeAtFailure = object
    at Function._getErrorBecausePathFailed (file:///Users/jameshazlett/Projects/nodejs/pretty_printer_for_humans/zzz_pushed_to_git/pretty_printer_for_humans/src/prettyPrinterForHumans.js:229:12)
    at Function.getValueAtPath (file:///Users/jameshazlett/Projects/nodejs/pretty_printer_for_humans/zzz_pushed_to_git/pretty_printer_for_humans/src/prettyPrinterForHumans.js:182:50)
    at main (file:///Users/jameshazlett/Projects/nodejs/pretty_printer_for_humans/zzz_test_install/test_install/index.js:35:41)
    at file:///Users/jameshazlett/Projects/nodejs/pretty_printer_for_humans/zzz_test_install/test_install/index.js:64:1
    at ModuleJob.run (node:internal/modules/esm/module_job:183:25)
    at async Loader.import (node:internal/modules/esm/loader:178:24)
    at async Object.loadESM (node:internal/process/esm_loader:68:5)
    at async handleMainPromise (node:internal/modules/run_main:63:12)
```

`getValueAtPathInArgAsync( argArrayPath, arg )`

As per usual, this does the same thing as

`isKeyInArg( arg, argKey, argBoolCaseSensitive )`

This function goes through arg's data structure and searches for keys.
If arg is not an array / object, then this will default to false.

If argBoolCaseSensitive is true, then this search uses hasOwnProperty().
If false, then this search does a case-insensitive locale comparison.

NOTE: This only supports key lookups and **not** array indexes. It seemed kinda pointless to put "0" as an argument,
and have the function return 'true' immediately upon coming across a non-empty array.

`isKeyInArgAsync( arg, argKey, argBoolCaseSensitive )`

This is the async version of `isKeyInArg()`

`isPathInArg( argArrayPath, arg )`

Returns true if the path exists within arg's structure, and false if it doesn't.

This uses similar pathing logic as `getValueAtPathInArg()`:

- Strings are tolerated for array indexes (but not decimal values)
- Case-sensitive

`isPathInArgAsync( argArrayPath, arg )`

This is the async version of `isPathInArg()`

`isRecursive( arg )`

This returns true if the argument is at least three levels deep.

## High-level explanation of the script

The entire library revolves around the function `pformat()`.

The algorithm makes heavy use of a stack of object instances, rather than having functions call themselves. This
is to keep from colliding any recursion limits, and is generally more processing efficient than function approach.

Each object popped off the stack contains a value. The printer checks various attributes for a couple of
characteristics:

- Is the value an array?
- Is the value an object?
- Is the value an error object?
- Is the value a promise?
- Is the value a basic type? (ie string or number)

If the value is either an array or a basic object, then the printer will check it for children and move those to the
stack for processing.

The printer auto-sorts all object keys by default.

## prettyPrinterForHumansMultiThreading

To import:<br>

`import prettyPrinterForHumansMultiThreading from "pretty_printer_for_humans/src/prettyPrinterForHumansMultiThreading/prettyPrinterForHumansMultiThreading.js"`

WARNING: Any limitations specific to workers still apply. ( ie attempting to clone functions, and environmental
limitations )

NOTE: There are **no** synchronous functions that are part of this import. ALL 'async' functions are
**multi-threaded**.

### Functions

`getArrayOfPathsInArgAsync()`

Returns a sorted array of possible paths within arg.
Ver 1.1.5 - Each 'path' stored within this array is also an array.

If arg is not an array / object, the returned array will be empty.

Accomplishes this by executing the work on another thread.

`getValueAtPathInArgAsync( argArrayPath, arg )`

Fetches the value at the given path. This happens on a 2nd thread.

The function returns a promise, which turns into the value at the path upon resolution.

If the path doesn't exist, then the promise will resolve into an error object with a comprehensive
data dump of why the path didn't work.

`isKeyInArgAsync( arg, argKey, argBoolCaseSensitive = true )`

This function goes through arg's data structure and searches for keys.
If arg is not an array / object, then this will default to false.

If argBoolCaseSensitive is true, then this search uses hasOwnProperty().
If false, then this search does a case-insensitive locale comparison.

NOTE: This only supports key lookups and **not** array indexes. It seemed kinda pointless to put "0" as an argument,
and have the function return 'true' immediately upon coming across a non-empty array.

Accomplishes this by executing the work on another thread.

`isPathInArgAsync( argArrayPath, arg )`

This is the same as `isPathInArg()` except it executes on another thread.

It takes the array and uses its keys to drill into arg and grab the stored value. The function itself returns
a promise, which becomes a boolean statement after resolution.

`pformatAsync( arg, { /*options*/ } )`

This takes the same 'arg' and options as `pformat()`, and it merely moves the workload to a 2nd thread.

The library doesn't attempt to serialize the data ahead of time because this would mean either cloning the data
structure, which would defeat the point of using another thread, or it would require editing the argument itself,
which would cause data loss.

The library also doesn't attempt error handling here, since it looks like workers are still a 'work in progress.'

```
import prettyPrinterForHumansMultiThreading from
    "pretty_printer_for_humans/src/prettyPrinterForHumansMultiThreading/prettyPrinterForHumansMultiThreading.js"

const result = await prettyPrinterForHumansMultiThreading.pformatAsync(
    {
        "2" : 2,
        "3" : 3,
        "1" : 1,
    },
    {
        argStringNameToOutput: "result",
        argEnumSortOption:
            prettyPrinterForHumansMultiThreading.fieldHelperOptions.fieldEnumSortOptions.fieldOptionPrintAlphabetical,
    },
)

// Output if printed

result =
{
    1 : 1,
    2 : 2,
    3 : 3,
}
```

## Handling circular references

This is handled via...
src/helpersPrettyPrinter/helpersCircularReferences/helperCircularReferences.js

It turns out, while unique ids for objects aren't reachable within Javascript, it looks like Set() can still track
them. That's pretty much how this module works: `isAlreadyTraversed()` checks if an object already exists. If true,
it returns true. If false, it will add the object to the set and then return false.

## Optimizations

- 'static' is used whenever possible; this keeps various defs down to one memory entry.
- If the anticipated array's size is known ahead of time, then its defined immediately.
- For loops store array lengths ahead of iterating ( objects also benefit from their equivalent ).
- Different approaches were benchmarked, and the code reflects the fastest approach tested.
- An independent stack is used for recursion; This cuts out a lot of processing overhead, and prevents running into
  the limit.
- Switch statements are used whenever possible.
- Repeating comparisons rely on ints rather than re-evaluating values / scanning strings.

#### Garbage collection / memory leaks

This library **should** be completely free of memory leaks. There are **no** cases of outer scope variable references,
without either being pass-by-argument or being an intentionally static single-instance global. The maximum possible
scope of **all** dynamically created instances **is** `pformat()`. So, once `pformat()` concludes, **all**
references to these dynamic instances **should** drop to zero.

Each "ObjectForStack" instance moves exclusively through argument passing, and **should** have their references drop
to zero upon leaving the stack and then dropping from scope.

#### Special note: The script pushes all items to the stack, rather than directly to the output array

Even when reaching the 'leaf' values in a given tree, the routing functions still push to the stack, rather than
directly to output. This is intentional, because it allows all output and formatting code to be consolidated within
the actual `pformat()` function, rather than being distributed across multiple modules.

## Notes for modifying code

### Modules

#### src/helpersPrettyPrinter/prettyPrinterForHumans.js

This is both the primary interface for the library and where it manages:

- The overall stack
- Formatting for output

#### src/helpersPrettyPrinter/helperOptions.js

This is a container for options to use with `pformat()` and all similar functions.

#### src/helpersPrettyPrinter/helpersProcessing

The two modules present here are pretty much for iterating across arrays and objects. They route the arg's children to
one of the 'helperProcessChild' modules depending on the enabled options.

#### src/helpersPrettyPrinter/helpersProcessingChildren

This directory handles ordering for moving child nodes / leafs to the central stack. These also create the 'opener'
and 'closure' brackets for objects and arrays respectively.

#### src/helpersPrettyPrinter/helpersSupport/helperEnumDataTypes.js

This is used for identifying and encoding data types into ints. The 'enum' data type isn't actually used.

#### src/prettyPrinterForHumansMultiThreading

This contains two files:<br>
prettyPrinterForHumansMultiThreading.js<br>
worker.js

prettyPrinterForHumansMultiThreading is pretty much just async + worker wrappers for many of the same functions as
prettyPrinterForHumans.

worker.js does a bit more heavy lifting. No only does it execute the desired function on a 2nd thread, but it also
auto-searches the incoming message for relevant arguments to dynamically feed to the target function.

While there's a fair amount of processing here to line up the relevant arguments, all this happens on the 2nd thread,
and supports a single agnostic worker, rather than managing a bunch of redundant definitions.

### Naming schemes

Much like with my other projects, I like to exploit code completion features to their fullest extent. To do this, I
use a lot of repeating prefixes, so all code suggestions pretty much act like a search box. Basically
everything follows these formats:

Classes:

- Name outline: ( 'H/helper' )( descriptive name )
- All have 'helper' at the beginning. If the 'H' is captialized, then its meant to be instantiated, otherwise its
  static.
- Classes exist in pretty much all helper modules. The reason for this is to avoid order-sensitive execution, which
  makes reading the code later messy if this isn't done ahead of time.

Functions / Methods:

- Name outline: ( verb )( data type )( descriptive name ).
- The verb tends to be: get / load (into object) / pop / set.
- If a public function doesn't seem to return anything, then I usually set it to return 'this' by default, to support
  chaining calls.

Variables:

- Name outline: ( arg / item? )( data type )( descriptive name ).
- The 'arg' prefix is meant to identify function arguments within function blocks.
- 'item' is a keyword I like using to indicate if a variable is expected to be unique for each loop iteration
- Intended data types are included in variables names because IDEs typically show these in tool tips. Actual
  desciption blocks usually require more steps to view. This is very much intended to be a: "Let the software handle
  the minutae" philosophy.
- If the data type isn't mentioned, then the variable is meant to be 'any'.
- Any argument that ends with 'ToUpdate' will be changed during the execution of the associated function.

## Questions

### Why is it pure Javascript?

This actually grew out of a different library I'm working on releasing. The same rules for that library also apply
here: consistent code across all modules. IDEs tend to be friendly enough with type annotation that TypeScript's
return on value is diminished a bit. That and I have yet to find an effective solution for creating web workers that
can both run TypeScript and import other TypeScript modules.

Also, the whole library is meant to be accessible and modded ( hence the MIT license ).

### This code violates X style, is this intentional?

All formatting runs through the 'prettier' ( https://prettier.io/ ) script, before uploading.

Beyond this, each language has their own situational standards with surprisingly little cross-over with other
languages. I do what makes sense to get 'as close as reasonable'. There are also things absent from various style
guides around actually organizing large amounts of code, which I feel should exist.

### Why did you optimize this code?

The larger the package passed to this library's main function, the more processing that needs to happen. Ideally, this
library should generate results as fast as reasonable.

### Why do some functions make changes to their arguments, instead of returning values?

My general top rules for code is 'be practical' and 'be consistent'. A returned value tends to imply a newly created
value. If the result **is** one of the arguments, then just mark that the argument will be changed during the
function's execution with the "ToUpdate" suffix. In earlier iterations of the code, there were actually multiple
arguments updated, but I managed to trim those down.

Also, the 'const' keyword in Javascript really just means the variable's memory address can't change. The contents of
what's in that memory address can. Ideally, a developer wants to use this keyword as much as possible, this
incentivizes updating arguments within functions rather than doing what amounts to 'reassigning the variable to
itself.' For performance reasons, this library proactively avoids cloning its own data structures.

### Why did you elect to print warnings for Promises rather than just have the library wait for them to complete?

This is about 'separation of concerns'. This library is a debugging tool and not meant to fill a role in
production-ready code. If the library prints a warning about a promise, this most likely means the external code isn't
properly resolving all the promises properly, ahead of trying to print it. The developer doesn't want to be in a
position where they think the data is resolving properly **because** of the printer.

### I see 'async' wrappers, but the core of this library is fundamentally synchronized; why?

Two big risks govern this design choice:

1. Intermingling external and internal promises: The library does not resolve incoming promises by design. This is so
   developers can know if certain promises are getting resolved or not. If the main printing algorithm used its own
   promises, this would require more overhead to distinguish between the two.

2. Possible performance loss compared to sync execution: On a past Rust project, there was a 'make everything async'
   mentality. Async does not come without a processing cost. In handling basic data, async execution often under-
   performed compared to sync execution. Since Javascript overall is less performant than Rust, the performance loss
   would likely be more noticeable.

In this case, at the very least promises would need to be created, more data structures would be necessary to manage
the data in chunks, and then there would need to be calls to polling functions to make sure all promises resolved
themselves before going to screen.

Adding the option to make the entire script non-blocking and another option to offload the task to another thread
should be sufficient for minimizing any potential performance risk this script might pose.

### Why doesn't this include external libraries?

In a perfect world, this library _should_ be a 'one and done' package. I'm unlikely to have a lot of opportunities to
update this after my current circumstances change. The more complicated this package, the more likely it is to break
in the future, so I'm focusing on keeping it robust as possible.

### What IDE did you develop this library with?

WebStorm by JetBrains
https://www.jetbrains.com/webstorm/

### What's the story behind the library's name?

Really, 'pretty_printer' was already taken. I decided to add the 'for_humans' bit to distinguish this library for
being **meant** for human consumption and navigation.

## Updates and fixes

### Ver. 1.1.9

Added symbol support in cases where a path fails and needs to return printable info
Fixed a bug where the pathing key data outputted as an 'object' rather than the individual keys

### Ver. 1.1.8

Fixes:

Fixed an issue where Symbol() could crash the Map printing process

(Hopefully) This update should resolve any future Symbol()-related errors.

Updates:

Added Set support. Since sets are not order dependent, these have a custom sorting process, which sorts the values,
putting the complex objects last. (This also accounts for Symbol() values).

```
// Input

const setSub = new Set()
const arrayForSetSubOne = [ Symbol( "set1.2" ), "set1.3", "set1.1", ]
for ( let item of arrayForSetSubOne ) { setSub.add( item.toString() ) }

const setInput = new Set()
const arrayForSet = [ "set0.3", setSub, "set0.1", "set0.2", ]
for ( let item of arrayForSet ) { setInput.add( item ) }

console.log( await prettyPrinterForHumans.pformatAsync(
    setInput,
    {
        argStringNameToOutput: "result",
    }
) )

// Output

result =
Set(
    0 : set0.1,
    1 : set0.2,
    2 : set0.3,
    3 : Set(
        0 : Symbol(set1.2),
        1 : set1.1,
        2 : set1.3,
    ),
)
```

### Ver. 1.1.7

Added Map support. This overrides the library's original behavior, where it originally regarded them
as objects.

Example output:

```
Map(
    1 : A,
    2 : B,
    3 : C,
)
```

Outside of the different enclosures, the map plays by the same rules as arrays and
objects.

Fixed an issue where in some cases, the library added a ',' where it shouldn't have.

### Ver. 1.1.6

Added search terms for npm <br>
Bumped up version to get readme to show up again in chrome

### Ver. 1.1.5

Printer changes:

Data type management is now handled within a `typeof` + `switch` combo to eek out
a slightly faster series of evaluations.

Support function changes:

NOTE: **None** of the changes mentioned here affect `pformat`, `pprint`, or any
of their directly associated functions.

Changed:
All paths handled in-library are now arrays. This change addresses a few risks:

- The resulting paths no longer require type conversions
- Avoids issues which could block string conversions

`getArrayOfStringsPathsInArg()` is now `getArrayOfPathsInArg()`

This function now returns an 'array of arrays'. Each child array in this returned value
represents an individual path.

New functions:

See later in this document for details on how to use these functions.

getValueAtPath() - Returns the stored value if the path exists.
I planned on saving this for another library, but this one is fine too.

isPathInArg() - Returns true if following the path within the arg leads to a
stored value.

### Ver. 1.1.4

Fixed crash where `[Object: null prototype]` wasn't properly id'd as an object.
Tested against Express req objects.

### Ver. 1.1.3

Bug fix: Removed extra console messages from previous debugging changes.

### Ver. 1.1.0

Added support for symbols.

### Ver. 1.0.9

Name scheme changes:<br>
'Sync' was removed from all function names. From now on, if the function name doesn't have the 'Async' suffix, then
assume its execution is synchronous.

All functions in `prettyPrinterForHumansMultiThreading` now end with the `Async` suffix. There's no longer any mention
of `MultiThreading` in the names.

New functions added to `prettyPrinterForHumansMultiThreading`:<br>
getArrayOfPathsInArgAsync()<br>
isKeyInArgAsync()

Added smarter code to the worker. This only really affects people intending to clone the code and change it. Details
documented later in the readme, as well as in the code.

`prettyPrinterForHumansMultiThreading` now has its own section in the readme.

Theoretical performance improvement: Swapped out `.toLowerCase()` for case-insensitive string compares with
`.localCompare()` with a static option object. I also implemented the same swap for `.sort()` functions.

### Ver. 1.0.8

Added multi-threading equivalents for (see lower sections for details)<br>
getArrayOfPathsInArg()<br>
isKeyInArg()

### Ver. 1.0.7

Fixed bug where circular reference tracker pre-maturely registered false positives
Added performance improvement to case-insensitive string comparisons
Added functions (see lower sections for details):<br>
getArrayOfPathsInArg()<br>
isKeyInArg()

### Ver. 1.0.6

Fixed static references in prettyPrint functions.

### Ver. 1.0.5

Compatibility fix: Multi-threading is now disconnected from the root import location. This prevents the import from
blocking builds on non-Nodejs projects. To see how to import the multi-threading component, see the section for
`pformatAsyncMultiThreaded( arg, { /*options*/ } )`.

Fixed pathing issue where worker path didn't work for library installs.
