tacosweeper.controller('TacosweeperCtrl', function TacosweeperCtrl($scope) {
  $scope.tacofield = createTacofield();
  $scope.emptySpots = [];
  $scope.uncoverSpot = function(spot) {
    spot.isCovered = false;
    if(hasWon($scope.tacofield)) {
      $scope.isWinMessageVisible = true;
      alert("You are a winner!");
    } else if(spot.content == "bomb") {
        for(var y = 0; y < 9; y++ ) {
          for(var x = 0; x < 9; x++) {
            if($scope.tacofield.rows[y].spots[x].content == "bomb") {
              $scope.tacofield.rows[y].spots[x].isCovered = false;
            }
          }
        }
        $scope.isLostMessageVisible = true;
    } else if(spot.content == "empty") {
        $scope.emptySpots = [];
        var surroundingSpots = getSurroundingSpots($scope.tacofield, spot.coordinates[0], spot.coordinates[1]);
        revealSurrounding(surroundingSpots);
        var i = 0;
        while(i < $scope.emptySpots.length) {
          var currentSurroundingSpots = getSurroundingSpots($scope.tacofield, $scope.emptySpots[i].coordinates[0], $scope.emptySpots[i].coordinates[1]);
          revealSurrounding(currentSurroundingSpots);
          i++;
        }

        // $scope.emptySpots.forEach(function(currentSpot) {
        //   var currentSurroundingSpots = getSurroundingSpots($scope.tacofield, currentSpot.coordinates[0], spot.coordinates[1]);
        //   revealSurrounding(currentSurroundingSpots);
        // });

        // Currently works (first two lines reveal squares around empty, next four lines reveal more)
        // var surroundingSpots = getSurroundingSpots($scope.tacofield, spot.coordinates[0], spot.coordinates[1]);
        // revealSurrounding(surroundingSpots);

        // surroundingSpots.forEach(function(currentSpot) {
        //   if(currentSpot.content == "empty") {
        //     var currentSurroundingSpots = getSurroundingSpots($scope.tacofield, currentSpot.coordinates[0], currentSpot.coordinates[1]);
        //     revealSurrounding(currentSurroundingSpots);
        //   currentSurroundingSpots.forEach(function(nextSpot) {
        //     if(nextSpot.content=="empty"){
        //       var nextSurroundingSpots = getSurroundingSpots($scope.tacofield, nextSpot.coordinates[0], nextSpot.coordinates[1]);
        //       revealSurrounding(nextSurroundingSpots);
        //     };
        //   });
        //   };
        // });


        // var surroundingSpots = getSurroundingSpots($scope.tacofield, spot.coordinates[0], spot.coordinates[1]);
        // surroundingSpots.forEach(function(showSpot) {
        //   var row = showSpot.coordinates[0];
        //   var col = showSpot.coordinates[1];
        //   $scope.tacofield.rows[row].spots[col].isCovered = false;

        // });
    };
  };

  $scope.flag = function(spot) {
    spot.isFlagged = true;
  }

  $scope.newGame = function() {
    $scope.isWinMessageVisible = false;
    $scope.isLostMessageVisible = false;
    $scope.tacofield = createTacofield();
  }

  function revealSurrounding(surroundingSpots) {
    surroundingSpots.forEach(function(showSpot) {
      if((showSpot.content=="empty") && (showSpot.isCovered == true)) {
        $scope.emptySpots.push(showSpot);
      }
      var row1 = showSpot.coordinates[0];
      var col1 = showSpot.coordinates[1];
      $scope.tacofield.rows[row1].spots[col1].isCovered = false;
      // if(showSpot.content=="empty") {
      //   $scope.emptySpots.push(showSpot);
      // }
      // if(showSpot.content == "empty") {
      //   var currentSurroundingSpots = getSurroundingSpots($scope.tacofield, showSpot.coordinates[0], showSpot.coordinates[1]);
      //   revealSurrounding(currentSurroundingSpots);
      // };
    });
  }

  function createTacofield() {
    var tacofield= {};
    tacofield.rows = [];

    //Add ability to change board size
    for(var i=0; i<9; i++) {
      var row = {};
      row.spots = [];

      for(var j=0; j<9; j++) {
        var spot = {};
        spot.isCovered = true;
        spot.content = "empty";
        spot.isFlagged = false;
        spot.coordinates = [i,j];
        row.spots.push(spot);
      }

      tacofield.rows.push(row);
    }

    placeManyRandomBombs(tacofield, 10);
    calculateAllNumbers(tacofield);
    return tacofield;
  };

  function getSpot(tacofield, row, column) {
    return tacofield.rows[row].spots[column];
  };

  function placeRandomBomb(tacofield) {
    var row = Math.round(Math.random() * 8);
    var column = Math.round(Math.random() * 8);
    var spot = getSpot(tacofield, row, column);
    if(spot.content== 'bomb') {
      placeRandomBomb(tacofield)
    } else {
    spot.content ="bomb";
    }
  };

  function placeManyRandomBombs(tacofield, bombNum) {
    for(var i =0; i<bombNum; i++) {
      placeRandomBomb(tacofield);
    };
  };

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
        if(column < 8) {
          //get the spot above and to the right
          surroundingSpots.push(getSpot(tacofield, row - 1, column + 1));
        }

      }

      // check column to the left if this is not the first column
      if(column > 0) {
          // get the spot to the left
          surroundingSpots.push(getSpot(tacofield, row, column - 1));
      }

      if (column < 8 ) {
        // get the spot to the right
        surroundingSpots.push(getSpot(tacofield, row, column +1));
      }

      // check row below if it is not the last row
      if (row < 8 ) {
       // check column to the left if this is not the first column
        if (column > 0) {
          // get the spot to the left
          surroundingSpots.push(getSpot(tacofield, row +1, column -1));
        }

       // get the spot right below
       surroundingSpots.push(getSpot(tacofield, row +1, column));

       // check column to the right if it is not the last column
       if (column < 8 ) {
       // get the spot below and to the right
        surroundingSpots.push(getSpot(tacofield, row +1, column +1));
        }
      }

      return surroundingSpots;
    };

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
      if(column < 8) {
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

    if (column < 8 ) {
      // get the spot to the right
      var spot = getSpot(tacofield, row, column +1);
      if (spot.content =="bomb") {
        bombCount++;
      }
  }

    // check row below if it is not the last row
    if (row < 8 ) {
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
     if (column < 8 ) {
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
    for(var y = 0; y < 9; y++ ) {
        for(var x = 0; x < 9; x++) {
            calculateNumber(tacofield, x, y);
        }
    }
  };

  function hasWon(tacofield) {
    for(var y = 0; y < 9; y++ ) {
      for(var x = 0; x < 9; x++) {
        var spot = getSpot(tacofield, y, x);
        if(spot.isCovered && spot.content !="bomb") {
          return false;
        }
      }
    }
    return true;
  };
});
