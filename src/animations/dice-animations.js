/*
* DICE ANIMATIONS
* 
* This file manages all visual animations related to dice rolling.
* It is responsible for coordinating the visual feedback when dice are rolled,
* including spinning dice icons and transitioning result numbers.
* It receives all necessary data through parameters rather than accessing state directly.
*
* This file:
* 1. Animates dice button icons when rolling (animateDiceIcons)
* 2. Manages d10 percentile mode animations (resetD10State, animatePercentileRoll)
* 3. Handles number result animations in the results area (animateNumberResult)
* 4. Coordinates the animation of results and total display (animateResults)
*
* Last updated: March 2025
*/

// Import state management functions
import { 
  getAnimationSubtotal, 
  setAnimationSubtotal,
  hasPercentileState
} from '../state';

// Global flags to track state restoration process
window._isRestoringState = false;

/**
 * Check if a die type is a standard die (d4, d6, d8, d10, d12, d20)
 * @param {string} dieType - The type of die to check
 * @returns {boolean} Whether the die is standard
 */
function isStandardDie(dieType) {
  return ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].includes(dieType);
}

/**
 * Physics-based deceleration function
 * @param {number} t - Elapsed time in milliseconds
 * @param {number} p_f - Final position/angle
 * @param {number} A - Amplitude (typically final - initial)
 * @param {number} tau - Time constant controlling deceleration rate
 * @returns {number} - Current position/angle at time t
 */
function decelerate(t, p_f, A, tau) {
  return p_f - A * Math.exp(-t / tau);
}

/**
 * Animate an element's transform properties using physics-based deceleration
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 * @param {number} options.duration - Animation duration in ms
 * @param {number} options.tau - Time constant for deceleration
 * @param {Object} options.transforms - Transform properties to animate
 * @param {Object} options.transforms.rotation - Rotation properties
 * @param {number} options.transforms.rotation.start - Start angle in degrees
 * @param {number} options.transforms.rotation.end - End angle in degrees
 * @param {Object} options.transforms.translate - Translation properties
 * @param {Object} options.transforms.translate.x - X translation properties
 * @param {number} options.transforms.translate.x.start - Start X position
 * @param {number} options.transforms.translate.x.end - End X position
 * @param {Object} options.transforms.translate.y - Y translation properties
 * @param {number} options.transforms.translate.y.start - Start Y position
 * @param {number} options.transforms.translate.y.end - End Y position
 * @returns {string} - Animation ID for cancellation
 */
function animateTransform(element, elementId, options) {
  const {
    duration = 2000,
    tau = 325,
    transforms = {}
  } = options;

  const animationId = elementId;
  
  // Store animation reference
  if (!window.diceAnimations) {
    window.diceAnimations = {};
  }
  
  // Cancel existing animation for *this specific element*
  if (window.diceAnimations[animationId]) {
    cancelAnimationFrame(window.diceAnimations[animationId]);
    window.diceAnimations[animationId] = null;
  }
  
  // --- Disable CSS Transitions MORE Forcefully --- 
  const originalTransition = element.style.getPropertyValue('transition'); // Get existing value
  const originalPriority = element.style.getPropertyPriority('transition'); // Get !important status
  element.style.setProperty('transition', 'none', 'important'); // Force disable
  // ----------------------------------------------- 

  let startTime = null;
  
  function animateStep(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsedTime = timestamp - startTime;
    
    if (elapsedTime < duration) {
      const transform = [];
      let currentAngle = null;
      let currentX = null;
      let currentY = null;
      
      // Handle rotation
      if (transforms.rotation) {
        const { start, end } = transforms.rotation;
        const amplitude = end - start;
        currentAngle = decelerate(elapsedTime, end, amplitude, tau);
        transform.push(`rotate(${currentAngle}deg)`);
      }
      
      // Handle translation
      if (transforms.translate) {
        if (transforms.translate.x) {
          const { start, end } = transforms.translate.x;
          const amplitude = end - start;
          currentX = decelerate(elapsedTime, end, amplitude, tau);
          transform.push(`translateX(${currentX}px)`);
        }
        if (transforms.translate.y) {
          const { start, end } = transforms.translate.y;
          const amplitude = end - start;
          currentY = decelerate(elapsedTime, end, amplitude, tau);
          transform.push(`translateY(${currentY}px)`);
        }
      }
      
      // Apply transforms, adding translateZ(0) to hint at hardware acceleration
      const transformString = `${transform.join(' ')} translateZ(0)`; 
      element.style.transform = transformString;
      
      // Continue animation, storing frame ID under the element's unique ID
      window.diceAnimations[animationId] = requestAnimationFrame(animateStep);
    } else {
      // Ensure we end at exactly the final values
      const finalTransformArray = [];
      
      if (transforms.rotation) {
        finalTransformArray.push(`rotate(${transforms.rotation.end}deg)`);
      }
      if (transforms.translate) {
        if (transforms.translate.x) {
          finalTransformArray.push(`translateX(${transforms.translate.x.end}px)`);
        }
        if (transforms.translate.y) {
          finalTransformArray.push(`translateY(${transforms.translate.y.end}px)`);
        }
      }
      
      element.style.transform = `${finalTransformArray.join(' ')} translateZ(0)`; // Apply final with translateZ
      
      // Reset after a brief delay
      setTimeout(() => {
        // Clear the animation frame ID for this element
        if(window.diceAnimations && window.diceAnimations[animationId]) {
            window.diceAnimations[animationId] = null;
        }
        // --- Restore CSS Transitions --- 
        // Restore original value and priority
        element.style.setProperty('transition', originalTransition, originalPriority);
        // -----------------------------
      }, 50);
    }
  }
  
  // Start animation
  window.diceAnimations[animationId] = requestAnimationFrame(animateStep);
}

