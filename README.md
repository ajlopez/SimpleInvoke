# SimpleInvoke

Chained invocation of functions with callbacks.

## Installation

Via npm on Node:

```
npm install simpleinvoke
```


## Usage

Reference in your program:

```js
var si = require('simpleinvoke');
```

You can chain two functions with callbacks, specifying the function and an array with its arguments.

```js
// function with callback(err, result)
function add(a, b, callback) { callback(null, a+b); } 

si.invoke(
    add,
    [1, 2],
    add,
    [3, 4]
);
```

The argument list can be omitted (if it is not the last function).

If you specify a function as the last argument, it will be the final callback, receiving any not consumed error, and the
accumulated results:

```js
si.invoke(
    add,
    [1, 2],
    add,
    [3, 4],
    function (err, results) {
        console.dir(results); // [3, 7]
    }
);
```

You can consume the previous result in the next invocation:
```js
si.invoke(
    add,
    [1, 2],
    add,
    [si.result, 4],
    function (err, results) {
        console.dir(results); // [3, 7]
    }
);
```

Detected exceptions are trapped by final callback:
```js
si.invoke(
    add,
    [1, 2],
    function () { throw "error"; },
    add,
    [si.result, 4],
    function (err, results) {
        console.dir(err); // "error"
    }
);
```

If a callback informs an error, it is trapped by final callback, cancelling the chain process:
```js
si.invoke(
    add,
    [1, 2],
    function (cb) { cb("error"); }, // the first argument of callback is err
    add,
    [si.result, 4],
    function (err, results) {
        console.dir(err); // "error"
    }
);
```

An error in an invocation can be consumed by the next function to invoke:
```js
si.invoke(
    add,
    [1, 2],
    function (cb) { cb("error"); }, // the first argument of callback is err
    function (err, cb) { console.log(err); cb(error); }, // prints and 'raise' error
    [si.err], // it uses the previous error as first argument
    add,
    [si.result, 4],
    function (err, results) {
        console.dir(err); // "error"
    }
);
```

You can invoke object methods:
```js
var obj = {
    add: function (a, b, cb) {
        cb(null, a + b);
    }
};

si.invoke(obj, obj.add, [1, 2], obj, obj.add, [si.result, 4], function (err, result) { ... });
```

TBD
## Development

```
git clone git://github.com/ajlopez/SimpleInvoke.git
cd SimpleInvoke
npm install
npm test
```

## Samples

TBD

## To do

- Samples

## Versions

- 0.0.1: Published.

## Inception

The syntax and idea was inspired by [azure-scripty](https://github.com/glennblock/azure-scripty) by [Glenn Block](https://github.com/glennblock).

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleInvoke) and submit
[pull requests](https://github.com/ajlopez/SimpleInvoke/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

