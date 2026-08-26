import { CSSProperties, Ref, SVGProps, forwardRef, useMemo } from "react";

// components
import { Icons } from "./constants";

// others
import { colors } from "../colors";

// styles
import "./icon.scss";

export type TIconProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  color?: keyof typeof colors;
  name: keyof typeof Icons;
  size?: number;
};

export const Icon = forwardRef<SVGSVGElement, TIconProps>(
  ({ color = "neutral1", name, size = 16, style, ...restProps }, ref: Ref<SVGSVGElement>) => {
    const SVG = useMemo(() => Icons[name], [name]);

    return (
      <SVG
        className="Icon"
        height={size}
        ref={ref}
        style={{ color: colors[color], ...style } as CSSProperties}
        width={size}
        {...restProps}
      />
    );
  },
);

Icon.displayName = "Icon";

export default Icon;
