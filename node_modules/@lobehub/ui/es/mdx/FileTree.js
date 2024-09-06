'use client';

import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _taggedTemplateLiteral from "@babel/runtime/helpers/esm/taggedTemplateLiteral";
var _excluded = ["children", "className"];
var _templateObject;
import { createStyles } from 'antd-style';
import { jsx as _jsx } from "react/jsx-runtime";
var useStyles = createStyles(function (_ref) {
  var css = _ref.css,
    token = _ref.token;
  return {
    container: css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);\n      padding-block: 0.75em;\n      padding-inline: 1em;\n\n      color: ", ";\n\n      border-radius: calc(var(--lobe-markdown-border-radius) * 1px);\n      box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);\n    "])), token.colorTextSecondary)
  };
});
var FileTree = function FileTree(_ref2) {
  var children = _ref2.children,
    className = _ref2.className,
    rest = _objectWithoutProperties(_ref2, _excluded);
  var _useStyles = useStyles(),
    cx = _useStyles.cx,
    styles = _useStyles.styles;
  return /*#__PURE__*/_jsx("div", _objectSpread(_objectSpread({
    className: cx(styles.container, className)
  }, rest), {}, {
    children: children
  }));
};
export default FileTree;