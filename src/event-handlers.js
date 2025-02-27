import { state, addDie, clearDice, setModifier, clearResults } from './state';
import { rollAllDice, computeTotal, parseDiceNotation } from './dice-logic';
import { updateDisplay, animateResults } from './ui-updates';

function minimizeAndReset(container) {
    container.style.display = 'none';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    clearDice();
    clearResults();
    setModifier(0);
    updateDisplay();
}

export function setupEventListeners() {
    const rollButton = document.getElementById('roll-button');
    const clearButton = document.getElementById('clear-button');
    const addModifierBtn = document.getElementById('add-modifier');
    const subtractModifierBtn = document.getElementById('subtract-modifier');
    const dieButtons = document.querySelectorAll('.die-button');
    const diceInput = document.getElementById('dice-input');
    const toggleAppletBtn = document.getElementById('dice-roller-button');
    const closeAppletBtn = document.getElementById('close-applet');
    const diceContainer = document.getElementById('dice-applet');

    // Handle clicking outside
    document.addEventListener('click', (e) => {
        if (diceContainer && 
            !diceContainer.contains(e.target) && 
            e.target !== toggleAppletBtn) {
            minimizeAndReset(diceContainer);
        }
    });

    // Global keyboard events
    document.addEventListener('keydown', (e) => {
        if (!diceContainer || diceContainer.style.display === 'none') return;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                rollAllDice();
                animateResults(state.currentRolls, computeTotal(), 500);
                updateDisplay();
                break;
            case 'Backspace':
            case 'Delete':
                e.preventDefault();
                clearDice();
                clearResults();
                setModifier(0);
                updateDisplay();
                break;
            case 'Escape':
                e.preventDefault();
                minimizeAndReset(diceContainer);
                break;
        }
    });

    if (toggleAppletBtn) {
        toggleAppletBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (diceContainer) {
                if (diceContainer.style.display === 'none' || diceContainer.style.display === '') {
                    diceContainer.style.display = 'flex';
                } else {
                    minimizeAndReset(diceContainer);
                }
            }
        });
    }

    if (closeAppletBtn) {
        closeAppletBtn.addEventListener('click', () => {
            minimizeAndReset(diceContainer);
        });
    }

    if (rollButton) {
        rollButton.addEventListener('click', () => {
            rollAllDice();
            animateResults(state.currentRolls, computeTotal(), 500);
            updateDisplay();
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            clearDice();
            clearResults();
            setModifier(0);
            updateDisplay();
        });
    }

    if (addModifierBtn) {
        addModifierBtn.addEventListener('click', () => {
            setModifier(state.modifier + 1);
            updateDisplay();
        });
    }

    if (subtractModifierBtn) {
        subtractModifierBtn.addEventListener('click', () => {
            setModifier(state.modifier - 1);
            updateDisplay();
        });
    }

    dieButtons.forEach(button => {
        button.addEventListener('click', () => {
            const die = button.dataset.die;
            addDie(die);
            rollAllDice();
            animateResults(state.currentRolls, computeTotal(), 500);
            updateDisplay();
        });
    });

    // Handle dice notation input
    diceInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const parsed = parseDiceNotation(diceInput.value);
            if (parsed) {
                clearDice();
                parsed.dice.forEach(die => addDie(die));
                setModifier(parsed.modifier);
                rollAllDice();
                animateResults(state.currentRolls, computeTotal(), 500);
                updateDisplay();
            }
        }
    });
}