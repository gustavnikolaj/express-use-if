require('express/lib/application').useif = function (condition, mountPointOrMiddleware) {
    var middleware,
        mountPoint,
        hasMiddlewareArgs = false,
        middlewareArgs;
    if (typeof mountPointOrMiddleware === 'string') {
        mountPoint = mountPointOrMiddleware;
        if (arguments.length > 4) {
            throw new Error('Unsupported number of arguments');
        }
        middleware = arguments[2];
        if (arguments.length === 4) {
            middlewareArgs = arguments[3];
            hasMiddlewareArgs = true;
        }
    } else {
        if (arguments.length > 3) {
            throw new Error('Unsupported number of arguments');
        }
        middleware = mountPointOrMiddleware;
        if (arguments.length === 3) {
            middlewareArgs = arguments[2];
            hasMiddlewareArgs = true;
        }
    }
    if (condition) {
        if (hasMiddlewareArgs) {
            if (!Array.isArray(middlewareArgs)) {
                middlewareArgs = [middlewareArgs];
            }
            middleware = middleware.apply(middleware, middlewareArgs);
        }
        if (typeof mountPoint === 'string') {
            return this.use.call(this, mountPoint, middleware);
        } else {
            return this.use.call(this, middleware);
        }
    }
    return this;
};

module.exports = null;
