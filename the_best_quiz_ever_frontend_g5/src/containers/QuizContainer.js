import Question from "../components/Question";
import QuizList from "../components/QuizList";
import Result from "../components/Result";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Template from "../components/Template";
import CreateQuizForm from "../components/CreateQuizForm";

const QuizContainer = () => {

    const [apiKey, setApiKey] = useState(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch('/public/config.json'); // Adjust the path as needed
                const data = await response.json();
                setApiKey(data);
            } catch (error) {
                console.error('Error fetching configuration:', error);
            }
        };
        fetchConfig();
    }, []);

    const [quizList, setQuizList] = useState([]);
    const [currentQuiz, setCurrentQuiz] = useState({}); // not useful right now. Potentially in the future. 
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [currentResult, setCurrentResult] = useState("");
    const [imageData, setImageData] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [outcomes, setOutcomes] = useState([]);
    const [questions, setQuestions] = useState([]);


    const fetchQuizList = async () => {
        const response = await fetch("http://localhost:8080/quizzes");
        const data = await response.json();
        setQuizList(data);
    }

    const fetchOutcomes = async () => {
        const response = await fetch("http://localhost:8080/quizzes/get-all-outcomes");
        const data = await response.json();
        setOutcomes(data);
    }

    const fetchQuestions = async () => {
        const response = await fetch("http://localhost:8080/quizzes/get-all-questions");
        const data = await response.json();
        setQuestions(data);
    }

    useEffect(() => {
        fetchOutcomes();
        fetchQuestions();
    },[])

    useEffect(() => {
        fetchQuizList();
    }, [activeQuestion])

    const fetchStartQuiz = async (quizId) => {
        const response = await fetch("http://localhost:8080/quizzes/start-new-game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quizId)
        })
        const data = await response.json();
        setActiveQuestion(data);
    };

    

    const handleStartQuiz = (quiz, answer) => {
        const quizId = {
            id: quiz.id
        }
        fetchStartQuiz(quizId);
        setCurrentQuiz(quiz);
        setCurrentResult("");
    }

    const patchNextQuestion = async (answerId) => {
        const quizId = currentQuiz.id;
        const submitAnswerDTO = {
            qNumber: activeQuestion.nextQuestion.questionNumber,
            answerId: answerId
        }
        // console.log(submitAnswerDTO);

        const response = await fetch(`http://localhost:8080/quizzes/${quizId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submitAnswerDTO)
        })
        const data = await response.json();
        // console.log(data);

        if (!data.outcomeDTO) {
            setActiveQuestion(data)
        } else if (data.outcomeDTO) {
            setCurrentResult(data)
            setActiveQuestion(null)
        };
    };

    const findCurrentQuestion = (quiz) => {
        const findQuestion = quiz.allQuestions.find((question) => {
            return quiz.currentQuestion === question.questionNumber;
        });

        const updatedActiveQuestion = {
            nextQuestion: findQuestion,
            outcomeDTO: null
        }
        setActiveQuestion(updatedActiveQuestion);
        setCurrentQuiz(quiz);
        setCurrentResult("");
    }

    const generateImage = async () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization:  `Bearer `, //insert api key
            },
            body: JSON.stringify({
                providers: "openai",
                text: currentResult.outcomeDTO.finalResult,
                resolution: "512x512",
                fallback_providers: "",
            }),
        };
            const response = await fetch("https://api.edenai.run/v2/image/generation", options);
            const data = await response.json();
            console.log(data);
            setImageUrl(data.openai.items[0].image_resource_url);

            console.log("hello from generate image");

            // const response = await fetch("https://dog.ceo/api/breeds/image/random");
            // const data = await response.json();
            // setImageUrl(data.message);
    };

    useEffect(() => {
        if (currentResult) {
            generateImage();
        }
    }, [currentResult]);



    const postQuiz = async (newQuiz) => {
        const response = await fetch("http://localhost:8080/quizzes/add-new-quiz", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newQuiz)
        })
        const savedQuiz = await response.json();
        setQuizList([...quizList, savedQuiz])
    }

    const postQuestion = async (newQuestion) => {
        const response = await fetch("http://localhost:8080/quizzes/add-question-to-quiz", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(newQuestion)
        })
        fetchQuizList();
    }


    const postOutcome = async (newOutcome) => {
        const response = await fetch("http://localhost:8080/quizzes/add-outcome", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(newOutcome)
        })
        fetchQuizList();
        fetchQuestions();
    }

    const postAnswer = async (newAnswer) => {
        const response = await fetch("http://localhost:8080/quizzes/add-answer-to-question", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(newAnswer)
        })
        fetchQuizList();
    }





    const quizRoutes = createBrowserRouter([
        {
            path: "/",
            element: <Template />,
            children: [
                {
                    path: "/",
                    element: <QuizList quizList={quizList} handleStartQuiz={handleStartQuiz} findCurrentQuestion={findCurrentQuestion} />
                },
                {
                    path: "/question",
                    element: <Question activeQuestion={activeQuestion} patchNextQuestion={patchNextQuestion} currentResult={currentResult} imageUrl={imageUrl} />
                },
                {
                    path: "/create-new-quiz",
                    element: <CreateQuizForm 
                    postQuiz={postQuiz} 
                    quizList={quizList} 
                    postQuestion={postQuestion} 
                    postOutcome={postOutcome} 
                    outcomes={outcomes} 
                    questions={questions} 
                    fetchOutcomes={fetchOutcomes} 
                    fetchQuestions={fetchQuestions} 
                    postAnswer={postAnswer}/>
                },
            ]
        }
    ]);

    return (
        <section className="quiz-container">
            <RouterProvider router={quizRoutes} />
        </ section>
    );
}

export default QuizContainer;