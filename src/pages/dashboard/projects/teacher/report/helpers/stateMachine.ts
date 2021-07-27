import { ICommunity } from "../../../../../../interfaces/community";
import { IReport } from "../../../../../../interfaces/report";

type FormStep =
  | "introduction"
  | "methodology"
  | "results"
  | "discussion"
  | "community"
  | "completed";

type Action =
  | { type: "RESTORE",  payload: { step: FormStep, data: any }  }
  | { type: "SET_DATA", payload: IReport                        }
  | { type: "PREVIOUS"                                          }
  | { type: "NEXT",     payload: any                            };

type FormStepDefinition =
{
  [key: string]:
  {
    order: number,
    previous?: FormStep,
    next?: FormStep
  }
};

interface ReportFormState
{
  data?: IReport;
  step: FormStep;
}

export const FormSteps: FormStepDefinition =
{
  introduction: { order: 0,  next: "methodology"                          },
  methodology:  { order: 1,  previous: "introduction", next: "results"    },
  results:      { order: 2,  previous: "methodology",  next: "discussion" },
  discussion:   { order: 3,  previous: "results",      next: "community"  },
  community:    { order: 4,  previous: "discussion",   next: "completed"  },
  completed:    { order: 5                                                }
} as const;

export function reportFormStateReducer(
  state: ReportFormState,
  action: Action)
  : ReportFormState
{
  switch (action.type)
  {
    case "SET_DATA":
      return { ...state, data: action.payload };

    case "RESTORE":
      return { step: action.payload.step, data: action.payload.data };

    case "PREVIOUS":
      return FormSteps[state.step].previous === undefined
        ? { ...state }
        : { ...state, step: FormSteps[state.step].previous! };

    case "NEXT":
      if (FormSteps[state.step].next === undefined)
        return { ...state };

      switch (state.step)
      {
        case "introduction":
          return (
          {
            step: FormSteps[state.step].next!,
            data:
            {
              ...state.data!,
              projectTitle: action.payload.projectTitle,
              introduction: action.payload.introduction
            }
          });

        case "methodology":
          return (
          {
            step: FormSteps[state.step].next!,
            data:
            {
              ...state.data!,
              methodology: action.payload.methodology
            }
          });

        case "results":
          return (
          {
            step: FormSteps[state.step].next!,
            data:
            {
              ...state.data!,
              results: action.payload.results,
              students: action.payload.students,
              teams: action.payload.teams,
              communityPeople: action.payload.communityPeople,
              affectedPeople: action.payload.affectedPeople
            }
          });

        case "discussion":
          return (
          {
            step: FormSteps[state.step].next!,
            data:
            {
              ...state.data!,
              discussion: action.payload.discussion
            }
          });

        case "community":
          return (
          {
            step: FormSteps[state.step].next!,
            data:
            {
              ...state.data!,
              community: { ...(action.payload as ICommunity) }
            }
          });

        default:
          throw new Error("You shoudn't be here, fella! Go back before anyone get hurts!");
      }
  }
}