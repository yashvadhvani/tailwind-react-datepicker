/* eslint-disable react/no-array-index-key */
import React from 'react';

interface IWeekProps {
  weeks: any[];
}
const Week = ({ weeks }: IWeekProps) => (
  <div className="grid grid-cols-7 py-2 mt-0.5 border-b border-black border-opacity-10 dark:text-litepie-secondary-200 dark:border-litepie-secondary-700 dark:border-opacity-100 litepie-week">
    {weeks.map((day: any, index: number) => (
      <div key={index}>
        <span> {day}</span>
      </div>
    ))}
  </div>
);

export default Week;
