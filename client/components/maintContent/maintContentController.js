angular
  .module('maintContentCtrl', [
    'authService',
    'contentService',
    'newsService',
    'angularMoment',
    'successService',
    'horseService',
    'logService',
  ])
  .controller('maintContentController', [
    '$rootScope',
    '$location',
    '$routeParams',
    '$window',
    'Auth',
    'Content',
    'News',
    'Success',
    'Horse',
    'Log',
    function (
      $rootScope,
      $location,
      $routeParams,
      $window,
      Auth,
      Content,
      News,
      Success,
      Horse,
      Log
    ) {
      var vm = this;

      vm.updateButton = true;

      vm.errorType = 'Error!';
      vm.error = '';
      vm.feedback = '';
      vm.selectedSubject = '';

      vm.successData = [];
      var successItem = {};

      vm.testData = [];
      var testItem = {};

      vm.galleryData = [];
      var galleryItem = {};

      Log.logEntry('Inside the maintContentController.');

      // get info if a person is logged in
      vm.loggedIn = Auth.isLoggedIn();

      if (vm.loggedIn === false) {
        $location.path('/login');
      } else {
        vm.homeForm = true;
        vm.newsForm = false;
        vm.successForm = false;
        vm.testimonialForm = false;
        vm.galleryForm = false;
        vm.horseForm = false;

        vm.tab = $routeParams.tab;

        Log.logEntry('tab = ' + vm.tab);

        if (vm.tab == 'news') {
          vm.newsForm = true;
          vm.homeForm = false;
          vm.successForm = false;
          vm.testimonialForm = false;
          vm.galleryForm = false;
          vm.horseForm = false;
        }

        if (vm.tab == 'success') {
          vm.newsForm = false;
          vm.homeForm = false;
          vm.successForm = true;
          vm.testimonialForm = false;
          vm.galleryForm = false;
          vm.horseForm = false;
        }

        if (vm.tab == 'testimonial') {
          vm.newsForm = false;
          vm.homeForm = false;
          vm.successForm = false;
          vm.testimonialForm = true;
          vm.galleryForm = false;
          vm.horseForm = false;
        }

        if (vm.tab == 'gallery') {
          vm.newsForm = false;
          vm.homeForm = false;
          vm.successForm = false;
          vm.testimonialForm = false;
          vm.galleryForm = true;
          vm.horseForm = false;
        }

        if (vm.tab == 'horse') {
          vm.newsForm = false;
          vm.homeForm = false;
          vm.successForm = false;
          vm.testimonialForm = false;
          vm.galleryForm = false;
          vm.horseForm = true;
        }

        /*************************************************************************/
        /* Get all the home page data */
        /*************************************************************************/
        Content.all().success(function (homeData) {
          Log.logEntry('maintContentController - success from Home.all');

          Log.logEntry('homeData length ' + homeData.length);

          vm.homeData = homeData;
        });

        /*************************************************************************/
        /* Get all the news data */
        /*************************************************************************/
        News.all().success(function (newsData) {
          Log.logEntry('maintContentController - success from News.all');

          Log.logEntry('newsData length ' + newsData.length);
          Log.logEntry('newsData 1  ' + newsData[0].title);

          vm.newsData = newsData;
        });

        /*************************************************************************/
        /* Get all the horse data */
        /*************************************************************************/
        Horse.all().success(function (horseData) {
          Log.logEntry('maintHorseController - success from Horse.all');

          Log.logEntry('horseData length ' + horseData.length);
          Log.logEntry('horseData   ' + horseData[0].title);
          Log.logEntry(horseData);

          vm.horseData = horseData;
        });

        /*************************************************************************/
        /* Get all the success data */
        /*************************************************************************/
        Success.all().success(function (data) {
          Log.logEntry('maintContentController - success from Success.all');

          Log.logEntry('successData length ' + data.length);
          //Log.logEntry('successData 1  ' + data[0].type);

          for (i = 0; i < data.length; i++) {
            if (data[i].type === 'success') {
              successItem = {
                _id: data[i]._id,
                type: data[i].type,
                title: data[i].title,
                description: data[i].description,
                articleDate: { value: new Date(data[i].articleDate) },
              };

              vm.successData.push(successItem);
            }

            if (data[i].type === 'testimonial') {
              testItem = {
                _id: data[i]._id,
                type: data[i].type,
                by: data[i].by,
                description: data[i].description,
                articleDate: { value: new Date(data[i].articleDate) },
              };

              vm.testData.push(testItem);
            }

            if (data[i].type === 'gallery') {
              galleryItem = {
                _id: data[i]._id,
                type: data[i].type,
                picture: data[i].picture,
                articleDate: { value: new Date(data[i].articleDate) },
              };

              vm.galleryData.push(galleryItem);
            }
          }
        });
      }

      //Setup the content maintenance for the home page
      vm.displayHome = function () {
        vm.homeForm = true;
        vm.newsForm = false;
        vm.successForm = false;
        vm.testimonialForm = false;
        vm.galleryForm = false;
        vm.horseForm = false;
      };

      //Setup the content maintenance for the news articles
      vm.displayNews = function () {
        vm.homeForm = false;
        vm.newsForm = true;
        vm.successForm = false;
        vm.testimonialForm = false;
        vm.galleryForm = false;
        vm.horseForm = false;
      };

      //Setup the content maintenance for the success articles
      vm.displaySuccess = function () {
        vm.homeForm = false;
        vm.newsForm = false;
        vm.successForm = true;
        vm.testimonialForm = false;
        vm.galleryForm = false;
        vm.horseForm = false;
      };

      //Setup the content maintenance for the testimonials articles
      vm.displayTestimonial = function () {
        vm.homeForm = false;
        vm.newsForm = false;
        vm.successForm = false;
        vm.testimonialForm = true;
        vm.galleryForm = false;
        vm.horseForm = false;
      };

      //Setup the content maintenance for the gallery
      vm.displayGallery = function () {
        vm.homeForm = false;
        vm.newsForm = false;
        vm.successForm = false;
        vm.testimonialForm = false;
        vm.galleryForm = true;
        vm.horseForm = false;
      };

      //Setup the content maintenance for the horse
      vm.displayHorse = function () {
        vm.homeForm = false;
        vm.newsForm = false;
        vm.successForm = false;
        vm.testimonialForm = false;
        vm.galleryForm = false;
        vm.horseForm = true;
      };

      vm.loadItem = function () {
        vm.feedback = '';
        Log.logEntry(
          'Running loaditem function sectionChosen ' + vm.sectionChosen
        );

        for (i = 0; i < vm.homeData.length; i++) {
          if (vm.homeData[i].subject === vm.sectionChosen) {
            //console.log('title = ' + vm.homeData[i].title);
            vm.selectedItem = {
              id: vm.homeData[i]._id,
              description: vm.homeData[i].description,
            };
          }
        }
      };

      vm.updateHome = function () {
        vm.error = '';
        vm.feedback = '';

        Log.logEntry('updating the home data ');
        //console.log('vm.selectedItem.title ' + vm.selectedItem.title);
        //console.log('vm.selectedItem.description ' + vm.selectedItem.description);
        Log.logEntry('vm.selectedItem.id ' + vm.selectedItem.id);

        //VALIDATE FORM

        Content.update(vm.selectedItem.id, vm.selectedItem).success(function (
          data
        ) {
          //console.log('maintHomeController success ' + data.success);
          //console.log('maintHomeController Result ' + data.message);

          if (data.success === true) {
            vm.feedback = 'Home data updated';
            vm.selectedItem.description = '';
            vm.repeatSelect = '';

            //Makes feedback alert dissapear automatically after 4 seconds
            setTimeout(function () {
              $('.alert').alert('close');
            }, 3000);

            // grab all the home data at page load
            Content.all().success(function (homeData) {
              vm.homeData = homeData;
              vm.sectionChosen = '';
              vm.selectedItem = {};
            });
          } else {
            vm.error = data.message;
          }
        });
      };

      vm.newsDetail = function (newsItem) {
        Log.logEntry('Called newsDetail ' + newsItem.title);
        vm.newsItem = newsItem;
        $location.path('/maintNews/' + newsItem._id);
      };

      vm.addNewsItem = function (newsItem) {
        $location.path('/maintNews/x');
      };

      vm.successDetail = function (successItem) {
        Log.logEntry(
          'Called successDetail ' + successItem.type,
          +' id = ' + successItem._id
        );
        vm.successItem = successItem;
        $location.path('/maintSuccess/' + successItem._id);
      };

      vm.addsuccessItem = function () {
        $location.path('/maintSuccess/x');
      };

      vm.testimonialDetail = function (testimonialItem) {
        Log.logEntry('Called testimonialDetail ' + testimonialItem.type);
        vm.testimonialItem = testimonialItem;
        $location.path('/maintTestimonial/' + testimonialItem._id);
      };

      vm.addtestimonialItem = function () {
        $location.path('/maintTestimonial/x');
      };

      vm.galleryDetail = function (galleryItem) {
        Log.logEntry('Called galleryDetail ' + galleryItem.type);
        vm.galleryItem = galleryItem;
        $location.path('/maintGallery/' + galleryItem._id);
      };

      vm.addgalleryItem = function () {
        $location.path('/maintGallery/x');
      };

      vm.horseDetail = function (horseItem) {
        Log.logEntry('Called horseItem id ' + horseItem._id);
        vm.horseItem = horseItem;
        $location.path('/maintHorse/' + horseItem._id);
      };

      vm.addHorseItem = function () {
        console.log('calling mainhorse with x');
        $location.path('/maintHorse/x');
      };
    },
  ]);
