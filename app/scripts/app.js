'use strict';

/**
 * @ngdoc overview
 * @name pnChatApp
 * @description
 * # pnChatApp
 *
 * Main module of the application.
 */
angular
  .module('pnChatApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pubnub.angular.service'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/join', {
        templateUrl: 'views/join.html',
        controller: 'JoinCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/join'
      });
  });
