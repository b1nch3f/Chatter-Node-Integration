var app = angular.module('app', []);

app.controller('MainCtrl', function($scope, $http){
    $scope.postToChatter = function(chatterData) {
        console.log(chatterData);

        // Create new lead
        $http({method: 'GET', url: 'http://localhost:3000/createlead?firstname=max&lastname=muller&company=google&email=sangram@marvel.com'}).
            success(function(data, status, headers, config) {
                console.log(data);
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
    }

    $scope.fetchChatterData = function() {
        var commentBy, comment;
        // Fetch chatter posts
        $http({method: 'GET', url: 'http://localhost:3000/getfeed'}).
            success(function(data, status, headers, config) {
                console.log(data);
                //console.log(data.elements.length);
                //console.log(data.elements[0].body.text);
                for(var start = 0; start < data.elements.length & data.elements[start].body.text != null ; start++) {
                    console.log(data.elements[start].actor.displayName);
                    commentBy = data.elements[start].actor.displayName;
                    console.log(data.elements[start].body.text);
                    comment = data.elements[start].body.text;

                    // Append to list
                    $(".comments").append('<ul class="list-group"><li class="list-group-item commentBy">'+commentBy+'</li><li class="list-group-item comment">'+comment+'</li></ul>');
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
    }
});
