import QuizCard from "./QuizCard";

const QuizList = ({quizList, handleStartQuiz, findCurrentQuestion}) => {

    const quizComponents = quizList.map((quiz) => {
        console.log(quiz)
        // the if statement stops a new quiz from showing up in the quizzes screen at home if it has less than 1 question aka not playable.
        if (quiz.size > 0){
        return <QuizCard key={quiz.id} quiz={quiz} handleStartQuiz={handleStartQuiz} findCurrentQuestion={findCurrentQuestion} />
        }
    })


    return ( 
        <section className="list-of-quizzes-container">
            <section className="quizzes-header">
            <h2 className="list-of-quizzes">Quizzes</h2>
            </ section>
            <div className="quizzes"> {quizList ? quizComponents : <p>Loading</p>} </div>
        </ section>
    );
}

export default QuizList;