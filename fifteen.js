//Global variables used with the time and move count
var moveCount = 0;
var offset;
var clock;
var interval;

window.onload = function(e){

  //Initialization of the different elements used to modify html document
  var heading = document.getElementsByTagName("h1");
  var puzzleArea = document.getElementById("puzzlearea");
  var puzzlePieces = puzzleArea.getElementsByTagName("div");
  var shuffleButton = document.getElementById("shufflebutton");

  var self = this;
  var setup = false;
  var timer = createTimer();
  var options = {};
  
  //Used to refresh the display every millisecond to avoid move count inaccuracy.
  options.delay = 1;
  
  //Appends span contianing move counter and timer to the heading 
  heading[0].appendChild(timer);

  //Calls setup function is the playing area has not yet be set up
  if (!setup){
    var playingArea = self.setup();
  }

  //Checks if any of the puzzle pieces have been clicked
  for( var count = 0; count < puzzlePieces.length; count++){

    puzzlePieces[count].onclick = function(element){

      //Checks if puzzle piece can be moved
      if ( element.target.className == "puzzlepiece movablepiece"){

        moveCount++;
        playingArea = self.moveElement(playingArea, element.target.innerHTML);
      }
    }
  }

  //Shuffles playing area whens shuffle button is pressed and starts timer
  shuffleButton.onclick = function(){

    playingArea =  shufflePlayingArea(playingArea);
    resetTimer();
    startTimer();
  }

  //Function used to start timer
  function startTimer() {
    
    if (!interval) {
      offset = Date.now();
      interval = setInterval(update, options.delay);
    }
  }

  //Function used to increment timer
  function update() {
    clock += delta();
    displayTimer();
  }

  function displayTimer() {
    timer.innerHTML = "<br>Moves: " + moveCount + "<br> Elapsed Time: " + parseInt(clock/1000) + " second(s)";
  }

  //Function used to reset timer
  function resetTimer() {
  clock = 0;
  displayTimer();
  }

  //Helper function used to increment timer
  function delta() {
    var now = Date.now(),
        d   = now - offset;

    offset = now;
    return d;
  }
}

/*
 *  This function is used for the initial set up of the playing area.
 *  The playing area starts in the completed arangement with the blank
 *  space at the bottom right.
 */
function setup(){

  //Initialization of the different elements used to modify html document
  var puzzleArea = document.getElementById("puzzlearea");
  var puzzlePieces = puzzleArea.getElementsByTagName("div");

  var backgroundCordinateY = 0;
  var backgroundCordinateX = 0;

  for( var count = 0; count < puzzlePieces.length; count++){

    puzzlePieces[count].setAttribute("class", "puzzlepiece");
    puzzlePieces[count].style.position = "relative";
    puzzlePieces[count].style.float = "left";
    puzzlePieces[count].style.backgroundPosition = backgroundCordinateX + "px " + backgroundCordinateY + "px";
    puzzlePieces[count].style.top = "0px";
    puzzlePieces[count].style.right = "0px";
    puzzlePieces[count].style.bottom = "0px";
    puzzlePieces[count].style.left = "0px";

    //Condition used to vary X & Y cordinates to properly display background picture
    if (backgroundCordinateX != -300 ){

      backgroundCordinateX -= 100;

    }
    else{

      backgroundCordinateX = 0;
      backgroundCordinateY -= 100;

     }
  }

  //Initializes movable pieces of the puzzle.
  puzzlePieces[11].setAttribute("class", "puzzlepiece movablepiece");
  puzzlePieces[14].setAttribute("class", "puzzlepiece movablepiece");

  
  //Returns initial layout of the playing Area, the relative positions of each Puzzle Piece
  return [  [null,2,5,null], [null,3,6,1], [null,4,7,2], [null,null,8,3], 
            [1,6,9,null], [2,7,10,5], [3,8,11,6], [4,null,12,7], 
            [5,10,13,null], [6,11,14,9], [7,12,15,10], [8,null,16,11], 
            [9,14,null,null], [10,15,null,13], [11,16,null,14], [12,null,null,15] 
          ];
}

/*
 *  Fuction used to move an element, accepts the Current playing area layout
 *  and the puzzle piece to be moved (the numer on the puzzle piece)
 *  returns the modified playing area.
 */
