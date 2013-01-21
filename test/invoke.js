
var si = require('..'),
    assert = require('assert');

var ninvokes = 0;

si.invoke(
    function (a, b, cb) { assert.equal(a, 1); assert.equal(b, 2); ninvokes++; cb(null, a+b); },
    [1, 2]
);

assert.equal(ninvokes, 1);

ninvokes =0;

si.invoke(
    function (a, b, cb) { assert.equal(a, 1); assert.equal(b, 2); ninvokes++; cb(null, a+b); },
    [1, 2],
    function (a, b, cb) { assert.equal(a, 1); assert.equal(b, 2); ninvokes++; cb(null, a+b); },
    [1, 2]
);

assert.equal(ninvokes, 2);