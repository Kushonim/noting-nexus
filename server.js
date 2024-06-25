const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    console.log('hello');
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, results) => {
        if(err) {
            throw err;
        }
        res.send(results);
    });
});

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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});