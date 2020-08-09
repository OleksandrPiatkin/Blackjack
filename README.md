# Blackjack
## url: https://black-jack.pp.ua
A project for summer internship at Profil Software.
This is front-end part of the project.

Blackjack(version "Oczko") with multiplayer and singleplayer modes.
In single player you compete against the bot.

## Architecture
We divided logic in two Classes: Game and Player.
### Game 
Controls the game process - initialize players and bot, checks win and lose conditions, allows to choose the game mode.
Class properties: 
<ul>
    <li>deckId - id of active game deck</li>
    <li>players - array of players in the game</li>
    <li>mode - active mode of the game</li>
</ul>
Example class methods:
<ul>
    <li>checkLastPlayerWin(id) - checks if all the players before a given id have lost</li>
    <li>getCard(btnNum, quantity) - draws <b>quantity</b> number of cards and assign them to <b>btnNum</b> player</li>
    <li>startMultiplGame() - initialize the players and starts the first player round</li>
</ul>

### Player 
Holds all relevant information for the player: points, cards, control buttons, id.
Class properties: 
<ul>
    <li>points - current player points</li>
    <li>hand - container for the card image render</li>
    <li>counter - container for the display player points</li>
    <li>hitBtn - current hit button</li>
    <li>stopBtn - current button to finish players round</li>
    <li>deckId current card desk id</li>
    <li>id - player hand id</li>
</ul>
Example class methods:
<ul>
    <li>clearHand() - is called when the game ends and resets player's points, cards, buttons</li>
    <li>getCardValue(card) - <b>card</b> name as input parameter. Returns number of points of this card</li>
</ul>

