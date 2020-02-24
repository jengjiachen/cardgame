// function setup () {
//     createCanvas(550, 640);
//     noStroke();
//     fill('#49868C');
// }



// function draw() {
    

//     background('#A0D9D9');
//     let jump = 120;
//     for (let y = 0; y < 4; y++) {
//         for (let x = 0; x < 4; x++) {
//             rect(x * jump + 50, y * jump + 60, 80, 100);
//         }
//     }

//     textSize(18);
//     textAlign(CENTER, CENTER);
//     text('Memory Card Game', 280, 560);
//     textSize(14);
//     textAlign(CENTER,CENTER);
//     text('0/6 matches found', 280, 580);
// }

const DOWN = 'down';
const UP = 'up';
let startingX = 30;
let startingY = 30;
let cards = [];
const gameState = {
    totalPairs: 8,
    flippedCards: [],
    numMatched: 0,
    attempts: 0,
    waiting: false
}

// preload images and fonts
let cardfaceArray = [];
let cardback;
function preload() {
    myFont = loadFont('assets/tofino.otf');
    myFontBold = loadFont('assets/tofino-bold.otf');
    cardback = loadImage('img/bg.png');
    cardfaceArray = [
        loadImage('img/1.png'),
        loadImage('img/2.png'),
        loadImage('img/3.png'),
        loadImage('img/4.png'),
        loadImage('img/5.png'),
        loadImage('img/6.png'),
        loadImage('img/7.png'),
        loadImage('img/8.png')
    ]
}

function setup() {
    createCanvas(550, 640);
    textFont(myFont);
    // stroke(color(50, 150, 50));
    let selectedFaces = [];
    // load pairs of cardface images into an array
    for (let pairs = 0; pairs < 8; pairs++) {
        const randomIdx = floor(random(cardfaceArray.length));
        const face = cardfaceArray[randomIdx];
        selectedFaces.push(face);
        selectedFaces.push(face);
        // remove the used cardface so it doesn't get randomly selected again
        cardfaceArray.splice(randomIdx, 1);
    }
    // layout cards in 4x4 grid on canvas
    selectedFaces = shuffleArray(selectedFaces);
    for (let rows = 0; rows < 4; rows++) {
        for (let columns = 0; columns < 4; columns++) {
            const faceImage = selectedFaces.pop();
            cards.push(new Card(startingX, startingY, faceImage));
            startingX += 135;
        }
        startingY += 130;
        startingX = 30;
    }
}

function draw () {
    background(color('#A0D9D9'));
    // fill(color(0));
    stroke('#49868C');
    // area at bottom of canvas for scoring feedback
    // rect(20, 550, 640, 20);
    // stroke(color(50, 150, 50));
    // check if game has been completed; stop if it is
    if (gameState.numMatched === gameState.totalPairs) {
        fill('#49868C');
        textFont(myFontBold);
        textSize(14);
        textAlign(CENTER, CENTER);
        text('YOU DID IT!', 275, 560);
        textFont(myFont);
        noLoop();
    }
    // if card faces showing don't match, turn them back down
    for (let cardToShow = 0; cardToShow < cards.length; cardToShow++) {
        if (!cards[cardToShow].isMatch) {
            cards[cardToShow].face = DOWN;
        }
        cards[cardToShow].show();
    }
    noLoop();
    // reset variables to indicate all cards are face down
    gameState.flippedCards.length = 0;
    gameState.waiting = false;
    // update ATTEMPTS and MATCHES counters at bottom of screen
    fill('#49868C');
    textSize(18);
    textAlign(CENTER, CENTER);
    text('Memory Card Game', 275, 560);
    textSize(14);
    textAlign(CENTER,CENTER);
    text('ATTEMPTS: ' + gameState.attempts, 275, 580);
    text('MATCHES: ' + gameState.numMatched, 275, 600);
    
}

function mousePressed () {
    if (gameState.waiting) {
        return;
    }
    for (let cardToShow = 0; cardToShow < cards.length; cardToShow++) {
        // first check flipped cards length, and then
        // we can trigger the flip
        if (gameState.flippedCards.length < 2 && cards[cardToShow].didHit(mouseX, mouseY)) {
            console.log('flipped', cards[cardToShow]);
            gameState.flippedCards.push(cards[cardToShow]);
        }
    }
    if (gameState.flippedCards.length === 2) {
        gameState.attempts++;
        if (gameState.flippedCards[0].cardFaceImg === gameState.flippedCards[1].cardFaceImg) {
            // cards match! Time to score!
            // mark cards as matched so they don't flip back
            gameState.flippedCards[0].isMatch = true;
            gameState.flippedCards[1].isMatch = true;
            // empty the flipped cards array
            gameState.flippedCards.length = 0;
            // increment the score
            gameState.numMatched++;
            loop();
        } else {
            // if cards don't match, wait two seconds then flip them both down
            // during those two waiting seconds clicks won't register
            gameState.waiting = true;
            const loopTimeout = window.setTimeout(() => {
                loop();
                window.clearTimeout(loopTimeout);
            }, 2000);
        }
    }
}

// build card class
class Card {
    constructor (x, y, cardFaceImg) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 100;
        // this.radius = 10;
        this.face = DOWN;
        this.cardFaceImg = cardFaceImg;
        this.isMatch = false;
        this.show();
    }

    show () {
        // if card has been clicked or has been already matched,
        // show face image
        if (this.face === UP || this.isMatch) {
            rect(this.x, this.y, this.width, this.height, this.radius);
            image(this.cardFaceImg, this.x, this.y);
        } else {
            // otherwise show card back
            rect(this.x, this.y, this.width, this.height, this.radius);
            image(cardback, this.x, this.y);
        }
    }

    // determine whether or not the mouse clicked on a card
    didHit (mouseX, mouseY) {
        if (mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height) {
            this.flip();
            return true;
        } else {
            return false;
        }
    }

    // flip a card
    flip () {
        if (this.face === DOWN) {
            this.face = UP;
        } else {
            this.face = DOWN;
        }
        this.show();
    }
}

// shuffle the card images randomly
function shuffleArray (array) {
    let counter = array.length;
    while (counter > 0) {
        // Pick random index
        const idx = Math.floor(Math.random() * counter);
        // decrease counter by 1 (decrement)
        counter--;
        // swap the last element with it
        const temp = array[counter];
        array[counter] = array[idx];
        array[idx] = temp;
    }
    return array;
}




