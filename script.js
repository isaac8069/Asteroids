window.onload = function() {
    
    // document.body.addEventListener("keydown", HandleKeyDown)
    // document.body.addEventListener("keyup", HandleKeyUp)
    const canvas = document.getElementById("canvas")
    canvas.height = 600
    canvas.width = 1400
    const ctx = canvas.getContext("2d")
    // this is the movement tracker
    // const moveDisplay = document.getElementById("movement")


    // set canvas dimensions to window height and width
    const W = canvas.width
    const H = canvas.height

    // generate the flakes and apply attributes
    const mf = 100 // max number of flakees
    const flakes =[]

/////////////////////////////COOL BACKGROUND/////////////////////////////////////////
    // loop through the empty flakes and apply attributes
    for(let i = 0; i < mf; i++) {
        flakes.push({
            x: Math.random()*W,
            y: Math.random()*H,
            r: Math.random()*5+2, // min of 2px and max of 7px
            d: Math.random() + 1 // density of the flake
        })
    }

    // draw flakes onto canvas
    function drawFlakes() {
        ctx.clearRect(0, 0, W, H)
        ctx.fillStyle = "white"
        ctx.beginPath()
        for(let i = 0; i < mf; i++) {
            const f = flakes[i]
            ctx.moveTo(f.x, f.y)
            ctx.arc(f.x, f.y, f.r, 0, Math.PI*2, true)
        }
        ctx.fill();
        moveFlakes()
    }

    // animate the flakes
    let angle = 0

    function moveFlakes(){
        angle += 0.01
        for(let i = 0; i < mf; i++) {

            //store current flake
            let f = flakes[i]

            // update x and y coordinates of each flake
            f.y += Math.pow(f.d, 2) + 1
            f.x += Math.sin(angle) * 2

            // if flake reaches the bottom, send a new one to the top
            if(f.y > H) {
                flakes[i] = {x: Math.random()*W, y: 0, r: f.r, d: f.d}
            }
        }
    }

    setInterval(drawFlakes, 50)

            //// Couldn't get this to sit under my canvas /////
/////////////////////////////END COOL BACKGROUND/////////////////////////////////////
}


const game = document.getElementById('canvas')
// another thing we'll do here, is get the movement tracker
const moveDisplay = document.getElementById('movement')

// we're setting up height and width variables BASED ON computed style
// that means we're using setAttribute in conjunction with getComputedStyle

/// Sets the value of an attribute on the specified element. If the attribute already exists, the value is updated; otherwise a new attribute is added with the specified name and value. ///

game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

/// The Window.getComputedStyle() method returns an object containing the values of all CSS properties of an element, after applying active stylesheets and resolving any basic computation those values may contain. ///

// check out the varying attributes width and height!
// console.log('current game width', game.width)
// console.log('current game height', game.height)

// now we need to get the game's context so we can add to it, draw on it, create animations etc
// we do this with the built in canvas method, getContext
const ctx = game.getContext('2d')



let gameInterval


// we're going to follow some sorta basic Object Oriented Programming 'rules' to build an interactive game

/// Object-oriented programming (OOP) is a programming paradigm based on the concept of "objects", which can contain data and code: data in the form of fields (often known as attributes or properties), and code, in the form of procedures (often known as methods). ///

// we'll create objects for our player and our asteroid
// we'll give them their own 'draw' methods to place them on the canvas

// in javascript, there are two ways to create classes, which build objects.
// the first 'older' method, would be using a class
class Enemy {
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
        // ctx.beginPath();
        // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        // ctx.stroke();
    }
}

class Enemy2 {
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
        // ctx.beginPath();
        // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        // ctx.stroke();
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
        // console.log('the key pressed', key)
        // pressing key moves the character in direction
        if (key.toLowerCase() == 'w') this.direction.up = true
        if (key.toLowerCase() == 'a') this.direction.left = true
        if (key.toLowerCase() == 's') this.direction.down = true
        if (key.toLowerCase() == 'd') this.direction.right = true
    }

    // we also need to consider keyup events and 'unset' that direction
    /// The keyup event is sent to an element when the user releases a key on the keyboard. It can be attached to any element, but the event is only sent to the element that has the focus. Focusable elements can vary between browsers, but form elements can always get focus so are reasonable candidates for this event type.///

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
        // Shadow
        ctx.shadowColor = '#71FF69';
        ctx.shadowBlur = 20;
	}
}

let points = 0
let score = document.getElementById("btmLeft")
score.innerText = `Score: ${points}`

function updatePoints() {
    points += 10
    score.innerText = `Score: ${points}`
    console.log(points)
}

const randomAsteroid = (max) => {
    return Math.floor(Math.random() * max)
}

// console.log('this is rando asteroid x', randomAsteroid(game.width))

let player = new PlayerShip(700, 600, '#71FF69', 25, 25)
console.log(game.height)
/// constructor(x, y, color, width, height)///

let asteroidArr = []
let ufoArr = []

setInterval(()=> {
    /// create a new ufo///
    let ufo = new Enemy2(randomAsteroid(game.width), 0, 'black', 32, 48)
    // console.log('this is the player', player)
    /// this can be done with the line ufoArr.push(ufo)
    ufoArr.push(ufo)
    /// inside my game loop I will need to loop over ufoArr, and call ufo[i].render() if/when you detect a hit with the ufo, you'll need to splice it from the array so it no longer shows up while rendering ///

})


