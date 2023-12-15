package com.example.the_best_quiz_ever.model_DTOs;

public class AddNewOutcomeDTO {


    private Long quizId;

    private String outcomeText;


    public AddNewOutcomeDTO(String outcomeText) {
        this.outcomeText = outcomeText;
    }

    public AddNewOutcomeDTO() {
    }

    public String getOutcomeText() {
        return outcomeText;
    }

    public void setOutcomeText(String outcomeText) {
        this.outcomeText = outcomeText;
    }
}
