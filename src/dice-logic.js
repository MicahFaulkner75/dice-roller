/*
* DICE LOGIC
* 
* This file handles all dice rolling logic, mathematical calculations, and parsing functions.
* It is responsible for generating random numbers, computing totals, and managing specialized
* dice roll behaviors like percentile dice. It now uses the state API for all state operations
* rather than directly accessing or modifying state.
*
* This file:
* 1. Provides core dice rolling functionality (rollDie)
* 2. Handles specialized percentile dice rolls (rollPercentile)
* 3. Manages rolling multiple dice at once (rollAllDice)
* 4. Parses dice notation from user input (parseDiceNotation)
* 5. Calculates total values from dice rolls (computeTotal)
* 6. Generates formatted notation for display (computeNotation)
* 7. Interfaces with the state management API for all state updates
*
* Last updated: March 2025
*/

// Update imports to use new state API
import { 
  getSelectedDice, 
  getCurrentRolls, 
  getModifier, 
  getLastTotal,
  hasPercentileDie,
  setRollResults,
  setLastTotal,
  clearLastTotal,
  addRollResult
} from './state';

// Roll a single die given the number of sides.
export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// Add this function for percentile rolls
export function rollPercentile() {
  console.log("Rolling percentile dice");
  const tens = Math.floor(Math.random() * 10); // 0-9 for tens digit
  const ones = Math.floor(Math.random() * 10); // 0-9 for ones digit
  
  // Format tens as "00", "10", "20", etc.
  const tensDisplay = (tens * 10).toString().padStart(2, '0');
  
  // Calculate true total (00 = 100)
  const total = (tens === 0 && ones === 0) ? 100 : tens * 10 + ones;
  
  console.log(`Percentile roll: tens=${tensDisplay}, ones=${ones}, total=${total}`);
  
  // Create the results in a fixed order first
  const results = [
    { value: tensDisplay, type: 'd10-tens' },
    { value: ones, type: 'd10-ones' }
  ];
  
  // Randomly shuffle the results
  if (Math.random() < 0.5) {
    results.reverse();
  }
  
  console.log("Results order:", results.map(r => r.type).join(', '));
  return { results, total };
}

// Refactored to use state API
export function rollAllDice() {
  const selectedDice = getSelectedDice();
  console.log("Rolling dice:", selectedDice);
  
  // Handle pure percentile roll
  if (hasPercentileDie()) {
    console.log("Triggering single percentile roll");
    const { results, total } = rollPercentile();
    setRollResults(results);
    setLastTotal(total);
    console.log("Percentile roll results:", results, "total:", total);
    return { results, total };
  }

  // Handle mixed rolls (including percentile)
  const rolls = [];
  let runningTotal = 0;

  selectedDice.forEach(die => {
    // Only treat d00 as a special percentile die
    // d100 is now treated as a regular non-standard die with 100 sides
    if (die === 'd00') {
      // Handle percentile die
      const { results, total } = rollPercentile();
      rolls.push(...results);
      runningTotal += total;
    } else {
      // Handle all other dice (including d100) as regular dice
      const sides = parseInt(die.slice(1), 10);
      const roll = rollDie(sides);
      rolls.push(roll);
      runningTotal += roll;
    }
  });

  setRollResults(rolls);
  setLastTotal(runningTotal);
  
  return { results: rolls, total: runningTotal };
}

// Compute the current dice notation (e.g., "2d20 + 1d6")
export function computeNotation() {
  const selectedDice = getSelectedDice();
  const modifier = getModifier();
  
  // Special case for percentile roll
  if (hasPercentileDie()) {
    return '00';
  }

  // Normal dice handling
  const diceCounts = {};
  // Count occurrences of each die type
  selectedDice.forEach(die => {
    diceCounts[die] = (diceCounts[die] || 0) + 1;
  });
  
  // Convert to notation format
  const parts = Object.entries(diceCounts).map(([die, count]) => {
    return `${count}${die}`;
  });
  
  let notation = parts.join(' + ');

  // Add modifier if it exists
  if (modifier !== 0) {
    notation += notation ? ` ${modifier > 0 ? '+' : '-'} ${Math.abs(modifier)}` : 
                         `${modifier > 0 ? '+' : '-'}${Math.abs(modifier)}`;
  }

  return notation;
}

