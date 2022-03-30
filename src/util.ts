import dictionary from "./data/dictionary.json";
import { Constants } from "./constants"

export enum Difficulty {
  Normal,
  Hard,
  UltraHard,
}

export const dictionarySet: Set<string> = new Set(dictionary);

// https://a11y-guidelines.orange.com/en/web/components-examples/make-a-screen-reader-talk/
export function speak(
  text: string,
  priority: "polite" | "assertive" = "assertive"
) {
  var el = document.createElement("div");
  var id = "speak-" + Date.now();
  el.setAttribute("id", id);
  el.setAttribute("aria-live", priority || "polite");
  el.classList.add("sr-only");
  document.body.appendChild(el);

  window.setTimeout(function () {
    document.getElementById(id)!.innerHTML = text;
  }, 100);

  window.setTimeout(function () {
    document.body.removeChild(document.getElementById(id)!);
  }, 1000);
}

export function ordinal(n: number): string {
  return n + ([, "st", "nd", "rd"][(n % 100 >> 3) ^ 1 && n % 10] || "th");
}

export const englishNumbers =
  "zero one two three four five six seven eight nine ten eleven".split(" ");

export function describeSeed(origSeed: string): string {
  const seed : number = Number(origSeed);
  const year = Math.floor(seed / 10000);
  const month = Math.floor(seed / 100) % 100;
  const day = seed % 100;
  const isLeap = year % (year % 25 ? 4 : 16) === 0;
  const feb = isLeap ? 29 : 28;
  const days = [0, 31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (
    year >= 2000 &&
    year <= 2100 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= days[month]
  ) {
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } else {
    return "seed " + seed;
  }
}

/**
 * Find the index of the letter that changed between the first and second targets
 * @param target1 
 * @param target2 
 * @returns the index of the changed letter or -1 if they are identical
 */
export function findChangedLetterIndex(target1:any, target2:string):number {
  if (target1.length === 0 || target2.length === 0)
    return -1;
  let letters1 = target1.split("");
  let letters2 = target2.split("");
  // reduce the array to the index of the changed letter
  // NOTE: cannot use a simple array diff here because of double letters. We need
  // to find the change at the specific index it happens
  let diffIdx = letters2.findIndex((letter, index) => {
    return letter !== letters1[index];
  });
  return diffIdx;
}

export function conditionalDebug(log:string): void {
  if (Constants.ENABLE_DEBUG_TARGETS) {
    console.log(log);
  }
}