import { state } from '../state';
import { rollAllDice, computeTotal } from '../dice-logic';
import { animateDiceIcons, animateResults } from '../animations/dice-animations';
import { updateDisplay } from './display';

export function setupDiceButtons() {
  console.log('Setting up dice button event listeners');
  const dieButtons = document.querySelectorAll('.die-button');
  dieButtons.forEach(button => {
    button.addEventListener('click', handleDieClick);
    console.log(`Added click event listener to ${button.dataset.die} button`);
  });
}

function handleDieClick(e) {
  const button = e.currentTarget;
  const dieType = button.dataset.die;
  console.log(`${dieType} button clicked`);
  const count = state.selectedDice.filter(die => die === dieType).length;
  
  if (count === 0) return;
  
  const durationMs = animateDiceIcons([dieType]);
  
  setTimeout(() => {
    rollAllDice();
    animateResults(state.currentRolls, computeTotal(), durationMs);
    updateDisplay();
  }, durationMs);
}