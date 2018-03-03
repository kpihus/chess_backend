const dao = require('../dao');
const mockDb = require('mock-knex');
const knexConf = require('../knexfile').development;
const knex = require('knex')(knexConf);
require('should');


describe('DAO', function () {
  //
  // beforeEach(()=>{
  //   mockDb.mock(knex)
  // });
  //
  // afterEach(() => {
  //   mockDb.unmock(knex)
  // });

  it('Should greate game', function(){
    const tracker = mockDb.getTracker();
    tracker.install();

    tracker.on('query', (query)=>{
      query.method.should.be.equal('insert');
      query.response([6]);
    });

    return dao.storeGame('Jobn Done')
      .then(res => {
        res.game_id.should.be.equal(6);
        knex.destroy();
      })
  })

  it.only('Should insert initial state of pieces', ()=> {
    return dao.storeSetOfPieces(1)
      .then(res => {
        console.log(res)
      });
  });


});