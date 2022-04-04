import {Clue, CluedLetter, clue, clueToEmoji} from "../clue";

describe('clue', () => {

    test('clues the letters properly', () => {
        let word = "speck"
        let target = "shale"
        let historical = "shall"
        let letters:CluedLetter[] = clue(word, target, target, historical);
        console.log(letters);
        expect(letters[0]).toEqual(expect.objectContaining({ letter: 's', clue: Clue.Correct }));
        expect(letters[1]).toEqual(expect.objectContaining({ letter: 'p', clue: Clue.Absent }));
        expect(letters[2]).toEqual(expect.objectContaining({ letter: 'e', clue: Clue.Elsewhere }));
        expect(letters[3]).toEqual(expect.objectContaining({ letter: 'c', clue: Clue.Absent }));
        expect(letters[4]).toEqual(expect.objectContaining({ letter: 'k', clue: Clue.Absent }));
    });

    test('clues the changed value properly', () => {
        let word = "speck"
        let target = "shale"
        let historical = "shall"
        let letters:CluedLetter[] = clue(word, target, target, historical);
        console.log(letters);
        expect(letters[0]).toEqual(expect.objectContaining({ letter: 's', changed: false }));
        expect(letters[1]).toEqual(expect.objectContaining({ letter: 'p', changed: false }));
        expect(letters[2]).toEqual(expect.objectContaining({ letter: 'e', changed: false }));
        expect(letters[3]).toEqual(expect.objectContaining({ letter: 'c', changed: false }));
        expect(letters[4]).toEqual(expect.objectContaining({ letter: 'k', changed: true }));
    });

});


describe('clueToEmoji', () => {

    test('colorblind guess', () => {
        let cl: CluedLetter = {letter: "A", clue: Clue.Absent, guessClue: Clue.Correct};
        let e = clueToEmoji(cl, true);
        expect(e).toEqual("🟠");
    });

    test('colorblind clue', () => {
        let cl: CluedLetter = {letter: "A", clue: Clue.Elsewhere, guessClue: Clue.Correct};
        let e = clueToEmoji(cl, true);
        expect(e).toEqual("🟦");
    });

    test('guess', () => {
        let cl: CluedLetter = {letter: "A", clue: Clue.Absent, guessClue: Clue.Elsewhere};
        let e = clueToEmoji(cl, false);
        expect(e).toEqual("🟡");
    });

    test('clue', () => {
        let cl: CluedLetter = {letter: "A", clue: Clue.Correct, guessClue: Clue.Absent};
        let e = clueToEmoji(cl, false);
        expect(e).toEqual("🟩");
    });

});