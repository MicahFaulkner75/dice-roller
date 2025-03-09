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
   let mouseDownTarget = null;
   let mouseDownTime = 0;
   const CLICK_THRESHOLD_MS = 300; // Threshold for what counts as a "quick click"

   document.addEventListener('mousedown', (e) => {
     mouseDownTarget = e.target;
     mouseDownTime = Date.now();
   });

   document.addEventListener('click', (e) => {
     const applet = document.getElementById('dice-applet');
     const launchButton = document.getElementById('dice-roller-button');
     const diceInput = document.getElementById('dice-input');
     
     // Only process if applet is visible
     if (applet && applet.style.display !== 'none') {
       // Check if this was a quick click (not a text selection)
       const isQuickClick = Date.now() - mouseDownTime < CLICK_THRESHOLD_MS;
       
       // Don't minimize if:
       // 1. Click is inside applet
       // 2. Click is on launch button
       // 3. Click started in input area (text selection)
       // 4. Click ended in input area (text selection)
       // 5. Not a quick click (likely text selection)
       if (!applet.contains(e.target) && 
           !launchButton.contains(e.target) && 
           !diceInput.contains(mouseDownTarget) &&
           !diceInput.contains(e.target) &&
           isQuickClick) {
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