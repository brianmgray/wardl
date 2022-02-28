# wardl

wardl is [Wordl](https://www.nytimes.com/games/wordle/index.html) but with these important tweaks:
TODO document wardl rules.

It is a fork of the incredibly helpful [hello-wordl](https://github.com/lynn/hello-wordl). See that
repo for more on the history, word lists, etc.

## For developers

To run the code locally, first install [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm). Then, in this directory, open a terminal and run `npm install` followed by `npm run start`. _wardl_ will be running at http://localhost:3000/. Any changes you make to the source code will be reflected there. Have fun!

Finally, `npm run deploy` will deploy your code to the `gh-pages` branch of your fork, so that everyone can play your version at https://yourname.github.io/wardl (or the name of your fork if you renamed it).

See [backlog](backlog.md)
- [ ] Convert hellow wordl to wardl
  - [x] Limit to 5 words
  - [ ] Understand and simplify word lists
  - [ ] Add logic to update the target each guess, UI devmode for this
  - [ ] Build algorithm for this, see [this question](https://stackoverflow.com/questions/2205540/algorithm-to-transform-one-word-to-another-through-valid-words)
- [ ] Features
  - [ ] Add social sharing, look at [lordle](https://github.com/lukevoyer/lordle)
  - [ ] Remove ultra hard mode
  - [ ] Add easy mode - highlight the letter that changed

## License

View license at the link below!
[MIT](https://choosealicense.com/licenses/mit/)

## Contact Me

You can contact me at [@BrianDoesImprov](https://twitter.com/BrianDoesImprov) on Twitter