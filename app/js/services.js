moduleapp.factory("SettingSvc", function(){
	//Your Website URL
	var url = 'http://dbo.space/jagergin';
	function getRootUrl(){
		return url + '/cms/api';
	}
	function getPhotoUrl(){
		return url + '/cms/api/imageFiles/';
	}
	return {
	    getRootUrl : getRootUrl,
	    getPhotoUrl : getPhotoUrl
	};
});


moduleapp.factory("StoreLocalSvc", function(){
	function get(){
		var setting = {
			"currency" : "$",
			"logo" : "assets/images/jagergin_imago.svg",
			"name" : "JagerGin",

			"viewsUrl" : "app/app-pages",

			"payPalSandbox" : "AS1LaPmotXY-rYhKIwcvqdokB1hhSN817_OP4j61F3Jhxx3MbmJI61nVj6isEnJ3bnUTRt52S21oRfMG",
			"payPalProduction" : "YOUR_PRODUCTION_CLIENT_ID"
		}
		return setting;
	}
	function ui(){
		var ui = {
			"pageEffect" : "slide"
		}
		return ui;
	}
	return {
	    get : get,
	    ui : ui
	};
});




//PRIDUCTSSVC

moduleapp.factory("ProductsSvc", function($q, $http, SettingSvc){
		function create(product){
			var deferred = $q.defer();
			$http({
	            method: "POST",
	            data : product,
	            url: SettingSvc.getRootUrl() + "/v1/products/",
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function findById(id){
			var deferred = $q.defer();
			$http({
	            method: "GET",
	            url: SettingSvc.getRootUrl() + "/v1/products/" + id,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function remove(id){
			var deferred = $q.defer();
			$http({
	            method: "POST",
	            url: SettingSvc.getRootUrl() + "/v1/products_delete/" + id,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function list(offset, limit, timer){
			var deferred = $q.defer();
			$http({
	            method: "GET",
	            timeout: timer,
	            url: SettingSvc.getRootUrl() + "/v1/products/" + offset + "/" + limit,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function findByCategoryId(catId){
			var deferred = $q.defer();
			$http({
	            method: "GET",
	            url: SettingSvc.getRootUrl() + "/v1/products_category/" + catId,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function searchByName(search){
			console.log(search);
			var deferred = $q.defer();
			$http({
	            method: "GET",
	            timeout: deferred.promise,
	            url: SettingSvc.getRootUrl() + "/v1/search_products/" + search,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function update(product, id){
			var deferred = $q.defer();
			$http({
	            method: "POST",
	            data : product,
	            url: SettingSvc.getRootUrl() + "/v1/products_update/" + id,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function count(){
			var deferred = $q.defer();
			$http({
	            method: "GET",
	            url: SettingSvc.getRootUrl() + "/v1/count_products",
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function uploadImage(fd){
			var deferred = $q.defer();
			$http({
	            method: "POST",
	            url: SettingSvc.getRootUrl() + "/v1/product_upload_image",
	            data:fd,
	            headers: {'Content-Type': undefined}
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function removeImage(url){
			var deferred = $q.defer();
			$http({
	            method: "GET",
	            url: SettingSvc.getRootUrl() + "/v1/product_remove_image/" + url,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		return {
		    create : create,
		    findById : findById,
		    remove : remove,
		    list : list,
		    findByCategoryId : findByCategoryId,
		    searchByName : searchByName,
		    update : update,
		    count : count,
		    uploadImage : uploadImage,
		    removeImage : removeImage
		};
	});




//CATEGORIESSVC


moduleapp.factory("CategoriesSvc", function($q, $http, SettingSvc){
		function create(category){
			var deferred = $q.defer();
			$http({
	            method: "POST",
	            data : category,
	            url: SettingSvc.getRootUrl() + "/v1/categories",
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function findById(id){
			var deferred = $q.defer();
			$http({
	            method: "GET",
	            url: SettingSvc.getRootUrl() + "/v1/categories/" + id,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function remove(id){
			var deferred = $q.defer();
			$http({
	            method: "POST",
	            url: SettingSvc.getRootUrl() + "/v1/categories_delete/" + id,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function list(){
			var deferred = $q.defer();
			$http({
	            method: "GET",
	            url: SettingSvc.getRootUrl() + "/v1/categories",
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function update(category, id){
			var deferred = $q.defer();
			$http({
	            method: "POST",
	            data : category,
	            url: SettingSvc.getRootUrl() + "/v1/categories_update/" + id,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		return {
		    create : create,
		    findById : findById,
		    remove : remove,
		    list : list,
		    update : update,
		};
	});



//SHOPPINGCART

moduleapp.factory("ShoppingCartSvc", function($window, $cookieStore){
		/*
		** pid
			quantity
			specs
			spec_title: "",
			spec_value: ""
		*/

		var cartItems = [];
		function isExist(id,spec_v){
			_isExist = false;
			if(cartItems == null)
				cartItems.length = 0;
			for(var i = 0; i < cartItems.length; i++){
				if(cartItems[i].pid == id){
					if(cartItems[i].spec_value == spec_v)
					{
						_isExist = true;
					}
				}
			}
			return _isExist;
		}
		function addItem(item){
			cartItems.push(item);
			return true;
		}
		function getCart(){
			return cartItems;
		}
		function removeItem(item){
			for(var i = 0; i < cartItems.length; i++){
				if(cartItems[i].id == item.id && cartItems[i].spec_value == item.spec_value){
					cartItems.splice(i, 1);
				}
			}
		}
		function increaseQuantity(item){
			for(var i = 0; i < cartItems.length; i++){
				if(cartItems[i].id == item.id && cartItems[i].spec_value == item.spec_value){
					cartItems[i].quantity ++;
				}
			}
		}
		function decreaseQuantity(item){
			for(var i = 0; i < cartItems.length; i++){
				if(cartItems[i].id == item.id && cartItems[i].spec_value == item.spec_value){
					if(cartItems[i].quantity > 1)
						cartItems[i].quantity --;
				}
			}
		}
		function count(){
			if(cartItems == null)
				return 0;
			else
				return cartItems.length;
		}
		function clear(){
			cartItems = [];
		}
		return {
			addItem:addItem,
			getCart:getCart,
			removeItem:removeItem,
			increaseQuantity:increaseQuantity,
			decreaseQuantity:decreaseQuantity,
			count:count,
			isExist:isExist,
			clear: clear
		};
	});




	moduleapp.factory("PaypalSvc", function(StoreLocalSvc){
		function initPaymentUI(){
	 		var clientIDs = {
	       "PayPalEnvironmentProduction": StoreLocalSvc.get().payPalProduction,
	       "PayPalEnvironmentSandbox": StoreLocalSvc.get().payPalSandbox
	     	};
	     	PayPalMobile.init(clientIDs, onPayPalMobileInit);
	 	}

	   function createPayment(total_price) {
	     var paymentDetails = new PayPalPaymentDetails(total_price, "0.00", "0.00");
	     var payment = new PayPalPayment(total_price, StoreLocalSvc.get().currency, "Your Orders", "Sale", paymentDetails);
	     return payment;
	   }
	   function configuration() {
	     var config = new PayPalConfiguration({merchantName: StoreLocalSvc.get().name, merchantPrivacyPolicyURL: "https://mytestshop.com/policy", merchantUserAgreementURL: "https://mytestshop.com/agreement"});
	     return config;
	   }
	   function onPayPalMobileInit() {
	     PayPalMobile.prepareToRender("PayPalEnvironmentSandbox", configuration());
	   }
	   function onUserCanceled(result) {
	     console.log(result);
	   }

		return {
		    initPaymentUI : initPaymentUI,
		    createPayment : createPayment,
		    configuration : configuration,
		    onPayPalMobileInit: onPayPalMobileInit,
		};
	});
