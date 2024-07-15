import React, { Component } from "react";
import "./style.css";

// Props for FlashcardApp, used to pass things down from parent
type FlashcardAppProps = {
  onRenderFlashcards: () => JSX.Element;
  onNew: () => void;
  onRenderScores: () => JSX.Element;
  updateFlashcardDecks: () => void;
  updateScores: () => void;
};


// State for FlashcardApp
type FlashcardAppState = {
};


/** UI for Flashcard app. */
export class FlashcardApp extends Component<FlashcardAppProps, FlashcardAppState> {
  // Constructor for Creater
  constructor(props: FlashcardAppProps) {
    super(props);
  }

  componentDidMount = (): void => {
    this.props.updateFlashcardDecks();
    this.props.updateScores();
  }

  // Renders FlashcardApp element with listing decks and scores 
  render = (): JSX.Element => {
    return <div> 
        <h1>List</h1>
        {this.props.onRenderFlashcards()}<br></br>
        <button onClick={this.doNewButtonClick}>New</button>
        <h1>Scores</h1>
        {this.props.onRenderScores()}
      </div>
  };

  // START PAGE FUNCTIONS
  doNewButtonClick = (): void => {
    this.props.onNew();
  }
}

