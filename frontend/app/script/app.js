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
      .state('gallery.example3', {
        url: '/example3',
        templateUrl: 'view/example3.html',
        controller: 'example3Ctrl'
      })
      .state('gallery.example4', {
        url: '/example4',
        templateUrl: 'view/example4.html',
        controller: 'example4Ctrl'
      })
      .state('gallery.lensFlare', {
        url: '/lensflare',
        templateUrl: 'view/lensflare.html',
        controller: 'lensFlareCtrl'
      })
      .state('gallery.particleSystem', {
        url: '/particle',
        templateUrl: 'view/particleSystem.html',
        controller: 'particleSystemCtrl'
      })
      .state('gallery.finalExample', {
        url: '/final',
        templateUrl: 'view/finalExample.html',
        controller: 'finalExampleCtrl'
      }).state('gallery.sky', {
        url: '/sky',
        templateUrl: 'view/sky.html',
        controller: 'skyCtrl'
      })
  });
