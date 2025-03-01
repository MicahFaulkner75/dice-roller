export function updateResults(total, rolls, modifier) {
    const resultsTotal = document.getElementById('results-total');
    const resultsRolls = document.getElementById('results-rolls');
    resultsTotal.querySelector('div:nth-child(2)').textContent = total + modifier;
    resultsRolls.textContent = rolls.join(', ');
  }
  
  export function animateDice(button) {
    button.classList.add('spin');
    setTimeout(() => {
      button.classList.remove('spin');
    }, 1000);
  }
  
  import { state, setModifier, clearDice, clearResults, addDie } from './state';
  import { parseDiceNotation, rollAllDice, computeTotal } from './dice-logic';
  import { animateDiceIcons } from './animations/dice-animations';
  
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
  
  export function updateDisplay() {
    // Implement the logic to update the display
  }
  
  export function animateResults(rolls, total, durationMs) {
    const resultsTotal = document.getElementById('results-total');
    const resultsRolls = document.getElementById('results-rolls');
    setTimeout(() => {
      resultsTotal.querySelector('div:nth-child(2)').textContent = total;
      resultsRolls.textContent = rolls.join(', ');
    }, durationMs);
  }