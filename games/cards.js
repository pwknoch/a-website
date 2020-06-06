

class cardPile{
    constructor(deckCount) {
        this.cardPool = [];
        this.deckCount = deckCount ?? 1;

        this.reShuffle();
    }

    drawCard() {
        if(this.cardPool.length == 0) this.reShuffle();
        return this.cardPool.splice(getRandomInt(this.cardPool.length), 1)[0];
    }

    reShuffle() {
        var possibleRanks = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
        var possibleSuits = ['heart', 'spade', 'club', 'diamond'];
        
        for (let index = 0; index < this.deckCount; index++) {
            for (const rank of possibleRanks) {
                for (const suit of possibleSuits) {
                    this.cardPool.push({rank: rank, suit: suit});
                }
            }
        }
    }
}

// 0 -> (max-1)
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}