let timer = document.getElementById("timer")

setInterval(() => {
    /// create a new asteroid///
    let asteroid = new Enemy(randomAsteroid(game.width), 0, '#1F51FF', 27, 27)
    /// this can be done with the line asteroidArr.push(asteroid)
    asteroidArr.push(asteroid)
    /// inside my game loop I will need to loop over asteroidArr, and call asteroid[i].render() if/when you detect a hit with the asteroid, you'll need to splice it from the array so it no longer shows up while rendering ///
    
  }, 2000);
  


/// get rid of my alert. Change 'Game Over!' to a function saying render this game over with a div element onto center on screen. I will need to use Z-index ///



// make collision detection
// writing logic that determines if any part of our player square touches any part of our asteroid

// update detect hit, to take a variable(parameter) to use it on multiple things
const thing = asteroidArr
const detectHit = (thing) => {
    // if the player's x + width or y + height hits the asteroid's x+width or y+height, kill asteroid
    if (
        /// x-axis = horizontal(width) and y-axis = vertical(height) ...if player x axis < thing(asteroids/ufo) x axis + thing width && player x axis + player.width > thing x axis && player y axis < thing y axis + thing.height && player y axis + player.height > thing.y THING.ALIVE is false and the asteroid/ufo has been killed///
        
        player.x < thing.x + thing.width &&
        player.x + player.width > thing.x &&
        player.y < thing.y + thing.height &&
        player.y + player.height > thing.y
    ) {
        updatePoints()

        // kill asteroid
        thing.alive = false
        // end the game
        // document.querySelector('#btmRight > h2').innerText = 'NICE!'
        // this is not quite where we want to stop our loop
        // stopGameLoop()
    }
}


// we're going to set up our game loop, to be used in our timing function
// set up gameLoop function, declaring what happens when our game is running
const gameLoop = () => {
    // clear the canvas
    ctx.clearRect(0, 0, game.width, game.height)
    // console.log(asteroidArr)
    /// The CanvasRenderingContext2D.clearRect() method of the Canvas 2D API erases the pixels in a rectangular area by setting them to transparent black. Note: Be aware that clearRect() may cause unintended side effects if you're not using paths properly. Make sure to call beginPath() before starting to draw new items after calling clearRect().///
 
    // display relevant game state(player movement) in our movement display
    // moveDisplay.innerText = `X: ${player.x}\nY: ${player.y}`
    player.render()
    // check if the asteroid is alive, if so, render the asteroid
    for(let i = 0; i < asteroidArr.length; i++) {
        
        if (asteroidArr[i].alive) {
            asteroidArr[i].render()
            asteroidArr[i].y++
            // add in our detection to see if the hit has been made
            detectHit(asteroidArr[i])
        } else if (ufoArr[i].alive) {
            document.querySelector('#btmRight > h2').innerText = 'Watch out for the UFOs!'
            ufoArr[i].render()
            ufoArr[i].y++
            detectHit(ufoArr[i])
        } else {
            timer.innerText = 'Game Over!'
            stopGameLoop()
            document.querySelector('#btmRight > h2').innerText = 'You Lose!'
        }
    }
    // when asteroid 1 dies, spawn UFO's, run detect hit on UFO's, but make the logic dependent on that asteroid's alive
    // render our player
    player.movePlayer()
}


// /using a different event handler for smooth movement
// we have two events now that we need to determine, we also will need to call player.move in the gameloop
document.addEventListener('keydown', (e) => {
    // console.log('keydown', 'setDirection')
    player.setDirection(e.key)
})
// this will unset direction
document.addEventListener('keyup', (e) => {
    // console.log('keyup')
    if(['w', 'a', 's', 'd'].includes(e.key)) {
        // console.log('unsetDirection')
        player.unsetDirection(e.key)
    }
})

    
    // we also need to declare a function that will stop our animation loop
    let stopGameLoop = () => {clearInterval(gameInterval)}


    // function stopGameLoop()
    // {
    //     let startDiv = document.getElementById("start")
    //     // let canvas = document.getElementById("canvas")
    //     let gameOver = document.getElementById("game-over")
    //     startDiv.style.display = "block"
    //     // canvas.style.display = "none"
    //     // gameOver.style.display = "block"
    //     clearInterval(gameInterval)
    //     // start()
    // }

    // function gameOver() {
    //     let startDiv = document.getElementById("start")
    //     let canvas = document.getElementById("canvas")
    //     let gameOver = document.getElementById("game-over")
    //     startDiv.style.display = "none"
    //     gameCanvas.style.display = "none"
    //     gameOver.style.display = "block"
    
    //     player.reset()
    //     asteroidArr.reset()
    //     ufoArr.reset()
    
    //     clearInterval(loop)
    // }



function startGame() {
    let startDiv = document.getElementById("start")
    // let canvas = document.getElementById("canvas")
    let gameOver = document.getElementById("game-over")
    startDiv.style.display = "none"
    canvas.style.display = "block"
    gameOver.style.display = "none"
    gameInterval = setInterval(gameLoop, 60)

}