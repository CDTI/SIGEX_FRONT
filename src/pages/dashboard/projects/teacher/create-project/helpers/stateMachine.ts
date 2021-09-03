import { assign, createMachine } from "xstate";

import
{
  Community,
  Partnership,
  Planning,
  Project,
  Resources
} from "../../../../../../interfaces/project";

interface FormContext
{
  data?: Project;
  step: number;
}

type FormEvent =
  | { type: "ERROR"; }
  | { type: "PREVIOUS"; }
  | { type: "REVIEW"; }
  | { type: "SUCCESS"; }
  | { type: "NEXT"; payload: Project | Partnership[] | Community | Planning[]; }
  | { type: "RESTORE"; payload: FormContext; }
  | { type: "SAVE"; payload: Resources; };

type FormTypestate =
  | { value: "main"; context: FormContext & { step: 0; }; }
  | { value: "associates"; context: FormContext & { step: 1; data: Project; }; }
  | { value: "community"; context: FormContext & { step: 2; data: Project; }; }
  | { value: "arrangements"; context: FormContext & { step: 3; data: Project; }; }
  | { value: "resources"; context: FormContext & { step: 4; data: Project; }; }
  | { value: "pending"; context: FormContext & { data: Project; }; }
  | { value: "succeeded"; context: FormContext; }
  | { value: "failed"; context: FormContext; };

export const FormSteps =
[
  "main",
  "associates",
  "community",
  "arrangements",
  "resources"
] as const;

export const formStateMachine = createMachine<FormContext, FormEvent, FormTypestate>(
{
  id: "form",
  initial: "main",
  context: { step: 0 },
  states:
  {
    main:
    {
      on:
      {
        RESTORE:
        {
          target: "main",
          actions: assign(
          {
            step: (ctx, ev) => ev.payload.step,
            data: (ctx, ev) => ({ ...ev.payload.data! })
          })
        },

        NEXT:
        {
          target: "associates",
          actions: assign(
          {
            step: (ctx) => ctx.step + 1,
            data: (ctx, ev) =>
            {
              const now = new Date();
              const payload = ev.payload as Project;
              return (
              {
                ...ctx.data!,
                author: payload.author,
                category: payload.category,
                dateFinal: now,
                dateStart: now,
                description: payload.description,
                disciplines: payload.disciplines,
                firstSemester: payload.firstSemester,
                maxClasses: payload.maxClasses,
                name: payload.name,
                notice: payload.notice,
                program: payload.program,
                secondSemester: payload.secondSemester,
                status: "pending",
                teachers: payload.teachers,
                totalCH: payload.totalCH,
                typeProject: payload.typeProject
              });
            }
          })
        }
      }
    },

    associates:
    {
      on:
      {
        PREVIOUS:
        {
          target: "main",
          actions: assign({ step: (ctx) => ctx.step - 1 })
        },

        NEXT:
        {
          target: "community",
          actions: assign(
          {
            step: (ctx) => ctx.step + 1,
            data: (ctx, ev) => (
            {
              ...ctx.data!,
              partnership: ev.payload as Partnership[]
            })
          })
        }
      }
    },

    community:
    {
      on:
      {
        PREVIOUS:
        {
          target: "associates",
          actions: assign({ step: (ctx) => ctx.step - 1 })
        },

        NEXT:
        {
          target: "arrangements",
          actions: assign(
          {
            step: (ctx) => ctx.step + 1,
            data: (ctx, ev) => (
            {
              ...ctx.data!,
              specificCommunity: ev.payload as Community
            })
          })
        }
      }
    },

    arrangements:
    {
      on:
      {
        PREVIOUS:
        {
          target: "community",
          actions: assign({ step: (ctx) => ctx.step - 1 })
        },

        NEXT:
        {
          target: "resources",
          actions: assign(
          {
            step: (ctx) => ctx.step + 1,
            data: (ctx, ev) => (
            {
              ...ctx.data!,
              planning: ev.payload as Planning[]
            })
          })
        }
      }
    },

    resources:
    {
      on:
      {
        PREVIOUS:
        {
          target: "arrangements",
          actions: assign({ step: (ctx) => ctx.step - 1 })
        },

        SAVE:
        {
          target: "pending",
          actions: assign(
          {
            data: (ctx, ev) => (
            {
              ...ctx.data!,
              resources: ev.payload
            })
          })
        }
      }
    },

    pending:
    {
      on:
      {
        SUCCESS: "succeeded",
        ERROR: "failed"
      }
    },

    succeeded:
    {
      type: "final"
    },

    failed:
    {
      on:
      {
        REVIEW:
        {
          target: "main",
          actions: assign({ step: 0 })
        }
      }
    }
  }
});
