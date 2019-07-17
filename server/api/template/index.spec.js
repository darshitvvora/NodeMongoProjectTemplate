/* globals sinon, describe, expect, it */

const proxyquire = require('proxyquire').noPreserveCache();

const templateCtrlStub = {
  index: 'templateCtrl.index',
  show: 'templateCtrl.show',
  create: 'templateCtrl.create',
  upsert: 'templateCtrl.upsert',
  patch: 'templateCtrl.patch',
  destroy: 'templateCtrl.destroy',
};

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
const templateIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    },
  },
  './template.controller': templateCtrlStub,
});

describe('Template API Router:', () => {
  it('should return an express router instance', () => {
    expect(templateIndex).to.equal(routerStub);
  });

  describe('GET /api/templates', () => {
    it('should route to template.controller.index', () => {
      expect(routerStub.get
        .withArgs('/', 'templateCtrl.index'),
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/templates/:id', () => {
    it('should route to template.controller.show', () => {
      expect(routerStub.get
        .withArgs('/:id', 'templateCtrl.show'),
      ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/templates', () => {
    it('should route to template.controller.create', () => {
      expect(routerStub.post
        .withArgs('/', 'templateCtrl.create'),
      ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/templates/:id', () => {
    it('should route to template.controller.upsert', () => {
      expect(routerStub.put
        .withArgs('/:id', 'templateCtrl.upsert'),
      ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/templates/:id', () => {
    it('should route to template.controller.patch', () => {
      expect(routerStub.patch
        .withArgs('/:id', 'templateCtrl.patch'),
      ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/templates/:id', () => {
    it('should route to template.controller.destroy', () => {
      expect(routerStub.delete
        .withArgs('/:id', 'templateCtrl.destroy'),
      ).to.have.been.calledOnce;
    });
  });
});
