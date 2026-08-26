import cx from 'classnames';
import { FC } from 'react';

// styles
import styles from './story-block-code.module.scss';

// types
import { TStoryBlockCode, TVariable } from './types';

// utils
import { parseComponentToHTMLContext } from './utils/parseComponentToHTMLContext';
import { parseImportToHTMLContext } from './utils/parseImportToHTMLContext';
import { parseVariableToHTMLContext } from './utils/parseVariableToHTMLContext';

export type TStoryBlockCodeProps = {
  blocksCodeData: Array<TStoryBlockCode>;
  className?: string;
};

export const StoryBlockCode: FC<TStoryBlockCodeProps> = ({ blocksCodeData, className = '' }) => {
  const imports = blocksCodeData
    .map(({ imports }) => imports)
    .filter(Boolean)
    .flat();

  const propsLength = blocksCodeData
    .map(({ props }) => props)
    .filter(Boolean)
    .flat().length;

  const variables = blocksCodeData
    .map(({ variables }) => variables)
    .filter((variables): variables is Array<TVariable> => Boolean(variables))
    .flat();

  return (
    <div className={cx(className, styles['StoryBlockCode'])}>
      {/* IMPORTS */}
      {imports.map((importObj, key) => (
        <p
          className={cx(styles['StoryBlockCode__imports'])}
          dangerouslySetInnerHTML={{
            __html: parseImportToHTMLContext(importObj, styles),
          }}
          key={key}
        />
      ))}

      {/* SEPARATOR */}
      {propsLength > 0 && <div className={cx(styles['StoryBlockCode__separator'])} />}

      {/* VARIABLES */}
      {variables.map((variable, key) => (
        <div
          className={cx(styles['StoryBlockCode__variables'])}
          dangerouslySetInnerHTML={{
            __html: parseVariableToHTMLContext(styles, variable),
          }}
          key={key}
        />
      ))}

      {/* DECLARATION OF COMPONENTS */}
      {blocksCodeData.map((blockCode) => {
        const { componentName = '', props = [] } = blockCode;

        return props.map((props, key) => (
          <div
            className={cx(styles['StoryBlockCode__components'])}
            dangerouslySetInnerHTML={{
              __html: parseComponentToHTMLContext(props, componentName, styles),
            }}
            key={key}
          />
        ));
      })}
    </div>
  );
};

export default StoryBlockCode;
