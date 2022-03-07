#!/usr/bin/env node

const fs = require('fs')
const targets = require("../data/dictionary.original.json")

// script constants
const DIR_OUTPUT = './../data'
const FILE_OUTPUT = DIR_OUTPUT + "/dictionary.json";
const WORD_LENGTH = 5;

/**
 * Script runner
 */
class Runner {

  go() {
    console.log("Running reduceDictionary");
    console.log(`Found ${Object.keys(targets).length} size dictionary`);

    let updated = targets
      .filter((word) => word.length === WORD_LENGTH)

    this.writeOutput(updated);
    console.log(`Output ${Object.keys(updated).length} size dictionary`);
  }

  writeOutput(jsonContent) {
    if (!fs.existsSync(DIR_OUTPUT)){
        fs.mkdirSync(DIR_OUTPUT);
    }
    let content = JSON.stringify(jsonContent, null, 2);
    fs.writeFile(FILE_OUTPUT, content, err => {
      if (err) {
        console.error(err)
        return
      }
      console.log(`Output written to ${FILE_OUTPUT}`);
    })
  }

}

// run the script
new Runner().go();