/**
 * Animate dice icons spinning with physics-based deceleration
 * @param {Array} diceToAnimate - Array of dice types to animate
 * @param {'initial' | 'reroll' | undefined} animationType - Specific type for percentile
 * @returns {number} - Animation duration in milliseconds
 */
export function animateDiceIcons(diceToAnimate, animationType) {
  // Skip animations completely if we're restoring state or animations are blocked
  if (window._isRestoringState || window._animationsBlocked) {
    return 0;
  }

  const durationMs = 2000;
  const finalAngle = 360 * 3; // 3 full spins in degrees
  
  diceToAnimate.forEach(dieType => {
    // --- Assign unique ID to button image elements --- 
    const getElementUniqueId = (element) => {
      if (element.dataset.animationId) return element.dataset.animationId;
      // Create a unique ID based on die type and potentially index if needed
      const baseId = `anim_${element.closest('.die-button')?.dataset.die || dieType}`;
      // For now, assume one image per button, refine if needed later
      const uniqueId = `${baseId}_img`; 
      element.dataset.animationId = uniqueId;
      return uniqueId;
    };
    // -------------------------------------------------

    // Special handling for d10/d00
    if (dieType === 'd10' || dieType === 'd00') {
      const d10ButtonEl = document.querySelector(`.die-button[data-die="d10"]`);
      if (d10ButtonEl) {
        if (dieType === 'd00') {
          // For percentile, use animateD10, passing the explicit animationType
          animateD10(d10ButtonEl, true, animationType); // Pass animationType directly
        } else {
          // For standard d10, animate the main die
          const mainDieEl = d10ButtonEl.querySelector('.main-die img');
          if (mainDieEl) {
            const elementId = getElementUniqueId(mainDieEl);
            animateTransform(mainDieEl, elementId, {
              duration: durationMs,
              transforms: {
                rotation: {
                  start: 0,
                  end: finalAngle
                }
              }
            });
          }
        }
      }
    } else {
      // Standard dice handling
      const dieButtonsEl = document.querySelectorAll(`.die-button[data-die="${dieType}"] img`);
      dieButtonsEl.forEach((button, index) => {
        const elementId = getElementUniqueId(button);
        animateTransform(button, elementId, {
          duration: durationMs,
          transforms: {
            rotation: {
              start: 0,
              end: finalAngle
            }
          }
        });
      });
    }
  });
  
  return durationMs;
}

/**
 * Generate a random number for a specific die type
 * @param {string} dieType - Type of die (e.g., 'd20', 'd6')
 * @returns {number|string} - Random number appropriate for the die type
 */
