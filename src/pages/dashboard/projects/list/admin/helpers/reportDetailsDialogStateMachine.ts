import { Report } from "../../../../../../interfaces/project";

type Action =
  | { type: "HIDE_DIALOG"                     }
  | { type: "SHOW_DIALOG", payload: Report  };

interface ReportDetailsDialogState
{
  isVisible: boolean;
  data?: Report;
}

export function reportDetailsDialogStateReducer(
  state: ReportDetailsDialogState,
  action: Action)
  : ReportDetailsDialogState
{
  switch (action.type)
  {
    case "SHOW_DIALOG":
      return { ...state, isVisible: true, data: action.payload };

    case "HIDE_DIALOG":
      return { ...state, isVisible: false };
  }
};