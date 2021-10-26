window.onload = function() {
    
    // document.body.addEventListener("keydown", HandleKeyDown)
    // document.body.addEventListener("keyup", HandleKeyUp)
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    // this is the movement tracker
    // const moveDisplay = document.getElementById("movement")

    // // we're setting up height and width variables BASED ON computed style
    // // that means we're using setAttribute in conjunction with getComputedStyle
    // game.setAttribute('width', getComputedStyle(game)['width'])
    // game.setAttribute('height', getComputedStyle(game)['height'])
    // // check out the varying attributes width and height!
    // console.log('current game width', game.width)
    // console.log('current game height', game.height)
    
    // const keys = []

    // set canvas dimensions to window height and width
    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = W
    canvas.height = H

    // generate the flakes and apply attributes
    const mf = 100 // max number of flakees
    const flakes =[]

/////////////////////////////COOL BACKGROUND/////////////////////////////////////////
    // loop through the empty flakes and apply attributes
//     for(let i = 0; i < mf; i++) {
//         flakes.push({
//             x: Math.random()*W,
//             y: Math.random()*H,
//             r: Math.random()*5+2, // min of 2px and max of 7px
//             d: Math.random() + 1 // density of the flake
//         })
//     }

//     // draw flakes onto canvas
//     function drawFlakes() {
//         ctx.clearRect(0, 0, W, H)
//         ctx.fillStyle = "white"
//         ctx.beginPath()
//         for(let i = 0; i < mf; i++) {
//             const f = flakes[i]
//             ctx.moveTo(f.x, f.y)
//             ctx.arc(f.x, f.y, f.r, 0, Math.PI*2, true)
//         }
//         ctx.fill();
//         moveFlakes()
//     }

//     // animate the flakes
//     let angle = 0

//     function moveFlakes(){
//         angle += 0.01
//         for(let i = 0; i < mf; i++) {

//             //store current flake
//             let f = flakes[i]

//             // update x and y coordinates of each flake
//             f.y += Math.pow(f.d, 2) + 1
//             f.x += Math.sin(angle) * 2

//             // if flake reaches the bottom, send a new one to the top
//             if(f.y > H) {
//                 flakes[i] = {x: Math.random()*W, y: 0, r: f.r, d: f.d}
//             }
//         }
//     }

//     setInterval(drawFlakes, 25)


/////////////////////////////END COOL BACKGROUND/////////////////////////////////////
}


const game = document.getElementById('canvas')
// another thing we'll do here, is get the movement tracker
const moveDisplay = document.getElementById('movement')

// we're setting up height and width variables BASED ON computed style
// that means we're using setAttribute in conjunction with getComputedStyle
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])
// check out the varying attributes width and height!
// console.log('current game width', game.width)
// console.log('current game height', game.height)

// now we need to get the game's context so we can add to it, draw on it, create animations etc
// we do this with the built in canvas method, getContext
const ctx = game.getContext('2d')

// we're going to follow some sorta basic Object Oriented Programming 'rules' to build an interactive game
// we'll create objects for our player and our asteroids
// we'll give them their own 'draw' methods to place them on the canvas

// in javascript, there are two ways to create classes, which build objects.
// the first 'older' method, would be using a class
class Asteroids {
    constructor(x, y, color, width, height) {
        this.x = x
        this.y = y
        this.color = color
        this.width = width
        this.height = height
        this.alive = true
    }
    render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

class PlayerShip {
	constructor(x, y, color, width, height) {
		this.x = x
		this.y = y
		this.color = color
		this.width = width
		this.height = height
        // is my ship currently moving forward
        this.movingForward = false
		this.alive = true
        this.direction = {
            up: false,
            down: false,
            right: false,
            left: false
        }
    
	}
    setDirection(key) {
        console.log('the key pressed', key)
        // pressing key moves the character in direction
        if (key.toLowerCase() == 'w') this.direction.up = true
        if (key.toLowerCase() == 'a') this.direction.left = true
        if (key.toLowerCase() == 's') this.direction.down = true
        if (key.toLowerCase() == 'd') this.direction.right = true
    }
    // we also need to consider keyup events and 'unset' that direction
    unsetDirection(key) {
        if (key.toLowerCase() == 'w') this.direction.up = false
        if (key.toLowerCase() == 'a') this.direction.left = false
        if (key.toLowerCase() == 's') this.direction.down = false
        if (key.toLowerCase() == 'd') this.direction.right = false
    }
    movePlayer () {
        if (this.direction.up) this.y -= 10
            if (this.y <= 0) {
                this.y = 0
            }
        if (this.direction.left) this.x -= 10
            if (this.x <= 0) {
                this.x = 0
            }
            // move down
        if (this.direction.down) this.y += 10
            if (this.y + this.height >= game.height) {
                this.y = game.height - this.height
            }
            // move right
        if (this.direction.right) this.x += 10
            if (this.x + this.width >= game.width) {
                this.x = game.width - this.width
            }
    }
	render = function () {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.width, this.height, this.speed)
	}
}