function getRandomValueForDie(dieType) {
  if (!dieType) {
    return 0;
  }

  // Handle percentile special cases
  if (dieType === 'd10-tens') {
    // Returns 00, 10, 20, ..., 90
    const tens = Math.floor(Math.random() * 10);
    return (tens * 10).toString().padStart(2, '0');
  } else if (dieType === 'd10-ones') {
    // Returns 0-9
    return Math.floor(Math.random() * 10);
  }
  
  // Standard dice - ensure we have a valid die type
  const match = dieType.match(/d(\d+)/);
  if (!match) {
    return 0;
  }
  
  const sides = parseInt(match[1], 10);
  if (isNaN(sides) || sides <= 0) {
    return 0;
  }
  
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Animate a single number result with randomization effect
 * @param {HTMLElement} element - Element to animate
 * @param {number|string} finalValue - Final value to display
 * @param {string} dieType - Type of die for styling
 * @param {number} durationMs - Animation duration
 */
function animateNumberResult(element, finalValue, dieType, durationMs) {
  // Ensure element is visible and styled
  element.style.opacity = '1';
  element.style.visibility = 'visible';
  element.dataset.die = dieType;
  
  // Animation parameters based on rules
  const numberAnimDuration = 1000; // Numbers settle after 1000ms
  const tau = 325; // Time constant for deceleration
  
  // Animation state tracking
  let startTime = null;
  let lastValue = getRandomValueForDie(dieType);
  let animationFrameId = null;
  
  // Set initial random value
  element.textContent = lastValue;
  
  // Capture initial style state
  const initialState = captureStyleState(element);
  
  function updateNumber(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    
    if (elapsed < numberAnimDuration) {
      // Calculate deceleration progress (0 to 1)
      const progress = decelerate(elapsed, 1, 1, tau);
      
      // Probability of showing final value increases with decelerated progress
      const showFinal = Math.random() < Math.pow(progress, 3);
      
      if (showFinal) {
        if (dieType === 'd10-tens' && typeof finalValue === 'number') {
          element.textContent = finalValue.toString().padStart(2, '0');
        } else {
          element.textContent = finalValue;
        }
      } else {
        // Generate new random value
        let newValue = getRandomValueForDie(dieType);
        
        // Ensure we don't show the same number twice
        while (newValue === lastValue) {
          newValue = getRandomValueForDie(dieType);
        }
        
        // Special formatting for percentile tens
        if (dieType === 'd10-tens') {
          newValue = newValue.toString().padStart(2, '0');
        }
        
        element.textContent = newValue;
        lastValue = newValue;
      }
      
      // Capture style state after update
      const currentState = captureStyleState(element);
      compareStyleStates(initialState, currentState, 'During Animation');
      
      // Continue animation
      animationFrameId = requestAnimationFrame(updateNumber);
    } else {
      // Ensure we end with the final value
      if (dieType === 'd10-tens' && typeof finalValue === 'number') {
        element.textContent = finalValue.toString().padStart(2, '0');
      } else {
        element.textContent = finalValue;
      }
      
      // Final style check
      const finalState = captureStyleState(element);
      compareStyleStates(initialState, finalState, 'Animation Complete');
      
      // Clean up
      animationFrameId = null;
    }
  }
  
  // Start animation
  animationFrameId = requestAnimationFrame(updateNumber);
  
  // Return a cleanup function
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}

/**
 * Track style changes
 * @param {HTMLElement} element - The element to track
 * @returns {Object} - Style state object
 */
function captureStyleState(element) {
  if (!element) return null;
  
  const computedStyle = window.getComputedStyle(element);
  
  return {
    transform: element.style.transform || computedStyle.transform,
    opacity: element.style.opacity || computedStyle.opacity,
    transition: element.style.transition || computedStyle.transition,
    display: element.style.display || computedStyle.display,
    visibility: element.style.visibility || computedStyle.visibility,
    classes: [...element.classList]
  };
}

/**
 * Add a style change entry to the tracking array
 * @param {Object} change - Change to add
 */
function trackStyleChange(change) {
  if (!window._styleChanges) {
    window._styleChanges = [];
  }
  
  // Don't log in production
}

/**
 * Compare two style states and log the differences
 * @param {Object} before - Style state before
 * @param {Object} after - Style state after
 * @param {string} context - Description of the change context
 */
function compareStyleStates(before, after, context) {
  if (!before || !after) return;
  
  const changes = {
    transform: before.transform !== after.transform,
    opacity: before.opacity !== after.opacity,
    transition: before.transition !== after.transition,
    display: before.display !== after.display,
    visibility: before.visibility !== after.visibility,
    classes: before.classes.join(',') !== after.classes.join(',')
  };
  
  const details = {
    transform: changes.transform ? { from: before.transform, to: after.transform } : null,
    opacity: changes.opacity ? { from: before.opacity, to: after.opacity } : null,
    transition: changes.transition ? { from: before.transition, to: after.transition } : null,
    display: changes.display ? { from: before.display, to: after.display } : null,
    visibility: changes.visibility ? { from: before.visibility, to: after.visibility } : null,
    classes: changes.classes ? { 
      removed: before.classes.filter(c => !after.classes.includes(c)),
      added: after.classes.filter(c => !before.classes.includes(c))
    } : null
  };
  
  // Filter out null entries
  Object.keys(details).forEach(key => {
    if (details[key] === null) {
      delete details[key];
    }
  });
  
  // Don't log in production
}

/**
 * Animate roll results and total
 * @param {Object} animationData - Data needed for animation
 * @param {Array} animationData.rolls - Array of roll results
 * @param {Array} animationData.diceTypes - Array of corresponding dice types
 * @param {number} animationData.total - Final total to display
 * @param {number} durationMs - Animation duration
 */
export function animateResults({ rolls, diceTypes, total }, durationMs) {
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  
  if (!resultsRollsEl || !resultsTotalEl) {
    return;
  }
  
  // Clear existing results
  resultsRollsEl.innerHTML = '';
  
  // Animation sequence timing
  const numberAnimDuration = 1000; // Numbers animate for 1s
  const totalUpdateDelay = durationMs - 1000;
  
  // Create and animate result boxes
  rolls.forEach((roll, index) => {
    const dieType = diceTypes?.[index] || 'd6';
    
    // Create roll box with proper structure
    const rollBox = document.createElement('div');
    rollBox.className = 'roll-box';
    rollBox.dataset.die = dieType;
    
    // Create number display element
    const numberDisplay = document.createElement('span');
    numberDisplay.className = 'roll-value';
    
    // Capture initial state before DOM insertion
    const initialState = captureStyleState(numberDisplay);
    
    // Add to DOM
    rollBox.appendChild(numberDisplay);
    resultsRollsEl.appendChild(rollBox);
    
    // Capture state after DOM insertion
    const afterInsertionState = captureStyleState(numberDisplay);
    compareStyleStates(initialState, afterInsertionState, 'After DOM Insertion');
    
    // Set critical styles with RAF to ensure proper timing
    requestAnimationFrame(() => {
      // Force FOUC prevention
      numberDisplay.style.opacity = '1';
      numberDisplay.style.visibility = 'visible';
      numberDisplay.style.fontSize = 'var(--font-size-large)';
      numberDisplay.style.fontWeight = 'bold';
      
      // Capture state after style application
      const afterStylesState = captureStyleState(numberDisplay);
      compareStyleStates(afterInsertionState, afterStylesState, 'After Style Application');
      
      // Start animation in next frame to ensure styles are applied
      requestAnimationFrame(() => {
        if (typeof roll === 'object' && roll.type) {
          // Percentile roll handling
          const isPercentile = roll.type.startsWith('d10-');
          if (isPercentile) {
            numberDisplay.dataset.die = roll.type;
            let displayValue = roll.value;
            if (roll.type === 'd10-tens') {
              displayValue = roll.value.toString().padStart(2, '0');
            }
            animateNumberResult(numberDisplay, displayValue, roll.type, durationMs);
          } else {
            animateNumberResult(numberDisplay, roll.value, roll.type, durationMs);
          }
        } else {
          animateNumberResult(numberDisplay, roll, dieType, durationMs);
        }
      });
    });
  });
  
  // Update total with proper timing
  if (resultsTotalEl) {
    setTimeout(() => {
      resultsTotalEl.style.transition = 'opacity 200ms ease-out';
      resultsTotalEl.style.opacity = '0';
      
      setTimeout(() => {
        const totalValue = resultsTotalEl.querySelector('.total-value');
        if (totalValue) {
          totalValue.textContent = total;
        }
        resultsTotalEl.style.transition = 'opacity 200ms ease-in';
        resultsTotalEl.style.opacity = '1';
      }, 250);
    }, totalUpdateDelay);
  }
}

/**
 * Animate d10 dice with physics-based deceleration
 * @param {HTMLElement} button - The d10 button element
 * @param {boolean} isPercentile - Whether in percentile mode
 * @param {'initial' | 'reroll' | undefined} animationType - Explicitly defines the animation required
 * @returns {number} - Animation duration in milliseconds
 */
export function animateD10(button, isPercentile = false, animationType) {
  const durationMs = 2000;
  const finalAngle = 360 * 3; // 3 full spins
  const tau = 325; // Match the tau value from animateTransform
  
  if (isPercentile) {
    // Percentile mode
    const coloredDice = button.querySelectorAll('.colored-die');
    const mainDieEl = button.querySelector('.main-die img'); // Target img
    
    // --- Ensure elements have unique IDs ---
    const getElementUniqueId = (element) => {
      if (element.dataset.animationId) return element.dataset.animationId;
      const baseId = `anim_${button.dataset.die || 'd10'}`;
      const role = element.classList.contains('colored-die') ? 
                   (element.classList.contains('blue') ? 'blue' : 'red') : 
                   'main';
      const uniqueId = `${baseId}_${role}_img`;
      element.dataset.animationId = uniqueId;
      return uniqueId;
    };
    // -------------------------------------

    // Use animationType to determine which block to run
    if (animationType === 'initial') {
      coloredDice.forEach((die, index) => {
        const dieImg = die;
        if (!dieImg) return;
        const elementId = getElementUniqueId(dieImg);
        const isLeft = die.classList.contains('blue');
        animateTransform(dieImg, elementId, {
          duration: durationMs,
          tau,
          transforms: {
            rotation: { start: 0, end: finalAngle },
            translate: { x: { start: 0, end: isLeft ? -15 : 15 } }
          }
        });
        
        setTimeout(() => { die.style.opacity = '1'; }, 50);
      });
      
      // Hide main die
      if (mainDieEl) {
          mainDieEl.style.opacity = '0';
          // Optionally cancel any rotation animation on the main die img
          const mainDieId = getElementUniqueId(mainDieEl);
          if (window.diceAnimations && window.diceAnimations[mainDieId]) {
              cancelAnimationFrame(window.diceAnimations[mainDieId]);
              window.diceAnimations[mainDieId] = null;
          }
      }
    } else {
      // Assumed to be 'reroll' or undefined (treat as reroll)
      const getTranslateX = (el) => {
        const transform = el.style.transform || '';
        const match = transform.match(/translateX\(([-\d.]+)px\)/);
        return match ? parseFloat(match[1]) : 0;
      };

      coloredDice.forEach(die => {
        const dieImg = die; // die is the img element
        if (!dieImg) {
           return; 
        }
        
        const elementId = getElementUniqueId(dieImg);
        const currentX = getTranslateX(dieImg); // Get the current horizontal position

        // --- Animate Rotation Only, Preserve Translation ---
        animateTransform(dieImg, elementId, {
          duration: durationMs,
          tau,
          transforms: {
            rotation: { start: finalAngle, end: finalAngle * 2 }, // Spin from previous end angle
            translate: { x: { start: currentX, end: currentX } } // Keep X translation fixed
          }
        });
        // ---------------------------------------------------
      });
    }
  }
  
  return durationMs;
}

/**
 * Reset the d10 button back to its original state
 * @param {HTMLElement} button - The d10 button element to reset
 */
export function resetD10State(button) {
  if (!button) return;
  
  // Remove percentile classes
  button.classList.remove('percentile-active');
  
  // Reset main die
  const mainDie = button.querySelector('.main-die');
  if (mainDie) {
    mainDie.style.opacity = '1';
  }
  
  // Reset colored dice
  const coloredDice = button.querySelectorAll('.red-die, .blue-die');
  coloredDice.forEach(die => {
    die.style.transform = '';
    die.style.opacity = '0';
  });
}

/**
 * Create a function to get random values for non-standard dice types
 * @param {number} count - Number of values to generate
 * @param {number} sides - Number of sides on the die
 * @returns {Array} - Array of random values
 */
function getRandomValuesArray(count, sides) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
}

