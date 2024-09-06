'use client';

import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _taggedTemplateLiteral from "@babel/runtime/helpers/esm/taggedTemplateLiteral";
var _excluded = ["children", "className", "maxItemWidth", "rows"];
var _templateObject;
import { createStyles } from 'antd-style';
import Grid from "../Grid";
import { jsx as _jsx } from "react/jsx-runtime";
var useStyles = createStyles(function (_ref) {
  var css = _ref.css;
  return {
    container: css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);\n\n      > div {\n        margin: 0 !important;\n      }\n    "])))
  };
});
var Cards = function Cards(_ref2) {
  var children = _ref2.children,
    className = _ref2.className,
    _ref2$maxItemWidth = _ref2.maxItemWidth,
    maxItemWidth = _ref2$maxItemWidth === void 0 ? 250 : _ref2$maxItemWidth,
    _ref2$rows = _ref2.rows,
    rows = _ref2$rows === void 0 ? 3 : _ref2$rows,
    rest = _objectWithoutProperties(_ref2, _excluded);
  var _useStyles = useStyles(),
    cx = _useStyles.cx,
    styles = _useStyles.styles;
  return /*#__PURE__*/_jsx(Grid, _objectSpread(_objectSpread({
    className: cx(styles.container, className),
    maxItemWidth: maxItemWidth,
    rows: rows
  }, rest), {}, {
    children: children
  }));
};
export default Cards;