'use client';

import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _taggedTemplateLiteral from "@babel/runtime/helpers/esm/taggedTemplateLiteral";
var _excluded = ["defaultIndex", "items", "children", "className", "tabNavProps"],
  _excluded2 = ["className", "onChange"];
var _templateObject, _templateObject2;
import { createStyles } from 'antd-style';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import TabsNav from "../TabsNav";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var useStyles = createStyles(function (_ref) {
  var css = _ref.css,
    token = _ref.token,
    prefixCls = _ref.prefixCls;
  return {
    container: css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      --lobe-markdown-margin-multiple: 1;\n\n      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);\n      background: ", ";\n      border-radius: calc(var(--lobe-markdown-border-radius) * 1px);\n      box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);\n    "])), token.colorFillQuaternary),
    header: css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n      border-block-end: 1px solid var(--lobe-markdown-border-color);\n      .", "-tabs-tab-btn {\n        font-size: var(--lobe-markdown-font-size);\n        line-height: var(--lobe-markdown-line-height);\n      }\n    "])), prefixCls)
  };
});
var Tabs = function Tabs(_ref2) {
  var _ref2$defaultIndex = _ref2.defaultIndex,
    defaultIndex = _ref2$defaultIndex === void 0 ? '0' : _ref2$defaultIndex,
    items = _ref2.items,
    children = _ref2.children,
    className = _ref2.className,
    _ref2$tabNavProps = _ref2.tabNavProps,
    tabNavProps = _ref2$tabNavProps === void 0 ? {} : _ref2$tabNavProps,
    rest = _objectWithoutProperties(_ref2, _excluded);
  var tabNavClassName = tabNavProps.className,
    _onChange = tabNavProps.onChange,
    tabNavRest = _objectWithoutProperties(tabNavProps, _excluded2);
  var _useState = useState(String(defaultIndex)),
    _useState2 = _slicedToArray(_useState, 2),
    activeIndex = _useState2[0],
    setActiveIndex = _useState2[1];
  var _useStyles = useStyles(),
    cx = _useStyles.cx,
    styles = _useStyles.styles;
  var index = Number(activeIndex);
  return /*#__PURE__*/_jsxs(Flexbox, _objectSpread(_objectSpread({
    className: cx(styles.container, className)
  }, rest), {}, {
    children: [/*#__PURE__*/_jsx(TabsNav, _objectSpread({
      activeKey: activeIndex,
      className: cx(styles.header, tabNavClassName),
      items: items.map(function (item, i) {
        return {
          key: String(i),
          label: item
        };
      }),
      onChange: function onChange(v) {
        setActiveIndex(v);
        _onChange === null || _onChange === void 0 || _onChange(v);
      },
      variant: 'compact'
    }, tabNavRest)), (children === null || children === void 0 ? void 0 : children[index]) || '']
  }));
};
export default Tabs;