# Promise Series

Execute array of methods that return promises, in series.

## Installation
```$ npm install promise-series```

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
```

This will print:
```javascript
['hello', 'world']  //results are returned in the order they were executed
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
```
This will print:
```
[true, false]
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
});
```
This will print:
```
['hello', 'cruel', 'world']
```

If one of the inputs is not a function, the input will be returned in the results:
```javascript
promiseSeries([func1, 'foo', 42, func2], function(res) {
  return res === true;
}).then( (data, status) => {
  console.log(results);
});
```

This will print:
```
['hello', 'foo', 42, 'world']
```