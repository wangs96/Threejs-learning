'use strict';

angular.module('three', ['ui.router']).
  config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'view/home.html',
        controller: 'homeCtrl'
      })
      .state('gallery', {
        url: '/gallery',
        abstract: true,
        template: '<ui-view></ui-view>'
      })
      .state('gallery.test1', {
        url: '/test1',
        templateUrl: 'view/test1.html',
        controller: 'test1Ctrl'
      })
      .state('gallery.test2', {
        url: '/test2',
        templateUrl: 'view/test2.html',
        controller: 'test2Ctrl'
      })
  });
