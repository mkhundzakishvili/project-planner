const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const router = express.Router();
// const getTasks = require('../../Projects').getTasks;
// const setTasks = require('../../Projects').setTasks;
// const getProjects = require('../../Projects').getProjects;
// const setProjects = require('../../Projects').setProjects;




function updateProjects(newdata, callback) {
    let str = JSON.stringify(newdata);
    fs.writeFile("projects.json", str, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
        callback();
    });
}

function getProjects(callback) {
    fs.readFile("projects.json", "utf-8", (err, data) => {
        callback(JSON.parse(data));
    });
}


function getTasks(projectId, callback) {
    getProjects((projects) => {
        let tasks = null;
        projects.forEach((project) => {
            if (project.id === projectId) {
                tasks = project.tasks;
            }
        });
        callback(tasks);
    });
}

function setTasks(tasksObject, projectId, callback) {
    getProjects((projects) => {
        projects.forEach(project => {
            if (project.id === projectId) {
                project.tasks = tasksObject;
            }
        });
        updateProjects(projects, () => {
            callback();
        });
    });
}

//Get all projects
router.get('/', (req, res) => {
    getProjects((data) => {
        res.json(data);
    });

});

//Create new Project
router.post('/', (req, res) => {
    getProjects((projects) => {
        const newProject = {
            id: uuid.v4(),
            name: req.body.name,
            tasks: []
        };

        if (!newProject.name) {
            return res.status(400).json({ msg: 'please include a name' });
        }

        projects.push(newProject);
        updateProjects(projects, () => {
            res.json(projects);
        });
    });
});

//Edit project
router.put('/:id', (req, res) => {
    getProjects((projects) => {
        const found = projects.some(project => project.id === req.params.id);

        if (found) {
            const editProject = req.body;

            projects.forEach(project => {
                if (project.id === req.params.id) {
                    project.name = editProject.name;
                }
            });
            updateProjects(projects, () => {
                res.json({ msg: 'project has been edited' });
            });
        } else {
            res.json({ msg: 'project wasn\'t found' });
        }
    });
});

//Get certain projects' tasks
router.get('/:projectId/tasks', (req, res) => {
    getTasks(req.params.projectId, (tasks) => {
        res.json(tasks);
    });
});

//get single task
router.get('/:projectId/tasks/:taskId', (req, res) => {
    const tasks = getTasks(req.params.projectId, (tasks) => {
        const found = tasks.some(task => task.id === req.params.taskId);

        if (found) {
            res.json(tasks.filter(task => task.id === req.params.taskId));
        } else {
            res.status(400).json({ msg: `არ არსებობს ამ ID - ით წევრი!` });
        }
    });
});

//Create Task
router.post('/:projectId/tasks', (req, res) => {
    getTasks(req.params.projectId,(tasks)=>{
        const newTask = {
                id: uuid.v4(),
                title: req.body.title,
                text: req.body.text,
                isChecked: false
            }

            if (!newTask.title || !newTask.text) {
                res.status(400).json({ msg: 'please include a title and text' });
            } else {
                if (tasks === null) {
                    setTasks(newTask, req.params.projectId, ()=>{
                        res.json(newTask);
                    });
                } else {
                    tasks.push(newTask);
                    setTasks(newTask, req.params.projectId, ()=>{
                        res.json(newTask);
                    });
                    
                }
            }
    });
});


//Edit task
router.put('/:projectId/tasks/:taskId', (req, res) => {
    getTasks(req.params.projectId,(tasks)=>{
        const found = tasks.some(task => task.id === req.params.taskId);


        if (found) {
            const editTask = req.body;
            tasks.forEach(task => {
                if (task.id === req.params.taskId) {
                    task.title = editTask.title;
                    task.text = editTask.text;
                }
            });

            setTasks(tasks, req.params.projectId,()=>{
                res.json(tasks);
            });
        }
    });
});


//Check Task
router.put('/:projectId/tasks/:taskId/check', (req, res) => {
    getTasks(req.params.projectId,(tasks)=>{
        const found = tasks.some(task => task.id === req.params.taskId);

        if (found) {
            const checkTask = req.body;

            tasks.forEach(task => {
                if (task.id === req.params.taskId) {
                    task.isChecked = checkTask.isChecked;

                    res.json({ task });
                }
            });
            setTasks(tasks, req.params.projectId,()=>{
                res.json({msg: "task is checked"})
            });

        } else {
            res.status(400).json({ msg: `არ არსებობს ამ ID - ით წევრი!` });
        }   
    });
    
});

//Delete task
router.delete('/:projectId/tasks/:taskId', (req, res) => {
    getTasks(req.params.projectId,(tasks)=>{
        const found = tasks.some(task => task.id === req.params.taskId);

        if (found) {
            tasks = tasks.filter(task => task.id !== req.params.taskId);
            setTasks(tasks, req.params.projectId,()=>{
                res.json({
                    msg: 'task deleted',
                    tasks
                });    
            });
        } else {
            res.status(400).json({ msg: `არ არსებობს ამ ID - ით წევრი!` });
        }   
    });
});


module.exports = router;