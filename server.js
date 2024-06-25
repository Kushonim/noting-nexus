// Connecting/Installing necessary libraries
const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Initializing express application and connecting the front and back end
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Route to notes page
app.get('/notes', (req, res) => {
    console.log('hello');
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Route to the actual notes that reads and displays to the front end
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, results) => {
        if(err) {
            throw err;
        }
        res.send(results);
    });
});

// Route that takes care of creating the posts and rewrites the db.json file
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    fs.readFile('./db/db.json', (err, data) => {
        if(err) { 
            throw err;
        }
        const notes = JSON.parse(data);
        notes.push(newNote);
        
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if(err) {
                throw err;
            }
            res.json(newNote);
        });
    });
});

// Route that handles the deletion of notes and rewrites the db.json file
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json', (err, data) => {
        if(err) {
            throw err;
        }
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);

        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if(err) { 
                throw err;
            }
            res.json({ message: `Note with id ${noteId} deleted` });
        });
    });
});

// Default route that will navigate to index.html page in case the route doesn't exist
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Listens to 3001 port
app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});