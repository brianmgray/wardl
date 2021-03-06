import { englishNumbers, findChangedLetterIndex, ordinal } from "./util";
import { Difficulty } from './util'



export enum Clue {
  Absent,
  Elsewhere,
  Correct,
}

export interface CluedLetter {
  letter: string;
  clue?: Clue;            // compared to current target
  guessClue?: Clue;       // compared to target at the time of the guess
  changed?: boolean;      // true if the letter changed for this round
}

interface EmojiMap {
  [key: string]: string[]; // indexable
}

/**
 * Object to look up emojis
 *  - First key is true=colorblind, false=not
 *  - Second key is "clue" vs "guess"
 *  - Then an array of emojis mapping to Clue enum
 */
const EMOJIS_COLORBLIND: EmojiMap = {
  "clue":  ["⬛", "🟦", "🟧"],
  "guess": ["⬛", "🔵", "🟠"]
};
const EMOJIS: EmojiMap = {
  "clue":  ["⬛", "🟨", "🟩"],
  "guess": ["⬛", "🟡", "🟢"]
};

/**
 * Populate CluedLetters for a given guess
 * @param word the guess
 * @param target the target
 * @param guessTarget the target for this guess
 * @param prevTarget the previous target (or empty string)
 * @returns array of CluedLetters
 */
export function clue(word: string, target: string, guessTarget:string = "", prevTarget:string = ""): CluedLetter[] {
  let changedIdx: number = findChangedLetterIndex(prevTarget, guessTarget);
  let guessClue:CluedLetter[] = []
  if (guessTarget.length > 0) {
    guessClue = clue(word, guessTarget);
  } 
  let elusive: string[] = [];
  target.split("").forEach((letter, i) => {
    if (word[i] !== letter) {
      elusive.push(letter);
    }
  });
  return word.split("").map((letter, i) => {
    let j: number;
    let changed: boolean = changedIdx === i;
    let answer = { letter, clue: Clue.Absent, changed: changed, 
      guessClue: guessClue.length > i ? guessClue[i].clue : Clue.Absent
    };
    if (target[i] === letter) {
      answer.clue = Clue.Correct;
    } else if ((j = elusive.indexOf(letter)) > -1) {
      // "use it up" so we don't clue at it twice
      elusive[j] = "";
      answer.clue = Clue.Elsewhere;
    } else {
      answer.clue = Clue.Absent;
    }
    return answer;
  });
}

export function clueClass(clue: Clue, guess:boolean = false): string {
  let prefix:string = guess ? "guess" : "letter";
  if (clue === Clue.Absent) {
    return `${prefix}-absent`;
  } else if (clue === Clue.Elsewhere) {
    return `${prefix}-elsewhere`;
  } else if (clue === Clue.Correct) {
    return `${prefix}-correct`;
  }
  return "";
}

export function clueWord(clue: Clue): string {
  if (clue === Clue.Absent) {
    return "no";
  } else if (clue === Clue.Elsewhere) {
    return "elsewhere";
  } else {
    return "correct";
  }
}

export function describeClue(clue: CluedLetter[]): string {
  return clue
    .map(({ letter, clue }) => letter.toUpperCase() + " " + clueWord(clue!))
    .join(", ");
}

export function violation(
  difficulty: Difficulty,
  clues: CluedLetter[],
  guess: string
): string | undefined {
  if (difficulty === Difficulty.Normal) {
    return undefined;
  }
  const ultra = difficulty === Difficulty.UltraHard;
  let i = 0;
  for (const { letter, clue } of clues) {
    const clueCount = clues.filter(
      (c) => c.letter === letter && c.clue !== Clue.Absent
    ).length;
    const guessCount = guess.split(letter).length - 1;
    const glyph = letter.toUpperCase();
    const glyphs = glyph + (clueCount !== 1 ? "s" : "");
    const nth = ordinal(i + 1);

    // Hard: enforce greens stay in place.
    if (clue === Clue.Correct && guess[i] !== letter) {
      return nth + " letter must be " + glyph;
    }

    // Hard: enforce yellows are used.
    if (guessCount < clueCount) {
      const atLeastN =
        clueCount > 1 ? `at least ${englishNumbers[clueCount]} ` : "";
      return `Guess must contain ${atLeastN}${glyphs}`;
    }

    // Ultra Hard: disallow would-be greens.
    if (ultra && clue !== Clue.Correct && guess[i] === letter) {
      return nth + " letter can't be " + glyph;
    }

    // Ultra Hard: if the exact amount is known because of an Absent clue, enforce it.
    if (ultra && clue === Clue.Absent && guessCount !== clueCount) {
      return clueCount === 0
        ? `Guess can't contain ${glyph}`
        : `Guess must contain exactly ${englishNumbers[clueCount]} ${glyphs}`;
    }

    ++i;
  }
  return undefined;
}

/**
 * Get the appropriate emoji for a clued letter
 * @param cl 
 * @param colorBlind 
 */
export function clueToEmoji(cl: CluedLetter, colorBlind: boolean = false): string {
  const emojis = colorBlind ? EMOJIS_COLORBLIND : EMOJIS;
  let guessKey = "clue";
  let clue = cl.clue ?? Clue.Absent;
  if (cl.guessClue !== undefined && cl.clue === Clue.Absent) {
    // use the guess instead of the clue
    guessKey = "guess"
    clue = cl.guessClue;
  }
  return emojis[guessKey][clue];
}