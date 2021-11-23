/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import React from "react";
import { Property } from "csstype";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import localeData from "dayjs/plugin/localeData";
import dayjs from "dayjs";
import { CSSTransition } from "react-transition-group";
import "./datepicker.css";
import {
  useCurrentDate,
  useDisableDate,
  useBetweenRange,
  useNextDate,
  usePreviousDate,
  useToValueFromArray,
  useToValueFromString,
  useVisibleViewport,
} from "./lib/fn";
import LitepieHeader from "./components/Header";
import LitepieMonth from "./components/Month";
import LitepieWeek from "./components/Week";
import LitepieYear from "./components/Year";
import LitepieCalendar from "./components/Calendar";
import LitepieShortcut from "./components/Shortcut";
import datepickerReducer from "./reducers/datepicker";
import panelReducer from "./reducers/panel";

interface ISelectionColorProps {
  ends: {
    text: Property.Color | undefined;
    background: Property.Color | undefined;
  };
  selection: {
    text: Property.Color | undefined;
    background: Property.Color | undefined;
  };
}

interface IDatePickerProps {
  overlay: boolean;
  asSingle: boolean;
  useRange: boolean;
  disableDate: boolean | Array<any> | Function;
  disableInRange: boolean;
  autoApply: boolean;
  shortcuts: boolean | Function;
  separator: string;
  formatter: any;
  startFrom: string | Date;
  options: any;
  dark: boolean;
  onChange: Function;
  styles:
    | {
        apply?: React.CSSProperties | undefined;
        cancel?: React.CSSProperties | undefined;
      }
    | undefined;
  selectionColor: ISelectionColorProps;
  CalenderIcon: JSX.Element | undefined;
  HeaderIcons: {
    Prev: JSX.Element | undefined;
    Next: JSX.Element | undefined;
  };
}

dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(isToday);
dayjs.extend(isBetween);
dayjs.extend(duration);

