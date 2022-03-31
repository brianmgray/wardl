import { useEffect, useRef, useState } from "react";
import { Row, RowState } from "./Row";
import dictionary from "./data/dictionary.json";
import { Clue, CluedLetter, clue, describeClue, violation } from "./clue";
import { Keyboard } from "./Keyboard";
import {
  Difficulty, 
  describeSeed,
  speak,
  findChangedLetterIndex,
  conditionalDebug
} from "./util";
import { Constants } from './constants'
import TargetIndex from './targetIndex'
import targets from "./data/targets.json";


const todaySeed:string = new Date().toISOString().replace(/-/g, "").slice(0, 8);
const targetIndex = new TargetIndex(targets, todaySeed);

enum GameState {
  Playing,
  Won,
  Lost,
}

interface GameProps {
  maxGuesses: number;
  hidden: boolean;
  difficulty: Difficulty;
  colorBlind: boolean;
  keyboardLayout: string;
}

function Game(props: GameProps) {
  const [gameState, setGameState] = useState(GameState.Playing);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [challenge, setChallenge] = useState<string>("");
  const [wordLength, setWordLength] = useState<number>(Constants.WORD_LENGTH)
  const [gameNumber, setGameNumber] = useState(1);
  const [devmode, setDevmode] = useState<boolean>(false);
  const [targetHistory, setTargetHistory] = useState<string[]>([]);
  const [target, setTarget] = useState(() => {
    targetIndex.skipAheadRng(gameNumber);
    const newTarget = challenge || targetIndex.pickStartingTarget();
    setTargetHistory([newTarget]);    // update history when this async setTarget() call executes
    conditionalDebug(`\t changing target 1: ${newTarget}`);
    return newTarget;
  });
  const [hint, setHint] = useState<string>(`Make your first guess!`);
  const tableRef = useRef<HTMLTableElement>(null);
  const startNextGame = () => {
    if (challenge) {
      // Clear the URL parameters:
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    targetIndex.reset(gameNumber + 1);
    const newWordLength = Constants.WORD_LENGTH;
    const newTarget = targetIndex.pickStartingTarget();
    setChallenge("");
    setWordLength(newWordLength);
    conditionalDebug(`\t changing target 2: ${newTarget}`);
    setTarget(newTarget);
    setTargetHistory([newTarget]);
    conditionalDebug(`setTargetHistory2: [${newTarget}]`);
    setHint("");
    setGuesses([]);
    setCurrentGuess("");
    setGameState(GameState.Playing);
    setGameNumber((gNumber) => gNumber + 1);
  };

  async function share(copiedHint: string, text?: string) {
    const url = Constants.WARDLE_URL;
    const body = url + (text ? "\n\n" + text : "");
    if (
      /android|iphone|ipad|ipod|webos/i.test(navigator.userAgent) &&
      !/firefox/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share({ text: body });
        return;
      } catch (e) {
        console.warn("navigator.share failed:", e);
      }
    }
    try {
      await navigator.clipboard.writeText(body);
      setHint(copiedHint);
      return;
    } catch (e) {
      console.warn("navigator.clipboard.writeText failed:", e);
    }
    setHint(url);
  }

  const onKey = (key: string) => {
    if (gameState !== GameState.Playing) {
      if (key === "Enter") {
        startNextGame();
      }
      return;
    }
    if (guesses.length === props.maxGuesses) return;
    if (/^[a-z]$/i.test(key)) {
      setCurrentGuess((guess) =>
        (guess + key.toLowerCase()).slice(0, wordLength)
      );
      tableRef.current?.focus();
      setHint("");
    } else if (key === "Backspace") {
      setCurrentGuess((guess) => guess.slice(0, -1));
      setHint("");
    } else if (key === "Enter") {
      if (currentGuess.length !== wordLength) {
        setHint("Too short");
        return;
      }
      if (!dictionary.includes(currentGuess)) {
        setHint("Not a valid word");
        return;
      }
      guesses.forEach((g, i) => {
        const c = clue(g, target); 
        const feedback = violation(props.difficulty, c, currentGuess);
        if (feedback) {
          setHint(feedback);
          return;
        }
      });
      setGuesses((guesses) => guesses.concat([currentGuess]));
      setCurrentGuess((guess) => "");

      const gameOver = (verbed: string) =>
        `You ${verbed}! The final answer was ${target.toUpperCase()}.`

      if (currentGuess === target) {
        setHint(gameOver("won"));
        setGameState(GameState.Won);
      } else if (guesses.length + 1 === props.maxGuesses) {
        setHint(gameOver("lost"));
        setGameState(GameState.Lost);
      } else {
        // advance the target
        let newTarget = targetIndex.advanceTarget(target, targetHistory);
        conditionalDebug(`\t changing target 3: ${newTarget}`);
        setTarget(newTarget);
        setTargetHistory([...targetHistory, newTarget])
        setHint("");
        speak(describeClue(clue(currentGuess, target)));
      }
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        onKey(e.key);
      }
      if (e.key === "Backspace") {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        setDevmode(prevDevmode => !prevDevmode); // to depend on previous value, must use a fxn
        
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentGuess, gameState]);

  let letterInfo = new Map<string, Clue>();
  const tableRows = Array(props.maxGuesses)
    .fill(undefined)
    .map((_, i) => {
      const guess = [...guesses, currentGuess][i] ?? "";
      const prevTarget = i > 1 ? targetHistory[i-1] : "";
      const guessTarget:string = targetHistory[i];
      const cluedLetters = clue(guess, target, guessTarget, prevTarget);
      const lockedIn = i < guesses.length;
      if (lockedIn) {
        for (const { clue, letter } of cluedLetters) {
          if (clue === undefined) break;
          const old = letterInfo.get(letter);
          if (old === undefined || clue > old) {
            letterInfo.set(letter, clue);
          }
        }
      }
      return (
        <Row
          key={i}
          wordLength={wordLength}
          rowState={
            lockedIn
              ? RowState.LockedIn
                : i === guesses.length
                  ? RowState.Editing
                  : RowState.Pending
          }
          cluedLetters={cluedLetters}
          target={targetHistory[i]}
          showTargets={devmode || gameState !== GameState.Playing}
        />
      );
    });

  return (
    <div className="Game" style={{ display: props.hidden ? "none" : "block" }}>
      <div className="Game-options">
        <button
          style={{ flex: "0 0 auto" }}
          disabled={gameState !== GameState.Playing || guesses.length === 0}
          onClick={() => {
            setHint(
              `Displaying targets above. (Enter to play again)`
            );
            setGameState(GameState.Lost);
            (document.activeElement as HTMLElement)?.blur();
          }}
        >
          Give up
        </button>
      </div>
      <table
        className="Game-rows"
        tabIndex={0}
        aria-label="Table of guesses"
        ref={tableRef}
      >
        <tbody>{tableRows}</tbody>
      </table>
      <p
        role="alert"
        style={{
          userSelect: /https?:/.test(hint) ? "text" : "none",
          whiteSpace: "pre-wrap",
        }}
      >
        {hint || `\u00a0`}
      </p>
      <Keyboard
        layout={props.keyboardLayout}
        letterInfo={letterInfo}
        onKey={onKey}
      />
      <div className="Game-seed-info">
        {`${describeSeed(todaySeed)} ${gameNumber > 1 ? " - Game " + gameNumber : ""}`}
      </div>
      <div className="Game-share">
        {gameState !== GameState.Playing && (
          <button
          onClick={() => {
            const emoji = props.colorBlind
                ? ["⬛", "🟦", "🟧"]
                : ["⬛", "🟨", "🟩"];
                //TODO BG
              share("Result copied to clipboard!",
                guesses
                  .map((guess, i) => clue(guess, target, i > 1 ? targetHistory[i-1] : "", targetHistory[i])
                  .map((c) => emoji[c.clue ?? 0])
                  .join("")
                )
                .join("\n"));
              }}
              >
            Share 
            <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px"><path d="M 23 3 A 4 4 0 0 0 19 7 A 4 4 0 0 0 19.09375 7.8359375 L 10.011719 12.376953 A 4 4 0 0 0 7 11 A 4 4 0 0 0 3 15 A 4 4 0 0 0 7 19 A 4 4 0 0 0 10.013672 17.625 L 19.089844 22.164062 A 4 4 0 0 0 19 23 A 4 4 0 0 0 23 27 A 4 4 0 0 0 27 23 A 4 4 0 0 0 23 19 A 4 4 0 0 0 19.986328 20.375 L 10.910156 15.835938 A 4 4 0 0 0 11 15 A 4 4 0 0 0 10.90625 14.166016 L 19.988281 9.625 A 4 4 0 0 0 23 11 A 4 4 0 0 0 27 7 A 4 4 0 0 0 23 3 z"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default Game;
