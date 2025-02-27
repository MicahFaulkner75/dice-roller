import { state, setModifier, clearDice, clearResults, addDie } from '../state';
import { parseDiceNotation, rollAllDice, computeTotal } from '../dice-logic';
import { animateDiceIcons, animateResults } from '../animations/dice-animations';
import { updateDisplay } from './display';

export function setupDiceInput() {
  const diceInput = document.getElementById('dice-input');
  diceInput.contentEditable = 'true';
  diceInput.draggable = false;
  
  diceInput.addEventListener('input', () => {});
  diceInput.addEventListener('keydown', handleKeyDown);
  diceInput.addEventListener('blur', () => updateDisplay());
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