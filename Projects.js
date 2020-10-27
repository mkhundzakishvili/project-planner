let projects = [
    {
        id: 1,
        name: 'project 1',
        tasks: [
                    {
                        id: '1',
                        title: 'title1',
                        text: 'text1',
                        isChecked: false
                    },
                    {
                        id: '2',
                        title: 'title2',
                        text: 'text2',
                        isChecked: true
                    },
                    {
                        id: '3',
                        title: 'title3',
                        text: 'text3',
                        isChecked: true
                    }
                ]
    },
    {
        id: 2,
        name: 'project 2',
        tasks: [
                    {
                        id: '1',
                        title: 'title1',
                        text: 'text1',
                        isChecked: true
                    },
                    {
                        id: '2',
                        title: 'title2',
                        text: 'text2',
                        isChecked: false
                    },
                    {
                        id: '3',
                        title: 'title3',
                        text: 'text3',
                        isChecked: true
                    }
                ] 
    }
];



function getProjects(){
    return projects;
}
 
function setProjects(newProjects){
    projects = newProjects;
}

function getTasks(id){
    let tasks = null;
    projects.forEach((project) => {
        if(project.id === parseInt(id)){ 
            tasks = project.tasks;
        }
    });
    return tasks;
}

function setTasks(tasksObject, projectId){
    projects.forEach(project => {
        if(project.id === parseInt(projectId)){
            project.tasks = tasksObject;
        }
    });
}


module.exports = {
    getProjects,
    getTasks,
    setTasks,
    setProjects
};