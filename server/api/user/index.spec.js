/* globals sinon, describe, expect, it */

const proxyquire = require('proxyquire').noPreserveCache();

const userCtrlStub = {
  index: 'userCtrl.index',
  show: 'userCtrl.show',
  create: 'userCtrl.create',
  upsert: 'userCtrl.upsert',
  patch: 'userCtrl.patch',
  destroy: 'userCtrl.destroy',
};

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
const userIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    },
  },
  './user.controller': userCtrlStub,
});

describe('User API Router:', () => {
  it('should return an express router instance', () => {
    expect(userIndex).to.equal(routerStub);
  });

  describe('GET /api/users', () => {
    it('should route to user.controller.index', () => {
      expect(routerStub.get
        .withArgs('/', 'userCtrl.index'),
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/users/:id', () => {
    it('should route to user.controller.show', () => {
      expect(routerStub.get
        .withArgs('/:id', 'userCtrl.show'),
      ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/users', () => {
    it('should route to user.controller.create', () => {
      expect(routerStub.post
        .withArgs('/', 'userCtrl.create'),
      ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should route to user.controller.upsert', () => {
      expect(routerStub.put
        .withArgs('/:id', 'userCtrl.upsert'),
      ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should route to user.controller.patch', () => {
      expect(routerStub.patch
        .withArgs('/:id', 'userCtrl.patch'),
      ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should route to user.controller.destroy', () => {
      expect(routerStub.delete
        .withArgs('/:id', 'userCtrl.destroy'),
      ).to.have.been.calledOnce;
    });
  });
});
