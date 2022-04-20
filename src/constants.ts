import { DateTime } from "luxon";

console.log("RUNNING CODE, CREATING NEW SEED DATE")

/**
 * Application constants
 */
export const Constants = {
  ENABLE_DEBUG_TARGETS: window.location.hostname === "localhost",
  SEED_DATE: DateTime.now().setZone('Etc/GMT'), // midnight GMT rolls over a new clue
  MAX_GUESSES: 6,
  WORD_LENGTH: 5,
  WARDLE_URL: "wardl.co",
  LAUNCH_DATE: DateTime.fromObject({year: 2022, month: 3, day: 8 }, { zone: 'Etc/GMT' }),
  WHATS_NEW_LATEST_DATE: DateTime.fromObject({year: 2022, month: 3, day: 10 }, { zone: 'Etc/GMT' }),
  CONTENT_WHATS_NEW: "whats-new.md"
}
