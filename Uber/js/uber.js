//Final code for angular
var app = angular.module("app", []);  

app.controller('fooCtrl', function($scope,$interval){
  var userLatitude= 0; var userLongitude = 0;
    var timer;
  $scope.nearme = function($scope,$interval) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

                userLatitude = position.coords.latitude; 
                userLongitude = position.coords.longitude;
                if(angular.isUndefined(timer))
                { 
                  var promise=$interval(function(){
	  getEstimatesForUserLocation(userLatitude, userLongitude);
                 }, 60000)
               getEstimatesForUserLocation(userLatitude, userLongitude);
          }
        });
        
    }
}

function getEstimatesForUserLocation(userLatitude, userLongitude){
console.log("Requesting updated time estimate...");

    var request = $http({
                    method: "post",
                    url: "https://api.uber.com/v1/estimates/price",
                   headers: {
    	Authorization: "Token " + uberServerToken
                },
                data: { 
    	start_latitude: latitude,
    	start_longitude: longitude,
    	end_latitude: partyLatitude,
    	end_longitude: partyLongitude
                }
                }).success(
                    function( response ) {
                        console.log(JSON.stringify(response));
                        // 'results' is an object with a key containing an Array
    	   var data = response["prices"]; 

                 if (angular.isObject(data)) {
    		// Sort Uber products by time to the user's location 
    		data.sort(function(t0, t1) {
    			return t0.duration - t1.duration;
    		});

    		// Update the Uber button with the shortest time
    		var shortest = data[0];
    		if (!angular.isObject(shortest)) {
    			console.log("Updating time estimate...");
					$("#time").html("IN " + Math.ceil(shortest.duration / 60.0) + " MIN");
    		}
    	}
    
  });
