import React, { Component } from 'react';
import './App.css';
import { useState, useEffect, useRef} from 'react';
import QuestionAnswerSection from './src/answers.js';
import { GenerateMoreOptions } from './src/answers.js';

// entire data will live in App js (create a list of questions and answers here)
// use effect > grab the data from clue site
// data gets stored in a state variable (like in quiz game)
function App() {
    const [qaList, setQAList] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const resultDialog = useRef(null);
    const [numCorrect, setNumCorrect] = useState(0);
    const [numIncorrect, setNumIncorrect] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [score, setScore] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [start, setStart] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(prevIsVisible => !prevIsVisible); // Toggle visibility state
    };

    const showResults = () => {
        setIsVisible(true);
    }

    const nextButtonStyle = {
        backgroundColor: '#FFEEB5',
        border: '2px solid black', // 5px wide border
        color: 'black',
        padding: '10px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '5px', // 10px of space between each button
        borderRadius: '20px', // Optional: Rounded corners
    };

    const TitleScreen = ({ onStart }) => {
        return (
            <div className="title-screen">
                {/* <h1>Welcome to My App</h1> */}
                <button style={nextButtonStyle} onClick={onStart}>Start</button>
            </div>
        );
    };

    const handleStart = () => {
        setStart(true);
    };


    // const [toggle, setToggle] = useState(false); 

    const fetchQAList = () => {
        fetch('https://cors-anywhere.herokuapp.com/http://cluebase.lukelav.in/clues/random?limit=5&order_by=category&sort=desc')
            .then(response => response.json())
            .then(responseJSON => {
                setQAList(responseJSON.data)
                // console.log(qaList)
                // {qaList && console.log("first qa data:", qaList[0])}
                // console.log("first qa data:", qaList[0])
            });
        };

    useEffect(() => {
        fetchQAList();
    }, []);

    // next button
    const handleClick = () => {
        fetchQAList();
        const newQuestion = currentQuestion+1;
        setCurrentQuestion(newQuestion);
        if (newQuestion > 5) {
            showResults();
        }
        else {
            GenerateMoreOptions();
        }
        enableButton();
    }
    
    return (
    <>
       <div>
            {!start ? <TitleScreen onStart={handleStart} /> : <div className="container">
            <div className="quizTitle">
                <h1>Quizzerooni</h1>
            </div>
            <div className="quizInfo">
                {/* Quiz section */}
                <h4>Question: {currentQuestion}</h4>
                {qaList.length > 0 && (
                    <h4>Value: {qaList[0].value}</h4>
                )}
            </div>
            <div className="qaSection">
                {/* pass 1 q/a data at a time inside questionanswersection as props */}
                {qaList.length > 0 && 
                <QuestionAnswerSection
                    clue={qaList[0].clue}
                    category={qaList[0].category}
                    response={qaList[0].response}
                    value={qaList[0].value}
                    wrongAnswers={wrongAnswers}
                    setWrongAnswers={setWrongAnswers} // Pass the setter function
                    numCorrect={numCorrect}
                    setNumCorrect={setNumCorrect}
                    numIncorrect={numIncorrect}
                    setNumIncorrect={setNumIncorrect}
                    score={score} // Pass score as a prop
                    setScore={setScore} // Pass the setter function for score
                    // enableButton={isButtonDisabled}
                />}
            </div>
            <div className="nextButton">
                <button style={nextButtonStyle} onClick={handleClick}>
                    Next
                </button>
            </div>
            <div id="resultDialog" ref={resultDialog} style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
                <h6>Thanks for playing!</h6>
                <p>Total Score: {score}</p>
                <p>Questions Correct: {numCorrect}</p>
                <p>Questions Incorrect: {numIncorrect}</p>
                <button onClick={toggleVisibility}>
                    Play Again
                </button>
             </div>
        </div>}
       </div>
       
    
    
    
    
    
    </>
  );
}



export default App;