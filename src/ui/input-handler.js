import { state, setModifier, clearDice, clearResults, addDie } from '../state';
import { parseDiceNotation, rollAllDice, computeTotal } from '../dice-logic';
import { animateDiceIcons, animateResults } from '../animations/dice-animations';
import { updateDisplay } from './display';

export function setupDiceInput() {
  const diceInput = document.getElementById('dice-input');
  diceInput.contentEditable = 'true';
  diceInput.draggable = false;
  
  // Handle input field focus events
  diceInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Delegate to roll button click
      const rollButton = document.getElementById('roll-button');
      if (rollButton) {
        rollButton.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      updateDisplay();
      e.target.blur();
    }
  });
  
  diceInput.addEventListener('blur', () => updateDisplay());

  // Global keyboard shortcuts (only when input is not focused)
  document.addEventListener('keydown', (e) => {
    // Skip if we're inside the input field
    if (document.activeElement === diceInput) return;
    
    if (e.key === 'Enter') {
      e.preventDefault();
      // Trigger roll button
      const rollButton = document.getElementById('roll-button');
      if (rollButton) {
        rollButton.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
      }
    } 
    else if (e.key === 'Backspace') {
      e.preventDefault();
      // Trigger clear button
      const clearButton = document.getElementById('clear-button');
      if (clearButton) {
        clearButton.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
      }
    }
    else if (e.key === 'Escape') {
      e.preventDefault();
      // Trigger clear button first
      const clearButton = document.getElementById('clear-button');
      const applet = document.getElementById('dice-applet');
      
      if (clearButton) {
        clearButton.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
      }
      
      // Then reset position and hide applet
      if (applet) {
        applet.style.left = '50%';
        applet.style.top = '50%';
        applet.style.transform = 'translate(-50%, -50%)';
        applet.style.display = 'none';
      }
    }
  });
}
