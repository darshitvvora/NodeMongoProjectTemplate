/* globals describe, expect, it, beforeEach, afterEach */

import request from 'supertest';

const app = require('../..');

let newUser;

describe('User API:', () => {
  describe('GET /api/users', () => {
    let users;

    beforeEach((done) => {
      request(app)
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          users = res.body;
          done();
        });
    });

    it('should respond with JSON array', () => {
      expect(users).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/users', () => {
    beforeEach((done) => {
      request(app)
        .post('/api/users')
        .send({
          name: 'New User',
          info: 'This is the brand new user!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newUser = res.body;
          done();
        });
    });

    it('should respond with the newly created user', () => {
      expect(newUser.name).to.equal('New User');
      expect(newUser.info).to.equal('This is the brand new user!!!');
    });
  });

  describe('GET /api/users/:id', () => {
    let user;

    beforeEach((done) => {
      request(app)
        .get(`/api/users/${newUser._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          user = res.body;
          done();
        });
    });

    afterEach(() => {
      user = {};
    });

    it('should respond with the requested user', () => {
      expect(user.name).to.equal('New User');
      expect(user.info).to.equal('This is the brand new user!!!');
    });
  });

  describe('PUT /api/users/:id', () => {
    let updatedUser;

    beforeEach((done) => {
      request(app)
        .put(`/api/users/${newUser._id}`)
        .send({
          name: 'Updated User',
          info: 'This is the updated user!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          updatedUser = res.body;
          done();
        });
    });

    afterEach(() => {
      updatedUser = {};
    });

    it('should respond with the updated user', () => {
      expect(updatedUser.name).to.equal('Updated User');
      expect(updatedUser.info).to.equal('This is the updated user!!!');
    });

    it('should respond with the updated user on a subsequent GET', (done) => {
      request(app)
        .get(`/api/users/${newUser._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const user = res.body;

          expect(user.name).to.equal('Updated User');
          expect(user.info).to.equal('This is the updated user!!!');

          done();
        });
    });
  });

  describe('PATCH /api/users/:id', () => {
    let patchedUser;

    beforeEach((done) => {
      request(app)
        .patch(`/api/users/${newUser._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched User' },
          { op: 'replace', path: '/info', value: 'This is the patched user!!!' },
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          patchedUser = res.body;
          done();
        });
    });

    afterEach(() => {
      patchedUser = {};
    });

    it('should respond with the patched user', () => {
      expect(patchedUser.name).to.equal('Patched User');
      expect(patchedUser.info).to.equal('This is the patched user!!!');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should respond with 204 on successful removal', (done) => {
      request(app)
        .delete(`/api/users/${newUser._id}`)
        .expect(204)
        .end((err) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when user does not exist', (done) => {
      request(app)
        .delete(`/api/users/${newUser._id}`)
        .expect(404)
        .end((err) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
