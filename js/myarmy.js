const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");


let captured = {};
let selectionProcess = false;
let x1, y1, x2, y2;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

class Unit {
    constructor(w, h, x, y, name) {
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.color = 'red';
        this.name = name;
    }
    is_captured(x1, y1, x2, y2) {
        if (
            (this.x > x1 && (this.x + this.w) < x2) && (this.y > y1 && (this.y + this.h) < y2)
        ) {
            return true;
        } else {
            return false;
        }

    }
    drawUnit() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

var units = [new Unit(50, 50, 20, 40, 'unit_name')];


var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0, u; i < units.length; i++) {
        u = units[i];
        u.drawUnit();
        if (selectionProcess === true) {
            drawSelectRect(x1, y1, x2, y2);
            captureUnits(u, x1, y1, x2, y2);
        }
    }

    // drawUnit();


    // drawPaddle();
    // drawBricks();
    // collisionDetection();
    // drawScore();
    // drawLives();
    // x += dx;
    // y += dy;
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();

            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if (leftPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }
    requestAnimationFrame(draw);


}
draw();

function captureUnits(u, x1, y1, x2, y2) {
    let name = u.name;

    if (u.is_captured(x1, y1, x2, y2) === true) {
        u.color = 'blue';
        if (!captured.hasOwnProperty(name)) {
            captured[name] = u;
        }

    } else {
        u.color = 'red';
        if (captured.hasOwnProperty(name)) {
            delete captured[name];
        }

    }

    console.log(captured);

}



// function drawPaddle() {
//     ctx.beginPath();
//     ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
//     ctx.fillStyle = "#0095DD";
//     ctx.fill();
//     ctx.closePath();
// }

// function drawScore() {
//     ctx.font = "16px Arial";
//     ctx.fillStyle = "#0095DD";
//     ctx.fillText("Score: " + score, 8, 20);
// }

// function drawLives() {
//     ctx.font = "16px Arial";
//     ctx.fillStyle = "#0095DD";
//     ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
// }

// function drawBricks() {
//     for (var c = 0; c < brickColumnCount; c++) {
//         for (var r = 0; r < brickRowCount; r++) {
//             if (bricks[c][r].status == 1) {
//                 var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
//                 var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
//                 bricks[c][r].x = brickX;
//                 bricks[c][r].y = brickY;
//                 ctx.beginPath();
//                 ctx.rect(brickX, brickY, brickWidth, brickHeight);
//                 ctx.fillStyle = "#0095DD";
//                 ctx.fill();
//                 ctx.closePath();
//             }
//         }
//     }
// }

// function keyDownHandler(e) {
//     if (e.key == "Right" || e.key == "ArrowRight") {
//         rightPressed = true;
//     }
//     else if (e.key == "Left" || e.key == "ArrowLeft") {
//         leftPressed = true;
//     }
// }

// function keyUpHandler(e) {
//     if (e.key == "Right" || e.key == "ArrowRight") {
//         rightPressed = false;
//     }
//     else if (e.key == "Left" || e.key == "ArrowLeft") {
//         leftPressed = false;
//     }
// }

// function collisionDetection() {
//     for (var c = 0; c < brickColumnCount; c++) {
//         for (var r = 0; r < brickRowCount; r++) {
//             var b = bricks[c][r];
//             if (b.status == 1) {
//                 if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
//                     dy = -dy;
//                     b.status = 0;
//                     score++;
//                     if (score == brickRowCount * brickColumnCount) {
//                         alert("YOU WIN, CONGRATULATIONS!");
//                         document.location.reload();

//                     }
//                 }
//             }
//         }
//     }
// }

function mouseMoveHandler(e) {
    if (selectionProcess === true) {
        x2 = e.clientX;
        y2 = e.clientY;
    }
    // var relativeX = e.clientX - canvas.offsetLeft;
    // if (relativeX > 0 && relativeX < canvas.width) {
    //     paddleX = relativeX - paddleWidth / 2;
    // }
}

function drawSelectRect(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
    ctx.stroke();
    ctx.closePath();
}

function mouseDownHandler(e) {
    if (e.buttons === 2) {
        console.log('pkm')
        for (let key in captured) {
            if (Object.hasOwnProperty.call(captured, key)) {
                let u = captured[key];
                u.x = e.clientX;
                u.y = e.clientY;

            }
        }
        // for (let i = 0, u; i < captured.length; i++) {
        //     u = captured[i];
        //     console.log(captured)
        //     u.x = e.clientX;
        //     u.y = e.clientY;
        // }
    }else{
        x1 = e.clientX;
        y1 = e.clientY;
        x2 = e.clientX;
        y2 = e.clientY;
        // console.log(e.clientX, e.clientY);
        selectionProcess = true;
    }
    
}

function mouseUpHandler(e) {
    // console.log(e.clientX, e.clientY);
    selectionProcess = false;
}

// document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    // return false;
}, false);