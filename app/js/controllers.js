
moduleapp.controller('PortadaCtrl', function($scope, CategoriesSvc, ShoppingCartSvc, $rootScope, uiGmapGoogleMapApi, geolocation, $location, $anchorScroll, $document){


//  menu.setMainPage('app/view/cuenta.html');

  $('.waves').parallax({ limitY: 30, scalarX: 20 });

  $scope.isInZone = false;
  $scope.isInZone = "";


  $scope.cartCount;

  $scope.subcats = Navigator.getCurrentPage().options.subcat;
  $scope.categoriesList;

  CategoriesSvc.list().then(function(result){
    $scope.categoriesList = result.data;
  });



  $scope.categoryOpen = function(theid, thename, subs){
    if(subs==1){
      Navigator.pushPage('app/view/subcategorias.html', {subcat:theid});
    } else {
      Navigator.pushPage('app/view/productos.html', {cat:theid, nam:thename});
    }
  }

  $scope.$watch(function () {
       return ShoppingCartSvc.count();
     },
      function() {
        $scope.cartCount = ShoppingCartSvc.count();
    }, true);


  $scope.rSpace = function(thename){
    var sinSpacio = thename.replace(/ /g,"_");
    sinSpacio = sinSpacio.replace('ó', "o");
    sinSpacio = sinSpacio.replace('á', "a");
    var lowCase = sinSpacio.toLowerCase();
    return lowCase;
  }

  $scope.okZone = function(){
    $rootScope.zona = true;
  }



  geolocation.getLocation().then(function(data){
    var geocoder = new google.maps.Geocoder();
    uiGmapGoogleMapApi.then(function(maps) {
      $scope.coords = { lat:data.coords.latitude, long: data.coords.longitude };
        $scope.map = {
            center: { latitude: $scope.coords.lat, longitude: $scope.coords.long },
          zoom: 11,
          options: {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false
          }
        }
        $scope.polygons = zonaJagergin;
        $scope.marker = [ {id:0, options: { icon:'app/img/icon_marker.png' },
          coords: { latitude: $scope.coords.lat, longitude: $scope.coords.long
          }
        }];

        // ¿INSIDE JAGERGIN ZONE?
        if(!$rootScope.zona){
          var nupaths = { path:[ ] };
          for(var i=0;i<zonaJagergin.todo.path.length; i++){  nupaths.path.push( {lat:zonaJagergin.todo.path[i].latitude, lng:zonaJagergin.todo.path[i].longitude } );  }
          var point = new google.maps.LatLng($scope.coords.lat, $scope.coords.long);
          var area = new google.maps.Polygon( {paths: nupaths.path });
          $scope.isInZone = area.containsLatLng(point);
        }

    }); //ends uiGmapGoogleMapApi

  }); //ends geolocation


  $scope.scrollBottom = function(){
    console.log('scrooooll');
    $anchorScroll('thebottom');
  }


}) //ends PortadaCtrl

moduleapp.directive('svgSnap', function(){
  return{
    restrict: 'E',
    replace: true,
    link: function(scope, element, attrs){
      scope.getContentUrl = function(){
        return attrs.path;
      }
    },
    template: '<div ng-include="getContentUrl()"></div>'
  }
})




moduleapp.controller('ProductosCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, $filter) {
  $scope.navi = Navigator.getCurrentPage().options;
  $scope.categoryName = $scope.navi.nam;
  $scope.category = $scope.navi.cat;
  $scope.url = SettingSvc.getPhotoUrl();

  $scope.products;
  $scope.grid = true;

  $scope.cartCount;

  $scope.cantidades = [1,2,3,4,5,6,7,8,9,10];


  $scope.itemsInCart = ShoppingCartSvc.getCart();

  $('.waves').parallax({ limitY: 30, scalarX: 20 });


  ProductsSvc.findByCategoryId($scope.category).then(function(result){
    $scope.products = result.data;
  });

  $scope.addToCart = function(theItem){
    ShoppingCartSvc.addItem(theItem);
  }



  $scope.$watch(function () {
       return ShoppingCartSvc.count();
     },
      function() {
        $scope.cartCount = ShoppingCartSvc.count();
    }, true);


  $scope.InCart = function(ref){
    var found = $filter('filter')($scope.itemsInCart, {refId:ref}, true);
    if(found.length){ return true; } else { return false; }
  }


  $scope.rSpace = function(thename){
    var sinSpacio = thename.replace(/ /g,"_");
    sinSpacio = sinSpacio.replace('ó', "o");
    sinSpacio = sinSpacio.replace('á', "a");
    var lowCase = sinSpacio.toLowerCase();
    return lowCase;
  }



});



