import React, { Component, ChangeEvent, MouseEvent } from "react";
import "./style.css";

// Props for Practicer component
type PracticerProps = {
  onFinish: ( username : string, deckName : string, percentage : number ) => void; 
  deckName: string;
  deckData: [string, string][];
};

// State for Practice component
type PracticerState = {
  // Current name of the deck
  deckName: string;  // mirror state of name input box
  // Current data of the text box
  deckData: [string, string][];
  // Username
  username: string;

  // Deck stats
  correct: number;
  incorrect: number;

  // Display boolean
  practicing: boolean;
  front: boolean;

  // Error state
  error: boolean;
  errorMessage: string;
};


/** UI for practice page. */
export class Practier extends Component<PracticerProps, PracticerState> {
  // Constructor for Practicer
  constructor(props: PracticerProps) {
    super(props);
    // Sets initial state for Practicer
    this.state = { deckName: this.props.deckName, deckData : this.props.deckData, username: "", 
                   correct: 0, incorrect: 0, practicing: true, front: true, error: false, errorMessage: "" };
  }

  // Renders actual component
  render = (): JSX.Element => {
    return <div>
        <h1>{this.state.deckName}</h1>
        {this.state.practicing ? 
          <div>
          <h3>Correct: {this.state.correct} | Incorrect: {this.state.incorrect}</h3><br></br>
          <textarea id="flashcard" name="myTextArea" 
          value={this.state.front ? this.state.deckData[this.state.correct + this.state.incorrect][0] 
               : this.state.deckData[this.state.correct + this.state.incorrect][1]}  readOnly></textarea><br></br>
          <button onClick={this.doFlipClick}>Flip</button>
          <button onClick={this.doCorrectClick}>Correct</button>
          <button onClick={this.doIncorrectClick}>Incorrect</button>
          <button onClick={this.doResetClick}>Reset</button>
          </div>
          : 
          <div>
          <h2>Correct: {this.state.correct} | Incorrect: {this.state.incorrect}</h2><br></br>
          <p>End of Quiz</p><br></br>
          Name: <input type="text" id="name" value={this.state.username} onChange={this.doUsernameChange}></input>
          <button onClick={this.doFinishClick}>Finish</button><br></br>
          {this.state.error ? 
            <p className="error">{this.state.errorMessage}</p> : <></>
          }
          </div>
        }
      </div>;
  };

  // PRACTICE PAGE FUNCTIONS
  // Updates state whenever flip is clicked, just inverses boolean (eventually used as ternary operator)
  doFlipClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState({front: !this.state.front});
  }

  // Updates state whenever correct button is clicked
  doCorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState({correct: this.state.correct + 1, practicing: this.state.correct + this.state.incorrect + 1 !== this.state.deckData.length, front: true});
  }

  // Updates state wheenver incorrect button is clicked
  doIncorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState({incorrect: this.state.incorrect + 1, practicing: this.state.correct + this.state.incorrect + 1 !== this.state.deckData.length, front: true});
  }

  // Extra functionality, resets progress with flashcards
  doResetClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState({correct: 0, incorrect: 0, practicing: true, front: true});
  }

  // Updates state whenever, practice is completed and username is being typed
  doUsernameChange = (event: ChangeEvent<HTMLInputElement>): void => {
      this.setState({username: event.target.value});
  }

  // Called when finish button is clicked, error checks and saves score for quiz
  doFinishClick = (): void => {
    if (this.state.username === "") {
      this.setState({error: true, errorMessage: "No username provided! Please try again."});
      return;
    }
    this.setState({error: false, errorMessage: ""});
    this.props.onFinish(this.state.username, this.state.deckName, 
      Math.round(this.state.correct / (this.state.correct + this.state.incorrect) * 100));
  }
}