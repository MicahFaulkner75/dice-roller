import { state, setModifier, clearDice, clearResults, addDie } from '../state';
import { parseDiceNotation, rollAllDice, computeTotal } from '../dice-logic';
import { animateDiceIcons, animateResults } from '../animations/dice-animations';
import { updateDisplay } from './display';

export function setupDiceInput() {
  const diceInput = document.getElementById('dice-input');
  diceInput.contentEditable = 'true';
  diceInput.draggable = false;
  
  diceInput.addEventListener('keydown', handleInputKeyDown);
  diceInput.addEventListener('blur', () => updateDisplay());

  // Global key handling
  document.addEventListener('keydown', (e) => {
    // Skip if we're inside the input field
    if (document.activeElement === diceInput) return;
    
    if (e.key === 'Enter') {
      e.preventDefault();
      // Trigger roll button
      const rollButton = document.getElementById('roll-button');
      if (rollButton) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        rollButton.dispatchEvent(clickEvent);
      }
    } 
    else if (e.key === 'Backspace') {
      e.preventDefault();
      // Trigger clear button
      const clearButton = document.getElementById('clear-button');
      if (clearButton) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        clearButton.dispatchEvent(clickEvent);
      }
    }
    else if (e.key === 'Escape') {
      e.preventDefault();
      // Clear dice and hide applet
      const clearButton = document.getElementById('clear-button');
      const applet = document.getElementById('dice-applet');
      
      if (clearButton) {
        // First clear the dice
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        clearButton.dispatchEvent(clickEvent);
      }
      
      // Then reset position and hide applet
      if (applet) {
        // Reset to center position
        applet.style.left = '50%';
        applet.style.top = '50%';
        applet.style.transform = 'translate(-50%, -50%)';
        // Hide applet
        applet.style.display = 'none';
      }
    }
  });
}

// Rename the existing handleKeyDown to handleInputKeyDown
function handleInputKeyDown(e) {
  // This only runs when the input field has focus
  if (e.key === 'Enter') {
    // Existing Enter key handler for input field
    // ...rest of your existing code...
  } else if (e.key === 'Escape') {
    e.preventDefault();
    updateDisplay();
    e.target.blur();
  }
}