function moveElement(playingArea, element) {

  //Initialization of the different elements used to modify html document
  var puzzleArea = document.getElementById("puzzlearea");
  var puzzlePieces = puzzleArea.getElementsByTagName("div");

  //Conditions that check the directions in which the puzzle piece can be moved
  if(playingArea[element - 1][0] == 16){
      
   return movePieceUp(playingArea, element, puzzlePieces);
  }
  else if(playingArea[element - 1][1] == 16){
      
    return movePieceRight(playingArea, element, puzzlePieces);
  }
  else if(playingArea[element - 1][2] == 16){
      
    return movePieceDown(playingArea, element, puzzlePieces);
  }
  else if(playingArea[element - 1][3] == 16){

    return movePieceLeft(playingArea, element, puzzlePieces);
  }
}

/*
 *  Function used to adjust the puzzle pieces that are movable.
 *  Adds class that makes them highlight on hover. 
 *  Accepts the array of the tiles surrounding the blank space.
 */
function fixMovability(blankCell){

  //Initialization of the different elements used to modify html document
  var puzzleArea = document.getElementById("puzzlearea");
  var puzzlePieces = puzzleArea.getElementsByTagName("div");

  //Makes all puzzle pieces regular pieces
  for( var count = 0; count < puzzlePieces.length; count++){

    puzzlePieces[count].setAttribute("class", "puzzlepiece");
  }

  //Makes movable puzzle pieces movable
  for (var count = 0; count < blankCell.length; count++){

    if(blankCell[count] != null){
      puzzlePieces[blankCell[count]-1].setAttribute("class", "puzzlepiece movablepiece");
    }
  }
}

/*
 * Function used to move a Puzzle Piece Down. Accepts the Playing Area, Puzzle Piece Number
 * and array of puzzle pieces, return the new playing area. 
*/
function movePieceDown(playingArea, element, puzzlePieces){

  // Retrives the offset value of piece from the top margin
  var topVal = parseInt(puzzlePieces[element - 1].style.top, 10);

  //Increases the distance from the margin by 100px
  puzzlePieces[element - 1].style.top = (topVal + 100) + "px"; 

  
  //Modifies layout of tiles in the Playing Area
  if ( playingArea[element - 1][0] != null){ playingArea[playingArea[element - 1][0] -1][2] = 16 }

  if ( playingArea[element - 1][1] != null){ playingArea[playingArea[element - 1][1] -1][3] = 16 }

  if ( playingArea[element - 1][3] != null){ playingArea[playingArea[element - 1][3] -1][1] = 16 }

      
  if ( playingArea[16 - 1][1] != null){ playingArea[playingArea[16 - 1][1] -1][3] = playingArea[16 - 1][0] }

  if ( playingArea[16 - 1][2] != null){ playingArea[playingArea[16 - 1][2] -1][0] = playingArea[16 - 1][0] }

  if ( playingArea[16 - 1][3] != null){ playingArea[playingArea[16 - 1][3] -1][1] = playingArea[16 - 1][0] }      

  var swap = playingArea[element - 1];

  playingArea[element - 1] = playingArea[15];

  playingArea[element - 1][0] = 16;

  playingArea[15] = swap; 

  playingArea[15][2] = parseInt(element, 10);

  fixMovability(playingArea[15]);

  return playingArea;
}

/*
 * Function used to move a Puzzle Piece Up. Accepts the Playing Area, Puzzle Piece Number
 * and array of puzzle pieces, return the new playing area. 
*/
function movePieceUp(playingArea, element, puzzlePieces){

  // Retrives the offset value of piece from the top margin
  var topVal = parseInt(puzzlePieces[element - 1].style.top, 10);
  
  //Decreases the distance from the margin by 100px
  puzzlePieces[element - 1].style.top = (topVal - 100) + "px"; 

  //Modifies layout of tiles in the Playing Area
  if ( playingArea[element - 1][2] != null){ playingArea[playingArea[element - 1][2] -1][0] = 16 }

  if ( playingArea[element - 1][1] != null){ playingArea[playingArea[element - 1][1] -1][3] = 16 }

  if ( playingArea[element - 1][3] != null){ playingArea[playingArea[element - 1][3] -1][1] = 16 }

      
  if ( playingArea[16 - 1][1] != null){ playingArea[playingArea[16 - 1][1] -1][3] = playingArea[16 - 1][2] }

  if ( playingArea[16 - 1][0] != null){ playingArea[playingArea[16 - 1][0] -1][2] = playingArea[16 - 1][2] }

  if ( playingArea[16 - 1][3] != null){ playingArea[playingArea[16 - 1][3] -1][1] = playingArea[16 - 1][2] }  


  var swap = playingArea[element -1];

  playingArea[element - 1] = playingArea[15];

  playingArea[element - 1][2] = 16;

  playingArea[15] = swap; 

  playingArea[15][0] = parseInt(element, 10);

  fixMovability(playingArea[15]);

  return playingArea;
}

