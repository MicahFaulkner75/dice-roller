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
 * Detects and returns the current visibility state of the app
 * Includes both document visibility and app-specific minimize state
 * @returns {Object} Current visibility state
 * @property {string} documentState - Current document.visibilityState ('visible', 'hidden', etc.)
 * @property {boolean} isMinimized - Whether the app is currently minimized
 * @property {string} source - What caused the current state ('document', 'spacebar', 'x-key')
 */
export function detectVisibilityState() {
  console.log('[DEBUG] Checking visibility state');
  
  // Get document visibility state
  const documentState = document.visibilityState;
  
  // Check app-specific minimize state
  // We look for our app's minimize class on the main container
  const diceContainer = document.getElementById('dice-container');
  const isMinimized = diceContainer ? diceContainer.classList.contains('minimized') : false;
  
  // Determine source of current state
  let source = 'document';
  if (isMinimized) {
    // Check if minimized by spacebar or x-key
    // We store this in a data attribute when minimizing
    source = diceContainer?.dataset.minimizeSource || 'unknown';
  }
  
  console.log(`[DEBUG] Visibility state: document=${documentState}, minimized=${isMinimized}, source=${source}`);
  
  return {
    documentState,
    isMinimized,
    source
  };
}

// Track visibility state changes
let _previousState = null;

/**
 * Checks if visibility state has changed
 * @returns {boolean} Whether the state has changed since last check
 */
export function hasVisibilityStateChanged() {
  const currentState = detectVisibilityState();
  
  // If no previous state, consider it changed
  if (!_previousState) {
    _previousState = currentState;
    return true;
  }
  
  // Check if any properties changed
  const changed = 
    currentState.documentState !== _previousState.documentState ||
    currentState.isMinimized !== _previousState.isMinimized ||
    currentState.source !== _previousState.source;
  
  // Update previous state
  _previousState = currentState;
  
  if (changed) {
    console.log('[DEBUG] Visibility state changed:', currentState);
  }
  
  return changed;
}

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
 * Animate dice icons spinning with physics-based deceleration
 * @param {Array} diceToAnimate - Array of dice types to animate
 * @returns {number} - Animation duration in milliseconds
 */
export function animateDiceIcons(diceToAnimate) {
  // Skip animations completely if we're restoring state or animations are blocked
  if (window._isRestoringState || window._animationsBlocked) {
    console.log('[DEBUG] Skipping dice icon animations - restoration in progress or animations blocked');
    return 0;
  }

  const durationMs = 2000;
  const tau = 325; // Time constant for appropriate deceleration (in ms)
  const finalAngle = 360 * 3; // 3 full spins in degrees
  const initialAngle = 0;
  const amplitude = finalAngle - initialAngle;
  
  // Store animation references to allow interruption
  if (!window.diceAnimations) {
    window.diceAnimations = {};
  }
  
  diceToAnimate.forEach(dieType => {
    const dieButtons = document.querySelectorAll(`.die-button[data-die="${dieType}"] img`);
    
    dieButtons.forEach(button => {
      // Generate a unique ID for this button if it doesn't have one
      if (!button.animationId) {
        button.animationId = `die_${dieType}_${Date.now()}`;
      }
      
      // Cancel any existing animation for this button
      if (window.diceAnimations[button.animationId]) {
        cancelAnimationFrame(window.diceAnimations[button.animationId]);
        window.diceAnimations[button.animationId] = null;
  }
  
  let startTime = null;
  
      // Animation step function
  function animateStep(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsedTime = timestamp - startTime;
    
        if (elapsedTime < durationMs) {
          // Calculate current angle using deceleration function
          const currentAngle = decelerate(elapsedTime, finalAngle, amplitude, tau);
          
          // Apply rotation
          button.style.transform = `rotate(${currentAngle}deg)`;
          
          // Continue animation and store the frame ID
          window.diceAnimations[button.animationId] = requestAnimationFrame(animateStep);
    } else {
          // Ensure we end at exactly the final angle
          button.style.transform = `rotate(${finalAngle}deg)`;
      
      // Reset after a brief delay to avoid visual glitch
      setTimeout(() => {
            button.style.transform = '';
            window.diceAnimations[button.animationId] = null;
      }, 50);
    }
  }
  
      // Start the animation and store the frame ID
      window.diceAnimations[button.animationId] = requestAnimationFrame(animateStep);
    });
  });
  
  return durationMs;
}

/**
 * Generate a random number for a specific die type
 * @param {string} dieType - Type of die (e.g., 'd20', 'd6')
 * @returns {number|string} - Random number appropriate for the die type
 */
