import React, { useEffect, useState } from 'react';
import Answer from './Answer';

const CreateQuizForm = ({ postQuiz, postQuestion, quizList, postOutcome, outcomes, questions, fetchOutcomes, fetchQuestions, postAnswer }) => {


  useEffect(() => {
    fetchOutcomes();
    fetchQuestions();
},[])


  const [stateQuiz, setStateQuiz] = useState({
    name: '',
  });

  const [stateOutcomes, setStateOutcomes] = useState({
      outcomeText: ""
  })

  const [stateQuestion, setStateQuestion] = useState({
    quizId: null,
    questionText: '',
  });

  const [stateAnswer, setStateAnswer] = useState({
    questionId: 11,
    outcomeId: 9,
    answerText: ""
  })

  const handleQuizFormSubmit = (event) => {
    event.preventDefault();
    postQuiz(stateQuiz);
    setStateQuiz({
      name: '',
    });
  };

  const handleOutcomeFormSubmit = (event) => {
    event.preventDefault();
    postOutcome(stateOutcomes);
    setStateOutcomes({
      quizId: null,
      outcomeText: '',
    });
  };

  const handleQuestionFormSubmit = (event) => {
    event.preventDefault();
    postQuestion(stateQuestion);
    setStateQuestion({
      quizId: null,
      questionText: '',
    });
  };

  const handleAnswerFormSubmit = (event) => {
    event.preventDefault();
    postAnswer(stateAnswer);
    setStateAnswer({
      questionId: null,
      outcomeId: null,
      answerText: '',
    });
  };

  
  const quizOptions = quizList.map((quiz) => (
    <option key={quiz.id} value={quiz.id}>
      {quiz.name}
    </option>
  ));

  const outcomeOptions = outcomes.map((outcome) => (
    <option key={outcome.id} value={outcome.id}>
      {outcome.outcome}
    </option>
  ));

    // console.log(questions)
  const questionOptions = questions.map((question) => (
    <option key={question.id} value={question.id}>
      {question.questionText}
    </option>
  ));


  const handleQuizChange = (event) => {
    const propertyName = event.target.name;
    const copiedOutcomes = { ...stateOutcomes };
    copiedOutcomes[propertyName] = event.target.value;
    setStateOutcomes(copiedOutcomes);
  };

  const handleQuizNameChange = (event) => {
    const propertyName = event.target.name;
    const copiedQuiz = { ...stateQuiz };
    copiedQuiz[propertyName] = event.target.value;
    setStateQuiz(copiedQuiz);
  };


  const handleOutcomeChange = (event) => {
    const propertyName = event.target.name;
    const copiedOutcomes = { ...stateOutcomes };
    copiedOutcomes[propertyName] = event.target.value;
    setStateOutcomes(copiedOutcomes);
  };

  const handleQuestionChange = (event) => {
    const propertyName = event.target.name;
    const copiedQuestion = { ...stateQuestion };
    copiedQuestion[propertyName] = event.target.value;
    setStateQuestion(copiedQuestion);
  };

  const handleAnswerQuestionChange = (event) => {
    const propertyName = event.target.name;
    const copiedAnswer = { ...stateAnswer };
    copiedAnswer[propertyName] = event.target.value;
    setStateAnswer(copiedAnswer);
  };

  const handleAnswerOutcomeChange = (event) => {
    const propertyName = event.target.name;
    const copiedAnswer = { ...stateAnswer };
    copiedAnswer[propertyName] = event.target.value;
    setStateAnswer(copiedAnswer);
  };

  const handleAnswerTextChange = (event) => {
    const propertyName = event.target.name;
    const copiedAnswer = { ...stateAnswer };
    copiedAnswer[propertyName] = event.target.value;
    setStateAnswer(copiedAnswer);
  };

  return (
    <section className="form-container">
      <form id="quiz-form" onSubmit={handleQuizFormSubmit}>
        <p>This is the create new quiz page</p>
        <label htmlFor="quiz-form">Create a New Quiz!</label>
        <input
          id="quiz-name"
          name="name"
          type="text"
          placeholder="Enter quiz name!"
          value={stateQuiz.name}
          onChange={handleQuizNameChange}
        />
        <button type="submit">Create Quiz</button>
      </form>

      <form id="add-question-form" onSubmit={handleQuestionFormSubmit}>
        <label htmlFor="quiz">Quiz</label>
        <select
          id="quiz"
          name="quizId"
          defaultValue="select-quiz"
          onChange={handleQuestionChange}
        >
          <option disabled value="select-quiz">
            Choose a quiz to add a question to
          </option>
          {quizOptions}
        </select>

        <label htmlFor="add-question-form">
          Add a Question to a new Quiz or old Quiz!
        </label>
        <input
          id="question-name"
          name="questionText"
          type="text"
          placeholder="Enter a question!"
          value={stateQuestion.questionText}
          onChange={handleQuestionChange}
        />

        <button type="submit">Add Question to Quiz</button>
      </form>

      <form id="add-outcome-form" onSubmit={handleOutcomeFormSubmit}>
      <label htmlFor="add-outcome-form">Add an Outcome to a Quiz</label>
      <input
        id="outcome-text"
        name="outcomeText"
        type="text"
        placeholder="Enter an outcome!"
        value={stateOutcomes.outcomeText}
        onChange={handleOutcomeChange}
      />

      <button type="submit">Add An Outcome</button>
    </form>

    <form id="add-answer-form" onSubmit={handleAnswerFormSubmit}>
      <label htmlFor="question">Select a Question</label>
      <select
        id="question"
        name="questionId"
        defaultValue="select-question"
        onChange={handleAnswerQuestionChange}
      >
        <option disabled value="select-question">
          Choose a question for the answer
        </option>
        {questionOptions}
      </select>

      <label htmlFor="outcome">Select an Outcome</label>
      <select
        id="outcome"
        name="outcomeId"
        defaultValue="select-outcome"
        onChange={handleAnswerOutcomeChange}
      >
        <option disabled value="select-outcome">
          Choose an outcome for the answer
        </option>
        {outcomeOptions}
      </select>

      <label htmlFor="add-answer-form">Add an Answer</label>
      <input
        id="answer-text"
        name="answerText"
        type="text"
        placeholder="Enter an answer!"
        value={stateAnswer.answerText}
        onChange={handleAnswerTextChange}
      />

      <button type="submit">Add Answer</button>
    </form>
    </section>
  );
};

export default CreateQuizForm;
