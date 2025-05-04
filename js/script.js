'use strict';

document.addEventListener('DOMContentLoaded', function () {
  let state = {
    word: '',
    phonetics: [],
    meanings: [],
  };

  const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
  const form = document.querySelector('.form');
  const input = document.querySelector('#word-input');
  const containerWord = document.querySelector('.results__word');
  const soundBtn = document.querySelector('.results__sound');
  const results = document.querySelector('.results');
  const resultsList = document.querySelector('.results__list');
  const errorContainer = document.querySelector('.error');
  const errorMessage = document.querySelector('.error__message');

  const renderDefinition = (definition) => {
    const example = definition.example ? `<div class="results__item-example">Example: ${definition.example}</div>` : '';
    return `
            <div class="results__item-definition">
              <p class="results__item-definition-text">${definition.definition}</p>
              ${example}
            </div>
    `;
  };

  const getDefinition = (definitions) => {
    return definitions.map((definition) => renderDefinition(definition)).join('');
  };

  const renderItem = (item) => {
    return `
            <div class="results__item">
              <div class="results__item-part">${item.partOfSpeech}</div>
              <div class="results__item-definitions">
              ${getDefinition(item.definitions)}
              </div>
            </div>`;
  };

  const showResults = () => {
    results.style.display = 'block';
    errorContainer.style.display = 'none';
    resultsList.innerHTML = '';
    state.meanings.forEach((item) => (resultsList.innerHTML += renderItem(item)));
  };

  const showError = (error) => {
    errorContainer.style.display = 'block';
    results.style.display = 'none';
    errorMessage.textContent = error.message;
  };

  const insertWord = () => {
    containerWord.textContent = state.word;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.word.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}${state.word}`);
      const data = await response.json();

      if (response.ok && data.length) {
        const item = data[0];

        state = {
          ...state,
          meanings: item.meanings,
          phonetics: item.phonetics,
        };

        insertWord();
        showResults();
      } else {
        showError(data);
      }
    } catch (error) {
      console.log(error);
      return null;
    }

    form.reset();
  };

  const handleInput = (e) => {
    const value = e.target.value;

    state.word = value;
  };

  const handleSound = () => {
    if (state.phonetics.length) {
      const sound = state.phonetics[0];

      if (sound.audio) {
        new Audio(sound.audio).play();
      }
    }
  };

  // Events
  input.addEventListener('input', handleInput);
  form.addEventListener('submit', handleSubmit);
  soundBtn.addEventListener('click', handleSound);
});
