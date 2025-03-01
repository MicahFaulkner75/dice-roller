import { state, addDie } from '../state';
import { rollAllDice, computeTotal } from '../dice-logic';
import { animateDiceIcons, animateResults } from '../animations/dice-animations';
import { updateDisplay } from './display';

export function setupDiceButtons() {
  const dieButtons = document.querySelectorAll('.die-button');
  dieButtons.forEach(button => {
    button.addEventListener('click', handleDieClick);
  });
}

function handleDieClick(e) {
  const button = e.currentTarget;
  const dieType = button.dataset.die;
  console.log(`${dieType} button clicked`);
  
  // Always add the clicked die to the pool
  addDie(dieType);
  
  // Local fallback function in case import fails
  function localRollAllDice() {
    state.currentRolls = state.selectedDice.map(die => {
      const sides = parseInt(die.slice(1), 10);
      return Math.floor(Math.random() * sides) + 1;
    });
  }
  
  try {
    // Try to use imported function
    rollAllDice();
  } catch (error) {
    // Fallback to local function if import fails
    console.error("Error using imported rollAllDice, using fallback", error);
    localRollAllDice();
  }
  
  const durationMs = animateDiceIcons([dieType]);
  
  // Update display after animation completes
  setTimeout(() => {
    try {
      animateResults(state.currentRolls, computeTotal(), durationMs);
    } catch (error) {
      // Fallback for compute total
      console.error("Error in computeTotal, using fallback", error);
      const total = state.currentRolls.reduce((sum, roll) => sum + roll, 0) + state.modifier;
      animateResults(state.currentRolls, total, durationMs);
    }
    updateDisplay();
  }, durationMs);
}