// Compute total of current rolls plus modifier
export function computeTotal() {
  console.log('=== DEBUG: computeTotal ===');
  
  const currentRolls = getCurrentRolls();
  const modifier = getModifier();
  const lastTotal = getLastTotal();
  
  console.log('currentRolls:', currentRolls);
  console.log('modifier:', modifier);
  console.log('lastTotal:', lastTotal);
  
  let sum = 0;
  
  // Handle percentile rolls
  if (Array.isArray(currentRolls) && currentRolls.length > 0 && 
      typeof currentRolls[0] === 'object' && 'type' in currentRolls[0]) {
    // This is a percentile roll
    const tens = currentRolls.find(r => r.type === 'd10-tens');
    const ones = currentRolls.find(r => r.type === 'd10-ones');
    if (tens && ones) {
      const tensValue = parseInt(tens.value, 10);
      const onesValue = parseInt(ones.value, 10);
      sum = (tensValue === 0 && onesValue === 0) ? 100 : tensValue + onesValue;
      console.log('Percentile roll calculation:', { tensValue, onesValue, sum });
    }
  } else if (currentRolls.length > 0) {
    // Normal dice rolls
    sum = currentRolls.reduce((total, roll) => {
      // Handle both number rolls and objects
      let rollValue;
      if (typeof roll === 'number') {
        rollValue = roll;
      } else if (roll && typeof roll.value === 'number') {
        rollValue = roll.value;
      } else {
        rollValue = 0;
      }
      
      console.log(`Adding roll ${JSON.stringify(roll)} = ${rollValue} to total ${total}`);
      return total + rollValue;
    }, 0);
    
    console.log('Sum after reduce:', sum);
  }

  // If we have a lastTotal (from percentile rolls), use that instead
  if (lastTotal !== undefined) {
    console.log(`Using lastTotal (${lastTotal}) instead of calculated sum (${sum})`);
    clearLastTotal(); // Clear after use
    return lastTotal + modifier;
  }
  
  // Always add the modifier
  const finalTotal = sum + modifier;
  console.log(`Final total: ${sum} + ${modifier} = ${finalTotal}`);
  return finalTotal;
}

// Improved parseDiceNotation with explicit sets for percentile and non-standard rolls
export function parseDiceNotation(input) {
  console.log("Parsing notation:", input);
  
  // Clean up the input - remove spaces around + and -
  const cleanInput = input.replace(/\s*([+-])\s*/g, '$1');
  console.log("Cleaned input:", cleanInput);
  
  // Define sets for percentile and non-standard notations
  const percentileSet = new Set(["d100", "d00", "00"]);
  const nonStandardSet = new Set(["1d100"]);

  // Initialize results
  const results = {
    dice: [],
    modifier: 0,
    type: 'normal'
  };

  // Check if the input is a standalone modifier
  if (/^[+-]?\d+$/.test(cleanInput)) {
    const modValue = parseInt(cleanInput, 10);
    console.log("Standalone modifier detected:", modValue);
    return {
      type: 'modifier',
      dice: [],
      modifier: modValue
    };
  }

  // Check if the input is in the percentile set
  if (percentileSet.has(cleanInput.toLowerCase())) {
    console.log("Percentile notation detected");
    return { 
      type: 'percentile',
      dice: ['d00'],
      modifier: 0
    };
  }

  // Check if the input is in the non-standard set
  if (nonStandardSet.has(cleanInput.toLowerCase())) {
    console.log("Non-standard notation detected: 1d100 -> transforming to d100");
    return { 
      type: 'normal',
      dice: ['d100'], // Transform 1d100 to d100
      modifier: 0
    };
  }

  // Process dice notation and modifiers
  const diceRegex = /([+-]?)(?:(\d*)d(\d+)|00)|([+-]?\d+)(?!\d*d)/g;
  let match;
  let hasPercentile = false;
  let hasOtherDice = false;
  // Define standard dice types
  const standardDice = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
  
  while ((match = diceRegex.exec(cleanInput)) !== null) {
    console.log("Match found:", match);
    
    // Check if this is a modifier (group 4)
    if (match[4] !== undefined) {
      const modValue = parseInt(match[4], 10);
      console.log("Found modifier:", modValue);
      results.modifier += modValue;
      continue;
    }
    
    if (match[0].includes('d')) {
      // Regular dice notation
      const sign = match[1] || '+';
      const count = match[2] === '' ? 1 : parseInt(match[2], 10);
      const sides = parseInt(match[3], 10);
      
      // Special handling for 1d100
      if (match[0].toLowerCase() === '1d100') {
        console.log("Found 1d100, converting to d100");
        results.dice.push('d100');
        hasOtherDice = true;
        continue;
      }
      
      // Handle all other dice
      const dieType = `d${sides}`;
      
      // Check if this is a standard die or a d100 with a count prefix
      if (standardDice.includes(dieType)) {
        // Standard die (d4, d6, d8, d10, d12, d20), add requested quantity
        for (let i = 0; i < count; i++) {
          results.dice.push(dieType);
          hasOtherDice = true;
        }
      } else {
        // Non-standard die, add with count prefix if more than 1
        // This ensures 2d30 becomes two separate d30 entries
        for (let i = 0; i < count; i++) {
          results.dice.push(dieType);
          hasOtherDice = true;
        }
      }
    }
  }

  // Only mark as percentile if it's the ONLY die in the pool
  if (hasPercentile && !hasOtherDice) {
    results.type = 'percentile';
  } else {
    // For all other cases, it's either normal or mixed
    results.type = 'normal';
  }

  console.log("Final parsed result:", results);
  return results;
}

