import './style/style.css';

const modeChooseCover = document.getElementById('mode-choose-cover');
const url = 'https://deckofcardsapi.com/api/deck/';
const newDeckUrl = `${url}new/shuffle/?deck_count=1`;

const makeRequest = (url, callback) => {
    fetch(url)
        .then(response => response.json())
        .then(callback);
};

class Game {
    constructor(deckId) {
        this.deckId = deckId;
        this.players = [];
        this.mode = null;
    }

    initPlayer(id) {
        return new Player(this.deckId, id);
    }

    setNewGame(mode) {
        this.mode = mode;
        mode === 'single' ? this.startSingleGame() : this.startMultiplGame();

        modeChooseCover.classList.add('hidden');
    }

    shuffleTheDesk() {
        makeRequest(`${url}${this.deckId}/shuffle/`);
    }

    doubleAceWin() {
        setTimeout(() => {
            alert('You win with double ACE!');
            this.endGame();
        }, 300);
    }

    checkInstantWin(id) {
        const points = this.players[id].points;
        if (points === 22) {
            this.doubleAceWin();
        }
    }

    startSingleGame() {
        const id = 1;
        const player = this.initPlayer(id);
        this.players.push(player);
        player.start();
        setTimeout(() => {
            this.checkInstantWin(id - 1);
        }, 400);
    }

    startMultiplGame() {

        for (let i = 1; i < 6; i++) {
            const player = this.initPlayer(i);
            this.players.push(player);
        }

        this.players[0].start();
        setTimeout(() => {
            this.checkInstantWin(0);
        }, 300);
    }

    clearTable() {
        this.players.forEach(player => {
            player.clearHand();
        });
    }

    findPlayer(btnNum) {
        let id;
        this.players.forEach(player => {
            const gameNum = player.counter.id.slice(-1);
            if (btnNum === gameNum) {
                id = (gameNum - 1);
            }
        });
        return id;
    }

    getCard(btnNum, quantity) {
        const id = this.findPlayer(btnNum);
        this.players[id].getCard(quantity);

        setTimeout(() => {
            const currentPlayerPoints = this.players[id].points;
            if (currentPlayerPoints >= 22) {
                alert(`Player ${id + 1} loose :(`);
                this.mode === 'single' ? this.endGame() : this.stopMulti(id);
            }
        }, 400);
    }

    checkLastPlayerWin(id) {
        let win = true;
        for (let i = 0; i < id; i++) {
            const points = this.players[i].points;
            if (points <= 21) {
                win = false;
            }
        }

        return win;
    }

    showNextPlayer(id) {
        this.players[id].start();

        setTimeout(() => {
            this.checkInstantWin(id);
            if (id === 4 && this.checkLastPlayerWin(id)) {
                alert('Last Player wins!');
                this.endGame();
            }
        }, 400);
        this.players[id].showPlayerBtn();
    }

    async createBot() {
        const bot = new Player(this.deckId, 5);
        bot.start();
        bot.hidePleyerBtn();
        this.players.push(bot);
        setTimeout(() => {
            if (bot.points <= 14) {
                bot.getCard(1);
            }
            setTimeout(() => {
                const playerP = this.players[0].points;
                const botP = bot.points;
                if (playerP > botP) {
                    alert('Playr wins!');
                }  
                else if (playerP < botP) {
                    alert('You lose!');
                } else {
                    alert('Draw!');
                }
                this.endGame();
            }, 400);
        }, 400);
    }

    stopSingle(id) {
        this.createBot();
    }

    setWinner() {

        let winnersId = [];
        let winnerNum;

        let activePlayer = [];
        [...this.players].forEach(player => {
            if (player.points <= 21) {
                activePlayer.push(player);
            }
        });
        const sorted = activePlayer.sort((a, b) => b.points - a.points);
        winnerNum = sorted[0].points;

        sorted.forEach(player => {
            if (player.points === winnerNum) {
                winnersId.push(player.id);
            }
        });

        const winnersLenth = winnersId.length;
        if (winnersLenth === 0) {
            alert('There are no winners :(');
        }
        else if (winnersLenth === 1) {
            alert(`Player${winnersId[0]} wins!`);
        } else {
            alert(`Draw for payers: ${winnersId.join(', ')}`);
        }
        this.endGame();
    }

