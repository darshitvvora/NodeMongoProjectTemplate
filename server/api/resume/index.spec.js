/* globals sinon, describe, expect, it */

const proxyquire = require('proxyquire').noPreserveCache();

const resumeCtrlStub = {
  index: 'resumeCtrl.index',
  show: 'resumeCtrl.show',
  create: 'resumeCtrl.create',
  upsert: 'resumeCtrl.upsert',
  patch: 'resumeCtrl.patch',
  destroy: 'resumeCtrl.destroy',
};

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
const resumeIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    },
  },
  './resume.controller': resumeCtrlStub,
});

describe('Resume API Router:', () => {
  it('should return an express router instance', () => {
    expect(resumeIndex).to.equal(routerStub);
  });

  describe('GET /api/resumes', () => {
    it('should route to resume.controller.index', () => {
      expect(routerStub.get
        .withArgs('/', 'resumeCtrl.index'),
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/resumes/:id', () => {
    it('should route to resume.controller.show', () => {
      expect(routerStub.get
        .withArgs('/:id', 'resumeCtrl.show'),
      ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/resumes', () => {
    it('should route to resume.controller.create', () => {
      expect(routerStub.post
        .withArgs('/', 'resumeCtrl.create'),
      ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/resumes/:id', () => {
    it('should route to resume.controller.upsert', () => {
      expect(routerStub.put
        .withArgs('/:id', 'resumeCtrl.upsert'),
      ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/resumes/:id', () => {
    it('should route to resume.controller.patch', () => {
      expect(routerStub.patch
        .withArgs('/:id', 'resumeCtrl.patch'),
      ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/resumes/:id', () => {
    it('should route to resume.controller.destroy', () => {
      expect(routerStub.delete
        .withArgs('/:id', 'resumeCtrl.destroy'),
      ).to.have.been.calledOnce;
    });
  });
});