function getRandomValueForDie(dieType) {
  // Handle percentile special cases
  if (dieType === 'd10-tens') {
    // Returns 00, 10, 20, ..., 90
    const tens = Math.floor(Math.random() * 10);
    return (tens * 10).toString().padStart(2, '0');
  } else if (dieType === 'd10-ones') {
    // Returns 0-9
    return Math.floor(Math.random() * 10);
  }
  
  // Standard dice
  const sides = parseInt(dieType.slice(1), 10);
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
  element.dataset.die = dieType;
  
  // Animation parameters
  const numberAnimDuration = 1000; // Numbers settle after 1000ms
  const initialInterval = 50; // Start updating every 50ms (20fps)
  const maxInterval = 200; // Slow down to updating every 200ms
  
  // Start animation
  let startTime = Date.now();
  let lastUpdateTime = 0;
  let currentInterval = initialInterval;
  
  // Start with a random value
  element.textContent = getRandomValueForDie(dieType);
  
  // Animation function
  function updateNumber() {
    const elapsed = Date.now() - startTime;
    
    if (elapsed < numberAnimDuration) {
      // Calculate progress (0 to 1)
      const progress = Math.min(elapsed / numberAnimDuration, 1);
      
      // Slow down updates as we progress
      // This creates a more natural deceleration effect
      currentInterval = initialInterval + (maxInterval - initialInterval) * progress;
      
      // Only update if enough time has passed since last update
      const timeSinceLastUpdate = Date.now() - lastUpdateTime;
      if (timeSinceLastUpdate >= currentInterval) {
        // Chance of showing final value increases as we progress
        if (Math.random() < Math.pow(progress, 2)) {
          element.textContent = finalValue;
      } else {
          element.textContent = getRandomValueForDie(dieType);
        }
        lastUpdateTime = Date.now();
      }
      
      // Schedule next frame
      requestAnimationFrame(updateNumber);
    } else {
      // Ensure we end with the final value
        element.textContent = finalValue;
    }
  }
  
  // Start animation
  requestAnimationFrame(updateNumber);
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
  
  if (!resultsRollsEl || !resultsTotalEl) return;
  
  // Clear existing results
  resultsRollsEl.innerHTML = '';
  
  // Create and animate result boxes only for standard dice
  rolls.forEach((roll, index) => {
    const dieType = diceTypes[index];
    // Skip non-standard dice
    if (!isStandardDie(dieType)) return;
    
    const rollBox = document.createElement('div');
    rollBox.className = 'roll-box';
    
    if (typeof roll === 'object' && roll.type) {
      // Percentile roll
      animateNumberResult(rollBox, roll.value, roll.type, durationMs);
    } else {
      // Regular roll
      animateNumberResult(rollBox, roll, dieType, durationMs);
    }
    
    resultsRollsEl.appendChild(rollBox);
  });
  
  // Animate total
  const totalValue = resultsTotalEl.querySelector('.total-value');
  if (totalValue) {
    const currentTotal = totalValue.textContent || '0';
    totalValue.textContent = currentTotal;
    
    setTimeout(() => {
          totalValue.textContent = total;
    }, durationMs);
  }
}

/**
 * Reset d10 button state
 * @param {HTMLElement} button - The d10 button to reset
 */
export function resetD10State(button) {
  if (!button) return;
  
  button.classList.remove('percentile-active', 'first-animation');
  const mainDie = button.querySelector('.main-die');
  const coloredDice = button.querySelectorAll('.colored-die');
  
  if (mainDie) mainDie.classList.remove('spin');
  coloredDice.forEach(die => {
    die.classList.remove('spin');
    die.style.transform = '';
  });
}

/**
 * Animate a non-standard dice group result
 * @param {HTMLElement} container - Container element for the non-standard result
 * @param {Object} data - Data for the non-standard dice group
 * @param {string} dieType - Type of die (e.g., 'd30')
 * @param {number} durationMs - Animation duration
 */
