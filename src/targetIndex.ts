import { PassjoinIndex } from 'mnemonist';
import levenshteinLte1 from 'levenshtein-lte1'
import Prando from 'prando';
import {conditionalDebug} from './util';

/**
 * An Index that provides efficient access to targets.
 * Builds a PassJoinIndex that uses Damerau-Levenshtein distance to calculate node distance
 * @see https://yomguithereal.github.io/mnemonist/passjoin-index
 * @see https://www.npmjs.com/package/levenshtein-lte1
 * @see https://stackoverflow.com/questions/2205540/algorithm-to-transform-one-word-to-another-through-valid-words
 */
class TargetIndex {
  #index: PassjoinIndex<string>;
  #rng : Prando;

  /**
   * Build the index from targets
   * @param targets potential targets
   * @param seed random seed
   */
  constructor(targets: string[], seed:string) {
    this.#rng = new Prando(seed); // if seed is undefined, this will be unseeded (random games)
    this.#index = PassjoinIndex.from(targets, levenshteinLte1, 1);
  }

  /**
   * Pick a random but viable starting target. We pull here from the index because we know these all have another
   * word with a levenshtein value of 1
   */
  pickStartingTarget():string {
    let values = Array.from(this.#index.values());
    let random = this.#rng.nextArrayItem(values);
    conditionalDebug(`TargetIndex.pickStartingTarget | ${random} | of ${values.length} values`);
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
    if (possible.length > targetHistory.length) {
      // if we have multiple to choose from, remove any we have already used
      possible = possible.filter(t => !targetHistory.includes(t));
    }
    conditionalDebug(`TargetIndex.advance | possible | ${possible}`)
    let next = this.#rng.nextArrayItem(possible);
    conditionalDebug(`TargetIndex.advance | next | [${current}] -> [${next}]`)
    return next;
  }

  skipAheadRng(iterations:number):void {
    this.#rng.skip(iterations);
  }
  
}

export default TargetIndex;