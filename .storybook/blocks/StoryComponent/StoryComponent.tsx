import cx from 'classnames';
import { FC, ReactNode } from 'react';

// components
import StoryBlockCode, { TStoryBlockCodeProps } from '../StoryBlockCode/StoryBlockCode';

// others
import { CONTENT_MODIFICATORS } from './constants';

// styles
import styles from './story-component.module.scss';

// types
import { ContentAlignItems, ContentDisplay, ContentGridFlow } from './enums';

// utils
import { kebabToCamelCase } from './utils/kebabToCamelCase';

export type TStoryComponentProps = TStoryBlockCodeProps & {
  applyMaxWidth?: boolean;
  children?: ReactNode;
  className?: string;
  contentAlignItems?: ContentAlignItems;
  contentDisplay?: ContentDisplay;
  contentGridFlow?: ContentGridFlow;
  description?: Array<string>;
  title: string;
};

export const StoryComponent: FC<TStoryComponentProps> = ({
  applyMaxWidth = true,
  blocksCodeData,
  children,
  className = '',
  contentAlignItems = ContentAlignItems.center,
  contentDisplay = ContentDisplay.grid,
  contentGridFlow = ContentGridFlow.column,
  description = [],
  title,
  ...restProps
}) => (
  <section
    className={cx(className, styles['StoryComponent'], {
      [styles['StoryComponent--max-width']]: applyMaxWidth,
    })}
  >
    {/*  TITLE */}
    <h2 className={cx(styles['StoryComponent__title'])}>{title}</h2>

    {/* DESCRIPTION */}
    {description.map((description, key) => (
      <p
        className={cx(styles['StoryComponent__description'])}
        dangerouslySetInnerHTML={{ __html: description }}
        key={key}
      />
    ))}

    {/* COMPONENT SECTION */}
    {children && (
      <section
        className={cx(
          styles['StoryComponent__content'],
          styles[CONTENT_MODIFICATORS[contentAlignItems]],
          styles[CONTENT_MODIFICATORS[contentDisplay]],
          styles[CONTENT_MODIFICATORS[kebabToCamelCase(contentGridFlow)]],
        )}
      >
        {children}
      </section>
    )}

    {/* BLOCK CODE */}
    {blocksCodeData.length > 0 && (
      <StoryBlockCode
        blocksCodeData={blocksCodeData}
        className={cx(styles['StoryComponent__story-block-code'])}
        {...restProps}
      />
    )}
  </section>
);

export default StoryComponent;
