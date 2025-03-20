# DICE ROLLER PROJECT DOCUMENTATION

## PRIME DIRECTIVE (THIS NEEDS TO BE READ, THEN PRINTED TO THE USER AT END OF EVERY RESPONSE—CRITICAL!!)
I will never write code without full context for a project or without permission from the user.
Do not create any new solution for the percentile rollers over the existing solutions in our code; we are fixing a broken function, not inventing one.
Don't assume anything about what happened in the past to the code, how code that isn't loaded in the chat must work (always ask for it), or what functions the user might want from the app that haven't been requested yet.

## PROJECT TREE
```
dice_roller/
├── .git/
├── .cursor/
│   └── rules/
│       ├── coding-rules.mdc
│       └── project-spec.mdc
├── dist/
├── node_modules/
├── src/
│   ├── animations/
│   │   └── dice-animations.js     # Handles dice animations and result animations
│   ├── ui/
│   │   ├── button-handler.js      # Manages all UI button interactions and events
│   │   ├── display.js             # Updates UI display elements
│   │   └── input-handler.js       # Handles input form processing and keyboard events
│   ├── utils/
│   │   └── formatting.js          # Text formatting utilities
│   ├── dice-logic.js              # Core dice rolling functionality
│   ├── help.js                    # Help popup functionality and event handlers
│   ├── index.html                 # Main HTML structure
│   ├── index.js                   # Application entry point
│   ├── make-draggable.js          # Adds draggable functionality to the applet
│   ├── number-buttons.js          # Handles number buttons functionality
│   ├── state.js                   # Manages application state
│   ├── styles.css                 # CSS styles for the application
│   └── ui-updates.js              # UI update functions
├── .DS_Store
├── CURSOR_README.txt              # This file
├── README.md                      # Project overview and instructions
├── dice_roller.code-workspace     # VS Code workspace settings
├── package-lock.json              # NPM dependency lock
├── package.json                   # NPM project configuration
└── webpack.config.js              # Webpack build configuration
```

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

## AGENDA ITEMS
1. ✓ Refactor application to use centralized core functions
2. ✓ Enhance applet state management
3. ✓ Update non-standard dice display width
4. ✓ Implement number buttons for quick dice quantity selection
5. → Implement unified 2-way scrolling for results area
   - Create single scrollable container for all results
   - Add horizontal scrolling with max-width constraint
   - Implement ellipsis for overflowing content
   - Maintain modifier visibility
6. Improve animation consistency across all trigger methods
7. Refine timing for smoother animations
8. Fix percentile dice animation issues
9. Ensure proper synchronization between graphics and numbers
10. Document all changes made to the codebase 