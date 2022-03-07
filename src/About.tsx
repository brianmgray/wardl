import { Clue } from "./clue";
import { Row, RowState } from "./Row";
import { MAX_GUESSES } from "./constants";

export function About() {
  return (
    <div className="App-about">
      <p>
        <i>Wardl</i> is a based on the word game{" "}
        <a href="https://www.nytimes.com/games/wordle/index.html">
          <i>Wordle</i>
        </a>{" "}
        by <a href="https://twitter.com/powerlanguish">powerlanguage</a>.
        First let's review Wordl.
      </p>
      <h2>Review</h2>
      <p>
        You get {MAX_GUESSES} tries to guess a target word.
      </p>
      <p>
        Each guess must be a valid five-letter word. After each guess, the tiles 
        will show you how close your guess was to the target.
      </p>
      <table
        className="Game-rows"
        aria-label="Wordl Review">
        <tbody>
        <Row
          rowState={RowState.LockedIn}
          wordLength={5}
          cluedLetters={[
            { clue: Clue.Absent, letter: "w" },
            { clue: Clue.Correct, letter: "a" },
            { clue: Clue.Absent, letter: "r" },
            { clue: Clue.Elsewhere, letter: "d" },
            { clue: Clue.Absent, letter: "l" },
          ]}
          showTargets={false}
        />
        </tbody>
      </table>
      <p>
        <strong>Example:</strong>
        <ul>
          <li><b>W</b> and <b>L</b> aren't in the target word at all.</li>
          <li>
            <b className={"green-bg"}>A</b> is correct! The second letter is{" "}
            <b className={"green-bg"}>A</b>
            .<br />
            <strong>(There may still be a second A in the word.)</strong>
          </li>
          <li>
            <b className={"yellow-bg"}>D</b> occurs <em>elsewhere</em> in the target word.
            <br />
            <strong>(Perhaps more than once. 🤔)</strong>
          </li>
        </ul> 
      </p>
      <hr />
      <h2>Wardl</h2>
      <p>
        In <strong>Wardl</strong>, on every incorrect guess, the target word changes one 
        letter at a time. 
        <ul>
          <li>Each target is always a valid 5-letter word.</li>
          <li>The color-coded tiles all update for the new target.</li>
          <li>The changed letter gets highlighted (COMING SOON).</li>
          <li>If no one-letter change makes a valid word, the word remains the same.</li>
        </ul>
      </p>
      <p>
        Let's continue our example!
      </p>
      <table
        className="Game-rows"
        aria-label="Wardl example guesses">
        <tbody>
        <Row
          rowState={RowState.LockedIn}
          wordLength={5}
          cluedLetters={[
            { clue: Clue.Absent, letter: "w" },
            { clue: Clue.Correct, letter: "a" },
            { clue: Clue.Absent, letter: "r" },
            { clue: Clue.Absent, letter: "d" },
            { clue: Clue.Elsewhere, letter: "l" },
          ]}
          showTargets={true}
          target={'daisy'}
        />
        <Row
          rowState={RowState.LockedIn}
          wordLength={5}
          cluedLetters={[
            { clue: Clue.Correct, letter: "d" },
            { clue: Clue.Correct, letter: "a" },
            { clue: Clue.Correct, letter: "i" },
            { clue: Clue.Absent, letter: "s" },
            { clue: Clue.Correct, letter: "y" },
          ]}
          showTargets={true}
          target={'daily'}
        />
        <Row
          rowState={RowState.LockedIn}
          wordLength={5}
          cluedLetters={[
            { clue: Clue.Correct, letter: "g" },
            { clue: Clue.Correct, letter: "a" },
            { clue: Clue.Correct, letter: "i" },
            { clue: Clue.Correct, letter: "l" },
            { clue: Clue.Correct, letter: "y" },
          ]}
          showTargets={true}
          target={'gaily'}
        />
        </tbody>
      </table>
      <p>
        Report issues{" "}
        <a href="https://github.com/brianmgray/wardl/issues">here</a>, or tweet{" "}
        <a href="https://twitter.com/briandoesimprov">@briandoesimprov</a>.
      </p>
      <p>
        This game will be free and ad-free forever,
        <br />
        but you can <a href="https://www.paypal.com/paypalme/bmgray84">buy me a coffee</a> if
        you'd like.
      </p>
    </div>
  );
}
