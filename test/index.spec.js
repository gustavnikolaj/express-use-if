/* global describe, it, beforeEach */
require('../');
var express = require('express');
var sinon = require('sinon');
var expect = require('unexpected')
    .clone()
    .installPlugin(require('unexpected-sinon'))
    .installPlugin(require('unexpected-express'));
    // .addAssertion('to yield a response of', function (expect, subject, value, done) {
    //     var app = express()
    //         .use(require('cookie-parser')())
    //         .use(function (req, res) {
    //             res.send('Hello world!');
    //         });
    //     expect(app, 'to yield exchange', {
    //         request: subject,
    //         response: value
    //     }, done);
    // });

// condition, mountPoint, middleware, middlewareArgs
// condition, mountPoint, middleware
// condition, middleware, middlewareArgs
// condition, middleware

describe('express.useif', function () {
    describe('.useif(condition, middleware)', function () {
        var appFactory = function (condition) {
            return express()
                .useif(condition, function (req, res) {
                    return res.send('Foo');
                })
                .use(function (req, res) {
                    res.send('Bar');
                });
        };
        it('should mount if condition is true', function (done) {
            expect(appFactory(true), 'to yield exchange', {
                request: 'GET /',
                response: 'Foo'
            }, done);
        });
        it('should not mount if condition is false', function (done) {
            expect(appFactory(false), 'to yield exchange', {
                request: 'GET /',
                response: 'Bar'
            }, done);
        });
    });
    describe('.useif(condition, mountPoint, middleware)', function () {
        var appFactory = function (condition) {
            return express()
                .useif(condition, '/qux', function (req, res) {
                    return res.send('Foo');
                })
                .use('/qux', function (req, res) {
                    res.send('Bar');
                });
        };
        it('should mount if condition is true', function (done) {
            expect(appFactory(true), 'to yield exchange', {
                request: 'GET /qux',
                response: 'Foo'
            }, done);
        });
        it('should not mount if condition is false', function (done) {
            expect(appFactory(false), 'to yield exchange', {
                request: 'GET /qux',
                response: 'Bar'
            }, done);
        });
    });
    describe('.useif(condition, middlewareFactory, middlewareArgs)', function () {
        var middlewareFactory;
        var appFactory;
        beforeEach(function () {
            middlewareFactory = sinon.spy(function (arg) {
                return function (req, res) {
                    return res.send('Foo, with arg: ' + arg);

                };
            });
            appFactory = function (condition) {
                return express()
                    .useif(condition, middlewareFactory, 'middlewareArgs')
                    .use(function (req, res) {
                        res.send('Bar');
                    });
            };
        });
        it('should execute middlewareFactory if condition is true', function () {
            appFactory(true);
            expect(middlewareFactory, 'was called once');
        });
        it('should not middlewareFactory if condition is false', function () {
            appFactory(false);
            expect(middlewareFactory, 'was not called');
        });
        it('should mount middleware if condition is true', function (done) {
            expect(appFactory(true), 'to yield exchange', {
                request: 'GET /',
                response: 'Foo, with arg: middlewareArgs'
            }, done);
        });
        it('should not middleware mount if condition is false', function (done) {
            expect(appFactory(false), 'to yield exchange', {
                request: 'GET /',
                response: 'Bar'
            }, done);
        });
    });
    describe('.useif(condition, mountPoint, middlewareFactory, middlewareArgs)', function () {
        var middlewareFactory;
        var appFactory;
        beforeEach(function () {
            middlewareFactory = sinon.spy(function (arg) {
                return function (req, res) {
                    return res.send('Foo, with arg: ' + arg);

                };
            });
            appFactory = function (condition) {
                return express()
                    .useif(condition, '/qux', middlewareFactory, 'middlewareArgs')
                    .use('/qux', function (req, res) {
                        res.send('Bar');
                    });
            };
        });
        it('should execute middlewareFactory if condition is true', function () {
            appFactory(true);
            expect(middlewareFactory, 'was called once');
        });
        it('should not middlewareFactory if condition is false', function () {
            appFactory(false);
            expect(middlewareFactory, 'was not called');
        });
        it('should mount middleware if condition is true', function (done) {
            expect(appFactory(true), 'to yield exchange', {
                request: 'GET /qux',
                response: 'Foo, with arg: middlewareArgs'
            }, done);
        });
        it('should not middleware mount if condition is false', function (done) {
            expect(appFactory(false), 'to yield exchange', {
                request: 'GET /qux',
                response: 'Bar'
            }, done);
        });
    });
    describe('middlewareArgs', function () {
        it('takes args as a list', function (done) {
            var app =  express()
                .useif(true, '/qux', function (arg1, arg2) {
                    return function (req, res) {
                        return res.send([arg1, arg2]);
                    };
                }, ['middlewareArg1', 'middlewareArg2']);
            expect(app, 'to yield exchange', {
                request: 'GET /qux',
                response: '["middlewareArg1","middlewareArg2"]'
            }, done);
        });
        it('takes args as a value', function (done) {
            var app =  express()
                .useif(true, '/qux', function (arg1) {
                    return function (req, res) {
                        return res.send(arg1);
                    };
                }, 'foo');
            expect(app, 'to yield exchange', {
                request: 'GET /qux',
                response: 'foo'
            }, done);
        });
        it('throws an error if too many arguments is passed', function () {
            expect(function () {
                express()
                    .useif(true, '/qux', function (arg1) {
                        return function (req, res) {};
                    }, 'foo', 'bar');
            }, 'to throw', 'Unsupported number of arguments');
        });
    });
});
