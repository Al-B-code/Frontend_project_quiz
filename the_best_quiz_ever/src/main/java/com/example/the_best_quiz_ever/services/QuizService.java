package com.example.the_best_quiz_ever.services;

import com.example.the_best_quiz_ever.model_DTOs.OutcomeDTO;
import com.example.the_best_quiz_ever.model_DTOs.AddNewQuizDTO;
import com.example.the_best_quiz_ever.model_DTOs.AddNewQuestionDTO;
import com.example.the_best_quiz_ever.models.Answer;
import com.example.the_best_quiz_ever.models.Outcome;
import com.example.the_best_quiz_ever.models.Question;
import com.example.the_best_quiz_ever.models.Quiz;
import com.example.the_best_quiz_ever.model_DTOs.Reply;
import com.example.the_best_quiz_ever.repositories.AnswerRepository;
import com.example.the_best_quiz_ever.repositories.OutcomeRepository;
import com.example.the_best_quiz_ever.repositories.QuestionRepository;
import com.example.the_best_quiz_ever.repositories.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuizService {
    @Autowired
    QuizRepository quizRepository;

    @Autowired
    OutcomeRepository outcomeRepository;

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    AnswerRepository answerRepository;

    private ArrayList<Long> selectedOptions = new ArrayList<>();

    public QuizService() {

    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }


    public Reply startQuiz(Long id) {
        Quiz quiz = quizRepository.findById(id).get();
        resetQuiz(quiz);
        Long questionId = quiz.findFirstQuestionID();
        Question q1 = questionRepository.findById(questionId).get();
        Reply reply = new Reply(q1, null);
        return reply;
    }

    public Reply processAnswer(Long answerId, Long qNumber, Long quizId) {

//        Get the quiz id, which brings the first Q
        Quiz quiz = quizRepository.findById(quizId).get();

//        Save the outcome id to selectedOptions ArrayList.
        Answer answer = answerRepository.findById(answerId).get();
        Outcome outcome = answer.getOutcome();
        Question targetQuestion = quiz.findQuestionByNumber(qNumber);
        targetQuestion.setOutcome(outcome);
        questionRepository.save(targetQuestion);


//        increment current question.

        if (/*quiz.getCurrentQuestion()*/ qNumber > quiz.getSize() - 1) {
            Outcome finalOutcome = processOutcome(quiz);
            OutcomeDTO finalResult = new OutcomeDTO(finalOutcome.getOutcome());
            quiz.setCurrentQuestion(1l);
            quizRepository.save(quiz);
            Reply reply = new Reply(null, finalResult);
            return reply;
        }

        quiz.setCurrentQuestion(quiz.getCurrentQuestion() + 1);
        quizRepository.save(quiz);

//        return currentQ = nextQ
        Question nextQ = questionRepository.findByQuestionNumberAndQuizId(quiz.getCurrentQuestion(), quiz.getId());
        return new Reply(nextQ, null);
    }

//    method - tally results and print outcome

    public Outcome processOutcome(Quiz quiz) {

        HashMap<Long, Integer> outcomeCounter = new HashMap<>();
        for (Question question : quiz.getAllQuestions()){
            Long currentId = question.getOutcome().getId();
            if (outcomeCounter.containsKey(currentId)){
                outcomeCounter.replace(currentId, outcomeCounter.get(currentId) + 1);
            } else {
                outcomeCounter.put(currentId, 1);
            }
        }

        resetQuiz(quiz);

        Long winningOutcomeId = Collections.max(outcomeCounter.entrySet(), Map.Entry.comparingByValue()).getKey();

        return outcomeRepository.findById(winningOutcomeId).get();


    }

    private  void resetQuiz(Quiz quiz){
        quiz.setCurrentQuestion(1l);
        for (Question question : quiz.getAllQuestions()){
            question.setOutcome(null);
            questionRepository.save(question);
        }
    }


    public String addNewQuiz(AddNewQuizDTO addNewQuizDTO) {
        String quizName = addNewQuizDTO.getName();
        Long currentQuestionNumber = 1L;
        Quiz quiz = new Quiz(quizName, currentQuestionNumber);
        quizRepository.save(quiz);
        return "Quiz saved";
    }


    public String addNewQuestion(AddNewQuestionDTO addNewQuestionDTO) {
        Quiz quiz = quizRepository.findById(addNewQuestionDTO.getQuizId()).get();
        Long questionNumber = 1L;
        if (!quiz.getAllQuestions().isEmpty()) {
            questionNumber = (long) (quiz.getAllQuestions().size() + 1);
        }


        Question question = new Question(quiz, addNewQuestionDTO.getQuestionText(), questionNumber);
        quizRepository.save(quiz);
        questionRepository.save(question);

        return "question added";
    }


}
