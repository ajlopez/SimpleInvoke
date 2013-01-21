
var si = require('..'),
    assert = require('assert');

var ninvokes = 0;

// Invoke simple function with callback

si.invoke(
    function (a, b, cb) { assert.equal(a, 1); assert.equal(b, 2); ninvokes++; cb(null, a+b); },
    [1, 2]
);

assert.equal(ninvokes, 1);

// Invoke two functions with callback

ninvokes = 0;

si.invoke(
    function (a, b, cb) { assert.equal(a, 1); assert.equal(b, 2); assert.equal(ninvokes, 0); ninvokes++; cb(null, a+b); },
    [1, 2],
    function (a, b, cb) { assert.equal(a, 1); assert.equal(b, 2); assert.equal(ninvokes, 1); ninvokes++; cb(null, a+b); },
    [1, 2]
);

assert.equal(ninvokes, 2);

// Invoke object function

ninvokes = 0;

var obj = {
    x: 1,
    add: function (a, b, cb) {
        assert.ok(this);
        assert.equal(this, obj);
        assert.equal(this.x, 1);
        ninvokes++;
    }
};

si.invoke(obj, obj.add, [1, 2]);

assert.equal(ninvokes, 1);


