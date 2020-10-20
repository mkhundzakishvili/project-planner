const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const getTasks = require('../../Tasks').getTasks;
const setTasks = require('../../Tasks').setTasks;


//Get all tasks
router.get('/', (req, res) =>{
    const tasks = getTasks();

    res.json(tasks);
});


//get single task
router.get('/:id', (req, res) => {
    const tasks = getTasks();

    const found = tasks.some(task => task.id === parseInt(req.params.id));
    
    if(found){
        res.json(tasks.filter(task => task.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({ msg: `არ არსებობს ამ ID - ით წევრი!`});
    }
});

//Create Task
router.post('/', (req, res) => {
    const tasks = getTasks();
    
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
    res.json(newTask);
    
});


//Edit task
router.put('/:id', (req, res) => {
    const tasks = getTasks();
    
    const found = tasks.some(task => task.id === req.params.id);
    

    if(found){
        const editTask = req.body;
        tasks.forEach(task => {
            if(task.id === req.params.id){
                task.title = editTask.title;
                task.text = editTask.text;
            }
        });
        
        setTasks(tasks);
        res.json(tasks);
    }
});


//Check Task
router.put('/check/:id', (req, res) => {
    const tasks = getTasks();

    const found = tasks.some(task => task.id === req.params.id);
    
    if(found){
        const checkTask = req.body;
        tasks.forEach(task =>{
            if(task.id === req.params.id){
                task.isChecked = checkTask.isChecked;
            
                res.json({msg: 'task is checked', task});
            }
        });
        setTasks(tasks);
    } else {
        res.status(400).json({ msg: `არ არსებობს ამ ID - ით წევრი!`});
    }
});

//Delete task
router.delete('/:id', (req, res) => {
    const tasks = getTasks();
    const found = tasks.some(task => task.id === req.params.id);
    
    if(found){
        setTasks(tasks.filter(task => task.id !== req.params.id));
        res.json({ 
            msg: 'task deleted'
        });
    } else {
        res.status(400).json({ msg: `არ არსებობს ამ ID - ით წევრი!`});
    }
});


module.exports = router;