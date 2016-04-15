moduleapp.factory("SettingSvc", function(){
	//Your Website URL
	var url = 'https://dbo.space/jagergin';
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
			"currency" : "MXN",
			"logo" : "assets/images/jagergin_imago.svg",
			"name" : "JagerGin",

			"viewsUrl" : "app/app-pages",

			"payPalSandbox" : "AaNAb3q2ipAiLfJBiMcSTZ-cQWA_PvxhkmxhBqoZQ2z5Mys6qj9tB_euGd20tSRco2QfOkLkLVwO61Je",
			"payPalProduction" : "AYqK95EuSPivywD5MmpASfTf-2nTMW9ExnunOde9jqQJWQo2UJH2WFOPcdb1tvz5lF_3-Z1Gq041adiB"
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
		function setQuantity(item, qty){
			for(var i = 0; i < cartItems.length; i++){
				if(cartItems[i].id == item.id){
					cartItems[i].quantity = qty;
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
			clear: clear,
			setQuantity : setQuantity
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
	     var payment = new PayPalPayment(total_price, StoreLocalSvc.get().currency, "Tu pedido", "Venta", paymentDetails);
	     return payment;
	   }
	   function configuration() {
	     var config = new PayPalConfiguration({merchantName: StoreLocalSvc.get().name, merchantPrivacyPolicyURL: "http://jagergin.com/#/aviso-de-privacidad", merchantUserAgreementURL: "http://jagergin.com/#/terminos-de-servicio", acceptCreditCards: false, languageOrLocale:'es_MX'});
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





moduleapp.factory("UsersSvc", function($q, $http, SettingSvc){


	function listUsers(){
		var deferred = $q.defer();
		$http({
			method: "GET",
			url: SettingSvc.getRootUrl()+"/v1/users/",
			headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		}).then(function(result){
			deferred.resolve(result);
		});
		return deferred.promise;
	}

	function createUser(user){
		var deferred = $q.defer();
		$http({
			method: "POST",
			data: user,
			url: SettingSvc.getRootUrl()+"/v1/user_signup/",
			headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		}).then(function(result){
			deferred.resolve(result);
		});
		return deferred.promise;
	}

	function searchUser(email){
		var deferred = $q.defer();
		$http({
			method: "GET",
			url: SettingSvc.getRootUrl()+"/v1/search_user/"+email,
			headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		}).then(function(result){
			deferred.resolve(result);
		});
		return deferred.promise;
	}

	function searchClientId(idnumber){
		var deferred = $q.defer();
		$http({
			method: "GET",
			url: SettingSvc.getRootUrl()+"/v1/search_client_id/"+idnumber,
			headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		}).then(function(result){

			deferred.resolve(result);
		});
		return deferred.promise;
	}

	function loginUser(loginInfo){
		var deferred = $q.defer();
		$http({
			method: "POST",
			data: loginInfo,
			url: SettingSvc.getRootUrl()+"/v1/user_login/",
			headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		}).then(function(result){
			deferred.resolve(result);
		});
		return deferred.promise;
	}

	function updateUser(user, id){
		var deferred = $q.defer();
			$http({
	            method: "POST",
	            data : user,
	            url: SettingSvc.getRootUrl() + "/v1/user_update/" + id,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
	}

	return{
		listUsers: listUsers,
		createUser: createUser,
		searchUser: searchUser,
		loginUser: loginUser,
		updateUser: updateUser,
		searchClientId: searchClientId
	}

});





moduleapp.factory("OrderItemSvc", function($q, $http, SettingSvc){
		function create(order_item){
			var deferred = $q.defer();
			$http({
	            method: "POST",
	            data : order_item,
	            url: SettingSvc.getRootUrl() + "/v1/order_item",
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		return {
		    create : create,
		};
	});



moduleapp.factory("OrdersSvc", function($q, $http, SettingSvc){
		function createOrder(order){
			var deferred = $q.defer();
			$http({
	            method: "POST",
	            data : order,
	            url: SettingSvc.getRootUrl() + "/v1/createOrder/",
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
	            url: SettingSvc.getRootUrl() + "/v1/orders/" + id,
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
	            url: SettingSvc.getRootUrl() + "/v1/orders",
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function items(id){
			var deferred = $q.defer();
			$http({
	            method: "GET",
	            url: SettingSvc.getRootUrl() + "/v1/order_items/" + id,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}
		function search(search_text){
			var deferred = $q.defer();
			$http({
	            method: "GET",
	            url: SettingSvc.getRootUrl() + "/v1/search_orders/" + search_text,
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        	}).then(function (result) {
	            deferred.resolve(result);
	        });
			return deferred.promise;
		}

		return {
		    createOrder : createOrder,
		    findById : findById,
		    list : list,
		    items : items
		};
	});




moduleapp.factory("UtilsSvc", function(StoreLocalSvc){
		function hideKeyboard(){
			var field = document.createElement('input');
		    field.setAttribute('type', 'text');
		    document.body.appendChild(field);
		      setTimeout(function() {
		          field.focus();
		          setTimeout(function() {
		              field.setAttribute('style', 'display:none;');
		          }, 50);
		      }, 50);
		}
		function createRandomCode()
		{
		    var text = "";
		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

		    for( var i=0; i < 5; i++ )
		        text += possible.charAt(Math.floor(Math.random() * possible.length));

		    return text;
		}
		function formatDate(date, format, utc) {
		    var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		    function ii(i, len) {
		        var s = i + "";
		        len = len || 2;
		        while (s.length < len) s = "0" + s;
		        return s;
		    }

		    var y = utc ? date.getUTCFullYear() : date.getFullYear();
		    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
		    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
		    format = format.replace(/(^|[^\\])y/g, "$1" + y);

		    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
		    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
		    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
		    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
		    format = format.replace(/(^|[^\\])M/g, "$1" + M);

		    var d = utc ? date.getUTCDate() : date.getDate();
		    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
		    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
		    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
		    format = format.replace(/(^|[^\\])d/g, "$1" + d);

		    var H = utc ? date.getUTCHours() : date.getHours();
		    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
		    format = format.replace(/(^|[^\\])H/g, "$1" + H);

		    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
		    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
		    format = format.replace(/(^|[^\\])h/g, "$1" + h);

		    var m = utc ? date.getUTCMinutes() : date.getMinutes();
		    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
		    format = format.replace(/(^|[^\\])m/g, "$1" + m);

		    var s = utc ? date.getUTCSeconds() : date.getSeconds();
		    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
		    format = format.replace(/(^|[^\\])s/g, "$1" + s);

		    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
		    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
		    f = Math.round(f / 10);
		    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
		    f = Math.round(f / 10);
		    format = format.replace(/(^|[^\\])f/g, "$1" + f);

		    var T = H < 12 ? "AM" : "PM";
		    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
		    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

		    var t = T.toLowerCase();
		    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
		    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

		    var tz = -date.getTimezoneOffset();
		    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
		    if (!utc) {
		        tz = Math.abs(tz);
		        var tzHrs = Math.floor(tz / 60);
		        var tzMin = tz % 60;
		        K += ii(tzHrs) + ":" + ii(tzMin);
		    }
		    format = format.replace(/(^|[^\\])K/g, "$1" + K);

		    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
		    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
		    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

		    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
		    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

		    format = format.replace(/\\(.)/g, "$1");

		    return format;
		}
		function getObjSize(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		}
		function setTrueFormValidation(data){
			var validate_data = JSON.parse(JSON.stringify(data));
			for(var key in data){
				validate_data[key] = true;
			}
			return validate_data;
		}
		function formValidation(data){
			var validate_data = JSON.parse(JSON.stringify(data));
			var isAllValidate = false;
			var counter =0;
			for(var key in data){
				if(data[key] == "" || data[key] == 0 || data[key] == undefined){
					validate_data[key] = false;
				}
				else
					validate_data[key] = true;
			}
			for(var key in validate_data){
				if(validate_data[key] == true){
					counter++;
				}
				else
					counter--;
			}
			if(counter == getObjSize(validate_data))
				validate_data.validateAll = true;
			else
				validate_data.validateAll = false;
			return validate_data;
		}
		return {
		    hideKeyboard: hideKeyboard,
		    createRandomCode: createRandomCode,
		    formatDate : formatDate,
		    formValidation : formValidation,
		    getObjSize : getObjSize,
		    setTrueFormValidation : setTrueFormValidation
		};
	});
