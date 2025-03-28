# Setup Documentation and Migration Progress

## Style Guide and Document Organization

### Document Hierarchy
1. **Main Sections (##)**
   - Use for major phases (e.g., "Phase 1: Documentation and Analysis")
   - Always numbered (e.g., "Phase 1", "Phase 2")

2. **Components (###)**
   - Use for major components or subsystems (e.g., "A. index.js", "B. ui/button-handler.js")
   - Always lettered (e.g., "A.", "B.")
   - Include full path for files

3. **Subsections (####)**
   - Use for component-specific sections (e.g., "1. Core Functions Documentation")
   - Always numbered (1., 2., etc.)
   - Should describe a specific aspect or feature

4. **Detailed Items (#####)**
   - Use for detailed documentation within subsections
   - Can be unnumbered if part of a clear parent section
   - Should contain specific implementation details

### Checklist Format
□ Unchecked item
☒ Checked item (completed)
  - [ ] Sub-item unchecked
  - [x] Sub-item checked

### Code Block Format
```javascript
// Always include language identifier
// Use consistent indentation (2 spaces)
{
  key: "value",
  nested: {
    item: "value"
  }
}
```

### Pattern Documentation Format
```javascript
// Pattern: [Pattern Name]
{
    purpose: "One-line description",
    implementation: {
        // Implementation details
    }
}
```

### Section Cross-References
- Use exact section names in brackets [Phase 1: Documentation]
- Include component letter for specific references [A. index.js]
- Use full hierarchy for deep references [Phase 1 > A. index.js > 1. Main Initialization]

## Phase 1: Documentation and Analysis
### A. index.js
#### 1. Overview and Status
☒ Document current setup functions
☒ Map initialization order
☒ Identify dependencies
☒ Document error handling
☒ Verify imports/exports

#### 2. Error Handling Implementation
□ Pre-Implementation:
  - [ ] Review all error handling patterns
  - [ ] Identify critical failure points
  - [ ] Document recovery strategies

□ Core Implementation:
  - [ ] validateRequiredElements() function
  - [ ] safeInitialize wrapper
  - [ ] Structured initialization steps
  - [ ] Error recovery strategies
  - [ ] Error reporting system

□ Integration:
  - [ ] Update initialization calls
  - [ ] Add error boundaries
  - [ ] Add state corruption detection
  - [ ] Add status tracking
  - [ ] Document patterns

□ Verification:
  - [ ] Test silent failures
  - [ ] Verify error logging
  - [ ] Test recovery paths
  - [ ] Check user feedback
  - [ ] Verify graceful degradation
  - [ ] Validate logging completeness

#### 3. Imports and Exports
##### Imports Analysis
1. **Style Imports**
   - ✓ './styles.css'

2. **UI Component Imports**
   - ✓ setupEventListeners from './ui/button-handler'
   - ✓ setupDiceInput, setupDiceButtons from './ui-updates'
   - ✓ makeDraggable from './make-draggable'
   - ✓ setupNumberButtons from './number-buttons'
   - ✓ initializeHelpSystem from './help'
   - ✓ initDisplayModule from './ui/display'

3. **Core Function Imports**
   - ✓ toggleApplet, centerApplet, minimizeApplet, resetApplet from './core-functions'

#### Exports Analysis
1. **UI Updates Re-exports**
   - ✓ setupDiceInput, setupDiceButtons

2. **Number Button Re-exports**
   - ✓ getCurrentNumberValue
   - ✓ setCurrentNumberValue
   - ✓ clearNumberValue

3. **Help System Re-exports**
   - ✓ showHelpPopup
   - ✓ hideHelpPopup
   - ✓ toggleHelpPopup

4. **Core Function Re-exports**
   - ✓ rollSpecificDie
   - ✓ rollPercentileDie
   - ✓ rollNonStandardDie
   - ✓ rerollAllDice
   - ✓ clearDicePool
   - ✓ resetApplet
   - ✓ adjustModifier
   - ✓ setModifierValue
   - ✓ processNotation
   - ✓ animateDiceRoll
   - ✓ minimizeApplet
   - ✓ toggleApplet
   - ✓ activatePercentileMode
   - ✓ centerApplet
   - ✓ showApplet

5. **Utility Re-exports**
   - ✓ formatModifier
   - ✓ formatDiceInput

#### Issues Found
1. **Missing/Undefined**
   - ❌ setupUI() called but not imported
   - ❌ setupDiceButtons imported from wrong location (ui-updates vs button-handler)

2. **Path Inconsistencies**
   - ❌ Some imports use './ui/' prefix while others don't
   - ❌ Inconsistent use of relative paths

3. **Import Organization**
   - ❌ No clear grouping of imports
   - ❌ Comments breaking import groups
   - ❌ Mixed import styles

#### Recommendations
1. **Import Organization**
```
// Styles
import './styles.css';

// Core functionality
import {
    toggleApplet,
    centerApplet,
    minimizeApplet,
    resetApplet
} from './core-functions';

// UI Components
import { setupEventListeners } from './ui/button-handler';
import { setupDiceInput } from './ui/input-handler';
import { setupDiceButtons } from './ui/button-handler';
import { initDisplayModule } from './ui/display';

// Features
import { setupNumberButtons } from './ui/number-buttons';
import { initializeHelpSystem } from './ui/help';
import { makeDraggable } from './utils/make-draggable';
```

2. **Export Organization**
```
// Core functionality exports
export {
    rollSpecificDie,
    rollPercentileDie,
    // ... other core functions
} from './core-functions';

// UI functionality exports
export {
    setupDiceInput,
    setupDiceButtons
} from './ui/button-handler';

// Feature exports
export {
    getCurrentNumberValue,
    setCurrentNumberValue,
    clearNumberValue
} from './ui/number-buttons';

// Utility exports
export {
    formatModifier,
    formatDiceInput
} from './utils/formatting';
```

#### Implementation Checklist
□ Fix setupUI undefined error
□ Correct setupDiceButtons import path
□ Standardize import paths
□ Reorganize imports by category
□ Reorganize exports by category
□ Update import comments
□ Verify all exports are used
□ Test after reorganization

### B. ui/button-handler.js
□ Document current setup functions
□ Map event handler initialization
□ Document button dependencies
□ Analyze event conflicts
□ Verify error handling

### C. ui/input-handler.js
□ Document setup functions
□ Map keyboard handlers ✓
□ Document event conflicts ✓
□ Analyze input validation
□ Verify error handling

### D. ui/display.js
□ Document display initialization
□ Map update functions
□ Document DOM dependencies
□ Analyze animation hooks
□ Verify error states

### E. ui/help.js
□ Document help system setup
□ Map UI interactions
□ Document content management
□ Analyze accessibility
□ Verify error handling

### F. ui/number-buttons.js
□ Document setup functions
□ Map button interactions
□ Document state management
□ Analyze input validation
□ Verify error handling

### G. state.js
□ Document state initialization
□ Map state dependencies
□ Document API functions
□ Analyze state validation
□ Verify error handling

### H. core-functions.js
#### 1. Core Functions Documentation Checklist
□ Document File Responsibilities
  - [x] Core dice rolling functionality
  - [x] State management integration
  - [x] Animation coordination
  - [x] Applet control
  - [x] Input processing
  - [x] Display data preparation

□ Document Function Categories
  - [x] Standard Die Operations
    * rollSpecificDie
    * isStandardDie
  - [x] Special Dice Operations
    * rollPercentileDie
    * rollNonStandardDie
    * rollCustomDie
  - [x] Dice Pool Management
    * clearDicePool
    * rerollAllDice
  - [x] Display Data Preparation
    * prepareDisplayData
    * prepareResultsData
    * prepareAnimationData
  - [x] Applet Control
    * resetApplet
    * toggleApplet
    * minimizeApplet
    * centerApplet
    * showApplet
  - [x] Input Processing
    * processNotation
    * activatePercentileMode

□ Document Dependencies
  - [x] State Management
    * getSelectedDice, getCurrentRolls, getModifier, etc.
    * addDie, addRollResult, setRollResults
    * setModifier, clearDice, clearResults, resetState
  - [x] Animation System
    * animateDiceIcons, animateResults
    * resetD10State, animateD10
  - [x] Display System
    * updateDisplay, updateResults
  - [x] Dice Logic
    * rollDie, rollAllDice, computeTotal
    * parseDiceNotation, rollPercentile

☒ Document API Contracts
  - [x] Function Parameters
  - [x] Return Values
  - [x] Error Conditions
  - [x] State Requirements
  - [x] Animation Requirements
  - [x] Display Requirements

☒ Document Error Handling
  - [x] Input Validation
    * Dice type validation
    * Number range validation
    * String format validation
  - [x] State Validation
    * State initialization checks
    * State corruption detection
    * State recovery strategies
  - [x] Animation Failures
    * DOM element missing
    * Animation interruption
    * Timing issues
  - [x] Display Updates
    * Missing display elements
    * Update race conditions
    * Display state corruption
  - [x] Recovery Strategies
    * Fallback behaviors
    * Cleanup procedures
    * User feedback

□ Document Initialization Requirements
  - [x] Required State Setup
  - [ ] DOM Dependencies
  - [ ] Animation System State
  - [ ] Display System State

#### 2. Required State Setup
##### a. State Structure and Properties
```javascript
// Pattern: All state initialization must follow this structure
{
    requiredProperties: {
        dicePool: {
            type: 'Array<string>',
            default: [],
            validation: 'Must contain only valid dice types',
            dependencies: ['validDiceTypes']
        },
        results: {
            type: 'Array<number>',
            default: [],
            validation: 'Length must match dicePool',
            dependencies: ['dicePool']
        },
        modifier: {
            type: 'number',
            default: 0,
            validation: 'Integer between -100 and 100',
            dependencies: []
        },
        isPercentileMode: {
            type: 'boolean',
            default: false,
            validation: 'True only if dicePool contains only d10s',
            dependencies: ['dicePool']
        },
        animationState: {
            type: 'Object',
            default: {
                isAnimating: false,
                activeAnimations: new Set(),
                queuedAnimations: []
            },
            validation: 'Must track all ongoing animations',
            dependencies: ['dicePool']
        },
        displayState: {
            type: 'Object',
            default: {
                isMinimized: false,
                position: { x: 0, y: 0 },
                isDragging: false
            },
            validation: 'Must maintain valid window state',
            dependencies: []
        }
    },
    validationRules: {
        dicePool: [
            'Must be array of strings',
            'Each die must match pattern d[0-9]+',
            'Cannot mix percentile and standard dice',
            'Maximum pool size of 20 dice'
        ],
        results: [
            'Must be array of numbers',
            'Each result must be > 0',
            'Each result must be <= corresponding die size',
            'Length must match dicePool length'
        ],
        modifier: [
            'Must be integer',
            'Must be between -100 and 100',
            'Must be applied after dice results'
        ],
        isPercentileMode: [
            'Must be boolean',
            'True requires exactly two d10s in pool',
            'False requires no d10s in percentile mode'
        ],
        animationState: [
            'Must track all active animations',
            'Must prevent conflicting animations',
            'Must cleanup completed animations'
        ],
        displayState: [
            'Position must be within viewport',
            'Must maintain valid drag state',
            'Must track minimize/maximize state'
        ]
    }
}
```

##### b. Initialization Order
```javascript
// Pattern: All state initialization must follow this sequence
{
    initializationSteps: [
        {
            step: 'validateEnvironment',
            checks: [
                'Window object exists',
                'DOM fully loaded',
                'Required APIs available'
            ],
            recovery: 'Fail fast with clear error'
        },
        {
            step: 'createStateContainer',
            checks: [
                'No existing state container',
                'Memory available',
                'Storage permission'
            ],
            recovery: 'Clear existing if found'
        },
        {
            step: 'setDefaultValues',
            checks: [
                'All required properties present',
                'Types match specifications',
                'Defaults are valid'
            ],
            recovery: 'Reset invalid to defaults'
        },
        {
            step: 'validateInitialState',
            checks: [
                'State integrity check',
                'Cross-property validation',
                'Dependency satisfaction'
            ],
            recovery: 'Reconstruct from defaults'
        },
        {
            step: 'initializeSubsystems',
            checks: [
                'Animation system ready',
                'Display system ready',
                'Event handlers bound'
            ],
            recovery: 'Retry or degrade gracefully'
        }
    ],
    verificationSteps: [
        'Verify all properties initialized',
        'Test state access methods',
        'Validate state mutations',
        'Check error handling',
        'Verify event propagation'
    ]
}
```

##### c. State Dependencies
```javascript
// Pattern: All state dependencies must be documented
{
    coreDependencies: {
        state: {
            requires: ['window', 'localStorage'],
            provides: ['getState', 'setState']
        },
        dice: {
            requires: ['state', 'randomization'],
            provides: ['rollDice', 'addDie']
        },
        display: {
            requires: ['state', 'DOM'],
            provides: ['updateDisplay', 'showResults']
        },
        animation: {
            requires: ['state', 'display'],
            provides: ['animate', 'cancelAnimation']
        }
    },
    crossDependencies: {
        'dicePool -> results': 'Results length matches pool',
        'dicePool -> isPercentileMode': 'Mode matches dice types',
        'animationState -> displayState': 'Animations respect window state'
    },
    initializationOrder: [
        'state core',
        'dice system',
        'display system',
        'animation system'
    ],
    verificationPoints: [
        'After each system init',
        'Before first dice roll',
        'After state mutations',
        'Before animations'
    ]
}
```

##### d. Implementation Requirements
- State must be initialized before any other systems
- All properties must have default values
- Validation must occur at every state change
- Dependencies must be checked before use
- State mutations must be atomic
- Initialization must be idempotent
- Recovery strategies must be defined
- State access must be controlled
- Cross-property validation required
- Initialization status must be tracked

##### e. Error Handling
```javascript
// Pattern: All state initialization errors must be handled
{
    errorTypes: {
        initialization: {
            missing: 'Required property not found',
            invalid: 'Property has invalid value',
            dependency: 'Required dependency not met'
        },
        validation: {
            type: 'Property has wrong type',
            range: 'Value out of allowed range',
            format: 'Value in wrong format'
        },
        runtime: {
            mutation: 'Invalid state change',
            access: 'Unauthorized state access',
            corruption: 'State integrity violated'
        }
    },
    recoveryActions: {
        reset: 'Reset to default values',
        partial: 'Reset only invalid properties',
        rebuild: 'Reconstruct from last known good'
    },
    loggingRequirements: {
        level: 'Error details must be logged',
        data: 'Include state snapshot',
        context: 'Record initialization step'
    }
}
```

#### 3. Current Implementation Analysis
1. **File Purpose**
- Centralizes all dice rolling functionality
- Provides clean API for dice operations
- Separates business logic from UI concerns
- Uses state management API for all operations
- Coordinates animations and display updates

2. **Core Dependencies**
- State Management (`./state`)
  * Required for all dice operations
  * Must be initialized first
  * Handles all state mutations
  
- Dice Logic (`./dice-logic`)
  * Provides core rolling mechanics
  * Handles percentile calculations
  * Processes dice notation
  
- Animation System (`./animations/dice-animations`)
  * Required for visual feedback
  * Manages animation sequences
  * Handles special d10 states
  
- Display System (`./ui/display`)
  * Updates UI after operations
  * Shows results and state changes

3. **Initialization Order**
- State system must be ready
- Animation system must be initialized
- Display system must be available
- DOM elements must exist for:
  * Dice container
  * Results display
  * Applet positioning

4. **Critical Functions**
- `rollSpecificDie`: Core dice adding/rolling
- `processNotation`: Handles all input processing
- `resetApplet`: Full system reset capability
- `animateDiceRoll`: Coordinates all animations

5. **Issues Found**
- Some functions access state directly (needs refactoring)
- Animation error handling could be improved
- Display update error checking needed
- Some functions lack proper validation

#### 4. Next Steps
1. Document all API contracts
2. Map error handling patterns
3. Verify initialization requirements
4. Test state management integration
5. Validate animation coordination

#### 5. API Contracts
1. **Standard Die Operations**

`rollSpecificDie(dieType: string, autoRoll: boolean = true)`
- Parameters:
  * dieType: Must be one of: 'd4', 'd6', 'd8', 'd10', 'd12', 'd20'
  * autoRoll: Optional boolean to trigger immediate roll
- Returns:
  * Success: { results: number[], diceToAnimate: string[], total: number }
  * Failure: false
- State Requirements:
  * No percentile die in pool
  * Valid state initialization
- Error Conditions:
  * Invalid die type
  * State not initialized
  * Animation system failure
- Display Requirements:
  * Updates input display
  * Triggers animation if autoRoll=true

`isStandardDie(dieType: string)`
- Parameters:
  * dieType: String to check
- Returns:
  * boolean: true if standard die type
- No state requirements
- No error conditions
- No display requirements

2. **Special Dice Operations**

`rollPercentileDie()`
- Parameters: None
- Returns:
  * Success: { tens: number, ones: number, total: number }
  * Failure: false
- State Requirements:
  * No other dice in pool
  * d10 state initialized
- Error Conditions:
  * Other dice present
  * Animation system failure
- Display Requirements:
  * Updates percentile display
  * Triggers split d10 animations (separate tens/ones dice)

`rollNonStandardDie(sides: number)`
- Parameters:
  * sides: number > 0
- Returns:
  * Success: { result: number, dieType: string }
  * Failure: false
- State Requirements:
  * Valid state initialization
- Error Conditions:
  * Invalid sides count
  * State not initialized
- Display Requirements:
  * Updates non-standard display

3. **Dice Pool Management**

`clearDicePool()`
- Parameters: None
- Returns:
  * Success: true
  * Failure: false
- State Requirements:
  * State system initialized
- Error Conditions:
  * State corruption
- Display Requirements:
  * Clears all dice displays
  * Updates input field
  * Resets animations

`rerollAllDice()`
- Parameters: None
- Returns:
  * Success: { results: number[], total: number }
  * Failure: false
- State Requirements:
  * At least one die in pool
  * Valid state initialization
- Error Conditions:
  * Empty dice pool
  * Animation system failure
- Display Requirements:
  * Updates all dice displays
  * Triggers animations

4. **Display Data Preparation**

`prepareDisplayData()`
- Parameters: None
- Returns:
  * { selectedDice: string[], modifier: number, isPercentile: boolean }
- State Requirements:
  * Valid state initialization
- Error Conditions:
  * State not initialized
- No display requirements

`prepareResultsData(results: number[], diceTypes: string[], modifier: number)`
- Parameters:
  * results: Array of roll results
  * diceTypes: Array of corresponding die types
  * modifier: Number to add to total
- Returns:
  * { standardResults: Array, nonStandardGroups: Object, total: number }
- State Requirements:
  * None (pure data transformation)
- Error Conditions:
  * Arrays not same length
  * Invalid die types
- No display requirements

5. **Applet Control**

`resetApplet(clearAll: boolean = true, centerPosition: boolean = true, hideApplet: boolean = true)`
- Parameters:
  * clearAll: Whether to clear all state
  * centerPosition: Whether to center the applet
  * hideApplet: Whether to minimize after reset
- Returns:
  * Success: true
  * Failure: false
- State Requirements:
  * Valid state initialization
  * DOM elements exist
- Error Conditions:
  * Missing DOM elements
  * State corruption
  * Animation system failure
- Display Requirements:
  * Updates all displays
  * Resets animations
  * Updates position

`toggleApplet()`
- Parameters: None
- Returns:
  * Success: true
  * Failure: false
- State Requirements:
  * DOM elements exist
- Error Conditions:
  * Missing DOM elements
  * Animation failure
- Display Requirements:
  * Animates visibility change
  * Maintains position

6. **Input Processing**

`processNotation(input: string)`
- Parameters:
  * input: Dice notation string (e.g., "2d6+3")
- Returns:
  * Success: { dice: string[], modifier: number }
  * Failure: false
- State Requirements:
  * None (pure parsing)
- Error Conditions:
  * Invalid notation format
  * Unsupported dice types
- No display requirements

`activatePercentileMode()`
- Parameters: None
- Returns:
  * Success: true
  * Failure: false
- State Requirements:
  * No other dice in pool
  * d10 state initialized
- Error Conditions:
  * Other dice present
  * d10 state not ready
- Display Requirements:
  * Updates d10 display
  * Shows percentile mode

7. **Animation Control**

`animateDiceRoll(results: Array, callback?: Function)`
- Parameters:
  * results: Array of roll results
  * callback: Optional function to call after animation
- Returns:
  * Success: true
  * Failure: false
- State Requirements:
  * Animation system initialized
  * DOM elements exist
- Error Conditions:
  * Missing DOM elements
  * Animation system failure
- Display Requirements:
  * Animates dice results
  * Updates displays after animation
  * Handles animation chaining

`triggerPercentileRoll()`
- Parameters: None
- Returns:
  * Success: { tens: number, ones: number }
  * Failure: false
- State Requirements:
  * d10 state initialized
  * Percentile mode active
- Error Conditions:
  * Invalid d10 state
  * Animation system failure
- Display Requirements:
  * Animates both d10 rolls
  * Updates percentile display

#### 6. Error Handling Patterns
1. Input Validation

a. Dice Type Validation
```javascript
// Pattern: All dice type validation must follow this structure
{
    input: string,        // Raw input (e.g., 'd20', 'D6')
    requirements: {
        format: 'd' + number,
        allowedTypes: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
        specialCases: {
            'd100': 'Treated as d10 for percentile',
            'd10': 'Handles both standard and percentile'
        }
    },
    validation: {
        steps: [
            'Normalize to lowercase',
            'Check format matches d<number>',
            'Verify against allowed types',
            'Handle d100 special case'
        ],
        errorMessages: {
            format: 'Must be in format "d<number>"',
            type: 'Must be one of: d4, d6, d8, d10, d12, d20, d100',
            value: 'Invalid dice type: {input}'
        }
    }
}
```

b. Number Range Validation
```javascript
// Pattern: All number validation must follow this structure
{
    input: number,
    requirements: {
        types: {
            'd4':  { min: 1, max: 4 },
            'd6':  { min: 1, max: 6 },
            'd8':  { min: 1, max: 8 },
            'd10': { min: 0, max: 9 },  // Special case for percentile
            'd12': { min: 1, max: 12 },
            'd20': { min: 1, max: 20 }
        },
        counts: { min: 1, max: 100 },    // For number of dice
        modifiers: { min: -100, max: 100 }
    },
    validation: {
        steps: [
            'Verify numeric type',
            'Check within dice-specific range',
            'Handle d10 percentile special case',
            'Validate dice counts and modifiers'
        ],
        errorMessages: {
            type: 'Must be a valid number',
            range: 'Must be between {min} and {max} for {diceType}',
            count: 'Dice count must be between 1 and 100',
            modifier: 'Modifier must be between -100 and +100'
        }
    }
}
```

c. String Format (Dice Notation) Validation
```javascript
// Pattern: All dice notation validation must follow this structure
{
    input: string,       // Raw input (e.g., "2d6+1")
    requirements: {
        format: {
            pattern: /^(\d+)?d(\d+)([+-]\d+)?$/,
            examples: [
                "d20",    // Single die
                "2d6",    // Multiple dice
                "d8+1",   // With modifier
                "3d4-2"   // Multiple dice with modifier
            ]
        },
        components: {
            count: 'Optional, defaults to 1',
            type: 'Required, must be valid dice type',
            modifier: 'Optional, defaults to +0'
        }
    },
    validation: {
        steps: [
            'Parse notation into components',
            'Validate each component separately',
            'Handle defaults for optional components',
            'Combine component validations'
        ],
        errorMessages: {
            format: 'Must be in format "[number]d<sides>[+/-modifier]"',
            parse: 'Could not parse dice notation: {input}',
            component: 'Invalid {component}: {value}'
        }
    }
}
```

d. Implementation Requirements
- All input validation must return consistent result objects
- Error messages must be user-friendly and actionable
- Special cases must be explicitly handled
- Validation must occur before any state changes
- Invalid input must not affect application state
- All validation errors must be logged
- Recovery suggestions should be provided where possible

2. State Validation

a. State Initialization Checks
```javascript
// Pattern: All state initialization validation must follow this structure
{
    requiredState: {
        dicePool: {
            type: 'Array',
            defaultValue: [],
            validate: 'Must be initialized as empty array'
        },
        results: {
            type: 'Array',
            defaultValue: [],
            validate: 'Must be initialized as empty array'
        },
        modifier: {
            type: 'Number',
            defaultValue: 0,
            validate: 'Must be initialized as 0'
        },
        isPercentileMode: {
            type: 'Boolean',
            defaultValue: false,
            validate: 'Must be initialized as false'
        },
        isAnimating: {
            type: 'Boolean',
            defaultValue: false,
            validate: 'Must be initialized as false'
        }
    },
    initializationOrder: [
        'Create empty state object',
        'Set all properties to defaults',
        'Verify all required properties exist',
        'Verify all types match requirements',
        'Log initialization success/failure'
    ],
    errorMessages: {
        missing: 'Required state property {prop} is missing',
        type: 'State property {prop} has incorrect type',
        value: 'State property {prop} has invalid initial value'
    }
}
```

b. State Corruption Detection
```javascript
// Pattern: All state corruption checks must follow this structure
{
    invariants: {
        dicePool: [
            'Length matches results array',
            'All entries are valid dice types',
            'No null or undefined entries'
        ],
        results: [
            'Length matches dicePool array',
            'All values within valid ranges',
            'No null or undefined entries'
        ],
        modifier: [
            'Must be number between -100 and +100',
            'Must be integer'
        ],
        percentileMode: [
            'When true, dicePool must contain only d10s',
            'When true, results must be valid percentile values'
        ]
    },
    checkPoints: [
        'Before state modification',
        'After dice are added/removed',
        'After results are updated',
        'After mode changes',
        'After animations complete'
    ],
    detectionStrategy: {
        timing: 'Check invariants at all checkpoints',
        scope: 'Check all affected properties',
        depth: 'Deep comparison for arrays'
    }
}
```

c. State Recovery Strategies
```javascript
// Pattern: All state recovery must follow this structure
{
    recoveryLevels: {
        soft: {
            strategy: 'Fix invalid values without reset',
            cases: [
                'Invalid modifier (clamp to range)',
                'Missing results (regenerate for existing dice)',
                'Mismatched array lengths (truncate longer)'
            ]
        },
        medium: {
            strategy: 'Partial reset of affected component',
            cases: [
                'Invalid dice types (remove invalid dice)',
                'Invalid results (clear and re-roll)',
                'Mode inconsistency (reset to standard)'
            ]
        },
        hard: {
            strategy: 'Complete state reset',
            cases: [
                'Multiple invariants violated',
                'Unrecoverable corruption',
                'Unknown state detected'
            ]
        }
    },
    recoverySteps: [
        'Detect corruption level',
        'Back up current state',
        'Apply appropriate recovery',
        'Verify recovered state',
        'Log recovery details'
    ],
    userFeedback: {
        soft: 'Silent recovery - log only',
        medium: 'Notify user of action taken',
        hard: 'Alert user of reset requirement'
    }
}
```

d. Implementation Requirements
- State validation must occur at all checkpoints
- Recovery must preserve valid state where possible
- All state changes must be atomic
- Recovery actions must be logged
- User must be notified of significant state changes
- State history must be maintained for rollback
- Validation must prevent impossible states

3. Animation Failures

a. DOM Element Validation
```javascript
// Pattern: All animation element validation must follow this structure
{
    requiredElements: {
        containers: {
            'dice-container': {
                required: true,
                purpose: 'Holds animated dice elements',
                fallback: 'Create minimal container'
            },
            'results-container': {
                required: true,
                purpose: 'Displays roll results',
                fallback: 'Create minimal display'
            },
            'd10-container': {
                required: true,
                purpose: 'Handles percentile animations',
                fallback: 'Disable percentile mode'
            }
        },
        animationTargets: {
            '.die-face': {
                required: false,
                purpose: 'Individual die animations',
                fallback: 'Use simplified animation'
            },
            '.roll-value': {
                required: false,
                purpose: 'Result number animations',
                fallback: 'Skip number animation'
            }
        }
    },
    validationSteps: [
        'Check container existence',
        'Verify container visibility',
        'Check animation target availability',
        'Validate container hierarchy'
    ],
    errorMessages: {
        missing: 'Required animation element missing: {id}',
        hidden: 'Animation container not visible: {id}',
        hierarchy: 'Invalid container structure for {id}'
    }
}
```

b. Animation Interruption
```javascript
// Pattern: All animation interruption handling must follow this structure
{
    trackingSystem: {
        activeAnimations: 'Set of currently running animations',
        animationQueue: 'Queue of pending animations',
        interruptionTypes: {
            user: 'User triggered interruption',
            system: 'System triggered interruption',
            error: 'Error-based interruption'
        }
    },
    interruptionHandling: {
        cleanup: [
            'Cancel active animations',
            'Clear animation queue',
            'Reset element states',
            'Update tracking system'
        ],
        recovery: [
            'Restore initial positions',
            'Clear transforms',
            'Reset opacity',
            'Update final state'
        ],
        logging: [
            'Log interruption type',
            'Record affected elements',
            'Track timing of interruption',
            'Note recovery actions'
        ]
    },
    safetyMeasures: {
        timeout: 'Maximum animation duration',
        queueLimit: 'Maximum queued animations',
        frameSkipDetection: 'Monitor frame timing',
        resourceCheck: 'Verify system resources'
    }
}
```

c. Timing Issues
```javascript
// Pattern: All animation timing handling must follow this structure
{
    timingMetrics: {
        targetFPS: 60,
        frameInterval: 16.67,  // ms
        maxSkippedFrames: 3,
        minSmoothDuration: 100 // ms
    },
    monitoringSystem: {
        frameDeltas: 'Track time between frames',
        performanceMarks: 'Record animation milestones',
        resourceUsage: 'Monitor system load',
        gpuStatus: 'Check GPU availability'
    },
    compensationStrategies: {
        frameSkipping: {
            detection: 'Monitor frame timing',
            threshold: '> 16.67ms between frames',
            action: 'Adjust animation steps'
        },
        slowdown: {
            detection: 'Track overall duration',
            threshold: '< 30 FPS sustained',
            action: 'Simplify animation'
        },
        overload: {
            detection: 'Multiple animations queued',
            threshold: '> 5 concurrent animations',
            action: 'Throttle or combine animations'
        }
    }
}
```

d. Implementation Requirements
- All animations must use requestAnimationFrame
- Animation system must handle interruptions gracefully
- Timing issues must be detected and compensated for
- Resource usage must be monitored and managed
- Animations must be cancellable at any point
- System must recover from failed animations
- All animation errors must be logged
- Fallback animations must be available
- Performance metrics must be tracked
- Animation state must be maintained

4. Display Updates

a. Missing Display Elements
```javascript
// Pattern: All display element validation must follow this structure
{
    displayElements: {
        results: {
            id: 'results-container',
            required: true,
            purpose: 'Shows roll results and totals',
            fallback: {
                type: 'create',
                template: '<div id="results-container"></div>'
            }
        },
        dicePool: {
            id: 'dice-pool',
            required: true,
            purpose: 'Shows current selected dice',
            fallback: {
                type: 'create',
                template: '<div id="dice-pool"></div>'
            }
        },
        modifier: {
            id: 'modifier-display',
            required: true,
            purpose: 'Shows current modifier value',
            fallback: {
                type: 'create',
                template: '<div id="modifier-display">+0</div>'
            }
        }
    },
    validationSteps: [
        'Check element existence',
        'Verify display state',
        'Check content structure',
        'Validate accessibility attributes'
    ],
    recoveryActions: {
        missing: 'Create minimal element',
        corrupt: 'Clear and rebuild',
        invalid: 'Reset to default state'
    }
}
```

b. Update Race Conditions
```javascript
// Pattern: All display update synchronization must follow this structure
{
    updateQueue: {
        priority: {
            high: ['State changes', 'Error messages'],
            medium: ['Roll results', 'Dice pool updates'],
            low: ['Animations', 'Style updates']
        },
        processing: {
            batch: 'Combine similar updates',
            debounce: 'Delay rapid updates',
            throttle: 'Limit update frequency'
        }
    },
    synchronization: {
        locks: {
            state: 'Prevent concurrent state updates',
            display: 'Prevent concurrent DOM updates',
            animation: 'Prevent animation conflicts'
        },
        sequence: [
            'Acquire relevant locks',
            'Process queued updates',
            'Update display elements',
            'Release locks in reverse order'
        ]
    },
    conflictResolution: {
        detection: [
            'Track update timestamps',
            'Monitor lock durations',
            'Check for overlapping updates'
        ],
        resolution: [
            'Cancel outdated updates',
            'Merge conflicting updates',
            'Force sequential processing'
        ]
    }
}
```

c. Display State Corruption
```javascript
// Pattern: All display state validation must follow this structure
{
    stateValidation: {
        content: {
            dicePool: 'Must match state.selectedDice',
            results: 'Must match state.currentRolls',
            modifier: 'Must match state.modifier'
        },
        structure: {
            elements: 'Required DOM hierarchy',
            classes: 'Required style classes',
            attributes: 'Required ARIA attributes'
        },
        consistency: {
            internal: 'Display elements match each other',
            external: 'Display matches application state'
        }
    },
    corruptionTypes: {
        desync: {
            symptoms: ['Display shows wrong values', 'Inconsistent updates'],
            detection: 'Compare display to state',
            recovery: 'Force display refresh'
        },
        structure: {
            symptoms: ['Missing elements', 'Wrong hierarchy'],
            detection: 'Validate DOM structure',
            recovery: 'Rebuild display elements'
        },
        style: {
            symptoms: ['Missing styles', 'Wrong animations'],
            detection: 'Check computed styles',
            recovery: 'Reapply style classes'
        }
    },
    recoveryStrategies: {
        soft: {
            action: 'Update content only',
            when: 'Minor content mismatch'
        },
        medium: {
            action: 'Rebuild affected section',
            when: 'Structure corruption'
        },
        hard: {
            action: 'Full display reset',
            when: 'Severe corruption'
        }
    }
}
```

d. Implementation Requirements
- All display updates must be queued and synchronized
- Display state must be validated before and after updates
- DOM structure must be verified before updates
- Style consistency must be maintained
- Race conditions must be prevented
- Recovery must be possible from any corruption
- Updates must be atomic (all or nothing)
- Display must degrade gracefully
- Accessibility must be maintained
- All display errors must be logged

5. Recovery Strategies

a. Fallback Behaviors
```javascript
// Pattern: All fallback behaviors must follow this structure
{
    fallbackLevels: {
        ui: {
            missingElements: {
                strategy: 'Create minimal UI',
                template: '<div class="minimal-dice-ui">...</div>',
                features: ['Basic rolling', 'Result display']
            },
            brokenStyles: {
                strategy: 'Load emergency CSS',
                template: 'emergency-styles.css',
                features: ['Basic layout', 'Readable text']
            },
            failedAnimations: {
                strategy: 'Instant updates',
                method: 'Direct DOM manipulation',
                features: ['Immediate results', 'No transitions']
            }
        },
        state: {
            corruptData: {
                strategy: 'Reset to defaults',
                backup: 'Last known good state',
                features: ['Clean slate', 'History preserved']
            },
            invalidDice: {
                strategy: 'Remove invalid dice',
                cleanup: 'Filter dice pool',
                features: ['Continue with valid dice']
            }
        },
        system: {
            resourceLimit: {
                strategy: 'Reduce features',
                method: 'Disable animations',
                features: ['Core functionality only']
            },
            browserIncompatible: {
                strategy: 'Basic mode',
                method: 'Polyfill core features',
                features: ['Essential dice rolling']
            }
        }
    },
    implementation: {
        detection: 'Monitor system health',
        activation: 'Automatic on failure',
        logging: 'Record fallback usage',
        metrics: 'Track recovery success'
    }
}
```

b. Cleanup Procedures
```javascript
// Pattern: All cleanup procedures must follow this structure
{
    cleanupTriggers: {
        critical: {
            conditions: [
                'State corruption detected',
                'Multiple animation failures',
                'UI element hierarchy broken'
            ],
            actions: [
                'Stop all animations',
                'Clear event queue',
                'Reset DOM state',
                'Clear local storage',
                'Rebuild UI hierarchy'
            ]
        },
        standard: {
            conditions: [
                'Failed dice roll',
                'Interrupted animation',
                'Invalid user input'
            ],
            actions: [
                'Reset affected component',
                'Clear partial results',
                'Restore default state'
            ]
        },
        routine: {
            conditions: [
                'Session end',
                'Tab close',
                'User reset'
            ],
            actions: [
                'Save state',
                'Clear temporary data',
                'Reset UI position'
            ]
        }
    },
    procedures: {
        steps: [
            'Pause active operations',
            'Log cleanup trigger',
            'Execute cleanup actions',
            'Verify system state',
            'Resume operations'
        ],
        verification: [
            'Check DOM integrity',
            'Verify state consistency',
            'Test core functions',
            'Validate UI state'
        ]
    }
}
```

c. User Feedback
```javascript
// Pattern: All user feedback must follow this structure
{
    feedbackTypes: {
        error: {
            visual: {
                primary: 'Error message banner',
                secondary: 'Red highlight on problem area',
                duration: '5 seconds or user dismiss'
            },
            message: {
                format: '{action} failed: {reason}',
                style: 'Clear, actionable language',
                example: 'Dice roll failed: Network unavailable'
            },
            action: {
                primary: 'Retry button',
                secondary: 'Help link',
                dismiss: 'Clear message'
            }
        },
        warning: {
            visual: {
                primary: 'Yellow warning icon',
                secondary: 'Highlight affected area',
                duration: '3 seconds'
            },
            message: {
                format: 'Warning: {condition}',
                style: 'Preventive guidance',
                example: 'Warning: Large dice pools may be slow'
            },
            action: {
                primary: 'Acknowledge',
                secondary: 'Learn more',
                dismiss: 'Auto-hide after delay'
            }
        },
        recovery: {
            visual: {
                primary: 'Green success indicator',
                secondary: 'Restored element highlight',
                duration: '2 seconds'
            },
            message: {
                format: 'Recovered from {error}',
                style: 'Reassuring confirmation',
                example: 'System restored to last working state'
            },
            action: {
                primary: 'Continue',
                secondary: 'View details',
                dismiss: 'Auto-hide on next action'
            }
        }
    },
    implementation: {
        priority: {
            critical: 'Modal dialog',
            high: 'Banner message',
            normal: 'Status text',
            low: 'Console only'
        },
        placement: {
            error: 'Top center',
            warning: 'Top right',
            recovery: 'Bottom right'
        },
        timing: {
            display: 'Immediate',
            duration: 'Based on severity',
            transition: 'Smooth fade'
        }
    }
}
```

d. Implementation Requirements
- All recovery strategies must be tested in isolation
- Fallback behaviors must maintain core functionality
- Cleanup procedures must be atomic operations
- User feedback must be clear and actionable
- Recovery attempts must be logged with outcomes
- System state must be validated after recovery
- Feedback must not block critical operations
- Recovery metrics must be tracked and analyzed
- Multiple recovery attempts must be handled gracefully
- Recovery strategies must be documented in error logs

#### Implementation Checklist
□ Fix setupUI undefined error
□ Correct setupDiceButtons import path
□ Standardize import paths
□ Reorganize imports by category
□ Reorganize exports by category
□ Update import comments
□ Verify all exports are used
□ Test after reorganization

### I. debug.js
□ Document debug initialization
□ Map keyboard shortcuts ✓
□ Document logging system
□ Analyze debug features
□ Verify error handling

### J. dice-logic.js
□ Document dice mechanics
□ Map function dependencies
□ Document validation rules
□ Analyze edge cases
□ Verify error handling

### K. make-draggable.js
□ Document drag initialization
□ Map event handlers
□ Document position management
□ Analyze boundary handling
□ Verify error states

### L. ui-updates.js
□ Document update system
□ Map DOM interactions
□ Document state dependencies
□ Analyze update triggers
□ Verify error handling

## Phase 2: Consolidation
### A. State Layer (state.js)
#### 1. Migration Steps
##### a. Function Migration
□ Copy state management functions to setup.js:
  - [ ] getState()
  - [ ] setState()
  - [ ] resetState()
  - [ ] validateState()
  - [ ] initializeState()

##### b. Dependency Verification
□ Verify core dependencies:
  - [ ] Local storage availability
  - [ ] DOM ready state
  - [ ] Event system initialization
  - [ ] Error handling setup

##### c. Import Updates
□ Update import statements:
  - [ ] Remove old state.js imports
  - [ ] Add setup.js imports
  - [ ] Update dependent modules
  - [ ] Verify import order

##### d. Testing Protocol
□ Verify functionality:
  - [ ] State initialization
  - [ ] State persistence
  - [ ] State recovery
  - [ ] Error handling
  - [ ] Event propagation

##### e. Code Cleanup
□ Remove original code:
  - [ ] Verify no references remain
  - [ ] Archive state.js
  - [ ] Update documentation
  - [ ] Remove unused exports

#### 2. Implementation Requirements
##### a. State Container
```javascript
// Pattern: State container structure
{
    stateContainer: {
        dicePool: [],          // Current dice selection
        results: [],           // Roll results
        modifier: 0,           // Current modifier
        isPercentileMode: false, // D100 mode flag
        displayState: {
            isMinimized: false,
            position: { x: 0, y: 0 }
        }
    },
    typeValidation: {
        dicePool: {
            type: 'Array<string>',
            validate: (arr) => arr.every(die => /^d\d+$/.test(die)),
            maxLength: 20
        },
        results: {
            type: 'Array<number>',
            validate: (arr, state) => arr.length === state.dicePool.length,
            constraints: 'All numbers must be positive integers'
        },
        modifier: {
            type: 'number',
            validate: (num) => Number.isInteger(num) && num >= -100 && num <= 100
        },
        isPercentileMode: {
            type: 'boolean',
            validate: (bool, state) => !bool || state.dicePool.every(die => die === 'd10')
        },
        displayState: {
            type: 'Object',
            required: ['isMinimized', 'position'],
            validate: (obj) => typeof obj.isMinimized === 'boolean' && 
                             typeof obj.position.x === 'number' && 
                             typeof obj.position.y === 'number'
        }
    }
}
```

##### b. Validation Rules
```javascript
// Pattern: State validation rules
{
    validationRules: {
        dicePool: 'Array of valid dice types',
        results: 'Array matching dicePool length',
        modifier: 'Integer between -100 and +100',
        isPercentileMode: 'Boolean with d10 requirements',
        displayState: 'Valid window state object'
    }
}
```

##### c. Migration Requirements
- All state mutations must use new API
- State validation must occur on every change
- Error handling must be comprehensive
- Events must be properly propagated
- Documentation must be updated
- Tests must verify all scenarios

#### 3. Success Criteria
□ All state functions migrated
□ No references to old state.js
□ All tests passing
□ Documentation updated
□ No runtime errors
□ Clean error handling

### B. Core Functions Layer (core-functions.js)
#### 1. Migration Steps
##### a. Function Migration
□ Copy core functions to setup.js:
  - [ ] rollSpecificDie()
  - [ ] rollPercentileDie()
  - [ ] rollNonStandardDie()
  - [ ] rerollAllDice()
  - [ ] processNotation()
  - [ ] animateDiceRoll()
  - [ ] prepareDisplayData()

##### b. Dependency Verification
□ Verify core dependencies:
  - [ ] State management API
  - [ ] Animation system
  - [ ] Display system
  - [ ] Random number generation
  - [ ] Error handling system

##### c. Import Updates
□ Update import statements:
  - [ ] Remove core-functions.js imports
  - [ ] Add setup.js imports
  - [ ] Update animation dependencies
  - [ ] Update display dependencies

##### d. Testing Protocol
□ Verify functionality:
  - [ ] Standard dice rolls
  - [ ] Percentile dice rolls
  - [ ] Non-standard dice
  - [ ] Animation sequences
  - [ ] Error cases

##### e. Code Cleanup
□ Remove original code:
  - [ ] Verify no references remain
  - [ ] Archive core-functions.js
  - [ ] Update documentation
  - [ ] Remove unused exports

#### 2. Implementation Requirements
##### a. Core Function Structure
```javascript
// Pattern: Core function implementation
{
    diceOperations: {
        standard: {
            validate: (dieType) => /^d(4|6|8|10|12|20)$/.test(dieType),
            roll: (sides) => Math.floor(Math.random() * sides) + 1,
            animate: true,
            errorHandling: 'throwAndRecover'
        },
        percentile: {
            validate: (pool) => pool.every(die => die === 'd10'),
            roll: () => ({
                tens: Math.floor(Math.random() * 10) * 10,
                ones: Math.floor(Math.random() * 10)
            }),
            animate: true,
            errorHandling: 'throwAndRecover'
        },
        nonStandard: {
            validate: (sides) => Number.isInteger(sides) && sides > 0,
            roll: (sides) => Math.floor(Math.random() * sides) + 1,
            animate: false,
            errorHandling: 'logAndContinue'
        }
    },
    animationControl: {
        sequence: ['prepare', 'execute', 'complete'],
        timing: {
            prepare: 100,
            execute: 1000,
            complete: 100
        },
        interruption: {
            handle: 'cancelAndReset',
            cleanup: true
        }
    },
    displayPreparation: {
        standard: ['results', 'total', 'modifier'],
        percentile: ['tens', 'ones', 'total'],
        nonStandard: ['result', 'notation']
    }
}
```

##### b. Validation Rules
```javascript
// Pattern: Core function validation
{
    inputValidation: {
        dieType: {
            pattern: /^d\d+$/,
            allowedTypes: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'],
            errorMessage: 'Invalid die type: {input}'
        },
        dicePool: {
            maxSize: 20,
            uniqueTypes: true,
            errorMessage: 'Invalid dice pool: {reason}'
        },
        notation: {
            pattern: /^(\d+)?d(\d+)([+-]\d+)?$/,
            errorMessage: 'Invalid dice notation: {input}'
        }
    },
    stateValidation: {
        beforeRoll: [
            'State initialized',
            'No active animations',
            'Valid dice pool'
        ],
        afterRoll: [
            'Results array updated',
            'Animation completed',
            'Display updated'
        ]
    }
}
```

##### c. Migration Requirements
- All dice operations must use new validation
- Animation sequences must be atomic
- Display updates must be synchronized
- Error handling must be comprehensive
- State updates must be validated
- Documentation must be updated

#### 3. Success Criteria
□ All core functions migrated
□ No references to old core-functions.js
□ All dice operations working
□ Animations functioning correctly
□ Error handling comprehensive
□ Documentation complete

### C. DOM Elements Layer (dom-elements.js)
#### 1. Migration Steps
##### a. Element Verification Migration
□ Copy element verification functions to setup.js:
  - [ ] validateRequiredElements()
  - [ ] verifyDiceContainer()
  - [ ] verifyResultsDisplay()
  - [ ] verifyControlPanel()
  - [ ] verifyHelpSystem()

##### b. Dependency Verification
□ Verify core dependencies:
  - [ ] DOM ready state
  - [ ] Parent container existence
  - [ ] Style sheet loading
  - [ ] Error handling system
  - [ ] Logging system

##### c. Import Updates
□ Update import statements:
  - [ ] Remove dom-elements.js imports
  - [ ] Add setup.js imports
  - [ ] Update style dependencies
  - [ ] Update utility imports

##### d. Testing Protocol
□ Verify functionality:
  - [ ] Element existence checks
  - [ ] Structure validation
  - [ ] Style verification
  - [ ] Error recovery
  - [ ] Accessibility compliance

##### e. Code Cleanup
□ Remove original code:
  - [ ] Verify no references remain
  - [ ] Archive dom-elements.js
  - [ ] Update documentation
  - [ ] Remove unused exports

#### 2. Implementation Requirements
##### a. Element Structure
```javascript
// Pattern: DOM element structure
{
    requiredElements: {
        diceContainer: {
            id: 'dice-roller-container',
            required: true,
            structure: `
                <div id="dice-roller-container">
                    <div class="dice-pool"></div>
                    <div class="results-area"></div>
                    <div class="controls"></div>
                </div>
            `,
            validation: [
                'Container exists',
                'All child elements present',
                'Correct hierarchy maintained'
            ]
        },
        resultsDisplay: {
            id: 'results-display',
            required: true,
            structure: `
                <div id="results-display">
                    <div class="current-roll"></div>
                    <div class="modifier"></div>
                    <div class="total"></div>
                </div>
            `,
            validation: [
                'Display exists',
                'All sections present',
                'Proper nesting verified'
            ]
        },
        controlPanel: {
            id: 'dice-controls',
            required: true,
            structure: `
                <div id="dice-controls">
                    <div class="standard-dice"></div>
                    <div class="special-controls"></div>
                    <div class="modifiers"></div>
                </div>
            `,
            validation: [
                'Panel exists',
                'Control sections present',
                'Button areas defined'
            ]
        }
    },
    elementValidation: {
        attributes: ['id', 'class', 'role', 'aria-*'],
        styles: ['display', 'position', 'visibility'],
        hierarchy: ['parent-child', 'sibling order'],
        accessibility: ['roles', 'labels', 'descriptions']
    }
}
```

##### b. Validation Rules
```javascript
// Pattern: DOM validation rules
{
    structureRules: {
        hierarchy: 'Must maintain proper nesting',
        completeness: 'All required elements present',
        relationships: 'Parent-child relationships valid',
        attributes: 'Required attributes present'
    },
    styleRules: {
        visibility: 'Elements properly displayed',
        positioning: 'Elements correctly positioned',
        responsiveness: 'Layout adapts to viewport'
    },
    accessibilityRules: {
        roles: 'ARIA roles properly assigned',
        labels: 'Elements properly labeled',
        navigation: 'Keyboard navigation functional'
    }
}
```

##### c. Migration Requirements
- All element checks must use new validation
- DOM structure must be verified
- Style application must be validated
- Accessibility must be maintained
- Error handling must be comprehensive
- Documentation must be updated

#### 3. Success Criteria
□ All element verification migrated
□ No references to old dom-elements.js
□ All DOM checks working
□ Style verification complete
□ Accessibility maintained
□ Documentation complete

### D. Event Handlers Layer (event-handlers.js)
#### 1. Migration Steps
##### a. Handler Migration
□ Copy event handler functions to setup.js:
  - [ ] setupGlobalKeyboardHandlers()
  - [ ] setupDiceButtonHandlers()
  - [ ] setupModifierHandlers()
  - [ ] setupPercentileHandlers()
  - [ ] setupDragHandlers()

##### b. Dependency Verification
□ Verify core dependencies:
  - [ ] DOM elements ready
  - [ ] State management API
  - [ ] Core functions available
  - [ ] Error handling system
  - [ ] Animation system ready

##### c. Import Updates
□ Update import statements:
  - [ ] Remove event-handlers.js imports
  - [ ] Add setup.js imports
  - [ ] Update core function imports
  - [ ] Update state management imports

##### d. Testing Protocol
□ Verify functionality:
  - [ ] Keyboard event handling
  - [ ] Mouse event handling
  - [ ] Touch event handling
  - [ ] Error recovery
  - [ ] Event bubbling control

##### e. Code Cleanup
□ Remove original code:
  - [ ] Verify no references remain
  - [ ] Archive event-handlers.js
  - [ ] Update documentation
  - [ ] Remove unused exports

#### 2. Implementation Requirements
##### a. Event Handler Structure
```javascript
// Pattern: Event handler implementation
{
    handlerGroups: {
        keyboard: {
            global: {
                'Escape': {
                    handler: 'handleEscapeKey',
                    priority: 'high',
                    preventDefault: true,
                    stopPropagation: false
                },
                'Enter': {
                    handler: 'handleEnterKey',
                    priority: 'medium',
                    preventDefault: true,
                    stopPropagation: true
                },
                'Space': {
                    handler: 'handleSpaceKey',
                    priority: 'low',
                    preventDefault: true,
                    stopPropagation: false
                }
            },
            input: {
                'Backspace': {
                    handler: 'handleInputBackspace',
                    priority: 'high',
                    preventDefault: false,
                    stopPropagation: true
                },
                'Enter': {
                    handler: 'handleInputEnter',
                    priority: 'high',
                    preventDefault: true,
                    stopPropagation: true
                }
            }
        },
        mouse: {
            diceButtons: {
                'click': {
                    handler: 'handleDiceClick',
                    priority: 'high',
                    preventDefault: true,
                    animation: true
                },
                'contextmenu': {
                    handler: 'handleDiceRightClick',
                    priority: 'medium',
                    preventDefault: true,
                    animation: false
                }
            },
            modifiers: {
                'click': {
                    handler: 'handleModifierClick',
                    priority: 'medium',
                    preventDefault: true,
                    validation: true
                }
            }
        },
        touch: {
            drag: {
                'touchstart': {
                    handler: 'handleDragStart',
                    priority: 'high',
                    preventDefault: true,
                    tracking: true
                },
                'touchmove': {
                    handler: 'handleDragMove',
                    priority: 'high',
                    preventDefault: true,
                    throttle: true
                },
                'touchend': {
                    handler: 'handleDragEnd',
                    priority: 'high',
                    preventDefault: true,
                    cleanup: true
                }
            }
        }
    },
    handlerValidation: {
        preCheck: [
            'DOM elements exist',
            'State is initialized',
            'No conflicting animations'
        ],
        postCheck: [
            'State updated correctly',
            'UI reflects changes',
            'No event conflicts'
        ]
    }
}
```

##### b. Validation Rules
```javascript
// Pattern: Event handler validation
{
    eventRules: {
        keyboard: {
            inputFocus: 'Check before global handlers',
            modifiers: 'Track shift/ctrl state',
            prevention: 'Prevent only when needed',
            bubbling: 'Control propagation carefully'
        },
        mouse: {
            targeting: 'Verify correct element',
            doubleClick: 'Prevent unintended',
            dragConflict: 'Handle with touch events'
        },
        touch: {
            multiTouch: 'Handle single touch only',
            gestureConflict: 'Prevent during drag',
            scrollConflict: 'Handle carefully'
        }
    },
    stateValidation: {
        beforeHandler: [
            'Check handler dependencies',
            'Verify element state',
            'Check animation state'
        ],
        afterHandler: [
            'Verify state updates',
            'Check UI consistency',
            'Validate event cleanup'
        ]
    }
}
```

##### c. Migration Requirements
- All handlers must use new validation
- Event conflicts must be prevented
- Touch/mouse events must be coordinated
- Error handling must be comprehensive
- State updates must be validated
- Documentation must be updated

#### 3. Success Criteria
□ All event handlers migrated
□ No references to old event-handlers.js
□ All events working correctly
□ No handler conflicts
□ Error handling comprehensive
□ Documentation complete

### E. Display Layer (ui/display.js)
#### 1. Migration Steps
##### a. Display Function Migration
□ Copy display functions to setup.js:
  - [ ] initDisplayModule()
  - [ ] updateDisplay()
  - [ ] updateResults()
  - [ ] updateDicePool()
  - [ ] updateModifier()
  - [ ] handleDisplayTransitions()

##### b. Dependency Verification
□ Verify core dependencies:
  - [ ] DOM elements ready
  - [ ] State management API
  - [ ] Animation system ready
  - [ ] Error handling system
  - [ ] Style system loaded

##### c. Import Updates
□ Update import statements:
  - [ ] Remove display.js imports
  - [ ] Add setup.js imports
  - [ ] Update animation imports
  - [ ] Update state management imports

##### d. Testing Protocol
□ Verify functionality:
  - [ ] Display initialization
  - [ ] Results updates
  - [ ] Dice pool visualization
  - [ ] Modifier display
  - [ ] Transition handling

##### e. Code Cleanup
□ Remove original code:
  - [ ] Verify no references remain
  - [ ] Archive display.js
  - [ ] Update documentation
  - [ ] Remove unused exports

#### 2. Implementation Requirements
##### a. Display Module Structure
```javascript
// Pattern: Display module implementation
{
    displayComponents: {
        results: {
            container: {
                id: 'results-display',
                required: true,
                updateMethod: 'updateResults',
                animationHooks: ['beforeUpdate', 'afterUpdate']
            },
            subComponents: {
                currentRoll: {
                    class: 'current-roll',
                    format: 'Array<number>',
                    animation: 'fadeInOut'
                },
                modifier: {
                    class: 'modifier-value',
                    format: 'signedNumber',
                    animation: 'slideUpdate'
                },
                total: {
                    class: 'total-value',
                    format: 'number',
                    animation: 'emphasize'
                }
            }
        },
        dicePool: {
            container: {
                id: 'dice-pool',
                required: true,
                updateMethod: 'updateDicePool',
                animationHooks: ['beforeAdd', 'afterRemove']
            },
            diceVisuals: {
                standard: {
                    template: '<div class="die-{type}"></div>',
                    animation: 'rollAndSettle'
                },
                percentile: {
                    template: '<div class="die-d10 percentile"></div>',
                    animation: 'splitRoll'
                }
            }
        },
        modifiers: {
            container: {
                id: 'modifier-controls',
                required: true,
                updateMethod: 'updateModifier',
                animationHooks: ['onChange']
            },
            display: {
                format: '{sign}{value}',
                animation: 'pulse'
            }
        }
    },
    updateQueue: {
        priority: {
            high: ['results', 'total'],
            medium: ['dicePool', 'modifier'],
            low: ['animations', 'transitions']
        },
        batchProcessing: {
            maxBatchSize: 5,
            debounceTime: 16,
            flushTriggers: ['roll', 'reset']
        }
    }
}
```

##### b. Validation Rules
```javascript
// Pattern: Display validation rules
{
    displayRules: {
        initialization: {
            containerCheck: 'Verify all required containers',
            styleCheck: 'Verify style sheet loaded',
            templateCheck: 'Verify all templates available'
        },
        updates: {
            queueValidation: 'Check update queue integrity',
            stateSync: 'Verify display matches state',
            animationState: 'Check animation readiness'
        },
        transitions: {
            timing: 'Coordinate with animation system',
            interruption: 'Handle transition cancellation',
            cleanup: 'Remove completed transitions'
        }
    },
    contentRules: {
        results: {
            format: 'Consistent number formatting',
            alignment: 'Proper visual alignment',
            overflow: 'Handle large numbers'
        },
        dicePool: {
            layout: 'Grid-based arrangement',
            spacing: 'Consistent die spacing',
            visibility: 'All dice clearly visible'
        },
        modifiers: {
            signs: 'Always show + or -',
            zeros: 'Handle zero modifier',
            limits: 'Enforce modifier limits'
        }
    }
}
```

##### c. Migration Requirements
- All display updates must use new system
- Visual consistency must be maintained
- Animations must be synchronized
- State changes must be reflected immediately
- Error handling must be comprehensive
- Documentation must be updated

#### 3. Success Criteria
□ All display functions migrated
□ No references to old display.js
□ All updates working correctly
□ Animations synchronized
□ Error handling comprehensive
□ Documentation complete

## Phase 3: Cleanup
### A. Remove Old Code
□ Verify each file
□ Remove unused imports
□ Clean up comments
□ Update documentation

### B. Update index.js
□ Update main imports
□ Verify initialization
□ Test full system
□ Update documentation

## Phase 4: Verification
### A. Test Each Component
□ State management
□ Core functions
□ DOM elements
□ Event handlers
□ Display system
□ Special features

### B. Integration Testing
□ Test initialization order
□ Verify dependencies
□ Check error handling
□ Validate performance

## Phase 5: Documentation
### A. Update Documentation
□ Update README
□ Document initialization
□ Document dependencies
□ Document testing

### B. Final Review
□ Code review
□ Documentation review
□ Test coverage review
□ Performance review

## Phase 6: Setup Functions Documentation
Last Updated: March 27, 2025

### A. Progress Overview
#### 1. Component Status
□ index.js ✓
□ ui/button-handler.js ✓
□ ui/input-handler.js
□ ui/display.js
□ ui/help.js
□ ui/number-buttons.js
□ state.js
□ core-functions.js
□ debug.js
□ dice-logic.js
□ make-draggable.js
□ ui-updates.js

### B. Component Documentation
#### 1. index.js
##### Main Initialization
- Direct Imports:
  □ setupEventListeners (from './ui/button-handler')
  □ setupDiceInput, setupDiceButtons (from './ui-updates')
  □ makeDraggable (from './make-draggable')
  □ toggleApplet, centerApplet, minimizeApplet, resetApplet (from './core-functions')
  □ setupNumberButtons (from './number-buttons')
  □ initializeHelpSystem (from './help')
  □ initDisplayModule (from './ui/display')

- DOM Elements Required:
  □ #dice-roller-button
  □ #dice-applet

- Initialization Order Dependencies:
  □ setupUI() must run first [ERROR: Undefined]
  □ setupEventListeners() must run before user interaction
  □ setupDiceInput() and setupDiceButtons() must run before dice operations
  □ setupDebugMode() can run anytime
  □ setupNumberButtons() must run before number input
  □ initializeHelpSystem() must run before help can be shown
  □ Display initialization must run last

#### 2. ui/button-handler.js
##### Setup Functions
- setupEventListeners()
// ... existing content ...

#### 3. ui/input-handler.js
##### Setup Functions
- setupDiceInput()
// ... existing content ...

### C. Implementation Analysis
#### 1. Keyboard Handler Audit
// ... existing audit content ...

#### 2. DOM Error Handling
##### Current State
// ... existing state content ...

#### 3. Investigation Checkpoints
// ... existing checkpoints content ...

### D. Specifications
#### 1. Keyboard Behavior
##### Key Mappings
1. **ESC Key**
- **In Input Field**:
  * ONLY unfocus the input
  * Do NOT clear the input content
  * Stop event propagation
  * Prevent default behavior

- **Anywhere Else**:
  * Full applet reset which includes:
    - Minimize the applet
    * Reset to starting position
    * Clear dice pool
    * Reset modifier
    * Clear number display
  * Prevent default behavior

2. **Backspace Key**
- **In Input Field**:
  * Allow normal typing behavior
  * Let browser handle the event
  * No preventDefault or stopPropagation

- **Anywhere Else**:
  * Clear the dice pool
  * Reset modifier to 0
  * Prevent default behavior

3. **Enter Key**
- **In Input Field**:
  * Process dice notation
  * Animate roll if valid
  * Blur input after processing
  * Stop event propagation
  * Prevent default behavior

- **Anywhere Else**:
  * Reroll current dice pool
  * Animate the roll
  * Prevent default behavior

4. **Space Key**
- **In Input Field**:
  * Allow normal typing behavior
  * Let browser handle the event

- **Anywhere Else**:
  * Toggle applet visibility
  * Maintain current position (no recentering)
  * Prevent default behavior
  * Note: Consider removing for website deployment

5. **Number Keys (0-9)
- **In Input Field**:
  * Allow normal typing behavior
  * Let browser handle the event

- **Anywhere Else**:
  * NO keyboard handling
  * Numbers only input via UI buttons

6. **Modifier Keys**
- **Shift Key**:
  * Track state for d10 percentile mode
  * Don't prevent default behavior
  * Must work with text selection
  * Consider adding visual indicator when held

7. **Debug Shortcuts**
- **Command/Ctrl + D**:
  * Toggle all debug output
  * Affects console logging
  * Global (works anywhere)
  * Prevent default behavior

- **Command/Ctrl + B**:
  * Toggle debug borders
  * Affects visual display
  * Global (works anywhere)
  * Prevent default behavior

### Important Notes
1. Focus Management:
   - Input field is the ONLY focusable element
   - All other elements should have tabIndex="-1"
   - No keyboard navigation between elements

2. Event Handling:
   - Always check input focus before handling global keys
   - Use preventDefault() consistently outside input
   - Use stopPropagation() for input-specific handling

3. UI Button Interactions:
   - Number display backspace is UI button only
   - Not connected to keyboard backspace
   - Should be renamed to avoid confusion

□ Detailed Event Flow Analysis:
  * Document exact order of handler execution
  * Map event bubbling paths
  * Identify potential race conditions
  * Verify handler priority is correct
  * Test focus state impact on each handler

□ Complete preventDefault Analysis:
  * Document each handler's prevention behavior
  * Verify browser default actions
  * Test impact of prevention on other handlers
  * Ensure consistent prevention patterns
  * Check for unwanted side effects

#### 2. Error Handling Patterns
##### Implementation Guide
// ... existing implementation guide ...

### E. Project Status
#### 1. Issues Found
1. setupUI() is called but undefined
2. Inconsistent naming (setup vs initialize)
3. Potential circular dependencies between state and UI components
4. Missing error handling in some setup functions
5. Multiple keyboard handler setups (potential conflict between setupGlobalKeyboardHandlers and setupKeyboardHandlers)
6. No error handling for missing DOM elements in setupRollButton
7. Potential for silent failures in DOM element access
8. No standardized error handling pattern across setup functions

#### 2. Next Steps
1. Complete keyboard handler audit before proceeding with display.js
2. Document display.js setup functions with focus on:
   - Keyboard interaction conflicts
   - DOM error handling patterns
3. Update investigation checkpoints after each file analysis
4. Create complete dependency graph once all files are documented

#### 3. Success Criteria
□ All setup functions documented
□ All keyboard handlers mapped and conflicts resolved
□ Standard error handling implemented across all setup functions
□ Clear initialization order established
□ No silent failures in setup process
□ Complete dependency graph created

### 1. Mandatory Pre-Implementation Checklist
☒ Document all current setup functions
☒ Map current initialization order
☒ Identify all dependencies
□ Create backup of current state
□ Get explicit approval before coding

### 2. Implementation Protocol
□ ONE change at a time
□ Show the exact code being copied
□ Show where it's being moved to
□ List all imports being updated
□ Run tests before proceeding
□ Get approval for each step
