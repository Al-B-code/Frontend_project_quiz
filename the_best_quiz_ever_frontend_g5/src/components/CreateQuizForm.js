import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const CreateQuizForm = ({postQuiz}) => {

    const navigate = useNavigate();

const [stateQuiz, setStateQuiz] = useState(
    {
        name: "",
    }
)

const handleFormSubmit = (event) => {
    event.preventDefault();
    postQuiz(stateQuiz);
    setStateQuiz({
        name: ""
    })
    // navigate("/");
}

const handleChange = (event) => {
    let propertyName =event.target.name;

    let copiedQuiz = {...stateQuiz};
    copiedQuiz[propertyName] =event.target.value;
    setStateQuiz(copiedQuiz);
}




    return ( 
        
        <form id="quiz-form" onSubmit={handleFormSubmit}>
            <p>This is the create new quiz page</p>

            <label htmlFor='quiz-form'>Quiz Name</label>
            <input
                id='quiz-name'
                name='name'
                type='text'
                placeholder='enter chocolate name'
                value={stateQuiz.name}
                onChange={handleChange}
            />
        </form>
     );
}
 
export default CreateQuizForm;