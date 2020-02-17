

function setup () {
    createCanvas(550, 640);
    noStroke();
    fill('#49868C');
}



function draw() {
    

    background('#A0D9D9');
    let jump = 120;
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            rect(x * jump + 50, y * jump + 60, 80, 100);
        }
    }

    textSize(18);
    textAlign(CENTER, CENTER);
    text('Memory Card Game', 280, 560);
    textSize(14);
    textAlign(CENTER,CENTER);
    text('0/6 matches found', 280, 580);
}

