angular
  .module('galleryCtrl', ['successService', 'logService'])
  .controller('galleryController', [
    '$rootScope',
    '$location',
    '$sce',
    '$routeParams',
    '$window',
    'Success',
    'Log',
    function (
      $rootScope,
      $location,
      $sce,
      $routeParams,
      $window,
      Success,
      Log
    ) {
      var vm = this;
      vm.galleryData = [];
      var galleryItem = {};
      var galleryCount = 0;

      Log.logEntry('Inside the galleryController');

      Success.all().success(function (data) {
        for (i = 0; i < data.length; i++) {
          vm.picturePresent = false;

          if (data[i].type === 'gallery') {
            galleryCount++;

            if (data[i].picture) {
              vm.picturePresent = true;
            }

            galleryItem = {
              id: data[i]._id,
              picture: data[i].picture,
              picturePresent: vm.picturePresent,
              articleDate: { value: new Date(data[i].articleDate) },
            };

            vm.galleryData.push(galleryItem);
          }
        }

        Log.logEntry('gallery count ' + galleryCount);
      });
    },
  ]);