export function animateNonStandardResult(container, data, dieType, durationMs) {
  console.log('=== DEBUG: animateNonStandardResult ===');
  console.log('Data received:', JSON.stringify(data, null, 2));
  console.log('dieType:', dieType);
  
  // Animation parameters
  const numberAnimDuration = 1000; // Numbers settle after 1000ms
  const initialInterval = 50; // Start updating every 50ms (20fps)
  const maxInterval = 200; // Slow down to updating every 200ms
  
  // Get previous subtotal from state management - for DISPLAY PURPOSES ONLY
  // This value is never used in calculations, just shown during animation
  let previousSubtotal = getAnimationSubtotal(dieType);
  console.log('Previous subtotal from state:', previousSubtotal);
  
  // Clear existing content and prepare elements
  container.innerHTML = '';
  
  const notation = `${data.count}${dieType}`;
  console.log('Notation:', notation);
  
  // Create the subtotal element with the previous value
  const subtotalSpan = document.createElement('span');
  subtotalSpan.className = 'result-notation';
  
  // Use the previous subtotal if available, otherwise use "0"
  subtotalSpan.textContent = `${notation}: ${previousSubtotal}`;
  container.appendChild(subtotalSpan);
  console.log('Set initial display subtotal to:', previousSubtotal);
  
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
  
  // Generate random values for a specific die type
  function getRandomValuesArray(count, sides) {
    const sides_num = parseInt(sides, 10);
    return Array.from({ length: count }, () => Math.floor(Math.random() * sides_num) + 1);
  }
  
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
      console.log(`Animation complete: Updating displayed subtotal to ${data.subtotal}`);
      
      // Store the new subtotal in state management - FOR DISPLAY PURPOSES ONLY
      // This is only used to show transitions between rolls in the UI
      setAnimationSubtotal(dieType, data.subtotal);
      console.log(`Stored new animation subtotal in state: ${data.subtotal}`);
    }
  }
  
  // Start animation
  requestAnimationFrame(updateDiceValues);
}

/**
 * Handles visibility state changes for the dice roller
 * @param {Event} event - The event that triggered the visibility change
 */
function handleVisibilityChange(event) {
  console.log('[DEBUG] Handling visibility change event:', event.type);
  
  // Try multiple possible container selectors
  const diceContainer = 
    document.getElementById('dice-roller') || 
    document.getElementById('dice-applet') ||
    document.querySelector('.dice-roller') ||
    document.querySelector('.dice-applet');
    
  if (!diceContainer) {
    console.log('[DEBUG] No dice container found. Tried: #dice-roller, #dice-applet, .dice-roller, .dice-applet');
    return;
  }
  
  // Get computed style to check actual display state
  const computedStyle = window.getComputedStyle(diceContainer);
  const isHidden = computedStyle.display === 'none';
  
  console.log('[DEBUG] Container found:', {
    id: diceContainer.id,
    className: diceContainer.className,
    inlineDisplay: diceContainer.style.display,
    computedDisplay: computedStyle.display,
    isHidden
  });
  
  // Store current state for comparison
  const currentState = {
    isHidden,
    display: computedStyle.display,
    eventType: event.type,
    timestamp: Date.now()
  };
  
  // Check if this is a minimize or maximize event
  if (event.type === 'keydown') {
    const isSpacebar = event.key === ' ';
    const isXKey = event.key.toLowerCase() === 'x';
    
    console.log('[DEBUG] Key pressed:', {
      key: event.key,
      isSpacebar,
      isXKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey
    });
    
    if (isSpacebar || isXKey) {
      console.log('[DEBUG] Minimize/maximize trigger:', event.key);
      
      // If we're in percentile mode, we need to handle state preservation
      const hasPercentile = document.querySelector('.die-button.percentile-active') !== null;
      console.log('[DEBUG] Percentile mode active:', hasPercentile);
      
      if (hasPercentile) {
        if (!isHidden) {
          console.log('[DEBUG] About to minimize - preserving state');
          // About to minimize - preserve state
          preserveAnimationState();
        } else {
          console.log('[DEBUG] About to maximize - restoring state and prevent all animations');
          // About to maximize - restore state and prevent all animations
          preventAllDiceAnimations();
          restoreAnimationState();
        }
      }
    }
  }
  
  // Compare with previous state
  if (window._previousVisibilityState) {
    const stateChanged = 
      window._previousVisibilityState.isHidden !== currentState.isHidden ||
      window._previousVisibilityState.display !== currentState.display;
      
    console.log('[DEBUG] State comparison:', {
      previous: window._previousVisibilityState,
      current: currentState,
      changed: stateChanged
    });
  }
  
  // Update previous state
  window._previousVisibilityState = currentState;
}

// Set up visibility change handlers
console.log('[DEBUG] Setting up visibility handlers');

// Listen for visibility changes
document.addEventListener('visibilitychange', handleVisibilityChange);

// Listen for minimize/maximize keyboard events
document.addEventListener('keydown', handleVisibilityChange);

// Cleanup function for removing listeners
export function cleanupVisibilityHandlers() {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  document.removeEventListener('keydown', handleVisibilityChange);
}

/**
 * Preserves the current animation state before minimizing
 * Stores transform states and classes for restoration
 */
