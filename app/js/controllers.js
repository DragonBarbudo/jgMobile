moduleapp.controller('PortadaCtrl', function($scope, CategoriesSvc, ShoppingCartSvc){

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
    var lowCase = sinSpacio.toLowerCase();
    return lowCase;
  }

})
.directive('svgSnap', function(){
  return{
    restrict: 'E',
    replace: true,
    /*template: function(elem, attr){
      console.log(elem);
      jQuery(elem).hide();
      //var snap = Snap(e);
      //var svg = Snap.load(attr.path, function(loadedFragment){ snap.append(loadedFragment); })
      return '<div class="svg-snap"></div>';
    }*/
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

  $scope.itemsInCart = ShoppingCartSvc.getCart();


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

});



moduleapp.controller('CarritoCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, PaypalSvc, geolocation) {
    $scope.total = [];

    $scope.cartItems = ShoppingCartSvc.getCart();
    $scope.url = SettingSvc.getPhotoUrl();
    $scope.order = [];
    $scope.order.total_amount;
    $scope.cartCount;

    $scope.carous = [];

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




moduleapp.controller('CheckoutCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, PaypalSvc, geolocation) {
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





    geolocation.getLocation().then(function(data){
      $scope.coords = {lat:data.coords.latitude, long: data.coords.longitude};
      var geocoder = new google.maps.Geocoder();
      var interval = setInterval(function(){
        if(!$('.centerPin').length>0){ $('.gm-style').append('<div class="centerPin"><img src="app/img/jagerPin.png"></div>'); }
      }, 4000);
      $scope.map = {
          center: {
            latitude: $scope.coords.lat,
            longitude: $scope.coords.long
          },
          zoom: 12,
          events:{
            dragend : function(){
              trackLocation($scope.map.center);
            }
          }
      };
      $scope.polygons = zonaDraw;

    }); //geolocation

    function trackLocation(center){
      $scope.marker.coords.latitude = center.latitude;
      $scope.marker.coords.longitude = center.longitude;
      $scope.geocoder.geocode({ 'latLng': new google.maps.LatLng(center.latitude, center.longitude) }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                  $scope.address = results[0].formatted_address;
              } else {
                  $scope.address =  'Location not found';
              }
          } else {
              $scope.address =  'Geocoder failed due to: ' + status;
          }
      });
    }




  var zonaJag = [
    new google.maps.LatLng(19.423535,-99.144745),
    new google.maps.LatLng(19.436647,-99.150753),
    new google.maps.LatLng(19.451216,-99.142857),
    new google.maps.LatLng(19.449597,-99.122257),
    new google.maps.LatLng(19.429201,-99.115391),
    new google.maps.LatLng(19.420135,-99.102516),
    new google.maps.LatLng(19.455262,-99.089470),
    new google.maps.LatLng(19.474846,-99.113331),
    new google.maps.LatLng(19.490706,-99.150238),
    new google.maps.LatLng(19.472419,-99.159164),
    new google.maps.LatLng(19.451540,-99.163456),
    new google.maps.LatLng(19.439885,-99.183025),
    new google.maps.LatLng(19.418516,-99.167233),
    new google.maps.LatLng(19.406212,-99.134617),
    new google.maps.LatLng(19.387753,-99.132557),
    new google.maps.LatLng(19.394230,-99.116936),
    new google.maps.LatLng(19.407831,-99.118652),
    new google.maps.LatLng(19.417707,-99.137535)
  ];

  var zonaDraw = [
      {
          id: 1,
          path: zonaJag,
          stroke: {
              color: '#F8012D',
              weight: 1
          },
          geodesic: false,
          visible: true,
          fill: {
              color: '#00B9FF',
              opacity: 0.8
          }
      }
  ];

});





moduleapp.controller('BusquedaCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, CategoriesSvc, $filter) {
  $scope.url = SettingSvc.getPhotoUrl();
  $scope.search="";
  $scope.searchResult = [];
  $scope.itemsInCart = ShoppingCartSvc.getCart();
  $scope.categories;
  $scope.cartCount;


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



moduleapp.controller('CuentaCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, $filter) {


  $scope.choose     = true;
  $scope.signUpForm = false;
  $scope.signInForm = false;

  $scope.signin = {};


  $scope.fbLogin = function(){
    hello('facebook').login();
  }//fbLogin


  $scope.logout = function(){
    hello('facebook').logout();
    $scope.choose     = true;
    $scope.signUpForm = false;
    $scope.signInForm = false;
  }

});
