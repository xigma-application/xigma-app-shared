import cx from 'classnames';
import { FC, ReactNode } from 'react';

// components
import StoryComponent from '../StoryComponent/StoryComponent';
import StoryPropsTable, { TPropsStoryPropsTable } from '../StoryPropsTable/StoryPropsTable';

// styles
import styles from './story-api.module.scss';

// types
import { TStoryBlockCodeProps } from '../StoryBlockCode/StoryBlockCode';

export type TStoryApiProps = TStoryBlockCodeProps &
  TPropsStoryPropsTable & {
    children?: ReactNode;
    description?: Array<string>;
    title: string;
  };

export const StoryApi: FC<TStoryApiProps> = ({ children = null, description = [], title, ...restProps }) => {
  const { tableBodyData } = restProps;

  return (
    <main className={cx(styles['StoryApi'])}>
      {/* TITLE */}
      <h1 className={cx(styles['StoryApi__title'])}>{title}</h1>

      {/* DESCRIPTION */}
      {description.map((description, key) => (
        <p
          className={cx(styles['StoryApi__description'])}
          dangerouslySetInnerHTML={{ __html: description }}
          key={key}
        />
      ))}

      {/* COMPONENT */}
      <StoryComponent className={cx(styles['StoryApi__story-component'])} title="Import" {...restProps} />

      {/* ADDITIONAL CONTENT: BLOCK WARNING */}
      {children}

      {/* PROPS */}
      <StoryPropsTable tableBodyData={tableBodyData} />
    </main>
  );
};

export default StoryApi;
