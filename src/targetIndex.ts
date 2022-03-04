
import Prando from 'prando';
import {pick} from './util';

const PassjoinIndex = require('mnemonist/passjoin-index');
var levenshteinLte1 = require('levenshtein-lte1');

/**
 * An Index that provides efficient access to targets.
 * Builds a PassJoinIndex that uses Damerau-Levenshtein distance to calculate node distance
 * @see https://yomguithereal.github.io/mnemonist/passjoin-index
 * @see https://www.npmjs.com/package/levenshtein-lte1
 * @see https://stackoverflow.com/questions/2205540/algorithm-to-transform-one-word-to-another-through-valid-words
 */
class TargetIndex {
  #index: any;
  #rng : Prando;

  /**
   * Build the index from targets
   * @param targets potential targets
   * @param seed random seed
   */
  constructor(targets: string[], seed:number) {
    this.#rng = new Prando(seed); // if seed is undefined, this will be unseeded (random games)
    this.#index = PassjoinIndex.from(targets, levenshteinLte1, 1);
  }

  /**
   * Pick a random but viable starting target. We pull here from the index because we know these all have another
   * word with a levenshtein value of 1
   */
  pickStartingTarget():string {
    let values = Array.from(this.#index.values());
    let random = values[Math.floor(values.length * this.#rng.next())];
    console.log(`TargetIndex.pickStartingTarget | ${random} | of ${values.length} values`);
    return "" + random;
  }

  /**
   * Advance the current target
   * @param current the current target
   * @param targetHistory the history of targets
   * @returns a new target that is one letter different from the current target
   */
  advanceTarget(current: string, targetHistory: string[]): string {
    let possible: string[] = Array.from(this.#index.search(current));
    possible = possible.filter((t) => t === current);
    console.log(`TargetIndex.advance | possible | ${possible}`)
    let next = pick(Array.from(possible));
    console.log(`TargetIndex.advance | [${current}] -> [${next}]`)
    return next;
  }

  skipAheadRng(iterations:number):void {
    this.#rng.skip(iterations);
  }
  
}

export default TargetIndex;