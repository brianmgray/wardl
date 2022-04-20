import { useEffect, useState } from "react";
import { library, IconProp } from '@fortawesome/fontawesome-svg-core'
import { faGear, faCircleExclamation, faShare, faBook } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark, faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import "./App.css";
import { Constants } from "./constants";
import Game from "./Game";
import { About } from "./About";
import { WhatsNew } from "./WhatsNew"
import { DateTime } from "luxon";
import { conditionalDebug } from "./util";

// setup font-awesome library - these will now be available by string
// see: https://fontawesome.com/v6/docs/web/use-with/react/add-icons#add-icons-globally
library.add(faQuestionCircle, faCircleXmark, faGear, faBook, faCircleExclamation, faShare)

function useSetting<T>(
  key: string,
  initial: T
): [T, (value: T | ((t: T) => T)) => void] {
  const [current, setCurrent] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch (e) {
      return initial;
    }
  });
  const setSetting = (value: T | ((t: T) => T)) => {
    try {
      const v = value instanceof Function ? value(current) : value;
      setCurrent(v);
      window.localStorage.setItem(key, JSON.stringify(v));
    } catch (e) {}
  };
  return [current, setSetting];
}

function App() {
  type Page = "game" | "about" | "settings" | "new";
  const [page, setPage] = useState<Page>("game");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [dark, setDark] = useSetting<boolean>("dark", prefersDark);
  const [colorBlind, setColorBlind] = useSetting<boolean>("colorblind", false);
  const [difficulty, setDifficulty] = useSetting<number>("difficulty", 0);
  const [keyboard, setKeyboard] = useSetting<string>(
    "keyboard",
    "qwertyuiop-asdfghjkl-EzxcvbnmB"
  );
  const [enterRight, setEnterRight] = useSetting<boolean>("enter-right", false);
  const [lastWhatsNewCheck, setLastWhatsNewCheck] = useSetting<DateTime>("whats-new-check", 
    DateTime.fromObject({year: 0, month: 1, day: 1}, { zone: 'Etc/GMT' }));

  useEffect(() => {
    document.body.className = dark ? "dark" : "";
    setTimeout(() => {
      // Avoid transition on page load
      document.body.style.transition = "0.3s background-color ease-out";
    }, 1);
  }, [dark]);
  const link = (iconProp: IconProp, label: string, page: Page) => (
    <button
      className="icon-link"
      onClick={() => setPage(page)}
      title={label}
      aria-label={label}
    >
      <FontAwesomeIcon icon={iconProp} />
    </button>
  );

  return (
    <div className={"App-container" + (colorBlind ? " color-blind" : "")}>
      <div className={"top-left new" + (Constants.WHATS_NEW_LATEST_DATE > lastWhatsNewCheck ? " updated" : "")}>
        {link("book", "What's New", "new")}
      </div>
      <h1>
        <span
          style={{
            color: difficulty > 0 ? "#e66" : "inherit",
            fontStyle: difficulty > 1 ? "italic" : "inherit",
          }}
        >
          Wardl
        </span>
      </h1>
      <div className="top-right">
        {page !== "game" ? (
          link(["far", "circle-xmark"], "Close", "game")
        ) : (
          <>
            {link(["far", "question-circle"], "About", "about")}
            {link("gear", "Settings", "settings")}
          </>
        )}
      </div>
      {page === "about" && <About />}
      {page === "new" && 
        <WhatsNew contentLoadedCallback={setLastWhatsNewCheck} />
        }
      {page === "settings" && (
        <div className="Settings">
          <div className="Settings-setting">
            <input
              id="dark-setting"
              type="checkbox"
              checked={dark}
              onChange={() => setDark((x: boolean) => !x)}
            />
            <label htmlFor="dark-setting">Dark theme</label>
          </div>
          <div className="Settings-setting">
            <input
              id="colorblind-setting"
              type="checkbox"
              checked={colorBlind}
              onChange={() => setColorBlind((x: boolean) => !x)}
            />
            <label htmlFor="colorblind-setting">High-contrast colors</label>
          </div>
          <div className="Settings-setting">
            <input
              id="difficulty-setting"
              type="range"
              min="0"
              max="2"
              value={difficulty}
              onChange={(e) => setDifficulty(+e.target.value)}
            />
            <div>
              <label htmlFor="difficulty-setting">Difficulty:</label>
              <strong>{["Normal", "Hard", "Ultra Hard"][difficulty]}</strong>
              <div
                style={{
                  fontSize: 14,
                  height: 40,
                  marginLeft: 8,
                  marginTop: 8,
                }}
              >
                {
                  [
                    `Guesses must be valid dictionary words.`,
                    `Wordle's "Hard Mode". Green letters must stay fixed, and yellow letters must be reused.`,
                    `An even stricter Hard Mode. Yellow letters must move away from where they were clued, and gray clues must be obeyed.`,
                  ][difficulty]
                }
              </div>
            </div>
          </div>
          <div className="Settings-setting">
            <label htmlFor="keyboard-setting">Keyboard layout:</label>
            <select
              name="keyboard-setting"
              id="keyboard-setting"
              value={keyboard}
              onChange={(e) => setKeyboard(e.target.value)}
            >
              <option value="qwertyuiop-asdfghjkl-BzxcvbnmE">QWERTY</option>
              <option value="azertyuiop-qsdfghjklm-BwxcvbnE">AZERTY</option>
              <option value="qwertzuiop-asdfghjkl-ByxcvbnmE">QWERTZ</option>
              <option value="BpyfgcrlE-aoeuidhtns-qjkxbmwvz">Dvorak</option>
              <option value="qwfpgjluy-arstdhneio-BzxcvbkmE">Colemak</option>
            </select>
            <input
              style={{ marginLeft: 20 }}
              id="enter-right-setting"
              type="checkbox"
              checked={enterRight}
              onChange={() => setEnterRight((x: boolean) => !x)}
            />
            <label htmlFor="enter-right-setting">"Enter" on right side</label>
          </div>
        </div>
      )}
      <Game
        maxGuesses={Constants.MAX_GUESSES}
        hidden={page !== "game"}
        difficulty={difficulty}
        colorBlind={colorBlind}
        keyboardLayout={keyboard.replaceAll(
          /[EB]/g,
          (x) => (enterRight ? "BE" : "EB")["EB".indexOf(x)]
        )}
      />
    </div>
  );
}

export default App;
