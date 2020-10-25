angular
  .module('maintHorseCtrl', [
    'authService',
    'horseService',
    'logService',
    'ngFileUpload',
  ])
  .controller('maintHorseController', [
    '$rootScope',
    '$location',
    '$routeParams',
    '$window',
    'Auth',
    'Horse',
    'Upload',
    'Log',
    function (
      $rootScope,
      $location,
      $routeParams,
      $window,
      Auth,
      Horse,
      Upload,
      Log
    ) {
      var vm = this;
      var horseId = '';

      vm.updateButton = true;
      vm.showDeleteSection = false;
      vm.addButton = false;
      vm.deleteButton = true;
      vm.closeButton = true;

      vm.articleDate = {};

      vm.errorType = 'Error!';
      vm.error = '';
      vm.feedback = '';

      Log.logEntry('Inside the maintHorseController');

      vm.loggedIn = Auth.isLoggedIn();

      var absUrl = $location.absUrl();
      const baseIdx = absUrl.indexOf('maintHorse');
      const baseUrl = absUrl.slice(0, baseIdx);

      //Re-direct to login page if user no logged in
      if (vm.loggedIn === false) {
        $location.path('/login');
      } else {
        //If a horseId is passed in the get the details of it

        if ($routeParams.horseId !== 'x') {
          vm.horseId = $routeParams.horseId;

          //Now get the horse details for this article
          Log.logEntry(
            'Now get the horse details for this article ' + vm.horseId
          );

          Horse.get(vm.horseId)
            .success(function (data) {
              vm.article = data;

              //'http://localhost:8083/api/horse/'
              const urlPath = baseUrl + 'api/horse/';

              if (data.horseDocAvailable) {
                vm.streamdocument = urlPath + data._id + '/streamdocument';
              }

              if (data.documentlocation && !data.horseDocAvailable) {
                vm.error = 'The document is missing';
              }

              vm.articleDate = { value: new Date(data.articleDate) };
            })
            .error(function () {});
        } else {
          //Default new article date to today
          vm.articleDate = { value: new Date() };

          //TURN OFF UPDATE AND DELETE BUTTONS AND LEAVE ON ADD BUTTON
          vm.updateButton = false;
          vm.addButton = true;
          vm.deleteButton = false;
        }
      }

      /*************************************************************************/
      /* Add a horse article */
      /*************************************************************************/
      vm.addHorse = function () {
        vm.error = '';
        vm.feedback = '';

        Log.logEntry('trying to add a horse');

        //VALIDATE FORM
        if (!vm.article.title) {
          vm.error = 'A article title must be supplied';
          return;
        }

        var articletData = {
          articleDate: vm.articleDate.value,
          title: vm.article.title,
          lot: vm.article.lot,
          line2: vm.article.line2,
          line3: vm.article.line3,
          videolocation: vm.article.videolocation,
          documentlocation: vm.article.documentlocation,
          description: vm.article.description,
        };

        if (vm.article.picture) {
          articletData.picture = vm.article.picture;
        }

        Horse.create(articletData).success(function (data) {
          if (data.success === true) {
            vm.feedback = 'Article added';
            $location.path('/maintContent/horse');
          } else {
            vm.error = data.message;
          }
        });
      };

      /*************************************************************************/
      /* Update a horse article */
      /*************************************************************************/
      vm.updateHorse = function () {
        vm.error = '';
        vm.feedback = '';

        //VALIDATE FORM
        if (!vm.articleDate.value) {
          vm.error = 'A article date must be supplied';
          return;
        }

        if (!vm.article.title) {
          vm.error = 'A article title must be supplied';
          return;
        }

        Log.logEntry(`updated description = ${vm.article.documentlocation}`);

        var articletData = {
          articleDate: vm.articleDate.value,
          lot: vm.article.lot,
          title: vm.article.title,
          line2: vm.article.line2,
          line3: vm.article.line3,
          videolocation: vm.article.videolocation,
          documentlocation: vm.article.documentlocation,
          description: vm.article.description,
        };

        if (vm.article.picture) {
          articletData.picture = vm.article.picture;
        }

        Horse.update(vm.horseId, articletData).success(function (data) {
          if (data.success === true) {
            vm.feedback = 'Article updated';
            $location.path('/maintContent/horse');
          } else {
            vm.error = data.message;
          }
        });
      };

      /*************************************************************************/
      /* Delete confirmation section */
      /*************************************************************************/
      vm.confirmDelete = function () {
        //Turn off main buttons including the delete button just pressed
        vm.updateButton = false;
        vm.deleteButton = false;
        vm.addButton = false;

        //Turn on the delete confirmation buttons
        vm.showDeleteSection = true;
        vm.closeButton = false;

        //Show delete warning
        vm.error = 'This will delete the horse article. Please confirm';
        vm.errorType = 'Warning!';
      };

      /*************************************************************************/
      /* Close the delete section on the form */
      /*************************************************************************/
      vm.closeDeleteSection = function () {
        //Turn on main buttons including the delete button just pressed
        vm.updateButton = true;
        vm.deleteButton = true;
        vm.addButton = false;

        //Turn off the delete confirmation buttons
        vm.showDeleteSection = false;
        vm.closeButton = true;

        //Close delete warning
        vm.error = '';
        vm.errorType = 'Error!';
      };

      /*************************************************************************/
      /* Delete a horse article */
      /*************************************************************************/
      vm.deleteHorse = function () {
        vm.error = '';
        vm.feedback = '';

        if (!vm.horseId) {
          vm.error = 'No article specified';
          return;
        }

        Log.logEntry('trying to delete a horse ', vm.horseId);

        Horse.delete(vm.horseId).success(function (data) {
          if (data.success === true) {
            vm.feedback = 'Horse article deleted';
          } else {
            vm.error = data.message;
          }

          $location.path('/maintContent/horse');
        });
      };

      /*************************************************************************/
      /* Close the form and return back to the content management page */
      /*************************************************************************/
      vm.closeForm = function () {
        $location.path('/maintContent/horse');
      };

      /*************************************************************************/
      /* Image upload to filepicker */
      /*************************************************************************/
      // vm.imageUpload = function () {
      //   filepicker.pick(
      //     {
      //       mimetype: 'image/*',
      //       language: 'en',
      //       services: [
      //         'COMPUTER',
      //         'DROPBOX',
      //         'GOOGLE_DRIVE',
      //         'IMAGE_SEARCH',
      //         'FACEBOOK',
      //         'INSTAGRAM',
      //       ],
      //       openTo: 'IMAGE_SEARCH',
      //       imageMax: [800, 800],
      //     },
      //     function (Blob) {
      //       vm.article.picture = Blob.url;
      //     },
      //     function (error) {
      //       Log.logEntry('failure from pick');
      //     }
      //   );
      // };

      // delay function
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));

      /*************************************************************************/
      /* PDF upload to server */
      /*************************************************************************/
      vm.fileUpload = async function () {
        if (!vm.article.file) {
          return;
        }

        vm.loading = true;
        //await delay(5000);

        const urlPath = baseUrl + 'api/upload/fileupload';

        Upload.upload({
          url: urlPath,
          //url: 'http://localhost:8083/api/upload/fileupload',
          data: { file: vm.article.file },
        }).then(
          function (resp) {
            if (resp.data.success === true) {
              vm.article.documentlocation = resp.data.message;
            } else {
              Log.logEntry('file upload failed');
            }
          },
          function (resp) {
            Log.logEntry('error status ', resp.status);
          },
          function (evt) {
            //console.log(evt);
            // var progressPercentage = parseInt((100.0 * evt.loaded) / evt.total);
            // Log.logEntry(
            //   'progress: ' +
            //     progressPercentage +
            //     '% ' +
            //     evt.config.data.file.name
            // );
            // vm.uploadProgress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            vm.loading = false;
          }
        );
      };

      /*************************************************************************/
      /* Image upload to filepicker */
      /*************************************************************************/
      // vm.videoUpload = async function () {
      //   console.log('trying to upload video');

      //   if (!vm.article.file) {
      //     return;
      //   }

      //   vm.loading = true;
      //   await delay(5000);

      //   Upload.upload({
      //     url: 'http://localhost:8083/api/upload/fileupload',
      //     data: { file: vm.article.file },
      //   }).then(
      //     function (resp) {
      //       if (resp.data.error === 0) {
      //         console.log('success from upload');
      //       } else {
      //         console.log('file upload failed');
      //       }
      //     },
      //     function (resp) {
      //       console.log('error status ', resp.status);
      //     },
      //     function (evt) {
      //       console.log(evt);
      //       var progressPercentage = parseInt((100.0 * evt.loaded) / evt.total);
      //       console.log(
      //         'progress: ' +
      //           progressPercentage +
      //           '% ' +
      //           evt.config.data.file.name
      //       );
      //       vm.uploadProgress = 'progress: ' + progressPercentage + '% '; // capture upload progress
      //       vm.loading = false;
      //     }
      //   );
      // };
    },
  ]);
