import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import dictionary from "./data/dictionary.json";
import { Constants } from './constants'
import TargetIndex from './targetIndex'
import targets from "./data/targets.json";

import { Row, RowState } from "./Row";
import { Clue, clue, describeClue, violation, clueToEmoji } from "./clue";
import { Keyboard } from "./Keyboard";
import { GameInfo } from "./GameInfo";
import {
  Difficulty, 
  buildSeed,
  speak,
  wardlNumber,
  conditionalDebug
} from "./util";

const seed = buildSeed(Constants.SEED_DATE);
const targetIndex = new TargetIndex(targets, seed);
conditionalDebug(`seed: ${seed}`)

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
  const [hint, setHint] = useState<string>(``);
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
    setHint("");
    setGuesses([]);
    setCurrentGuess("");
    setGameState(GameState.Playing);
    setGameNumber((gNumber) => gNumber + 1);
  };

  async function share(copiedHint: string, text?: string) {
    const message = `${Constants.WARDLE_URL} ${wardlNumber(Constants.LAUNCH_DATE, Constants.SEED_DATE)} ` + 
      `${guesses.length}/${Constants.MAX_GUESSES}`
    const body = message + (text ? "\n" + text : "");
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
    setHint(message);
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

      const gameOver = (verbed: string, target: string,  oldGuess: boolean = false) =>
        `You ${verbed}! The final answer was ${target.toUpperCase()}` +
        `${oldGuess ? ' which you guessed previously' : ''}.`

      if (currentGuess === target) {
        setHint(gameOver("won", target));
        setGameState(GameState.Won);
      } else if (guesses.length + 1 === props.maxGuesses) {
        setHint(gameOver("lost", target));
        setGameState(GameState.Lost);
      } else {
        // advance the target
        let newTarget = targetIndex.advanceTarget(target, targetHistory);
        conditionalDebug(`\t changing target 3: ${newTarget}`);
        setTarget(newTarget);
        setTargetHistory([...targetHistory, newTarget])
        speak(describeClue(clue(currentGuess, newTarget)));
        // Implementation to consider a correct historical guess a win
        // if (guesses.includes(newTarget)) {
        //   // new target has been guessed, so consider this a win
        //   setHint(() => gameOver("won", newTarget, true));
        //   setGameState(GameState.Won);
        // } else {
        setHint("");
        // }
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
      <GameInfo 
        launchDate={Constants.LAUNCH_DATE}
        seedDate={Constants.SEED_DATE}
        gameNumber={gameNumber} />
      <div className="Game-share">
        {gameState !== GameState.Playing && (
          <button
          onClick={() => {
              share("Result copied to clipboard!",
                guesses
                  .map((guess, i) => clue(guess, target, targetHistory[i], i > 1 ? targetHistory[i-1] : "")
                  .map(c => clueToEmoji(c, props.colorBlind))
                  .join("")
                )
                .join("\n"));
              }}
              >
            Share <FontAwesomeIcon icon="share" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Game;
