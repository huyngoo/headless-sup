"use strict";

exports.__esModule = true;
exports.default = exports.program = exports.expression = exports.statements = exports.statement = exports.smart = void 0;

var formatters = _interopRequireWildcard(require("./formatters"));

var _builder = _interopRequireDefault(require("./builder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var smart = (0, _builder.default)(formatters.smart);
exports.smart = smart;
var statement = (0, _builder.default)(formatters.statement);
exports.statement = statement;
var statements = (0, _builder.default)(formatters.statements);
exports.statements = statements;
var expression = (0, _builder.default)(formatters.expression);
exports.expression = expression;
var program = (0, _builder.default)(formatters.program);
exports.program = program;

var _default = Object.assign(smart.bind(undefined), {
  smart: smart,
  statement: statement,
  statements: statements,
  expression: expression,
  program: program,
  ast: smart.ast
});

exports.default = _default;