
function Invocation(obj, fn, args) {
    if (typeof obj === 'function') {
        args = fn;
        fn = obj;
        obj = null;
    }

    var indexresult = args ? args.indexOf(myresult) : -1;
    var indexerr = args ? args.indexOf(myerr) : -1;

    this.call = function (cb, err, result) {
        var nargs = args ? args.slice() : [];

        nargs.push(cb);

        if (indexresult >= 0)
            nargs[indexresult] = result;
        if (indexerr >= 0)
            nargs[indexerr] = err;

        try {
            fn.apply(obj, nargs);
        }
        catch (err) {
            cb(err);
        }
    };

    this.useerr = indexerr >= 0;
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

        if (typeof arguments[k] === 'function' && k + 1 == l) {
            callback = arguments[k];
            k++;
            continue;
        }

        if (typeof arguments[k] === 'function') {
            invocations.push(new Invocation(arguments[k]));
            k += 1;
            continue;
        }

        if (typeof arguments[k] === 'object' && typeof arguments[k+1] === 'function' && Array.isArray(arguments[k+2])) {
            invocations.push(new Invocation(arguments[k], arguments[k+1], arguments[k+2]));
            k += 3;
            continue;
        }

        if (typeof arguments[k] === 'object' && typeof arguments[k+1] === 'function') {
            invocations.push(new Invocation(arguments[k], arguments[k+1]));
            k += 2;
            continue;
        }

        throw "invalid arguments";
    }

    var results = [];

    function callInvocation(err, result) {
        if (invocations.length == 0) {
            if (callback)
                callback(null, results);
            return;
        }

        var invocation = invocations.shift();

        invocation.call(function (err, res) {            
            if (err) {
                if (invocations.length && invocations[0].useerr) {
                    if (res)
                        results.push(res);
                    callInvocation(err, res);
                }
                else if (callback)
                    callback(err, results);
                else
                    throw err;
            }
            else {
                results.push(res);
                callInvocation(err, res);
            }
        }, err, result);
    }

    callInvocation();
}

var myresult = { };
var myerr = { };

exports.result = myresult;
exports.err = myerr;