import { Project } from "../../../../../../interfaces/project";

type FormStep =
  | "mainData"
  | "associates"
  | "community"
  | "arrangement"
  | "resources"
  | "pending"
  | "completed";

type Action =
  | { type: "RESTORE",  payload: { step: FormStep, data: any }  }
  | { type: "SET_DATA", payload: Project                        }
  | { type: "PREVIOUS"                                          }
  | { type: "NEXT",     payload: any                            };

interface FormStepDefinition
{
  [key: string]:
  {
    order: number,
    previous?: FormStep,
    next?: FormStep
  }
}

interface ProjectFormState
{
  data?: Project;
  step: FormStep;
}

export const FormSteps: FormStepDefinition =
{
  mainData:     { order: 0,                           next: "associates"  },
  associates:   { order: 1, previous: "mainData",     next: "community"   },
  community:    { order: 2, previous: "associates",   next: "arrangement" },
  arrangement:  { order: 3, previous: "community",    next: "resources"   },
  resources:    { order: 4, previous: "arrangement",  next: "pending"     },
  pending:      { order: 5,                           next: "completed"   },
  completed:    { order: 6, previous: "mainData"                          }
} as const;

export function projectFormStateReducer(
  prevState: ProjectFormState,
  action: Action)
  : ProjectFormState
{
  switch (action.type)
  {
    case "SET_DATA":
      return { ...prevState, data: action.payload };

    case "RESTORE":
      return { step: action.payload.step, data: action.payload.data };

    case "PREVIOUS":
      return FormSteps[prevState.step].previous
        ? { ...prevState, step: FormSteps[prevState.step].previous! }
        : { ...prevState };

    case "NEXT":
      if (!FormSteps[prevState.step].next)
        return { ...prevState };

      switch (prevState.step)
      {
        case "mainData":
          const now = new Date();
          return (
          {
            step: FormSteps[prevState.step].next!,
            data:
            {
              ...prevState.data!,
              author: action.payload.author,
              category: action.payload.category,
              dateFinal: now,
              dateStart: now,
              description: action.payload.description,
              disciplines: action.payload.disciplines,
              firstSemester: action.payload.firstSemester,
              maxClasses: action.payload.maxClasses,
              name: action.payload.name,
              notice: action.payload.notice,
              program: action.payload.program,
              secondSemester: action.payload.secondSemester,
              status: "pending",
              teachers: action.payload.teachers,
              totalCH: action.payload.totalCH,
              typeProject: action.payload.typeProject
            }
          });

        case "associates":
          return (
          {
            step: FormSteps[prevState.step].next!,
            data:
            {
              ...prevState.data!,
              partnership: action.payload
            }
          });

        case "community":
          return (
          {
            step: FormSteps[prevState.step].next!,
            data:
            {
              ...prevState.data!,
              specificCommunity: action.payload
            }
          });

        case "arrangement":
          return (
          {
            step: FormSteps[prevState.step].next!,
            data:
            {
              ...prevState.data!,
              planning: action.payload
            }
          });

        case "resources":
          return (
          {
            step: FormSteps[prevState.step].next!,
            data:
            {
              ...prevState.data!,
              resources: action.payload
            }
          });

        case "pending":
          return (
          {
            step: FormSteps[prevState.step].next!,
            data: { ...prevState.data! }
          });

        default:
          throw new Error("You shoudn't be here, fella! Go back before anyone get hurts!");
      }
  }
}