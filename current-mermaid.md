# Dice Roller Applet Architecture

```mermaid
graph TD
    %% ========== ENTRY POINT ==========
    App[index.js<br/>App Entry Point] --> |Initializes| State
    App --> |Sets up| UI

    %% ========== STATE MANAGEMENT ==========
    subgraph State Management
        State[state.js<br/>Central State Store] --> |Provides| StateGetters[Getter Functions<br/>getSelectedDice<br/>getCurrentRolls<br/>getModifier<br/>hasPercentileDie]
        State --> |Provides| StateSetters[Setter Functions<br/>addDie<br/>setRollResults<br/>setModifier<br/>clearDice]
        StateOps[State Operations<br/>clearResults<br/>resetState]
    end

    %% ========== CORE LOGIC ==========
    subgraph Core Logic
        CoreFunctions[core-functions.js<br/>Application Business Logic]
        
        DiceLogic[dice-logic.js<br/>Dice Rolling Algorithms] --> |Provides| RollDie[rollDie<br/>Base dice function]
        DiceLogic --> |Provides| RollPercentile[rollPercentile<br/>Percentile dice logic]
        DiceLogic --> |Provides| ComputeTotal[computeTotal<br/>Results calculation]
        DiceLogic --> |Provides| ParseNotation[parseDiceNotation<br/>Input parsing]
        
        CoreFunctions --> |Uses| DiceLogic
        CoreFunctions --> |Manages| State
        
        CoreFunctions --> |Provides| RollSpecificDie[rollSpecificDie<br/>Standard dice]
        CoreFunctions --> |Provides| RollPercentileDie[rollPercentileDie<br/>d00 handling]
        CoreFunctions --> |Provides| ActivatePercentileMode[activatePercentileMode<br/>Percentile UI transition]
        CoreFunctions --> |Provides| RerollAllDice[rerollAllDice<br/>Refresh current pool]
        CoreFunctions --> |Provides| ClearDicePool[clearDicePool<br/>Reset selection]
        CoreFunctions --> |Provides| ModifierFunctions[adjustModifier<br/>setModifierValue]
        CoreFunctions --> |Provides| AppletControl[toggleApplet<br/>minimizeApplet<br/>resetApplet]
        CoreFunctions --> |Controls| AnimationCoordination[animateDiceRoll<br/>Animation coordinator]
    end

    %% ========== USER INTERFACE ==========
    subgraph User Interface
        UI[UI Components] --> |Display| Display
        UI --> |Input| InputHandling
        UI --> |Controls| ButtonHandling
        
        Display[ui/display.js<br/>DOM Updates] --> |Provides| UpdateDisplay[updateDisplay<br/>Update UI with state]
        Display --> |Provides| UpdateResults[updateResults<br/>Show roll results]
        
        InputHandling[ui/input-handler.js<br/>User Input] --> |Manages| KeyboardEvents[Global Keyboard<br/>Enter, Space, ESC, etc.]
        InputHandling --> |Processes| TextInput[Text notation input]
        InputHandling --> |Controls| InputField[Editable input field]
        
        ButtonHandling[ui/button-handler.js<br/>Button Events] --> |Manages| DiceButtons[Die buttons<br/>d4, d6, d8, etc.]
        ButtonHandling --> |Manages| ControlButtons[Control buttons<br/>Roll, Clear, +/-, etc.]
        ButtonHandling --> |Handles| InteractionTypes[Click types<br/>Single, Double, Long press]
        ButtonHandling --> |Detects| PercentileInteractions[Percentile triggers<br/>Double-click, Shift-click]
    end

    %% ========== ANIMATIONS ==========
    subgraph Animations
        DiceAnimations[animations/dice-animations.js<br/>Visual Effects] --> |Provides| AnimateDiceIcons[animateDiceIcons<br/>Die spinning]
        DiceAnimations --> |Provides| AnimateResults[animateResults<br/>Result transitions]
        DiceAnimations --> |Manages| PercentileAnimations[animatePercentileRoll<br/>d10 color transformation]
        DiceAnimations --> |Controls| AnimationPhysics[Physics-based animations<br/>decelerate() function]
        DiceAnimations --> |Handles| VisibilityChanges[handleVisibilityChange<br/>Minimize/Maximize]
        DiceAnimations --> |Maintains| AnimationState[Animation state<br/>preserveAnimationState<br/>restoreAnimationState]
    end

    %% ========== HELP SYSTEM ==========
    subgraph Help System
        Help[help.js<br/>Help Popup] --> |Provides| HelpContent[Help text<br/>Instructions]
        Help --> |Manages| HelpVisibility[Show/Hide Help<br/>Popup management]
    end

    %% ========== NUMBER BUTTONS ==========
    subgraph Number Input
        NumberButtons[number-buttons.js<br/>Number Selection] --> |Provides| NumberSelection[0-9 buttons<br/>Quantity selection]
        NumberButtons --> |Manages| NumberState[Number state<br/>getCurrentNumberValue()]
        NumberButtons --> |Interacts with| DiceButtons
    end

    %% ========== CONNECTIONS BETWEEN COMPONENTS ==========
    CoreFunctions --> |Updates| Display
    ButtonHandling --> |Triggers| CoreFunctions
    InputHandling --> |Triggers| CoreFunctions
    CoreFunctions --> |Triggers| DiceAnimations
    DiceAnimations --> |Updates| Display
    ButtonHandling --> |Updates| NumberButtons
    KeyboardEvents --> |Controls| AppletControl
    Help --> |Interacts with| UI
    NumberButtons --> |Affects| CoreFunctions

    %% ========== EVENT FLOW ==========
    subgraph Event Flow
        UserInput[User Input<br/>Click, Key Press, etc.] --> EventHandlers[Event Handlers<br/>onClick, onKeyDown]
        EventHandlers --> CoreActions[Core Actions<br/>Roll, Clear, etc.]
        CoreActions --> StateChanges[State Changes]
        StateChanges --> AnimationTriggers[Animation Triggers]
        AnimationTriggers --> DOMUpdates[DOM Updates]
        DOMUpdates --> RenderComplete[Render Complete]
    end

    %% ========== MINIMIZE/MAXIMIZE FLOW (HIGHLIGHTED) ==========
    subgraph Minimize/Maximize Flow
        SpaceKey[Space Key Press] --> |Triggers| ToggleApplet[toggleApplet()]
        ToggleApplet --> |Sets Flag<br>_isRestoringState = true<br>1000ms timeout| AnimationFlag1[Animation Prevention Flag]
        ToggleApplet --> |Updates| DisplayProperty[container.style.display = 'flex']
        DisplayProperty --> |Triggers| FocusEvent[window focus event]
        FocusEvent --> |Calls| RestoreState[restoreAnimationState()]
        RestoreState --> |Sets Flag<br>_isRestoringState = true<br>500ms timeout| AnimationFlag2[Animation Prevention Flag]
        RestoreState --> |If hasPercentileState()| ApplyPercentileState[applyPercentileFinalState()]
        ApplyPercentileState --> |DOM Updates| DOMChange[DOM State Change]
        
        %% The race condition - this is the root cause
        AnimationFlag2 --> |Timeout fires first<br>after 500ms| FlagCleared[_isRestoringState = false]
        FlagCleared --> |Animation<br>no longer blocked| AnimationWindow[Window where animations can run]
        DOMChange --> |May trigger| AnimationCall[animateDiceRoll() called]
        AnimationCall --> AnimationWindow
        AnimationWindow --> |If roll triggered| UnwantedAnimation[Unwanted Animation<br>During Maximize]
        
        style UnwantedAnimation fill:red,stroke:red,stroke-width:2px
        style AnimationWindow fill:orange,stroke:orange,stroke-width:2px
        style FlagCleared fill:orange,stroke:orange,stroke-width:2px
    end

    %% ========== PERCENTILE DICE FLOW (HIGHLIGHTED) ==========
    subgraph Percentile Dice Flow
        D10DoubleClick[d10 Double-Click] --> |Triggers| TriggerPercentile[triggerPercentileRoll()]
        TriggerPercentile --> |Calls| ActivatePercentile[activatePercentileMode()]
        ActivatePercentile --> |Updates| StatePercentile[hasPercentileDie = true]
        ActivatePercentile --> |Triggers| VisualTransform[d10 visual transform]
        TriggerPercentile --> |Calls| RollDice[rollAllDice()]
        RollDice --> |Generates| PercentileResults[Percentile results]
        PercentileResults --> |Passed to| AnimatePercentileDice[animateDiceRoll()]
        StatePercentile --> |Affects| MinimizeFlow[Minimize/Maximize behavior]
        style MinimizeFlow fill:orange,stroke:orange,stroke-width:2px
    end

    %% Style nodes for better visualization
    classDef coreNode fill:#f9d77e,stroke:#333,stroke-width:1px;
    classDef stateNode fill:#a8d0db,stroke:#333,stroke-width:1px;
    classDef uiNode fill:#aed581,stroke:#333,stroke-width:1px;
    classDef animNode fill:#ffcc80,stroke:#333,stroke-width:1px;
    classDef helpNode fill:#ce93d8,stroke:#333,stroke-width:1px;
    classDef numberNode fill:#90caf9,stroke:#333,stroke-width:1px;
    classDef flowNode fill:#e6ee9c,stroke:#333,stroke-width:1px;

    class CoreFunctions,DiceLogic,RollDie,RollPercentile,ComputeTotal,ParseNotation,RollSpecificDie,RollPercentileDie,ActivatePercentileMode,RerollAllDice,ClearDicePool,ModifierFunctions,AppletControl,AnimationCoordination coreNode;
    class State,StateGetters,StateSetters,StateOps stateNode;
    class UI,Display,InputHandling,ButtonHandling,UpdateDisplay,UpdateResults,KeyboardEvents,TextInput,InputField,DiceButtons,ControlButtons,InteractionTypes,PercentileInteractions uiNode;
    class DiceAnimations,AnimateDiceIcons,AnimateResults,PercentileAnimations,AnimationPhysics,VisibilityChanges,AnimationState animNode;
    class Help,HelpContent,HelpVisibility helpNode;
    class NumberButtons,NumberSelection,NumberState numberNode;
    class UserInput,EventHandlers,CoreActions,StateChanges,AnimationTriggers,DOMUpdates,RenderComplete flowNode;
```