const Datepicker: React.FunctionComponent<IDatePickerProps> = (
  props: IDatePickerProps
) => {
  const {
    overlay = true,
    asSingle = false,
    useRange = false,
    disableDate,
    disableInRange,
    autoApply = false,
    shortcuts = true,
    formatter = {
      date: "YYYY-MMM-DD",
      month: "MMM",
    },
    separator = ` ~ `,
    startFrom,
    options = {
      footer: {
        apply: "apply",
        cancel: "cancel",
      },
    },
    dark = false,
    onChange,
    styles = { apply: undefined, cancel: undefined },
    selectionColor = {
      ends: { background: undefined, text: undefined },
      selection: { background: undefined, text: undefined },
    },
    HeaderIcons = {
      Prev: undefined,
      Next: undefined,
    },
    CalenderIcon = undefined,
  } = props;
  const [modelValue, setModelValue] = React.useState([
    dayjs(),
    dayjs().add(1, "M"),
  ] as any);
  const LitepieRef = React.useRef(null);
  const Litepiedatepicker = React.useRef(null);
  const LitepieButtonRef = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const [placement, setPlacement] = React.useState(true);
  const [selection, setSelection] = React.useState(null);
  const [pickerValue, setPickerValue] = React.useState("");
  const [hoverValue, setHoverValue] = React.useState([]);
  const [applyValue, setApplyValue] = React.useState([] as any);
  const [previous, setPrevious] = React.useState(null);
  const [panel, panelDispatch] = React.useReducer(panelReducer, {
    previous: {
      calendar: true,
      month: false,
      year: false,
    },
    next: {
      calendar: true,
      month: false,
      year: false,
    },
  });
  const [datepicker, datePickerDispatch] = React.useReducer(datepickerReducer, {
    previous: dayjs(),
    next: dayjs().add(1, "month"),
    year: {
      previous: dayjs().year(),
      next: dayjs().year(),
    },
    weeks: dayjs.weekdaysShort(),
    months: formatter.month === "MMM" ? dayjs.monthsShort() : dayjs.months(),
  });
  const weeks = () => datepicker.weeks;
  const months = () => datepicker.months;
  const useObject = () => typeof modelValue === "object";
  const inRangeDate = (date: any) => {
    if (disableInRange) return false;
    if (pickerValue === "") return false;
    let s;
    let e;
    if (Array.isArray(modelValue)) {
      const [start, end] = modelValue;
      s = start;
      e = end;
    } else if (useObject()) {
      if (modelValue) {
        const [start, end] = Object.values(modelValue);
        s = start;
        e = end;
      }
    } else if (typeof modelValue === "string") {
      const [start, end] = modelValue.split(separator);
      s = start;
      e = end;
    }

    return date.isBetween(
      dayjs(s, formatter.date, true),
      dayjs(e, formatter.date, true),
      "date",
      "[]"
    );
  };
  const asRange = () => {
    if (!useRange && !asSingle) {
      return true;
    }
    if (!useRange && asSingle) {
      return false;
    }
    if (useRange && !asSingle) {
      return true;
    }
    return !!(useRange && asSingle);
  };
  const calendar = React.useMemo(
    () => ({
      previous: {
        date: () =>
          usePreviousDate(datepicker.previous)
            .concat(useCurrentDate(datepicker.previous))
            .concat(useNextDate(datepicker.previous))
            .map((v: any) => {
              const value = v;
              value.today = v.isToday();
              value.active = datepicker.previous.month() === v.month();
              value.off = datepicker.previous.month() !== v.month();
              value.sunday = v.day() === 0;
              value.disabled =
                useDisableDate(v, { disableDate }) && !inRangeDate(v);
              value.inRange = () => {
                if (asSingle && !useRange) {
                  return datepicker.previous.month() !== v.month();
                }
                return null;
              };
              value.hovered = () => {
                if (!asRange()) return false;
                if (hoverValue.length > 1) {
                  return (
                    (v.isBetween(hoverValue[0], hoverValue[1], "date", "()") ||
                      v.isBetween(
                        hoverValue[1],
                        hoverValue[0],
                        "date",
                        "()"
                      )) &&
                    datepicker.previous.month() === v.month()
                  );
                }
                return false;
              };
              value.duration = () => false;
              return value;
            }),
        month:
          datepicker.previous &&
          datepicker.previous.format &&
          datepicker.previous.format(formatter.month),
        year:
          datepicker.previous &&
          datepicker.previous.year &&
          datepicker.previous.year(),
        years: () =>
          Array.from(
            {
              length: 12,
            },
            (v, k) => {
              if (v || k) {
                return datepicker.year.previous + k;
              }
              return datepicker.year.previous + k;
            }
          ),
        onPrevious: () => {
          datePickerDispatch({
            type: "change",
            payload: {
              key: "previous",
              value: datepicker.previous.subtract(1, "month"),
            },
          });
        },
        onNext: () => {
          datePickerDispatch({
            type: "change",
            payload: {
              key: "previous",
              value: datepicker.previous.add(1, "month"),
            },
          });
          if (datepicker.previous.diff(datepicker.next, "month") === -1) {
            datePickerDispatch({
              type: "change",
              payload: {
                key: "next",
                value: datepicker.next.add(1, "month"),
              },
            });
          }
        },
        onPreviousYear: () => {
          datePickerDispatch({
            type: "change",
            payload: {
              key: "year",
              value: { previous: datepicker.year.previous - 12 },
            },
          });
        },
        onNextYear: () => {
          datePickerDispatch({
            type: "change",
            payload: {
              key: "year",
              value: { previous: datepicker.year.previous + 12 },
            },
          });
        },
        openMonth: () => {
          panelDispatch({
            type: "change",
            payload: {
              key: "previous",
              value: {
                month: !panel.previous.month,
                year: false,
                calendar: !!panel.previous.month,
              },
            },
          });
        },
        setMonth: (event: any) => {
          const prevVal = datepicker.previous.month(event);
          datePickerDispatch({
            type: "change",
            payload: {
              key: "previous",
              value: prevVal,
            },
          });
          panelDispatch({
            type: "change",
            payload: {
              key: "previous",
              value: {
                month: !panel.previous.month,
                year: false,
                calendar: !!panel.previous.month,
              },
            },
          });
          if (
            datepicker.next.isSame(prevVal, "month") ||
            datepicker.next.isBefore(prevVal)
          ) {
            datePickerDispatch({
              type: "multiple",
              payload: {
                next: prevVal.add(1, "month"),
                year: {
                  previous: datepicker.year.previous,
                  next: datepicker.next.year(),
                },
              },
            });
          }
        },
        openYear: () => {
          panelDispatch({
            type: "change",
            payload: {
              key: "previous",
              value: {
                year: !panel.previous.year,
                month: false,
                calendar: !!panel.previous.year,
              },
            },
          });
        },
        setYear: (event: any, asNext: boolean) => {
          const prevVal = datepicker.previous.year(event);
          if (!asNext) {
            datePickerDispatch({
              type: "change",
              payload: {
                key: "previous",
                value: prevVal,
              },
            });
            panelDispatch({
              type: "change",
              payload: {
                key: "previous",
                value: {
                  year: !panel.previous.year,
                  calendar: panel.previous.year,
                },
              },
            });
            const payload: any = {
              year: {
                previous: prevVal.year(),
                next: datepicker.next.year(),
              },
            };
            if (
              datepicker.next.isSame(prevVal, "month") ||
              datepicker.next.isBefore(prevVal)
            ) {
              payload.next = prevVal.add(1, "month");
            }
            datePickerDispatch({
              type: "multiple",
              payload,
            });
          }
        },
      },
      next: {
        date: () =>
          usePreviousDate(datepicker.next)
            .concat(useCurrentDate(datepicker.next))
            .concat(useNextDate(datepicker.next))
            .map((v: any) => {
              const value = v;
              value.today = v.isToday();
              value.active = datepicker.next.month() === v.month();
              value.off = datepicker.next.month() !== v.month();
              value.sunday = v.day() === 0;
              value.disabled =
                useDisableDate(v, { disableDate }) && !inRangeDate(v);
              value.inRange = () => {
                if (asSingle && !useRange) {
                  return datepicker.next.month() !== v.month();
                }
                return undefined;
              };
              value.hovered = () => {
                if (hoverValue.length > 1) {
                  return (
                    (v.isBetween(hoverValue[0], hoverValue[1], "date", "()") ||
                      v.isBetween(
                        hoverValue[1],
                        hoverValue[0],
                        "date",
                        "()"
                      )) &&
                    datepicker.next.month() === v.month()
                  );
                }
                return false;
              };
              value.duration = () => false;
              return value;
            }),

        month: datepicker.next && datepicker.next.format(formatter.month),
        year: datepicker.next && datepicker.next.year(),
        years: () =>
          Array.from(
            {
              length: 12,
            },
            (v, k) => {
              if (v || k) {
                return datepicker.year.next + k;
              }
              return datepicker.year.next + k;
            }
          ),
        onPrevious: () => {
          datePickerDispatch({
            type: "change",
            payload: {
              key: "next",
              value: datepicker.next.subtract(1, "month"),
            },
          });
          if (datepicker.next.diff(datepicker.previous, "month") === 1) {
            datePickerDispatch({
              type: "change",
              payload: {
                key: "previous",
                value: datepicker.previous.subtract(1, "month"),
              },
            });
          }
        },
        onNext: () => {
          datePickerDispatch({
            type: "change",
            payload: {
              key: "next",
              value: datepicker.next.add(1, "month"),
            },
          });
        },
        onPreviousYear: () => {
          datePickerDispatch({
            type: "change",
            payload: {
              key: "year",
              value: { next: datepicker.year.next - 12 },
            },
          });
        },
        onNextYear: () => {
          datePickerDispatch({
            type: "change",
            payload: {
              key: "year",
              value: { next: datepicker.year.next + 12 },
            },
          });
        },
        openMonth: () => {
          panelDispatch({
            type: "change",
            payload: {
              key: "next",
              value: {
                month: !panel.next.month,
                year: false,
                calendar: !!panel.next.month,
              },
            },
          });
        },
        setMonth: (event: any) => {
          const nextVal = datepicker.next.month(event);
          datePickerDispatch({
            type: "change",
            payload: {
              key: "next",
              value: nextVal,
            },
          });
          panelDispatch({
            type: "change",
            payload: {
              key: "next",
              value: {
                month: !panel.next.month,
                year: false,
                calendar: !!panel.next.month,
              },
            },
          });
          const payload = {
            year: {
              previous: datepicker.previous.year(),
              next: datepicker.year.next,
            },
            previous: datepicker.previous,
          };
          if (
            datepicker.previous.isSame(nextVal, "month") ||
            datepicker.previous.isAfter(nextVal)
          ) {
            payload.previous = nextVal.subtract(1, "month");
          }
          datePickerDispatch({
            type: "multiple",
            payload,
          });
        },
        openYear: () => {
          panelDispatch({
            type: "change",
            payload: {
              key: "next",
              value: {
                year: !panel.next.year,
                month: false,
                calendar: !!panel.next.year,
              },
            },
          });
        },
        setYear: (event: any, asNext: boolean) => {
          if (asNext) {
            const nextVal = datepicker.next.year(event);
            datePickerDispatch({
              type: "change",
              payload: {
                key: "next",
                value: nextVal,
              },
            });
            panelDispatch({
              type: "change",
              payload: {
                key: "next",
                value: {
                  year: !panel.next.year,
                  month: false,
                  calendar: !!panel.next.year,
                },
              },
            });
            const payload: any = {
              year: {
                previous: datepicker.previous.year(),
                next: nextVal.year(),
              },
            };
            if (
              datepicker.previous.isSame(nextVal, "month") ||
              datepicker.previous.isAfter(nextVal)
            ) {
              payload.previous = nextVal.subtract(1, "month");
            }
            datePickerDispatch({
              type: "multiple",
              payload,
            });
          }
        },
      },
    }),
    [datepicker, panel]
  );
  const force = () => {
    setPrevious(null);
    setHoverValue([]);
    setSelection(null);
  };

  const setDate = (date: any, asNext: boolean = false) => {
    if (asRange()) {
      if (previous) {
        if (autoApply) {
          if (date.isBefore(previous)) {
            setPickerValue(
              useToValueFromArray(
                {
                  previous: date,
                  next: previous,
                },
                { formatter, separator }
              )
            );
          } else {
            setPickerValue(
              useToValueFromArray(
                {
                  previous,
                  next: date,
                },
                { formatter, separator }
              )
            );
          }
          const [s, e] = pickerValue.split(separator);

          if (Array.isArray(modelValue)) {
            setModelValue([
              dayjs(s, formatter.date, true).format(formatter.date),
              dayjs(e, formatter.date, true).format(formatter.date),
            ]);
          } else if (useObject()) {
            const obj: any = {};
            const [start, end] = Object.keys(modelValue);
            obj[start] = s;
            obj[end] = e;
            setModelValue(obj);
          } else {
            setModelValue(
              useToValueFromArray(
                {
                  previous: dayjs(s, formatter.date, true),
                  next: dayjs(e, formatter.date, true),
                },
                { formatter, separator }
              )
            );
          }
          setShow(false);
          setApplyValue([]);
          if (
            !dayjs(s, formatter.date, true).isSame(
              dayjs(e, formatter.date, true),
              "month"
            )
          ) {
            datePickerDispatch({
              type: "multiple",
              payload: {
                previous: dayjs(s, formatter.date, true),
                next: dayjs(e, formatter.date, true),
              },
            });
          }
          force();
        } else {
          let tempApplyValue = applyValue;
          if ((previous as any).isAfter(date, "month")) {
            tempApplyValue = [date, previous];
            setApplyValue(tempApplyValue);
          } else {
            tempApplyValue = [previous, date];
            setApplyValue(tempApplyValue);
          }
          const [s, e] = tempApplyValue as any;

          if (!s.isSame(e, "month")) {
            datePickerDispatch({
              type: "multiple",
              payload: {
                previous: s,
                next: e,
              },
            });
          }
          force();
        }
      } else {
        setApplyValue([]);
        setPrevious(date);
        setSelection(date);
        hoverValue.push(date as never);
        applyValue.push(date as never);

        if (asNext) {
          datePickerDispatch({
            type: "change",
            payload: {
              key: "next",
              value: date,
            },
          });
          if (datepicker.previous.isSame(date, "month")) {
            datePickerDispatch({
              type: "change",
              payload: {
                key: "next",
                value: date.add(1, "month"),
              },
            });
          }
        } else {
          datePickerDispatch({
            type: "change",
            payload: {
              key: "previous",
              value: date,
            },
          });
          if (datepicker.next.isSame(date, "month")) {
            datePickerDispatch({
              type: "multiple",
              payload: {
                previous: datepicker.next,
                next: date.add(1, "month"),
              },
            });
          }
        }
      }
    } else if (autoApply) {
      setPickerValue(useToValueFromString(date, { formatter }));

      if (Array.isArray(modelValue)) {
        setModelValue([pickerValue]);
      } else if (useObject()) {
        const obj: any = {};
        const [start] = Object.keys(modelValue);
        obj[start] = pickerValue;

        setModelValue(obj);
      } else {
        setModelValue(pickerValue);
      }
      setShow(false);
      setApplyValue([]);
      force();
    } else {
      setApplyValue([date as never]);
      force();
    }
  };

  const applyDate = () => {
    if (applyValue.length < 1) return false;
    let date: any;
    if (asRange()) {
      const [s, e] = applyValue;
      if (e.isBefore(s)) {
        date = useToValueFromArray(
          {
            previous: e,
            next: s,
          },
          { formatter, separator }
        );
      } else {
        date = useToValueFromArray(
          {
            previous: s,
            next: e,
          },
          { formatter, separator }
        );
      }
    } else {
      const [s] = applyValue;
      date = s;
    }
    if (asRange()) {
      const [s, e] = date.split(separator);

      if (Array.isArray(modelValue)) {
        setModelValue([
          dayjs(s, formatter.date, true).format(formatter.date),
          dayjs(e, formatter.date, true).format(formatter.date),
        ]);
      } else if (useObject()) {
        const obj: any = {};
        const [start, end] = Object.keys(modelValue);
        obj[start] = s;
        obj[end] = e;
        setModelValue(obj);
      } else {
        setModelValue(
          useToValueFromArray(
            {
              previous: dayjs(s, formatter.date, true),
              next: dayjs(e, formatter.date, true),
            },
            { formatter, separator }
          )
        );
      }
      setPickerValue(date);
    } else {
      setPickerValue(date.format(formatter.date));
      if (Array.isArray(modelValue)) {
        setModelValue([pickerValue]);
      } else if (useObject()) {
        const obj: any = {};
        const [start] = Object.keys(modelValue);
        obj[start] = pickerValue;
        setModelValue(obj);
      } else {
        setModelValue(pickerValue);
      }
    }
    setShow(false);
    return undefined;
  };

  const atMouseOver = (date: any) => {
    if (!asRange()) return false;
    if (previous) {
      setHoverValue([previous, date as never]);
    } else {
      setHoverValue([]);
      return false;
    }
    return undefined;
  };

  const isBetweenRange = (date: any) => {
    if (previous && autoApply) return false;
    let s;
    let e;
    if (hoverValue.length > 1) {
      const [start, end] = hoverValue;
      s = dayjs(start, formatter.date, true);
      e = dayjs(end, formatter.date, true);
    } else if (Array.isArray(modelValue)) {
      if (autoApply) {
        const [start, end] = modelValue;
        s = start && dayjs(start, formatter.date, true);
        e = end && dayjs(end, formatter.date, true);
      } else {
        const [start, end] = applyValue;
        s = dayjs(start, formatter.date, true);
        e = dayjs(end, formatter.date, true);
      }
    } else if (useObject()) {
      if (autoApply) {
        if (modelValue) {
          const [start, end] = Object.values(modelValue);
          s = start && dayjs(start, formatter.date, true);
          e = end && dayjs(end, formatter.date, true);
        }
      } else {
        const [start, end] = applyValue;
        s = dayjs(start, formatter.date, true);
        e = dayjs(end, formatter.date, true);
      }
    } else if (autoApply) {
      const [start, end] = (
        modelValue && typeof modelValue === "string"
          ? modelValue.split(separator)
          : [false, false]
      ) as any;
      s = start && dayjs(start, formatter.date, true);
      e = end && dayjs(end, formatter.date, true);
    } else {
      const [start, end] = applyValue;
      s = dayjs(start, formatter.date, true);
      e = dayjs(end, formatter.date, true);
    }
    if (s && e) {
      return useBetweenRange(date, {
        previous: s,
        next: e,
      });
    }
    return false;
  };

  const datepickerClasses = (
    date: any
  ): { class: string; css: React.CSSProperties | undefined } => {
    const { today, active, off, disabled } = date;
    let classes: { class: string; css: React.CSSProperties | undefined } = {
      class: "",
      css: undefined,
    };
    let s;
    let e;
    if (asRange()) {
      if (Array.isArray(modelValue)) {
        if (selection) {
          const [start, end] = hoverValue;
          s = start && dayjs(start, formatter.date, true);
          e = end && dayjs(end, formatter.date, true);
        } else if (autoApply) {
          const [start, end] = modelValue;
          s = start && dayjs(start, formatter.date, true);
          e = end && dayjs(end, formatter.date, true);
        } else {
          const [start, end] = applyValue;
          s = start && dayjs(start, formatter.date, true);
          e = end && dayjs(end, formatter.date, true);
        }
      } else if (useObject()) {
        if (selection) {
          const [start, end] = hoverValue as any;
          s = start && dayjs(start, formatter.date, true);
          e = end && dayjs(end, formatter.date, true);
        } else if (autoApply) {
          const [start, end] = modelValue
            ? Object.values(modelValue)
            : [false, false];
          s = start && dayjs(start, formatter.date, true);
          e = end && dayjs(end, formatter.date, true);
        } else {
          const [start, end] = applyValue;
          s = start && dayjs(start, formatter.date, true);
          e = end && dayjs(end, formatter.date, true);
        }
      } else if (selection) {
        const [start, end] = hoverValue;
        s = start && dayjs(start, formatter.date, true);
        e = end && dayjs(end, formatter.date, true);
      } else if (autoApply) {
        const [start, end] = (
          modelValue && typeof modelValue === "string"
            ? modelValue.split(separator)
            : [false, false]
        ) as any;
        s = start && dayjs(start, formatter.date, true);
        e = end && dayjs(end, formatter.date, true);
      } else {
        const [start, end] = applyValue;
        s = start && dayjs(start, formatter.date, true);
        e = end && dayjs(end, formatter.date, true);
      }
    } else if (Array.isArray(modelValue)) {
      if (autoApply) {
        if (modelValue.length > 0) {
          const [start] = modelValue;
          s = dayjs(start, formatter.date, true);
        }
      } else {
        const [start] = applyValue;
        s = start && dayjs(start, formatter.date, true);
      }
    } else if (useObject()) {
      if (autoApply) {
        if (modelValue) {
          const [start] = Object.values(modelValue);
          s = dayjs(start as string, formatter.date, true);
        }
      } else {
        const [start] = applyValue;
        s = start && dayjs(start, formatter.date, true);
      }
    } else if (autoApply) {
      if (modelValue && typeof modelValue === "string") {
        const [start] = modelValue.split(separator);
        s = dayjs(start, formatter.date, true);
      }
    } else {
      const [start] = applyValue;
      s = start && dayjs(start, formatter.date, true);
    }
    if (active) {
      classes = today
        ? {
            class: `text-litepie-primary-500 font-semibold dark:text-litepie-primary-400 rounded-full`,
            css: selectionColor.ends.text
              ? { color: selectionColor.ends.text }
              : undefined,
          }
        : disabled
        ? {
            class: `text-litepie-secondary-600 font-normal disabled:text-litepie-secondary-500 disabled:cursor-not-allowed rounded-full`,
            css: undefined,
          }
        : date.isBetween(s, e, "date", "()")
        ? {
            class: `text-litepie-secondary-700 font-medium dark:text-litepie-secondary-100 rounded-full`,
            css: undefined,
          }
        : {
            class: `text-litepie-secondary-600 font-medium dark:text-litepie-secondary-200 rounded-full`,
            css: undefined,
          };
    }
    if (off) {
      classes = {
        class: `text-litepie-secondary-400 font-light disabled:cursor-not-allowed`,
        css: undefined,
      };
    }
    if (s && e && !off) {
      if (date.isSame(s, "date")) {
        classes = e.isAfter(s, "date")
          ? {
              class:
                "bg-litepie-primary-500 text-white font-bold rounded-l-full disabled:cursor-not-allowed",
              css: selectionColor.ends.background
                ? { backgroundColor: selectionColor.ends.background }
                : undefined,
            }
          : {
              class:
                "bg-litepie-primary-500 text-white font-bold rounded-r-full disabled:cursor-not-allowed",
              css: selectionColor.ends.background
                ? { backgroundColor: selectionColor.ends.background }
                : undefined,
            };
        if (s.isSame(e, "date")) {
          classes = {
            class: `bg-litepie-primary-500 text-white font-bold rounded-full disabled:cursor-not-allowed`,
            css: selectionColor.ends.background
              ? { backgroundColor: selectionColor.ends.background }
              : undefined,
          };
        }
      }
      if (date.isSame(e, "date")) {
        classes = e.isAfter(s, "date")
          ? {
              class:
                "bg-litepie-primary-500 text-white font-bold rounded-r-full disabled:cursor-not-allowed",
              css: selectionColor.ends.background
                ? { backgroundColor: selectionColor.ends.background }
                : undefined,
            }
          : {
              class:
                "bg-litepie-primary-500 text-white font-bold rounded-l-full disabled:cursor-not-allowed",
              css: selectionColor.ends.background
                ? { backgroundColor: selectionColor.ends.background }
                : undefined,
            };
        if (s.isSame(e, "date")) {
          classes = {
            class: `bg-litepie-primary-500 text-white font-bold rounded-full disabled:cursor-not-allowed`,
            css: selectionColor.ends.background
              ? { backgroundColor: selectionColor.ends.background }
              : undefined,
          };
        }
      }
    } else if (s) {
      if (date.isSame(s, "date") && !off) {
        classes = {
          class: `bg-litepie-primary-500 text-white font-bold rounded-full disabled:cursor-not-allowed`,
          css: selectionColor.ends.background
            ? { backgroundColor: selectionColor.ends.background }
            : undefined,
        };
      }
    }

    return classes;
  };

  const betweenRangeClasses = (date: any) => {
    let classes;
    let s;
    let e;
    classes = "";
    if (!asRange()) return classes;
    if (Array.isArray(modelValue)) {
      if (hoverValue.length > 1) {
        const [start, end] = hoverValue;
        s = start && dayjs(start, formatter.date, true);
        e = end && dayjs(end, formatter.date, true);
      } else if (autoApply) {
        const [start, end] = modelValue;
        s = start && dayjs(start, formatter.date, true);
        e = end && dayjs(end, formatter.date, true);
      } else {
        const [start, end] = applyValue;
        s = start && dayjs(start, formatter.date, true);
        e = end && dayjs(end, formatter.date, true);
      }
    } else if (useObject()) {
      if (hoverValue.length > 1) {
        const [start, end] = hoverValue;
        s = start && dayjs(start, formatter.date, true);
        e = end && dayjs(end, formatter.date, true);
      } else if (autoApply) {
        if (modelValue) {
          const [start, end] = Object.values(modelValue);
          s = start && dayjs(start, formatter.date, true);
          e = end && dayjs(end, formatter.date, true);
        }
      } else {
        const [start, end] = applyValue;
        s = start && dayjs(start, formatter.date, true);
        e = end && dayjs(end, formatter.date, true);
      }
    } else if (hoverValue.length > 1) {
      const [start, end] = hoverValue;
      s = start && dayjs(start, formatter.date, true);
      e = end && dayjs(end, formatter.date, true);
    } else if (autoApply) {
      const [start, end] = (
        modelValue && typeof modelValue === "string"
          ? modelValue.split(separator)
          : [false, false]
      ) as any;
      s = start && dayjs(start, formatter.date, true);
      e = end && dayjs(end, formatter.date, true);
    } else {
      const [start, end] = applyValue;
      s = start && dayjs(start, formatter.date, true);
      e = end && dayjs(end, formatter.date, true);
    }

    if (s && e) {
      if (date.isSame(s, "date")) {
        if (e.isBefore(s)) {
          classes += ` rounded-r-full inset-0`;
        }
        if (s.isBefore(e)) {
          classes += ` rounded-l-full inset-0`;
        }
      } else if (date.isSame(e, "date")) {
        if (e.isBefore(s)) {
          classes += ` rounded-l-full inset-0`;
        }
        if (s.isBefore(e)) {
          classes += ` rounded-r-full inset-0`;
        }
      } else {
        classes += ` inset-0`;
      }
    }
    return classes;
  };

  const forceEmit = (s: any, e: any) => {
    let prevVal = dayjs(s, formatter.date, true);
    let nextVal = dayjs(e, formatter.date, true);
    datePickerDispatch({
      type: "multiple",
      payload: {
        previous: prevVal,
        next: nextVal,
      },
    });
    if (
      dayjs.duration(nextVal.diff(prevVal)).months() === 2 ||
      (dayjs.duration(nextVal.diff(prevVal)).months() === 1 &&
        dayjs.duration(nextVal.diff(prevVal)).days() === 7)
    ) {
      nextVal = nextVal.subtract(1, "month");
      datePickerDispatch({
        type: "change",
        payload: {
          key: "next",
          value: nextVal,
        },
      });
    }
    if (nextVal.isSame(prevVal, "month") || nextVal.isBefore(prevVal)) {
      prevVal = prevVal.add(1, "month");
      datePickerDispatch({
        type: "change",
        payload: {
          key: "next",
          value: prevVal,
        },
      });
    }
  };

  const emitShortcut = (s: any, e: any) => {
    if (asRange()) {
      if (autoApply) {
        if (Array.isArray(modelValue)) {
          setModelValue([s, e]);
        } else if (useObject()) {
          const obj: any = {};
          const [start, end] = Object.keys(modelValue);
          obj[start] = s;
          obj[end] = e;
          setModelValue(obj);
        } else {
          setModelValue(
            useToValueFromArray(
              {
                previous: s,
                next: e,
              },
              { formatter, separator }
            )
          );
        }
        setPickerValue(`${s}${separator}${e}`);
      } else {
        setApplyValue([
          dayjs(s, formatter.date, true) as never,
          dayjs(e, formatter.date, true) as never,
        ]);
      }
    } else if (autoApply) {
      if (Array.isArray(modelValue)) {
        setModelValue([s]);
      } else if (useObject()) {
        const obj: any = {};
        const [start] = Object.keys(modelValue);
        obj[start] = s;
        setModelValue(obj);
      } else {
        setModelValue(s);
      }
      setPickerValue(s);
    } else {
      setApplyValue([
        dayjs(s, formatter.date, true) as never,
        dayjs(e, formatter.date, true) as never,
      ]);
    }
    forceEmit(s, e);
  };

  const setToToday = () => {
    const s = dayjs().format(formatter.date);
    const e = dayjs().format(formatter.date);

    emitShortcut(s, e);
  };

  const setToYesterday = () => {
    const s = dayjs().subtract(1, "day").format(formatter.date);
    const e = dayjs().subtract(1, "day").format(formatter.date);

    emitShortcut(s, e);
  };

  const setToLastDay = (day: number) => {
    const s = dayjs()
      .subtract(day - 1, "day")
      .format(formatter.date);
    const e = dayjs().format(formatter.date);

    emitShortcut(s, e);
  };

  const setToThisMonth = () => {
    const s = dayjs().date(1).format(formatter.date);
    const e = dayjs().date(dayjs().daysInMonth()).format(formatter.date);

    emitShortcut(s, e);
  };

  const setToLastMonth = () => {
    const s = dayjs().date(1).subtract(1, "month").format(formatter.date);
    const e = dayjs().date(0).format(formatter.date);

    emitShortcut(s, e);
  };

  React.useEffect(() => {
    if (show) setPlacement(useVisibleViewport(LitepieRef.current));
  }, [show]);

  React.useEffect(() => {
    if (applyValue.length > 0) {
      panelDispatch({
        type: "multiple",
        payload: {
          previous: {
            year: false,
            month: false,
            calendar: true,
          },
          next: {
            year: false,
            month: false,
            calendar: true,
          },
        },
      });

      onChange(applyValue);
    }
  }, [applyValue]);

  React.useEffect(() => {
    let s;
    let e;
    if (asRange()) {
      if (Array.isArray(modelValue)) {
        if (modelValue.length > 0) {
          const [start, end] = modelValue;
          s = dayjs(start, formatter.date, true);
          e = dayjs(end, formatter.date, true);
        }
      } else if (useObject()) {
        if (Object.keys(modelValue) && Object.keys(modelValue).length > 0) {
          try {
            console.log(Object.keys(modelValue));
          } catch (error: any) {
            console.warn(
              "[Litepie Datepicker]: It looks like you want to use Object as the argument %cv-model",
              "font-style: italic; color: #42b883;",
              ", but you pass it undefined or null."
            );
            console.warn(
              `[Litepie Datepicker]: We has replace with %c{ startDate: '', endDate: '' }`,
              "font-style: italic; color: #42b883;",
              ", but you can replace manually."
            );
            setModelValue({
              startDate: "",
              endDate: "",
            });
          }
        }
        if (modelValue) {
          const [start, end] = Object.values(modelValue);
          s = start && dayjs(start, formatter.date, true);
          e = end && dayjs(end, formatter.date, true);
        }
      } else if (modelValue) {
        const [start, end] = modelValue.split(separator);
        s = dayjs(start, formatter.date, true);
        e = dayjs(end, formatter.date, true);
      }

      if (s && e) {
        setPickerValue(
          useToValueFromArray(
            {
              previous: s,
              next: e,
            },
            { formatter, separator }
          )
        );
        if (e.isBefore(s, "month")) {
          datePickerDispatch({
            type: "multiple",
            payload: {
              previous: e,
              next: s,
              year: { previous: e.year(), next: s.year() },
            },
          });
        } else if (e.isSame(s, "month")) {
          datePickerDispatch({
            type: "multiple",
            payload: {
              previous: s,
              next: e.add(1, "month"),
              year: { previous: s.year(), next: s.add(1, "year").year() },
            },
          });
        } else {
          datePickerDispatch({
            type: "multiple",
            payload: {
              previous: s,
              next: e,
              year: { previous: s.year(), next: e.year() },
            },
          });
        }
        if (!autoApply) {
          setApplyValue([s as never, e as never]);
        }
      } else {
        datePickerDispatch({
          type: "multiple",
          payload: {
            previous: dayjs(startFrom),
            next: dayjs(startFrom).add(1, "month"),
            year: {
              previous: datepicker.previous.year(),
              next: datepicker.next.year(),
            },
          },
        });
      }
    } else {
      if (Array.isArray(modelValue)) {
        if (modelValue.length > 0) {
          const [start] = modelValue;
          s = dayjs(start, formatter.date, true);
        }
      } else if (useObject()) {
        if (modelValue) {
          const [start] = Object.values(modelValue) as any;
          s = dayjs(start, formatter.date, true);
        }
      } else if (modelValue.length) {
        const [start] = modelValue.split(separator);
        s = dayjs(start, formatter.date, true);
      }

      if (s && s.isValid()) {
        setPickerValue(useToValueFromString(s, { formatter }));
        datePickerDispatch({
          type: "multiple",
          payload: {
            previous: s,
            next: s.add(1, "month"),
            year: { previous: s.year(), next: s.add(1, "year").year() },
          },
        });

        if (!autoApply) {
          setApplyValue([s as never]);
        }
      } else {
        datePickerDispatch({
          type: "multiple",
          payload: {
            previous: dayjs(startFrom),
            next: dayjs(startFrom).add(1, "month"),
            year: {
              previous: datepicker.previous.year(),
              next: datepicker.next.year(),
            },
          },
        });
      }
    }
    datePickerDispatch({
      type: "multiple",
      payload: {
        weeks: dayjs.weekdaysShort(),
        months:
          formatter.month === "MMM" ? dayjs.monthsShort() : dayjs.months(),
      },
    });
    document.addEventListener(
      "click",
      (event) => {
        if (
          Litepiedatepicker &&
          (Litepiedatepicker as any).current &&
          !(Litepiedatepicker as any).current.contains(event.target)
        ) {
          setShow(false);
        }
      },
      true
    );
  }, []);

  return (
    <div
      id="litepie"
      ref={Litepiedatepicker}
      className={`${dark ? "dark " : ""}relative ${
        overlay ? " litepie-datepicker-overlay" : ""
      }${show && overlay ? " open" : ""}`}
    >
      <button
        ref={LitepieButtonRef}
        type="button"
        className="flex items-center justify-center flex-none py-3 space-x-2 font-mono text-xs font-semibold leading-6 text-gray-400 transition duration-300 ease-out border border-gray-200 sm:w-auto sm:text-base bg-gray-50 hover:text-gray-900 sm:px-6 rounded-xl sm:space-x-4 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-300 focus:outline-none"
        onClick={() => setShow(!show)}
      >
        {CalenderIcon}
        <span className="text-gray-900">{pickerValue}</span>
      </button>

      {show && (
        <CSSTransition
          timeout={5000}
          classnames={{
            enter: "translate-y-3 opacity-0",
            enterDone: "translate-y-0 opacity-100",
            enterActive: "transition duration-200 ease-out transform",
            exit: "transition duration-150 ease-in transform",
            exitDone: "translate-y-0 opacity-100",
            exitActive: "translate-y-3 opacity-0",
          }}
        >
          <div
            ref={LitepieRef}
            className={`absolute z-50 top-full sm:mt-2.5 ${
              placement ? "left-0 right-auto" : "left-auto right-0"
            }`}
          >
            <div className="fixed inset-0 z-50 overflow-y-auto bg-white shadow-sm sm:overflow-visible sm:static sm:z-auto dark:bg-litepie-secondary-800 sm:rounded-lg">
              <div
                className={`litepie-datepicker static sm:relative w-full bg-white sm:rounded-lg sm:shadow-sm border-0 sm:border border-black border-opacity-10 px-3 py-3 sm:px-1 sm:py-1.5 dark:bg-litepie-secondary-800 dark:border-litepie-secondary-700 dark:border-opacity-100 ${
                  placement ? "place-left" : "place-right"
                }`}
              >
                <div className="flex flex-wrap lg:flex-nowrap">
                  {shortcuts && asRange && !asSingle && (
                    <LitepieShortcut
                      // setToCustomShortcut={setToCustomShortcut}
                      setToday={setToToday}
                      setToYesterday={setToYesterday}
                      setToLastDay={setToLastDay}
                      setToThisMonth={setToThisMonth}
                      setToLastMonth={setToLastMonth}
                      // shortcuts={shortcuts}
                    />
                  )}
                  <div className="relative flex flex-wrap p-1 sm:flex-nowrap">
                    {asRange() && !asSingle && (
                      <>
                        <div className="absolute inset-0 items-center justify-center hidden sm:flex">
                          <div className="w-8 h-1 shadow-inner sm:w-1 sm:h-8 bg-litepie-primary-500 rounded-xl" />
                        </div>

                        <div
                          className={`relative w-full sm:w-80${
                            asRange() && !asSingle
                              ? " mb-3 sm:mb-0 sm:mr-2"
                              : ""
                          }`}
                        >
                          <LitepieHeader
                            panel={panel.previous}
                            calendar={calendar.previous}
                            Icons={HeaderIcons}
                          />
                          <div className="px-0.5 sm:px-2">
                            {panel.previous.month && (
                              <LitepieMonth
                                months={months()}
                                updateMonth={calendar.previous.setMonth}
                              />
                            )}
                            {panel.previous.year && (
                              <LitepieYear
                                years={calendar.previous.years()}
                                updateYear={calendar.previous.setYear}
                                asPrevOrNext={false}
                              />
                            )}
                            {panel.previous.calendar && (
                              <div>
                                <LitepieWeek weeks={dayjs.weekdaysShort()} />
                                <LitepieCalendar
                                  isBetweenRange={isBetweenRange}
                                  betweenRangeClasses={betweenRangeClasses}
                                  atMouseOver={atMouseOver}
                                  datepickerClasses={datepickerClasses}
                                  calendar={calendar.previous}
                                  asRange={asRange()}
                                  asPrevOrNext
                                  updateDate={setDate}
                                  selectionColor={selectionColor.selection}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    {asRange() && !asSingle && (
                      <div className="relative w-full mt-3 overflow-hidden sm:w-80 sm:mt-0 sm:ml-2">
                        <LitepieHeader
                          panel={panel.next}
                          calendar={calendar.next}
                          Icons={HeaderIcons}
                        />
                        <div className="px-0.5 sm:px-2">
                          {panel.next.month && (
                            <LitepieMonth
                              months={months()}
                              updateMonth={calendar.next.setMonth}
                            />
                          )}
                          {panel.next.year && (
                            <LitepieYear
                              years={calendar.next.years()}
                              updateYear={calendar.next.setYear}
                              asPrevOrNext
                            />
                          )}
                          {panel.next.calendar && (
                            <div>
                              <LitepieWeek weeks={weeks()} />
                              <LitepieCalendar
                                isBetweenRange={isBetweenRange}
                                betweenRangeClasses={betweenRangeClasses}
                                atMouseOver={atMouseOver}
                                datepickerClasses={datepickerClasses}
                                calendar={calendar.next}
                                asRange={asRange()}
                                asPrevOrNext
                                updateDate={setDate}
                                selectionColor={selectionColor.selection}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {!autoApply ? (
                  <div>
                    <div className="mt-2 mx-2 py-1.5 border-t border-black border-opacity-10 dark:border-litepie-secondary-700 dark:border-opacity-100">
                      <div className="mt-1.5 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white transition duration-300 ease-out border border-transparent rounded-md shadow-sm away-apply-picker bg-litepie-primary-600 hover:bg-litepie-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-litepie-primary-500 sm:ml-3 sm:w-auto sm:text-sm dark:ring-offset-litepie-secondary-800 disabled:cursor-not-allowed"
                          disabled={
                            asSingle
                              ? applyValue.length < 1
                              : applyValue.length < 2
                          }
                          style={styles?.apply}
                          onClick={applyDate}
                        >
                          {options.footer.apply}
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium transition duration-300 ease-out bg-white border rounded-md shadow-sm away-cancel-picker border-litepie-secondary-300 text-litepie-secondary-700 hover:bg-litepie-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-litepie-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:ring-offset-litepie-secondary-800"
                          onClick={() => {
                            setShow(false);
                          }}
                          style={styles?.cancel}
                        >
                          {options.footer.cancel}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="sm:hidden">
                    <div className="mt-2 mx-2 py-1.5 border-t border-black border-opacity-10 dark:border-litepie-secondary-700 dark:border-opacity-100">
                      <div className="mt-1.5 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="inline-flex justify-center w-full px-4 py-2 text-base font-medium transition duration-300 ease-out bg-white border rounded-md shadow-sm away-cancel-picker border-litepie-secondary-300 text-litepie-secondary-700 hover:bg-litepie-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-litepie-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:ring-offset-litepie-secondary-800"
                          style={styles?.cancel}
                        >
                          {options.footer.cancel}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CSSTransition>
      )}
    </div>
  );
};

export default Datepicker;
