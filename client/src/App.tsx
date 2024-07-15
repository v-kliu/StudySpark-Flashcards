import React, { Component  } from "react";
import { FlashcardApp } from "./FlashcardApp";
import { Creater } from "./Creater";
import { Practier } from "./Practicer";
import { isRecord } from './record';

// Defines all the pages for the app
type Page = {kind: "start"} | {kind: "create"} | {kind: "practice", deckName: string, deckData: [string, string][]};

// State for the App
type AppState = {
  page: Page; // current page of the application
  flashcardDecks: string[] | undefined; // names of the flashcard decks
  scores: string[] | undefined; // scores of the flashcard decks
}

/** Displays the UI of the App application. */
export class App extends Component<{}, AppState> {

  // Constructor of the app
  constructor(props: {}) {
    super(props);
    // Sets the starting state
    this.state = {page: {kind: "start"}, flashcardDecks: undefined, scores: undefined};
  }
  
  // Render function for the whole app
  render = (): JSX.Element => {    
    // If page is on start screen
    if (this.state.page.kind === "start") {
      return <FlashcardApp onRenderFlashcards={this.renderFlashcardDecks} onNew={this.doNewClick} onRenderScores={this.renderScores}
              updateFlashcardDecks={this.doFlashcardDecksChange} updateScores={this.doScoresChange}/>
    // If page is on create page, return creater component 
    } else if (this.state.page.kind === "create") {
      return <Creater onSave={this.doAddClick} onBack={this.doBackClick} currentDecks={this.state.flashcardDecks} />
    // If page is on practice page, return practice component
    } else if (this.state.page.kind === "practice") {
      return <Practier onFinish={this.doFinishClick} 
              deckName={this.state.page.deckName} deckData={this.state.page.deckData} />
    // Else just return an empty div
    } else {
        return <div></div>;
    }
  };

  // START PAGE FUNCTIONS
  doNewClick = (): void => {
    this.setState({page: {kind: "create"}});
  }

  // Renders all flashcard deck names as ul items
  renderFlashcardDecks = (): JSX.Element => {
    if (this.state.flashcardDecks === undefined) {
      return <></>;
    } else {
      const ulDecks : JSX.Element[] = [];
      // Inv: i < this.state.flashcardDecks.length
      for (let i = 0; i < this.state.flashcardDecks.length; i++) {
        const deck = this.state.flashcardDecks[i];
        ulDecks.push(
          <li key={ i }><a href="#" onClick={() => this.doLoadDeckClick(deck)}>{deck}</a></li>
        )
      }
      return <div>{ulDecks}</div>;
    }
  };

  // Fetches the flashcard deck names by calling listDecks
  doFlashcardDecksChange = (): void => {
    fetch("/api/listDecks")
      .then(this.doFlashcardDecksResp)
      .catch(() => this.doError("error fetching flashcard decks"));
  }