moduleapp.controller('CarritoCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, PaypalSvc, geolocation) {
    $scope.total = [];

    $scope.cartItems = ShoppingCartSvc.getCart();
    $scope.url = SettingSvc.getPhotoUrl();
    $scope.order = [];
    $scope.order.total_amount;
    $scope.cartCount;

    $scope.carous = [];

    $scope.cantidades = [1,2,3,4,5,6,7,8,9,10];


    getTotalAmount();


    function updateCart(){
  		$scope.cartItems = ShoppingCartSvc.getCart();
      getTotalAmount();
  	}

    function getTotalAmount(){
      $scope.order.total_amount = 0;
  		for(var i=0;i<$scope.cartItems.length;i++){
        $scope.cartItems[i].subTotal= $scope.cartItems[i].quantity * $scope.cartItems[i].new_price;
  			$scope.order.total_amount += $scope.cartItems[i].subTotal;
  		}
    }

    $scope.increaseQuantity_tap = function(item){
    	ShoppingCartSvc.increaseQuantity(item);
      item.subTotal = item.quantity * item.new_price;
    	updateCart();
    }
    $scope.decreaseQuantity_tap = function(item, qty, itemindx){
    	ShoppingCartSvc.decreaseQuantity(item);
      item.subTotal = item.quantity * item.new_price;
    	updateCart();
      if(qty == 1){
        $scope[itemindx].next();
      }
    }

    $scope.removeFromCart = function(item){
      ShoppingCartSvc.removeItem(item);
      updateCart();
    }

    $scope.totalAmount = function(){
  		$scope.order.total_amount = 0;
  		for(var i=0;i<$scope.cartItems.length;i++){
  			$scope.order.total_amount += $scope.cartItems[i].subTotal;
  		}
  		return $scope.order.total_amount;
  	}

    $scope.$watch(function () {
         return ShoppingCartSvc.count();
       },
        function() {
          $scope.cartCount = ShoppingCartSvc.count();
      }, true);





});




moduleapp.controller('CheckoutCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, PaypalSvc, geolocation, uiGmapGoogleMapApi, $rootScope, cfpLoadingBar) {
    $scope.total = [];

    $scope.cartItems = ShoppingCartSvc.getCart();
    $scope.url = SettingSvc.getPhotoUrl();
    $scope.order = [];
    $scope.order.total_amount;
    $scope.cartCount;

    $scope.address="";
    $scope.geocoder = new google.maps.Geocoder();

    getTotalAmount();

    $scope.totalAmount = function(){
  		$scope.order.total_amount = 0;
  		for(var i=0;i<$scope.cartItems.length;i++){
  			$scope.order.total_amount += $scope.cartItems[i].subTotal;
  		}
  		return $scope.order.total_amount;
  	}

    function getTotalAmount(){
      $scope.order.total_amount = 0;
  		for(var i=0;i<$scope.cartItems.length;i++){
        $scope.cartItems[i].subTotal= $scope.cartItems[i].quantity * $scope.cartItems[i].new_price;
  			$scope.order.total_amount += $scope.cartItems[i].subTotal;
  		}
    }

    $scope.checkoutPosition;



    geolocation.getLocation().then(function(data){
      var geocoder = new google.maps.Geocoder();
      uiGmapGoogleMapApi.then(function(maps) {
      setTimeout(function(){ $('.Cart .gm-style').append('<div class="centerPin"><img src="app/img/icon_marker.png"></div>'); }, 1000);
        $scope.coords = { lat:data.coords.latitude, lng: data.coords.longitude };
          $scope.map = {
              center: { latitude: $scope.coords.lat, longitude: $scope.coords.lng },
            zoom: 11,
            options: {
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              mapTypeControl: false,
              streetViewControl: false
            },
            events:{
              dragend: function(e){

                var point = e.center;
                $scope.isInZone = area.containsLatLng(point);
                if($scope.isInZone){ trackLocation($scope.map.center.latitude, $scope.map.center.longitude); }
              }
            }
          }
          $scope.polygons = zonaJagergin;

          // ¿INSIDE JAGERGIN ZONE?
          var nupaths = { path:[ ] };
          for(var i=0;i<zonaJagergin.todo.path.length; i++){  nupaths.path.push( {lat:zonaJagergin.todo.path[i].latitude, lng:zonaJagergin.todo.path[i].longitude } );  }
          var area = new google.maps.Polygon( {paths: nupaths.path });
          var point = new google.maps.LatLng($scope.coords.lat, $scope.coords.lng);
          $scope.isInZone = area.containsLatLng(point);
          if($scope.isInZone){ trackLocation($scope.coords.lat, $scope.coords.lng); }
      }); //ends uiGmapGoogleMapApi

    }); //ends geolocation


    $scope.order.address = {};
    $scope.order.address.inmediato = true;
    /*
    $scope.hrentrega = function(){
      $scope.order.address.inmediato = inmediato.isChecked();
      console.log($scope.order.address.inmediato);
    }
*/
    function trackLocation(lat, lng){
      cfpLoadingBar.start();
      $scope.geocoder.geocode({ 'latLng': new google.maps.LatLng(lat, lng) }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                  $scope.order.address.general = results[0].formatted_address;
                  cfpLoadingBar.complete();
              } else {
                  $scope.order.address.general =  'No encontramos tu dirección';
                  cfpLoadingBar.complete()
              }
          } else {
              $scope.order.address.general =  'Error: ' + status;
          }
      });
    }


});





