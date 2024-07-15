import React, { Component } from "react";
import "./style.css";

// Props for Creater, used to pass things down from parent
type CreaterProps = {
  onSave: ( flashcardName : string, flashcardData : [string, string][] ) => void; 
  onBack: () => void;
  currentDecks: string[] | undefined
};


// State for Creater
type CreaterState = {
  // Current name of the deck
  deckName: string;  // mirror state of name input box

  // Current data of the text box
  deckData: string;

  // Error state
  error: boolean;
  errorMessage: string;
};


/** UI for Creater page. */
export class Creater extends Component<CreaterProps, CreaterState> {
  // Constructor for Creater
  constructor(props: CreaterProps) {
    super(props);

    // Sets original state
    this.state = { deckName: "", deckData : "", error: false, errorMessage: ""};
  }

  // Renders Creater element 
  render = (): JSX.Element => {
    return <div>
        <h1>Create</h1>
        Name: <input type="text" id="name" value={this.state.deckName} onChange={this.doDeckNameChange}></input><br></br>
        Options (one per line, formatted as front|back)<br></br>
        <textarea id="textbox" name="myTextArea" rows={10} cols={50} value={this.state.deckData} onChange={this.doFlashcardDataChange}></textarea><br></br>

        {this.state.error ? 
            <p className="error">{this.state.errorMessage}</p> : <></>
        }

        <button onClick={this.doAddClick}>Add</button>
        <button onClick={this.doBackClick}>Back</button>
      </div>;
  };

  // CREATE PAGE FUNCTIONS
  // Function for add button, check for valid data first before calling save function through props
  doAddClick = (): void => {
    if (this.doValidDataChange(this.state.deckData)) {
        this.props.onSave(this.state.deckName, this.doParseDataClick(this.state.deckData));
    }
  }

  // Function for back button, function through props
  doBackClick = (): void => {
    this.props.onBack();
  }

  // Updates state whenever deck name changes
  doDeckNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      this.setState({deckName: event.target.value});
  }

  // Updates state whenever flashcard data is typed
  doFlashcardDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({deckData: event.target.value});
  }

  // Function that returns a boolean based on if valid data
  doValidDataChange = (data : string) : boolean => {
    // Check that a flashcard deck name has been provided
    if (this.state.deckName === "") {
      this.setState({error: true, errorMessage: "No flashdeck name! Please try again."});
      return false;
    }

    // Error check, if deck name already exists
    if (this.props.currentDecks && this.props.currentDecks.includes(this.state.deckName)) {
      this.setState({error: true, errorMessage: "Flashdeck name already exists! Please try again."});
        return false;
    }

    // Error check, if no lines
    if (data.trim() === "") {
      this.setState({error: true, errorMessage: "Flashcard data is empty! Please try again."});
        return false;
    }

    const lines = data.split('\n');
    // Inv: i < lines.length
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Check that line contains |
      if (line.indexOf('|') === -1) {
        this.setState({error: true, errorMessage: "Line " + (i + 1) + " does not contain |. Please try again."});
        return false;
      }
    }
    this.setState({error: false, errorMessage: ""});
    return true;
  }

  // Parses flashcard data, assumes data is valid, and returns parsed data
  doParseDataClick = (data: string): [string, string][] => {
    const lines = data.split('\n');
    const result: [string, string][] = [];
    // Inv: i < lines.length
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split('|');
      if (parts.length === 2) {
        result.push([parts[0].trim(), parts[1].trim()]);
      }
    }
    return result;
  }
}

