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
            { clue: Clue.Correct,   letter: "s" },
            { clue: Clue.Absent,    letter: "p" },
            { clue: Clue.Elsewhere, letter: "e" },
            { clue: Clue.Absent,    letter: "c" },
            { clue: Clue.Absent,    letter: "k" },
          ]}
          showTargets={true}
          target=""
        />
        </tbody>
      </table>
      <ul>
        <li><b className={"letter-absent"}>P</b>, <b className={"letter-absent"}>C</b> and&nbsp;
            <b className={"letter-absent"}>K</b> aren't in the target word at all.</li>
        <li>
          <b className={"letter-correct"}>S</b> is correct! The first letter is{" "}
          <b className={"letter-correct"}>S</b>
          .<br />
          (There could also be a second S in the word.)
        </li>
        <li>
          <b className={"letter-elsewhere"}>E</b> occurs <em>elsewhere</em> in the target word.<br />
          (Perhaps more than once 🤔)
        </li>
      </ul> 
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
            { clue: Clue.Absent,    letter: "s",  guessClue: Clue.Correct },
            { clue: Clue.Absent,    letter: "p" },
            { clue: Clue.Elsewhere, letter: "e" },
            { clue: Clue.Absent,    letter: "c" },
            { clue: Clue.Absent,    letter: "k" },
          ]}
          showTargets={true}
          target={'shall'}
        />
        <Row
          rowState={RowState.LockedIn}
          wordLength={5}
          cluedLetters={[
            { clue: Clue.Absent, letter: "s",  guessClue: Clue.Correct  },
            { clue: Clue.Correct, letter: "h" },
            { clue: Clue.Elsewhere, letter: "e" },
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
        <strong>More info:</strong>
      </p>
      <ul>
        <li>You'll only see the targets after the game ends.</li>
        <li>The clues always relate to the current target. In the example, 
          <b className={"letter-absent"}>S</b> is no longer clued because it does not 
          appear in the current target: <em>whale</em>.
        </li>
        <li>Borders around a letter indicate the guess was correct for the target at the time. In the example, 
          <b className={"letter-absent guess-correct"}>S</b> has a <b className={"guess-correct"}>&nbsp;</b> 
          highlight to remind you that the letter appeared in the correct place for the clue: <em>shale</em>.
        </li>
        <li>
          It is possible to have a previous guess become totally correct as the target changes. In this case,
          re-enter that guess for the win!
          <table
            className="Game-rows"
            aria-label="Wardl correct historical guess">
          <tbody>
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
            target={'shale'}
          />
          <Row
            rowState={RowState.Editing}
            wordLength={5}
            cluedLetters={[
            ]}
            showTargets={true}
            target={'whale'}
          />
          </tbody>
        </table>
        </li>
      </ul>
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
