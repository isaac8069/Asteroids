# **Asteroids: An Intergalatic Battlefield**

**Asteroids** is a space-themed multidirectional shooter arcade game. The player controls a single spaceship in an asteroid field which is periodically traversed by flying saucers. The object of the game is to shoot and destroy the asteroids and saucers, while not colliding with either. The game becomes harder as the number of asteroids increases.

## Tech Stack
HTML, CSS, Javascript

## Wireframe
![Asteroids@2x](https://user-images.githubusercontent.com/90520586/138520238-f38e6db3-57de-4169-88bf-a29af6819ec5.png)


## MVP Goals

*MVP stands for minimum viable product. It is a commonly used term in software development to refer to the base requirements of a finished product. Without this idea, the fear is that projects will never be released because we will always be adding features or improving things, even though a "perfect project" is not actually possible.* 

* MVP Goals
    * Put canvas on screen
    * Put spaceship (Player) on canvas
    * Get the spaceship (Player) to move around
    * Put asteroid on canvas
    * Get the asteroid to move from one direction of the screen to the other side
    * Put UFO's on the canvas
    * Get the UFO's to move from one direction of the screen to the other side
    * Bad guys (UFO's) make me lose a life/lose game
    * Crashing into asteroids to add to the score       

* Functional game breakdown
    * Start, Restart, and Instructions buttons functionally working
    * Instructions button takes you to a page that explains the object of the game, how to play the game, and how to win
    * Game is logging score
    * Background image remains the same
    * Lives render on screen 
        * They decrease by one every time you die 
        * If you die with no lives left the game ends
    * Objects 
        * Asteroids and UFO’s are moving across the screen in a straight line
        * Player movement is with arrow keys/w,a,s,d and space bar is used to shoot
    * You win by lasting the entire time of the game. You accumalete points during the game
    * When you lose
        * Game Over flashes on the screen
        * You must hit restart to continue

## Stretch Goals
* Sounds are performing for when Player shoots, asteroids explode from being shot, player crashes, UFO’s fly around and when they shoot
* A sound is made to indicate that you lost 
* Implementing Canvas
* The longer the game goes the harder it gets
* Better design visually
* Adding shooting for UFO's
* Add powerUps
* Add a second player and operational functionality
* Add another level
* Having bad guys coming in all different directions
* Player is moving and shooting in all directions
* Get the spaceship to shoot
* Make bullets have an effect
* Make bullets affect asteroids and UFO's

## Any Potential Roadblocks
* Logging score
* Adding shooting functionality
* Applying LOGIC
