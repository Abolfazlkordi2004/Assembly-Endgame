import { useState } from "react"
import { languages } from "../src/language.js"
import { clsx } from 'clsx'

export default function App() {

    const languageElement = languages.map((lang) => {
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        return (
            <span style={styles} className="chip" key={lang.name}>{lang.name}</span>
        )
    })

    const [guessedLetters, setGuessedLetters] = useState([])
    const [currentWord, setCurrentWord] = useState("react")
    const letterElements = currentWord.split("").map((letter, index) => {
        return <span className="letter" key={index}>{letter.toUpperCase()}</span>
    })

    function addGuessedLetters(letter) {
        setGuessedLetters(prevletter => prevletter.includes(letter) ? prevletter : [...prevletter, letter])
    }



    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    const alphabetElements = alphabet.split("").map((alph) => {
        const isGuessed = guessedLetters.includes(alph)
        const isCorrect = isGuessed && currentWord.includes(alph)
        const isWrong = isGuessed && !currentWord.includes(alph)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })
        return <button className={className} key={alph} onClick={() => addGuessedLetters(alph)}>{alph.toUpperCase()}</button>
    })





    return (
        <main>
            <header>
                <h1>Assembly:Endgame</h1>
                <p>
                    Guess the world within 8 attempts to keep the programming world safe from Assembly!
                </p>
            </header>
            <section className="game-status">
                <h2>You win!</h2>
                <p>Well done!</p>
            </section>
            <section className="language-chips">
                {languageElement}
            </section>
            <section className="word">
                {letterElements}
            </section>
            <section className="keyboard">
                {alphabetElements}
            </section>
            <button className="new-game">New Game</button>
        </main>
    )
}