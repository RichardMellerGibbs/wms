angular
  .module('maintGalleryCtrl', ['authService', 'successService', 'logService'])
  .controller('maintGalleryController', [
    '$rootScope',
    '$location',
    '$routeParams',
    '$window',
    'Auth',
    'Success',
    'Log',
    function (
      $rootScope,
      $location,
      $routeParams,
      $window,
      Auth,
      Success,
      Log
    ) {
      var vm = this;
      var testimonialId = '';

      vm.updateButton = true;
      vm.showDeleteSection = false;
      vm.addButton = false;
      vm.deleteButton = true;
      vm.closeButton = true;

      vm.errorType = 'Error!';
      vm.error = '';
      vm.feedback = '';

      vm.article = {};
      vm.articleDate = {};

      Log.logEntry('Inside the maintGalleryController');

      vm.loggedIn = Auth.isLoggedIn();

      //Re-direct to login page if user not logged in
      if (vm.loggedIn === false) {
        $location.path('/login');
      } else {
        //If a galleryId is passed in the get the details of it

        if ($routeParams.galleryId !== 'x') {
          vm.galleryId = $routeParams.galleryId;

          //Now get the testimonial details for this article
          Log.logEntry(
            'Now get the gallery details for this article ' + vm.galleryId
          );

          Success.get(vm.galleryId)
            .success(function (data) {
              vm.article = data;

              vm.articleDate = { value: new Date(data.articleDate) };

              Log.logEntry('vm.article.type = ' + vm.article.type);
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
      /* Add a testimonial article */
      /*************************************************************************/
      vm.addGallery = function () {
        vm.error = '';
        vm.feedback = '';

        Log.logEntry('Adding gallery image');

        // COMMON VALIDATION
        if (!vm.articleDate.value) {
          vm.error = 'A date must be supplied';
          return;
        }

        if (!vm.article.picture) {
          vm.error = 'An image must be supplied';
          return;
        }

        var articletData = {
          type: 'gallery',
          articleDate: vm.articleDate.value,
        };

        if (vm.article.picture) {
          articletData.picture = vm.article.picture;
        }

        Success.create(articletData).success(function (data) {
          if (data.success === true) {
            vm.feedback = 'Article added';
            $location.path('/maintContent/gallery');
          } else {
            vm.error = data.message;
          }
        });
      };

      /*************************************************************************/
      /* Update a gallery article */
      /*************************************************************************/
      vm.updateGallery = function () {
        vm.error = '';
        vm.feedback = '';

        // COMMON VALIDATION
        if (!vm.articleDate.value) {
          vm.error = 'A date must be supplied';
          return;
        }

        // LOAD UP THE OBJECT
        var articletData = {
          articleDate: vm.articleDate.value,
        };

        if (vm.article.picture) {
          articletData.picture = vm.article.picture;
        }

        Success.update(vm.galleryId, articletData).success(function (data) {
          if (data.success === true) {
            vm.feedback = 'Article updated';
            $location.path('/maintContent/gallery');
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
        vm.error = 'This will delete the gallery image. Please confirm';
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
      /* Delete a success article */
      /*************************************************************************/
      vm.deleteGallery = function () {
        vm.error = '';
        vm.feedback = '';

        if (!vm.galleryId) {
          vm.error = 'No image specified';
          return;
        }

        Success.delete(vm.galleryId).success(function (data) {
          if (data.success === true) {
            vm.feedback = 'Gallery image deleted';
          } else {
            vm.error = data.message;
          }

          $location.path('/maintContent/gallery');
        });
      };

      /*************************************************************************/
      /* Close the form and return back to the content management page */
      /*************************************************************************/
      vm.closeForm = function () {
        $location.path('/maintContent/gallery');
      };

      /*************************************************************************/
      /* Image upload to filepicer */
      /*************************************************************************/
      vm.imageUpload = function () {
        filepicker.pick(
          {
            mimetype: 'image/*',
            language: 'en',
            services: [
              'COMPUTER',
              'DROPBOX',
              'GOOGLE_DRIVE',
              'IMAGE_SEARCH',
              'FACEBOOK',
              'INSTAGRAM',
            ],
            openTo: 'IMAGE_SEARCH',
            imageMax: [800, 800],
          },
          function (Blob) {
            vm.article.picture = Blob.url;
          },
          function (error) {
            Log.logEntry('failure from filerpick');
          }
        );
      };
    },
  ]);
