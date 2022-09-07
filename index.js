"use strict";

import prettyPrinterForHumans from "./src/prettyPrinterForHumans.js";
export default prettyPrinterForHumans;

const main = async () => {
  console.log("\n\n\n\n\n");

  const keySymbol = Symbol("A").valueOf();

  const input = {
    [keySymbol]: "1",
    B: "2",
    C: "3",
  };

  console.log(`SYMBOLS = ${JSON.stringify(Reflect.ownKeys(input))}`);

  const result = prettyPrinterForHumans.pformat(input, {
    argStringNameToOutput: "result",
    argStringTrailingSpace: "\n",
    //argEnumSortOption: prettyPrinterForHumans.fieldHelperOptions.fieldEnumSortOptions.fieldOptionPrintComplexLast,
  });

  console.log(result);
};

main().then(() => console.log("\nSCRIPT COMPLETE\n"));
