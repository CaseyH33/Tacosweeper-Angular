tacosweeper.directive("showSpot", function() {
  return  {
    template: '
      <img ng-if="spot.isCovered" src="css/images/covered.png">
      <img ng-if="!spot.isCovered  && spot.content == 'empty' " src="css/images/empty.png">
      <img class="bomb" ng-if="!spot.isCovered && spot.content == 'bomb' " src="css/images/trump.jpg">
      <img ng-if="!spot.isCovered && spot.content == 1" src="css/images/number-1.png">
      <img ng-if="!spot.isCovered && spot.content == 2" src="css/images/number-2.png">
      <img ng-if="!spot.isCovered && spot.content == 3" src="css/images/number-3.png">
      <img ng-if="!spot.isCovered && spot.content == 4" src="css/images/number-4.png">
      <img ng-if="!spot.isCovered && spot.content == 5" src="css/images/number-5.png">
      <img ng-if="!spot.isCovered && spot.content == 6" src="css/images/number-6.png">
      <img ng-if="!spot.isCovered && spot.content == 7" src="css/images/number-7.png">
      <img ng-if="!spot.isCovered && spot.content == 8" src="css/images/number-8.png">'
  }
})
