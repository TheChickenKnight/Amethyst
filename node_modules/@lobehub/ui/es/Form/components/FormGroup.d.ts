import { type CollapseProps } from 'antd';
import { type ReactNode } from 'react';
import { type IconProps } from "../../Icon";
export type FormVariant = 'default' | 'block' | 'ghost' | 'pure';
export type ItemsType = 'group' | 'flat';
export declare const useStyles: (props?: unknown) => import("antd-style").ReturnStyles<{
    blockStyle: import("antd-style").SerializedStyles;
    defaultStyle: import("antd-style").SerializedStyles;
    flatGroup: import("antd-style").SerializedStyles;
    ghostStyle: import("antd-style").SerializedStyles;
    group: string;
    icon: import("antd-style").SerializedStyles;
    mobileFlatGroup: import("antd-style").SerializedStyles;
    mobileGroupBody: import("antd-style").SerializedStyles;
    mobileGroupHeader: import("antd-style").SerializedStyles;
    pureStyle: import("antd-style").SerializedStyles;
    pureTitle: import("antd-style").SerializedStyles;
    title: import("antd-style").SerializedStyles;
}>;
export interface FormGroupProps extends CollapseProps {
    children: ReactNode;
    defaultActive?: boolean;
    extra?: ReactNode;
    icon?: IconProps['icon'];
    itemsType?: ItemsType;
    title?: ReactNode;
    variant?: FormVariant;
}
declare const FormGroup: import("react").NamedExoticComponent<FormGroupProps>;
export default FormGroup;
