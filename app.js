const app = angular.module('taskApp', ['ngSanitize', 'ui.bootstrap', 'ui.router']);
  app.config = (function($stateProvider,$urlRouterProvider){
      $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('home',{
      url:'/',
      template:'<h1>this is home page</h1>'
    })
    .state('list',{
      url:'/list',
      templateUrl:'../index.html'
    });
  });
  app.controller('TableDemoCtrl', function ($uibModal, $log, $scope, $http) {
    $scope.tasks = [];

    //resolve table
    function getTasks() {
      $http.get('/api/tasks').then((response) => { 
        $scope.tasks = response.data;
      });
    }

    getTasks();

    $scope.removeItem = function (task) {
          //$scope.table.splice(index, 1);
          $http.delete(`/api/tasks/${task.id}`).then(() =>
            getTasks());
        };

    $scope.toggleCheck = function (task) {
      $http.put(`/api/tasks/check/${task.id}`, { isChecked: !task.isChecked }).then(() => {
        getTasks();
      });

    };

    $scope.openAddModal = function () {
      var addModalInstance = $uibModal.open({
        templateUrl: 'add-item-modal.html',
        controller: 'AddItemModalController'
      });

      addModalInstance.result.then(function (selectedInfo) {
        $http.post('/api/tasks', selectedInfo).then(() => {
          getTasks();
        });

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.openEditModal = function (task) {
      var editModalInstance = $uibModal.open({
        templateUrl: 'edit-item-modal.html',
        controller: 'EditItemModalControler',
        resolve: {
          task: () => { return task;}
        }
      });

      editModalInstance.result.then(function (editedTask){
        $http.put(`/api/tasks/${task.id}`,editedTask).then(() => getTasks());
      }, function() {
        $log.info(`task with ID:${task.id} edited: ` + new Date())
      });
        
    };
    

  });

  app.controller('AddItemModalController', function ($uibModalInstance, $scope) {

    $scope.submit = function () {
      $uibModalInstance.close({ title: $scope.title, text: $scope.text });
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    }
  });

  app.controller('EditItemModalControler', function ($uibModalInstance, $scope, task){
    $scope.title = task.title;
    $scope.text = task.text;
    

    $scope.edit = function (){
      $uibModalInstance.close({ title: $scope.title, text: $scope.text });
    }
    $scope.cancel = function () { 
      $uibModalInstance.dismiss();
    }
  });