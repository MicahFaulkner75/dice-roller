import { setupDiceInput, setupDiceButtons, updateDisplay, animateResults } from './ui-updates';
import { state, setModifier, clearDice, clearResults, addDie } from './state';
import { parseDiceNotation, rollAllDice, computeTotal } from './dice-logic';
import { animateDiceIcons } from './animations/dice-animations';

export function setupEventListeners() {
  // Add event listeners for dice input, buttons, etc.
  const diceInput = document.getElementById('dice-input');
  diceInput.addEventListener('keydown', handleKeyDown);

  const clearButton = document.getElementById('clear-button');
  clearButton.addEventListener('click', () => {
    clearDice();
    clearResults();
    setModifier(0);
    updateDisplay();
  });

  const rollButton = document.getElementById('roll-button');
  rollButton.addEventListener('click', () => {
    rollAllDice();
    const durationMs = animateDiceIcons(state.currentRolls);
    animateResults(state.currentRolls, computeTotal(), durationMs);
    updateDisplay();
  });

  const increaseButton = document.getElementById('modify-button-increase');
  increaseButton.addEventListener('click', () => {
    setModifier(state.modifier + 1);
    updateDisplay();
  });

  const decreaseButton = document.getElementById('modify-button-decrease');
  decreaseButton.addEventListener('click', () => {
    setModifier(state.modifier - 1);
    updateDisplay();
  });
   // Add this new code for the X button
   const closeButton = document.getElementById('close-applet');
   if (closeButton) {
     closeButton.addEventListener('click', () => {
       const applet = document.getElementById('dice-applet');
       if (applet) {
         applet.style.display = 'none';
       }
     });
   }
   
   // Add this new code for clicking outside to close
   document.addEventListener('click', (e) => {
     const applet = document.getElementById('dice-applet');
     const launchButton = document.getElementById('dice-roller-button');
     
     // Only process if applet is visible
     if (applet && applet.style.display !== 'none') {
       // Check if click is outside applet and not on launch button
       if (!applet.contains(e.target) && !launchButton.contains(e.target)) {
         applet.style.display = 'none';
       }
     }
   });
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