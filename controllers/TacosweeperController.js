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
        row.spots.push(spot);
      }

      tacofield.rows.push(row);
    }

    return tacofield;
  };
});
