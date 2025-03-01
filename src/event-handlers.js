import { setupDiceInput, setupDiceButtons, updateDisplay, animateResults } from './ui-updates';
import { state, setModifier, clearDice, clearResults, addDie } from './state';
import { parseDiceNotation, rollAllDice, computeTotal } from './dice-logic';
import { animateDiceIcons } from './animations/dice-animations';

export function setupEventListeners() {
  console.log('Setting up event listeners');

  // Add event listeners for dice input, buttons, etc.
  const diceInput = document.getElementById('dice-input');
  diceInput.addEventListener('keydown', handleKeyDown);
  console.log('Added keydown event listener to dice input');

  const clearButton = document.getElementById('clear-button');
  clearButton.addEventListener('click', () => {
    console.log('Clear button clicked');
    clearDice();
    clearResults();
    setModifier(0);
    updateDisplay();
  });
  console.log('Added click event listener to clear button');

  const rollButton = document.getElementById('roll-button');
  rollButton.addEventListener('click', () => {
    console.log('Roll button clicked');
    rollAllDice();
    const durationMs = animateDiceIcons(state.currentRolls);
    animateResults(state.currentRolls, computeTotal(), durationMs);
    updateDisplay();
  });
  console.log('Added click event listener to roll button');

  const increaseButton = document.getElementById('modify-button-increase');
  increaseButton.addEventListener('click', () => {
    console.log('Increase button clicked');
    setModifier(state.modifier + 1);
    updateDisplay();
  });
  console.log('Added click event listener to increase button');

  const decreaseButton = document.getElementById('modify-button-decrease');
  decreaseButton.addEventListener('click', () => {
    console.log('Decrease button clicked');
    setModifier(state.modifier - 1);
    updateDisplay();
  });
  console.log('Added click event listener to decrease button');

  // Add event listener for closing the applet
  const closeButton = document.getElementById('close-applet');
  closeButton.addEventListener('click', () => {
    console.log('Close button clicked');
    document.getElementById('dice-applet').style.display = 'none';
  });
  console.log('Added click event listener to close button');

  // Add event listener for clicking outside the applet
  document.addEventListener('click', (event) => {
    const applet = document.getElementById('dice-applet');
    if (!applet.contains(event.target) && event.target.id !== 'dice-roller-button') {
      console.log('Clicked outside the applet');
      applet.style.display = 'none';
    }
  });
  console.log('Added click event listener for clicking outside the applet');

  // Add event listener for pressing ESC key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      console.log('ESC key pressed');
      document.getElementById('dice-applet').style.display = 'none';
    }
  });
  console.log('Added keydown event listener for ESC key');
}

function handleKeyDown(e) {
  if (e.key !== 'Enter') return;

  e.preventDefault();
  const input = e.target.textContent.trim();
  if (!input) {
    clearDice();
    clearResults();
    setModifier(0);
    updateDisplay();
    return;
  }

  const parsed = parseDiceNotation(input);
  if (parsed) {
    processValidInput(parsed);
  }
}

function processValidInput(parsed) {
  clearDice();
  parsed.dice.forEach(die => addDie(die));
  setModifier(parsed.modifier);
  rollAllDice();

  const durationMs = animateDiceIcons(parsed.dice);
  animateResults(state.currentRolls, computeTotal(), durationMs);
  updateDisplay();
}