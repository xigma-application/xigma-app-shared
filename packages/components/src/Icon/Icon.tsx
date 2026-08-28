import { CSSProperties, Ref, SVGProps, forwardRef, useMemo } from "react";

// components
import { Icons } from "./constants";

// others
import { colors } from "../colors";

// styles
import "./icon.scss";

export type TIconProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  /** The icon's color — one of `@xigma/components`'s `colors` theme tokens. */
  color?: keyof typeof colors;
  /** Name of the icon from the shared icon set. */
  name: keyof typeof Icons;
  /** Width and height of the icon, in pixels. */
  size?: number;
};

/**
 * Renders one of the icons from the shared icon set. Also accepts the standard
 * `SVGProps<SVGSVGElement>` (except `color`, which is typed to the theme color keys, not a CSS
 * color).
 */
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
