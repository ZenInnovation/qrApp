var app = angular.module('revolution.controllers', ['firebase', 'ngCordova', 'ngResource']);

app.controller('AppCtrl', function($scope, $ionicLoading, $ionicSideMenuDelegate, FeedList) {

  // side menu open/closed - changing navigation icons
  $scope.$watch(function () {
    return $ionicSideMenuDelegate.getOpenRatio();
  },
    function (ratio) {
      if (ratio === 1 || ratio === -1){
        $scope.isActive= true;
      } else{
          $scope.isActive = false;
    }
  });



// RIGHT SIDE MENU NOTIFICATIONS

  $scope.data = {
    showDelete: false
  };

  $scope.edit = function(item) {
    alert('Edit Item: ' + item.id);
  };
  $scope.share = function(item) {
    alert('Share Item: ' + item.id);
  };

  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.notifications.splice(fromIndex, 1);
    $scope.notifications.splice(toIndex, 0, item);
  };

  $scope.onItemDelete = function(item) {
    $scope.notifications.splice($scope.notifications.indexOf(item), 1);
  };

  $scope.notifications = [{
    id: 1,
    user: 'Guest 1',
    text: 'Hi i am fine.',
    img: '1.jpg'
  },{
    id: 2,
    user: 'Guest 2',
    text: 'Me too.',
    img: '2.jpg'
  },{
    id: 3,
    user: 'Guest 3',
    text: 'Thanks for testing RingRingApp.',
    img: '3.jpg'
  },{
    id: 4,
    user: 'Guest 4',
    text: 'Simplcity in QR.',
    img: '4.jpg'
  },{
    id: 5,
    user: 'Guest 5',
    text: 'nihowma?.',
    img: '5.jpg'
  }]


})

app.controller('UserCtrl', function($scope, $state, $ionicLoading, $ionicSideMenuDelegate) {

  $ionicSideMenuDelegate.canDragContent(false);

  $scope.start = function() {
    $state.go('app.home');
  }

})

app.controller('HomeCtrl', function($scope, $ionicLoading, $ionicSideMenuDelegate, $ionicScrollDelegate) {

  $ionicSideMenuDelegate.canDragContent(true);


  // top menu animation
  $scope.$watch(function () {
    return $ionicScrollDelegate.getScrollPosition().top;
  },
    function (top) {
      console.log(top);
      if (top > 50){
        $scope.topMenu = true;
      } if (top < 50){
          $scope.topMenu = false;
    }
  });




  // TABS
  $scope.tab = 1;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };


})


app.controller('NewsCtrl', function($scope, $ionicLoading, FeedList) {

  $ionicLoading.show({
      template: 'Loading news...'
    });

  // NEWS FEED
  var getNews = function(num) {
      $scope.news = [];

      FeedList.get(num).then(function(feeddata){
        var data = feeddata[0].entries;
        for(x=0;x<data.length;x++) {
          $scope.news.push({
            title: data[x].title,
            excerpt: data[x].contentSnippet,
          })
        }
        $ionicLoading.hide();
        })

    }
    getNews(10);

})



app.controller('BlogCtrl', function($scope, $ionicLoading, $stateParams, Blog) {


  $ionicLoading.show({
      template: 'Loading posts...'
    });


  $scope.categShow = false;
  $scope.showCategories = function() {
    if($scope.categShow == false) {
      $scope.categShow = true;
    } else {
      $scope.categShow = false;
    }
  }


// WORDPRESS CATEGORIES
  Blog.categories().then(
    function(data){
      $scope.categories = data.data.categories;
      $ionicLoading.hide();
    },
    function(error){
    }
  )




// WORDPRESS POSTS
$scope.getPosts = function() {
  Blog.posts($stateParams.id).then(
    function(data){
      $scope.posts = data.data.posts;
      $ionicLoading.hide();
    },
    function(error){
    }
  )
}


// WORDPRESS SINGLE POST
$scope.getPost = function() {
  Blog.post($stateParams.id).then(
    function(data){
      console.log(data);
      $scope.post = data.data.post;
      $ionicLoading.hide();
    },
    function(error){
    }
  )
}






})


app.controller('FirebaseCtrl', function($scope, $ionicLoading, Firebase, $firebaseObject, $firebaseArray) {


  $ionicLoading.show({
      template: 'Loading Firebase data...'
    });


  // FIREBASE

  // object
  var URL = Firebase.url();

  var refObject = firebase.database().ref().child("data"); // work with firebase url + object named 'data'
  // download the data into a local object
  var syncObject = $firebaseObject(refObject);
  // synchronize the object with a three-way data binding
  syncObject.$bindTo($scope, "firebaseObject"); // $scope.firebaseObject is your data from Firebase - you can edit/save/remove
    $ionicLoading.hide();


  // array
  var refArray = firebase.database().ref().child("messages");
  // create a synchronized array
  $scope.messages = $firebaseArray(refArray); // $scope.messages is your firebase array, you can add/remove/edit
  // add new items to the array
  // the message is automatically added to our Firebase database!
  $scope.addMessage = function(message) {
    $scope.newMessageText = null;
    $scope.messages.$add({
      text: message
    });

  };

})




app.controller('ElementsCtrl', function($scope, $ionicLoading) {

})


app.controller('PluginsCtrl', function($scope, $ionicLoading, $ionicPlatform, $cordovaToast, $cordovaAppRate, $cordovaBarcodeScanner, $cordovaDevice) {




  // toast message
  $scope.showToast = function() {
$ionicPlatform.ready(function() {
    $cordovaToast.showLongBottom('Here is a toast message').then(function(success) {
        // success
      }, function (error) {
        // error
      });
})
    }




  // rate my app
  $scope.showApprate = function() {

$ionicPlatform.ready(function() {

  $cordovaAppRate.promptForRating(true).then(function (result) {
        // success
    });

})

  }



  // barcode scanner
  $scope.showBarcode = function() {

$ionicPlatform.ready(function() {

  $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        // Success! Barcode data is here
            console.log(barcodeData);
      }, function(error) {
        // An error occurred
      });


    // NOTE: encoding not functioning yet
    $cordovaBarcodeScanner
      .encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com")
      .then(function(success) {
        // Success!
            console.log(success);
      }, function(error) {
        // An error occurred
      });

})

  }



    // contacts
  $scope.showDeviceinfo = function() {

$ionicPlatform.ready(function() {

    var device = $cordovaDevice.getDevice();
    var cordova = $cordovaDevice.getCordova();
    var model = $cordovaDevice.getModel();
    var platform = $cordovaDevice.getPlatform();
    var uuid = $cordovaDevice.getUUID();
    var version = $cordovaDevice.getVersion();

    alert('Your device has ' + platform);

})

  }




});


// rate my app preferences
app.config(function ($cordovaAppRateProvider) {

document.addEventListener("deviceready", function () {

   var prefs = {
     language: 'en',
     appName: 'MY APP',
     iosURL: '<my_app_id>',
     androidURL: 'market://details?id=<package_name>',
     windowsURL: 'ms-windows-store:Review?name=<...>'
   };

   $cordovaAppRateProvider.setPreferences(prefs)

 }, false);

 })