/**
 * Apply final percentile visual state without animations
 * @param {HTMLElement} button - The d10 button element
 */
export function applyPercentileFinalState(button) {
  if (!button) return;
  
  // Add percentile class
  button.classList.add('percentile-active');
  
  // Hide main die
  const mainDie = button.querySelector('.main-die');
  if (mainDie) {
    mainDie.style.opacity = '0';
  }
  
  // Position and show colored dice
  const redDie = button.querySelector('.red-die');
  const blueDie = button.querySelector('.blue-die');
  
  if (redDie) {
    redDie.style.transform = 'translateX(15px)';
    redDie.style.opacity = '1';
  }
  
  if (blueDie) {
    blueDie.style.transform = 'translateX(-15px)';
    blueDie.style.opacity = '1';
  }
}

/**
 * A function to restore animation state after app is maximized
 * This is used to skip animations when the app window is restored
 */
export function restoreAnimationState() {
  window._isRestoringState = true;
  
  // Check if we need to restore percentile mode
  if (hasPercentileState()) {
    const d10ButtonEl = document.querySelector('.die-button[data-die="d10"]');
    if (d10ButtonEl) {
      applyPercentileFinalState(d10ButtonEl);
    }
  }
  
  // After a short delay, restore the ability to animate
  setTimeout(() => {
    window._isRestoringState = false;
  }, 500);
}

