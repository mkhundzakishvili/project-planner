const app = angular.module('plannerApp', ['ngSanitize', 'ui.bootstrap', 'ui.router']);
app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('projects', {
      url: '/',
      templateUrl: 'projects.html',
      controller: 'ProjectsController',
    })
    .state('tasks', {
      url: '/projects/{projectId}/tasks',
      templateUrl: 'tasks.html',
      controller: 'TasksController',
    });
});

app.controller('ProjectsController', function ($scope, $http, $uibModal, $log) {
  $scope.projects = [];
  //Get projects
  function getProjects() {
    $http.get('/api/projects').then((response) => {
      $scope.projects = response.data;
    });
  }
  getProjects();

  $scope.openAddProjectModal = function () {
    var addModalInstance = $uibModal.open({
      templateUrl: '../modal/add-project-modal.html',
      controller: 'AddProjectModalController'
    });

    addModalInstance.result.then(function (selectedInfo) {
      $http.post(`/api/projects`, selectedInfo).then(() => {
        getProjects();
      });

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.openEditProjectModal = function (project) {
    var editModalInstance = $uibModal.open({
      templateUrl: '../modal/edit-project-modal.html',
      controller: 'EditProjectModalController',
      resolve: {
        project: () => { return project; }
      }
    });

    editModalInstance.result.then(function (editedProject) {
      $http.put(`/api/projects/${project.id}`, editedProject).then(() => getProjects());
    }, function () {
      $log.info(`project with ID:${project.id} edited: ` + new Date())
    });

  };

});

app.controller('AddProjectModalController', function ($uibModalInstance, $scope) {

  $scope.submit = function () {
    $uibModalInstance.close({ name: $scope.name });
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  }
});

app.controller('EditProjectModalController', function ($uibModalInstance, $scope, project) {
  $scope.name = project.name;

  $scope.edit = function () {
    $uibModalInstance.close({ name: $scope.name });
  }
  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  }
});



app.controller('TasksController', function ($uibModal, $log, $scope, $http, $stateParams) {
  $scope.tasks = [];
  let projectId = $stateParams.projectId;


  //Get selected projects tasks
  function getTasks() {
    $http.get(`/api/projects/${projectId}/tasks`).then((response) => {
      $scope.tasks = response.data;
    });
  }

  getTasks();

  $scope.removeItem = function (task) {
    $http.delete(`/api/projects/${projectId}/tasks/${task.id}`).then(() =>
      getTasks());
  };

  $scope.toggleCheck = function (task) {
    $http.put(`/api/projects/${projectId}/tasks/${task.id}/check`, { isChecked: !task.isChecked }).then(() => {
      getTasks();
    });
  };

  $scope.clearTasks = function(){
    $scope.tasks = [];
    projectId = null;
  }

  $scope.openAddModal = function () {
    var addModalInstance = $uibModal.open({
      templateUrl: '../modal/add-item-modal.html',
      controller: 'AddItemModalController'
    });

    addModalInstance.result.then(function (selectedInfo) {
      $http.post(`/api/projects/${projectId}/tasks`, selectedInfo).then(() => {
        getTasks();
      });

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.openEditModal = function (task) {
    var editModalInstance = $uibModal.open({
      templateUrl: '../modal/edit-item-modal.html',
      controller: 'EditItemModalController',
      resolve: {
        task: () => { return task; }
      }
    });

    editModalInstance.result.then(function (editedTask) {
      $http.put(`/api/projects/${projectId}/tasks/${task.id}`, editedTask).then(() => getTasks());
    }, function () {
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

app.controller('EditItemModalController', function ($uibModalInstance, $scope, task) {
  $scope.title = task.title;
  $scope.text = task.text;


  $scope.edit = function () {
    $uibModalInstance.close({ title: $scope.title, text: $scope.text });
  }
  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  }
});