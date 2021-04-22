const express = require('express');
const uuid = require('uuid');
const { Console } = require('console');
const router = express.Router();
const knex = require('../../db');



//Get all projects
router.get('/', (req, res) => {
    knex('projects').select().then((data) => res.json(data)).catch(err => res.status(400).json({ msg: 'NO projects available' }));
});

//Create new Project
router.post('/', (req, res) => {

    knex('projects').insert({
        name: req.body.name
    }).then(_ => res.json({ msg: 'project\'s been added' }))
        .catch(err => {
            res.status(400).json({ msg: 'UNABLE to create project!' });
        });
});

//Edit project
router.put('/:id', (req, res) => {

    knex('projects').where({
        id: req.params.id
    }).update({
        name: req.body.name
    }).then(_ => {
        res.json({ msg: `project with id:${req.params.id} has been updated.` })
    }).catch(err => res.status(400).json({ msg: `project with id:${req.params.id} was NOT updated!` }));
});

//Delete project
router.delete('/:projectId', (req, res) => {
    knex('tasks').where({
        projectId: req.params.projectId
    }).del().then(_ => {
        return knex('projects').where({
            id: req.params.projectId
        }).del();

    }).then(() => res.json({ msg: 'project was deleted' }))
        .catch(err => res.status(400).json({ msg: 'project was NOT deleted' }));
});

//Get certain projects' tasks
router.get('/:projectId/tasks', (req, res) => {

    knex('tasks').where({
        projectId: req.params.projectId
    }).then(data => res.json(data))
        .catch(err => res.status(400).json({ msg: 'NO such projectId' }));
});


//Create Task
router.post('/:projectId/tasks', (req, res) => {

    if (!req.body.title || !req.body.description) {
        return res.status(400).json('task title or description isn\'t filled');
    }

    knex('tasks').insert({
        title: req.body.title,
        description: req.body.description,
        isChecked: false,
        projectId: req.params.projectId
    }).then(_ => res.json('task was created.'))
        .catch(err => res.status(400).json('task wasn\'t created!'));
});

//Edit task
router.put('/:projectId/tasks/:taskId', (req, res) => {

    if (!req.body.title || !req.body.description) {
        return res.status(400).json('ether title or description was NOT filled!');
    }

    knex('tasks').where({
        id: req.params.taskId,
        projectId: req.params.projectId
    }).update({
        title: req.body.title,
        description: req.body.description
    }).then(_ => res.json('task was updated.'))
        .catch(err => res.status(400).json('task was not updated!'));
});


//Check Task
router.put('/:projectId/tasks/:taskId/check', (req, res) => {

    knex('tasks').where({
        id: req.params.taskId,
        projectId: req.params.projectId
    }).update({
        isChecked: req.body.isChecked
    }).then(_ => res.json(`check:${req.body.isChecked}, updated`))
        .catch(err => res.status(400).json('wasn\'t updated!'));
});

//Delete task
router.delete('/:projectId/tasks/:taskId', (req, res) => {

    knex('tasks').where({
        id: req.params.taskId,
        projectId: req.params.projectId
    }).del()
        .then(_ => res.json({ msg: 'task was deleted!' }))
        .catch(err => res.status(400).json({ msg: `არ არსებობს ამ ID - ით წევრი!` }));
});


module.exports = router;