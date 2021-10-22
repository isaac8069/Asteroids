# **Asteroids: An Intergalatic Battlefield**

**Asteroids** is a space-themed multidirectional shooter arcade game. The player controls a single spaceship in an asteroid field which is periodically traversed by flying saucers. The object of the game is to shoot and destroy the asteroids and saucers, while not colliding with either, or being hit by the saucers' counter-fire. The game becomes harder as the number of asteroids increases.

## Tech Stack
HTML, CSS, Javascript, Canvas (maybe)

## Wireframes of my game
https://whimsical.com/asteroids-WDUmWKoEh1vQBY9ZsxNoJn

## MVP Goals

*MVP stands for minimum viable product. It is a commonly used term in software development to refer to the base requirements of a finished product. Without this idea, the fear is that projects will never be released because we will always be adding features or improving things, even though a "perfect project" is not actually possible.* 

* Meet all technical requirements
    * Display a game in the browser
    * Switch turns between two players, or have the user play the computer (AI or obstacles)
    * Design logic for winning & visually display which player won
    * Include separate HTML / CSS / JavaScript files
    * Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles
    * Use Javascript for DOM manipulation
    * Deploy your game online, where the rest of the world can access it**
    * Use semantic markup for HTML and CSS (adhere to best practices)
        **We will be covering deployment before the end of the project.

* Functional game breakdown
    * Start, Restart, and Instructions buttons functionally working
    * Instructions button takes you to a page that explains the object of the game, how to play the game, and how to win
    * Game is logging score
    * Background image remains the same
    * Lives render on screen 
        * They decrease by one every time you die 
        * If you die with no lives left the game ends
        * Sounds are performing for when Player shoots, asteroids explode from being shot, player crashes, UFO’s fly around and when they shoot
    * Objects 
        * Asteroids and UFO’s are moving across the page randomly
        * Player movement is with arrow keys/w,a,s,d and space bar is used to shoot
    * UFO’s are shooting back
    * The longer the game goes the harder it gets
    * You win by achieving a certain score (not yet set)
    * When you lose
        * Game Over flashes on the screen
        * A sound is made to indicate that you lost 
        * You must hit restart to continue

## Stretch Goals
* Better design visually
* Add powerUps
* Add a second player and operational functionality
* Add another level

## Any Potential Roadblocks
* Logging score
* Adding shooting functionality
* Applying LOGIC
