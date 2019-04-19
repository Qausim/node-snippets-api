const expect = require('expect');
const request = require('supertest');
const app = require('../server');
const {Snippet} = require('../models/snippet');
const {ObjectID} = require('mongodb');


let snippets = [
    {
        _id: new ObjectID(),
        text: "console.log(input)",
        description: "prints to screen",
        language: "Javascript"
    },
    {
        _id: new ObjectID(),
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

    it('should return a specified snippet', done => {
        let id = snippets[0]._id.toHexString();
        request(app)
            .get(`/snippets/${id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.snippet._id).toBe(id);
            })
            .end(done);
    });

    it('should return 404 on invalid object id', done => {
        let id = 123;
        request(app)
            .get(`/snippets/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /snippets/:id', () => {
    it('should delete a snippet entry', done => {
        let id = snippets[0]._id.toHexString();
        request(app)
            .delete(`/snippets/${id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.snippet.text).toBe(snippets[0].text);
            })
            .end(done);
    });

    it('should fail on invalid id', done => {
        request(app)
            .delete('/snippets/123')
            .expect(404)
            .end(done);
    });

    it('should fail on non-matching object id', done => {
        let id = new ObjectID();
        request(app)
            .delete(`/snippets/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /snippets/:id', () => {
    let  newSnippet = {
        text: 'This is a test',
        language: 'any',
        description: 'not many stuffs it can do'
    };

    it('should update a snippet entry with new data', done => {
        let id = snippets[0]._id.toHexString();
        request(app)
            .patch(`/snippets/${id}`)
            .send(newSnippet)
            .expect(200)
            .expect(res => {
                expect(res.body.snippet.text).toBe(newSnippet.text);
            })
            .end(done);
    });

    it('should fail on non-object id requests', done => {
        request(app)
            .patch('/snippets/123')
            .send(newSnippet)
            .expect(404)
            .end(done);
    });

    it('should fail on non-matching object id', done => {
        let id = new ObjectID();

        request(app)
            .patch(`/snippets/${id}`)
            .send(newSnippet)
            .expect(404)
            .end(done);
    });
});