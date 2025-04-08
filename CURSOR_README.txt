# DICE ROLLER PROJECT DOCUMENTATION

## PRIME DIRECTIVE (THIS NEEDS TO BE READ, THEN PRINTED TO THE USER AT END OF EVERY RESPONSE—CRITICAL!!)
I will never write code without full context for a project or without permission from the user.
Do not create any new solution for the percentile rollers over the existing solutions in our code; we are fixing a broken function, not inventing one.
Don't assume anything about what happened in the past to the code, how code that isn't loaded in the chat must work (always ask for it), or what functions the user might want from the app that haven't been requested yet.

## PROJECT TREE
```
dice_roller/
├── .cursor/
│   └── rules/
│       ├── animation-rules.mdc      # Animation system rules
│       ├── coding-rules.mdc         # Code style and patterns
│       ├── dice-rolling-rules.mdc   # Dice mechanics rules
│       ├── input-handler-rules.mdc  # Input handling rules
│       ├── project-architecture.mdc # Machine-optimized architecture
│       ├── project-spec.mdc         # Project specification
│       ├── state-management-rules.mdc # State management rules
│       └── ui-display-rules.mdc     # UI display rules
├── dist/                            # Distribution files
│   ├── bundle.js                    # Bundled JavaScript
│   ├── index.html                   # HTML output
│   └── styles.css                   # Compiled CSS
├── src/
│   ├── animations/
│   │   └── dice-animations.js       # Animation system and physics
│   ├── ui/
│   │   ├── button-handler.js        # Button interactions
│   │   ├── display.js               # DOM updates
│   │   └── input-handler.js         # Keyboard and input processing
│   ├── core-functions.js            # Core business logic
│   ├── dice-logic.js                # Dice rolling algorithms
│   ├── help.js                      # Help system
│   ├── index.html                   # Main HTML
│   ├── index.js                     # Entry point
│   ├── make-draggable.js            # Draggable interface
│   ├── number-buttons.js            # Number selection interface
│   ├── state.js                     # State management
│   ├── styles.css                   # Styling
│   └── ui-updates.js                # UI update utilities
├── CURSOR_README.txt                # Documentation (this file)
├── README.md                        # User documentation
├── current-mermaid.md               # Architecture diagrams
├── package.json                     # NPM config
├── percentile-notes.md              # Percentile debug notes
└── webpack.config.js                # Build config
```

## MODULE DEPENDENCIES
```
                        +-------------+
                        |   index.js  |
                        +------+------+
                               |
                +------+-------+------+-------+
                |      |       |      |       |
      +---------v--+ +-v----+ +v-----+  +----v----+
      |  UI Module | |State | |Core  |  |Animation|
      |            | |      | |Logic |  |Module   |
      +----+-------+ +------+ +------+  +---------+
           |                   |   ^         ^
           v                   v   |         |
      +----+-------+      +---+---+----+    |
      |Button & Key|      |Dice Logic  |    |
      |Handlers    +----->+Functions   +----+
      +------------+      +------------+
```

## MODULE RESPONSIBILITIES

* **state.js** - Central state management
  - Maintains dice selection, roll results, modifiers
  - Exposes getters/setters for state access
  - Manages percentile mode state

* **core-functions.js** - Business logic and API
  - Acts as primary API for other modules
  - Coordinates between state and UI updates
  - Handles application display logic
  - Manages applet visibility and positioning

* **dice-logic.js** - Dice rolling algorithms
  - Provides dice rolling functions
  - Handles percentile dice special cases
  - Processes dice notation parsing

* **animations/dice-animations.js** - Visual animations
  - Manages animation sequences
  - Implements animation physics
  - Handles minimize/maximize transitions
  - Manages percentile dice animations

