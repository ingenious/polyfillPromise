// version 0.1
// polyfill ES6 Promise in older browsers
// Stephen Giles. https://github.com/ingenious
(function() {
    var PolyfillPromise, root = this;
    if (!root.Promise) {
        PolyfillPromise = function Promise(fn) {
            var pp = this,
                onResolve, rejectedArgs, onReject, resolvedArgs,
                state = 'pending',
                reject = function(args) {
                    rejectedArgs = arguments;
                    if (typeof onReject === 'function') {
                        onReject.apply(pp, rejectedArgs);
                    }
                    state = 'rejected';
                },
                resolve = function(args) {
                    resolvedArgs = arguments;
                    if (typeof onResolve === 'function') {
                        onResolve.apply(pp, resolvedArgs);
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
            }
            pp.then = function(callback) {
                if (typeof callback === 'function') {
                    onResolve = callback;
                    if (state === 'fulfilled') {
                        onResolve.apply(pp, resolvedArgs);
                    }
                }
                return pp;
            };
            pp.catch = function(fail) {
                if (typeof fail === 'function') {
                    onReject = fail;
                    if (state === 'rejected') {
                        onReject.apply(pp, rejectedArgs);
                    }
                }
                return pp;
            };
            return pp;
        };
        PolyfillPromise.all = function(array) {
            return new PolyfillPromise(function(resolve, reject) {
                var state, resolvedValues = [],
                    resolved = 0,
                    size = array.length;
                (function iterate(i) {
                    var index = i;
                    PolyfillPromise.resolve(array[i])
                        .then(function(value) {
                            resolvedValues[index] = value;
                            if (++resolved === size) {
                                resolve(resolvedValues);
                            }
                        }).catch(function(e) {
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
                    var index = i,
                        promise =
                        PolyfillPromise.resolve(array[index])
                        .then(function(value) {
                            if (!state) {
                                state = 'fulfilled';
                                resolve(value);
                            }
                        }).catch(function(e) {
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
            if (objPromiseThenable.constructor && objPromiseThenable.constructor.name === 'Promise') {
                return objPromiseThenable;

                // arg is thenable    
            } else if (typeof objPromiseThenable.then === 'function') {
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
        PolyfillPromise = root.Promise;
    }

    // AMD module
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return PolyfillPromise;
        });
    }

    // commonJS module
    else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PolyFillPromise;
        }
        exports.Promise = PolyfillPromise;
    } else if (!root.Promise) {
        root.Promise = PolyfillPromise;
    }
})();
