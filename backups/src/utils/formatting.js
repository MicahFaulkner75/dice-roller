/*
* TEXT FORMATTING UTILITIES
*
* This file provides utility functions for formatting text in the dice roller interface.
* It is responsible for consistent text formatting across the application, especially
* for modifier values and dice notation.
*
* This file:
* 1. Formats modifier values with proper sign (formatModifier)
* 2. Combines dice notation with modifier for display (formatDiceInput)
*/

export function formatModifier(modifier) {
    if (modifier === 0) return '';
    return ` <span class="modifier-display">${modifier > 0 ? '+' + modifier : modifier}</span>`;
  }
  
  export function formatDiceInput(notation, modifier) {
    return notation + formatModifier(modifier);
  }