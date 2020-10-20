let tasks = [
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
        isChecked: false
    },
    {
        id: '3',
        title: 'title3',
        text: 'text3',
        isChecked: true
    }
];

function getTasks(){
    return tasks;
}

function setTasks(tasksObject){
    tasks = tasksObject;
}

module.exports = {
    getTasks,
    setTasks
};