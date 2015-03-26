'use strict';

var Promise = require('es6-promise').Promise;

module.exports = function(array, haltCallback) {
  if(!(haltCallback instanceof Function)) {
    haltCallback = function() {
      return true;
    };
  }
  return new Promise(function(resolve, reject) {
    var i = 0,
      len = array.length,
      results = [];

    function processPromise(result) {
      results[i] = result;
      if(!haltCallback(result)) {
        return resolve(results);
      }
      i++;
      next();
    }

    function next() {
      if(i >= len) return resolve(results);

      var method = array[i];
      if(typeof method !== 'function') {
        return processPromise(method);
      }

      var p = method();
      if(typeof p.then === 'function' && typeof p.catch === 'function') {
        p.then(processPromise).catch(reject);
      } else {
        processPromise(p);
      }
    }

    next();
  });
};