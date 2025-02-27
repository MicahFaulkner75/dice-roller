export function formatModifier(modifier) {
    if (modifier === 0) return '';
    return ` <span class="modifier-display">${modifier > 0 ? '+' + modifier : modifier}</span>`;
  }
  
  export function formatDiceInput(notation, modifier) {
    return notation + formatModifier(modifier);
  }