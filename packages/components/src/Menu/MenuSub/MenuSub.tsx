import cx from 'classnames';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { FC, ReactNode } from 'react';

// components
import Icon, { TIconProps } from '../../Icon/Icon';

// hooks
import { useDelayedSubOpen } from './hooks/useDelayedSubOpen';

// styles
import '../menu.scss';
import './menu-sub.scss';

export type TMenuSubProps = {
  alignOffset?: number;
  checkIconSize?: number;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: TIconProps['name'];
  iconSize?: number;
  label: string;
  marginBottom?: boolean;
  marginTop?: boolean;
  sideOffset?: number;
  triggerClassName?: string;
  withCheck?: boolean;
};

export const MenuSub: FC<TMenuSubProps> = ({
  alignOffset = -4,
  checkIconSize = 14,
  children,
  className = '',
  disabled = false,
  icon,
  iconSize = 14,
  label,
  marginBottom = false,
  marginTop = false,
  sideOffset = 4,
  triggerClassName = '',
  withCheck = false,
}) => {
  const { onOpenChange, onPointerEnter, onPointerLeave, open } = useDelayedSubOpen(disabled);

  return (
    <DropdownMenuPrimitive.Sub onOpenChange={onOpenChange} open={open}>
      <DropdownMenuPrimitive.SubTrigger
        className={cx(
          'MenuSub',
          { 'MenuSub--marginBottom': marginBottom, 'MenuSub--marginTop': marginTop },
          triggerClassName,
        )}
        disabled={disabled}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {withCheck && (
          <span style={{ opacity: 0 }}>
            <Icon name="Check" size={checkIconSize} />
          </span>
        )}
        {icon && <Icon name={icon} size={iconSize} />}
        <span className="MenuSub__label">{label}</span>
        <Icon className="MenuSub__chevron" name="ChevronRight" size={14} />
      </DropdownMenuPrimitive.SubTrigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.SubContent
          alignOffset={alignOffset}
          className={cx('Menu', className)}
          collisionPadding={8}
          sideOffset={sideOffset}
        >
          {children}
        </DropdownMenuPrimitive.SubContent>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Sub>
  );
};

export default MenuSub;
