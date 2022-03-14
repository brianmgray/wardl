# wardl

## Play at [wardl.co](http://wardl.co)

wardl is [Wordle](https://www.nytimes.com/games/wordle/index.html) but the target word changes by one letter everytime you guess wrong.

Originally a fork of the incredibly helpful [hello-wordl](https://github.com/lynn/hello-wordl), 
provided via an ([MIT License](https://github.com/lynn/hello-wordl/blob/main/LICENSE)). This project changed the game significantly enough that I can't make PRs, so I made a separate repo.

## Word Lists

- Targets come from [hello-wordl](https://github.com/lynn/hello-wordl)'s edits to [Peter Norvig's English word frequency list](http://norvig.com/mayzner.html). I've further reduced the list to only 5 letter words.

- Dictionary (to check guesses) come from *Official Tournament and Club Word List used in North American Scrabble tournaments*. This is also from [hello-wordl](https://github.com/lynn/hello-wordl), and I don't know where this came 
from online.

## For developers

### Run locally

To run the code locally,

1. install [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm).
2. In this directory, run `npm install` followed by `npx netlify dev`. _wardl_ will be running at http://localhost:8888. Any changes you make to the source code will be reflected there. 
3. Have fun!

Share local build over the internet: ``netlify dev --live``

### Run Tests

Tests are written in Jest. Run with ``npm run test``

### Update lists

There are scripts to update the lists.

1. To update possible targets, run ``npm run reduceTargets``
2. To reduce the dictionary, run ``npm run reduceDictionary``

### Deploy

Any commit to the main will trigger a deploy using netlify.

### Update dependencies

From [Updating npm dependencies](https://www.carlrippon.com/upgrading-npm-dependencies/):

1. Run ``npm outdated``
2. If that all looks good, run ``npm update``

To fix vulnerabilits (on the command line or in github):

1. Run ``npm audit --production`` to build the full audit report
2. Run ``npm audit fix --production`` to fix any that can be fixed without breaking changes
3. If needed, run ``npm audit fix --force --production`` to fix all, even if they will make breaking changes

## License

View license at the link below!
[MIT](https://choosealicense.com/licenses/mit/)

## Contact Me

You can contact me at [@BrianDoesImprov](https://twitter.com/BrianDoesImprov) on Twitter