var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var player = new paddle(5, 200, 25, 100);
var ai = new paddle(610, 200, 25, 100);
var plrScore = 0;
var botScore = 0;
var audio = new Audio('assets/engine_9.m4a');
var ball = {
    x: 320, y:240, radius: 10, xSpeed:2, ySpeed: 0,
    reverseX: function(){
        this.xSpeed = -this.xSpeed
    },
    reverseY: function(){
        this.ySpeed = -this.ySpeed
    },
    reset: function(){
        this.x = 320;
        this.y = 240;
        this.xSpeed = 2;
        this.ySpeed = 0;
    },
    isBouncing: ()=>{
        return ball.ySpeed !=0;
    },
    modifyXSpeedBy: function(modification){
        modification = this.xSpeed < 0 ? modification * -1 : modification;
        var nextValue = this.xSpeed + modification;
        nextValue = Math.abs(nextValue) > 9 ? 9 : nextValue;
        this.xSpeed = nextValue;
    },
    modifyYSpeedBy: function(modification){
        modification = this.ySpeed < 0 ? modification * -1 : modification;
        this.ySpeed += modification;
    }
};


function draw(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 640, 480)
    renderPaddle(player);
    renderPaddle(ai);
    renderBall(ball);
}

function paddle(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedModifier = 0;
    this.hasCollidedWith = (ball) => {
        var paddleLeftWall = this.x;
        var paddleRightWall = this.x + this.width;
        var paddleTopWall = this.y;
        var paddleBottomWall = this.y + this.height;
        if(ball.x + ball.radius > paddleLeftWall
            && ball.x - ball.radius < paddleRightWall
            && ball.y + ball.radius> paddleTopWall
            && ball.y - ball.radius < paddleBottomWall){
            return true;
        }
        return false;
    },
    this.move = (keyCode)=>{
        var nextY = this.y;
        if(keyCode == 40){
            nextY += 5;
            this.speedModifier = 1.5;
        }else if(keyCode == 38){
            nextY += -5;
            this.speedModifier = 1.5;
        }else {
            this.speedModifier = 0;
        }
        this.y = nextY < 0 ? 0 : nextY;
        nextY = nextY + this.height > 480 ? 480 - this.height : nextY;
    }
}

function renderBall(ball){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = "white";
    ctx.fill();
}

function renderPaddle(paddle){
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function tick(){
    updateGame();
    draw();
    window.setTimeout("tick()", 1000/60);
}

function updateGame(){
    ball.x += ball.xSpeed;
    ball.y += ball.ySpeed;
    if(ball.y <= 0 || ball.y >= 480){
        ball.reverseY();
    }
    var collidedWithPlayer = player.hasCollidedWith(ball);
    var collidedWithAi = ai.hasCollidedWith(ball);
    if(collidedWithPlayer || collidedWithAi){
        ball.reverseX();
        setTimeout(()=>{
        ball.modifyXSpeedBy(0.25);
        var speedUpValue = collidedWithPlayer ? player.speedModifier : ai.speedModifier;
        ball.modifyYSpeedBy(speedUpValue);}, 1)
    }
    for(var keyCode in heldDown){
        player.move(parseInt(keyCode));

    }
    var aiMiddle = ai.y + (ai.height / 2);
    if(aiMiddle < ball.y){
        ai.move(40);
    }
        if(aiMiddle > ball.y){
            ai.move(38);
        }
    if(ball.x < 0){
        ball.reset();
        botScore += 1;
        document.getElementById("score").textContent = "You: " + plrScore + " | Bot: " + botScore;
    }
    if(ball.x > 640){
        ball.reset();
        plrScore += 1;
        document.getElementById("score").textContent = "You: " + plrScore + " | Bot: " + botScore;

    }
}

var heldDown = {};
window.addEventListener("keydown", function(keyInfo){heldDown[event.keyCode] = true
if(audio.paused == true){
    audio.play()
}}, false);
window.addEventListener("keyup", function(keyInfo){ delete heldDown[event.keyCode];}, false);

tick();