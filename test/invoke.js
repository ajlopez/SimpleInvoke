
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
        cb(null, a + b);
    }
};

si.invoke(obj, obj.add, [1, 2]);

assert.equal(ninvokes, 1);

// Invoke two object function

ninvokes = 0;

si.invoke(obj, obj.add, [1, 2], obj, obj.add, [3, 4]);

assert.equal(ninvokes, 2);

// Invoke two object function collecting results in callback

ninvokes = 0;

si.invoke(obj, obj.add, [1, 2], obj, obj.add, [3, 4], function (err, results) {
    assert.ok(!err);
    assert.ok(results);
    assert.equal(results.length, 2);
    assert.equal(results[0], 3);
    assert.equal(results[1], 7);
});

assert.equal(ninvokes, 2);

// Invoke function collecting error and partial results in callback

ninvokes = 0;

si.invoke(obj, obj.add, [1, 2], function (cb) { cb("error"); }, obj, obj.add, [3, 4], function (err, results) {
    assert.equal(err, "error");
    assert.ok(results);
    assert.equal(results.length, 1);
    assert.equal(results[0], 3);
});

assert.equal(ninvokes, 1);

// Invoke function collecting throw error and partial results in callback

ninvokes = 0;

si.invoke(obj, obj.add, [1, 2], function (cb) { throw "error"; }, obj, obj.add, [3, 4], function (err, results) {
    assert.equal(err, "error");
    assert.ok(results);
    assert.equal(results.length, 1);
    assert.equal(results[0], 3);
});

assert.equal(ninvokes, 1);

// Use previous result in next invocation

ninvokes = 0;

si.invoke(obj, obj.add, [1, 2], obj, obj.add, [si.result, 4], function (err, results) {
    assert.ok(!err);
    assert.ok(results);
    assert.equal(results.length, 2);
    assert.equal(results[0], 3);
    assert.equal(results[1], 7);
});

assert.equal(ninvokes, 2);

// Use previous error in next invocation

ninvokes = 0;

si.invoke(obj, obj.add, [1, 2], function(result, cb) { cb(result); }, [si.result], obj, obj.add, [si.err, 4], function (err, results) {
    assert.ok(!err);
    assert.ok(results);
    assert.equal(results.length, 2);
    assert.equal(results[0], 3);
    assert.equal(results[1], 7);
});

assert.equal(ninvokes, 2);

