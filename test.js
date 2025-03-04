//PART 1: INITIALIZE & BASIC DICE FUNCTIONS
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

// PART 2: ANIMATE RESULTS & DISPLAY FINAL OUTPUT
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
})();

//PART 3: HTML - DIGIT BUTTONS AND INPUT ROW
<!-- Outer container: set a fixed width that is the sum of the left column (35px) and the original applet (225px) -->
<div id="app-container" style="display: flex; width: 260px; margin: 0 auto;">
  
  <!-- Left Column: Digit Buttons (35px wide) -->
  <div id="digit-column" style="width:35px; display: flex; flex-direction: column; justify-content: space-evenly; background-color:#ffffff;">
    <button class="digit-btn" style="border:1px solid #ccc; background:#fff; padding:2px; font-size:14px; color:#000; cursor:pointer;">0</button>
    <button class="digit-btn" style="border:1px solid #ccc; background:#fff; padding:2px; font-size:14px; color:#000; cursor:pointer;">1</button>
    <button class="digit-btn" style="border:1px solid #ccc; background:#fff; padding:2px; font-size:14px; color:#000; cursor:pointer;">2</button>
    <button class="digit-btn" style="border:1px solid #ccc; background:#fff; padding:2px; font-size:14px; color:#000; cursor:pointer;">3</button>
    <button class="digit-btn" style="border:1px solid #ccc; background:#fff; padding:2px; font-size:14px; color:#000; cursor:pointer;">4</button>
    <button class="digit-btn" style="border:1px solid #ccc; background:#fff; padding:2px; font-size:14px; color:#000; cursor:pointer;">5</button>
    <button class="digit-btn" style="border:1px solid #ccc; background:#fff; padding:2px; font-size:14px; color:#000; cursor:pointer;">6</button>
    <button class="digit-btn" style="border:1px solid #ccc; background:#fff; padding:2px; font-size:14px; color:#000; cursor:pointer;">7</button>
    <button class="digit-btn" style="border:1px solid #ccc; background:#fff; padding:2px; font-size:14px; color:#000; cursor:pointer;">8</button>
    <button class="digit-btn" style="border:1px solid #ccc; background:#fff; padding:2px; font-size:14px; color:#000; cursor:pointer;">9</button>
  </div>
  
  <!-- Right Column: The Original Dice Roller Applet (225px wide) -->
  <div id="dice-roller-applet" style="width:225px; margin-left:0;">
    <!-- Top Banner: 15px high white banner with 15px bottom margin -->
    <div style="height:15px; background-color:#ffffff; margin-bottom:15px;"></div>
    
    <!-- Input Row with close button, 20px margin-bottom -->
    <div style="position: relative; margin-bottom:20px;">
      <input type="text" id="dice-input" placeholder="Dice notation"
             style="width:100%; padding:5px; box-sizing:border-box; background-color:#f0f0f0; margin:0; color:#000; font-weight:normal; border-radius:0; border:0;" />
      <!-- Modifier overlay for input (for red, bold modifiers if needed) -->
      <div id="modifier-input-overlay" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); pointer-events:none; font-size:16px; font-weight:bold; color:red;"></div>
      <!-- Close button repositioned (at -44px top, -20px right) -->
      <button id="close-dice-roller" style="position:absolute; top:-44px; right:-20px; background:none; border:none; font-size:20px; color:#000; cursor:pointer;">X</button>
    </div>
    
   <!-- PART 4: HTML - DICE BUTTONS -->
    <!-- First row of dice icons (d4, d6, d8) with 20px margin-bottom -->
    <div style="margin-bottom:20px;">
      <table style="width:100%; border-collapse:collapse; border-spacing:0; background-color:#ffffff;">
        <tr>
          <td style="text-align:center; padding:3px 0;">
            <img src="https://annotatedtoa.com/wp-content/uploads/2025/02/d4.png" alt="d4" class="dice-btn" data-dice="d4"
                 style="width:40px; height:40px; cursor:pointer;" />
          </td>
          <td style="text-align:center; padding:3px 0;">
            <img src="https://annotatedtoa.com/wp-content/uploads/2025/02/d6.png" alt="d6" class="dice-btn" data-dice="d6"
                 style="width:40px; height:40px; cursor:pointer;" />
          </td>
          <td style="text-align:center; padding:3px 0;">
            <img src="https://annotatedtoa.com/wp-content/uploads/2025/02/d8.png" alt="d8" class="dice-btn" data-dice="d8"
                 style="width:40px; height:40px; cursor:pointer;" />
          </td>
        </tr>
      </table>
    </div>
    
    <!-- Second row of dice icons (d10, d12, d20) with 20px margin-bottom -->
    <div style="margin-bottom:20px;">
      <table style="width:100%; border-collapse:collapse; border-spacing:0; background-color:#ffffff;">
        <tr>
          <td style="text-align:center; padding:3px 0;">
            <img src="https://annotatedtoa.com/wp-content/uploads/2025/02/d10.png" alt="d10" class="dice-btn" data-dice="d10"
                 style="width:40px; height:40px; cursor:pointer;" />
          </td>
          <td style="text-align:center; padding:3px 0;">
            <img src="https://annotatedtoa.com/wp-content/uploads/2025/02/d12.png" alt="d12" class="dice-btn" data-dice="d12"
                 style="width:40px; height:40px; cursor:pointer;" />
          </td>
          <td style="text-align:center; padding:3px 0;">
            <img src="https://annotatedtoa.com/wp-content/uploads/2025/02/d20.png" alt="d20" class="dice-btn" data-dice="d20"
                 style="width:40px; height:40px; cursor:pointer;" />
          </td>
        </tr>
      </table>
    </div>

    <!-- PART 5: HTML - CONTROL ROW -->
    <!-- Control Row: Three equally spaced columns -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <!-- Left Column: Clear Button -->
      <div style="flex:1; text-align:center;">
        <button id="clear-button" class="depress-button" style="background:none; border:none; padding:0; cursor:pointer;">
          <img src="https://annotatedtoa.com/wp-content/uploads/2025/02/ban.png" alt="Clear" style="width:40px; height:40px;">
        </button>
      </div>
      <!-- Center Column: Reroll Button -->
      <div style="flex:1; text-align:center;">
        <button id="roll-button" class="depress-button" style="background:none; border:none; padding:0; cursor:pointer;">
          <img src="https://annotatedtoa.com/wp-content/uploads/2025/02/recycle.png" alt="Reroll" style="width:40px; height:40px;">
        </button>
      </div>
      <!-- Right Column: Modifier Section -->
      <div style="flex:1; text-align:center; position:relative; width:40px; height:56px; margin:0 auto;">
        <!-- Modifier Value Display (Layered on top of the buttons, remains black) -->
        <span id="modifier-value" 
              style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:16px; font-weight:bold; z-index:2; color:#000;">+0</span>
        <!-- Stacked Modifier Buttons (Behind the number) -->
        <div style="display:flex; flex-direction:column; gap:2px; position:absolute; top:0; left:0; width:100%; height:100%; z-index:1;">
          <!-- Increment Button -->
          <button id="add-modifier" class="depress-button" style="background:none; border:none; padding:0; cursor:pointer;">
            <img src="https://annotatedtoa.com/wp-content/uploads/2025/02/up2.png" alt="Increase Modifier" style="width:40px; height:28px;">
          </button>
          <!-- Decrement Button -->
          <button id="subtract-modifier" class="depress-button" style="background:none; border:none; padding:0; cursor:pointer;">
            <img src="https://annotatedtoa.com/wp-content/uploads/2025/02/down2.png" alt="Decrease Modifier" style="width:40px; height:28px;">
          </button>
        </div>
      </div>
    </div>
    
