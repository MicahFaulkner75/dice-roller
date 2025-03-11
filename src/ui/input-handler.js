/*
* INPUT HANDLER
*
* This file manages user text input for dice notation and keyboard interactions.
* It is responsible for setting up the input field, processing dice notation,
* handling keyboard shortcuts, and triggering rolls based on user input.
*
* This file:
* 1. Sets up the editable input field (setupDiceInput)
* 2. Manages keyboard events for the input field (handleInputKeyDown)
* 3. Processes valid dice notation input (processValidInput)
* 4. Handles global keyboard shortcuts 
* 5. Sets up the roll button functionality (setupRollButton)
* 6. Prevents event propagation for text selection
*/

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
          const durationMs = animateDiceIcons(['d00']);
          animateResults(state.currentRolls, computeTotal(), durationMs);
        } else if (state.selectedDice.length > 0) {
          // Normal roll - use same animation sequence
          rollAllDice();
          const durationMs = animateDiceIcons(state.selectedDice);
          animateResults(state.currentRolls, computeTotal(), durationMs);
        }
        break;
        
      case 'Backspace':
        e.preventDefault();
        resetD10State();
        const clearButton = document.getElementById('clear-button');
        if (clearButton) {
          clearButton.click();
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        const applet = document.getElementById('dice-applet');
        if (applet) {
          applet.style.left = '50%';
          applet.style.top = '50%';
          applet.style.transform = 'translate(-50%, -50%)';
          applet.style.display = 'none';
          
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
      e.stopPropagation();
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
    
    // Update modifier
    const newModifier = state.modifier + parsedInput.modifier;
    setModifier(newModifier);
    
    // Roll dice and start animations simultaneously
    rollAllDice();
    const durationMs = animateDiceIcons(parsedInput.dice);
    animateResults(state.currentRolls, computeTotal(), durationMs);
  }
}

// Add roll button handler
export function setupRollButton() {
  const rollButton = document.getElementById('roll-button');
  if (rollButton) {
    rollButton.addEventListener('click', () => {
      if (state.selectedDice.length > 0) {
        // Use same animation sequence as other methods
        rollAllDice();
        const durationMs = animateDiceIcons(state.selectedDice);
        animateResults(state.currentRolls, computeTotal(), durationMs);
      }
    });
  }
}
