import cx from 'classnames';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { FC } from 'react';

// styles
import './menu-separator.scss';

export type TMenuSeparatorProps = {
  className?: string;
};

export const MenuSeparator: FC<TMenuSeparatorProps> = ({ className = '' }) => (
  <DropdownMenuPrimitive.Separator className={cx('MenuSeparator', className)} />
);

export default MenuSeparator;
