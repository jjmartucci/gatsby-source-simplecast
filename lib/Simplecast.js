"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var fetch = require('node-fetch');

var _require = require('./utils'),
    unSlashIt = _require.unSlashIt,
    camelCaseKeys = _require.camelCaseKeys;

var Simplecast = function Simplecast(_ref) {
  var _this = this;

  var token = _ref.token,
      podcastId = _ref.podcastId;
  (0, _defineProperty2.default)(this, "setHeaders", function (headers) {
    if (headers === void 0) {
      headers = {};
    }

    // extract auth values to avoid potential bugs
    var _headers = headers,
        Authorization = _headers.Authorization,
        authorization = _headers.authorization,
        newHeaders = (0, _objectWithoutPropertiesLoose2.default)(_headers, ["Authorization", "authorization"]);
    var currentHeaders = _this.headers;
    _this.headers = (0, _extends2.default)({}, currentHeaders, {}, newHeaders);
  });
  (0, _defineProperty2.default)(this, "request", function (path, params, method) {
    if (path === void 0) {
      path = '';
    }

    if (params === void 0) {
      params = {};
    }

    if (method === void 0) {
      method = 'GET';
    }

    // TODO: let query = qs.stringify(params) || '';
    var url = _this.baseUrl + '/' + unSlashIt(path);
    return fetch(url, {
      method: method,
      headers: _this.headers,
      cache: 'default'
    });
  });
  (0, _defineProperty2.default)(this, "getEpisode", /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(episodeId) {
      var request, json;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (episodeId) {
                _context.next = 2;
                break;
              }

              throw Error('No episode ID provided.');

            case 2:
              _context.prev = 2;
              _context.next = 5;
              return _this.request("episodes/" + episodeId);

            case 5:
              request = _context.sent;
              _context.next = 8;
              return request.json();

            case 8:
              json = _context.sent;
              return _context.abrupt("return", camelCaseKeys(json, {
                deep: true
              }));

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](2);
              console.error(_context.t0);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 12]]);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
  (0, _defineProperty2.default)(this, "getShowInfo", function () {
    return _this.request("podcasts/" + _this.podcastId).then(function (res) {
      return res.json();
    }).then(function (data) {
      return camelCaseKeys(data, {
        deep: true
      });
    }).catch(console.error);
  });
  (0, _defineProperty2.default)(this, "getEpisodes", /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(limit) {
      var request, json, info;
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (limit === void 0) {
                limit = 10;
              }

              _context2.prev = 1;
              _context2.next = 4;
              return _this.request("podcasts/" + _this.podcastId + "/episodes?limit=" + (typeof limit === 'number' ? limit : 10));

            case 4:
              request = _context2.sent;
              _context2.next = 7;
              return request.json();

            case 7:
              json = _context2.sent;
              _context2.next = 10;
              return json.collection;

            case 10:
              info = _context2.sent;
              return _context2.abrupt("return", camelCaseKeys(info, {
                deep: true
              }));

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](1);
              console.error(_context2.t0);

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 14]]);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
  this.token = token;
  this.podcastId = podcastId;
  this.headers = {
    'Access-Control-Allow-Origin': '*',
    Authorization: "Bearer " + token,
    'Content-Type': 'application/json'
  };
  this.baseUrl = "https://api.simplecast.com";
};

module.exports = Simplecast;