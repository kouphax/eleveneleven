import { useState, useContext } from "react";
import { useMachine } from "@xstate/react";
import { MachineContext, sessionMachine } from "./Machine";

function App() {
  const [state, send, service] = useMachine(sessionMachine);
  const machine = [state, send, service];

  return (
    <MachineContext.Provider value={machine}>
      <Stage />
    </MachineContext.Provider>
  );
}

function Finished() {
  const [state, send] = useContext(MachineContext);
  const { stats } = state.context;
  return <p>{JSON.stringify(stats)}</p>;
}

function Session() {
  const [state, send] = useContext(MachineContext);
  const [firstQuestion, ...remainingQuestions] = state.context.session;
  const [currentQuestion, setCurrentQuestion] = useState(firstQuestion);
  const [questions, setQuestions] = useState(remainingQuestions);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState([]);

  const attempt = () => {
    const currentResults = [
      ...results,
      {
        question: currentQuestion,
        answer,
        correct: answer === currentQuestion.answer,
      },
    ];

    setResults(currentResults);
    setAnswer("");

    const [head, ...tail] = questions;
    if (head) {
      setCurrentQuestion(head);
      setQuestions(tail);
    } else {
      send({ type: "NO_MORE_QUESTIONS", results: currentResults });
    }
  };

  return (
    <div>
      <h1>{currentQuestion.question}</h1>
      <div>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !!answer && attempt()}
        />
      </div>
      <button disabled={!answer} onClick={() => attempt()}>
        Answer
      </button>
    </div>
  );
}

function Stage() {
  const [state, send] = useContext(MachineContext);

  switch (state.value) {
    case "ready":
      return (
        <div>
          <button onClick={() => send("BEGIN")}> Start </button>
        </div>
      );
    case "session":
      return <Session />;
    case "finished":
      return <Finished />;
  }
}

export default App;