/*
 * Function used to move a Puzzle Piece to the Right. Accepts the Playing Area, Puzzle Piece Number
 * and array of puzzle pieces, return the new playing area. 
*/
function movePieceRight(playingArea, element, puzzlePieces){

  //Retrives the offset value of piece from the left margin
  var leftVal = parseInt(puzzlePieces[element - 1].style.left, 10);
  
  //Increases the distance from the margin by 100px
  puzzlePieces[element - 1].style.left = (leftVal + 100) + "px"; 

  
  //Modifies layout of tiles in the Playing Area
  if ( playingArea[element - 1][0] != null){ playingArea[playingArea[element - 1][0] -1][2] = 16 }

  if ( playingArea[element - 1][2] != null){ playingArea[playingArea[element - 1][2] -1][0] = 16 }

  if ( playingArea[element - 1][3] != null){ playingArea[playingArea[element - 1][3] -1][1] = 16 }

      
  if ( playingArea[16 - 1][0] != null){ playingArea[playingArea[16 - 1][0] -1][2] = playingArea[16 - 1][3] }

  if ( playingArea[16 - 1][1] != null){ playingArea[playingArea[16 - 1][1] -1][3] = playingArea[16 - 1][3] }

  if ( playingArea[16 - 1][2] != null){ playingArea[playingArea[16 - 1][2] -1][0] = playingArea[16 - 1][3] } 
  

  var swap = playingArea[element - 1];
  
  playingArea[element - 1] = playingArea[15];

  playingArea[element - 1][3] = 16;

  playingArea[15] = swap; 

  playingArea[15][1] = parseInt(element, 10);

  self.fixMovability(playingArea[15]);

  return playingArea;
}

/*
 * Function used to move a Puzzle Piece to the Left. Accepts the Playing Area, Puzzle Piece Number
 * and array of puzzle pieces, return the new playing area. 
*/
function movePieceLeft(playingArea, element, puzzlePieces){

  //Retrives the offset value of piece from the left margin
  var leftVal = parseInt(puzzlePieces[element - 1].style.left, 10);
  
  //Increases the distance from the margin by 100px
  puzzlePieces[element - 1].style.left = (leftVal - 100) + "px"; 


  //Modifies layout of tiles in the Playing Area
  if ( playingArea[element - 1][0] != null){ playingArea[playingArea[element - 1][0] -1][2] = 16 }

  if ( playingArea[element - 1][1] != null){ playingArea[playingArea[element - 1][1] -1][3] = 16 }

  if ( playingArea[element - 1][2] != null){ playingArea[playingArea[element - 1][2] -1][0] = 16 }

      
  if ( playingArea[16 - 1][0] != null){ playingArea[playingArea[16 - 1][0] -1][2] = playingArea[16 - 1][1] }

  if ( playingArea[16 - 1][2] != null){ playingArea[playingArea[16 - 1][2] -1][0] = playingArea[16 - 1][1] }

  if ( playingArea[16 - 1][3] != null){ playingArea[playingArea[16 - 1][3] -1][1] = playingArea[16 - 1][1] } 
  
  var swap = playingArea[element - 1];
  
  playingArea[element - 1] = playingArea[15];

  playingArea[element - 1][1] = 16;

  playingArea[15] = swap; 

  playingArea[15][3] = parseInt(element, 10);

  fixMovability(playingArea[15]);

  return playingArea;
}

/*
 *  Function used to suffle the Playing Area. Accepts playing area
 *  and returns the modifies Playing Area.
 */
function shufflePlayingArea(playingArea){

  //Generates a random integer
  var randomInt = Math.floor((Math.random() * 4));

  //Uses Fifty moves to shuffle the board
  for ( var count = 0; count < 50; count++){

    /*
     *  Loops until a movable piece is selected, for efficiency pieces are selected from the sides
     *  of the blank tile.
    */
    while(playingArea[15][randomInt] == null){ randomInt = Math.floor((Math.random() * 4))}

    playingArea = moveElement(playingArea, playingArea[15][randomInt]);

    randomInt = Math.floor((Math.random() * 4));

  }

  //Resets move counter
  moveCount = 0;

  return playingArea;
}

/*
 *  Used to create span which houses move counter and timer
 */
function createTimer() {
  return document.createElement("span");
}























