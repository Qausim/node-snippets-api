const expect = require('expect');
const request = require('supertest');
const app = require('../server');
const {Snippet} = require('../models/snippet');
const {ObjectID} = require('mongodb');


let snippets = [
    {
        text: "console.log(input)",
        description: "prints to screen",
        language: "Javascript"
    },
    {
        text: "input('input something')",
        description: "Asks for user input",
        language: "Python"
    }
];

beforeEach(done => {
    Snippet.remove({})
        .then(() => {
            return Snippet.insertMany(snippets);
        })
        .then(() => done())
        .catch(e => done(e));
});

describe('POST /snippets', () => {
    it('should create a new snippet entry', done => {
        let snippet = {
            text: "child instanceof Parent",
            language: "Java",
            description: "Returns true if the child is an instance of the parent else false."
        }
        request(app)
            .post('/snippets')
            .send(snippet)
            .expect(200)
            .expect(res => {
                expect(res.body.snippet.text).toBe(snippet.text);
            })
            .end(done)
    });

    it('should fail on insertion of a snippet without required field', done => {
        request(app)
            .post('/snippets')
            .send({
                text: "catch(NullPointerException e)"
            })
            .expect(400)
            .end(done);
    });
});

describe('GET /snippets', () => {
    it('should return all existing snippets', done => {
        request(app)
            .get('/snippets')
            .expect(200)
            .expect(res => {
                expect(res.body.snippets.length).toBe(2);
            })
            .end(done);
    });
});