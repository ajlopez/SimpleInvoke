
function Invocation(obj, fn, args) {
    if (typeof obj === 'function') {
        args = fn;
        fn = obj;
        obj = null;
    }

    this.call = function (cb) {
        var nargs = args ? args.slice() : [];

        nargs.push(cb);

        fn.apply(obj, nargs);
    };
}

exports.invoke = function() {
    var l = arguments.length;
    var k = 0;
    var invocations = [];
    var callback;

    while (k < l) {
        if (typeof arguments[k] === 'function' && Array.isArray(arguments[k+1])) {
            invocations.push(new Invocation(arguments[k], arguments[k+1]));
            k += 2;
            continue;
        }

        if (typeof arguments[k] === 'object' && typeof arguments[k+1] === 'function' && Array.isArray(arguments[k+2])) {
            invocations.push(new Invocation(arguments[k], arguments[k+1], arguments[k+2]));
            k += 3;
            continue;
        }

        throw "invalid arguments";
    }

    function callInvocation() {
        if (invocations.length == 0)
            return;

        var invocation = invocations.shift();

        invocation.call(function (err, result) {
            if (err) {
                // TODO to be defined
            }
            else
                callInvocation();
        });
    }

    callInvocation();
}