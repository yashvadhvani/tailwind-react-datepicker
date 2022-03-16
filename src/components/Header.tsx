import React from 'react';

interface IHeaderProps {
  panel: any;
  calendar: any;
  Icons: {
    Next: JSX.Element | undefined;
    Prev: JSX.Element | undefined;
  };
}
const Header = ({ panel, calendar, Icons }: IHeaderProps) => (
  <div className="flex justify-between items-center px-2 py-1.5 rounded-md border border-black border-opacity-10 dark:border-litepie-secondary-700 dark:border-opacity-100 litepie-header">
    <div className="flex-shrink-0">
      {(panel.calendar || panel.year) && (
        <span className="inline-flex rounded-full">
          <button
            type="button"
            className="p-1.5 rounded-full bg-white text-litepie-secondary-600 transition-colors border border-transparent hover:bg-litepie-secondary-100 hover:text-litepie-secondary-900 focus:bg-litepie-primary-50 focus:text-litepie-secondary-900 focus:border-litepie-primary-300 focus:ring focus:ring-litepie-primary-500 focus:ring-opacity-10 focus:outline-none dark:bg-litepie-secondary-800 dark:text-litepie-secondary-300 dark:hover:bg-litepie-secondary-700 dark:hover:text-litepie-secondary-300 dark:focus:bg-litepie-secondary-600 dark:focus:text-litepie-secondary-100 dark:focus:border-litepie-primary-500 dark:focus:ring-opacity-25 dark:focus:bg-opacity-50"
            onClick={panel.calendar ? calendar.onPrevious : calendar.onPreviousYear}
          >
            {Icons.Prev ? (
              Icons.Prev
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d={panel.calendar ? `M15 19l-7-7 7-7` : `M11 19l-7-7 7-7m8 14l-7-7 7-7`}
                />
              </svg>
            )}
          </button>
        </span>
      )}
    </div>
    <div className="px-1.5 space-x-1.5 flex flex-1">
      <span className="flex flex-1 rounded-md">
        <button
          type="button"
          className="px-3 py-1.5 block w-full leading-relaxed rounded-md bg-white text-xs 2xl:text-sm tracking-wide text-litepie-secondary-600 font-semibold sm:font-medium transition-colors border border-transparent hover:bg-litepie-secondary-100 hover:text-litepie-secondary-900 focus:bg-litepie-primary-50 focus:text-litepie-secondary-900 focus:border-litepie-primary-300 focus:ring focus:ring-litepie-primary-500 focus:ring-opacity-10 focus:outline-none uppercase dark:bg-litepie-secondary-800 dark:text-litepie-secondary-300 dark:hover:bg-litepie-secondary-700 dark:hover:text-litepie-secondary-300 dark:focus:bg-litepie-secondary-600 dark:focus:text-litepie-secondary-100 dark:focus:border-litepie-primary-500 dark:focus:ring-opacity-25 dark:focus:bg-opacity-50"
          onClick={calendar.openMonth}
        >
          {calendar.month}
        </button>
      </span>
      <span className="flex flex-1 rounded-md">
        <button
          type="button"
          className="px-3 py-1.5 block w-full leading-relaxed rounded-md bg-white text-xs 2xl:text-sm tracking-wide text-litepie-secondary-600 font-semibold sm:font-medium transition-colors border border-transparent hover:bg-litepie-secondary-100 hover:text-litepie-secondary-900 focus:bg-litepie-primary-50 focus:text-litepie-secondary-900 focus:border-litepie-primary-300 focus:ring focus:ring-litepie-primary-500 focus:ring-opacity-10 focus:outline-none uppercase dark:bg-litepie-secondary-800 dark:text-litepie-secondary-300 dark:hover:bg-litepie-secondary-700 dark:hover:text-litepie-secondary-300 dark:focus:bg-litepie-secondary-600 dark:focus:text-litepie-secondary-100 dark:focus:border-litepie-primary-500 dark:focus:ring-opacity-25 dark:focus:bg-opacity-50"
          onClick={calendar.openYear}
        >
          {calendar.year}
        </button>
      </span>
    </div>
    <div className="flex-shrink-0">
      {(panel.calendar || panel.year) && (
        <span className="inline-flex rounded-full">
          <button
            type="button"
            className="p-1.5 rounded-full bg-white text-litepie-secondary-600 transition-colors border border-transparent hover:bg-litepie-secondary-100 hover:text-litepie-secondary-900 focus:bg-litepie-primary-50 focus:text-litepie-secondary-900 focus:border-litepie-primary-300 focus:ring focus:ring-litepie-primary-500 focus:ring-opacity-10 focus:outline-none dark:bg-litepie-secondary-800 dark:text-litepie-secondary-300 dark:hover:bg-litepie-secondary-700 dark:hover:text-litepie-secondary-300 dark:focus:bg-litepie-secondary-600 dark:focus:text-litepie-secondary-100 dark:focus:border-litepie-primary-500 dark:focus:ring-opacity-25 dark:focus:bg-opacity-50"
            onClick={panel.calendar ? calendar.onNext : calendar.onNextYear}
          >
            {Icons.Next ? (
              Icons.Next
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d={panel.calendar ? `M9 5l7 7-7 7` : `M13 5l7 7-7 7M5 5l7 7-7 7`}
                />
              </svg>
            )}
          </button>
        </span>
      )}
    </div>
  </div>
);

export default Header;
