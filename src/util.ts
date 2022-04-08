import dictionary from "./data/dictionary.json";
import { Constants } from "./constants"
import { DateTime } from "luxon";

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

export function buildSeed(seedDate:DateTime): string {
  return seedDate.toISODate();
}

export function formatSeed(seedDate:DateTime): string {
  return seedDate.setLocale('en-US').toLocaleString(DateTime.DATE_FULL);
}

/**
 * Which number wardl is this
 */
export function wardlNumber(launchDate:DateTime, seedDate:DateTime): number {
  let duration = seedDate.diff(launchDate, "days");
  return Math.floor(duration.days);
}

/**
 * Which number wardl is this
 */
export function nextWardl(seedDate:DateTime): string {
  let next = DateTime.now().setZone('Etc/GMT').plus({days:1}).set({hour:0, minute:0, second:0, millisecond: 0});
  let duration = next.diff(seedDate, ["hours", "minutes", "seconds"]);
  return duration.toFormat("hh:mm:ss", {floor: true});
  // return `${duration.hours}:${duration.minutes}:${Math.floor(duration.seconds)}`;
}

