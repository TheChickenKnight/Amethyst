/// <reference types="react" />
import { CollapseProps as AntdCollapseProps } from 'antd';
export type Variant = 'default' | 'block' | 'ghost' | 'pure';
export interface CollapseProps extends AntdCollapseProps {
    gap?: number;
    padding?: number | string | {
        body?: number | string;
        header?: number | string;
    };
    variant?: Variant;
}
declare const Collapse: import("react").NamedExoticComponent<CollapseProps>;
export default Collapse;
