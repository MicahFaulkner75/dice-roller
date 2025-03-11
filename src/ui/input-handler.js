import { state, setModifier, clearDice, clearResults, addDie } from '../state';
import { parseDiceNotation, rollAllDice, computeTotal } from '../dice-logic';
import { animateDiceIcons, animateResults, resetD10State } from '../animations/dice-animations';
import { updateDisplay } from './display';

export function setupDiceInput() {
  const diceInput = document.getElementById('dice-input');
  diceInput.contentEditable = 'true';
  diceInput.draggable = false;
  
  // Prevent text selection from triggering minimization
  diceInput.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
  
  diceInput.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  diceInput.addEventListener('keydown', handleInputKeyDown);
  diceInput.addEventListener('blur', () => updateDisplay());

  // Global key handling
  document.addEventListener('keydown', (e) => {
    // Get the active element once
    const activeElement = document.activeElement;
    const isInputFocused = activeElement === diceInput;
    
    // Skip all global handlers if input is focused
    if (isInputFocused) {
      return;
    }
    
    // Only handle global shortcuts when input is not focused
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        // Check if we're in percentile mode
        const d10Button = document.querySelector('.die-button[data-die="d10"]');
        if (d10Button && d10Button.classList.contains('percentile-active')) {
          // Reroll percentile dice
          rollAllDice();
          animateDiceIcons(['d00']);
          setTimeout(() => {
            animateResults(state.currentRolls, computeTotal(), 2000);
            updateDisplay();
          }, 0);
        } else {
          // Normal roll
          const rollButton = document.getElementById('roll-button');
          if (rollButton) {
            rollButton.click();
          }
        }
        break;
        
      case 'Backspace':
        e.preventDefault();
        // Reset d10 state first to handle graphics
        resetD10State();
        // Then trigger clear button for normal cleanup
        const clearButton = document.getElementById('clear-button');
        if (clearButton) {
          clearButton.click();
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        // Only hide applet when input is not focused
        const applet = document.getElementById('dice-applet');
        if (applet) {
          // Reset position and hide
          applet.style.left = '50%';
          applet.style.top = '50%';
          applet.style.transform = 'translate(-50%, -50%)';
          applet.style.display = 'none';
          
          // Reset d10 state and clear dice
          resetD10State();
          const clearButton = document.getElementById('clear-button');
          if (clearButton) {
            clearButton.click();
          }
        }
        break;
    }
  });
}

function handleInputKeyDown(e) {
  switch (e.key) {
    case 'Enter':
      e.preventDefault();
      e.stopPropagation(); // Prevent global handler
      const input = e.target.textContent.trim();
      
      if (!input) {
        clearDice();
        clearResults();
        updateDisplay();
        e.target.blur();
        return;
      }

      const parsed = parseDiceNotation(input);
      if (parsed) {
        processValidInput(parsed);
      }
      e.target.blur();
      break;
      
    case 'Escape':
      e.preventDefault();
      e.stopPropagation();
      e.target.blur();
      updateDisplay();
      break;
  }
}

function processValidInput(parsedInput) {
  console.log("Processing input:", parsedInput);
  
  // Handle standalone modifier
  if (parsedInput.type === 'modifier') {
    // Add the new modifier to the existing one
    const newModifier = state.modifier + parsedInput.modifier;
    setModifier(newModifier);
    updateDisplay();
    return;
  }
  
  // Handle dice rolls with or without modifiers
  if (parsedInput.dice.length > 0) {
    clearDice();
    clearResults();
    
    // Add dice to state
    parsedInput.dice.forEach(die => addDie(die));
    
    // Update modifier by adding the new one to the existing one
    const newModifier = state.modifier + parsedInput.modifier;
    setModifier(newModifier);
    
    // Roll dice and update display
    rollAllDice();
    const durationMs = animateDiceIcons(parsedInput.dice);
    setTimeout(() => {
      animateResults(state.currentRolls, computeTotal(), durationMs);
      updateDisplay();
    }, 0);
  }
}
