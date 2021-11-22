type PanelPayload = {
  calendar?: boolean;
  month?: boolean;
  year?: boolean;
};
type PanelAction =
  | { type: 'change'; payload: { key: 'previous' | 'next'; value: PanelPayload } }
  | {
      type: 'multiple';
      payload: any;
    };

type PanelState = {
  previous: {
    calendar: boolean;
    month: boolean;
    year: boolean;
  };
  next: {
    calendar: boolean;
    month: boolean;
    year: boolean;
  };
};

const panelReducer = (state: PanelState, action: PanelAction) => {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          ...action.payload.value,
        },
      };
    case 'multiple':
      return {
        ...state,
        ...action.payload,
      };
    default:
      throw new Error();
  }
};
export default panelReducer;