function preserveAnimationState() {
  console.log('[DEBUG] Preserving animation state');
  
  // Set preservation flag immediately to prevent state changes
  window._isPreservingState = true;
  
  // Get the d10 button and its components
  const d10Button = document.querySelector('.die-button[data-die="d10"]');
  if (!d10Button) {
    console.log('[DEBUG] No d10 button found to preserve state');
    window._isPreservingState = false;
    return;
  }
  
  // Cancel any ongoing animations first to ensure clean state
  if (window.diceAnimations) {
    Object.keys(window.diceAnimations).forEach(animId => {
      if (window.diceAnimations[animId]) {
        console.log('[DEBUG] Cancelling animation:', animId);
        cancelAnimationFrame(window.diceAnimations[animId]);
        window.diceAnimations[animId] = null;
      }
    });
  }
  
  // Wait for a frame to ensure animations are stopped
  requestAnimationFrame(() => {
    // Get computed styles to capture actual transform states
    const getComputedTransform = (element) => {
      if (!element) return null;
      const style = window.getComputedStyle(element);
      return {
        transform: style.transform || 'none',
        transformOrigin: style.transformOrigin || 'center',
        transition: style.transition || 'none',
        opacity: style.opacity || '1',
        // Capture inline styles as well
        inlineTransform: element.style.transform || '',
        inlineOpacity: element.style.opacity || ''
      };
    };
    
    // Get all elements before any state changes
    const mainDie = d10Button.querySelector('.main-die');
    const coloredDice = Array.from(d10Button.querySelectorAll('.colored-die'));
    
    // Store the current state with computed values
    window._preservedAnimationState = {
      timestamp: Date.now(),
      d10State: {
        classes: Array.from(d10Button.classList),
        isPercentileActive: d10Button.classList.contains('percentile-active'),
        computedStyles: getComputedTransform(d10Button),
        mainDie: {
          computed: getComputedTransform(mainDie),
          classes: mainDie ? Array.from(mainDie.classList) : []
        },
        coloredDice: coloredDice.map(die => ({
          computed: getComputedTransform(die),
          classes: Array.from(die.classList)
        }))
      }
    };
    
    console.log('[DEBUG] Preserved animation state:', {
      hasPercentileMode: window._preservedAnimationState.d10State.isPercentileActive,
      mainDieTransform: window._preservedAnimationState.d10State.mainDie.computed.transform,
      coloredDiceCount: window._preservedAnimationState.d10State.coloredDice.length,
      timestamp: window._preservedAnimationState.timestamp
    });
    
    // Clear the preservation flag
    window._isPreservingState = false;
    console.log('[DEBUG] Animation preservation complete');
  });
}

/**
 * Restores the animation state after maximizing
 * Applies preserved transforms and classes without animations
 */
function restoreAnimationState() {
  console.log('[DEBUG] Restoring animation state');
  
  // Set global flag to prevent animation chains
  window._isRestoringState = true;
  
  // Use hasPercentileState() to check if we're in percentile mode
  // This won't trigger animation chains like hasPercentileDie() might
  const isPercentileActive = hasPercentileState();
  console.log(`[DEBUG] Percentile mode active: ${isPercentileActive}`);
  
  // If we're in percentile mode, apply the visual state directly
  if (isPercentileActive) {
    applyPercentileFinalState();
    
    // Clear restoration flag after a brief delay to ensure animations don't trigger
    setTimeout(() => {
      window._isRestoringState = false;
      console.log('[DEBUG] Restoration process complete, flag cleared');
    }, 100);
    
    return; // Skip the rest of state restoration
  }
  
  if (!window._preservedAnimationState) {
    console.log('[DEBUG] No preserved state found');
    window._isRestoringState = false;
    return;
  }
  
  const { d10State } = window._preservedAnimationState;
  const d10Button = document.querySelector('.die-button[data-die="d10"]');
  
  if (!d10Button) {
    console.log('[DEBUG] No d10 button found to restore state');
    window._isRestoringState = false;
    return;
  }
  
  // Disable all transitions before any changes
  const elements = [
    d10Button,
    d10Button.querySelector('.main-die'),
    ...Array.from(d10Button.querySelectorAll('.colored-die'))
  ].filter(Boolean);
  
  elements.forEach(element => {
    element.style.transition = 'none';
  });
  
  // Force a reflow to ensure transitions are disabled
  d10Button.offsetHeight;
  
  // Restore main button state
  if (d10State.isPercentileActive) {
    d10Button.classList.add('percentile-active');
    Object.assign(d10Button.style, d10State.computedStyles);
  }
  
  // Restore main die
  const mainDie = d10Button.querySelector('.main-die');
  if (mainDie && d10State.mainDie) {
    Object.assign(mainDie.style, d10State.mainDie.computed);
    d10State.mainDie.classes.forEach(cls => mainDie.classList.add(cls));
  }
  
  // Restore colored dice
  const coloredDice = Array.from(d10Button.querySelectorAll('.colored-die'));
  d10State.coloredDice.forEach((dieState, index) => {
    const die = coloredDice[index];
    if (die) {
      Object.assign(die.style, dieState.computed);
      dieState.classes.forEach(cls => die.classList.add(cls));
    }
  });
  
  // Re-enable transitions after a frame to ensure clean state
  requestAnimationFrame(() => {
    elements.forEach(element => {
      element.style.transition = '';
    });
    console.log('[DEBUG] Transitions re-enabled');
    
    // Clear restoration flag after transitions are re-enabled
    setTimeout(() => {
      window._isRestoringState = false;
      console.log('[DEBUG] Restoration process complete, flag cleared');
    }, 50);
  });
  
  console.log('[DEBUG] Animation state restored');
}

