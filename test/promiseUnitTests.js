var nativePromise = Promise,
    assert = require("assert"),
    testSuite = function(promiseType) {

        return new Promise(function(resolve) {
            describe(promiseType + ' Unit tests', function() {
                describe('instantiation', function() {
                    it('should throw error if argument is not a function', function(done) {
                        assert.throws(
                            function() {
                                new Promise();
                            },
                            Error
                        );
                        done();
                    });
                    it('should have a constructor with name Promise', function(done) {
                        assert.equal(new Promise(function() {}).constructor.name, 'Promise');
                        done();
                    });
                    it('should have a methods all, race, resolve and reject', function(done) {
                        assert.equal(typeof Promise.reject, 'function');
                        assert.equal(typeof Promise.resolve, 'function');
                        assert.equal(typeof Promise.all, 'function');
                        assert.equal(typeof Promise.race, 'function');
                        done();
                    });
                    it('instantiated object should have a methods then and catch', function(done) {
                        assert.equal(typeof new Promise(function() {})['catch'], 'function');
                        assert.equal(typeof new Promise(function() {}).then, 'function');
                        done();
                        resolve();
                    });
                });
            });
        });
    };




if (root.Promise) {

    // run test suite against native Promise
    testSuite('Native').then(function() {
        root.Promise = undefined;
        root.Promise = require('../polyfillPromise-0.1.js');

        // run test suite against polyfillPromise
        testSuite('Polyfill').then(function() {
            root.Promise = undefined;
            root.Promise = require('../polyfillPromise-0.1.min.js');

            // run test suite against polyfillPromise.min
            testSuite('Minified Polyfill');
        });
    });
}

// remove Native Promise
