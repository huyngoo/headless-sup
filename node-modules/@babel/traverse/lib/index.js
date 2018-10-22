"use strict";

exports.__esModule = true;
exports.default = traverse;
Object.defineProperty(exports, "NodePath", {
  enumerable: true,
  get: function get() {
    return _path.default;
  }
});
Object.defineProperty(exports, "Scope", {
  enumerable: true,
  get: function get() {
    return _scope.default;
  }
});
Object.defineProperty(exports, "Hub", {
  enumerable: true,
  get: function get() {
    return _hub.default;
  }
});
exports.visitors = void 0;

var _context = _interopRequireDefault(require("./context"));

var visitors = _interopRequireWildcard(require("./visitors"));

exports.visitors = visitors;

var _includes = _interopRequireDefault(require("lodash/includes"));

var t = _interopRequireWildcard(require("@babel/types"));

var cache = _interopRequireWildcard(require("./cache"));

var _path = _interopRequireDefault(require("./path"));

var _scope = _interopRequireDefault(require("./scope"));

var _hub = _interopRequireDefault(require("./hub"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function traverse(parent, opts, scope, state, parentPath) {
  if (!parent) return;
  if (!opts) opts = {};

  if (!opts.noScope && !scope) {
    if (parent.type !== "Program" && parent.type !== "File") {
      throw new Error("You must pass a scope and parentPath unless traversing a Program/File. " + ("Instead of that you tried to traverse a " + parent.type + " node without ") + "passing scope and parentPath.");
    }
  }

  visitors.explode(opts);
  traverse.node(parent, opts, scope, state, parentPath);
}

traverse.visitors = visitors;
traverse.verify = visitors.verify;
traverse.explode = visitors.explode;
traverse.NodePath = require("./path");
traverse.Scope = require("./scope");
traverse.Hub = require("./hub");

traverse.cheap = function (node, enter) {
  return t.traverseFast(node, enter);
};

traverse.node = function (node, opts, scope, state, parentPath, skipKeys) {
  var keys = t.VISITOR_KEYS[node.type];
  if (!keys) return;
  var context = new _context.default(scope, opts, state, parentPath);

  for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var _key = _ref;
    if (skipKeys && skipKeys[_key]) continue;
    if (context.visit(node, _key)) return;
  }
};

traverse.clearNode = function (node, opts) {
  t.removeProperties(node, opts);
  cache.path.delete(node);
};

traverse.removeProperties = function (tree, opts) {
  t.traverseFast(tree, traverse.clearNode, opts);
  return tree;
};

function hasBlacklistedType(path, state) {
  if (path.node.type === state.type) {
    state.has = true;
    path.stop();
  }
}

traverse.hasType = function (tree, type, blacklistTypes) {
  if ((0, _includes.default)(blacklistTypes, tree.type)) return false;
  if (tree.type === type) return true;
  var state = {
    has: false,
    type: type
  };
  traverse(tree, {
    noScope: true,
    blacklist: blacklistTypes,
    enter: hasBlacklistedType
  }, null, state);
  return state.has;
};

traverse.cache = cache;