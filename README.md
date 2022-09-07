# Pretty Printer For Humans

Author: James Hazlett

Email: james.hazlett.npm@gmail.com

License: MIT

Github: https://github.com/jrhazlett/pretty_printer_for_humans

---

Updates and fixes:

Ver. 1.0.7
Fixed bug where circular reference tracker pre-maturely registered false positives
Added performance improvement to case-insensitive string comparisons
Added functions (see lower sections for details):
getArrayOfPathsInArg()
isKeyInArg()

Ver. 1.0.6
Fixed static references in prettyPrint functions.

Ver. 1.0.5
-Compatibility fix: Multi-threading is now disconnected from the root import location. This prevents the import from
blocking builds on non-Nodejs projects. To see how to import the multi-threading component, see the section for
`pformatAsyncMultiThreaded( arg, { /*options*/ } )`.
-Fixed pathing issue where worker path didn't work for library installs.

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

## Notes on data safety

This library doesn't make any changes to the input.

## To install...

npm i pretty_printer_for_humans

## Definitions

- 'The stack' - When I refer to this, I mean the custom stack used to process the entire data packages in
  prettyPrinterForHumans.
- 'The main function' - This refers to pformatSync() if its not clear within the context of its use.
- 'Function' - Technically every 'function' in this library is a method, but I think more people will understand
  'function' than method.

## To import

import prettyPrinterForHumans from "pretty_printer_for_humans";

## Public Methods

### 'The main function': `pformatSync( arg, { /*options*/ } )`

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

Yes, it intentionally breaks the `__` style rule, and is wordy on purpose. The point is for this to avoid colliding
with any pre-existing properties in the data.

NOTE: This attribute will NOT appear in the string returned by pformatSync() in ALL cases.

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

const result = await prettyPrinterForHumans.pformatAsyncSingleThread(
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

const result = await prettyPrinterForHumans.pformatAsyncSingleThread(
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

const result = prettyPrinterForHumans.pformatSync(
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

const result = prettyPrinterForHumans.pformatSync(
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
it will print a summary value instead. i.e. `[ ... ]` for arrays, and `{ ... }` for objects.

The default value for this option is 'undefined', and this means the printer will attempt to print all layers.

If this option is set to 1, the printer will only query the immediate argument passed to pformatSync(). If the value
is set to 2, then the function will query both the immediate argument, and any children.

If the number exceeds the depth of the argument, then this will result in the entire data structure getting processed.

NOTE: Any value <= 1 will provide the same output.

```
import prettyPrinterForHumans from "pretty_printer_for_humans";

const result = prettyPrinterForHumans.pformatSync(
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

## Additional functions

NOTE: All these functions take the same arguments as pformatSync()

### Functions that expand on pformatSync()

`pformatAsyncSingleThread( arg, { /*options*/ } )`

This takes the same 'arg' and options as the original function. What this does is it runs pformatSync() in a Promise
wrapper to prevent code blocking.

`pformatAsyncMultiThreaded( arg, { /*options*/ } )`

WARNING: This function is not importable through the root prettyPrinterForHumans library, and instead uses its own
import. This is so users can run the library in non-Nodejs environments.

This takes the same 'arg' and options as the sync function. This shifts `pformatSync()`'s workload to a 2nd thread.

WARNING: Any limitations specific to workers still apply. ( ie attempting to clone functions, and environmental
limitations )

The library doesn't attempt to serialize the data ahead of time because this would mean either cloning the data
structure, which would defeat the point of using another thread, or it would require editing the argument itself,
which would cause data loss.

The library also doesn't attempt error handling here, because some forums claim symbols can't be passed to workers,
but in my tests, this doesn't appear to be an issue. This pretty much says to me 'moving target.'

```
import prettyPrinterForHumansMultiThreading from
        "./src/prettyPrinterForHumansMultiThreading/prettyPrinterForHumansMultiThreading.js";

const result = await prettyPrinterForHumansMultiThreading.pformatAsyncMultiThreaded(
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

`pprint( arg, { /*options*/ } )`

This takes the same 'arg' and options as the original function. This runs pformatSync() and passes the result to
console.log().

NOTE: There is no async equivalent to this function. The assumption is if you call it, its because you want it to print
immediately.

### Other functions...

`getArrayOfStringsPathsInArg( arg )`

Returns a sorted array of possible paths within arg.
If arg is not an array / object, the returned array will be empty.

`getObjectWithoutTrackingAttributes( argToUpdate )`

This function removes the attributes needed for preventing circular references if they exist.

NOTE: This isn't necessary if argBoolHandleCircularReferences is set to false.

NOTE: This doesn't run unless manually called, to avoid potential data loss.

`isKeyInArg( arg, argKey, argBoolCaseSensitive )`

This function goes through arg's data structure and searches for keys.
If arg is not an array / object, then this will default to false.

If argBoolCaseSensitive is true, then this search uses hasOwnProperty().
If false, then this search does a case-insensitive locale comparison.

`isRecursive( arg )`

This returns true if the argument is at least three levels deep.

## High-level explanation of the script

The entire library revolves around the function pformatSync().

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

The printer auto-sorts all object keys by design.

## Handling circular references

This is handled via...
src/helpersPrettyPrinter/helpersCircularReferences/helperCircularReferences.js

After some cursory research, it doesn't look like there's a consistently good way to get a unique id for each object
instance in javascript.

To get around this, I went with the 'minimally invasive' approach by defining a new attribute in objects passed to the
printer, which **should** have a pretty low chance of showing up in other people's projects. It also intentionally
breaks the typical coding convention for underscores by design, to help with this (four leading and trailing
underscores, rather than two).

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
scope of **all** dynamically created instances **is** pformatSync(). So, once pformatSync() concludes, **all**
references to these dynamic instances **should** drop to zero.

Each "ObjectForStack" instance moves exclusively through argument passing, and **should** have their references drop
to zero upon leaving the stack and then dropping from scope.

#### Special note: The script pushes all items to the stack, rather than directly to the output array

Even when reaching the 'leaf' values in a given tree, the routing functions still push to the stack, rather than
directly to output. This is intentional, because it allows all output and formatting code to be consolidated within
the actual pformatSync() function, rather than being distributed across multiple modules.

## Notes for modifying code

### Modules

#### src/helpersPrettyPrinter/prettyPrinterForHumans.js

This is both the primary interface for the library and where it manages:

- The overall stack
- Formatting for output

#### src/helpersPrettyPrinter/helperOptions.js

This is a container for options to use with pformatSync() and all similar functions.

#### src/helpersPrettyPrinter/helpersProcessing

The two modules present here are pretty much for iterating across arrays and objects. They route the arg's children to
one of the 'helperProcessChild' modules depending on the enabled options.

#### src/helpersPrettyPrinter/helpersProcessingChildren

This directory handles ordering for moving child nodes / leafs to the central stack. These also create the 'opener'
and 'closure' brackets for objects and arrays respectively.

#### src/helpersPrettyPrinter/helpersSupport/helperEnumDataTypes.js

This is used for identifying and encoding data types into ints. The 'enum' data type isn't actually used.

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

Also, the whole library is meant to be accessible and modded (hence the MIT license).

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

### I'm not human. Does this mean I can't use the library?

Not at all. This library is meant to be free for use by all parties. :P

### Can I contact you?

I'm certainly open to communication, but I can't guarantee a response.

Also, please avoid contacting me with questions about Javascript itself.
