/*
* STATE MANAGEMENT
*
* This file manages the application's state and provides functions to modify it.
* It is responsible for maintaining the current dice selection, roll results, and modifier values.
*
* This file:
* 1. Defines the central state object (state)
* 2. Provides functions to modify the modifier value (setModifier)
* 3. Offers functions to clear dice selection and results (clearDice, clearResults)
* 4. Enables adding dice to the selected dice array (addDie)
*/

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