/**
 * Apply the final visual state for percentile dice
 * Applies state directly without animations
 */
function applyPercentileFinalState() {
  console.log('[DEBUG] Applying percentile final state directly');
  
  // Get the d10 button
  const d10Button = document.querySelector('.die-button[data-die="d10"]');
  if (!d10Button) {
    console.log('[DEBUG] No d10 button found');
    window._isRestoringState = false;
    return;
  }
  
  // Prevent all dice animations more aggressively
  preventAllDiceAnimations();
  
  // Temporarily disable transitions to prevent animations
  d10Button.style.transition = 'none';
  d10Button.style.animation = 'none';
  
  const d10Face = d10Button.querySelector('.d10-face');
  if (d10Face) {
    d10Face.style.transition = 'none';
    d10Face.style.animation = 'none';
    d10Face.style.opacity = '0';  // Hide the main face
  }
  
  const mainDie = d10Button.querySelector('.main-die');
  if (mainDie) {
    mainDie.style.transition = 'none';
    mainDie.style.animation = 'none';
  }
  
  const coloredDice = d10Button.querySelectorAll('.colored-die');
  coloredDice.forEach(die => {
    die.style.transition = 'none';
    die.style.animation = 'none';
  });
  
  // Force a reflow to ensure transitions are disabled
  void d10Button.offsetWidth;
  
  // Add appropriate classes but prevent animations from class changes
  d10Button.classList.add('percentile-active');
  d10Button.classList.remove('first-animation');  // Remove animation triggering class
  
  // Position and show colored dice
  coloredDice.forEach((die, index) => {
    // Set final positions directly
    if (index === 0) {  // First die (tens)
      die.style.transform = 'translateX(-20px)';
    } else {  // Second die (ones)
      die.style.transform = 'translateX(20px)';
    }
    die.style.opacity = '1';  // Show colored dice
    die.classList.remove('spin');  // Remove any spin classes
  });
  
  // Re-enable transitions after a longer delay to ensure no animations trigger
  setTimeout(() => {
    requestAnimationFrame(() => {
      d10Button.style.transition = '';
      d10Button.style.animation = '';
      
      if (d10Face) {
        d10Face.style.transition = '';
        d10Face.style.animation = '';
      }
      
      if (mainDie) {
        mainDie.style.transition = '';
        mainDie.style.animation = '';
      }
      
      coloredDice.forEach(die => {
        die.style.transition = '';
        die.style.animation = '';
      });
      
      console.log('[DEBUG] Percentile state applied, transitions restored');
    });
  }, 200);
}

/**
 * Prevent all dice animations by canceling any ongoing animations
 * and resetting their state
 */
function preventAllDiceAnimations() {
  console.log('[DEBUG] Preventing all dice animations');
  
  // Cancel any ongoing JavaScript animations
  if (window.diceAnimations) {
    Object.keys(window.diceAnimations).forEach(animId => {
      if (window.diceAnimations[animId]) {
        console.log('[DEBUG] Cancelling animation:', animId);
        cancelAnimationFrame(window.diceAnimations[animId]);
        window.diceAnimations[animId] = null;
      }
    });
  }
  
  // Remove animation classes from dice
  const allDice = document.querySelectorAll('.die-button img, .colored-die, .main-die');
  allDice.forEach(die => {
    die.classList.remove('spin', 'rolling', 'animate');
    die.style.transform = '';
  });
  
  // Prevent any new animations for a short period
  window._animationsBlocked = true;
  setTimeout(() => {
    window._animationsBlocked = false;
  }, 500);
}

