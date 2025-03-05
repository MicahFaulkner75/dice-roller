import { setupDiceInput, setupDiceButtons, updateDisplay } from './ui-updates';
import { state, setModifier, clearDice, clearResults, addDie } from './state';
import { parseDiceNotation, rollAllDice, computeTotal } from './dice-logic';
import { animateDiceIcons, animateResults } from './animations/dice-animations';

export function setupEventListeners() {
  // Roll button handles both click and Enter key (via input-handler delegation)
  const rollButton = document.getElementById('roll-button');
  rollButton.addEventListener('click', () => {
    const diceInput = document.getElementById('dice-input');
    const input = diceInput?.textContent?.trim();
    
    if (!input) {
      // If no input, just roll existing dice
      rollAllDice();
      const durationMs = animateDiceIcons(state.selectedDice);
      animateResults(state.currentRolls, computeTotal(), durationMs);
      updateDisplay();
      return;
    }

    // Parse and process input if present
    const parsed = parseDiceNotation(input);
    if (parsed) {
      // Don't clear and rebuild on reroll - this preserves order
      if (state.selectedDice.length === 0) {
        parsed.dice.forEach(die => addDie(die));
      }
      setModifier(parsed.modifier);
      rollAllDice();

      const durationMs = animateDiceIcons(state.selectedDice);
      animateResults(state.currentRolls, computeTotal(), durationMs);
      updateDisplay();
    }
  });

  // Clear button handles both click and Backspace (via input-handler delegation)
  const clearButton = document.getElementById('clear-button');
  clearButton.addEventListener('click', () => {
    clearDice();
    clearResults();
    setModifier(0);
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

  // Close button handling
  const closeButton = document.getElementById('close-applet');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      const applet = document.getElementById('dice-applet');
      if (applet) {
        applet.style.display = 'none';
      }
    });
  }
   
  // Click outside to close
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