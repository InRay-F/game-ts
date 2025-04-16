# game-ts

## GOALS

[x] game works

[x] break down problem

[x] git + github flow

[x] scope

## REQUIREMENTS

[x] <div class='grid'><div>

[x] pseudocode

[x] version control

[x] readability

[x] functions

[x] correct format

[x] suitable indentation

[x] suitable variable names

[x] code

[x] understand it?

[x] can explain it?

[x] click / keypress events <- no restarts

[x] mobile first

[x] Host it online (use GitHub pages)

## Inital Ideas

### HTML

<ul>
  <li>container / game board</li>
  <li>grid of cards</li>
  <li>individual cards</li>
  <li>divs</li>
  <li>buttons</li>
  <li>score display?</li>
  <li>timer?</li>
  <li>message area - display</li>
  <li>buttons <- static</li>
</ul>

### CSS

<ul>
  <li>images</li>
  <li>classes - flipped state</li>
  <li>media queies!!</li>
  <li>mixins</li>
</ul>

### JAVASCRIPT

<ul>
  <li>card data array</li>
  <li>card shuffle</li>
  <li>event listerners - user clicks</li>
  <li>matching logic??? - comparison</li>
    <li>matched</li>
    <li>unmatched</li>
  <li>game over</li>
  <li>restart</li>
  <li>congradulations</li>
</ul>

### TYPESCRIPT

<ul>
  <li>interfaces + types</li>
    <li>variables</li>
    <li>function parameters</li>
    <li>return values</li>
    <li>classes</li>
  <li>DOM!</li>
</ul>

## PSEUDO-CODE

### HTML

// Define the game container //

<div class="game-container">
// Contains cards //
</div>
  // Game title //
  <h1>Memory Card Game</h1>
  
  // Grid to hold cards //
  <div class="grid-container"></div>

// message display //

  <div class="message"></div>
  // Match! or Try Again! //
  
  // Score display and restart button //
  <div class="score-container">
    <p>Score: <span id="score">0</span></p>
    <button id="restart-btn">Restart Game</button>
  </div>
</div>

### CSS/SCSS

// body styling //

body {
background-color: ${primary-color};
font-size:
// basic styling //
}

// Style the game container //

.game-container { // potentially an id? //
max-width: #px;
margin: #;
display: grid;
grid-template-columns: repeat(#, #fr);
gap: #px;
padding: #px;

}

// Style individual cards //

.card {
width: #px;
height: #px;
background-color: #ccc;
border-radius: #px;
perspective: #px; // For flip animation??? //

}

// Style front of card (face down) //
.card-front {
width: #px;
height: #px;
background-color: #ccc;
// hide back face?? //
}

// Style front of card (face up) //
.card-back {
width: #px;
height: #px;
background-color: #ccc;
// hide back face?? //
}

// Style when pair is matched //
// Card flipping animation //
// Style when pair isn't matched???? //

### JAVASCRIPT

// Class for single card //
// event listener //
// isflipped card //
// ismatched card //

// Do nothing if:
already flipped
alreadt matched //

// list of already flipped cards <- add to list //
// Check
if two cards are flipped  
 if two cards are matched//

// If cards match:
mark both as matched
clear the flipped cards list
check if all cards have been matched //

// If cards don't match:
flip both cards back to hidden
clear the flipped cards list //

// Create an array of data objects for each card, ensuring pairs //
//
If two cards are flipped:
Check for a match
If matched, mark them as matched
If not matched, flip them back (timed?)
Check for win condition //

// Check if all cards are marked as matched
If so, display a win message //

// resetGame:
Clear flipped cards
Reset matched state of all cards
Re-shuffle data
Re-do cards
Re-attach event listeners //

// overall game logic
Create card data array (duplicate values for pairs)
Shuffle card data array
Create Card objects based on the data
Store the array of Card objects
Attach event listeners to the card elements // game container??? //

### TYPESCRIPT
