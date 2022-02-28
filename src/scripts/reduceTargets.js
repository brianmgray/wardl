#!/usr/bin/env node

const targets = require("./../lists/targets.json")

class Runner {
  
  /**
   * Run the script
   */
  go() {
    console.log("Running reduceTargets");
    console.log(`Found ${Object.keys(targets).length} potential targets`)

  }

}

// run the script
let runner = new Runner();
runner.go()