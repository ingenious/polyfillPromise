// version 0.1
// polyfill ES6 Promise in older browsers
// Stephen Giles
(function() {
    if (!window.Promise) {
        var PolyfillPromise = function Promise(fn) {
            var pp = this,
                onResolve, rejectedArgs, onReject, resolvedArgs,
                state = 'pending',
                reject = function(args) {
                    rejectedArgs = arguments;
                    if (typeof onreject === 'function') {
                        onreject.apply(pp, rejectedArgs);
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
        window.Promise = PolyfillPromise;
    }
})();
