/*
* UI UPDATES
*
* This file serves as a central export point for UI-related functionality.
* It is responsible for re-exporting UI components from their modular locations
* to provide a simplified import interface for other files.
*
* This file:
* 1. Exports input handling functionality (setupDiceInput)
* 2. Exports button interaction management (setupDiceButtons)
* 3. Exports display update functions (updateDisplay)
* 4. Re-exports relevant functions from specialized modules
*/

// Re-export UI components from their modular locations
export { setupDiceInput, setupRollButton } from './ui/input-handler';
export { setupDiceButtons } from './ui/button-handler';
export { updateDisplay } from './ui/display';

// Note: Animation functions are now handled through core-functions.js