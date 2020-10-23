const app = angular.module('plannerApp', ['ngSanitize', 'ui.bootstrap', 'ui.router']);
  app.config(function($stateProvider, $urlRouterProvider){
      $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('home',{
      url: '/',
      templateUrl:'index.html'
    })
    .state('projects',{
      url: '/projects',
      templateUrl: 'projects.html'
    })
    .state('tasks',{
      url: '/tasks',
      templateUrl: 'tasks.html'
    });
  });
  app.controller('PlannerCtrl', function ($uibModal, $log, $scope, $http) {
    $scope.projects = [];
    $scope.tasks = [];
    $scope.slctdPrjctId = null;

    //Get projects
    function getProjects() {
      $http.get('/api/projects').then((response) => { 
        $scope.projects = response.data;
      });
    }
    getProjects();

    //get selected projects tasks
    function getTasks(id) {
      $http.get(`/api/projects/${id}/tasks`).then((response) => { 
        console.log(response.data);
        $scope.tasks = response.data;
      });
    }
    getTasks(2);

    $scope.selectProject = function(projectId){
      $scope.slctdPrjctId = projectId;
      console.log($scope.slctdPrjctId);
    }




    $scope.removeItem = function (task) {
          //$scope.table.splice(index, 1);
          $http.delete(`/api/projects/${$scope.slctdPrjctId}/tasks/${task.id}`).then(() =>
            getTasks());
        };

    $scope.toggleCheck = function (task) {
      $http.put(`/api/projects/${$scope.slctdPrjctId}/tasks/check/${task.id}`, { isChecked: !task.isChecked }).then(() => {
        getTasks();
      });

    };

    $scope.openAddModal = function () {
      var addModalInstance = $uibModal.open({
        templateUrl: '../modal/add-item-modal.html',
        controller: 'AddItemModalController'
      });

      addModalInstance.result.then(function (selectedInfo) {
        $http.post(`/api/projects/${$scope.slctdPrjctId}/tasks`, selectedInfo).then(() => {
          getTasks();
        });

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.openEditModal = function (task) {
      var editModalInstance = $uibModal.open({
        templateUrl: '../modal/edit-item-modal.html',
        controller: 'EditItemModalControler',
        resolve: {
          task: () => { return task;}
        }
      });

      editModalInstance.result.then(function (editedTask){
        $http.put(`/api/projects/${$scope.slctdPrjctId}/tasks/${task.id}`,editedTask).then(() => getTasks());
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