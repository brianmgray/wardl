import {
    findChangedLetterIndex
  } from "../util";

describe.only('findChangedLetterIndex', () => {

    test('finds the last changed letter', () => {
        let word1 = "shall"
        let word2 = "shale"
        expect(findChangedLetterIndex(word1, word2)).toEqual(4);
    });

    test('finds the last changed letter, switched inputs', () => {
        let word1 = "shale"
        let word2 = "shall"
        expect(findChangedLetterIndex(word1, word2)).toEqual(4);
    });

    test('finds the first changed letter', () => {
        let word1 = "shale"
        let word2 = "whale"
        expect(findChangedLetterIndex(word1, word2)).toEqual(0);
    });

    test('finds no changed letter', () => {
        let word1 = "shale"
        let word2 = "shale"
        expect(findChangedLetterIndex(word1, word2)).toEqual(-1);
    });

});