    stopMulti(id) {
        this.players[id].hidePleyerBtn();
        const nextPlayerid = id + 1;

        if (nextPlayerid < 5) {
            this.showNextPlayer(nextPlayerid);
        }
        else {
            this.setWinner();
        }

    }
    stopTurn(btnNum) {

        const id = this.findPlayer(btnNum);
        this.mode === 'single' ? this.stopSingle(id) : this.stopMulti(id);

    }

    endGame() {
        this.shuffleTheDesk();
        this.clearTable();
        modeChooseCover.classList.remove('hidden');
    }
}

let game;

const localId = localStorage.getItem('id');

if (!localId) {
    makeRequest(newDeckUrl, deck => {
        const id = deck.deck_id;
        game = new Game(id);
        localStorage.setItem('id', `${id}`);
    });
} else {
    game = new Game(localId);
}

class Player {
    constructor(deckId, id) {
        this.points = 0;
        this.hand = document.getElementById(`player-hand-${id}`);
        this.counter = document.getElementById(`counter-player-${id}`);
        this.hitBtn = document.getElementById(`player-hit-${id}`);
        this.stopBtn = document.getElementById(`player-stop-${id}`);
        this.deckId = deckId;
        this.id = id;
    }
    
    showPlayerBtn() {
        this.hitBtn.classList.remove('hidden');
        this.stopBtn.classList.remove('hidden');
    }

    hidePleyerBtn() {
        this.hitBtn.classList.add('hidden');
        this.stopBtn.classList.add('hidden');
    }

    start() {
        this.showPlayerBtn();
        this.getCard(2);

        // Promise.all([this.getCard(), this.getCard()])
        // .then((responses) => responses.forEach(response callback(this.id - 1)));
    }

    getCardValue(card) {
        switch (card) {
            case "JACK":
                return 2;
            case "QUEEN":
                return 3;
            case "KING":
                return 4;
            case "ACE":
                return 11;
            default:
                return +card;
        }
    }

    createCardImg(card) {
        this.points += this.getCardValue(card.value);
        const imgUrl = card.image;
        const img = document.createElement('img');
        img.src = imgUrl;
        this.hand.appendChild(img);
    }

    drawCards(data) {
        const cards = data.cards;

        cards.forEach(card => {
            this.createCardImg(card);
            const playerPoins = `Player${this.id}: ${this.points}`;
            this.counter.innerHTML = playerPoins;
        });

    }

    getCard(quantity) {
        return makeRequest(`${url}${this.deckId}/draw/?count=${quantity}`, this.drawCards.bind(this));
    }

    clearHand() {
        this.points = 0;
        this.hand.innerHTML = '';
        this.counter.innerHTML = '';

        if (this.hitBtn.classList == '') {
            this.hidePleyerBtn();
        }
    }

    alertPoints() {
        this.points === 21 ?
            alert(`You have ${this.points} points, nice hand!`) :
            alert(`You have ${this.points} points.`);
    }

}

//mode controllers
const singleModeBtn = document.getElementById('mode-choose-s');
const MultiplayerModeBtn = document.getElementById('mode-choose-m');


const startGame = event => {
    game.players = [];
    const mode = event.path[0].id.substr(-1);
    if (mode === 's') {
        game.setNewGame('single');
    }
    else if (mode === 'm') {
        game.setNewGame('multiplayer');
    }
};
singleModeBtn.addEventListener('click', startGame);
MultiplayerModeBtn.addEventListener('click', startGame);


let pleyersHit = [];
let playersStop = [];

function initBtns() {
    for (let i = 1; i < 6; i++) {
        const playerStopBtn = document.getElementById(`player-stop-${i}`);
        playersStop.push(playerStopBtn);
        const playerHitBtn = document.getElementById(`player-hit-${i}`);
        pleyersHit.push(playerHitBtn);
    }
}
initBtns();

const draw = event => {
    const btnNum = event.path[0].id.slice(-1);
    game.getCard(btnNum, 1);
}
pleyersHit.forEach(item => {
    item.addEventListener('click', draw);
});

function stop() {
    const btnNum = event.path[0].id.slice(-1);
    game.stopTurn(btnNum);
}
playersStop.forEach(item => {
    item.addEventListener('click', stop);
});



