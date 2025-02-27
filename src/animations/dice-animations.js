import { state } from '../state';
import { formatModifier } from '../utils/formatting';

export function animateDiceIcons(diceConfig) {
  const baseTime = 0.2;
  
  const diceCount = diceConfig.reduce((acc, die) => {
    acc[die] = (acc[die] || 0) + 1;
    return acc;
  }, {});
  
  Object.keys(diceCount).forEach(dieType => {
    const spins = diceCount[dieType];
    const durationSec = spins * baseTime;
    const durationMs = durationSec * 1000;
  
    document.querySelectorAll(`.die-button[data-die="${dieType}"]`).forEach(button => {
      const img = button.querySelector('img');
      img.style.setProperty('--rotations', spins);
      img.style.animation = 'none';
      img.offsetHeight;
      img.style.animation = `spin ${durationSec}s cubic-bezier(0.0, 0.0, 0.2, 1) forwards`;
      
      setTimeout(() => img.style.animation = '', durationMs);
    });
  });
  
  return Math.max(...Object.values(diceCount)) * baseTime * 1000;
}

export function animateResults(finalResults, finalTotal, durationMs) {
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  const intervalTime = 50;
  const iterations = Math.floor(durationMs / intervalTime);
  let counter = 0;
  
  const interval = setInterval(() => {
    const tempResults = state.selectedDice.map(die => {
      const sides = parseInt(die.slice(1), 10);
      return Math.floor(Math.random() * sides) + 1;
    });
    resultsRollsEl.innerHTML = tempResults.join(' + ');
    counter++;
    
    if (counter >= iterations) {
      clearInterval(interval);
      resultsRollsEl.innerHTML = finalResults.join(' + ') + formatModifier(state.modifier);
      resultsTotalEl.innerHTML = `
        <div style="font-weight:bold; font-size:16px; text-align:center;">TOTAL:</div>
        <div style="font-weight:bold; font-size:18px; text-align:center; margin-top:2px;">
          ${finalTotal}
        </div>`;
    }
  }, intervalTime);
}