'use strict';

var url = require('url');
module.exports = function requestToContext(req) {
    var queryString = req.method === 'POST' ?
        req.body : url.parse(req.href()).query;
    var context = {};
    req.log.debug({href: req.href(), method: req.method, qs: queryString});
    if (queryString) {
        context = queryString.
            split('&').
            reduce(function(acc, q) {
            var queryParam = q.split('=');
            acc[queryParam[0]] = decodeURIComponent(queryParam[1]);
            if (queryParam[0] === 'path') {
                // optional, Falcor endpoint will take care of that.
                try {
                    acc[queryParam[0]] = JSON.parse(acc[queryParam[0]]);
                } catch (e) {
                    req.log.error({
                        err: e,
                        data: acc[queryParam[0]]
                    }, 'unable to parse json');
                }
            }
            return acc;
        }, {});
    }
    return context;
};
