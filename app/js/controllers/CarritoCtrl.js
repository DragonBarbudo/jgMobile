moduleapp.controller('CarritoCtrl', function ($scope, ShoppingCartSvc, SettingSvc, StoreLocalSvc, ProductsSvc, PaypalSvc, geolocation, UtilsSvc, $rootScope) {


    $rootScope.retorno = false;
    $scope.total = [];

    $scope.cartItems = ShoppingCartSvc.getCart();
    $scope.url = SettingSvc.getPhotoUrl();
    $scope.cartCount;

    $scope.order = {
  		code: UtilsSvc.createRandomCode(),
  		date_time: UtilsSvc.formatDate(new Date(), "dddd h:mmtt d MMM yyyy"),
  		customer_firstname: "",
  		customer_lastname: "",
  		customer_email_address: "",
  		customer_country : "",
  		customer_city: "",
  		customer_address: "",
  		customer_zipcode : "",
  		customer_phone_number: "",
  		customer_note : "",
  		total_amount : 0,
  		customer_shipping_class: "",
  		customer_shipping_price: "",
  		payment_type: ""
  	}

    $scope.carous = [];

    $scope.cantidades = [0, 1,2,3,4,5,6,7,8,9,10];


    getTotalAmount();


    function updateCart(){
  		$scope.cartItems = ShoppingCartSvc.getCart();
      getTotalAmount();
      localStorageService.set('cart',ShoppingCartSvc.getCart());
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
      if(qty == 0){
        $scope[itemindx].next();
      }
    }
    $scope.setQty = function(item, qty, itemindx){
      ShoppingCartSvc.setQuantity(item, qty);
      item.subTotal = item.quantity * item.new_price;
      updateCart();
      if(qty == 0){
        $scope[itemindx].next();
      }
    }

    $scope.deleteFirst = function(itemindx){
      $scope[itemindx].next();
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



      $scope.registroCarrito = function(){
        $rootScope.retorno = true;
        menu.setMainPage('app/view/cuenta.html');
      }


      $scope.clean = function(str){
    str = str.replace( /\[(.+?)\]/g , '' );
    return str;
  }

});
