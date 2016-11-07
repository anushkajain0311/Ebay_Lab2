var app= angular.module("Ebay");

app.controller('addtocart',['$scope','$http',function($scope,$http){

$scope.getData=function(){
	$http({
		url:'/getdata',
		method:"post",
		data:{
			
		}
	}).success(function(data){
    	  console.log("in success of add to cart");
    	  console.log(data.result);
    	  if(data.result){
    		   $scope.productlist= data.result;
    		   console.log("this is getdata" + JSON.stringify($scope.productlist));
    	  }
	});
};

$scope.addtocart = function(items){
	$http({
        url:'/addtocart',
        method:"POST",
        data : {
          items : items
        }
      }).success(function(data){
    	  console.log("in success");
    	  console.log(data);
    	  if(data=="womenclothing"){
    		  //window.location.assign("/womenclothing");
    	  }
    	  
    	  });
    	  
};  
}]);

app.controller('getcart',['$scope','$http','$state', function($scope,$http, $state){

	var random,total=0;
	$scope.total; 
	$scope.person;
	$scope.cartdata;
		
	$scope.getcartdata= function(){
		$http({
			url:'/getcartdata',
			method:"post",
			data:{
				
			}
		}).success(function(data){
	    	  console.log("in success of getcartdata");
	    	  console.log(data);
	    	  console.log(data[0].email);
	    	  if(data){
	    		  console.log(data[0]);
	    		  //$scope.cartdata=data[0].cart;
	    		  $scope.cartdata=data;
	    		  console.log("This is cartdata:----");
	    		  //console.log(JSON.stringify($scope.cartdata));
	    		  //$scope.cartlist=data[0].cart;
	    		  $scope.cartlist=data;
	    	  //$scope.total = 0;
	    	  //}
	    	  }
		});
	};
	
	$scope.getvalues=function(x){
		console.log("Changed function called:");
		var price= x.productprice;
		var quantity = this.number;
		var subtotal;
		//console.log(quantity);
		if(quantity===1){
			subtotal=0;
			console.log("Inside if");
			 subtotal= price * quantity;
			 this.subtotal = subtotal;
		}
		else{
			console.log("inside else");
			subtotal=+price;
			this.subtotal = subtotal;
			
		}
		//var subtotal= price * quantity;
		console.log(subtotal);
		//this.subtotal= (price * quantity);
		total+=subtotal;
		$scope.total=total;
		for(var k=0;k<$scope.cartdata.length;k++){
		if($scope.cartdata[k].productId=== x.productId){
			$scope.cartdata[k].quantityneeded= quantity;
			console.log("this is the changed quantity in ng-change function"+ $scope.cartdata[k].quantityneeded);
		}
		}
		
	};
	$scope.removeitemfromcart=function(x){
		//console.log("Inside remove items");
			 x=x;
			 var n = this.number;
			 console.log("this is the value of quantity:" + n);
			 console.log("Before doing anything in removing items:---"+ JSON.stringify($scope.cartdata));
   			 var cartdata=$scope.cartdata;
   			 total=$scope.total;
   			 console.log("this is total before splicing:" +total);
   		 console.log(JSON.stringify(cartdata));
   		for(var i =0; i<cartdata.length;i++){
   			if(cartdata[i].productId === x.productId){
   				console.log("Its Working @" + i);
   				 total=total-(cartdata[i].productprice * n);
   			console.log("this is total after splicing:" +total);
   				cartdata.splice(i,1);
   			}
   		}
   		console.log("After splicing:");
   		console.log(cartdata);
   		 $scope.cartdata=cartdata;
   		 console.log("cartdata after splicing:" + JSON.stringify($scope.cartdata));
   		 random=total;
   		$scope.total = total;
   		console.log("this is value of random:"+ random);
	};
	
	$scope.proceedtocheckout=function(){
		console.log($scope.cartdata);
		$http({
			url:'/checkoutdata',
			method:'post',
			data:{
					cartdata:$scope.cartdata
				}
		}).success(function(data){ 
			console.log(JSON.stringify(data));
			//window.location.assign("/checkout");
			$state.go('checkout');
		});
	};
	
	$scope.checkoutdisplay= function(){
		$scope.message = false;
		console.log("calling checkoutdisplay");
		$http({
			url:'/checkoutdisplay',
			method:'post',
			data:{
				
			}
		}).success(function(data){
			console.log("i m in success of displaycheckout");
			console.log(data);
			$scope.firstname=data.user.firstName;
			$scope.lastname=data.user.lastName;
			$scope.address= data.user.address;
			if(data.data == "Have details"){
				$scope.cardnumber=data.user.card.cardnumber;
				$scope.date=data.user.card.date;
				$scope.cvv=data.user.card.cvv;
			}
			else{
					console.log("hi anushka ");
					$scope.msg=data.data;
					$scope.message = true;
			}
			console.log("this is value of random:"+ random);
			console.log("This is total: -----" + $scope.total);
			//$scope.user=data.user;
			//$scope.person=data.user;
			$scope.items = data.user.cart;
			$scope.total=total;
		});
	};
	
	$scope.complete = function(req, res){
		$http({
			url:'/complete',
			method:'get'
		}).success(function(data){
			console.log("this data is from complete success" + data);
			$state.go('transactionComplete');
		});
	};
	
	/*$scope.creditcarddetails=function(){
		$scope.message = false;
		console.log("I m inside creditcarddetails");
		$http({
			url:'/loadcarddetails',
			method: 'get',
			data:{
				
			}
		}).success(function(data){
			console.log("I m in credit card details angular function");
			if(data === "Enter credit card details"){
				$scope.msg=data;
				$scope.message = true;
			}
			else{
				console.log(JSON.stringify(data.card[0].address));
				$scope.cardnumber=data.card[0].cardnumber;
				$scope.date=data.card[0].date;
				$scope.cvv=data.card[0].cvv;
				$scope.firstname=$scope.person[0].firstname;
				$scope.lastname=$scope.person[0].lastname;
				$scope.address= data.card[0].address;
				}
		});
	};*/
}]);

app.controller('profile',['$scope','$http','$state', function($scope,$http, $state){
	
	$scope.getProfileData= function(){
		$http({
	
		url:'/profile',
		method:'post',
		data:{
			
		}
	}).success(function(data){
		if(data){
			console.log("from profile controller" + JSON.stringify(data.product_to_sell));
			$scope.email=data.email;
			$scope.firstname = data.firstName;
			$scope.lastname = data.lastName;
			$scope.phone = data.phone;
			$scope.address = data.address;
			$scope.birthday = data.dateOfBirth;
			$scope.productlist = data.product_to_sell;
			$scope.purchasehistory = data.purchaseHistory;
			$scope.cardnumber = data.card.cardnumber;
			$scope.expires = data.card.date;
			console.log("this is productToSell"+ JSON.stringify(data.card.cardnumber));
		}
		});
	};
}]);

app.controller('auction',['$scope','$http','$state', function($scope,$http, $state){
	
	$scope.date = new Date();
	$scope.getBiddingData= function(){
		$http({
	
		url:'/womenBidding',
		method:'post',
		data:{
			
		}
	}).success(function(data){
		if(data){
			
			$scope.list = data;
			console.log("from auction controller" + JSON.stringify(data[0]));
			console.log($scope.date.getTime());
			console.log(data[0].bidCloses.getTime());
			console.log("from auction controller" + JSON.stringify($scope.list));
		}
		});
	};
}]);