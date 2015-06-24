// version 0.1
// polyfill ES6 Promise in older browsers
// Stephen Giles. https://github.com/ingenious
// API: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
(function() {
    var newAble, PolyfillPromise, root = this;
    if (root.Promise && typeof root.Promise == 'function') {
        newAble = new root.Promise(function() {});
    }
    // check for compatible API
    if (!newAble ||
        !root.Promise.all || !root.Promise.race || !root.Promise.reject || !root.Promise.resolve ||
        !newAble.then || !newAble['catch']
    ) {
        PolyfillPromise = function Promise(fn) {
            var pp = this,
                onResolve = [],
                rejectedArgs, onReject = [],
                resolvedArgs, state = 'pending',
                catchResolver,
                thenResolver,
                reject = function(args) {
                    rejectedArgs = arguments;
                    for (var i = 0; i < onReject.length; i++) {
                        onReject[i].apply(pp, rejectedArgs);
                    }
                    state = 'rejected';
                },
                resolve = function(args) {
                    resolvedArgs = arguments;
                    for (var i = 0; i < onResolve.length; i++) {
                        onResolve[i].apply(pp, resolvedArgs);
                    }
                    state = 'fulfilled';
                };
            if (typeof fn === 'function') {
                try {
                    fn(resolve, reject);
                } catch (e) {
                    state = 'rejected';
                    rejectedArgs = [e];
                }
            } else {
                throw (new Error('Promise argument ' + fn + ' is not a function'));
            }
            pp.then = function(callback, fail) {

                // Promise already rejected or resolved
                if (state === 'fulfilled' && typeof callback === 'function') {
                    return Promise.resolve(callback.apply(pp, resolvedArgs));
                } else if (state === 'rejected' && typeof fail === 'function') {
                    return Promise.reject(fail.apply(pp, rejectedArgs));

                    // Promise resolved or rejected in future, return new Promise
                    // which either resolves to return value of callback or fail, whichever executes
                } else {
                    if (typeof fail === 'function') {
                        onReject.push(function() {
                            thenResolver(fail.apply(pp, rejectedArgs));
                        });
                    }
                    if (typeof callback === 'function') {
                        
                        onResolve[onResolve.length]=function() {
                            thenResolver(callback.apply(pp, resolvedArgs));
                        };
                    }
                    return new PolyfillPromise(function(resolve) {
                        thenResolver = resolve;
                    });
                }
            };
            pp['catch'] = function(fail) {

                // Promise already rejected or resolved
                if (state === 'rejected' && typeof fail === 'function') {
                    return PolyfillPromise.reject(fail.apply(pp, rejectedArgs));
                } else if (state === 'fulfilled') {
                    return PolyfillPromise.resolve(resolvedArgs);

                    // Promise resolved or rejected in future, return new Promise
                    // which either resolves to returned value of fail or the original fulfilled value.
                } else {
                    if (typeof fail === 'function') {
                        onReject.push(function() {
                            catchResolver(fail.apply(pp, rejectedArgs));
                        });
                    }
                    //onresolve.push(catchResolver);

                    return new PolyfillPromise(function(resolve) {
                        catchResolver = resolve;
                    });
                }
            };
        };
        PolyfillPromise.all = function(array) {
            return new PolyfillPromise(function(resolve, reject) {
                var state, resolvedValues = [],
                    resolved = 0,
                    size = array.length;
                (function iterate(i) {
                    var index = i;
                    array[index]
                        .then(function(value) {
                            resolvedValues[index] = value;
                            if (++resolved === size) {
                                state = 'fulfilled';
                                resolve(resolvedValues);
                            }
                        });
                        array[index]['catch'](function(e) {
                            if (!state) {
                                state = 'rejected';
                                reject(e);
                            }
                        });
                    if (i < size - 1) {
                        iterate(++i);
                    }
                })(0);
            });
        };
        PolyfillPromise.race = function(array) {
            return new PolyfillPromise(function(resolve, reject) {
                var state, size = array.length;
                (function iterate(i) {
                    var index = i;
                        
                        array[index]
                        .then(function(value) {
                            if (!state) {
                                state = 'fulfilled';
                                resolve(value);
                            }
                        });
                        array[index]['catch'](function(e) {

                            if (!state) {
                                state = 'rejected';
                                reject(e);
                            }
                        });
                    if (i < size - 1) {
                        iterate(++i);
                    }
                })(0);
            });
        };
        PolyfillPromise.resolve = function(objPromiseThenable) {

            // arg is a Promise
            if (objPromiseThenable && objPromiseThenable.constructor && (objPromiseThenable.constructor===PolyfillPromise)) {
                return objPromiseThenable;

                // arg is thenable    
            } else if (objPromiseThenable && typeof objPromiseThenable.then === 'function') {
                return new PolyfillPromise(function(resolve, reject) {
                    objPromiseThenable.then(resolve, reject);
                });

                // arg is object
            } else {
                return new PolyfillPromise(function(resolve, reject) {
                    resolve(objPromiseThenable);
                });
            }
        };
        PolyfillPromise.reject = function(error) {
            return new PolyfillPromise(function(resolve, reject) {
                reject(error);
            });
        };
        
    } else {

        // use native Promise if exists
        newAble = null;
        PolyfillPromise = root.Promise;
    }

    // AMD module
    if (root.define && root.define.amd && typeof root.define === 'function' ) {
        define([], function() {
            return PolyfillPromise;
        });
    }

    // commonJS module
    else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PolyfillPromise;
        }
        exports.Promise = PolyfillPromise;
    } else if (!root.Promise) {
        root.Promise = PolyfillPromise;
    }
})();
