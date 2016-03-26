# Promise Series
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

Execute array of methods that return promises, in series.

## Installation
```$ npm install promise-series-node```

## Basic Usage

```javascript
import promiseSeries from 'promise-series-node';

function func1() {
  return new Promise((resolve, reject) => {
    resolve('hello');
  });
};

function func2() {
  return new Promise((resolve, reject) => {
    resolve('world');
  });
};

promiseSeries([func1, func2]).then(results => {
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
let func1 = function() {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};

let func2 = function() {
  return new Promise((resolve, reject) => {
    resolve(false);
  });
};

let func3 = function() {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};

//only promises that resolve(true) pass the test
promiseSeries([func1, func2, func3], res => res === true).then(results => {
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
let nonPromiseFunc = function() {
  return 'cruel';
};

promiseSeries([func1, nonPromiseFunc, func2]).then(results => {
  console.log(results);
});
```
This will print:
```javascript
['hello', 'cruel', 'world']
```

If one of the inputs is not a function, the input will be passed through to the results:
```javascript
promiseSeries([func1, 'foo', 42, func2]).then(results => {
  console.log(results);
});
```

This will print:
```javascript
['hello', 'foo', 42, 'world']
```
