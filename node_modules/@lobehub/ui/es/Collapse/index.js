import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["style", "variant", "gap", "className", "padding"];
import { Collapse as AntdCollapse } from 'antd';
import { ChevronDown } from 'lucide-react';
import { memo } from 'react';
import Icon from "../Icon";
import { useStyles } from "./style";
import { jsx as _jsx } from "react/jsx-runtime";
var Collapse = /*#__PURE__*/memo(function (_ref) {
  var style = _ref.style,
    _ref$variant = _ref.variant,
    variant = _ref$variant === void 0 ? 'default' : _ref$variant,
    _ref$gap = _ref.gap,
    gap = _ref$gap === void 0 ? 0 : _ref$gap,
    className = _ref.className,
    padding = _ref.padding,
    rest = _objectWithoutProperties(_ref, _excluded);
  var bodyPadding = _typeof(padding) === 'object' ? padding.body : padding;
  var headerPadding = _typeof(padding) === 'object' ? padding.header : padding;
  var _useStyles = useStyles({
      bodyPadding: bodyPadding === undefined ? '12px 16px' : bodyPadding,
      headerPadding: headerPadding === undefined ? '12px 16px' : headerPadding,
      isSplit: !!gap
    }),
    cx = _useStyles.cx,
    styles = _useStyles.styles;
  var variantStyle = cx(variant === 'default' && styles.defaultStyle, variant === 'block' && styles.blockStyle, variant === 'ghost' && styles.ghostStyle, variant === 'pure' && styles.pureStyle);
  return /*#__PURE__*/_jsx(AntdCollapse, _objectSpread({
    bordered: !gap && (variant === 'default' || variant === 'ghost'),
    className: cx(styles.group, variantStyle, className),
    expandIcon: function expandIcon(_ref2) {
      var isActive = _ref2.isActive;
      return /*#__PURE__*/_jsx(Icon, {
        className: styles.icon,
        icon: ChevronDown,
        size: {
          fontSize: 16
        },
        style: isActive ? {} : {
          rotate: '-90deg'
        }
      });
    },
    style: _objectSpread({
      gap: gap
    }, style)
  }, rest));
});
export default Collapse;