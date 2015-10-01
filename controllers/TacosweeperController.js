tacosweeper.controller('TacosweeperCtrl', function TacosweeperCtrl($scope) {
  $scope.rowNum = 9;
  $scope.bombNum = 10;
  $scope.tacofield = createTacofield();
  $scope.emptySpots = [];

  $scope.uncoverSpot = function(spot) {
    spot.isCovered = false;
    if(hasWon($scope.tacofield)) {
      $scope.isWinMessageVisible = true;
    } else if(spot.content == "bomb") {
      //If revealed spot is a bomb, reveal all other bombs
        for(var y = 0; y < $scope.rowNum; y++ ) {
          for(var x = 0; x < $scope.rowNum; x++) {
            if($scope.tacofield.rows[y].spots[x].content == "bomb") {
              $scope.tacofield.rows[y].spots[x].isCovered = false;
            }
          }
        }
        //Display losing message
        $scope.isLostMessageVisible = true;

    } else if(spot.content == "empty") {
      //Reveal all spots around the clicked cell until a bomb is touching the spot
        $scope.emptySpots = [];
        var surroundingSpots = getSurroundingSpots($scope.tacofield, spot.coordinates[0], spot.coordinates[1]);
        revealSurrounding(surroundingSpots);
        var i = 0;
        while(i < $scope.emptySpots.length) {
          var currentSurroundingSpots = getSurroundingSpots($scope.tacofield, $scope.emptySpots[i].coordinates[0], $scope.emptySpots[i].coordinates[1]);
          revealSurrounding(currentSurroundingSpots);
          i++;
        }
    };
  };

//Change flagged property to display flag image
  $scope.flag = function(spot) {
    spot.isFlagged = true;
  }

//Create new new game by resetting the board
  $scope.newGame = function() {
    $scope.isWinMessageVisible = false;
    $scope.isLostMessageVisible = false;
    $scope.tacofield = createTacofield();
  }

//Reveal the surrounding spots of an empty spot
  function revealSurrounding(surroundingSpots) {
    surroundingSpots.forEach(function(showSpot) {
      if((showSpot.content=="empty") && (showSpot.isCovered == true)) {
        $scope.emptySpots.push(showSpot);
      }
      var row1 = showSpot.coordinates[0];
      var col1 = showSpot.coordinates[1];
      $scope.tacofield.rows[row1].spots[col1].isCovered = false;
    });
  }

//Create initial field
  function createTacofield() {
    var tacofield= {};
    tacofield.rows = [];

    //Add ability to change board size
    for(var i=0; i<$scope.rowNum; i++) {
      var row = {};
      row.spots = [];

      for(var j=0; j<$scope.rowNum; j++) {
        var spot = {};
        spot.isCovered = true;
        spot.content = "empty";
        spot.isFlagged = false;
        spot.coordinates = [i,j];
        row.spots.push(spot);
      }

      tacofield.rows.push(row);
    }

    placeManyRandomBombs(tacofield);
    calculateAllNumbers(tacofield);
    return tacofield;
  };

//Get properies of a certain spot
  function getSpot(tacofield, row, column) {
    return tacofield.rows[row].spots[column];
  };

//Place a bomb in a random spot that doesn't already have a bomb
  function placeRandomBomb(tacofield) {
    var row = Math.round(Math.random() * ($scope.rowNum -1));
    var column = Math.round(Math.random() * ($scope.rowNum -1));
    var spot = getSpot(tacofield, row, column);
    if(spot.content== 'bomb') {
      placeRandomBomb(tacofield)
    } else {
    spot.content ="bomb";
    }
  };

//Place bombNum number of bombs
  function placeManyRandomBombs(tacofield) {
    for(var i =0; i<$scope.bombNum; i++) {
      placeRandomBomb(tacofield);
    };
  };

//Returns array of surrounding spots from an empty spot
  function getSurroundingSpots(tacofield, row, column) {

      var thisSpot = getSpot(tacofield, row, column);

      var surroundingSpots = [];

      //check row above if this is not the first row
      if(row > 0) {
        //check column to the left if this is not the first column
        if(column > 0) {
          //get the spot above and to the left
          surroundingSpots.push(getSpot(tacofield, row - 1, column - 1));
        }

        //get the spot right above
        surroundingSpots.push(getSpot(tacofield, row -1, column));

        //check column to the right if this is not the last column
        if(column < ($scope.rowNum -1)) {
          //get the spot above and to the right
          surroundingSpots.push(getSpot(tacofield, row - 1, column + 1));
        }

      }

      // check column to the left if this is not the first column
      if(column > 0) {
          // get the spot to the left
          surroundingSpots.push(getSpot(tacofield, row, column - 1));
      }

      if (column < ($scope.rowNum -1) ) {
        // get the spot to the right
        surroundingSpots.push(getSpot(tacofield, row, column +1));
      }

      // check row below if it is not the last row
      if (row < ($scope.rowNum -1) ) {
       // check column to the left if this is not the first column
        if (column > 0) {
          // get the spot to the left
          surroundingSpots.push(getSpot(tacofield, row +1, column -1));
        }

       // get the spot right below
       surroundingSpots.push(getSpot(tacofield, row +1, column));

       // check column to the right if it is not the last column
       if (column < ($scope.rowNum -1) ) {
       // get the spot below and to the right
        surroundingSpots.push(getSpot(tacofield, row +1, column +1));
        }
      }

      return surroundingSpots;
    };

//Calculates number of bombs around a specific spot
  function calculateNumber(tacofield, row, column) {
    var thisSpot = getSpot(tacofield, row, column);

    //if this spot contains a mine then we can't place a number here
    if (thisSpot.content == "bomb") {
      return;
    }

    var bombCount = 0;

    //check row above if this is not the first row
    if(row > 0) {
      //check column to the left if this is not the first column
      if(column > 0) {
        //get the spot above and to the left
        var spot = getSpot(tacofield, row - 1, column - 1);
        if(spot.content == "bomb") {
          bombCount++;
        }
      }

      //get the spot right above
      var spot = getSpot(tacofield, row -1, column);
      if(spot.content == "bomb") {
        bombCount++;
      }

      //check column to the right if this is not the last column
      if(column < ($scope.rowNum -1)) {
        //get the spot above and to the right
        var spot = getSpot(tacofield, row - 1, column + 1);
        if(spot.content == "bomb") {
          bombCount++;
        }
      }

    }
    // check column to the left if this is no the first column
    if(column > 0) {
        // get the spot to the left
        var spot = getSpot(tacofield, row, column - 1);
        if(spot.content == "bomb") {
            bombCount++;
        }
    }

    if (column < ($scope.rowNum -1) ) {
      // get the spot to the right
      var spot = getSpot(tacofield, row, column +1);
      if (spot.content =="bomb") {
        bombCount++;
      }
  }

    // check row below if it is not the last row
    if (row < ($scope.rowNum -1) ) {
     // check column to the left if this is not the first column
      if (column > 0) {
        // get the spot to the left
        var spot = getSpot(tacofield, row +1, column -1);
        if (spot.content =="bomb") {
          bombCount++;
        }
      }
       // get the spot right below
     var spot = getSpot(tacofield, row +1, column);
     if (spot.content =="bomb") {
       bombCount++;
      }

     // check column to the right if it is not the last column
     if (column < ($scope.rowNum -1) ) {
     // get the spot below and to the right
       var spot = getSpot(tacofield, row +1, column +1);
       if (spot.content =="bomb") {
         bombCount++;
         }
      }
    }

    if (bombCount > 0 ) {
      thisSpot.content = bombCount;
    }
  };

  function calculateAllNumbers(tacofield) {
    for(var y = 0; y < $scope.rowNum; y++ ) {
        for(var x = 0; x < $scope.rowNum; x++) {
            calculateNumber(tacofield, x, y);
        }
    }
  };

  function hasWon(tacofield) {
    for(var y = 0; y < $scope.rowNum; y++ ) {
      for(var x = 0; x < $scope.rowNum; x++) {
        var spot = getSpot(tacofield, y, x);
        if(spot.isCovered && spot.content !="bomb") {
          return false;
        }
      }
    }
    return true;
  };
});
