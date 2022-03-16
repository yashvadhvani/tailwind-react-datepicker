/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

interface IShortcutProps {
  // shortcuts: Boolean | Function;
  // setToCustomShortcut: Function;
  setToday: Function;
  setToYesterday: Function;
  setToLastDay: Function;
  setToThisMonth: Function;
  setToLastMonth: Function;
}
const Shortcut = ({
  // shortcuts,
  // setToCustomShortcut,
  setToday,
  setToYesterday,
  setToLastDay,
  setToThisMonth,
  setToLastMonth,
}: IShortcutProps) => (
  // const withShortcut: any = () =>
  // if (typeof shortcuts === 'function') {
  //   return shortcuts();
  // }
  //   false;
  <div className="relative order-last w-full border-t border-b-0 border-black sm:border-t-0 sm:border-b lg:border-b-0 lg:border-r border-opacity-10 sm:order-none dark:border-litepie-secondary-700 dark:border-opacity-100 sm:mt-1 lg:mr-1 sm:mb-1 lg:mb-0 sm:mx-1 lg:mx-0 litepie-shortcut">
    {/* {withShortcut ? (
            <ol className="grid grid-cols-2 sm:grid-cols-3 gap-1 lg:block w-full pr-0 sm:pr-1 mt-1.5 sm:mt-0 sm:mb-1.5 lg:mb-0">
              {withShortcut().map((item: any, i: number) => (
                <li key={i}>
                  <a
                    href="#"
                    className="block px-2 py-2 text-sm font-medium transition-colors rounded litepie-shortcuts lg:text-xs sm:leading-4 whitespace-nowrap text-litepie-primary-600 hover:text-litepie-primary-700 hover:bg-litepie-secondary-100 focus:bg-litepie-secondary-100 focus:text-litepie-primary-600 dark:hover:bg-litepie-secondary-700 dark:hover:text-litepie-primary-300 dark:text-litepie-primary-400 dark:focus:bg-litepie-secondary-700 dark:focus:text-litepie-primary-300"
                    onClick={(e) => {
                      e.preventDefault();
                      return setToCustomShortcut(item);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          ) : ( */}
    <ol className="grid grid-cols-2 sm:grid-cols-3 gap-1 lg:block w-full pr-0 sm:pr-1 mt-1.5 sm:mt-0 sm:mb-1.5 lg:mb-0">
      <li>
        <a
          href="#"
          className="block px-2 py-2 text-sm font-medium transition-colors rounded litepie-shortcuts lg:text-xs sm:leading-4 whitespace-nowrap text-litepie-primary-600 hover:text-litepie-primary-700 hover:bg-litepie-secondary-100 focus:bg-litepie-secondary-100 focus:text-litepie-primary-600 dark:hover:bg-litepie-secondary-700 dark:hover:text-litepie-primary-300 dark:text-litepie-primary-400 dark:focus:bg-litepie-secondary-700 dark:focus:text-litepie-primary-300"
          onClick={(e) => {
            e.preventDefault();
            return setToday(e);
          }}
        >
          Today
        </a>
      </li>
      <li>
        <a
          href="#"
          className="block px-2 py-2 text-sm font-medium transition-colors rounded litepie-shortcuts lg:text-xs sm:leading-4 whitespace-nowrap text-litepie-primary-600 hover:text-litepie-primary-700 hover:bg-litepie-secondary-100 focus:bg-litepie-secondary-100 focus:text-litepie-primary-600 dark:hover:bg-litepie-secondary-700 dark:hover:text-litepie-primary-300 dark:text-litepie-primary-400 dark:focus:bg-litepie-secondary-700 dark:focus:text-litepie-primary-300"
          onClick={(e) => {
            e.preventDefault();
            return setToYesterday(e);
          }}
        >
          Yesterday
        </a>
      </li>
      <li>
        <a
          href="#"
          className="block px-2 py-2 text-sm font-medium transition-colors rounded litepie-shortcuts lg:text-xs sm:leading-4 whitespace-nowrap text-litepie-primary-600 hover:text-litepie-primary-700 hover:bg-litepie-secondary-100 focus:bg-litepie-secondary-100 focus:text-litepie-primary-600 dark:hover:bg-litepie-secondary-700 dark:hover:text-litepie-primary-300 dark:text-litepie-primary-400 dark:focus:bg-litepie-secondary-700 dark:focus:text-litepie-primary-300"
          onClick={(e) => {
            e.preventDefault();
            return setToLastDay(7);
          }}
        >
          Last 7 Days
        </a>
      </li>
      <li>
        <a
          href="#"
          className="block px-2 py-2 text-sm font-medium transition-colors rounded litepie-shortcuts lg:text-xs sm:leading-4 whitespace-nowrap text-litepie-primary-600 hover:text-litepie-primary-700 hover:bg-litepie-secondary-100 focus:bg-litepie-secondary-100 focus:text-litepie-primary-600 dark:hover:bg-litepie-secondary-700 dark:hover:text-litepie-primary-300 dark:text-litepie-primary-400 dark:focus:bg-litepie-secondary-700 dark:focus:text-litepie-primary-300"
          onClick={(e) => {
            e.preventDefault();
            return setToLastDay(30);
          }}
        >
          Last 30 Days
        </a>
      </li>
      <li>
        <a
          href="#"
          className="block px-2 py-2 text-sm font-medium transition-colors rounded litepie-shortcuts lg:text-xs sm:leading-4 whitespace-nowrap text-litepie-primary-600 hover:text-litepie-primary-700 hover:bg-litepie-secondary-100 focus:bg-litepie-secondary-100 focus:text-litepie-primary-600 dark:hover:bg-litepie-secondary-700 dark:hover:text-litepie-primary-300 dark:text-litepie-primary-400 dark:focus:bg-litepie-secondary-700 dark:focus:text-litepie-primary-300"
          onClick={(e) => {
            e.preventDefault();
            return setToThisMonth(e);
          }}
        >
          This Month
        </a>
      </li>
      <li>
        <a
          href="#"
          className="block px-2 py-2 text-sm font-medium transition-colors rounded litepie-shortcuts lg:text-xs sm:leading-4 whitespace-nowrap text-litepie-primary-600 hover:text-litepie-primary-700 hover:bg-litepie-secondary-100 focus:bg-litepie-secondary-100 focus:text-litepie-primary-600 dark:hover:bg-litepie-secondary-700 dark:hover:text-litepie-primary-300 dark:text-litepie-primary-400 dark:focus:bg-litepie-secondary-700 dark:focus:text-litepie-primary-300"
          onClick={(e) => {
            e.preventDefault();
            return setToLastMonth(e);
          }}
        >
          Last Month
        </a>
      </li>
    </ol>
    {/* )} */}
  </div>
);

export default Shortcut;
