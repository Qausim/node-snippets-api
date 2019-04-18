require('../config/config');

const {Snippet} = require('./models/snippet');
const express = require('express');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const bodyParser = require('body-parser');

let port = process.env.PORT;

const app = express();
app.use(bodyParser.json());



// POST /snippets
app.post('/snippets', (request, response) => {
    let snippet = new Snippet({
        text: request.body.text,
        language: request.body.language,
        description: request.body.description
    });

    snippet.save()
        .then(snippet => response.status(200).send({snippet}))
        .catch(e => response.status(400).send(e));
});

// GET /snippets
app.get('/snippets', (request, response) => {
    Snippet.find()
        .then(snippets => {
            if (!snippets[0]) {
                response.status(404).send();
            }
            response.status(200).send({snippets});
        })
        .catch(e => response.status(400).send());
});


app.listen(port, () => console.log(`Server listening on port ${port}`));


module.exports = app;