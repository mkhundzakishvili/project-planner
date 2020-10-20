const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const logger = require('./middleware/logger');




const app = express(); 

// init middlewere
app.use(logger);

//Handlebars MIddleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Homepage Route
// app.get('/', (req, res) => res.render('index', {
//     title: 'Member App',
//     members
// }));

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Set static folder 
app.use(express.static(path.join(__dirname, 'public')));

//members api routes
app.use('/api/tasks', require('./routs/api/tasks'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));