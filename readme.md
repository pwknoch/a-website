# A Website

### Setup

Open a terminal in the root directory, run ```npm install``` and then ```npm start```

### Contribution

That's a good one!

### To-Dos

- [X] Include some games on the games page.  
- [ ] Add some other stuff on the other page.  
- [ ] Add some stuff about the page.
- [ ] Add a state for the page with 3 stages.
    - [ ] the base stage
    - [ ] the moderately corrupted stage (after playing a game)
    - [ ] the fully corrupted stage (after pressing the button)

2048
- [X] Add rewind feature? Could be fun. (Note for rewind feature. Store serializedGameState in temporary variable at start of game loop. Only save it to global variable when movedAtAll is true.)
    - [ ] Improve the look? Add a font-awesome icon maybe.
- [ ] Fix formatting... (seriously need to focus on this)
- [X] Add fail state.
- [X] Add additional difficulty? Occasionally add a 4 instead of a 2.
- [ ] Use localStorage?

Other Games
- [ ] Poker/Blackjack? Maybe use speechSynthesis for fun?

Other Stuff
- [ ] Something to pull the last ~10 commits and display a feed. (this may have issues related to cors... maybe once I spin up a node server for this project, we can store it in a database.)