## Component Descriptions

### Core Modules

1. **index.js** - Main entry point that initializes the application
2. **state.js** - Central state management with getters/setters
3. **core-functions.js** - Business logic and API for the application
4. **dice-logic.js** - Dice rolling algorithms and calculations

### UI Components

1. **ui/display.js** - DOM update functions for visual state
2. **ui/input-handler.js** - User input processing and keyboard events
3. **ui/button-handler.js** - Click handling and button interactions

### Special Features

1. **animations/dice-animations.js** - Visual animations and transitions
2. **number-buttons.js** - Numeric input interface
3. **help.js** - Help system and instructions

### Key Workflows

1. **Dice Rolling** - From button click to animation to result display
2. **Percentile Dice** - Special d10-based percentile dice system
3. **Minimize/Maximize** - App visibility toggling with state preservation

## Known Issues

The chart highlights the animation retriggering issue during maximize operations (marked in red). The root cause is a race condition between multiple timeout functions that control the animation blocking flag (`_isRestoringState`).

## Potential Solutions

1. **Timeout Synchronization**
   - Increase `restoreAnimationState()`'s timeout to be longer than `toggleApplet()`'s
   - Pros: Simple change, minimal code impact
   - Cons: Only masks the issue, doesn't address the root cause

2. **Shared Flag Management**
   - Implement a shared mechanism for managing the `_isRestoringState` flag
   - Use a counter or reference counting approach instead of boolean
   - Pros: More robust solution, prevents race conditions
   - Cons: Requires refactoring multiple functions

3. **Targeted Event Prevention**
   - Identify and block the specific event that's triggering `animateDiceRoll()`
   - Add explicit checks in suspected event handlers during maximize
   - Pros: Direct solution to the problem, minimal changes needed
   - Cons: May be difficult to identify the exact trigger

4. **Animation Guard System**
   - Implement a more comprehensive animation guard system
   - Add timestamps or operation IDs to track restoration context
   - Pros: Most robust long-term solution
   - Cons: Most complex to implement

The most promising approach is #3 (Targeted Event Prevention), as it directly addresses the root cause without overengineering the solution. The added debugging code should help identify the specific event triggering the animation. 