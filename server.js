// Importing required modules/packages & setting up the port for the server
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// HTML Routes which handles GET request for notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// HTML routes which handles GET request for index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Handles GET request for retrieving notes
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, result) => {
        const data = JSON.parse(result)
        res.json(data)
    })
}
)

// Handles POST requests for adding new notes. A new note object is created with data from the request body and unique ID
app.post('/api/notes', (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
    }
    console.log(newNote)

    // Read data from database file, add new note to array, write data back to database file, and send new note as JSON response
    fs.readFile('db/db.json', 'utf8', (err, result) => {
        const data = JSON.parse(result)
        data.push(newNote)
        fs.writeFile('db/db.json', JSON.stringify(data), (err) => {
            res.json(newNote)
        })
    })
})

app.listen(PORT, () =>
    console.log(`App listening at https://localhost:${PORT}`)
);
