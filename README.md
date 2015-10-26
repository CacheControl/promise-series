# Promise Series
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

Execute array of methods that return promises, in series.

## Installation
```$ npm install promise-series-node```

## Basic Usage

```javascript
var promiseSeries = require('promise-series');

var func1 = function() {
  return new Promise(function(resolve, reject) {
    resolve('hello');
  });
};

var func2 = function() {
  return new Promise(function(resolve, reject) {
    resolve('world');
  });
};

promiseSeries([func1, func2]).then( (results) => {
  console.log(results);
});
```

This will print:
```javascript
['hello', 'world']  //results are returned in the order they were executed
```

## Halt condition
Optionally, you make choose to provide a callback that is run against each result.  If the test fails, the subsequent functions in the series will not be executed, and the series will resolve immediately.

```javascript
var func1 = function() {
  return new Promise(function(resolve, reject) {
    resolve(true);
  });
};

var func2 = function() {
  return new Promise(function(resolve, reject) {
    resolve(false);
  });
};

var func3 = function() {
  return new Promise(function(resolve, reject) {
    resolve(true);
  });
};

promiseSeries([func1, func2, func3], function(res) {
  return res === true; //only promises that resolve(true) pass the test
}).then( (data) => {
  console.log(results);
});
```
This will print:
```javascript
//note that func3 is not included, because func2 failed before it ran
//also note that results include the failed result
[true, false]
```

## Non-standard inputs
If a function does not return a promise, the return value will be passed through to the results:
```javascript
var nonPromiseFunc = function() {
  return 'cruel';
};

promiseSeries([func1, nonPromiseFunc, func2]).then( (data) => {
  console.log(results);
});
```
This will print:
```javascript
['hello', 'cruel', 'world']
```

If one of the inputs is not a function, the input will be passed through to the results:
```javascript
promiseSeries([func1, 'foo', 42, func2]).then( (data) => {
  console.log(results);
});
```

This will print:
```javascript
['hello', 'foo', 42, 'world']
```
