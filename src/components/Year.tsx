/* eslint-disable react/no-array-index-key */
import React from 'react';

interface IYearProps {
  years: any;
  asPrevOrNext: boolean;
  updateYear: Function;
}

const Year = ({ years, asPrevOrNext = false, updateYear }: IYearProps) => (
  <div className="flex flex-wrap">
    {years.map((year: any, key: number) => (
      <div key={key} className="w-1/2 px-0.5">
        <span className="flex rounded-md mt-1.5">
          <button
            type="button"
            className="block w-full px-3 py-2 text-xs font-medium leading-6 tracking-wide uppercase transition-colors bg-white border border-transparent rounded-md 2xl:text-sm text-litepie-secondary-600 hover:bg-litepie-secondary-100 hover:text-litepie-secondary-900 focus:bg-litepie-primary-50 focus:text-litepie-secondary-900 focus:border-litepie-primary-300 focus:ring focus:ring-litepie-primary-500 focus:ring-opacity-10 focus:outline-none dark:bg-litepie-secondary-800 dark:hover:bg-litepie-secondary-700 dark:text-litepie-secondary-300 dark:hover:text-litepie-secondary-100 dark:focus:bg-litepie-secondary-700 litepie-year"
            onClick={() => updateYear(year, asPrevOrNext)}
          >
            {year}
          </button>
        </span>
      </div>
    ))}
  </div>
);

export default Year;