const randomPlaceShrekX = (max) => {
    return Math.floor(Math.random() * max)
}

console.log('this is rando shrek x', randomPlaceShrekX(game.width))

let player = new PlayerShip(10, 10, 'yellow', 25, 25)
let asteroids = new Asteroids(randomPlaceShrekX(game.width), 50, 'blue', 32, 48)
let asteroidTwo = new Asteroids(randomPlaceShrekX(game.width), 45, 'red', 32, 48)
console.log('this is the player', player)
console.log('this is the asteroids', asteroids)


// make collision detection
// writing logic that determines if any part of our player square touches any part of our asteroids
// update detect hit, to take a variable(parameter) to use it on multiple things
const detectHit = (thing) => {
    // if the player's x + width or y + height hits the asteroids's x+width or y+height, kill shrek
    if (
        player.x < thing.x + thing.width &&
        player.x + player.width > thing.x &&
        player.y < thing.y + thing.height &&
        player.y + player.height > thing.y
    ) {
        // kill shrek
        thing.alive = false
        // end the game
        document.querySelector('#btmRight > h2').innerText = 'NICE!'
        // this is not quite where we want to stop our loop
        // stopGameLoop()
    }
}

// we're going to set up our game loop, to be used in our timing function
// set up gameLoop function, declaring what happens when our game is running
const gameLoop = () => {
    // clear the canvas
    ctx.clearRect(0, 0, game.width, game.height)
  
    // display relevant game state(player movement) in our movement display
    moveDisplay.innerText = `X: ${player.x}\nY: ${player.y}`
    // check if the asteroids is alive, if so, render the asteroids
    player.render()
    if (asteroids.alive) {
        asteroids.render()
        // add in our detection to see if the hit has been made
        detectHit(asteroids)
    } else if (asteroidTwo.alive) {
        document.querySelector('#btmRight > h2').innerText = 'Now Kill Asteroid 2!'
        asteroidTwo.render()
        detectHit(asteroidTwo)
    } else {
        stopGameLoop()
        document.querySelector('#btmRight > h2').innerText = 'You Win!'
    }
    // when asteroids 1 dies, show asteroids 2, run detect hit on asteroids 2, but make the logic dependent on that asteroids's alive
    // render our player
    player.movePlayer()
}

// we also need to declare a function that will stop our animation loop
let stopGameLoop = () => {clearInterval(gameInterval)}

// /using a different event handler for smooth movement
// we have two events now that we need to determine, we also will need to call player.move in the gameloop
document.addEventListener('keydown', (e) => {
    console.log('keydown', 'setDirection')
    player.setDirection(e.key)
})
// this will unset direction
document.addEventListener('keyup', (e) => {
    console.log('keyup')
    if(['w', 'a', 's', 'd'].includes(e.key)) {
        console.log('unsetDirection')
        player.unsetDirection(e.key)
    }
})
// add event listener for player movement
// document.addEventListener('keydown', movementHandler)
// the timing function will determine how and when our game animates
let gameInterval = setInterval(gameLoop, 60)




class Asteroid{
    constructor(x,y,radius,level,collisionRadius) {
        this.visible = true;
        this.x = x || Math.floor(Math.random() * canvasWidth);
        this.y = y || Math.floor(Math.random() * canvasHeight);
        this.speed = 3;
        this.radius = radius || 50;
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = 'white';
        this.collisionRadius = collisionRadius || 46;
        // Used to decide if this asteroid can be broken into smaller pieces
        this.level = level || 1;  
    }
    Update(){
        let radians = this.angle / Math.PI * 180;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;
        if (this.x < this.radius) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.radius;
        }
    }
    Draw(){
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) / 6);
        var radians = this.angle / Math.PI * 180;
        for(let i = 0; i < 6; i++){
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke();
    }
}
