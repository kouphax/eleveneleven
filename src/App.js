import { useState } from "react";

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

function App() {
  const [firstQuestion, ...remainingQuestions] = shuffle(source);

  const [question, setQuestion] = useState(firstQuestion);
  const [questions, setQuestions] = useState(remainingQuestions);
  const [answer, setAnswer] = useState("");
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  });

  const moveNext = () => {
    if (questions.length > 0) {
      const [head, ...tail] = questions;
      setQuestion(head);
      setQuestions(tail);
    } else {
      setQuestion(null);
    }

    setAnswer("");
  };

  const markCorrect = () =>
    setStats({
      ...stats,
      correct: stats.correct + 1,
      total: stats.total + 1,
    });

  const markIncorrect = () =>
    setStats({
      ...stats,
      incorrect: stats.incorrect + 1,
      total: stats.total + 1,
    });

  const test = () => {
    if (answer === question.answer) {
      markCorrect();
    } else {
      markIncorrect();
    }

    moveNext();
  };

  return (
    <div>
      {question != null && (
        <>
          <h1>{question.question}</h1>
          <div>
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !!answer && test()}
            />
          </div>
          <div>
            <button disabled={!answer} onClick={() => test()}>
              Test
            </button>
          </div>
        </>
      )}

      <div>
        <ul>
          <li>Correct: {stats.correct}</li>
          <li>Incorrect: {stats.incorrect}</li>
          <li>Total: {stats.total}</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
