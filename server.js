//require packages
const { randomUUID } = require('crypto');
const express = require('express');
const path = require('path');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils')

const app = express();

const PORT = process.env.PORT || 3001;

//middleware to process json and urls
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static resources in public folder
app.use(express.static('public'));

//homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//GET all notes
app.get('/api/notes', (req, resp) => {
    //read file and return contents
    readFromFile('./db/db.json').then((result) => resp.json(JSON.parse(result)));
})

//POST new note
app.post('/api/notes', (req, resp) => {
    if(req.body) {
        const newNote = {
            id: randomUUID(),
            title: req.body.title,
            text: req.body.text
        }
        readAndAppend(newNote, './db/db.json')
        resp.status(200).send('Note saved')
    }
    else resp.error('Request must contain a body')
})

//DELETE selected note id
app.delete('/api/notes/:id', (req, resp) => {

    if (req.params.id) {
        readFromFile('./db/db.json').then(data => {
            let fileData;
            fileData = JSON.parse(data)
            let updatedData = fileData.filter(note => note.id !== req.params.id)
            if(updatedData != fileData) {
                writeToFile('./db/db.json', updatedData)
                resp.status(200).send('Note deleted')
            }
            else resp.error(`Note id ${req.params.id} not found`)
        })
    }
    else resp.error('Must send id to delete')
})
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
