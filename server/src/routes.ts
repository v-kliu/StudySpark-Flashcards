import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Data structures for flashcards and the scores
const flashcards : Map<string, unknown> = new Map<string, unknown>();
const scores: Array<[string, string, number]> = new Array<[string, string, number]>();

/** Handles request for /save by storing the given flashcard deck. */
export const saveDeck = (req: SafeRequest, res: SafeResponse): void => {
  // Gives the flashcard deck name inside the map
  const name = req.body.name;
  // Error checking for undefined and not string
  if (name === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  } else if (typeof name !== 'string') {
    res.status(400).send('required argument "name" was not a string');
    return;
  }

  // Gives the actual flashcards of a deck
  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('required argument "value" was missing');
    return;
  }

  // Checks that the name is not already in flashcards
  if (flashcards.has(name)) {
    res.status(400).send('name already in use');
    return;
  } 

  // Saves deck and returns record
  res.send({ name: name, value: value }); 
  flashcards.set(name, value);
}

/** Handles request for /save by storing the given score. */
export const saveScore = (req: SafeRequest, res: SafeResponse): void => {
  // Gives the name of the user inside the map
  const name = req.body.name;
  // Error checking for undefined and not string (username)
  if (name === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  } else if (typeof name !== 'string') {
    res.status(400).send('required argument "name" was not a string');
    return;
  }

  // Gives the flashcard deck name inside the map
  const flashcardDeckName = req.body.deckName;
  // Error checking for undefined and not string (deck name)
  if (flashcardDeckName === undefined) {
    res.status(400).send('required argument "deckName" was missing');
    return;
  } else if (typeof flashcardDeckName !== 'string') {
    res.status(400).send('required argument "deckName" was not a string');
    return;
  }

  // Gives the actual flashcards of a deck
  const percentage = req.body.percentage;
  // Error checking for undefined and not number
  if (percentage === undefined) {
    res.status(400).send('required argument "percentage" was missing');
    return;
  } else if (typeof percentage !== 'number') {
    res.status(400).send('required argument "percentage" was not a number');
    return;
  } 

  // Saves score and returns record
  res.send({ name : name, deckName: flashcardDeckName, percentage: percentage }); 
  scores.push([name, flashcardDeckName, percentage]);
}

/** Handles request for /load by returning the file requested. */
export const loadDeck = (req: SafeRequest, res: SafeResponse): void => {
  // Gets the deck name from query parameter
  const deckName = first(req.query.deckName);
  // Error checking for undefined/missing, and not valid deckname
  if (deckName === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  } else if (flashcards.has(deckName) === false) {
    res.status(404).send('no file by that name was found');
    return;
  }

  // Returns record
  res.send({deckName: deckName, value: flashcards.get(deckName)});
}

/** Handles request for /list by returning the deck requested. */
export const listDecks = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({ flashcardDeckNames: Array.from(flashcards.keys()) });
}

/** Handles request for /list by returning the scores requested. */
export const listScores = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({ scores: scores });
}

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};

/** Testing function to remove all the added auctions. */
export const resetForTesting = (): void => {
  flashcards.clear();
  scores.splice(0, scores.length);
};
