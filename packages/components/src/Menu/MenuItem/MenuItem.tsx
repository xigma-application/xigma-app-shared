import cx from 'classnames';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { FC } from 'react';

// components
import Icon, { TIconProps } from '../../Icon/Icon';

// styles
import './menu-item.scss';

export type TMenuItemProps = {
  checkIconSize?: number;
  className?: string;
  disabled?: boolean;
  icon?: TIconProps['name'];
  iconSize?: number;
  label: string;
  marginBottom?: boolean;
  marginTop?: boolean;
  onClick?: (event: Event) => void;
  selected?: boolean;
  shortcut?: string;
  shortcutClassName?: string;
  withCheck?: boolean;
};

export const MenuItem: FC<TMenuItemProps> = ({
  checkIconSize = 14,
  className = '',
  disabled = false,
  icon,
  iconSize = 14,
  label,
  marginBottom = false,
  marginTop = false,
  onClick,
  selected = false,
  shortcut,
  shortcutClassName = '',
  withCheck = true,
}) => (
  <DropdownMenuPrimitive.Item
    className={cx(
      'MenuItem',
      { 'MenuItem--marginBottom': marginBottom, 'MenuItem--marginTop': marginTop },
      className,
    )}
    disabled={disabled}
    onSelect={onClick}
  >
    {withCheck && (
      <span style={{ opacity: selected ? 1 : 0 }}>
        <Icon name="Check" size={checkIconSize} />
      </span>
    )}
    {icon && <Icon name={icon} size={iconSize} />}
    <span className="MenuItem__label">{label}</span>
    {shortcut && <span className={cx('MenuItem__shortcut', shortcutClassName)}>{shortcut}</span>}
  </DropdownMenuPrimitive.Item>
);

export default MenuItem;
