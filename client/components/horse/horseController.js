angular
  .module('horseCtrl', ['horseService', 'logService'])
  .controller('horseController', [
    '$rootScope',
    '$location',
    '$sce',
    '$routeParams',
    '$window',
    'Horse',
    'Log',
    function ($rootScope, $location, $sce, $routeParams, $window, Horse, Log) {
      var vm = this;
      vm.horseData = [];
      var horseItem = {};

      Log.logEntry('Inside the horseController');

      var absUrl = $location.absUrl();
      const baseIdx = absUrl.indexOf('horse');
      const baseUrl = absUrl.slice(0, baseIdx);

      /*************************************************************************/
      /* Add a horse article */
      /*************************************************************************/
      vm.togglePdf = function (horseId) {
        const horseIdx = vm.horseData.findIndex((x) => x.id === horseId);

        if (horseIdx > -1) {
          vm.horseData[horseIdx].displayPdf = !vm.horseData[horseIdx]
            .displayPdf;
        }
      };

      /*************************************************************************/
      /* Get all Horses */
      /*************************************************************************/
      Horse.all().success(function (data) {
        Log.logEntry('back from getting all horses ');
        //console.log('data = ', data);
        for (i = 0; i < data.length; i++) {
          vm.picturePresent = false;

          //if (data[i].type === 'success') {
          if (data[i].picture) {
            vm.picturePresent = true;
          }

          const urlPath = baseUrl + 'api/horse/';

          //Mark the string as guaranteed html for angular
          videoLink = $sce.trustAsResourceUrl(data[i].videolocation);

          horseItem = {
            id: data[i]._id,
            title: data[i].title,
            lot: data[i].lot,
            line2: data[i].line2,
            line3: data[i].line3,
            videolocation: videoLink,
            documentlocation: data[i].documentlocation,
            description: data[i].description,
            picture: data[i].picture,
            picturePresent: vm.picturePresent,
            born: { value: new Date(data[i].articleDate) },
            streamdocument: urlPath + data[i]._id + '/streamdocument',
            displayPdf: false,
            //urlLink: urlLink,
            //videourl: `http://localhost:8083/api/horse/${data[i]._id}/streamvideo`,
          };

          // if (data[i].documentlocation) {
          //   console.log('doc available for horse ', data[i].title);
          //   vm.streamdocument = urlPath + data[i]._id + '/streamdocument';
          // }

          //Log.logEntry(`horse vid ${data[i].videolocation}`);

          vm.horseData.push(horseItem);
        }
      });
    },
  ]);
