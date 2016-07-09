'use strict';

/**
 * @ngdoc function
 * @name pnChatApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pnChatApp
 */
angular.module('pnChatApp')
  .controller('MainCtrl',['$scope','$rootScope','$location','PubNub',
        function ($scope,$rootScope,$location,PubNub) {

            console.log('Main Ctrl ');
            var _ref;
            if(!PubNub.initialized()){
                $location.path('/join');
            }

            $scope.controlChannel = '__controlChannel';
            $scope.channels = [];


            //Publish Chat
            $scope.publish = function() {
                if (!$scope.selectedChannel) {
                    return;
                }
                PubNub.ngPublish({
                    channel: $scope.selectedChannel,
                    message: {
                        text: $scope.newMessage,
                        user: $scope.data.username,
                        date: moment().format('MMMM Do YYYY, h:mm:ss a')
                    }
                });
                return $scope.newMessage = '';
            };
    
            









            //Create Channel

            $scope.createChannel = function () {
                var channel;
                console.log('Creating channel...');
                channel = $scope.newChannel;

                $scope.newChannel ='';

                PubNub.ngGrant({
                    channel : channel,
                    read : true,
                    write : true,
                    callback : function () {
                        return console.log(channel + 'All set',arguments);
                    }
                });



                PubNub.ngGrant({
                    channel : channel+'-'+'pnpres',
                    read : true,
                    write : false,
                    callback : function () {
                        return console.log(channel + 'Presence All set',arguments);
                    }
                });

                PubNub.ngPublish({
                    channel :$scope.controlChannel,
                    message:channel
                });

                return setTimeout(function () {
                    $scope.subscribe(channel);
                    return $scope.showCreate = false;
                },100);

            };
            
            
            $scope.subscribe = function (channel) {
                var _ref;


                console.log('Subscribing ... ');
                if(channel === $scope.selectedChannel){
                    return;
                }
                if($scope.selectedChannel){
                    PubNub.ngUnsubscribe({
                        channel :$scope.selectedChannel
                    });
                }

                $scope.selectedChannel = channel;

                $scope.messages = ['Welcome To ' + channel];








                PubNub.ngSubscribe({
                    channel:$scope.selectedChannel,
                    state:{
                        "city":((_ref=$rootScope.data) != null ? _ref.city : void 0) || 'unknown'

                    },
                    error: function () {
                        return console.log(arguments);
                    }
                });


                $rootScope.$on(PubNub.ngPrsEv($scope.selectedChannel), function (ngEvent,payload) {
                    return $scope.$apply(function () {
                        var newData,userData;
                        userData = PubNub.ngPresenceData($scope.selectedChannel);
                        newData = {};
                        $scope.users = PubNub.map(PubNub.ngListPresence($scope.selectedChannel), function (x) {
                            var newX;
                            newX = x;
                            if(x.replace){
                                newX = x.replace(/\w+__/,"");
                            }
                            if(x.uuid){
                                newX = x.uuid.replace(/\w+__/,"");
                            }
                            newData[newX] = userData[x] || {};
                            return newX;
                        });
                        return $scope.getUserData = newData;
                    });
                });


                    PubNub.ngHereNow({
                        channel : $scope.selectedChannel
                    });


                    $rootScope.$on(PubNub.ngMsgEv($scope.selectedChannel), function (ngEvent,payload) {
                        var msg = {
                            message :'',
                            user:'',
                            date:''

                        };

                            msg.message = payload.message.text;
                            msg.user = payload.message.user;
                        console.log(payload.message.date);

                        msg.date = moment(payload.message.date, "MMMM Do YYYY, h:mm:ss a").fromNow();

                        return $scope.$apply(function () {



                            return $scope.messages.unshift(msg);

                        });
                    });

                return PubNub.ngHistory({
                    channel:$scope.selectedChannel,
                    auth_key:$scope.authKey,
                    count:500
                });
            }



            PubNub.ngSubscribe({
                channel: $scope.controlChannel
            });
            $rootScope.$on(PubNub.ngMsgEv($scope.controlChannel), function(ngEvent, payload) {
                return $scope.$apply(function() {
                    if ($scope.channels.indexOf(payload.message) < 0) {
                        return $scope.channels.push(payload.message);
                    }
                });
            });
            return PubNub.ngHistory({
                channel: $scope.controlChannel,
                count: 500
            });
            $scope.newChannel  = 'TheWaitingRoom';
            return $scope.createChannel();




        }]);
