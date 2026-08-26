import cx from 'classnames';
import { FC } from 'react';

// styles
import styles from './story-props-table.module.scss';

// types
import { TTableBody } from './types';

export type TPropsStoryPropsTable = {
  tableBodyData: Array<TTableBody>;
};

const StoryPropsTable: FC<TPropsStoryPropsTable> = ({ tableBodyData }) => {
  return (
    <section className={cx(styles['StoryPropsTable'])}>
      {/* TITLE */}
      <h2 className={cx(styles['StoryPropsTable__title'])}>Props</h2>

      {/* TABLE */}
      <table className={cx(styles['StoryPropsTable__table'])}>
        {/* HEADER */}
        <thead>
          <tr className={cx(styles['StoryPropsTable__row-header'])}>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {tableBodyData.map(({ defaultValue = '', description, name, type }, key) => (
            <tr className={cx(styles['StoryPropsTable__row-body'])} key={key}>
              <td className={cx(styles['StoryPropsTable__column-name'])}>{name}</td>
              <td
                className={cx(styles['StoryPropsTable__column-type'])}
                dangerouslySetInnerHTML={{
                  __html: type,
                }}
              />
              <td className={cx(styles['StoryPropsTable__column-default-value'])}>{defaultValue}</td>
              <td
                className={cx(styles['StoryPropsTable__column-description'])}
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default StoryPropsTable;
