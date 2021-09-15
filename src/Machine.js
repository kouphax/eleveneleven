import { createMachine, assign } from "xstate";
import React from "react";

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const source = [
  {
    question: "1 + 1",
    answer: "2",
  },
  {
    question: "1 + 5",
    answer: "6",
  },
  {
    question: "4 + 5",
    answer: "9",
  },
  {
    question: "4 + 4",
    answer: "8",
  },
  {
    question: "9 + 5",
    answer: "14",
  },
];

export const sessionMachine = createMachine(
  {
    id: "session",
    initial: "ready",
    context: {
      session: [],
    },
    states: {
      ready: {
        on: {
          BEGIN: { target: "session" },
        },
      },
      session: {
        entry: ["buildSession"],
        on: {
          NO_MORE_QUESTIONS: { target: "finished" },
        },
      },
      finished: {
        type: "final",
        entry: ["buildStats"],
      },
    },
  },
  {
    actions: {
      buildSession: assign({
        session: () => shuffle(source),
      }),
      buildStats: assign({
        stats: (_, event) => {
          return event.results.reduce(
            (stats, result) => {
              if (result.correct) {
                return {
                  ...stats,
                  correct: stats.correct + 1,
                  total: stats.total + 1,
                };
              } else {
                return {
                  ...stats,
                  incorrect: stats.incorrect + 1,
                  total: stats.total + 1,
                };
              }
            },
            { correct: 0, incorrect: 0, total: 0 }
          );
        },
      }),
    },
  }
);

export const MachineContext = React.createContext(null);
