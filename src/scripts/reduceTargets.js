#!/usr/bin/env node

const fs = require('fs')
const mnemonist = require('mnemonist');
const levenshteinLte1 = require('levenshtein-lte1')

const targets = require("./../data/targets.original.json")

// script constants
const DIR_OUTPUT = './../data'
const FILE_OUTPUT = DIR_OUTPUT + "/targets.json";
// const MAX_RARITY_DEPTH = 14501; //=> 1436 potential targets
const MAX_RARITY_DEPTH = 16500; //=> 1144
const WORD_LENGTH = 5;

/**
 * Script runner
 */
class Runner {
  go() {
    console.log("Running reduceTargets");
    console.log(`Found ${Object.keys(targets).length} potential targets`);

    let updated = targets
      .slice(0, MAX_RARITY_DEPTH)
      .filter(word => word.length === WORD_LENGTH && word !== "*****")

    console.log(`Updated list has ${updated.length} words`);

    // now that we've reduced the targets, keep only words with more than 1 permutation
    let index = new mnemonist.PassjoinIndex.from(updated, levenshteinLte1, 1);
    let final = updated.filter(word => index.search(word).size > 1 )  
    console.log(`Output ${final.length} potential targets`);
    this.writeOutput(final);
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