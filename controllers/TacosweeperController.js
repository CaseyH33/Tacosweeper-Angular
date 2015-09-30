tacosweeper.controller('TacosweeperCtrl', function TacosweeperCtrl($scope) {
  $scope.tacofield = createTacofield();

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
        spot.content = "empty"; // new
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
    //Check if spot already is a bomb
    spot.content ="bomb";
  };

  function placeManyRandomBombs(tacofield, bombNum) {
    for(var i =0; i<bombNum; i++) {
      placeRandomBomb(tacofield);
    };
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
  }

  function calculateAllNumbers(tacofield) {
    for (var y = 0; y < 9; y++ ) {
        for(var x = 0; x < 9; x++) {
            calculateNumber(tacofield, x, y);
        }
    }
  }
});
