type DatepickerAction =
  | {
      type: 'change';
      payload: { key: 'previous' | 'next' | 'year' | 'weeks' | 'months'; value: any };
    }
  | {
      type: 'multiple';
      payload: any;
    };

type DatepickerState = {
  previous: any;
  next: any;
  year: {
    previous: any;
    next: any;
  };
  weeks: any[];
  months: any[];
};

const datepickerReducer = (state: DatepickerState, action: DatepickerAction) => {
  switch (action.type) {
    case 'change':
      switch (action.payload.key) {
        case 'year':
          return {
            ...state,
            [action.payload.key]: {
              ...state[action.payload.key],
              ...action.payload.value,
            },
          };
        default:
          return {
            ...state,
            [action.payload.key]: action.payload.value,
          };
      }
    case 'multiple':
      return {
        ...state,
        ...action.payload,
      };

    default:
      throw new Error();
  }
};
export default datepickerReducer;
