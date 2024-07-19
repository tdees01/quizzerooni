import React, { useState, useEffect, useRef } from 'react';
import Button from 'react';

const getClueUrl = "https://cors-anywhere.herokuapp.com/http://cluebase.lukelav.in/clues?limit=100&order_by=category&sort=desc";
const getAiClueAnswersUrl = "https://cors-anywhere.herokuapp.com/https://caas.api.godaddy.com/v1/prompts?effort=default";


const QuestionAnswerSection = (props) => {
    
    // props => props.id, props.value, props.category, props.clue, props.response
    
    const [clue, setClue] = useState(null);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    // let correctAnswer = props.response;
    const [allAnswers, setAllAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const popDialog = useRef(null);
    const [isButtonDisabled, setButtonDisabled] = useState(props.enableButton);
    const [score, setScore] = useState(0);
 
    const disableButton = () => {
        setButtonDisabled(true);
    };
 
    const enableButton = () => {
        setButtonDisabled(false);
    };
   
    const toggleVisibility = () => {
        setIsVisible(prevIsVisible => !prevIsVisible); // Toggle visibility state
        enableButton();
      };
    
    const showPopup = () => {
        setIsVisible(true); // Set visibility to true to show the popup
    };

    
    const onAnswerSelected = (answer) => {
        if (answer === props.response) {
          setSelectedAnswer(true);
          setUserAnswer(" correct!")
        //   console.log('correct');
          showPopup();
          const theScore = (props.score + props.value)
          props.setScore(theScore);
          const numCorrect = props.numCorrect + 1;
          props.setNumCorrect(numCorrect);

        } else {
          setSelectedAnswer(false)
          setUserAnswer(" incorrect!")
        //   console.log('incorrect')
          showPopup();
          const theScore = (props.score - props.value);
          props.setScore(theScore);
          const numIncorrect = props.numIncorrect + 1;
          props.setNumIncorrect(numIncorrect);
        }
    }
    
    useEffect(() => {
        GenerateMoreOptions(props);
    }, [props.clue, props.category, props.response]);

    // console.log("Value is", props.value);
    // console.log(typeof(props.value));

    //generatemoreoptions was here
    const GenerateMoreOptions = (props) => {

        // console.log(props);
        // console.log("clue:", props.clue);
        // setClue(props.clue);
    
        fetch(getAiClueAnswersUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': 'sso-jwt eyJhbGciOiAiUlMyNTYiLCAia2lkIjogImItdkRhMUsxVGcifQ.eyJhdXRoIjogImJhc2ljIiwgImZ0YyI6IDIsICJpYXQiOiAxNzIxMzQ0MDg4LCAianRpIjogIjNqa0hsWkxjaTl0Vm5fYVpxTVZ4YmciLCAidHlwIjogImpvbWF4IiwgInZhdCI6IDE3MjEzNDQwODgsICJmYWN0b3JzIjogeyJrX2ZlZCI6IDE3MjEzNDQwODgsICJwX29rdGEiOiAxNzIxMzQ0MDg4fSwgImN0eCI6ICIiLCAiYWNjb3VudE5hbWUiOiAidGRlZXMiLCAic3ViIjogIjQzODAzMSIsICJ1dHlwIjogMTAxLCAiZ3JvdXBzIjogW119.KZOTP7KEbltHgCc2vFMP1b9tJgbAK6OVCXZSsNV7WY6h6xn2G47FNndat0I0TXzFuMebcol0smsArwSRD7sVdl7KFqsRKJ9TlFlGT542T8402AaaNBVl33DU2XZxH0El5vhN-uDgmDvKcxIrmrru87JVwufS1cnZpDJ03Lsrc-0dvE1RNyvEX_J9iy2gyu7O02qokU4NVKaEHJUP7oGoW3Y-GRHACHZVuvGjuA9rHTJDejWCmDthAByCHodl3C0aef5xBw8Ba2H01153nLqLkKaYkABJOBnryd94YJN3vIg8bJBAPan1ZalgA5bJj1Z6ajmGbBLGSnQwEzGtp4wXZA',
            },
            body: JSON.stringify({
                prompt: `Generate me three wrong answer options for a jeopardy game, where the category is ${props.category}, the question is ${props.clue}, and the correct answer is ${props.response}. Please format your response without the what is or who is or where is, without numbering them, and as an array with three elements`,
                provider: 'openai_chat',
                providerOptions: {
                    model: 'gpt-3.5-turbo'
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            // console.log(typeof(data.data.value));
            // console.log(data.data.value.split(', '));
            // setWrongAnswers(data.data.value);
            const editedAnswers = data.data.value
                .replace(/[\[\]]/g, '') // Remove square brackets
                .split(', ') // Split by comma and space
                .map(answer => answer.trim().replace(/^"|"$/g, ''));
            // console.log(editedAnswers);
            // console.log(typeof(editedAnswers));
            props.setWrongAnswers(editedAnswers);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    useEffect(() => {
        if (props.wrongAnswers.length >= 3 && props.response) {
          const combinedAnswers = [props.wrongAnswers[0], props.wrongAnswers[1], props.wrongAnswers[2], props.response];
          const shuffledAnswers = combinedAnswers.sort(() => Math.random() - 0.5);
          setAllAnswers(shuffledAnswers);
        }
    }, [props.wrongAnswers, props.response]);

    const buttonStyle = {
        backgroundColor: 'white',
        border: '2px solid black', // 5px wide border
        color: 'black',
        padding: '10px 10px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '14px',
        margin: '5px', // 10px of space between each button
        borderRadius: '20px', // Optional: Rounded corners
      };

      const categoryStyle = {
        height: '35px',
        width: '250px', 
        paddingLeft: '18px', 
        paddingRight: '25px',
        marginLeft: '10px', 
        marginTop: '5px',
        marginBottom: '5px',
        paddingTop: '15px',
        fontSize: '16px',
      };

      const scoreStyle = {
        textAlign: 'center',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        margin: '0px',
        padding: '15px',
        fontSize: '20px',
      };


    return (
        <div>
            <div className="scoreSection">
                <h4 style={scoreStyle}>Score: {props.score}</h4>
            </div>
            <div className="category">
                <h4 className="categoryTitle" style={categoryStyle}>Category: {props.category}</h4>
            </div>
            <div className="askClue">
                <h2>Clue: {props.clue}</h2>
            </div>
            <div className="answerSection">
                {allAnswers.map((answer, index) => (
                    <button style={buttonStyle} onClick={() => {
                        onAnswerSelected(answer, index)
                        disableButton();

                    }}
                        key={index} disabled={isButtonDisabled}>{answer}</button>
                ))}
            </div> 
            <div id="popupDialog" ref={popDialog} style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
                <p>Your answer was: {userAnswer}</p>
                <button onClick={toggleVisibility}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default QuestionAnswerSection;