  // Handles listDecks reponse
  doFlashcardDecksResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doFlashcardDecksJson)
         .catch(() => this.doError("200 response when fetching is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(() => this.doError("400 response when fetching is text"))
         .catch(() => this.doError("400 response when fetching is not text"));
    } else {
      this.doError(`bad status code ${res.status}`);
    }
  }

  // Handles the correct path for listDecks, has error checking before seting state
  doFlashcardDecksJson = (val: unknown): void => {
    if (!isRecord(val)) {
      console.log("fetch request is json but not record");
      return;
    } else if (!Array.isArray(val.flashcardDeckNames)) {
      console.log("fetch request.fileNames is not an array");
      return;
    }

    const deckNames : string[] = [];

    // Inv: i < val.flashcardDeckNames.length
    for (let i = 0; i < val.flashcardDeckNames.length; i++) {
      const deckName = val.flashcardDeckNames[i];
      if (typeof deckName !== "string") {
        console.log("fetch request returned a non-string");
        return;
      } else {
        deckNames.push(deckName);
      }
    }

    if (deckNames.length !== 0) {
      this.setState({flashcardDecks: deckNames });      
    }
  }

  // Renders all scores as ul items
  renderScores = (): JSX.Element => {
    if (this.state.scores === undefined) {
      return <></>;
    } else {
      const ulScores : JSX.Element[] = [];
      // Inv: i < this.state.scores.length
      for (let i = 0; i < this.state.scores.length; i++) {
        const scoreEntry = this.state.scores[i];
        ulScores.push(
          <li key={ i }>{scoreEntry}</li>
        )
      }
      return <div>{ulScores}</div>;
    }
  };

  // Fetches the scores by calling listScores
  doScoresChange = (): void => {
    fetch("/api/listScores")
      .then(this.doScoresResp)
      .catch(() => this.doError("error fetching flashcard scores"));
  }

  // Handles the reponses for listScores
  doScoresResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doScoresJson)
         .catch(() => this.doError("200 response when fetching is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(() => this.doError("400 response when fetching is text"))
         .catch(() => this.doError("400 response when fetching is not text"));
    } else {
      this.doError(`bad status code ${res.status}`);
    }
  }

  // Handles the correct path for listScores
  doScoresJson = (val: unknown): void => {
    if (!isRecord(val)) {
      console.log("fetch request is json but not record");
      return;
    } else if (!Array.isArray(val.scores)) {
      console.log("fetch request.fileNames is not an array");
      return;
    }

    const scoreStrings : string[] = [];

    // Inv: i < val.scores.length
    for (let i = 0; i < val.scores.length; i++) {
      const scoreEntry = val.scores[i];
      if (!Array.isArray(scoreEntry)) {
        console.log("Score entry is not an array");
        return;
      }
      if (typeof scoreEntry[0] !== "string" || typeof scoreEntry[1] !== "string" || typeof scoreEntry[2] !== "number") {
        console.log("Score entry does not match expected format");
        return;
      }

      scoreStrings.push(scoreEntry[0] + "," + scoreEntry[1] + ": " + scoreEntry[2] + "%");
    }

    if (scoreStrings.length !== 0) {
      this.setState({scores: scoreStrings });      
    }
  }

  // Function that is called when any list deck is clicked, loads deckName into url and fetches loadDeck
  doLoadDeckClick = (deckName : string): void => {
    const url : string = "/api/loadDeck?" + "deckName=" + encodeURIComponent(deckName);
    console.log("deckName is" + deckName + " url is " + url);
    fetch(url)
      .then(this.doLoadDeckResp)
      .catch(() => this.doError("error loading deckNames"));
  }
  
  // Function for loadDeck response
  doLoadDeckResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doLoadDeckJson)
         .catch(() => this.doError("200 response when loading is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(() => this.doError("400 response when loading is text"))
         .catch(() => this.doError("400 response when loading is not text"));
    } else {
      this.doError(`bad status code ${res.status}`);
    }
  }

  // Function for correct path of loadDeck, does error checking before setting state
  doLoadDeckJson = (val: unknown): void => {
    if (!isRecord(val)) {
      console.log("load request is json but not record");
      return;
    } 
    if (typeof val.deckName !== "string") {
      console.log("load request is json but name is not string" + typeof val.deckName);
      return;
    }

    if (!Array.isArray(val.value)) {
      console.log("load request is json but value is not an array");
      return;
    }
  
    for (const deck of val.value) {
      if (!Array.isArray(deck) || deck.length !== 2 || typeof deck[0] !== "string" || typeof deck[1] !== "string") {
        console.log("load request is json but value is not an array of [string, string][]");
        return;
      }
    }

    this.setState({page: {kind: "practice", deckName: val.deckName, deckData: val.value}});
  }

  // CREATE PAGE FUNCTIONS
  // Fetches saveDeck, is passed as a prop to Creater.tsx
  doAddClick = ( flashcardName : string, flashcardData : [string, string][] ): void => {
    fetch("/api/saveDeck", {
      method: "POST",
      body: JSON.stringify({name: flashcardName, value: flashcardData}), 
      headers: {"Content-Type": "application/json"}
    }).then(this.doAddResp)
    .catch(() => this.doError("failed to connect to server"));
    this.setState({page: {kind: "start"}});
  }

  // Handles the response of saveDeck
  doAddResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(() => this.doError("200 response is JSON"))
          .catch(() => this.doError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(() => this.doError("400 response is text"))
          .catch(() => this.doError("400 response is not text"));
    } else {
      this.doError(`bad status code from /api/save (not 200 or 400): ${resp.status}`);
    }
  }

  // Handles the back click button
  doBackClick = (): void => {
    this.setState({page: {kind: "start"}});
  }

  // PRATICE PAGE FUNCTIONS
  // Fetches saveScore, is passed as prop to Practicer.tsx
  doFinishClick = ( username : string, deckName : string, percentage : number ): void => {
    fetch("/api/saveScore", {
      method: "POST",
      body: JSON.stringify({name: username, deckName: deckName, percentage: percentage}), 
      headers: {"Content-Type": "application/json"}
    }).then(this.doAddResp)
    .catch(() => this.doError("failed to connect to server"));
    this.setState({page: {kind: "start"}});
  }

  // Handles the reponse of saveScore
  doFinishResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(() => this.doError("200 response is JSON"))
          .catch(() => this.doError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(() => this.doError("400 response is text"))
          .catch(() => this.doError("400 response is not text"));
    } else {
      this.doError(`bad status code from /api/save (not 200 or 400): ${resp.status}`);
    }
  }

  // MISC FUNCTIONS
  // Used to log any error
  doError = (msg: string): void => {
    console.log(msg);
  };
}