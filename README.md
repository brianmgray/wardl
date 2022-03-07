# wardl

wardl is [Wordl](https://www.nytimes.com/games/wordle/index.html) but with these important tweaks:
TODO document wardl rules.

Originally a fork of the incredibly helpful [hello-wordl](https://github.com/lynn/hello-wordl), 
provided via an ([MIT License](https://github.com/lynn/hello-wordl/blob/main/LICENSE)). This project changed the 
game significantly enough that I can't make PRs, so I made a separate repo.

## Word Lists

- Targets come from [hello-wordl](https://github.com/lynn/hello-wordl)'s edits to [Peter Norvig's English word frequency list](http://norvig.com/mayzner.html). I've further reduced the list to only 5 letter words.

- Dictionary (to check guesses) come from *Official Tournament and Club Word List used in North American Scrabble tournaments*. This is also from [hello-wordl](https://github.com/lynn/hello-wordl), and I don't know where this came 
from online.

## For developers

### Run locally

To run the code locally,

1. install [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm.
2. In this directory, run `npm install` followed by `npx netlify dev`. _wardl_ will be running at http://localhost:8888. Any changes you make to the source code will be reflected there. 
3. Have fun!

Share local build over the internet: ``netlify dev --live``

### Update lists

There are scripts to update the lists.

1. To update possible targets, run ``npm run reduceTargets``
2. To reduce the dictionary, run ``npm run reduceDictionary``

### Deploy

To deploy using netlify:
````
> npx netlify login #only needed once

````

See [backlog](backlog.md)

## License

View license at the link below!
[MIT](https://choosealicense.com/licenses/mit/)

## Contact Me

You can contact me at [@BrianDoesImprov](https://twitter.com/BrianDoesImprov) on Twitter