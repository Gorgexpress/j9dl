import app from '../../server';
import Rating from './rating.model';
import {findBalancedTeams, rate} from './rating.controller';
import chai from 'chai';
import Promise from 'bluebird';
chai.should();
describe('Rating integration:', () => {
  Rating.collection.drop();

  beforeEach(done => {
    let ratings = [
      new Rating({userid:'1', mu:25}),
      new Rating({userid:'2', mu:10}),
      new Rating({userid:'3', mu:9}),
      new Rating({userid:'4', mu:5}),
      new Rating({userid:'5', mu:30}),
      new Rating({userid:'6', mu:30})
    ];
    Rating.create(ratings, (err) => {
      done();
    });
  });

  afterEach(done => {
    Rating.collection.drop();
    done();
  });

  it('should balance teams correctly', () => {
    return findBalancedTeams(['1', '2', '3', '4', '5', '6'])
      .then(balancedTeams => balancedTeams.should.deep.equal(['2', '3', '5', '1', '4', '6']));
  });
});
