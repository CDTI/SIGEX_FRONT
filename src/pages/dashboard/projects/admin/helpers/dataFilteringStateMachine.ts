import { Category } from "../../../../../interfaces/category";
import { Notice } from "../../../../../interfaces/notice";
import { Program } from "../../../../../interfaces/program";
import { Project } from "../../../../../interfaces/project";
import { User } from "../../../../../interfaces/user";

type Action =
  | { type: "FILTER"                                    }
  | { type: "FILTER_BY_AUTHOR_NAME",  payload?: string  }
  | { type: "FILTER_BY_CATEGORY",     payload?: string  }
  | { type: "FILTER_BY_NOTICE",       payload?: string  }
  | { type: "FILTER_BY_PROGRAM",      payload?: string  }
  | { type: "FILTER_BY_PROJECT_NAME", payload?: string  }
  | { type: "LOADING"                                   }
  | { type: "NOT_LOADING"                               }
  | { type: "SET_DATA",               payload: any      }

interface DataFilteringState
{
  data: Project[];
  isLoading: boolean;
  result: Project[];
  authorName?: string;
  categoryId?:string;
  noticeId?: string;
  programId?: string;
  projectName?: string;
}

export function dataFilteringStateReducer(
  state: DataFilteringState,
  action: Action)
  : DataFilteringState
{
  switch (action.type)
  {
    case "LOADING":
      return { ...state, isLoading: true };

    case "NOT_LOADING":
      return { ...state, isLoading: false };

    case "SET_DATA":
      return { ...state, data: action.payload.data };

    case "FILTER_BY_PROGRAM":
      return { ...state, programId: action.payload };

    case "FILTER_BY_CATEGORY":
      return { ...state, categoryId: action.payload };

    case "FILTER_BY_NOTICE":
      return { ...state, noticeId: action.payload };

    case "FILTER_BY_PROJECT_NAME":
      return { ...state, projectName: action.payload };

    case "FILTER_BY_AUTHOR_NAME":
      return { ...state, authorName: action.payload };

    case "FILTER":
      return (
      {
        ...state,
        result: state.data.filter((p: Project) =>
        {
          let shouldKeep = true;
          if (state.authorName !== undefined)
            shouldKeep = shouldKeep && (p.author as User)?.name.toLocaleUpperCase().includes(
              state.authorName.toLocaleUpperCase());

          if (state.categoryId !== undefined)
            shouldKeep = shouldKeep && (p.category as Category)._id === state.categoryId;

          if (state.noticeId !== undefined)
            shouldKeep = shouldKeep && (p.notice as Notice)._id === state.noticeId;

          if (state.programId !== undefined)
            shouldKeep = shouldKeep && (p.program as Program)._id === state.programId;

          if (state.projectName !== undefined)
            shouldKeep = shouldKeep && p.name.toLocaleUpperCase().includes(
              state.projectName.toLocaleUpperCase());

          return shouldKeep;
        })
      });
  }
};