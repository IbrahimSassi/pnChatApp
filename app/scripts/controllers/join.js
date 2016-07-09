'use strict';

/**
 * @ngdoc function
 * @name pnChatApp.controller:JoinCtrl
 * @description
 * # JoinCtrl
 * Controller of the pnChatApp
 */
angular.module('pnChatApp')

  .controller('JoinCtrl',['$scope','$rootScope','$location','PubNub', function ($scope,$rootScope,$location,PubNub) {
    console.log('Join Ctrl Initialized');
    $scope.data ={
      username:'User_' + Math.floor(Math.random()*1000)  
    };
    
    $scope.join = function(){
        console.log('joining');
        var _ref,_ref1;
        $rootScope.data || ($rootScope.data ={});
        $rootScope.data.username = (_ref = $scope.data) != null ?_ref.username : void 0;
        $rootScope.data.city = (_ref1 = $scope.data) != null ?_ref1.city : void 0;
        $rootScope.data.uuid = Math.floor(Math.random() * 1000000) + '__' +$scope.data.username;
        console.log($rootScope);
        
        PubNub.init({
            subscribe_key :'Your Subscribe Key',
            publish_key:'Your Publish Key',
            uuid:$rootScope.data.uuid
        });
        
        return $location.path('/main');
    }
}]);
