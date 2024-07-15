import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { resetForTesting, saveDeck, saveScore, loadDeck, listDecks, listScores } from './routes';

describe('routes', function () {

  // saveDeck function
  it('saveDeck', function () {
    // name is undefined - 2 tests
    const reqUndef = httpMocks.createRequest(
      { method: 'POST', url: '/api/saveDeck', body: { value: 69 } });
    const resUndef = httpMocks.createResponse();
    saveDeck(reqUndef, resUndef);
    assert.strictEqual(resUndef._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef._getData(),
      'required argument "name" was missing');

    const reqUndef2 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveDeck',
        body: { name: undefined, value: "h" }
      });
    const resUndef2 = httpMocks.createResponse();
    saveDeck(reqUndef2, resUndef2);
    assert.strictEqual(resUndef2._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef2._getData(),
      'required argument "name" was missing');

    // name is not a string - 2 tests
    const reqUndef3 = httpMocks.createRequest(
      { method: 'POST', url: '/api/saveDeck', body: { name: 69, value: 69 } });
    const resUndef3 = httpMocks.createResponse();
    saveDeck(reqUndef3, resUndef3);
    assert.strictEqual(resUndef3._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef3._getData(),
      'required argument "name" was not a string');

    const reqUndef4 = httpMocks.createRequest(
      { method: 'POST', url: '/api/saveDeck', body: { name: [1], value: "h" } });
    const resUndef4 = httpMocks.createResponse();
    saveDeck(reqUndef4, resUndef4);
    assert.strictEqual(resUndef4._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef4._getData(),
      'required argument "name" was not a string');

    // value is undefined - 2 tests
    const reqUndef5 = httpMocks.createRequest(
      { method: 'POST', url: '/api/saveDeck', body: { name: "joe" } });
    const resUndef5 = httpMocks.createResponse();
    saveDeck(reqUndef5, resUndef5);
    assert.strictEqual(resUndef5._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef5._getData(),
      'required argument "value" was missing');

    const reqUndef6 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveDeck',
        body: { name: "xd", value: undefined }
      });
    const resUndef6 = httpMocks.createResponse();
    saveDeck(reqUndef6, resUndef6);
    assert.strictEqual(resUndef6._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef6._getData(),
      'required argument "value" was missing');

    // straight line code - 1 test here (1 more below), 2 total
    const req = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveDeck',
        body: { name: "Zach", value: [["hi", "bye"], ["h", "b"]] }
      });
    const res = httpMocks.createResponse();
    saveDeck(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(res._getData(),
      { name: "Zach", value: [["hi", "bye"], ["h", "b"]] });

    // name already exists - 1 test here (1 more below), 2 total
    const req1 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveDeck',
        body: { name: "Zach", value: [["hi", "hi"], ["h", "b"]] }
      });
    const res1 = httpMocks.createResponse();
    saveDeck(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
      'name already in use');

    // straight line code 
    const req2 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveDeck',
        body: { name: "Bob", value: [["a", "b"], ["c", "d"]] }
      });
    const res2 = httpMocks.createResponse();
    saveDeck(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepEqual(res2._getData(),
      { name: "Bob", value: [["a", "b"], ["c", "d"]] });

    // name already exists
    const req3 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveDeck',
        body: { name: "Bob", value: [["b", "a"], ["d", "c"]] }
      });
    const res3 = httpMocks.createResponse();
    saveDeck(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
      'name already in use');
  });

  // saveScore function
  it('saveScore', function () {
    // name is undefined - 2 tests
    const reqUndef = httpMocks.createRequest(
      { method: 'POST', url: '/api/saveScore', body: { percentage: 69 } });
    const resUndef = httpMocks.createResponse();
    saveScore(reqUndef, resUndef);
    assert.strictEqual(resUndef._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef._getData(),
      'required argument "name" was missing');

    const reqUndef2 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveScore',
        body: { name: undefined, percentage: "h" }
      });
    const resUndef2 = httpMocks.createResponse();
    saveScore(reqUndef2, resUndef2);
    assert.strictEqual(resUndef2._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef2._getData(),
      'required argument "name" was missing');

    // name is not a string - 2 tests
    const reqUndef3 = httpMocks.createRequest(
      { method: 'POST', url: '/api/saveScore', body: { name: 69, percentage: 69 } });
    const resUndef3 = httpMocks.createResponse();
    saveScore(reqUndef3, resUndef3);
    assert.strictEqual(resUndef3._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef3._getData(),
      'required argument "name" was not a string');

    const reqUndef4 = httpMocks.createRequest(
      { method: 'POST', url: '/api/saveScore', body: { name: [1], percentage: "h" } });
    const resUndef4 = httpMocks.createResponse();
    saveScore(reqUndef4, resUndef4);
    assert.strictEqual(resUndef4._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef4._getData(),
      'required argument "name" was not a string');

    // deckName is undefined - 2 tests
    const reqUndef5 = httpMocks.createRequest(
      { method: 'POST', url: '/api/saveScore', body: { name: "h" } });
    const resUndef5 = httpMocks.createResponse();
    saveScore(reqUndef5, resUndef5);
    assert.strictEqual(resUndef5._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef5._getData(),
      'required argument "deckName" was missing');

    const reqUndef6 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveScore',
        body: { name: "h", deckName: undefined }
      });
    const resUndef6 = httpMocks.createResponse();
    saveScore(reqUndef6, resUndef6);
    assert.strictEqual(resUndef6._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef6._getData(),
      'required argument "deckName" was missing');

    // deckName is not a string - 2 tests
    const reqUndef7 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveScore',
        body: { name: "h", deckName: 69 }
      });
    const resUndef7 = httpMocks.createResponse();
    saveScore(reqUndef7, resUndef7);
    assert.strictEqual(resUndef7._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef7._getData(),
      'required argument "deckName" was not a string');

    const reqUndef8 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveScore',
        body: { name: "h", deckName: [] }
      });
    const resUndef8 = httpMocks.createResponse();
    saveScore(reqUndef8, resUndef8);
    assert.strictEqual(resUndef8._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef8._getData(),
      'required argument "deckName" was not a string');

    // percentage is undefined - 2 tests
    const reqUndef9 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveScore',
        body: { name: "h", deckName: "h" }
      });
    const resUndef9 = httpMocks.createResponse();
    saveScore(reqUndef9, resUndef9);
    assert.strictEqual(resUndef9._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef9._getData(),
      'required argument "percentage" was missing');

    const reqUndef10 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveScore',
        body: { name: "h", deckName: "h", percentage: undefined }
      });
    const resUndef10 = httpMocks.createResponse();
    saveScore(reqUndef10, resUndef10);
    assert.strictEqual(resUndef10._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef10._getData(),
      'required argument "percentage" was missing');

    // percentage is not a number - 2 tests
    const reqUndef11 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveScore',
        body: { name: "h", deckName: "h", percentage: "h" }
      });
    const resUndef11 = httpMocks.createResponse();
    saveScore(reqUndef11, resUndef11);
    assert.strictEqual(resUndef11._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef11._getData(),
      'required argument "percentage" was not a number');

    const reqUndef12 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveScore',
        body: { name: "g", deckName: "g", percentage: [] }
      });
    const resUndef12 = httpMocks.createResponse();
    saveScore(reqUndef12, resUndef12);
    assert.strictEqual(resUndef12._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef12._getData(),
      'required argument "percentage" was not a number');

    // stright line code - 2 tests
    const req = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveScore',
        body: { name: "h", deckName: "g", percentage: 5 }
      });
    const res = httpMocks.createResponse();
    saveScore(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(res._getData(),
      { name: "h", deckName: "g", percentage: 5 });

    const req1 = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveScore',
        body: { name: "a", deckName: "b", percentage: 2 }
      });
    const res1 = httpMocks.createResponse();
    saveScore(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepEqual(res1._getData(),
      { name: "a", deckName: "b", percentage: 2 });
  });

  // loadDeck function
  it('loadDeck', function () {
    // name is undefined - 2 tests
    const reqUndef = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadDeck', body: {} });
    const resUndef = httpMocks.createResponse();
    loadDeck(reqUndef, resUndef);
    assert.strictEqual(resUndef._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef._getData(),
      'required argument "name" was missing');

    const reqUndef1 = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadDeck', body: { name: undefined } });
    const resUndef1 = httpMocks.createResponse();
    loadDeck(reqUndef1, resUndef1);
    assert.strictEqual(resUndef1._getStatusCode(), 400);
    assert.deepStrictEqual(resUndef1._getData(),
      'required argument "name" was missing');

    // file does not exist - 2 tests
    const reqDNE = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadDeck', query: { deckName: "kid" } });
    const resDNE = httpMocks.createResponse();
    loadDeck(reqDNE, resDNE);
    assert.strictEqual(resDNE._getStatusCode(), 404);
    assert.deepStrictEqual(resDNE._getData(),
      'no file by that name was found');

    const reqDNE1 = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadDeck', query: { deckName: "ok" } });
    const resDNE1 = httpMocks.createResponse();
    loadDeck(reqDNE1, resDNE1);
    assert.strictEqual(resDNE1._getStatusCode(), 404);
    assert.deepStrictEqual(resDNE1._getData(),
      'no file by that name was found');

    // straight line code - 2 tests
    const req = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadDeck', query: { deckName: "Zach" } });
    const res = httpMocks.createResponse();
    loadDeck(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), 
      { deckName: "Zach", value: [["hi", "bye"], ["h", "b"]] });

    const req1 = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadDeck', query: { deckName: "Bob" } });
    const res1 = httpMocks.createResponse();
    loadDeck(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(),
      { deckName: "Bob", value: [["a", "b"], ["c", "d"]] });
  });

  // listDecks function
  it('listDecks', function () {
    // straight line code - 2 tests
    const req = httpMocks.createRequest(
      { method: 'GET', url: '/api/listDeck' });
    const res = httpMocks.createResponse();
    listDecks(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), { flashcardDeckNames: ['Zach', 'Bob'] });

    const reqSave = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveDeck',
        body: { name: "Kelsey", value: [["1", "a"], ["2", "b"]] }
      });
    const resSave = httpMocks.createResponse();
    saveDeck(reqSave, resSave);

    const req1 = httpMocks.createRequest(
      { method: 'GET', url: '/api/listDeck' });
    const res1 = httpMocks.createResponse();
    listDecks(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), 
      { flashcardDeckNames: ['Zach', 'Bob', 'Kelsey'] });
  });

  // listScores function
  it('listScores', function () {
    // straight line code - 2 tests
    const req = httpMocks.createRequest(
      { method: 'GET', url: '/api/listScores' });
    const res = httpMocks.createResponse();
    listScores(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), 
      { scores: [["h", "g", 5], ["a", "b", 2]] });

    const reqSave = httpMocks.createRequest(
      {
        method: 'POST', url: '/api/saveScore',
        body: { name: "h", deckName: "g", percentage: 33 }
      });
    const resSave = httpMocks.createResponse();
    saveScore(reqSave, resSave);

    const req1 = httpMocks.createRequest(
      { method: 'GET', url: '/api/listScores' });
    const res1 = httpMocks.createResponse();
    listScores(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), 
    { scores: [["h", "g", 5], ["a", "b", 2], ["h", "g", 33]] });
    resetForTesting();
  });
});