moduleapp.controller('BusquedaCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, CategoriesSvc, $filter) {
  $scope.url = SettingSvc.getPhotoUrl();
  $scope.search="";
  $scope.searchResult = [];
  $scope.itemsInCart = ShoppingCartSvc.getCart();
  $scope.categories;
  $scope.cartCount;
  $scope.cantidades = [1,2,3,4,5,6,7,8,9,10];



  ProductsSvc.list(0, 1000, 0).then(function(resultPrd){

    CategoriesSvc.list().then(function(resultCat){
      $scope.products = resultPrd.data;
  		$scope.categories = resultCat.data;
      for(var i = 0; i<$scope.products.length; i++){
        var found = $filter('filter')($scope.categories, {id:$scope.products[i].categories_id}, true);
        $scope.products[i].categoryName = found[0].name;
      }

  	});

  });

  $scope.addToCart = function(theItem){
    ShoppingCartSvc.addItem(theItem);
  }


    $scope.InCart = function(ref){
      var found = $filter('filter')($scope.itemsInCart, {refId:ref}, true);
      if(found.length){ return true; } else { return false; }
    }


  $scope.$watch(function () {
       return ShoppingCartSvc.count();
     },
      function() {
        $scope.cartCount = ShoppingCartSvc.count();
    }, true);


});



moduleapp.controller('CuentaCtrl', function ($scope, ShoppingCartSvc, SettingSvc, UsersSvc, StoreLocalSvc, $filter, $rootScope) {


  $scope.choose     = true;
  $scope.signUpForm = false;
  $scope.signInForm = false;

  $scope.signin = {};
  $scope.userEdit = $rootScope.userApp;

  $scope.errorUsuario = false;
  $scope.errorPass = false;
  $scope.errorLogin = false;

  $scope.allValid = false;

  var prevProfile = {};
  prevProfile.name = $scope.userEdit.name;
  prevProfile.email = $scope.userEdit.email;
  prevProfile.tel = $scope.userEdit.tel;


$('.waves').parallax({ limitY: 30, scalarX: 20 });


  $scope.signup = function(){
    $scope.newUser = {};
    $scope.newUser.name = $scope.signin.name;
    $scope.newUser.password = $scope.signin.password;
    $scope.newUser.email = $scope.signin.email;
    $scope.newUser.tel = $scope.signin.tel;
    UsersSvc.createUser($scope.newUser).then(function(result){
      if(result.data){
        $rootScope.loggedin = true;
        $rootScope.userApp = $scope.newUser;
        $rootScope.userApp.id = result.data;
      }
    });
  }

  $scope.checkEmail = function(){
    if($scope.signin.email){
      UsersSvc.searchUser($scope.signin.email).then(function(result){
        //console.log(result.data.length);
        if(result.data.length>0){
          $scope.errorUsuario = 'Este correo ya esta registrado';
        } else {
          $scope.errorUsuario = false;
        }
      });
    }
  }

  $scope.validator = function(){
    if(!$scope.errorUsuario && $scope.signin.email && $scope.signin.name && $scope.signin.tel && $scope.signin.password && $scope.signin.password2 ){
      if($scope.signin.password != $scope.signin.password2){
        $scope.errorPass = "No coinciden las contraseñas";
        $scope.allValid = false;
      } else {
        $scope.errorPass = false;
        $scope.allValid = true;
      }

    }
  }

  $scope.login = function(){
    UsersSvc.loginUser($scope.loggingIn).then(function(result){
      if(!result.data){
        $scope.errorLogin = "Los datos de acceso son incorrectos.";
      } else {
        $scope.errorLogin = false;
        $rootScope.loggedin = true;
        $rootScope.userApp = result.data;
      }
    });
  }


  $scope.fbLogin = function(){
    hello('facebook').login({ scope: 'email' });
  }//fbLogin

  $scope.googleLogin = function(){
    hello('google').login({ scope: 'email' });
  }

  $scope.logout = function(){
    hello('facebook').logout();
    hello('google').logout();
    $scope.choose     = true;
    $scope.signUpForm = false;
    $scope.signInForm = false;
    $rootScope.loggedin = false;
    $rootScope.userApp = {};
  }

  $scope.editarPerfil = function(){
    ons.createDialog('editProfile.html').then(function(dialog){
      dialog.show();
    });
  }

  $scope.cancelUpdatePerfil = function(){
    $scope.userApp.name = prevProfile.name;
    $scope.userApp.email = prevProfile.email;
    $scope.userApp.tel = prevProfile.tel;
  }
  $scope.actualizarPerfil = function(){
    UsersSvc.updateUser($scope.userEdit, $scope.userApp.id).then(function(result){
      console.log(result);
    });
  }

});



moduleapp.controller('AcercaCtrl', function ($scope) {
    $('.waves').parallax({ limitY: 30, scalarX: 20 });
});
