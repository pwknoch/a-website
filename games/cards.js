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

class hand{
    constructor() {
        this.cards = [];
    }

    getHandValue() {
        var lowTotal = 0, highTotal = 0;
        for (let index = 0; index < this.cards.length; index++) {
            const element = this.cards[index];
            switch(element.rank){
                case "ace": 
                    lowTotal += 1;
                    highTotal += 11;
                    break;
                case "two":
                    lowTotal += 2, highTotal += 2;
                    break;
                case "three":
                    lowTotal += 3, highTotal += 3;
                    break;
                case "four":
                    lowTotal += 4, highTotal += 4;
                    break;
                case "five":
                    lowTotal += 5, highTotal += 5;
                    break;
                case "six":
                    lowTotal += 6, highTotal += 6;
                    break;
                case "seven":
                    lowTotal += 7, highTotal += 7;
                    break;
                case "eight":
                    lowTotal += 8, highTotal += 8;
                    break;
                case "nine":
                    lowTotal += 9, highTotal += 9;
                    break;
                case "ten":
                    lowTotal += 10, highTotal += 10;
                    break;
                case "jack":
                    lowTotal += 10, highTotal += 10;
                    break;
                case "queen":
                    lowTotal += 10, highTotal += 10;
                    break;
                case "king":
                    lowTotal += 10, highTotal += 10;
                    break;
            }
        }

        return {lowTotal, highTotal, noDiff: lowTotal == highTotal};
    }
}

var phase = 'bet';
var totalBet = 0.0, totalCash = 1000.0;
var notEnoughCashMessage = document.querySelector('#insufficient-money');
var cashDisplays = document.querySelectorAll('.total-cash');
var betDisplays = document.querySelectorAll('.total-bet');
var dealButton = document.querySelector('#deal');
var betButtons = document.querySelectorAll('.bet-button');
var hitButton = document.querySelector('#hit');
var standButton = document.querySelector('#stand');
var endOfRoundMsg = document.querySelector('.end-of-round-message');
var underConstructionButtons = document.querySelectorAll('.under-construction');

var playerCards = new hand(), dealerCards = new hand();

[...betButtons].forEach(f => f.addEventListener('click', bet));
[...underConstructionButtons].forEach(f => f.addEventListener('click', underConstruction));
dealButton.addEventListener('click', deal);
hitButton.addEventListener('click', hit);
standButton.addEventListener('click', stand);

updateCashDisplay();

function bet() {
    if(phase != 'bet') return;
    if(totalCash >= this.dataset.amount){
        totalBet += parseInt(this.dataset.amount);
        totalCash -= parseInt(this.dataset.amount);
        updateCashDisplay();
    } else {
        this.classList.add('invalid');
        var obj = this;
        setTimeout(() => obj.classList.remove('invalid'), 200);

        notEnoughCashMessage.classList.remove('off-screen');
        setTimeout(() => notEnoughCashMessage.classList.add('off-screen'), 5000);
    }
}

function deal() {
    if(phase != 'bet') {
        alert ('Wait your turn!');
        return;
    }
    if(totalBet === 0) {
        // TODO: Error message for no bet.
        alert('You haven\'t bet anything, you silly billy!')
        return;
    }

    // TODO: refactor this maybe...
    addCard('player');
    addCard('dealer');
    addCard('player');
    addCard('dealer', true);

    phase = 'play';
    updatePhase();
}

function hit() {
    if(phase != 'play') return;

    addCard('player');
    if(playerCards.getHandValue().lowTotal > 21) {
        phase = 'dealer';
        updatePhase();
        setTimeout(function () {
            totalBet = 0;
            endOfRoundMsg.innerHTML = 'Bust!';
            updateEndMsg();
            setTimeout(clearBoard, 3500)
        }, 1000);
    }
}

function stand() {
    if(phase != 'play') return;

    dealerTurn();
}

function dealerTurn() {
    phase = 'dealer';
    updatePhase();

    revealDownCard();

    while(dealerCards.getHandValue().highTotal <= 17) {
        addCard('dealer');
    }

    setTimeout(calculateWinner, 1000);
    setTimeout(clearBoard, 3500);
}

