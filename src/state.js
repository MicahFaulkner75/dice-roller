export const state = {
    selectedDice: [],
    currentRolls: [],
    modifier: 0,
  };
  
  export function setModifier(value) {
    state.modifier = value;
  }
  
  export function clearDice() {
    state.selectedDice = [];
  }
  
  export function clearResults() {
    state.currentRolls = [];
  }
  
  export function addDie(die) {
    state.selectedDice.push(die);
  }