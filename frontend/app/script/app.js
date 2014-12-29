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
      .state('gallery.example1', {
        url: '/example1',
        templateUrl: 'view/example1.html',
        controller: 'example1Ctrl'
      })
      .state('gallery.example2', {
        url: '/example2',
        templateUrl: 'view/example2.html',
        controller: 'example2Ctrl'
      })
  });
