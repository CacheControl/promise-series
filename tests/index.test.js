'use strict'

var Promise = require('es6-promise').Promise

Array.promiseSeries = require('../index.js')

function promiseMethodFactory (ret) {
  return function () {
    return new Promise(function (resolve, reject) {
      resolve(ret)
    })
  }
}

var test = require('tap').test
var g = promiseMethodFactory('g')
var h = promiseMethodFactory('h')
var i = promiseMethodFactory('i')

test('it executes the method array in series', function (t) {
  Array.promiseSeries([g, h, i]).then(function (results) {
    t.equal(results.length, 3)
    t.equal(results[0], 'g')
    t.equal(results[1], 'h')
    t.equal(results[2], 'i')
    t.end()
  }).catch(t.end)
})

// same but reverse order, assert reordered result
test('it maintains the results order', function (t) {
  Array.promiseSeries([i, g, h]).then(function (results) {
    t.equal(results.length, 3)
    t.equal(results[0], 'i')
    t.equal(results[1], 'g')
    t.equal(results[2], 'h')
    t.end()
  }).catch(t.end)
})

// one promise rejects
var rejector = function () {
  return new Promise(function (resolve, reject) {
    reject('error!')
  })
}
test('it handles rejected promises by stopping subsequent promise executions', function (t) {
  Array.promiseSeries([g, h, i, rejector]).catch(function (result) {
    t.equal(result, 'error!')
    t.end()
  })
})

// *************************
// halt callback
// *************************

// all methods pass the test
test('it allows all promises to complete if each passes the halt callback test', function (t) {
  Array.promiseSeries([g, h, i], function (ret) {
    return ['g', 'h', 'i'].indexOf(ret) > -1
  }).then(function (results) {
    t.equal(results.length, 3)
    t.equal(results[0], 'g')
    t.equal(results[1], 'h')
    t.equal(results[2], 'i')
    t.end()
  }).catch(t.end)
})

// second methods fails the test
var failHaltCond = promiseMethodFactory('blowup')
test('it stops execution of the series on the first promise to fail the test', function (t) {
  Array.promiseSeries([g, failHaltCond, h, i], function (ret) {
    return ['g', 'h', 'i'].indexOf(ret) > -1
  }).then(function (results) {
    t.equal(results.length, 2)
    t.equal(results[0], 'g')
    t.equal(results[1], 'blowup')
    t.end()
  }).catch(t.end)
})

// one method does not return a promise
var nonPromise = function () {
  return 'I am a string not a promise!'
}
test('it treats methods that return non-promises as automatically resolved', function (t) {
  Array.promiseSeries([g, nonPromise, h]).then(function (results) {
    t.equal(results.length, 3)
    t.equal(results[0], 'g')
    t.equal(results[1], 'I am a string not a promise!')
    t.equal(results[2], 'h')
    t.end()
  }).catch(t.end)
})

test('it treats non-methods as automatically resolved', function (t) {
  var num = 42
  Array.promiseSeries([g, num, h]).then(function (result) {
    t.deepEqual(result, ['g', 42, 'h'])
    t.end()
  })
})
