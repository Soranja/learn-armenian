import React, { ChangeEvent, useEffect, useState } from "react";
import "./Vocabulary.css";
import axios from "axios";
import Loader from "../../components/loader/Loader";
import { wordlist } from "../../types/vocabulary";

function Vocabulary() {
  const [vocabTranslate, setVocabTranslate] = useState("");
  const [vocabInput, setVocabInput] = useState("");
  const [isLoader, setLoader] = useState(false);
  const [isError, setError] = useState(false);
  const [wordlist, setWordlist] = useState<wordlist>([]);

  const AUTH = process.env.REACT_APP_AUTH;
  const PROJECT = process.env.REACT_APP_PROJECT;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 10) {
      setError(true);
      return;
    }
    setError(false);
    setVocabInput(e.target.value);
  };

  const updateWordlist = (updatedWordlist: wordlist) => {
    localStorage.setItem("wordlist", JSON.stringify(updatedWordlist));
    setWordlist(updatedWordlist);
  };

  useEffect(() => {
    const locStorWordlist = JSON.parse(
      localStorage.getItem("wordlist") || "[]"
    );

    setWordlist(locStorWordlist);
  }, []);

  const handleClick = () => {
    const translatedVocab = async () => {
      setLoader(true);
      await axios
        .post(
          "https://translation.googleapis.com/language/translate/v2",
          JSON.stringify({ q: `${vocabInput}`, source: "en", target: "hy" }),
          {
            headers: {
              Authorization: `${AUTH}`,
              "x-goog-user-project": `${PROJECT}`,
              "Content-Type": "application/json; charset=utf-8",

              //gcloud auth application-default print-access-token
            },
          }
        )
        .then((response) => {
          const translation = response.data.data.translations[0].translatedText;
          setVocabTranslate(translation);
          const updatedWordList = [
            { word: vocabInput, translation },
            ...wordlist,
          ];
          setWordlist(updatedWordList);
          updateWordlist(updatedWordList);
        })
        .catch((err) => console.error(`${err} 😯`))
        .finally(() => {
          setLoader(false);
        });
    };
    translatedVocab();
  };

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleClick();
        setVocabInput("");
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [vocabInput]);

  const removeWord = (word: string) => {
    updateWordlist(wordlist.filter((curWord) => curWord.word !== word));
  };

  const removeWordlist = () => {
    updateWordlist([]);
  };

  return (
    <div className="Vocabulary">
      <div className="vocabInput">
        <input
          className="vocabSearch"
          type="text"
          placeholder="Translate a word / phrase"
          value={vocabInput}
          onChange={handleChange}
        />

        <button className="btn-translate" onClick={handleClick}>
          Translate!
        </button>
        <p className="msg-validation" style={{ opacity: isError ? 1 : 0 }}>
          {isError && `10 SYMBOLS MAX`}
        </p>
      </div>
      <p className="hy-translation">Translation: {vocabTranslate}</p>
      {isLoader && <Loader />}

      <div>
        <h3 className="wordlist-title">Your wordlist:</h3>
        <ul className="wordlist">
          {wordlist.map((translationData) => {
            return (
              <li key={translationData.word}>
                {`${translationData.word} - ${translationData.translation}`}
                <button onClick={() => removeWord(translationData.word)}>
                  x
                </button>
              </li>
            );
          })}
        </ul>
        <button
          className="removeWordlist"
          onClick={removeWordlist}
          style={{ opacity: wordlist.length >= 1 ? 1 : 0 }}
        >
          {wordlist.length >= 1 ? `CLEAR THE LIST` : ``}
        </button>
      </div>
    </div>
  );
}

export default Vocabulary;
