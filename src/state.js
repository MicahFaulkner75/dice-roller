export const state = {
    selectedDice: [], // Array of selected dice (e.g., ["d4", "d6", "d6"])
    currentRolls: [], // Array of current roll results
    modifier: 0,      // Modifier to add to the total
};

// Add a die to the selectedDice array
export function addDie(die) {
    state.selectedDice.push(die);
}

// Clear all selected dice
export function clearDice() {
    state.selectedDice = [];
}

// Set the modifier value
export function setModifier(mod) {
    state.modifier = mod;
}

// Add a roll result to the currentRolls array
export function addResult(result) {
    state.currentRolls.push(result);
}

// Clear all roll results
export function clearResults() {
    state.currentRolls = [];
}