import { state } from './state';

// Roll a single die given the number of sides.
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// Roll all dice currently in state.selectedDice and update state.currentRolls.
export function rollAllDice() {
  state.currentRolls = state.selectedDice.map(die => {
    // Assumes die is in the form "dX" (e.g., "d6", "d20").
    const sides = parseInt(die.slice(1), 10);
    return rollDie(sides);
  });
}

// Compute the current dice notation (e.g., "2d20 + 1d6")
export function computeNotation() {
  const diceCounts = {};
  
  // Count occurrences of each die type
  state.selectedDice.forEach(die => {
    diceCounts[die] = (diceCounts[die] || 0) + 1;
  });
  
  // Convert to notation format
  const parts = Object.entries(diceCounts).map(([die, count]) => {
    return `${count}${die}`;
  });
  
  return parts.join(' + ');
}

// Compute total of current rolls plus modifier
export function computeTotal() {
  if (!state.currentRolls.length) return 0;
  
  // Sum all roll results and add the modifier
  const sum = state.currentRolls.reduce((total, roll) => total + roll, 0);
  return sum + state.modifier;
}

// Replace the existing parseDiceNotation with this improved version:
export function parseDiceNotation(input) {
    console.log("Parsing notation:", input);
    
    // Clean up the input - remove spaces around + and -
    const cleanInput = input.replace(/\s*([+-])\s*/g, '$1');
    console.log("Cleaned input:", cleanInput);
    
    // Extract all dice notations like "2d10" or "d20" or "+2" or "-1"
    const diceRegex = /([+-]?)(\d*)d(\d+)|([+-]\d+)/gi;
    let match;
    const results = [];
    
    while ((match = diceRegex.exec(cleanInput)) !== null) {
      console.log("Match found:", match);
      if (match[0].includes('d')) {
        // This is a dice notation
        const sign = match[1] || '+';  // Default to + if no sign
        const count = match[2] === '' ? 1 : parseInt(match[2], 10);  // Default to 1 if no count
        const sides = parseInt(match[3], 10);
        results.push({ type: 'dice', sign, count, sides });
      } else {
        // This is a modifier
        const modifier = parseInt(match[0], 10);  // Already includes sign
        results.push({ type: 'modifier', value: modifier });
      }
    }
    
    console.log("Parsed results:", results);
    
    // Process the results
    const dice = [];
    let modifier = 0;
    
    results.forEach(item => {
      if (item.type === 'dice') {
        // For dice, add the appropriate number based on sign
        const diceType = `d${item.sides}`;
        const actualCount = item.sign === '-' ? -item.count : item.count;
        
        // Add or remove dice based on sign
        if (actualCount > 0) {
          for (let i = 0; i < actualCount; i++) {
            dice.push(diceType);
          }
        }
      } else {
        // For modifiers, just add to the total modifier
        modifier += item.value;
      }
    });
    
    console.log("Final parsed result:", { dice, modifier });
    return { dice, modifier };
  }