import express, { Express } from "express";
import bodyParser from 'body-parser';
import { saveDeck, saveScore, loadDeck, listDecks, listScores } from './routes';

// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.listen(port, () => console.log(`Server listening on ${port}`));

// All the routes 
app.post("/api/saveDeck", saveDeck);
app.post("/api/saveScore", saveScore);
app.get("/api/loadDeck", loadDeck);
app.get("/api/listDecks", listDecks);
app.get("/api/listScores", listScores);