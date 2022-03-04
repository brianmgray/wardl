
import { PassjoinIndex } from "mnemonist";
import levenshteinLte1 from "levenshtein-lte1"
import { pick } from "./util";

/**
 * An Index that provides efficient access to targets.
 * Builds a PassJoinIndex that uses Damerau-Levenshtein distance to calculate node distance
 * @see https://yomguithereal.github.io/mnemonist/passjoin-index
 * @see https://www.npmjs.com/package/levenshtein-lte1
 * @see https://stackoverflow.com/questions/2205540/algorithm-to-transform-one-word-to-another-through-valid-words
 */
class TargetIndex {
  #index: PassjoinIndex<string>;

  /**
   * Build the index from targets
   * @param targets potential targets
   */
  constructor(targets: string[]) {
    this.#index = new PassjoinIndex<string>(levenshteinLte1, 1);
  }

  /**
   * Advance the current target
   * @param current the current target
   * @param targetHistory the history of targets
   * @returns a new target that is one letter different from the current target
   */
  advanceTarget(current: string, targetHistory: string[]): string {
    let possible: Set<string> = this.#index.search(current);
    console.log(`TargetIndex.advance | possible | ${possible}`)
    let next = pick(Array.from(possible));
    console.log(`TargetIndex.advance | [${current}] -> [${next}]`)
    return next;
  }
}

export default TargetIndex;