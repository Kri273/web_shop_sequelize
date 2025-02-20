const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));




// yhendus
const sequelize = require('./util/db')

sequelize
.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch((error) => {
    console.error('Unable to connect to the database:', error);
})





app.get('/',(req, res) => {
    res.json({ message: "web shop app" })
})

app.listen(3002)