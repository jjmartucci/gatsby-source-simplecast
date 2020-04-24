"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var mapObj = require('map-obj');

var Cache = require('quick-lru');

var cache = new Cache({
  maxSize: 100000
});
/**
 * The most terrible camelizer on the internet, guaranteed!
 * @param {string} str String that isn't camel-case, e.g., CAMeL_CaSEiS-harD
 * @return {string} String converted to camel-case, e.g., camelCaseIsHard
 */

function camelCase(str) {
  return str.replace(/[.,-/\\!&;:{}=\-_…()@+?><[\]+~]/g, ' ').replace(/[#$%^*'"`]/g, '').replace(/(?:^\w|[A-Z]|\b\w)/g, function (ltr, idx) {
    return idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase();
  }).replace(/\s+/g, '');
}

function camelCaseKeys(input, options) {
  var camelCaseConvert = function camelCaseConvert(input, options) {
    options = (0, _extends2.default)({
      deep: false
    }, options);
    var _options = options,
        exclude = _options.exclude;
    return mapObj(input, function (key, value) {
      if (!(exclude && exclude.some(function (x) {
        return typeof x === 'string' ? x === key : x.test(key);
      }))) {
        if (cache.has(key)) {
          key = cache.get(key);
        } else {
          var ret = camelCase(key);

          if (key.length < 100) {
            // Prevent abuse
            cache.set(key, ret);
          }

          key = ret;
        }
      }

      return [key, value];
    }, {
      deep: options.deep
    });
  };

  if (Array.isArray(input)) {
    return Object.keys(input).map(function (key) {
      return camelCaseConvert(input[key], options);
    });
  }

  return camelCaseConvert(input, options);
}

function doubleSlashIt(str) {
  return '/' + unSlashIt(str) + '/';
}

function leadingSlashIt(str) {
  return '/' + unSlashIt(str);
}

function trailingSlashIt(str) {
  return unSlashIt(str) + '/';
}

function unSlashIt(str) {
  return str.replace(/^(\/*)|(\/*)$/g, '');
}

module.exports = {
  camelCase: camelCase,
  camelCaseKeys: camelCaseKeys,
  doubleSlashIt: doubleSlashIt,
  leadingSlashIt: leadingSlashIt,
  trailingSlashIt: trailingSlashIt,
  unSlashIt: unSlashIt
};