<!-- //PART 6: HTML - RESULTS AREA -->
    <!-- Results Area: Table with two cells, 80px tall; left cell displays TOTAL, right cell displays results -->
    <div id="results-container" style="width:100%; height:80px; background-color:#f0f0f0; padding:0; box-sizing:border-box; overflow:hidden; border:none;">
      <table style="width:100%; table-layout:fixed; border-collapse:collapse; border-spacing:0; border:none; height:100%; font-size:18px;">
        <tr style="vertical-align:top;">
          <!-- Left Cell: TOTAL box -->
          <td id="results-total" style="width:40%; text-align:center; vertical-align:top;">
            <div style="font-weight:bold; font-size:16px; text-align:center;">TOTAL</div>
            <div style="font-weight:bold; font-size:18px; text-align:center; margin-top:2px;">0</div>
          </td>
          <!-- Right Cell: Results -->
          <td id="results-rolls" style="width:60%; text-align:left; word-wrap:break-word; white-space:normal;"></td>
        </tr>
      </table>
    </div>
  </div>
</div>

        `;
        return container;
    }

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

//PART 8: ENTER KEY HANDLING & MODIFIER UPDATES
    // Prevent Enter key in modifier input from triggering roll.
    modifierInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            modifierInput.blur();
        }
    });

    // Replace references to modifier-value with modifier-overlay
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
            // Update the input dial (if you append modifier text there)
            modifierInput.value = value >= 0 ? `+${value}` : `${value}`;
            // ALSO update the control row modifier display (the black one)
            document.getElementById("modifier-value").textContent =
                value >= 0 ? `+${value}` : value;
            // Other UI updates
            updateDisplay();
            this.blur();
        };
    }
}

addButton.addEventListener('click', handleModifierChange(1));
addButton.addEventListener('touchstart', handleModifierChange(1));
subtractButton.addEventListener('click', handleModifierChange(-1));
subtractButton.addEventListener('touchstart', handleModifierChange(-1));

// --- UpdateDisplay Function Enhancement ---
// Ensures the modifier is always wrapped in a <span> with class="modifier-display"
function updateDisplay() {
    const notation = computeNotation();
    const diceInput = document.getElementById('dice-input');
    diceInput.value = notation + (modifier !== 0 ? (modifier > 0 ? " +" + modifier : " " + modifier) : "");

    const resultsRollsEl = document.getElementById('results-rolls');
    // Always include the modifier with styling, even if no dice are selected
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

//PART 9: ROLL AND CLEAR BUTTONS – EVENT HANDLING
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
    pendingNumber = ""; // Clear any digits entered via the left column
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

// PART 10: GLOBAL KEYBOARD HANDLER & DRAGGABLE CONTAINER
document.addEventListener('keydown', (e) => {
    const activeElem = document.activeElement;
    // If dice-roller is open and Enter is pressed and the active element is not the dice input,
    // force a roll (and blur the active element)
    const diceContainerStyle = document.getElementById('dice-roller').style;
    if (diceContainerStyle.display === 'block' && e.key === "Enter" && activeElem.id !== "dice-input") {
        e.preventDefault();
        if (activeElem) activeElem.blur();
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
}

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

// DIGIT-COLUMN LOGIC: Wrap your digit button behavior in an IIFE to avoid polluting global scope.
(function() { // Corrected IIFE opening
    // Global variable to hold the pending digit string
    var pendingNumber = "";

    // Attach event listeners to digit buttons in the left column
    document.querySelectorAll('#digit-column .digit-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            // Apply depression effect
            button.style.transform = "scale(0.9)";
            setTimeout(() => { button.style.transform = "scale(1)"; }, 100);

            // Get the digit from the button text
            var digit = button.textContent.trim();
            // Append it to the pending number
            pendingNumber += digit;

            // Update the dice input field
            var diceInput = document.getElementById('dice-input');
            if (diceInput.value.length > 0) {
                // Add a "+" separator if needed
                if (diceInput.value.slice(-1) !== "+") {
                    diceInput.value += "+";
                }
                diceInput.value += pendingNumber;
            } else {
                diceInput.value = pendingNumber;
            }

            console.log("Pending number: " + pendingNumber); // Debugging log
        });
    });
})(); // Corrected IIFE closing


// PART 13: NUMBER LOGIC – DIGIT AND DICE BUTTONS
// Global variable to hold the pending digit string (quick multiplier)
var pendingNumber = "";

// Attach event listeners to digit buttons in the left column
document.querySelectorAll('#digit-column .digit-btn').forEach(function(button) {
    button.addEventListener('click', function() {
        // Apply depression effect
        button.style.transform = "scale(0.9)";
        setTimeout(() => { button.style.transform = "scale(1)"; }, 100);

        // Get the digit from the button text
        var digit = button.textContent.trim();
        // Append it to pendingNumber (e.g., pressing "1" twice produces "11")
        pendingNumber += digit;

        // Get the current committed dice notation
        var committedNotation = computeNotation();

        // Update the dice input field
        var diceInput = document.getElementById('dice-input');
        diceInput.value = committedNotation;
        if (pendingNumber !== "") {
            // If there's already committed notation, separate it with a plus
            if (committedNotation !== "") {
                diceInput.value += "+";
            }
            diceInput.value += pendingNumber;
        }

        console.log("Pending number: " + pendingNumber); // Debugging log
    });
});

// Attach event listeners to dice buttons in the right column
document.querySelectorAll('.dice-btn').forEach(function(dieButton) {
    dieButton.addEventListener('click', function() {
        var diceInput = document.getElementById("dice-input");

        // Get the current committed dice notation
        var committedNotation = computeNotation();

        // If there's a pending multiplier, combine it with the die notation
        if (pendingNumber !== "") {
            // Rebuild the input field with committed notation + multiplier + die
            diceInput.value = "";
            if (committedNotation !== "") {
                diceInput.value = committedNotation + "+";
            }
            diceInput.value += pendingNumber + this.dataset.dice;
            // Clear pendingNumber after use
            pendingNumber = "";
        } else {
            // If no pending multiplier, simply append the die notation
            if (committedNotation !== "") {
                diceInput.value = committedNotation + "+" + this.dataset.dice;
            } else {
                diceInput.value = this.dataset.dice;
            }
        }

        console.log("Dice input updated: " + diceInput.value); // Debugging log
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
