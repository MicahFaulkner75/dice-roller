import { state } from './state';

// Roll a single die
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// Roll all selected dice
export function rollAllDice() {
  state.currentRolls = state.selectedDice.map(die => {
    const sides = parseInt(die.slice(1), 10);
    return rollDie(sides);
  });
}

// Compute the current dice notation
export function computeNotation() {
  const diceCounts = state.selectedDice.reduce((acc, die) => {
    acc[die] = (acc[die] || 0) + 1;
    return acc;
  }, {});

  // Always include the count—even if it is 1
  return Object.entries(diceCounts)
    .map(([die, count]) => `${count}${die}`)
    .join(' + ');
}

// Compute total of current rolls plus modifier
export function computeTotal() {
  if (!state.currentRolls.length) return 0;
  return state.currentRolls.reduce((sum, roll) => sum + roll, 0) + state.modifier;
}

// Parse input notation and return dice configuration and modifier
export function parseDiceNotation(input) {
  // Match both "NdS" (or variation with spaces) and modifiers like "+2"
  const regex = /(\d*)\s*[dD]\s*(\d+)|([+-]\s*\d+)/g;
  const matches = input.match(regex);
  if (!matches) return null;

  const dice = [];
  let modifier = 0;

  matches.forEach(match => {
    if (match.toLowerCase().includes('d')) {
      // Handle dice notation; if count is missing, default to 1
      const [count, sides] = match.toLowerCase().split(/\s*d\s*/);
      const diceCount = count === '' ? 1 : parseInt(count, 10);
      for (let i = 0; i < diceCount; i++) {
        dice.push(`d${sides}`);
      }
    } else {
      // Handle modifiers
      modifier += parseInt(match.replace(/\s+/g, ''), 10);
    }
  });

  return { dice, modifier };
}