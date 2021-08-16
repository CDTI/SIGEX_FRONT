import { Project } from "../../../../../interfaces/project";

type Action =
  | { type: "HIDE_DIALOG"                     }
  | { type: "NOT_RATED"                       }
  | { type: "RATED"                           }
  | { type: "SHOW_DIALOG", payload: Project  };

interface ProjectDetailsDialogState
{
  isRated: boolean;
  isVisible: boolean;
  data?: Project;
}

export function projectDetailsDialogStateReducer(
  state: ProjectDetailsDialogState,
  action: Action)
  : ProjectDetailsDialogState
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