// Test function for dice notation parser
export function testDiceParser() {
    const testCases = {
        "Should trigger percentile": [
            "d100",
            "d00",
            "1d100",
            "1d00",
            "00",
            "2d6 + 00",
            "00 + 1d8",
            "-00",
            "+00"
        ],
        "Should NOT trigger percentile": [
            "100",
            "2000",
            "00d6",
            "200",
            "1d20",
            "2d6+3",
            "3d8-1"
        ]
    };

    console.log("%c=== DICE NOTATION PARSER TESTS ===", "color: blue; font-weight: bold; font-size: 14px;");
    
    Object.entries(testCases).forEach(([category, cases]) => {
        console.log(`%c${category}`, "color: green; font-weight: bold;");
        cases.forEach(input => {
            const result = parseDiceNotation(input);
            console.log(`Input: "${input}"`);
            console.log("Result:", result);
            console.log("Type:", result.type);
            if (result.type === 'percentile') {
                console.log("%cPercentile roll detected ✓", "color: blue");
            }
            console.log("---");
        });
    });
}

// Test function for percentile dice functionality
export function testPercentileDice() {
    console.log("%c=== PERCENTILE DICE TESTS ===", "color: blue; font-weight: bold; font-size: 14px;");
    
    // Test 1: Parser Tests
    console.log("%cParser Tests", "color: green; font-weight: bold;");
    const parserTests = [
        "d00", "d100", "1d00", "1d100",  // Basic percentile notation
        "d00+1", "d100-2",               // With modifiers
        "2d00", "2d100",                 // Should NOT trigger percentile (invalid)
        "d20", "2d6"                     // Regular dice for comparison
    ];
    
    parserTests.forEach(input => {
        const result = parseDiceNotation(input);
        console.log(`Input: "${input}"`);
        console.log("Result:", result);
        console.log("Is Percentile:", result.type === 'percentile');
        console.log("---");
    });
    
    // Test 2: Roll Function Tests
    console.log("%cRoll Function Tests", "color: green; font-weight: bold;");
    console.log("Testing 10 percentile rolls:");
    
    for (let i = 0; i < 10; i++) {
        const { results, total } = rollPercentile();
        console.log(`Roll ${i + 1}:`);
        console.log("Results:", results);
        console.log("Total:", total);
        console.log("Valid Roll:", validatePercentileRoll(results, total));
        console.log("---");
    }
}

// Helper function to validate percentile roll results
function validatePercentileRoll(results, total) {
    if (!Array.isArray(results) || results.length !== 2) {
        return { valid: false, reason: "Results must be an array of 2 values" };
    }
    
    const tens = results.find(r => r.type === 'd10-tens');
    const ones = results.find(r => r.type === 'd10-ones');
    
    if (!tens || !ones) {
        return { valid: false, reason: "Missing tens or ones value" };
    }
    
    const tensValue = parseInt(tens.value);
    const onesValue = parseInt(ones.value);
    
    if (isNaN(tensValue) || isNaN(onesValue)) {
        return { valid: false, reason: "Invalid number values" };
    }
    
    if (tensValue < 0 || tensValue > 90 || tensValue % 10 !== 0) {
        return { valid: false, reason: "Invalid tens value" };
    }
    
    if (onesValue < 0 || onesValue > 9) {
        return { valid: false, reason: "Invalid ones value" };
    }
    
    const expectedTotal = (tensValue === 0 && onesValue === 0) ? 100 : tensValue + onesValue;
    
    if (total !== expectedTotal) {
        return { valid: false, reason: `Total ${total} doesn't match expected ${expectedTotal}` };
    }
    
    return { valid: true };
}

// Make test functions available globally in browser
if (typeof window !== 'undefined') {
    window.testDiceParser = testDiceParser;
    window.testPercentileDice = testPercentileDice;
    console.log("Test functions available. Run testDiceParser() or testPercentileDice() in console to test.");
}


