tacosweeper.controller('TacosweeperCtrl', function TacosweeperCtrl($scope) {
  $scope.tacofield = createTacofield();

  function createTacofield() {
    var tacofield= {};
    tacofield.rows = [];

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

    placeRandomBomb(tacofield);

    return tacofield;
  };

  function getSpot(tacofield, row, column) {
    return tacofield.rows[row].spots[column];
  };

  function placeRandomBomb(tacofield) {
    var row = Math.round(Math.random() * 8);
    var column = Math.round(Math.random() * 8);
    var spot = getSpot(tacofield, row, column);
    spot.content ="bomb";
  };


});
