import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["href", "target"];
import A from "../A";
import { jsx as _jsx } from "react/jsx-runtime";
var Link = function Link(_ref) {
  var href = _ref.href,
    target = _ref.target,
    rest = _objectWithoutProperties(_ref, _excluded);
  var isNewWindow = href === null || href === void 0 ? void 0 : href.startsWith('http');
  return /*#__PURE__*/_jsx(A, _objectSpread({
    href: href,
    target: target || isNewWindow ? '_blank' : undefined
  }, rest));
};
export default Link;