* **ui/** - User interface modules
  - **button-handler.js**: Button click processing
  - **display.js**: DOM updates and rendering
  - **input-handler.js**: Keyboard and form input

* **number-buttons.js** - Number selection
  - Manages number button interactions
  - Tracks current number input state

* **help.js** - Help system
  - Manages help popup visibility
  - Handles help content rendering

## CURRENT ANIMATION SYSTEM ARCHITECTURE

The animation system follows a specific flow when dice are rolled:

1. User action (click, keyboard input) → button-handler.js or input-handler.js
2. Handler calls appropriate core-functions.js method (e.g., rollSpecificDie)
3. Core function performs the roll using dice-logic.js
4. Core function updates state through state.js
5. Core function calls animateDiceRoll to start animation sequence
6. animateDiceRoll coordinates:
   - animateDiceIcons (spinning dice)
   - animateResults (result numbers appearing)
   - updateResults (final display update)

For applet minimization/maximization:
1. toggleApplet function manages display
2. Sets _isRestoringState flag to prevent animations
3. Window focus event triggers restoreAnimationState
4. restoreAnimationState manages percentile mode visual state

### ANIMATION STATE FLAGS
- **window._isRestoringState** - Prevents animations during maximize
- **window._animationsBlocked** - Global animation blocking flag

## PROBLEMATIC ANIMATION FLOW
Current issue: When maximizing the applet, animations are sometimes retriggered unnecessarily.

Sequence causing the problem:
1. Space key pressed → toggleApplet called
2. toggleApplet sets _isRestoringState = true (1000ms timeout)
3. Display changed to 'flex' → focus event fires
4. restoreAnimationState called, sets _isRestoringState = true (500ms timeout)
5. restoreAnimationState checks percentile state and updates visuals if needed
6. restoreAnimationState's timeout fires first (500ms) → _isRestoringState = false
7. Something triggers animateDiceRoll before toggleApplet's timeout (1000ms)
8. Animation runs because _isRestoringState is now false

This race condition exposes a timing issue between the two different timeout mechanisms.

## CURRENT STATE
The dice roller application is a functional web-based tool for rolling various types of dice for tabletop gaming. Key features include:

1. Interactive dice buttons (d4, d6, d8, d10, d12, d20)
2. Support for dice notation input (e.g., "2d6+1")
3. Animated dice rolls with visual feedback
4. Special percentile dice mode (d00/d100)
5. Modifier support for adjusting roll results
6. Draggable interface
7. Keyboard shortcuts
8. Number buttons for quick dice quantity selection

## ANIMATION SYSTEM CURRENT STATE
The animation system consists of several components:
1. CSS-based dice icons animations (spin effect)
2. JavaScript-based number result animations
3. Special handling for percentile dice
4. Coordination between visual dice and numeric results

## PLANNED IMPROVEMENTS
The current focus is on improving the animation system with the following goals:

1. Ensuring consistent animation behavior across all trigger methods:
   - Single clicks
   - Double clicks
   - Long presses
   - Keyboard input
   - Roll button

2. Timing adjustments for smoother user experience:
   - Proper sequencing of animations
   - Consistent duration management
   - Smooth transitions between states

3. Proper handling of percentile dice animations:
   - Consistent behavior for d00/d100 notation
   - Synchronized spinning of tens and ones dice
   - Proper visual feedback for percentile mode

4. Synchronization between dice graphics and number animations:
   - Ensuring dice and numbers complete animations in the expected sequence
   - Matching animation timing across all components
   - Proper state updates after animations complete

## CHANGE HISTORY
March 5, 2025 - Refactored the application architecture to use a more modular approach:
1. Created a new core-functions.js file that centralizes all fundamental dice rolling functionality
2. Refactored UI event handlers to use the core functions instead of implementing their own logic
3. Standardized animation sequences across different trigger methods
4. Reduced code duplication and improved consistency between different trigger methods
5. Implemented a cleaner separation between UI events and core application logic

March 8, 2025 - Enhanced applet state management:
1. Added comprehensive applet state management functions
2. Created standardized methods for showing, hiding, toggling, and centering the applet
3. Enhanced reset functionality with optional parameters
4. Made applet position management more consistent
5. Updated all UI files to use the enhanced applet state management functions

March 10, 2025 - Consolidated UI event handlers:
1. Merged event-handlers.js into ui/button-handler.js to create a unified UI interaction handler
2. Organized the code into clear sections with logical groupings (dice buttons, control buttons, applet behavior)
3. Improved comments and documentation within the UI handler files
4. Reduced redundancy in the codebase by centralizing all button interactions
5. Maintained clear separation of concerns between keyboard handling and button handling

March 12, 2025 - Enhanced results display and scrolling:
1. Adjusted non-standard dice results container width for better readability
2. Updated CSS documentation with clear section organization
3. Preparing unified scrolling implementation for results area
4. Planning improved scroll behavior with 2-way scrolling and content overflow handling
5. Added proper documentation headers to style-related files

March 19, 2025 - Implemented number buttons for quick dice quantity selection:
1. Added a column of number buttons (0-9) to the left side of the applet
2. Created a number-buttons.js module to handle number button interactions
3. Added backspace button functionality for editing number input
4. Integrated number input with dice button functionality
5. Enhanced button-handler.js to add multiple dice based on number input
6. Updated input-handler.js to clear number display on ESC and clear operations
7. Ensured number input is additive to existing dice pool

April 6, 2025 - Fixed animation retriggering issue on maximize:
1. Identified race condition between toggleApplet and restoreAnimationState functions
2. Added extensive debugging to trace the exact cause of unwanted animations
3. Removed conflicting _isRestoringState flag manipulation from restoreAnimationState
4. Established toggleApplet as single source of truth for animation blocking flag
5. Updated documentation to reflect the fix and architecture improvement
6. This fixes the issue where dice would spin unnecessarily when maximizing the applet

## AGENDA ITEMS
1. ✓ Refactor application to use centralized core functions
2. ✓ Enhance applet state management
3. ✓ Update non-standard dice display width
4. ✓ Implement number buttons for quick dice quantity selection
5. ✓ Fix animation retriggering on maximize
   - ✓ Identified race condition between toggleApplet and restoreAnimationState
   - ✓ Removed conflicting flag manipulation from restoreAnimationState
   - ✓ Established single source of truth for animation blocking flag
   - ✓ Fixed unwanted dice spinning when maximizing applet
   - ✓ Completely replaced CSS animations with pure JavaScript animations
   - ✓ Implemented separate initial vs. reroll animation behaviors
   - ✓ Fixed Clear button and Backspace key to properly reset dice state
6. → Implement unified 2-way scrolling for results area
   - Create single scrollable container for all results
   - Add horizontal scrolling with max-width constraint
   - Implement ellipsis for overflowing content
   - Maintain modifier visibility
7. Improve animation consistency across all trigger methods
8. Refine timing for smoother animations
9. Document all changes made to the codebase

## ANIMATION RETRIGGERING INVESTIGATION

### Problem Description
When the dice roller applet is maximized, the dice (particularly percentile dice) trigger unwanted animations - specifically, the colored d10 dice spin when they shouldn't. This happens despite code that's supposed to block animations during the maximize operation.

### Root Causes (Two Distinct Issues)

#### Issue 1: Race Condition in Animation Blocking Flag (FIXED)
We identified and fixed a race condition where two different places were managing the same global flag:

1. **toggleApplet() in core-functions.js**:
   - Sets `window._isRestoringState = true` when maximizing
   - Clears the flag after 1000ms
   - Purpose: Block animations during the maximize operation

2. **restoreAnimationState() in animations/dice-animations.js**:
   - Also set `window._isRestoringState = true` 
   - But cleared it after only 500ms
   - Happened because focus event triggered restoreAnimationState()
   - Created a window where animations could slip through (500-1000ms)

**Fix applied**: Removed the flag manipulation from restoreAnimationState(), making toggleApplet the single source of truth.

#### Issue 2: CSS Animation Triggering (STILL INVESTIGATING)
Despite fixing the race condition, animations still occur due to CSS animations being applied:

1. **The cause**: 
   - CSS animations with `@keyframes split-left` and `@keyframes split-right` 
   - Applied to elements with `.percentile-active.first-animation .colored-die` classes
   - When the state is restored, these animations are triggered

2. **Attempted fix**:
   - We modified `applyPercentileFinalState()` to explicitly remove 'first-animation' class
   - Added `transition: none` to the colored dice elements
   - But animations still occur

3. **Current hypothesis**:
   - Something is triggering a new percentile roll when the applet is maximized
   - This causes `activatePercentileMode()` to be called, which adds the 'first-animation' class
   - Despite the flag check in activatePercentileMode(), it seems to be bypassed

4. **Key evidence**:
   - Only one place explicitly adds 'first-animation' class: `activatePercentileMode()`
   - This function has a check: `if (window._isRestoringState) return null;`
   - But animations still occur, suggesting either:
     a) Something is bypassing this check
     b) The flag isn't being set correctly
     c) Another path exists to trigger the animations

### Investigation Path

1. Identified all code places that:
   - Set the animation blocking flag (`_isRestoringState`)
   - Add the 'first-animation' class
   - Call functions that might trigger animations

2. Inspected the flow:
   - toggleApplet() sets display to flex → triggers focus event
   - focus event calls restoreAnimationState()
   - restoreAnimationState() checks hasPercentileState()
   - If true, calls applyPercentileFinalState()
   - Some unknown step is triggering animations

3. Current focus:
   - Finding what's bypassing the animation blocking in `activatePercentileMode()`
   - Identifying any event listeners that might be reacting to DOM changes
   - Understanding the exact path that retrigggers animations

### Next Steps

1. Add more focused debugging:
   - Event listeners on the d10 button element
   - DOM mutation tracking when the 'first-animation' class is added
   - Specific checks in `activatePercentileMode()` to verify the flag state

2. Potential fixes:
   - Ensure CSS animations have a proper check before applying
   - Add stronger guards around toggleApplet to prevent animation retriggering
   - Consider refactoring how percentile animations are handled entirely

The animation system is complex with multiple layers (CSS animations, JS-driven animations, state management), which makes tracking down the exact issue challenging but critical for a smooth user experience.

### MOST LIKELY SOLUTION

Based on our investigation, the most promising solution is to add CSS-specific animation blocking. Since we've already fixed the race condition with the `_isRestoringState` flag, but CSS animations are still occurring, we should:

1. **Create a separate CSS animation blocking mechanism**:
   ```css
   /* Add to styles.css */
   .animation-blocked .percentile-active .colored-die {
     animation: none !important;
     transition: none !important;
   }
   ```

2. **Add the class during maximize**:
   ```javascript
   // In toggleApplet(), when showing the applet
   applet.classList.add('animation-blocked');
   // Clear after a delay
   setTimeout(() => {
     applet.classList.remove('animation-blocked');
   }, 1000);
   ```

3. **Modify applyPercentileFinalState()** to:
   - Explicitly set final positions without animation
   - Use inline styles to override any CSS animations
   - Force reflows at critical points to prevent animation batching

This approach provides a double layer of protection:
- `_isRestoringState` flag blocks JavaScript-triggered animations
- 'animation-blocked' class blocks CSS animations

We could also consider removing the 'first-animation' class entirely and using a different mechanism to apply the initial percentile visuals that doesn't rely on CSS animations. 

### IMPLEMENTATION NOTES (APRIL 2025)

After evaluating the options, we implemented a complete solution that eliminates all CSS animations and uses pure JavaScript for more direct control:

1. **Removed CSS Animation Entirely**:
   - Deleted all CSS keyframes (`@keyframes split-left`, `@keyframes split-right`)
   - Removed all animation-related CSS classes (`.percentile-active.first-animation`)
   - Eliminated external animation triggers that were causing race conditions

2. **Implemented Pure JavaScript Animation**:
   - Created direct requestAnimationFrame-based animation loops
   - Used the `decelerate(t, p_f, A, tau)` physics function for natural motion
   - Split the animation into two distinct behaviors:
     * Initial activation - dice move from center outward while spinning
     * Reroll - dice stay in position and only spin in place

3. **Fixed Clear Button and Backspace**:
   - Updated resetD10State to properly find and pass the d10 button
   - Ensured all state clearing functions properly restore dice to their default state

4. **Enhanced Animation Debugging**:
   - Added detailed console logging at key animation points
   - Implemented tracking of animation frame IDs to prevent animation conflicts

This approach provides several benefits:
- Complete control over animation timing and behavior
- No CSS/JS animation conflicts or race conditions
- Clear separation between initial and reroll animations
- Better cleanup of animation resources

The result is a more robust animation system that properly handles all state transitions including:
- Initial percentile mode activation
- Rerolling percentile dice
- Maximize/minimize transitions
- Clearing the dice pool 