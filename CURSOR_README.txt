# DICE ROLLER PROJECT DOCUMENTATION

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
│   ├── index.html                 # Main HTML structure
│   ├── index.js                   # Application entry point
│   ├── make-draggable.js          # Adds draggable functionality to the applet
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
May 22, 2023 - Refactored the application architecture to use a more modular approach:
1. Created a new core-functions.js file that centralizes all fundamental dice rolling functionality
2. Refactored UI event handlers to use the core functions instead of implementing their own logic
3. Standardized animation sequences across different trigger methods
4. Reduced code duplication and improved consistency between different trigger methods
5. Implemented a cleaner separation between UI events and core application logic

May 23, 2023 - Enhanced applet state management:
1. Added comprehensive applet state management functions
2. Created standardized methods for showing, hiding, toggling, and centering the applet
3. Enhanced reset functionality with optional parameters
4. Made applet position management more consistent
5. Updated all UI files to use the enhanced applet state management functions

May 24, 2023 - Consolidated UI event handlers:
1. Merged event-handlers.js into ui/button-handler.js to create a unified UI interaction handler
2. Organized the code into clear sections with logical groupings (dice buttons, control buttons, applet behavior)
3. Improved comments and documentation within the UI handler files
4. Reduced redundancy in the codebase by centralizing all button interactions
5. Maintained clear separation of concerns between keyboard handling and button handling

## AGENDA ITEMS
1. ✓ Refactor application to use centralized core functions
2. ✓ Enhance applet state management
3. Improve animation consistency across all trigger methods
4. Refine timing for smoother animations
5. Fix percentile dice animation issues
6. Ensure proper synchronization between graphics and numbers
7. Document all changes made to the codebase 