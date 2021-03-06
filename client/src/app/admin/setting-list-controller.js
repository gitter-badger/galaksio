/*
* (C) Copyright 2016 SLU Global Bioinformatics Centre, SLU
* (http://sgbc.slu.se) and the B3Africa Project (http://www.b3africa.org/).
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the GNU Lesser General Public License
* (LGPL) version 3 which accompanies this distribution, and is available at
* http://www.gnu.org/licenses/lgpl.html
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* Lesser General Public License for more details.
*
* Contributors:
*     Rafael Hernandez de Diego <rafahdediego@gmail.com>
*     Tomas Klingström
*     Erik Bongcam-Rudloff
*     and others.
*
* THIS FILE CONTAINS THE FOLLOWING MODULE DECLARATION
* - AdminController
*
*/
(function(){
	var app = angular.module('admin.controllers.setting-list', [
		'ui.bootstrap',
		'ang-dialogs',
		'ui.router'
	]);

	/******************************************************************************
	*       _____ ____  _   _ _______ _____   ____  _      _      ______ _____   _____
	*      / ____/ __ \| \ | |__   __|  __ \ / __ \| |    | |    |  ____|  __ \ / ____|
	*     | |   | |  | |  \| |  | |  | |__) | |  | | |    | |    | |__  | |__) | (___
	*     | |   | |  | | . ` |  | |  |  _  /| |  | | |    | |    |  __| |  _  / \___ \
	*     | |___| |__| | |\  |  | |  | | \ \| |__| | |____| |____| |____| | \ \ ____) |
	*      \_____\____/|_| \_|  |_|  |_|  \_\\____/|______|______|______|_|  \_\_____/
	*
	******************************************************************************/
	app.controller('AdminController', function($state, $rootScope, $scope, $http, $uibModal, $dialogs, APP_EVENTS){
		/******************************************************************************
		*       ___ ___  _  _ _____ ___  ___  _    _    ___ ___
		*      / __/ _ \| \| |_   _| _ \/ _ \| |  | |  | __| _ \
		*     | (_| (_) | .` | | | |   / (_) | |__| |__| _||   /
		*      \___\___/|_|\_| |_|_|_|_\\___/|____|____|___|_|_\
		*        | __| | | | \| |/ __|_   _|_ _/ _ \| \| / __|
		*        | _|| |_| | .` | (__  | |  | | (_) | .` \__ \
		*        |_|  \___/|_|\_|\___| |_| |___\___/|_|\_|___/
		*
		******************************************************************************/

		/**
		* This function retrieves the current settings for the application.
		*
		* @chainable
		* @return {Object} the controller.
		*/
		this.retrieveSettings = function(){
			//GET THE EXTRA INFORMATION FOR THE HISTORY (datasets)
			$http($rootScope.getHttpRequestConfig("GET", "setting-list")).then(
				function successCallback(response){
					$scope.settings = response.data.settings;
					var regInteger = /^\d+$/;

					for(var i in $scope.settings){
						//TRY TO PARSE AS A NUMBER
						if(regInteger.test($scope.settings[i])){
							$scope.settings[i] = Number.parseInt($scope.settings[i]);
						}else if($scope.settings[i].toLowerCase && ($scope.settings[i].toLowerCase() === "true" || $scope.settings[i].toLowerCase() === "false")){
							$scope.settings[i] = $scope.settings[i].toLowerCase() === "true";
						}
					}

					if($scope.settings["AUTO_INSTALL"]){
						me.updateSettingsHandler();
					}
				},
				function errorCallback(response){
					debugger;
					var message = "Failed when retrieving the list of settings.";
					$dialogs.showErrorDialog(message, {
						logMessage : message + " at AdminController:retrieveSettings."
					});
					console.error(response.data);
					document.location.replace("/");
				}
			);
			return this;
		};

		/******************************************************************************
		*            _____   _____ _  _ _____
		*           | __\ \ / / __| \| |_   _|
		*           | _| \ V /| _|| .` | | |
		*      _  _ |___| \_/_|___|_|\_| |_| ___  ___
		*     | || | /_\ | \| |   \| |  | __| _ \/ __|
		*     | __ |/ _ \| .` | |) | |__| _||   /\__ \
		*     |_||_/_/ \_\_|\_|___/|____|___|_|_\|___/
		*
		******************************************************************************/

		/**
		* This function updates the settings for the server
		*
		* @chainable
		* @return {Object} the controller.
		*/
		this.updateSettingsHandler = function(){
			$scope.isLoading = true;
			if(!($scope.settings.ADMIN_ACCOUNTS instanceof Array)){
				$scope.settings.ADMIN_ACCOUNTS = $scope.settings.ADMIN_ACCOUNTS.replace(/ /g, "").split(",");
			}

			$http($rootScope.getHttpRequestConfig("POST", "setting-update", {data: $scope.settings})).then(
				function successCallback(response){
					$dialogs.showSuccessDialog("Settings successfully updated. You may need to restart the server to apply the changes.", {
						logMessage : "Settings updated at AdminController:retrieveHistoryData.",
						callback : function(){
							$rootScope.$broadcast(APP_EVENTS.logoutRequired);
						}
					});
					$scope.isLoading = false;
				},
				function errorCallback(response){
					$scope.isLoading = false;

					debugger;
					var message = "Failed when updating the settings.";
					$dialogs.showErrorDialog(message, {
						logMessage : message + " at AdminController:updateSettings."
					});
					console.error(response.data);
				}
			);
			return this;
		};

		/******************************************************************************
		*      ___ _  _ ___ _____ ___   _   _    ___ ____  _ _____ ___ ___  _  _
		*     |_ _| \| |_ _|_   _|_ _| /_\ | |  |_ _|_  / /_\_   _|_ _/ _ \| \| |
		*      | || .` || |  | |  | | / _ \| |__ | | / / / _ \| |  | | (_) | .` |
		*     |___|_|\_|___| |_| |___/_/ \_\____|___/___/_/ \_\_| |___\___/|_|\_|
		*
		******************************************************************************/
		var me = this;
		setTimeout(function(){
			me.retrieveSettings();
		},4000);


	});//end controller
})();//end wrapper
