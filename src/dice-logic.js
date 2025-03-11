/*
* DICE LOGIC
* 
* This file handles all dice rolling logic, mathematical calculations, and related animations.
* It is responsible for generating random numbers, computing totals, and managing specialized
* dice roll behaviors like percentile dice.
*
* This file:
* 1. Provides core dice rolling functionality (rollDie)
* 2. Implements animation physics for dice spin (decelerate, animateSpin)
* 3. Handles specialized percentile dice rolls (rollPercentile)
* 4. Manages rolling multiple dice at once (rollAllDice)
* 5. Parses dice notation from user input (parseDiceNotation)
* 6. Calculates total values from dice rolls (computeTotal)
* 7. Generates formatted notation for display (computeNotation)
*/

import { state } from './state';


// Roll a single die given the number of sides.
export function rollDie(sides) {
 return Math.floor(Math.random() * sides) + 1;
}


// Deceleration function
function decelerate(t, p_f, A, tau) {
 return p_f - A * Math.exp(-t / tau);
}


// Animate the dice spin with deceleration
function animateSpin(button, duration, finalAngle) {
 const startTime = performance.now();
 const initialAngle = 0;
 const amplitude = finalAngle - initialAngle;
 const tau = 325; // Time constant in milliseconds


 function step(currentTime) {
   const elapsedTime = currentTime - startTime;
   if (elapsedTime < duration) {
     const angle = decelerate(elapsedTime, finalAngle, amplitude, tau);
     button.style.transform = `rotate(${angle}deg)`;
     requestAnimationFrame(step);
   } else {
     button.style.transform = `rotate(${finalAngle}deg)`;
   }
 }


 requestAnimationFrame(step);
}


