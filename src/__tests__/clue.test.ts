import {Clue, CluedLetter, clue} from "../clue";

describe('clue', () => {

    test('clues the letters properly', () => {
        let word = "speck"
        let target = "shale"
        let historical = "shall"
        let letters:CluedLetter[] = clue(word, target, historical);
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
        let letters:CluedLetter[] = clue(word, target, historical);
        console.log(letters);
        expect(letters[0]).toEqual(expect.objectContaining({ letter: 's', changed: false }));
        expect(letters[1]).toEqual(expect.objectContaining({ letter: 'p', changed: false }));
        expect(letters[2]).toEqual(expect.objectContaining({ letter: 'e', changed: false }));
        expect(letters[3]).toEqual(expect.objectContaining({ letter: 'c', changed: false }));
        expect(letters[4]).toEqual(expect.objectContaining({ letter: 'k', changed: true }));
    });

});