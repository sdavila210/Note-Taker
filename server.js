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

// HTML Routes for notes.html and index.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, result) => {
        const data = JSON.parse(result)
        res.json(data)
    })
}
)

app.post('/api/notes', (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
    }
    console.log(newNote)
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
