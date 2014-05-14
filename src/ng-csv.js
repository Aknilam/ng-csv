/**
 * author: michalvvv: https://github.com/michalvvv
 *
 * requires https://code.google.com/p/jquery-csv/
 */

var ngCsv = angular.module('ng-csv', []);

//<input type="file" ng-select-file="setFiles($files)" />

ngCsv.factory('ng-csv', ['$rootScope', function($rootScope) {
	var ngCSV = {
		filesList: [],

		_checkFile: function(file, callback) {
			if (angular.isFunction(callback)) {
				if (angular.isUndefined(file)) {
					file = filesList[0];
				}
				if (angular.isDefined(file)) {
					callback();
				}
			}
		},

		readFileToArrays: function(file) {
			ngCSV._checkFile(file, function() {
				ngCSV.readFile(file, function(content) {
					return ngCSV.toArrays(content);
				});
			});
		},

		readFileToObjects: function(file, config) {
			ngCSV._checkFile(file, function() {
				ngCSV.readFile(file, function(content) {
					return ngCSV.toObjects(content, config);
				});
			});
		},

		toArrays: function(csv) {
			try {
				return $.csv.toArrays(csv);
			} catch(e) {
			}
		},

		/**
		 * config is an array with keys for created objects
		 * keys should be in required order
		 *
		 */
		toObjects: function(csv, config) {
			var arrays = ngCSV.toArrays(csv);
			if (angular.isDefined(arrays)) {
				var result = [];
				angular.forEach(arrays, function(array) {
					var object = {};
					for (var i in config) {
						object[config[i]] = array[i];
					}
					result.push(object);
				});
				return result;
			}
		},


		readFile: function(file, callback) {
			try {
		        var reader = new FileReader();
		        reader.onload = function () {
		        	if(angular.isFunction(callback)) {
		        		callback(reader.result);
		        	}
		        	$rootScope.$apply(function() {
		        		$scope.plik = reader.result;
		    		});
		        };

				reader.readAsText(file);
			} catch (e) {
	        	if(angular.isFunction(callback)) {
	        		callback();
	        	}
			}
		},

		showList: function() {
			return ngCSV.filesList;
		}
	};
	$rootScope.$on('selectedFiles', function(files) {
		ngCSV.filesList = files;
	});
	return ngCSV;
}]);

ngCsv.directive("ngSelectFile", function() {
	return {
		link: function(scope, el) {
			el.bind('change', function(e){
				var files = (e.srcElement || e.target).files;
				scope.$root.$broadcast('selectedFiles', files);
			});
		}
	};
});