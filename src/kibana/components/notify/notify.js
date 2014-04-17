define(function (require) {
  var _ = require('lodash');
  var nextTick = require('utils/next_tick');
  var $ = require('jquery');
  var modules = require('modules');
  var module = modules.get('kibana/notify');
  var errors = require('./errors');
  var Notifier = require('./_notifier');
  var rootNotifier = new Notifier();

  require('./directives');

  module.factory('createNotifier', function () {
    return function (opts) {
      return new Notifier(opts);
    };
  });

  module.factory('Notifier', function () {
    return Notifier;
  });

  /**
   * Global Angular uncaught exception handler
   */
  modules
    .get('exceptionOverride')
    .factory('$exceptionHandler', function () {
      return function (exception, cause) {
        rootNotifier.fatal(exception, cause);
      };
    });

  /**
   * Global Require.js exception handler
   */
  window.requirejs.onError = function (err) {
    rootNotifier.fatal(new errors.ScriptLoadFailure(err));
  };

  window.onerror = function (err, url, line) {
    rootNotifier.fatal(new Error(err + ' (' + url + ':' + line + ')'));
    return true;
  };

  return rootNotifier;

});