// Add this function for percentile rolls
function rollPercentile() {
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


// Modify rollAllDice to handle percentile rolls
export function rollAllDice() {
  console.log("Rolling dice:", state.selectedDice);
  
  // Handle pure percentile roll
  if (state.selectedDice.length === 1 && 
      (state.selectedDice[0] === 'd00' || state.selectedDice[0] === 'd100')) {
    console.log("Triggering single percentile roll");
    const { results, total } = rollPercentile();
    state.currentRolls = results;
    state.lastTotal = total;
    console.log("Percentile roll results:", results, "total:", total);
    return;
  }

  // Handle mixed rolls (including percentile)
  const rolls = [];
  let runningTotal = 0;

  state.selectedDice.forEach(die => {
    if (die === 'd00' || die === 'd100') {
      // Handle percentile within mixed roll
      const { results, total } = rollPercentile();
      rolls.push(...results);
      runningTotal += total;
    } else {
      // Handle regular die
   const sides = parseInt(die.slice(1), 10);
      const roll = rollDie(sides);
      rolls.push(roll);
      runningTotal += roll;
    }
 });

  state.currentRolls = rolls;
  state.lastTotal = runningTotal;

  // Trigger animations for regular dice
 state.selectedDice.forEach(die => {
    if (die !== 'd00' && die !== 'd100') {
   const dieButtons = document.querySelectorAll(`.die-button[data-die="${die}"] img`);
   dieButtons.forEach(button => {
        const finalAngle = 360 * 3;
        const duration = 2000;
     animateSpin(button, duration, finalAngle);
   });
    }
 });
}


// Compute the current dice notation (e.g., "2d20 + 1d6")
export function computeNotation() {
  // Special case for percentile roll
  if (state.selectedDice.length === 1 && 
      (state.selectedDice[0] === 'd00' || state.selectedDice[0] === 'd100')) {
    return '00';
  }

  // Normal dice handling
 const diceCounts = {};
  // Count occurrences of each die type
 state.selectedDice.forEach(die => {
   diceCounts[die] = (diceCounts[die] || 0) + 1;
 });
  
  // Convert to notation format
 const parts = Object.entries(diceCounts).map(([die, count]) => {
   return `${count}${die}`;
 });
  
  let notation = parts.join(' + ');

  // Add modifier if it exists
  if (state.modifier !== 0) {
    notation += notation ? ` ${state.modifier > 0 ? '+' : '-'} ${Math.abs(state.modifier)}` : 
                         `${state.modifier > 0 ? '+' : '-'}${Math.abs(state.modifier)}`;
  }

  return notation;
}


// Compute total of current rolls plus modifier
export function computeTotal() {
  let sum = 0;
  
  // Handle percentile rolls
  if (Array.isArray(state.currentRolls) && state.currentRolls.length > 0 && 
      typeof state.currentRolls[0] === 'object' && 'type' in state.currentRolls[0]) {
    // This is a percentile roll
    const tens = state.currentRolls.find(r => r.type === 'd10-tens');
    const ones = state.currentRolls.find(r => r.type === 'd10-ones');
    if (tens && ones) {
      const tensValue = parseInt(tens.value, 10);
      const onesValue = parseInt(ones.value, 10);
      sum = (tensValue === 0 && onesValue === 0) ? 100 : tensValue + onesValue;
    }
  } else if (state.currentRolls.length > 0) {
    // Normal dice rolls
    sum = state.currentRolls.reduce((total, roll) => {
      // Handle both number rolls and objects
      if (typeof roll === 'number') {
        return total + roll;
      } else if (roll && typeof roll.value === 'number') {
        return total + roll.value;
      }
      return total;
    }, 0);
  }

  // Always add the modifier
  const total = sum + (state.modifier || 0);
  
  // If we have a lastTotal (from percentile rolls), use that instead
  if (state.lastTotal !== undefined) {
    return state.lastTotal + (state.modifier || 0);
  }
  
  return total;
}


// Replace the existing parseDiceNotation with this improved version:
export function parseDiceNotation(input) {
   console.log("Parsing notation:", input);
  
   // Clean up the input - remove spaces around + and -
   const cleanInput = input.replace(/\s*([+-])\s*/g, '$1');
   console.log("Cleaned input:", cleanInput);
  
   // Initialize results
   const results = {
     dice: [],
     modifier: 0,
     type: 'normal'
   };

   // First check if this is just a modifier
   if (/^[+-]?\d+$/.test(cleanInput)) {
     const modValue = parseInt(cleanInput, 10);
     console.log("Standalone modifier detected:", modValue);
     return {
       type: 'modifier',
       dice: [],
       modifier: modValue
     };
   }

   // First pass: look for standalone percentile notation
   const standalonePercentile = /^1?d(?:100|00)$/i.test(cleanInput) || /^00$/.test(cleanInput);
   if (standalonePercentile) {
     console.log("Standalone percentile notation detected");
     return { 
       type: 'percentile',
       dice: ['d00'],
       modifier: 0
     };
   }

   // Process dice notation and modifiers
   const diceRegex = /([+-]?)(?:(\d*)d(\d+)|00)|([+-]?\d+)(?!\d*d)/g;
   let match;
   let hasPercentile = false;
  
   while ((match = diceRegex.exec(cleanInput)) !== null) {
     console.log("Match found:", match);
     
     // Check if this is a modifier (group 4)
     if (match[4] !== undefined) {
       const modValue = parseInt(match[4], 10);
       console.log("Found modifier:", modValue);
       results.modifier += modValue;
       continue;
     }
     
     // Check if this is a percentile ("00") within the string
     if (match[0].toLowerCase() === '00') {
       hasPercentile = true;
       results.dice.push('d00');
       continue;
     }
     
     // Check if this is d100 or d00
     if (match[0].toLowerCase().match(/d(?:100|00)/i)) {
       hasPercentile = true;
       results.dice.push('d00');
       continue;
     }

     if (match[0].includes('d')) {
       // Regular dice notation
       const sign = match[1] || '+';
       const count = match[2] === '' ? 1 : parseInt(match[2], 10);
       const sides = parseInt(match[3], 10);
       
       // Add the appropriate number of dice
       for (let i = 0; i < count; i++) {
         results.dice.push(`d${sides}`);
       }
     }
   }

   if (hasPercentile) {
     results.type = 'mixed';
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

// Add this test function for percentile dice functionality
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


