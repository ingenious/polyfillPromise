var nativePromise = Promise,
    assert = require("assert"),
    testSuite = function(promiseType) {
      describe(promiseType + ' Functional tests - Promise methods', function() {
            describe('.resolve() & .then()', function() {
                var promiseReturnedFromThen, promise = new Promise(function(resolve) {
                    setTimeout(function() {
                        resolve({
                            hello: 'world'
                        });
                    }, 1000);
                });
                it('then() should receive resolved value', function() {
                    promiseReturnedFromThen = promise.then(function(data) {
                        assert.equal('world', data.hello);
                        return data.hello;
                    });
                });
                it('A second then() should receive resolved value', function() {
                    promise.then(function(data) {
                        assert.equal('world', data.hello);
                        return data.hello;
                    });
                });
                it('then() should return new Promise', function() {
                    assert.notEqual(promiseReturnedFromThen, promise);
                    promiseReturnedFromThen.then(function(value) {
                        assert.equal('world', value);
                    });
                });
            });

            describe('.reject() and .catch()', function() {
                var promiseReturnedFromCatch, rejectPromise = new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        reject(new Error('Too late'));
                    }, 1500);
                });

                it('catch() should receive rejected value', function() {
                    rejectPromise.catch(function(err) {
                        assert.equal('Too late', err.message);
                        return err.message;
                    }).then(
                        function(message) {
                            assert.equal('Too late', message);
                        }
                    );
                });
                it('A second catch() should receive rejected value', function() {
                    promiseReturnedFromCatch = rejectPromise.catch(function(err) {
                        assert.equal('Too late', err.message);
                        return err.message;
                    });
                });
                it('catch() should return new Promise', function() {
                    assert.notEqual(promiseReturnedFromCatch, rejectPromise);
                    promiseReturnedFromCatch.then(function(value) {
                        assert.equal('Too late', value);
                    });
                });
            });
            describe('Promise.race()', function() {
                var promiseSlow = new Promise(function(resolve) {
                        setTimeout(function() {
                            resolve({
                                type: 'slow'
                            });
                        }, 1000);
                    }),
                    promiseFast = new Promise(function(resolve) {
                        setTimeout(function() {
                            resolve({
                                type: 'fast'
                            });
                        }, 500);
                    });
                it('.race() should resolve when first Promise resolves', function() {
                    Promise.race([promiseFast, promiseSlow]).then(function(data) {
                        assert.equal('fast', data.type);
                    });
                });
                promiseSlow = new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        reject(new Error('slow'));
                    }, 1000);
                });
                promiseFast = new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        reject(new Error('fast'));
                    }, 500);
                });
                it('.race() should reject when first Promise rejects', function() {
                    Promise.race([promiseFast, promiseSlow]).catch(function(err) {
                        assert.equal('fast', err.message);
                    });
                });
            });
            describe('Promise.all()', function() {
                var promiseSlow = new Promise(function(resolve) {
                        setTimeout(function() {
                            resolve({
                                type: 'slow'
                            });
                        }, 1000);
                    }),
                    promiseFast = new Promise(function(resolve) {
                        setTimeout(function() {
                            resolve({
                                type: 'fast'
                            });
                        }, 500);
                    });
                it('.all() should resolve when last Promise resolves with array of returned values', function() {
                    start = new Date().getTime();
                    Promise.all([promiseFast, promiseSlow]).then(function(data) {
                        assert.equal('slow', data[1].type, 'slow');
                        assert.equal('fast', data[0].type);
                    });
                });
                promiseSlow = new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        reject(new Error('slow'));
                    }, 1000);
                });
                promiseFast = new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        reject(new Error('fast'));
                    }, 500);
                });
                it('.all() should reject when first Promise rejects', function() {
                    Promise.all([promiseFast, promiseSlow]).catch(function(err) {
                        assert.equal('fast', err.message);
                    });
                });
            });

            describe('Promise.resolve() use cases', function() {
                var resolvedPromise,
                    promise = new Promise(function(resolve) {
                        resolve({
                            hello: 'world'
                        });
                    }),
                    thenable = {
                        then: function(resolve) {
                            resolve({
                                type: 'thenable'
                            });
                        }
                    };
                it('Promise.resolve(promise) returns promise', function() {
                  resolvedPromise = Promise.resolve(promise);
                	assert.equal(resolvedPromise, promise);
                    resolvedPromise.then(function(data) {
                        assert.equal('world', data.hello);
                    });
                });
                it('Promise.resolve(thenable) returns Promise that follows thenable', function() {
                    Promise.resolve(thenable)
                        .then(function(data) {
                            assert.equal('thenable', data.type);
                        });
                });
                it('Promise.resolve(value) returns Promise that resolves to value', function() {
                    var resolvedPromise = Promise.resolve({
                        type: 'Promise.resolve'
                    });

                    resolvedPromise.then(function(data) {
                        assert.equal('Promise.resolve', data.type);
                    });
                    resolvedPromise
                        .then(function(data) {
                            assert.equal('Promise.resolve', data.type);
                        });
                });

            });
            describe('Promise.reject() ', function() {
                it('Promise.resolve(value) should return promise that rejects to value', function() {
                    rejectedPromise = Promise.reject(new Error(34));
                    rejectedPromise.catch(function(err) {
                        assert.equal(34, err.message);
                    });
                    rejectedPromise.catch(function(err) {
                        assert.equal(34, err.message);
                    });
                });
            });
        });
    };

if (root.Promise) {
    // run test suite against native Promise
    testSuite('Native');
    root.Promise = undefined;
}

// remove Native Promise

root.Promise = require('../polyfillPromise-0.1.js');

// run test suite against polyfillPromise
testSuite('Polyfill');

root.Promise = undefined;
root.Promise = require('../polyfillPromise-0.1.min.js');

// run test suite against polyfillPromise.min
testSuite('Minified Polyfill');
