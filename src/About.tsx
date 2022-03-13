import { Clue } from "./clue";
import { Row, RowState } from "./Row";
import { Constants } from "./constants";

export function About() {
  return (
    <div className="App-about">
      <p>
        <i>Wardl</i> is a based on the word game{" "}
        <a href="https://www.nytimes.com/games/wordle/index.html">
          <i>Wordle</i>
        </a>{" "}
        by <a href="https://twitter.com/powerlanguish">powerlanguage</a>.
      </p>
      <h2>Wordle Review</h2>
      <p>
        You get {Constants.MAX_GUESSES} tries to guess a target word.
      </p>
      <p>
        Each guess must be a valid five-letter word. After each guess, the tiles 
        will show you how close your guess was to the target.
      </p>
      <p>
        <strong>Example:</strong>
      </p>
      <table
        className="Game-rows"
        aria-label="Wordl Review">
        <tbody>
        <Row
          rowState={RowState.LockedIn}
          wordLength={5}
          cluedLetters={[
            { clue: Clue.Correct, letter: "s" },
            { clue: Clue.Absent, letter: "p" },
            { clue: Clue.Elsewhere, letter: "e" },
            { clue: Clue.Absent, letter: "c" },
            { clue: Clue.Absent, letter: "k" },
          ]}
          showTargets={true}
          target=""
        />
        </tbody>
      </table>
      <p>
        <ul>
          <li><b>P</b>, <b>C</b> and <b>K</b> aren't in the target word at all.</li>
          <li>
            <b className={"green-bg"}>S</b> is correct! The first letter is{" "}
            <b className={"green-bg"}>S</b>
            .<br />
            (There could also be a second S in the word.)
          </li>
          <li>
            <b className={"yellow-bg"}>E</b> occurs <em>elsewhere</em> in the target word.<br />
            (Perhaps more than once 🤔)
          </li>
        </ul> 
      </p>
      <hr />
      <h2>Wardl</h2>
      <p>
        In <strong>Wardl</strong>, the target word changes by one letter on every incorrect guess. Each
        change always results in a valid 5 letter word. Let's look at an example game.
      </p>
      <table
        className="Game-rows"
        aria-label="Wardl example guesses">
        <tbody>
        <Row
          rowState={RowState.LockedIn}
          wordLength={5}
          cluedLetters={[
            { clue: Clue.Absent, letter: "s" },
            { clue: Clue.Absent, letter: "p" },
            { clue: Clue.Elsewhere, letter: "e" },
            { clue: Clue.Absent, letter: "c" },
            { clue: Clue.Absent, letter: "k" },
          ]}
          showTargets={true}
          target={'shall'}
        />
        <Row
          rowState={RowState.LockedIn}
          wordLength={5}
          cluedLetters={[
            { clue: Clue.Absent, letter: "s" },
            { clue: Clue.Correct, letter: "h" },
            { clue: Clue.Absent, letter: "e" },
            { clue: Clue.Correct, letter: "l" },
            { clue: Clue.Absent, letter: "l" },
          ]}
          showTargets={true}
          target={'shale'}
        />
        <Row
          rowState={RowState.LockedIn}
          wordLength={5}
          cluedLetters={[
            { clue: Clue.Correct, letter: "w" },
            { clue: Clue.Correct, letter: "h" },
            { clue: Clue.Correct, letter: "a" },
            { clue: Clue.Correct, letter: "l" },
            { clue: Clue.Correct, letter: "e" },
          ]}
          showTargets={true}
          target={'whale'}
        />
        </tbody>
      </table>
      <p>
        NOTE: You don't see the targets until the game ends. 
      </p>
      <p>
        The clues always relate to the current target. For example, when the target changed from 
        "shale" to "whale", the <b className={"green-bg"}>S</b> became an <b>S</b> because "S" was 
        no longer in the correct place. 
      </p>
      <hr />
      <p>
        Report issues{" "}
        <a href="https://github.com/brianmgray/wardl/issues">here</a>, or tweet{" "}
        <a href="https://twitter.com/briandoesimprov">@briandoesimprov</a>.
      </p>
      <p>
        This game will be free and ad-free forever, 
        but you can <a href="https://www.paypal.com/paypalme/bmgray84">buy&nbsp;me&nbsp;a&nbsp;coffee</a> if
        you'd like.
      </p>
    </div>
  );
}
