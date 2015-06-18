"use strict";
var restify = require("restify");
var FalcorEndpoint = module.exports = {};

FalcorEndpoint.falcor = function(getDataSource) {
    return function(req, res, next) {
        var dataSource = getDataSource(req, res);
        var path;
        try {
            path = JSON.parse(req.query.path);
        } catch (err) {
            return next(new restify.BadRequestError(err,
                            "unable to parse falcor path"));
        }
        req.log.debug({path: path, qs: req.query});
        // probably this should be sanity check function?
        if (Object.keys(req.query).length === 0) {
            return next(new restify.InternalError("Request not supported"));
        }
        if (!req.query.method) {
            return next(new restify.InternalError("No query method provided"));
        }
        if (!dataSource[req.query.method]) {
            return next(new restify.InternalError("Data source does not implement the requested method"));
        }
        dataSource[req.query.method]([].concat(path)).subscribe(function(jsong) {
            //res.send(200, JSON.stringify(jsong));
            req.log.info({data: jsong});
            res.send(200, jsong);
            return next();
        }, function(err) {
            return next(new restify.InternalError(err));
        });
    };
};

