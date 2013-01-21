
function Invocation(fn, args) {
    this.call = function (cb) {
        var nargs = args ? args.slice() : [];

        nargs.push(cb);

        fn.apply(null, nargs);
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