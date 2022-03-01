#!/usr/bin/env node

const fs = require('fs')
const targets = require("./../lists/targets.original.json")

// script constants
const DIR_OUTPUT = './../lists'
const FILE_OUTPUT = DIR_OUTPUT + "/targets.json";
const MAX_RARITY_WORD = "murky";
const WORD_LENGTH = 5;

/**
 * Script runner
 */
class Runner {

  go() {
    console.log("Running reduceTargets");
    console.log(`Found ${Object.keys(targets).length} potential targets`);

    let updated = targets
      .slice(0, targets.indexOf(MAX_RARITY_WORD) + 1)
      .filter((word) => word.length === WORD_LENGTH && word !== "*****")

    this.writeOutput(updated);
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