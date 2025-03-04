// PART 1: INITIALIZE & BASIC DICE FUNCTIONS
(function() {
    // Global state: selected dice, current roll results, and modifier.
    let selectedDice = [];  // e.g., ["d4", "d6", "d6"]
    let currentRolls = [];
    let modifier = 0;

    // Expose functions for global key handling.
    let performRoll, clearAll;

    // Utility functions.
    function showElement(el) { el.style.display = 'block'; }
    function hideElement(el) { el.style.display = 'none'; }

    // Roll a single die (e.g., "d4").
    function rollSingleDie(die) {
        const sides = parseInt(die.slice(1), 10);
        return Math.floor(Math.random() * sides) + 1;
    }

    // Roll all selected dice.
    function rollAllDice() {
        currentRolls = selectedDice.map(die => rollSingleDie(die));
    }

    // Compute the dice notation (e.g., "2d4+1d6") from selectedDice.
    function computeNotation() {
        const counts = {};
        selectedDice.forEach(die => { 
            counts[die] = (counts[die] || 0) + 1; 
        });
        return Object.entries(counts)
            .map(([die, count]) => `${count}${die}`)
            .join('+');
    }

    // Compute the total of all current rolls plus the modifier.
    function computeTotal() {
        return currentRolls.reduce((sum, val) => sum + val, 0) + modifier;
    }

    // PART 2: ANIMATE RESULTS AND DISPLAY FINAL OUTPUT
    function animateResults(finalResults, finalTotal, duration) {
        const resultsRollsEl = document.getElementById("results-rolls");
        const resultsTotalEl = document.getElementById("results-total");
        const intervalTime = 50; // Update every 50ms.
        const iterations = Math.floor(duration / intervalTime);
        let counter = 0;

        // Save the existing modifier HTML to reapply after the animation
        const existingModifierHTML = resultsRollsEl.innerHTML.includes('modifier-display') 
            ? resultsRollsEl.innerHTML.split('<span')[1]
            : '';

        const interval = setInterval(() => {
            const tempResults = selectedDice.map(die => {
                const sides = parseInt(die.slice(1), 10);
                return Math.floor(Math.random() * sides) + 1;
            });
            // Display temporary results with preserved modifier styling
            resultsRollsEl.innerHTML = tempResults.join(' ') + (existingModifierHTML ? `<span${existingModifierHTML}` : "");
            counter++;

            if (counter >= iterations) {
                clearInterval(interval);
                let rollText = finalResults.join(' ');
                if (modifier !== 0) {
                    rollText += modifier > 0 
                        ? ` <span class="modifier-display">+${modifier}</span>` 
                        : ` <span class="modifier-display">${modifier}</span>`;
                }
                resultsRollsEl.innerHTML = rollText;
                resultsTotalEl.innerHTML = `<div style="font-weight:bold; font-size:16px; text-align:center;">TOTAL</div>
                                              <div style="font-weight:bold; font-size:18px; text-align:center; margin-top:2px;">${finalTotal}</div>`;
            }
        }, intervalTime);
    }

    // PARTS 3–6: HTML STRUCTURE
    // These parts are assumed to be in your HTML file or dynamically generated elsewhere.

// PART 7: INITIALIZE DICE ROLLER AND ATTACH EVENT LISTENERS
function initDiceRoller() {
    const diceContainer = document.getElementById('dice-roller');
    const closeButton = document.getElementById('close-dice-roller');
    const rollButton = document.getElementById('roll-button');
    const clearButton = document.getElementById('clear-button');
    const resultsContainer = document.getElementById('results-container');
    const diceButtons = document.querySelectorAll('.dice-btn');
    const diceInput = document.getElementById('dice-input');
    const subtractButton = document.getElementById('subtract-modifier');
    const addButton = document.getElementById('add-modifier');
    const modifierInput = document.getElementById('modifier-value');

    if (!diceContainer || !closeButton || !rollButton || !clearButton || !resultsContainer ||
        !diceButtons || !diceInput || !subtractButton || !addButton || !modifierInput) {
        console.error('Dice Roller elements not found!');
        return;
    }

    function updateModifierDisplay() {
        const modifierDisplay = document.getElementById('modifier-overlay');
        modifierDisplay.textContent = (modifier >= 0 ? '+' : '') + modifier;
    }

    // Add press animation so that the up/down image shrinks to 90% when pressed
    function addPressAnimation(button) {
        const buttonImage = button.querySelector('img');
        if (!buttonImage) return;

        // Mouse events
        button.addEventListener('mousedown', () => {
            buttonImage.style.transform = 'scale(0.9)';
        });
        button.addEventListener('mouseup', () => {
            buttonImage.style.transform = 'scale(1)';
        });
        button.addEventListener('mouseleave', () => {
            buttonImage.style.transform = 'scale(1)';
        });

        // Touch events
        button.addEventListener('touchstart', () => {
            buttonImage.style.transform = 'scale(0.9)';
        });
        button.addEventListener('touchend', () => {
            buttonImage.style.transform = 'scale(1)';
        });
    }

    addPressAnimation(document.getElementById("add-modifier"));
    addPressAnimation(document.getElementById("subtract-modifier"));

    diceInput.removeAttribute("readonly");
    diceInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // Process only the dice notation (ignore appended modifier text).
            const input = diceInput.value.trim().split(" ")[0];
            const pattern = /(\d+[dD]\d+)/g;
            const matches = input.match(pattern);
            if (matches) {
                selectedDice = [];
                matches.forEach(group => {
                    const parts = group.match(/(\d+)([dD]\d+)/);
                    if (parts) {
                        const count = parseInt(parts[1], 10);
                        const die = parts[2].toLowerCase();
                        for (let i = 0; i < count; i++) {
                            selectedDice.push(die);
                        }
                    }
                });
                performRoll();
            }
            diceInput.blur();
        }
    });

    modifierInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            modifierInput.blur();
        }
    });

    function handleModifierChange(increment) {
        return function(e) {
            e.preventDefault();
            let value = parseInt(modifierInput.value) || 0;
            value += increment;
            modifier = value;
            modifierInput.value = value >= 0 ? `+${value}` : `${value}`;
            document.getElementById("modifier-value").textContent =
                value >= 0 ? `+${value}` : value;
            updateDisplay();
            this.blur();
        };
    }

    addButton.addEventListener('click', handleModifierChange(1));
    addButton.addEventListener('touchstart', handleModifierChange(1));
    subtractButton.addEventListener('click', handleModifierChange(-1));
    subtractButton.addEventListener('touchstart', handleModifierChange(-1));
}


        modifierInput.addEventListener("keydown", (e) => { ... });  
        // PART 8: ENTER KEY HANDLING & MODIFIER UPDATES
        modifierInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                modifierInput.blur();
            }
        });

        function updateModifierDisplay() {
            const modifierDisplay = document.getElementById('modifier-overlay');
            modifierDisplay.textContent = (modifier >= 0 ? '+' : '') + modifier;
        }

        function handleModifierChange(increment) {
            return function(e) {
                e.preventDefault();
                let value = parseInt(modifierInput.value) || 0;
                value += increment;
                modifier = value;
                modifierInput.value = value >= 0 ? `+${value}` : `${value}`;
                document.getElementById("modifier-value").textContent =
                    value >= 0 ? `+${value}` : value;
                updateDisplay();
                this.blur();
            };
        }

        addButton.addEventListener('click', handleModifierChange(1));
        addButton.addEventListener('touchstart', handleModifierChange(1));
        subtractButton.addEventListener('click', handleModifierChange(-1));
        subtractButton.addEventListener('touchstart', handleModifierChange(-1));

        function updateDisplay() {
            const notation = computeNotation();
            const diceInput = document.getElementById('dice-input');
            diceInput.value = notation + (modifier !== 0 ? (modifier > 0 ? " +" + modifier : " " + modifier) : "");

            const resultsRollsEl = document.getElementById('results-rolls');
            resultsRollsEl.innerHTML = notation.trim() !== "" 
                ? notation + (modifier !== 0 
                    ? (modifier > 0 
                        ? ` <span class="modifier-display">+${modifier}</span>` 
                        : ` <span class="modifier-display">${modifier}</span>`) 
                    : "") 
                : (modifier !== 0 
                    ? (modifier > 0 
                        ? `<span class="modifier-display">+${modifier}</span>` 
                        : `<span class="modifier-display">${modifier}</span>`) 
                    : "");
        }

        // PART 9: ROLL AND CLEAR BUTTONS – EVENT HANDLING
        function performRoll() {
            if (selectedDice.length === 0) return;
            const uniqueDice = [...new Set(selectedDice)];
            uniqueDice.forEach(die => {
                const btn = document.querySelector(`.dice-btn[data-dice="${die}"]`);
                if (btn) {
                    btn.classList.add("spin");
                    setTimeout(() => { btn.classList.remove("spin"); }, 500);
                }
            });
            rollAllDice();
            animateResults(currentRolls, computeTotal(), 500);
            updateDisplay();
        }

        diceButtons.forEach(button => {
            function handleDice(e) {
                e.preventDefault();
                selectedDice.push(button.dataset.dice);
                performRoll();
            }
            button.addEventListener('click', handleDice);
            button.addEventListener('touchstart', handleDice);
        });

        rollButton.addEventListener('click', performRoll);
        rollButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            performRoll();
        });

        function clearAll() {
            selectedDice = [];
            currentRolls = [];
            modifier = 0;
            pendingNumber = "";
            modifierInput.value = "+0";
            updateDisplay();
            document.getElementById("results-rolls").textContent = "";
            document.getElementById("results-total").textContent = "";
        }

        clearButton.addEventListener('click', clearAll);
        clearButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            clearAll();
        });

        closeButton.addEventListener('click', () => hideElement(diceContainer));
        closeButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            hideElement(diceContainer);
        });

        document.addEventListener('click', (e) => {
            const diceBtn = document.getElementById('dice-roller-button');
            if (diceContainer && !diceContainer.contains(e.target) && e.target !== diceBtn) {
                hideElement(diceContainer);
            }
        });
    }

    // PART 10: GLOBAL KEYBOARD HANDLER & DRAGGABLE CONTAINER
    document.addEventListener('keydown', (e) => {
        const activeElem = document.activeElement;
        const diceContainerStyle = document.getElementById('dice-roller').style;
        if (diceContainerStyle.display === 'block' && e.key === "Enter" && activeElem.id !== "dice-input") {
            e.preventDefault();
            if(activeElem) activeElem.blur();
            performRoll();
        } else if ((e.key === "Backspace" || e.key === "Delete") &&
                   diceContainerStyle.display === 'block' &&
                   activeElem.id !== "dice-input") {
            e.preventDefault();
            clearAll();
        } else if (e.key === "Escape") {
            e.preventDefault();
            clearAll();
            diceContainer.style.top = "50%";
            diceContainer.style.left = "50%";
            diceContainer.style.transform = "translate(-50%, -50%)";
            hideElement(diceContainer);
        }
    });

    updateDisplay();

    function makeContainerDraggable(container) {
        let isDragging = false;
        let startX, startY, origX, origY;

        // Mouse drag support
        container.addEventListener("mousedown", (e) => {
            if (["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            origX = container.offsetLeft;
            origY = container.offsetTop;

            function onMouseMove(e) {
                if (!isDragging) return;
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;
                container.style.left = (origX + dx) + "px";
                container.style.top = (origY + dy) + "px";
            }

            function onMouseUp() {
                isDragging = false;
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        // PART 11: TOUCH DRAG SUPPORT
        container.addEventListener("touchstart", (e) => {
            if (["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
            e.preventDefault();
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            origX = container.offsetLeft;
            origY = container.offsetTop;

            function onTouchMove(e) {
                if (!isDragging) return;
                const touch = e.touches[0];
                let dx = touch.clientX - startX;
                let dy = touch.clientY - startY;
                container.style.left = (origX + dx) + "px";
                container.style.top = (origY + dy) + "px";
            }

            function onTouchEnd() {
                isDragging = false;
                container.removeEventListener("touchmove", onTouchMove);
                container.removeEventListener("touchend", onTouchEnd);
            }

            container.addEventListener("touchmove", onTouchMove);
            container.addEventListener("touchend", onTouchEnd);
        });
    }

    // PART 12: DOM LOADING AND DIGIT BUTTON LOGIC
    function setupDiceRoller() {
        const outerContainer = document.getElementById('dice-roller-container');
        if (!outerContainer) {
            console.error('#dice-roller-container not found!');
            return;
        }
        let diceUI = document.getElementById('dice-roller');
        if (!diceUI) {
            diceUI = createDiceRollerUI();
            outerContainer.appendChild(diceUI);
            initDiceRoller();
            makeContainerDraggable(diceUI);
        }
    }

    document.addEventListener('DOMContentLoaded', setupDiceRoller);

    // Launcher button handling (both click and touch)
    document.addEventListener('click', function(e) {
        if (e.target.id === 'dice-roller-button' || e.target.closest('#dice-roller-button')) {
            e.stopPropagation();
            const diceContainer = document.getElementById('dice-roller');
            if (diceContainer) {
                if (diceContainer.style.display === 'block') {
                    hideElement(diceContainer);
                } else {
                    showElement(diceContainer);
                }
            }
        }
    });

    // PART 13: NUMBER LOGIC – DIGIT AND DICE BUTTONS
    var pendingNumber = "";

    document.querySelectorAll('#digit-column .digit-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            button.style.transform = "scale(0.9)";
            setTimeout(() => { button.style.transform = "scale(1)"; }, 100);

            var digit = button.textContent.trim();
            pendingNumber += digit;

            var committedNotation = computeNotation();

            var diceInput = document.getElementById('dice-input');
            diceInput.value = committedNotation;
            if (pendingNumber !== "") {
                if (committedNotation !== "") {
                    diceInput.value += "+";
                }
                diceInput.value += pendingNumber;
            }

            console.log("Pending number: " + pendingNumber);
        });
    });

    document.querySelectorAll('.dice-btn').forEach(function(dieButton) {
        dieButton.addEventListener('click', function() {
            var diceInput = document.getElementById("dice-input");

            var committedNotation = computeNotation();

            if (pendingNumber !== "") {
                diceInput.value = "";
                if (committedNotation !== "") {
                    diceInput.value = committedNotation + "+";
                }
                diceInput.value += pendingNumber + this.dataset.dice;
                pendingNumber = "";
            } else {
                if (committedNotation !== "") {
                    diceInput.value = committedNotation + "+" + this.dataset.dice;
                } else {
                    diceInput.value = this.dataset.dice;
                }
            }

            console.log("Dice input updated: " + diceInput.value);
        });
    });

    // PART 14: TOUCH HANDLING FOR APPLET VISIBILITY
    document.addEventListener('touchstart', function(e) {
        if (e.target.id === 'dice-roller-button' || e.target.closest('#dice-roller-button')) {
            e.stopPropagation();
            const diceContainer = document.getElementById('dice-roller');
            if (diceContainer) {
                if (diceContainer.style.display === 'block') {
                    hideElement(diceContainer);
                } else {
                    showElement(diceContainer);
                }
            }
        }
    });
})();
