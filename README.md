# Promise Series

Given an array of functions that return promises, execute in series.

## Installation
```npm install promise-series```

## Basic Usage

```javascript
promiseSeries = require('promise-series');

func1 = function() {
  return new Promise(function(resolve, reject) {
    resolve('hello');
  });
};

func2 = function() {
  return new Promise(function(resolve, reject) {
    resolve('world');
  });
};

promiseSeries([func1, func2]).then( (results) => {
  console.log(results);
});
//results:
// ['hello', 'world']
```

## Halt condition
Optionally, you make choose to provide a callback that is run against each result.  If the test fails, the next function in the series will not be executed.

```javascript
func1 = function() {
  return new Promise(function(resolve, reject) {
    resolve(true);
  });
};

func2 = function() {
  return new Promise(function(resolve, reject) {
    resolve(false);
  });
};

func3 = function() {
  return new Promise(function(resolve, reject) {
    resolve(true);
  });
};

promiseSeries([func1, func2, func3], function(res) {
  return res === true;
}).then( (data, status) => {
  console.log(results);
});
// results:
// [true, false]
```

## Non-standard inputs
If a function does not return a promise, the return value will be returned in the results:
```javascript
var nonPromiseFunc = function() {
  return 'cruel'
};

promiseSeries([func1, nonPromiseFunc, func2], function(res) {
  return res === true;
}).then( (data, status) => {
  console.log(results);
  // results:
  // ['hello', 'cruel', 'world']
});
```

If one of the inputs is not a function, the input will be returned in the results:
```javascript
promiseSeries([func1, 'foo', 42, func2], function(res) {
  return res === true;
}).then( (data, status) => {
  console.log(results);
  // results:
  // ['hello', 'foo', 42, 'world']
});
```