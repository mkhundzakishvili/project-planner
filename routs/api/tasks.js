const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const getTasks = require('../../Projects').getTasks;
const setTasks = require('../../Projects').setTasks;
const getProjects = require('../../Projects').getProjects;
const setProjects = require('../../Projects').setProjects;


//Get all projects
router.get('/', (req, res) =>{
    const projects = getProjects();

    res.json(projects);
});

//Create new Project
router.post('/',(req, res) => {
    const projects = getProjects();

    const newProject = {
        id: uuid.v4(),
        name: req.body.name,
        tasks:[]
    };

    if(!newProject.name){
        return res.status(400).json({msg: 'please include a name'});
    }

    projects.push(newProject);
    setProjects(projects);
    res.json(projects);
});

//Edit project
router.put('/:id', (req, res) => {
    const projects = getProjects();

    const found = projects.some(project => project.id === req.params.id);

    if(found){
        const editProject = req.body;

        projects.forEach(project => {
            if(project.id === req.params.id){
                project.name = editProject.name;
            } 
        });
        setProjects(projects);
        res.json({msg: 'project has been edited'});
    }

});

//Get certain projects' tasks
router.get('/:projectId/tasks',(req, res) => {
    const tasks = getTasks(req.params.projectId);
    res.json(tasks);
});

//get single task
router.get('/:projectId/tasks/:taskId', (req, res) => {
    const tasks = getTasks(req.params.projectId);
    
    const found = tasks.some(task => task.id === req.params.taskId);
    
    if(found){
        res.json(tasks.filter(task => task.id === req.params.taskId));
    } else {
        res.status(400).json({ msg: `არ არსებობს ამ ID - ით წევრი!`});
    }
});

//Create Task
router.post('/:projectId/tasks', (req, res) => {
    const tasks = getTasks(req.params.projectId);
    
    const newTask = {
        id: uuid.v4(),
        title: req.body.title,
        text: req.body.text,
        isChecked: false
    }

    if(!newTask.title || !newTask.text){
        return res.status(400).json({msg: 'please include a title and text'});
    }

    tasks.push(newTask);
    setTasks(tasks,req.params.projectId);
    res.json(tasks);
    
});


//Edit task
router.put('/:projectId/tasks/:taskId', (req, res) => {
    const tasks = getTasks(req.params.projectId);
    
    const found = tasks.some(task => task.id === req.params.taskId);
    

    if(found){
        const editTask = req.body;
        tasks.forEach(task => {
            if(task.id === req.params.taskId){
                task.title = editTask.title;
                task.text = editTask.text;
            }
        });
        
        setTasks(tasks,req.params.projectId);
        res.json(tasks);
    }
});


//Check Task
router.put('/:projectId/tasks/:taskId/check', (req, res) => {
    const tasks = getTasks(req.params.projectId);

    const found = tasks.some(task => task.id === req.params.taskId);
    
    if(found){
        const checkTask = req.body;
        tasks.forEach(task =>{
            if(task.id === req.params.taskId){
                task.isChecked = checkTask.isChecked;
            
                res.json({msg: 'task is checked', task});
            }
        });
        setTasks(tasks,req.params.projectId);
    } else {
        res.status(400).json({ msg: `არ არსებობს ამ ID - ით წევრი!`});
    }
});

//Delete task
router.delete('/:projectId/tasks/:taskId', (req, res) => {
    let tasks = getTasks(req.params.projectId);
    const found = tasks.some(task => task.id === req.params.taskId);
    
    if(found){
        tasks = tasks.filter(task => task.id !== req.params.taskId);
        setTasks(tasks, req.params.projectId);
        
        res.json({ 
            msg: 'task deleted',
            tasks
        });
        
    } else {
        res.status(400).json({ msg: `არ არსებობს ამ ID - ით წევრი!`});
    }
});


module.exports = router;