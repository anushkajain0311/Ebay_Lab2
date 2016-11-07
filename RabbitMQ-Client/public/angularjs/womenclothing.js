/**
 * New node file
 */
var womenclothing = angular.module('womenclothing',['ui.router']);

womenclothing.config(function($stateProvider){
	$stateProvider.state('womenclothing',{
		url:'womenclothing',
		views:{
			'content':{
				templateUrl:'templates/womenclothing.ejs',
				controller:'womenclothing'
			}
		}
	}
	);
	
});
womenclothing.controller('womenclothing',['$scope','$http',function($scope,$http){
	
	$scope.getData=function(){
		$http({
			url:'/getdata',
			method:"post",
			data:{
				
			}
		}).success(function(data){
	    	  console.log("in success");
	    	  console.log(data);
	    	  if(data.productlist){
	    		  
	    		  $scope.productlist= data.productlist;
	    	
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
	    		  window.location.assign("/womenclothing");
	    	  }
	    	  //if(data.finalitems){
	    		  // add location.assign
	    	//	  $scope.finalpro= data.finalitems;
	    	//	  $scope.total = data.total;
	    	  //}
	    	  });
	    	  
	};  
	
	
	
}]);