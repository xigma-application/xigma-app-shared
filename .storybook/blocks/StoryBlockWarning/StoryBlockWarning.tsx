import cx from 'classnames';
import { FC, ReactNode } from 'react';

// styles
import styles from './story-block-warning.module.scss';

export type TStoryBlockWarningProps = {
  children: ReactNode;
};

export const StoryBlockWarning: FC<TStoryBlockWarningProps> = ({ children = null }) => {
  return (
    <blockquote className={cx(styles['StoryBlockWarning'])}>
      <p className={cx(styles['StoryBlockWarning__context'])}>
        <span className={cx(styles['StoryBlockWarning__icon-warning'])}>⚠️</span> {children}
      </p>
    </blockquote>
  );
};

export default StoryBlockWarning;
