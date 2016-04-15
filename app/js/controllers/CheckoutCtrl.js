
moduleapp.controller('CheckoutCtrl', function (CategoriesSvc, $scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, PaypalSvc, geolocation, uiGmapGoogleMapApi, $rootScope, cfpLoadingBar, UtilsSvc, OrdersSvc, $cordovaGeolocation, uiGmapIsReady, OrderItemSvc) {



    $scope.total = [];

    $scope.cartItems = ShoppingCartSvc.getCart();
    $scope.url = SettingSvc.getPhotoUrl();

    $scope.cartCount;

    $scope.address="";
    $scope.geocoder = new google.maps.Geocoder();


    $scope.order = {
  		code: UtilsSvc.createRandomCode(),
  		date_time: UtilsSvc.formatDate(new Date(), "YYYY-MM-DDTHH:MM:SS"),
  		customer_name: $rootScope.userApp.name,
  		customer_email_address: $rootScope.userApp.email,
      address_coord_lat: "",
      address_coord_long: "",
  		address_general: "",
  		address_interior : "",
  		address_referencias: "",
      entrega_inmediata:true,
      entrega_hora:"",
  		notes : "",
  		total_amount : 0
  	}


    console.log($scope.order.date_time);

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


    var posOptions = {timeout: 10000, enableHighAccuracy: true, maximumAge: 0};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (data) {
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
              streetViewControl: false,
              styles: gmapStyle
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
      }, function(err){
        alert('Debes tener la ubicación activa en tu dispositivo. Ingresa a los ajustes de tu dispositivo.');
        console.log(err);
      }); //ends uiGmapGoogleMapApi

    }); //ends geolocation



    /*
    $scope.hrentrega = function(){
      $scope.order.address.inmediato = inmediato.isChecked();
      console.log($scope.order.address.inmediato);
    }
*/
    function trackLocation(lat, lng){
      $scope.order.address_coord_lat = lat;
      $scope.order.address_coord_long = lng;
      cfpLoadingBar.start();
      $scope.geocoder.geocode({ 'latLng': new google.maps.LatLng(lat, lng) }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                  $scope.order.address_general = results[0].formatted_address;
                  cfpLoadingBar.complete();
              } else {
                  $scope.order.address_general =  'No encontramos tu dirección';
                  cfpLoadingBar.complete()
              }
          } else {
              $scope.order.address_general =  'Error: ' + status;
          }
      });
    }







        function createOrder(){
          console.log("Creando orden: " + JSON.stringify($scope.order, null, 4));
          OrdersSvc.createOrder($scope.order).then(function(result){
            console.log('Orden creada. Items de la orden: '+$scope.cartItems.length);
            for(var i=0; i<$scope.cartItems.length;i++){

              var orderItem = {
                order_id: result.data,
                product_refId: $scope.cartItems[i].refId,
                product_price: $scope.cartItems[i].new_price,
                product_quantity: parseInt($scope.cartItems[i].quantity),
                product_name: $scope.cartItems[i].name,
                product_category: $scope.cartItems[i].category_name
              }
              console.log(orderItem);
              OrderItemSvc.create(orderItem).then(function(result){
                console.log('item id : ', result.data);
              });
            }
              menu.setMainPage('app/view/cuenta.html');
          });
          ShoppingCartSvc.clear();
        }



        // PAY
        $scope.pay = function(){
          console.log('Pagar');
          PayPalMobile.renderSinglePaymentUI(PaypalSvc.createPayment($scope.order.total_amount), onSuccesfulPayment, onUserCanceled);
        }


        function onSuccesfulPayment(payment) {
         	console.log("payment success: " + JSON.stringify(payment, null, 4));
         	createOrder();
       	}
       	function onAuthorizationCallback(authorization) {
         	console.log("authorization: " + JSON.stringify(authorization, null, 4));
       	}
       	function onUserCanceled(authorization) {
         	console.log("canceled: " + JSON.stringify(authorization, null, 4));
       	}


        if(typeof PayPalMobile != 'undefined'){ PaypalSvc.initPaymentUI(); }





});
