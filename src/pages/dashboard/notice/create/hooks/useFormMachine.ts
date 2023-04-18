import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { Notice, Timetable } from "../../../../../interfaces/notice";

interface FormContext {
  data?: Notice;
  step: number;
}

type FormEvent =
  | { type: "ERROR" }
  | { type: "PREVIOUS" }
  | { type: "REVIEW" }
  | { type: "SUCCESS" }
  | { type: "NEXT"; payload: Notice }
  | { type: "RESTORE"; payload: FormContext }
  | { type: "SAVE"; payload: any };

type FormTypestate =
  | { value: "main"; context: FormContext & { step: 0 } }
  | { value: "timetables"; context: FormContext & { step: 1; data: Notice } }
  | { value: "pending"; context: FormContext & { data: Notice } }
  | { value: "succeeded"; context: FormContext }
  | { value: "failed"; context: FormContext };

export const FormSteps = ["main", "timetables"] as const;

export function useFormStateMachine() {
  return useMachine(
    createMachine<FormContext, FormEvent, FormTypestate>({
      id: "form",
      initial: "main",
      context: { step: 0 },
      states: {
        main: {
          on: {
            RESTORE: [
              {
                target: "main",
                cond: (ctx, ev) => ev.payload.step === 0,
                actions: assign({
                  step: (ctx, ev) => ev.payload.step,
                  data: (ctx, ev) => ({ ...ev.payload.data! }),
                }),
              },

              {
                target: "timetables",
                cond: (ctx, ev) => ev.payload.step === 1,
                actions: assign({
                  step: (ctx, ev) => ev.payload.step,
                  data: (ctx, ev) => ({ ...ev.payload.data! }),
                }),
              },
            ],

            NEXT: {
              target: "timetables",
              actions: assign({
                step: (ctx) => ctx.step + 1,
                data: (ctx, ev) => ({
                  ...ctx.data!,
                  number: ev.payload.number,
                  name: ev.payload.name,
                  canAccess: ev.payload.canAccess,
                  effectiveDate: ev.payload.effectiveDate,
                  expirationDate: ev.payload.expirationDate,
                  reportDeadline: ev.payload.reportDeadline,
                  type: "common",
                  isActive: true,
                  projectExecutionPeriod: ev.payload.projectExecutionPeriod,
                  projectExecutionYear: ev.payload.projectExecutionYear,
                }),
              }),
            },
          },
        },

        timetables: {
          on: {
            PREVIOUS: {
              target: "main",
              actions: assign({ step: (ctx) => ctx.step - 1 }),
            },

            SAVE: {
              target: "pending",
              actions: assign({
                data: (ctx, ev) => ({
                  ...ctx.data!,
                  category: ev.payload.category,
                  timetables: ev.payload.timetables,
                }),
              }),
            },
          },
        },

        pending: {
          on: {
            SUCCESS: "succeeded",
            ERROR: "failed",
          },
        },

        succeeded: {
          type: "final",
        },

        failed: {
          on: {
            REVIEW: {
              target: "main",
              actions: assign({ step: 0 }),
            },
          },
        },
      },
    })
  );
}