// Add a global handler for window focus to restore animation state if needed
window.addEventListener('focus', () => {
  restoreAnimationState();
});

// Exposes utility function for testing if needed
window._testDecelerateFunction = decelerate;

// Block or unblock animations globally
export function setAnimationsBlocked(blocked) {
  window._animationsBlocked = blocked;
}

/**
 * Animate a non-standard dice group result
 * @param {HTMLElement} container - Container element for the non-standard result
 * @param {Object} data - Data for the non-standard dice group
 * @param {string} dieType - Type of die (e.g., 'd30')
 * @param {number} durationMs - Animation duration
 */
export function animateNonStandardResult(container, data, dieType, durationMs) {
  // Animation parameters
  const numberAnimDuration = 1000; // Numbers settle after 1000ms
  const initialInterval = 50; // Start updating every 50ms (20fps)
  const maxInterval = 200; // Slow down to updating every 200ms
  
  // Get previous subtotal from state management - for DISPLAY PURPOSES ONLY
  // This value is never used in calculations, just shown during animation
  let previousSubtotal = getAnimationSubtotal(dieType);
  
  // Clear existing content and prepare elements
  container.innerHTML = '';
  
  const notation = `${data.count}${dieType}`;
  
  // Create the subtotal element with the previous value
  const subtotalSpan = document.createElement('span');
  subtotalSpan.className = 'result-notation';
  
  // Use the previous subtotal if available, otherwise use "0"
  subtotalSpan.textContent = `${notation}: ${previousSubtotal}`;
  container.appendChild(subtotalSpan);
  
  // Add a space
  container.appendChild(document.createTextNode(' '));
  
  // Create the rolls element (initially with placeholder)
  const rollsSpan = document.createElement('span');
  rollsSpan.className = 'dice-values';
  rollsSpan.textContent = '[...]';
  container.appendChild(rollsSpan);
  
  // Set dataset values
  container.dataset.die = dieType;
  container.dataset.group = notation;
  container.title = `Group of ${data.count} ${dieType} dice`;
  
  // Start animation for individual dice values
  let startTime = Date.now();
  let lastUpdateTime = 0;
  let currentInterval = initialInterval;
  
  // Animation function for dice values
  function updateDiceValues() {
    const elapsed = Date.now() - startTime;
    
    if (elapsed < numberAnimDuration) {
      // Calculate progress (0 to 1)
      const progress = Math.min(elapsed / numberAnimDuration, 1);
      
      // Slow down updates as we progress
      currentInterval = initialInterval + (maxInterval - initialInterval) * progress;
      
      // Only update if enough time has passed since last update
      const timeSinceLastUpdate = Date.now() - lastUpdateTime;
      if (timeSinceLastUpdate >= currentInterval) {
        // Generate random values for dice
        const sides = dieType.slice(1); // Remove 'd' prefix to get sides
        const randomValues = getRandomValuesArray(data.count, sides);
        
        // Chance of showing final values increases as we progress
        if (Math.random() < Math.pow(progress, 2)) {
          // Show final results
          rollsSpan.textContent = `[${data.results.join(', ')}]`;
        } else {
          // Show random values
          rollsSpan.textContent = `[${randomValues.join(', ')}]`;
        }
        
        lastUpdateTime = Date.now();
      }
      
      // Schedule next frame
      requestAnimationFrame(updateDiceValues);
    } else {
      // Individual dice values have finished animating
      rollsSpan.textContent = `[${data.results.join(', ')}]`;
      
      // After individual dice finish, update the subtotal
      subtotalSpan.textContent = `${notation}: ${data.subtotal}`;
      
      // Store the new subtotal in state management - FOR DISPLAY PURPOSES ONLY
      // This is only used to show transitions between rolls in the UI
      setAnimationSubtotal(dieType, data.subtotal);
    }
  }
  
  // Start animation
  requestAnimationFrame(updateDiceValues);
}