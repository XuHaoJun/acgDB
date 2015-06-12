var _ = require('lodash');
var moment = require('moment');
var express = require('express');
var Promise = require('bluebird');
var MongoDB = Promise.promisifyAll(require("mongodb"));
var MongoClient = Promise.promisifyAll(MongoDB.MongoClient);

var configs = require('../config');

var acgTypes = ['anime', 'comic', 'PC', 'PS4', 'PS3', 'xbone', 'xbox360',
                'OLG', 'web', 'novel', 'android', 'ios', 'GBA', 'facebook',
                'wiiu', 'PSP', 'PSV', '3DS'];

var url = configs.mongodb.url;

var acgTypesHasLastDateField = ['anime', 'PC', 'OLG', 'web', 'PS4', 'PS3', 'wiiu',
                                'xbone', 'xbox360', 'GBA', 'PSP', '3DS'];

function _commonLastDateField(acgType) {
  var field = null;
  switch (acgType) {
  case 'anime':
    field = 'firstBroadcastLocal';
    break;
  case 'PC':
  case 'PS4':
  case 'PS3':
  case 'wiiu':
  case 'xbone':
  case 'xbox360':
  case 'GBA':
  case 'PSP':
  case '3DS':
    field = 'sellDate';
    break;
  case 'OLG':
  case 'web':
    field = 'openBetaDate';
    break;
  }
  return field;
}

