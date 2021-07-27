import { IProject } from "../../../../../interfaces/project";

type Action =
  | { type: "HIDE_DIALOG"                     }
  | { type: "NOT_RATED"                       }
  | { type: "RATED"                           }
  | { type: "SHOW_DIALOG", payload: IProject  };

interface DetailsDialogState
{
  isRated: boolean;
  isVisible: boolean;
  data?: IProject;
}

export function detailsDialogStateReducer(
  state: DetailsDialogState,
  action: Action)
  : DetailsDialogState
{
  switch (action.type)
  {
    case "SHOW_DIALOG":
      return { ...state, isVisible: true, data: action.payload };

    case "HIDE_DIALOG":
      return { ...state, isVisible: false };

    case "RATED":
      return { ...state, isRated: true };

    case "NOT_RATED":
      return { ...state, isRated: false };
  }
};