# Backlog

- [ ] Convert hellow wordl to wardl
  - [x] Limit to 5 words
  - [x] Understand and simplify word lists
  - [x] Add logic to update the target each guess
  - [x] UI devmode/reveal for target history
  - [x] Build algorithm for this, see [this question](https://stackoverflow.com/questions/2205540/algorithm-to-transform-one-word-to-another-through-valid-words)
  - [ ] UI improvements to:
    - [ ] Remove the big target
    - [ ] Show which letter changed
    - [ ] Only show targets at the end
- [ ] Features
  - [ ] Improve social sharing links
  - [ ] Update modes - easy mode (highlight changed letter), ultra hard (maybe get rid of this)
  - [ ] Improve UI around targets

## Algorithm notes

- [ ] BK Tree
- [ ] Build graph on app startup: 
  - each node is a word in the targets list
  - permute each character, lookup in the dictionary. If it's a word
    - is it in the graph? connect it to the first word
    - if not, add it as a connection to the first word
- [ ] to advance the target:
  - find target node
  - pick from its paths