function _apiRouter() {
  var threeMin = 1000 * 60 * 3;

  var apiRouter = express.Router();
  apiRouter.use(function(req, res, next) {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, max-age='+threeMin);
    }
    next();
  });

  _.forEach(acgTypes, function(acgType, index) {
    apiRouter.get('/' + acgType + 's', function(req, res) {
      MongoClient.connect(url, function(err, db) {
        if (!_.isNull(err)) {
          res.json(null);
          return;
        }
        var collection = db.collection(acgType);
        collection.find({}, {_id: false}).toArray(function(err, docs) {
          res.json(docs);
          db.close();
        });
      });
    });

    apiRouter.get('/' + acgType + 's/search', function(req, res) {
      MongoClient.connect(url, function(err, db) {
        if (!_.isNull(err)) {
          res.json(null);
          return;
        }
        var collection = db.collection(acgType);
        var langs = {TW: 'nameTW', EN: 'nameEN', JP: 'nameJP'};
        var lang = langs[req.query.lang] || 'nameTW';
        var query = {};
        query[lang] = new RegExp(req.query.q);
        collection.find(query, {_id: false}).toArray(function(err, docs) {
          res.json(docs);
          db.close();
        });
      });
    });


    apiRouter.get('/' + acgType + '/:id', function(req, res) {
      MongoClient.connect(url, function(err, db) {
        if (!_.isNull(err)) {
          res.json(null);
          return;
        }
        var id = parseInt(req.params.id);
        if (_.isNaN(id)) {
          res.json(null);
          return;
        }
        var collection = db.collection(acgType);
        collection.findOne({id: id}, {_id: false}, function(err, doc) {
          res.json(doc);
          db.close();
        });
      });
    });
  });

  apiRouter.get('/acg/:id', function(req, res) {
    var id = parseInt(req.params.id);
    if (_.isNaN(id)) {
      res.json(null);
      return;
    }
    MongoClient.connect(url, function(err, db) {
      if (!_.isNull(err)) {
        res.json(null);
        db.close();
        return;
      }
      var numComplete = 0;
      var isFound = false;
      _.forEach(acgTypes, function(acgType, index) {
        var collection = db.collection(acgType);
        collection.findOne({id: id}, {_id: false}, function(err, doc) {
          if (!_.isNull(doc)) {
            isFound = true;
            res.json(doc);
          } else if(numComplete == (acgTypes.length - 1)) {
            if (!isFound) {
              res.json(null);
            }
            db.close();
          }
          numComplete += 1;
        });
      });
    });
  });

  apiRouter.get('/lastACGs/pages/:numPage', function(req, res) {
    var numDays = (req.query.numDays ? parseInt(req.query.numDays) : 14);
    var numPage = parseInt(req.params.numPage);
    if (numPage && numPage <= 0) {
      res.json(null);
      return;
    }
    MongoClient.connect(url, function(err, db) {
      var mergedDocs = [];
      var acgs = {};
      var numComplete = 0;
      _.forEach(acgTypesHasLastDateField, function(acgType) {
        var collection = db.collection(acgType);
        var dateField = _commonLastDateField(acgType);
        var sortQuery = {id: 1};
        sortQuery[dateField] = 1;
        var findQuery = {};
        var now = moment();
        findQuery[dateField] = {
          $gte: now.clone().subtract(numDays * numPage, 'days').toISOString()
        };
        if (numPage > 1) {
          findQuery[dateField].$lte = now.clone().subtract(
            numDays * (numPage - 1), 'days'
          ).toISOString();
        }
        collection
          .find(findQuery, {_id: false})
          .sort(sortQuery)
          .toArrayAsync()
          .then(function(docs) {
            mergedDocs[acgType] = docs;
            if ((acgTypesHasLastDateField.length - 1) === numComplete) {
              var finalMergedDocs = [];
              _.forEach(acgTypesHasLastDateField, function(t) {
                finalMergedDocs.push(mergedDocs[t]);
              });
              finalMergedDocs = _.flatten(finalMergedDocs);
              finalMergedDocs = _.sortBy(finalMergedDocs, function(d) {
                dateField = _commonLastDateField(d.acgType);
                d.commonLastDate = d[dateField];
                return new Date(d[dateField]).getTime();
              });
              finalMergedDocs.reverse();
              res.json(finalMergedDocs);
              db.close();
            }
            numComplete += 1;
          });
      });
    });
  });

  apiRouter.get('/acgs', function(req, res) {
    MongoClient.connect(url, function(err, db) {
      if (!_.isNull(err)) {
        res.json(null);
        db.close();
        return;
      }
      var mergedDocs = [];
      var acgs = {};
      var numComplete = 0;
      _.forEach(acgTypes, function(acgType) {
        var collection = db.collection(acgType);
        collection.find({}, {_id: false}).toArray(function(err, docs) {
          acgs[acgType] = docs;
          if ((acgTypes.length - 1) == numComplete) {
            _.forEach(acgTypes, function(atype) {
              mergedDocs = mergedDocs.concat(acgs[atype]);
            });
            res.json(mergedDocs);
            db.close();
          }
          numComplete += 1;
        });
      });
    });
  });

  apiRouter.get('/acgs/search', function(req, res) {
    MongoClient.connect(url, function(err, db) {
      if (!_.isNull(err)) {
        res.json(null);
        return;
      }
      var mergedDocs = [];
      var reqFields = req.query.fields ? JSON.parse(req.query.fields) : null;
      var reqLimit = req.query.limit ? JSON.parse(req.query.limit) : null;
      var reqPluck = req.query.pluck ? req.query.pluck : null;
      var langs = {TW: 'nameTW', EN: 'nameEN', JP: 'nameJP'};
      var lang = langs[req.query.lang] || 'nameTW';
      var query = {};
      var numComplete = 0;
      var findOptions = {};
      if (reqLimit) {
        findOptions.limit = reqLimit;
      }
      query[lang] = new RegExp(req.query.q);
      _.forEach(acgTypes, function(acgType, index) {
        var collection = db.collection(acgType);
        collection.find(query, {_id: false}, findOptions).toArray(function(err, docs) {
          mergedDocs = mergedDocs.concat(docs);
          if ((acgTypes.length - 1) === numComplete) {
            mergedDocs = _.sortBy(mergedDocs, 'id');
            if (reqFields) {
              mergedDocs = _.map(mergedDocs, function(doc) {
                var newDoc = {};
                _.forEach(reqFields, function(f) {
                  if (doc[f]) {
                    newDoc[f] = doc[f];
                  }
                });
                return newDoc;
              });
            }
            if (reqLimit) {
              mergedDocs = _.take(mergedDocs, reqLimit);
            }
            if (reqPluck) {
              mergedDocs = _.pluck(mergedDocs, reqPluck);
            }
            res.json(mergedDocs);
            db.close();
          }
          numComplete += 1;
        });
      });
    });
  });

  apiRouter.get('/db/collection/:collection/count', function(req, res) {
    if (acgTypes.indexOf(req.params.collection) == -1) {
      res.json(null);
      return;
    }
    MongoClient.connect(url, function(err, db) {
      if (!_.isNull(err)) {
        res.json(null);
        return;
      }
      var acgType = req.params.collection;
      var collection = db.collection(acgType);
      collection.count(function(err, count) {
        if (!_.isNull(err)) {
          res.json(null);
          return;
        }
        res.json(count);
        db.close();
      });
    });
  });

  apiRouter.get('/db/collection/:collection/find', function(req, res) {
    if (acgTypes.indexOf(req.params.collection) == -1) {
      res.json(null);
      return;
    }
    MongoClient.connect(url, function(err, db) {
      if (!_.isNull(err)) {
        res.json(null);
        return;
      }
      var acgType = req.params.collection;
      var query = req.query.query ? JSON.parse(req.query.query) : {};
      var fields = req.query.fields ? JSON.parse(req.query.fields) : {};
      fields._id = false;
      var options = req.query.options || null;
      var collection = db.collection(acgType);
      collection.find(query, fields, options).toArray(function(err, docs) {
        res.json(docs);
        db.close();
      });
    });
  });

  return apiRouter;
}

var _clientPaths = [
  '/', '/about', '/search', '/chat',
  '/acg/:acgId'
];

var fs = require('fs');

var Hogan = require('hogan');

var _clientTemplate = Hogan.compile(
  fs.readFileSync(configs.server.clientTemplate, 'utf-8')
);

function _passPathToClient(req, res) {
  res.contentType('text/html');
  res.send(
    _clientTemplate.render(
      {clientRouterPath: req.path,
       enableManifest: process.env.NODE_ENV === 'production' ? true : false,
       hasGoogleAnalyticsTracking: (configs.server.googleAnalyticsTracking ?
                                    true : false),
       googleAnalyticsTracking: configs.server.googleAnalyticsTracking
      }
    )
  );
}

exports.addToExpress = function(app) {
  app.use('/', express.static(configs.server.staticDirectory));

  app.use('/api', _apiRouter());

  var i = 0;
  for(i=0; i<_clientPaths.length; i++) {
    app.get(_clientPaths[i], _passPathToClient);
  }
};