function clearBoard(){
    dealerCards = new hand(), playerCards = new hand();
    dealerDiv.innerHTML = '', playerDiv.innerHTML = '';

    phase = 'bet';
    updatePhase();
}

function calculateWinner() {
    if(dealerCards.getHandValue().lowTotal > 21){
        // bust
        totalCash += (totalBet * 2);
        totalBet = 0;
        endOfRoundMsg.innerHTML = 'Dealer Bust!';
    }
    else if((dealerCards.getHandValue().highTotal > playerCards.getHandValue().highTotal && dealerCards.getHandValue().highTotal < 22) || dealerCards.getHandValue().lowTotal > playerCards.getHandValue().highTotal) {
        // dealer win
        totalBet = 0;
        endOfRoundMsg.innerHTML = 'Dealer Wins!';
    }
    else if(dealerCards.getHandValue().highTotal < playerCards.getHandValue().highTotal){
        // player win
        totalCash += (totalBet * 2);
        totalBet = 0;
        endOfRoundMsg.innerHTML = 'You Win!';
    }
    else{
        // push
        endOfRoundMsg.innerHTML = 'Push!';
    }

    updateEndMsg();
    updateCashDisplay();
}

function updateEndMsg() {
    endOfRoundMsg.classList.add('expand');
    setTimeout(function() {endOfRoundMsg.classList.toggle('expand');}, 2500)
}

function revealDownCard() {
    var downCard = document.querySelector('.down-card');
    var dealerDownCard = dealerCards.cards.find(f => f.isDown);
    
    downCard.classList.add(dealerDownCard.rank, dealerDownCard.suit);
    downCard.classList.remove('down-card');
}

function updateCashDisplay() {
    [...cashDisplays].forEach(f => f.innerHTML = `$${totalCash}`);
    [...betDisplays].forEach(f => f.innerHTML = `$${totalBet}`);
}

function updatePhase() {
    switch(phase) {
        case 'bet':
            document.querySelector('.play-row').classList.remove('active');
            document.querySelector('.bet-row').classList.add('active');
            break;
        case 'play':
            document.querySelector('.play-row').classList.add('active');
            document.querySelector('.bet-row').classList.remove('active');
            break;
        case 'dealer':
            document.querySelector('.play-row').classList.remove('active');
            document.querySelector('.bet-row').classList.remove('active');
            break;
    }

    updateCashDisplay();
}

// 0 -> (max-1)
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

var dealerDiv = document.querySelector('.dealer');
var playerDiv = document.querySelector('.player');
var cards = new cardPile(2);

// TODO: Combine these methods...
function addDealerCard() {
    var card = cards.drawCard();
    var cardHtml = 
    `<div class="card in-deck ${card.suit} ${card.rank}">
        <div class="suit"></div>
        <div class="rank"></div>
    </div>`;

    dealerDiv.insertAdjacentHTML('beforeend', cardHtml);

    setTimeout(() => document.querySelector('.in-deck').classList.toggle('in-deck'), 20)
}

// TODO: Combine these methods...
function addPlayerCard() {
    var card = cards.drawCard();
    var cardHtml = 
    `<div class="card in-deck ${card.suit} ${card.rank}">
        <div class="suit"></div>
        <div class="rank"></div>
    </div>`;

    playerDiv.insertAdjacentHTML('beforeend', cardHtml);

    setTimeout(() => document.querySelector('.in-deck').classList.toggle('in-deck'), 20)
}

function addCard(who, isDown) {
    var card = cards.drawCard();
    card.isDown = isDown ?? false;

    var cardHtml = '';

    if(isDown) {
        cardHtml =
        `<div class="card in-deck down-card">
            <div class="suit"></div>
            <div class="rank"></div>
        </div>`;
    } else {
        cardHtml = 
        `<div class="card in-deck ${card.suit} ${card.rank}">
            <div class="suit"></div>
            <div class="rank"></div>
        </div>`;
    }

    if(who === 'player'){
        playerDiv.insertAdjacentHTML('beforeend', cardHtml);
        playerCards.cards.push(card);
    } else {
        dealerDiv.insertAdjacentHTML('beforeend', cardHtml);
        dealerCards.cards.push(card);
    }

    setTimeout(() => document.querySelector('.in-deck').classList.toggle('in-deck'), 20);
}

function underConstruction() {
    alert('this button is under construction');
}