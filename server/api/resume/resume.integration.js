/* globals describe, expect, it, beforeEach, afterEach */

import request from 'supertest';

const app = require('../..');

let newResume;

describe('Resume API:', () => {
  describe('GET /api/resumes', () => {
    let resumes;

    beforeEach((done) => {
      request(app)
        .get('/api/resumes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          resumes = res.body;
          done();
        });
    });

    it('should respond with JSON array', () => {
      expect(resumes).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/resumes', () => {
    beforeEach((done) => {
      request(app)
        .post('/api/resumes')
        .send({
          name: 'New Resume',
          info: 'This is the brand new resume!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newResume = res.body;
          done();
        });
    });

    it('should respond with the newly created resume', () => {
      expect(newResume.name).to.equal('New Resume');
      expect(newResume.info).to.equal('This is the brand new resume!!!');
    });
  });

  describe('GET /api/resumes/:id', () => {
    let resume;

    beforeEach((done) => {
      request(app)
        .get(`/api/resumes/${newResume._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          resume = res.body;
          done();
        });
    });

    afterEach(() => {
      resume = {};
    });

    it('should respond with the requested resume', () => {
      expect(resume.name).to.equal('New Resume');
      expect(resume.info).to.equal('This is the brand new resume!!!');
    });
  });

  describe('PUT /api/resumes/:id', () => {
    let updatedResume;

    beforeEach((done) => {
      request(app)
        .put(`/api/resumes/${newResume._id}`)
        .send({
          name: 'Updated Resume',
          info: 'This is the updated resume!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          updatedResume = res.body;
          done();
        });
    });

    afterEach(() => {
      updatedResume = {};
    });

    it('should respond with the updated resume', () => {
      expect(updatedResume.name).to.equal('Updated Resume');
      expect(updatedResume.info).to.equal('This is the updated resume!!!');
    });

    it('should respond with the updated resume on a subsequent GET', (done) => {
      request(app)
        .get(`/api/resumes/${newResume._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const resume = res.body;

          expect(resume.name).to.equal('Updated Resume');
          expect(resume.info).to.equal('This is the updated resume!!!');

          done();
        });
    });
  });

  describe('PATCH /api/resumes/:id', () => {
    let patchedResume;

    beforeEach((done) => {
      request(app)
        .patch(`/api/resumes/${newResume._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Resume' },
          { op: 'replace', path: '/info', value: 'This is the patched resume!!!' },
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          patchedResume = res.body;
          done();
        });
    });

    afterEach(() => {
      patchedResume = {};
    });

    it('should respond with the patched resume', () => {
      expect(patchedResume.name).to.equal('Patched Resume');
      expect(patchedResume.info).to.equal('This is the patched resume!!!');
    });
  });

  describe('DELETE /api/resumes/:id', () => {
    it('should respond with 204 on successful removal', (done) => {
      request(app)
        .delete(`/api/resumes/${newResume._id}`)
        .expect(204)
        .end((err) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when resume does not exist', (done) => {
      request(app)
        .delete(`/api/resumes/${newResume._id}`)
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
