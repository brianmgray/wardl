#!/usr/bin/env node

// import * as fs from "fs"
const fs = require('fs')
const targets = require("./../lists/targets.json")

const DIR_OUTPUT = './../../target/scripts'
const FILE_OUTPUT = DIR_OUTPUT + "/targets.json";

class Runner {
  
  /**
   * Run the script
   */
  go() {
    console.log("Running reduceTargets");
    console.log(`Found ${Object.keys(targets).length} potential targets`)

    this.writeOutput(targets);
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
let runner = new Runner();
runner.go()