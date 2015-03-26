'use strict';

var assert = require('assert');

Array.promiseSeries = require('./index.js');

function promiseMethodFactory(ret) {
  return function() {
    return new Promise(function(resolve, reject) {
      resolve(ret);
    });
  };
}

function failMsg(err) {
  console.log('FAILED assertion', err.stack);
}

var g = promiseMethodFactory('g'),
    h = promiseMethodFactory('h'),
    i = promiseMethodFactory('i');

//all methods return promises; happy path
Array.promiseSeries([g, h, i]).then( function(results) {
  assert.equal(results.length, 3);
  assert.equal(results[0], 'g');
  assert.equal(results[1], 'h');
  assert.equal(results[2], 'i');
}).catch(failMsg);


//same but reverse order, assert reordered result
Array.promiseSeries([i, g, h]).then( function(results) {
  assert.equal(results.length, 3);
  assert.equal(results[0], 'i');
  assert.equal(results[1], 'g');
  assert.equal(results[2], 'h');
}).catch(failMsg);

//one promise rejects
var j = function() {
  return new Promise(function(resolve, reject) {
    reject('j');
  });
};
Array.promiseSeries([g, h, i, j]).catch( function(result) {
  try {
    assert.equal(result, 'j');
  } catch (err) {
    failMsg(err);
  }
});

//*************************
// halt Callback
//*************************

//all methods pass the test
Array.promiseSeries([g, h, i], function(ret) {
  return ['g', 'h', 'i'].indexOf(ret) > -1;
}).then( function(results) {
  try {
    assert.equal(results.length, 3);
    assert.equal(results[0], 'g');
    assert.equal(results[1], 'h');
    assert.equal(results[2], 'i');
  } catch (err) {
    failMsg(err);
  }
}).catch(failMsg);

//second methods fails the test
j = promiseMethodFactory('blowup');
Array.promiseSeries([g, j, h, i], function(ret) {
  return ['g', 'h', 'i'].indexOf(ret) > -1;
}).then( function(results) {
  try {
    assert.equal(results.length, 2);
    assert.equal(results[0], 'g');
    assert.equal(results[1], 'blowup');
  } catch (err) {
    failMsg(err);
  }
}).catch(failMsg);


//one method does not return a promise
j = function() {
  return 'yo!';
};
Array.promiseSeries([g, j]).then( function(results) {
  try {
    assert.equal(results.length, 2);
    assert.equal(results[0], 'g');
    assert.equal(results[1], 'yo!');
  } catch (err) {
    failMsg(err);
  }
}).catch(failMsg);

//one method is not a method
j = 42;
Array.promiseSeries([g, j]).then( function(result) {
  try {
    assert.deepEqual(result, ['g', 42]);
  } catch (err) {
    failMsg(err);
  }
});