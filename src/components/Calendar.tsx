/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Property } from 'csstype';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../datepicker.css';

interface ISelectionColorSingleProps {
  text: Property.Color | undefined;
  background: Property.Color | undefined;
}

interface ICalenderProps {
  calendar: any;
  asRange: boolean;
  isBetweenRange: Function;
  betweenRangeClasses: Function;
  datepickerClasses: Function;
  updateDate: Function;
  atMouseOver: Function;
  asPrevOrNext: boolean;
  selectionColor: ISelectionColorSingleProps;
}

export const Calender = ({
  calendar,
  asRange,
  isBetweenRange,
  betweenRangeClasses,
  datepickerClasses,
  updateDate,
  asPrevOrNext,
  atMouseOver,
  selectionColor = { text: undefined, background: undefined },
}: ICalenderProps) => (
  <TransitionGroup
    classnames={{
      enter: 'opacity-0',
      enterDone: 'opacity-100',
      enterActive: 'transition-opacity duration-300 ease-out',
      exit: 'opacity-100',
      exitDone: 'opacity-0',
      exitActive: 'transition-opacity duration-200 ease-in',
    }}
  >
    <div className="grid grid-cols-7 gap-y-0.5 my-1">
      {calendar.date().map((date: any, keyDate: number) => {
        const css = betweenRangeClasses(date);
        const datePickerCss = datepickerClasses(date);
        const isSelected = isBetweenRange(date) || date.hovered();
        let datePickerStyle = datePickerCss.css ? datePickerCss.css : {};
        datePickerStyle = {
          ...(selectionColor.text && isBetweenRange(date) ? { color: selectionColor.text } : {}),
          ...datePickerStyle,
        };
        return (
          <div
            key={keyDate}
            className={`relative${asRange && date.duration() ? ' litepie-tooltip' : ''}`}
            data-tooltip={date.duration()}
          >
            {isSelected && (
              <CSSTransition
                timeout={5000}
                classNames={{
                  enter: 'opacity-0',
                  enterDone: 'opacity-100',
                  enterActive: 'transition-opacity duration-200 ease-out',
                  exit: 'opacity-100',
                  exitDone: 'opacity-0',
                  exitActive: 'transition-opacity duration-150 ease-in',
                }}
              >
                <span
                  className={`absolute bg-litepie-primary-100 bg-opacity-60 dark:bg-litepie-secondary-700 dark:bg-opacity-50 ${css}`}
                  style={selectionColor ? { backgroundColor: selectionColor.background } : undefined}
                />
              </CSSTransition>
            )}
            <button
              type="button"
              className={`litepie-datepicker-date relative w-12 h-12 lg:w-10 lg:h-10 flex justify-center items-center text-xs 2xl:text-sm focus:outline-none ${
                datePickerCss.class
              } ${asRange ? 'transition-all' : 'transition-colors'}`}
              style={datePickerStyle}
              disabled={date.disabled || date.inRange()}
              onClick={() => updateDate(date, asPrevOrNext)}
              onMouseEnter={() => atMouseOver(date)}
              onFocus={() => atMouseOver(date)}
              data-date={date.toDate()}
            >
              {date.date()}
            </button>
          </div>
        );
      })}
    </div>
  </TransitionGroup>
);

export default Calender;
