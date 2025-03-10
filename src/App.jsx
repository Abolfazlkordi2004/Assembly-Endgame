import { useState } from "react";
import { languages } from "../src/language.js";
import { clsx } from "clsx";
import { getFarewellText, getRandomWord } from "./utils.js";

export default function App() {
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState("react");

  const numGuessesleft = languages.length - 1;
  const wrongGuessedArray = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessedArray >= numGuessesleft;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetters(letter) {
    setGuessedLetters((prevletter) =>
      prevletter.includes(letter) ? prevletter : [...prevletter, letter]
    );
  }

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }

  const languageElement = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessedArray;
    const className = clsx("chip", isLanguageLost && "lost");
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    return (
      <span style={styles} className={className} key={lang.name}>
        {lang.name}
      </span>
    );
  });

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
        isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return (
        <span key={index} className={letterClassName}>
            {shouldRevealLetter ? letter.toUpperCase() : ""}
        </span>
    )
})

  const alphabetElements = alphabet.split("").map((alph) => {
    const isGuessed = guessedLetters.includes(alph);
    const isCorrect = isGuessed && currentWord.includes(alph);
    const isWrong = isGuessed && !currentWord.includes(alph);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });
    return (
      <button
        className={className}
        key={alph}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(alph)}
        aria-label={`Letter ${alph}`}
        onClick={() => addGuessedLetters(alph)}
      >
        {alph.toUpperCase()}
      </button>
    );
  });

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });

  function gameStatusRender() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessedArray - 1].name)}
        </p>
      );
    }
    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done!</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>you first learn Assembly first</p>
        </>
      );
    }
    return null;
  }

  return (
    <main>
      <header>
        <h1>Assembly:Endgame</h1>
        <p>
          Guess the world within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className={gameStatusClass} aria-live="polite" role="status">
        {gameStatusRender()}
      </section>
      <section className="language-chips">{languageElement}</section>
      <section className="word">{letterElements}</section>
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is in the word`
            : `Sorry,the letter ${lastGuessedLetter} is not in the word`}
          you have {languages.length - 1} attempts left
        </p>
        <p>
          Current word:
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join("")}
        </p>
      </section>
      <section className="keyboard">{alphabetElements}</section>
      {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    </main>
  );
}
