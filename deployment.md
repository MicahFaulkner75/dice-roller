# Dice Roller Deployment Guide

## Implementation Strategy
We will initially deploy the dice roller in its current development state, preserving all files and dependencies exactly as they are. This approach:
- Maintains the working state of the application
- Preserves all solved dependency relationships
- Keeps debugging capability intact
- Allows easiest updates and maintenance
- Minimizes risk of integration issues

If performance issues arise from multiple file loading, we can later optimize by bundling into a production version. But we'll start with what we know works perfectly.

## Deployment Environment
- **Platform**: WordPress website
- **Host**: Bluehost
- **Theme**: Astra
- **Editor**: Gutenberg (WordPress default block editor)
- **Block Plugins**: Spectra (formerly Ultimate Addons for Gutenberg), Wonderblocks
- **Launch Method**: HTML launcher widget embedded in website footer
- **Target Devices**: Both desktop and mobile browsers
- **Browser Requirements**: Modern browsers (Chrome, Firefox, Safari, Edge)

## Phase 1: Source File Preparation

### 1. Directory Structure Verification
- [x] Verified the `src/` directory structure:
  - **Root Files**:
    - core-functions.js
    - dice-logic.js
    - help.js
    - index.html
    - index.js
    - make-draggable.js
    - number-buttons.js
    - state.js
    - styles.css
    - ui-updates.js
  - **Subdirectories**:
    - animations/
      - dice-animations.js
    - ui/
      - button-handler.js
      - display.js
      - input-handler.js
- [x] Ensure all files are necessary for deployment
- [x] Remove any unused or development-only files

### 2. Directory Structure
Upload the entire src/ directory structure as-is:
```
src/
  index.js                 # Application entry point
  core-functions.js        # Core business logic
  dice-logic.js           # Dice rolling algorithms
  state.js                # State management
  help.js                 # Help system
  number-buttons.js       # Number selection interface
  animations/
    dice-animations.js    # Animation system
  ui/
    button-handler.js     # Button interactions
    input-handler.js      # Input processing
    display.js           # Display management
  styles.css             # All styling
```

### 3. Debug Cleanup
- [ ] Review and clean debug statements:
  - `src/core-functions.js` (20+ console.log statements)
  - `src/animations/dice-animations.js` (15+ console.log statements)
  - `src/ui/input-handler.js` (KEYBOARD DEBUG statements)
- [ ] Keep error logging that helps with troubleshooting
- [x] **COMPLETED**: Removed spacebar toggle TODO comment

### 4. Path Updates
- [ ] Update all import statements to use web paths
- [ ] Verify all file references use correct paths
- [ ] Test all import chains work on web server

# Deployment Options to Consider

Option 1A. **WordPress Block Plugin** ✅ (PRIMARY PREFERRED OPTION)
   - Create a proper Gutenberg block instead of a traditional plugin
   - Register custom block type with WordPress
   - Self-contained with all assets
   - No dependency on module imports
   - Integrates well with existing Gutenberg, Spectra, and Wonderblocks setup

Option 1B: WordPress Plugin (Clean Approach) ⭐⭐ (SECONDARY ALTERNATIVE)
Create a proper WordPress plugin that registers a widget or shortcode
Properly enqueue scripts and styles using WordPress hooks
Keep code separate from the theme

Option 2: **Simple HTML Embed (NO MODULES, IFRAME EMBED)** ⭐ (POSSIBLE ALTERNATIVE)
Create a single self-contained HTML file with all JS and CSS embedded
Placed in a specific location on your server
Embedded via iframe into any WordPress page

Option 3. **Static Asset + iframe (NO MODULES, IFRAME EMBED)** ⭐ (POSSIBLE ALTERNATIVE)
   - Deploy all files as static assets to a non-WordPress directory on your own hosting
   - Use an iframe to avoid WordPress interference
   - Manage resources in an isolated environment on your existing Bluehost server

# Unorthodox Deployment Approaches

Option A. **Web Component Custom Element** 🧪
   - Convert the dice roller into a Web Component using Custom Elements API
   - Self-contained with Shadow DOM to prevent CSS conflicts
   - Single JS file that registers custom `<dice-roller>` HTML element
   - Can be embedded anywhere in WordPress content without interference

Option B. **Service Worker + Local Storage** 🧪
   - Create a minimal loader embedded in WordPress
   - Use Service Worker to handle all application logic offline
   - Store application state in IndexedDB/LocalStorage
   - Avoids WordPress interference by running in different thread

Option C. **SVG Container with Embedded Script** 🧪
   - Package the entire application within an SVG file
   - SVG format allows embedding HTML, CSS, and JavaScript
   - Self-contained namespace avoids WordPress interference
   - Can be added as a simple image with full interactivity
   *SECURITY CONCERNS*

Option D. **Data URI Approach** 🧪
   - Bundle entire application as a base64-encoded data URI
   - Embed via a single iframe with src="data:text/html;base64,..."
   - No file dependencies or server requests needed
   - Completely isolated from WordPress environment

#######
## WordPress ES6 Module Issues

During previous deployment attempts, we encountered several specific issues related to ES6 modules in WordPress:

1. **File Extension Stripping**
   - WordPress sometimes removes or modifies file extensions from script sources
   - For example: `import { state } from './state.js'` might become `import { state } from './state'`
   - This breaks module resolution as browsers require exact file extensions for ES6 modules

2. **Script Tag Modification**
   - WordPress can strip the required `type="module"` attribute from script tags
   - This causes ES6 module syntax to be interpreted as regular JavaScript, breaking with syntax errors
   - Can happen when saving content through the editor or when updating themes/plugins

3. **Path Resolution Issues**
   - Relative paths in import statements may resolve incorrectly in WordPress environment
   - WordPress sometimes modifies paths or encodes special characters in URLs
   - This causes module imports to fail with 404 errors

4. **CORS Violations**
   - ES6 modules enforce strict CORS requirements
   - WordPress serving technique may not include correct CORS headers
   - Results in security errors blocking module execution

These issues are why approaches that avoid ES6 modules entirely (either through bundling or iframes) tend to be more reliable for WordPress integration, despite the development version using a clean modular architecture.

# WordPress Block Plugin Implementation Guide

## Overview

This guide outlines the process of creating a WordPress Block Plugin for the dice roller application. The block approach integrates natively with the Gutenberg editor and avoids many of the ES6 module issues that caused problems in previous deployment attempts.

## Phase 1: Plugin Structure Setup

### 1. Create Plugin Directory

Create a directory in your WordPress installation:
```
wp-content/plugins/dice-roller-block/
```

### 2. Create Main Plugin File

Create `dice-roller-block.php` in the plugin root:

```php
<?php
/**
 * Plugin Name: Dice Roller Block
 * Description: Interactive dice roller for tabletop gaming
 * Version: 1.0.0
 * Author: Your Name
 * Text Domain: dice-roller-block
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('DICE_ROLLER_VERSION', '1.0.0');
define('DICE_ROLLER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DICE_ROLLER_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include block registration
require_once DICE_ROLLER_PLUGIN_DIR . 'includes/block-registration.php';

// Check for potential plugin conflicts
function dice_roller_check_compatibility() {
    if (is_admin() && current_user_can('activate_plugins')) {
        // Check for known plugin conflicts with Spectra and Wonderblocks
        if (defined('SPECTRA_FILE') || defined('WONDERBLOCKS_VERSION')) {
            add_action('admin_notices', function() {
                echo '<div class="notice notice-warning is-dismissible">
                    <p>Dice Roller Block detected Spectra or Wonderblocks. Please test for any styling or functionality conflicts.</p>
                </div>';
            });
        }
    }
}
add_action('admin_init', 'dice_roller_check_compatibility');

// Register block assets
function dice_roller_register_assets() {
    // Register styles
    wp_register_style(
        'dice-roller-editor-style',
        DICE_ROLLER_PLUGIN_URL . 'build/editor.css',
        array(),
        DICE_ROLLER_VERSION
    );
    
    wp_register_style(
        'dice-roller-style',
        DICE_ROLLER_PLUGIN_URL . 'build/style.css',
        array(),
        DICE_ROLLER_VERSION
    );
    
    // Register Font Awesome if needed
    wp_register_style(
        'dice-roller-fontawesome',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        array(),
        '6.4.0'
    );
}
add_action('init', 'dice_roller_register_assets');

// Add Astra theme compatibility
function dice_roller_add_astra_compatibility() {
    if (defined('ASTRA_THEME_VERSION')) {
        wp_add_inline_style('dice-roller-style', '
            /* Astra-specific overrides */
            .ast-footer-widget #dice-roller-mount {
                position: relative;
                z-index: 1000;
            }
            .ast-mobile-header-wrap #dice-roller-mount {
                transform: scale(0.8);
                transform-origin: bottom right;
            }
            
            /* Ensure proper positioning in Astra footer widgets */
            .ast-footer-widget #dice-roller-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
            }
            
            /* Adjust for Astra admin bar */
            .admin-bar #dice-roller-container {
                top: 32px;
            }
            
            @media (max-width: 782px) {
                .admin-bar #dice-roller-container {
                    top: 46px;
                }
            }
        ');
    }
}
add_action('wp_enqueue_scripts', 'dice_roller_add_astra_compatibility', 20);
```

### 3. Create Directory Structure

Set up the following directory structure:

```
dice-roller-block/
├── dice-roller-block.php
├── block.json                  # Block registration in JSON format
├── includes/
│   └── block-registration.php
├── src/
│   ├── block/
│   │   ├── edit.js
│   │   ├── editor.scss
│   │   ├── index.js
│   │   └── style.scss
│   └── dice-roller/
│       └── [copy all dice roller files here]
├── build/
│   ├── block.js
│   ├── style.css
│   ├── dice-roller.js
│   ├── dice-roller.asset.php   # Generated dependency information
│   └── editor.css
└── package.json
```

### 4. Create block.json

Create a `block.json` in the plugin root using the modern WordPress block API:

```json
{
  "apiVersion": 2,
  "name": "dice-roller-block/dice-roller",
  "title": "Dice Roller",
  "category": "widgets",
  "icon": "games",
  "description": "Interactive dice roller for tabletop gaming",
  "keywords": ["dice", "roller", "game", "rpg", "d20"],
  "version": "1.0.0",
  "textdomain": "dice-roller-block",
  "attributes": {
    "position": {
      "type": "string",
      "default": "bottom-right"
    },
    "initiallyOpen": {
      "type": "boolean",
      "default": false
    },
    "mobileScale": {
      "type": "number",
      "default": 1.0
    }
  },
  "supports": {
    "html": false,
    "align": ["wide", "full"]
  },
  "editorScript": "file:./build/block.js",
  "editorStyle": "file:./build/editor.css",
  "style": "file:./build/style.css"
}
```

## Phase 2: Block Registration

### 1. Create Block Registration File

Create `includes/block-registration.php`:

```php
<?php
/**
 * Register the Dice Roller Block
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the block for Gutenberg editor using block.json
 */
function dice_roller_register_block() {
    // Register the block using the block.json file
    register_block_type_from_metadata( 
        DICE_ROLLER_PLUGIN_DIR,
        array(
            'render_callback' => 'dice_roller_block_render',
        )
    );
}
add_action('init', 'dice_roller_register_block');

/**
 * Enqueue block assets for editor
 */
function dice_roller_enqueue_block_editor_assets() {
    // Enqueue required styles for the editor
    wp_enqueue_style('dice-roller-fontawesome');
}
add_action('enqueue_block_editor_assets', 'dice_roller_enqueue_block_editor_assets');

/**
 * Render the block on frontend
 */
function dice_roller_block_render($attributes, $content, $block) {
    // Get block attributes with defaults
    $position = isset($attributes['position']) ? $attributes['position'] : 'bottom-right';
    $initially_open = isset($attributes['initiallyOpen']) ? $attributes['initiallyOpen'] : false;
    $mobile_scale = isset($attributes['mobileScale']) ? $attributes['mobileScale'] : 1.0;
    
    // Enqueue frontend styles
    wp_enqueue_style('dice-roller-style');
    wp_enqueue_style('dice-roller-fontawesome');
    
    // Enqueue frontend script with browser caching headers
    $dice_roller_asset_file = DICE_ROLLER_PLUGIN_DIR . 'build/dice-roller.asset.php';
    $dice_roller_asset = file_exists($dice_roller_asset_file) 
        ? include $dice_roller_asset_file
        : ['dependencies' => [], 'version' => DICE_ROLLER_VERSION];
        
    wp_enqueue_script(
        'dice-roller-script',
        DICE_ROLLER_PLUGIN_URL . 'build/dice-roller.js',
        $dice_roller_asset['dependencies'],
        $dice_roller_asset['version'],
        true
    );
    
    // Pass attributes to script
    wp_localize_script('dice-roller-script', 'diceRollerSettings', array_merge(
        $attributes,
        [
            'pluginUrl' => DICE_ROLLER_PLUGIN_URL,
            'isMobile' => wp_is_mobile(),
            'themeType' => 'astra', // Helps the script know it's in Astra theme
        ]
    ));
    
    // Add custom error handling for development vs production
    if (defined('WP_DEBUG') && WP_DEBUG) {
        wp_add_inline_script('dice-roller-script', 'window.diceRollerDebug = true;');
    }
    
    // Return container markup with appropriate attributes
    $position_class = esc_attr($position);
    $initially_open_attr = $initially_open ? 'data-initially-open="true"' : '';
    $mobile_scale_attr = 'data-mobile-scale="' . esc_attr($mobile_scale) . '"';
    
    return '<div id="dice-roller-mount" class="dice-roller-' . $position_class . '" ' . $initially_open_attr . ' ' . $mobile_scale_attr . '></div>';
}

/**
 * Add frontend error handling
 */
function dice_roller_error_handling() {
    if (!is_admin()) {
        echo '<script>
        window.addEventListener("error", function(e) {
            if (e.filename && e.filename.includes("dice-roller")) {
                console.error("Dice Roller Error:", e.message, "at", e.filename, ":", e.lineno);
                // Only log errors in production, not display them to users
                if (!window.diceRollerDebug) {
                    const diceRoller = document.getElementById("dice-roller-mount");
                    if (diceRoller) {
                        // Hide the dice roller if there's an error in production
                        diceRoller.style.display = "none";
                    }
                }
            }
        });
        </script>';
    }
}
add_action('wp_footer', 'dice_roller_error_handling', 999);
```

## Phase 3: Block Editor Integration

### 1. Create package.json

Create `package.json` in the plugin root:

```json
{
  "name": "dice-roller-block",
  "version": "1.0.0",
  "description": "Dice Roller Block for WordPress",
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "format": "wp-scripts format",
    "lint:js": "wp-scripts lint-js",
    "lint:css": "wp-scripts lint-style",
    "packages-update": "wp-scripts packages-update"
  },
  "devDependencies": {
    "@wordpress/scripts": "^24.0.0",
    "css-minimizer-webpack-plugin": "^4.2.2",
    "terser-webpack-plugin": "^5.3.6"
  }
}
```

### 2. Create Block Editor Files

Create `src/block/index.js`:

```javascript
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import './editor.scss';

// Register the block using metadata from block.json
registerBlockType('dice-roller-block/dice-roller', {
    edit: Edit,
    // Dynamic block, render handled by PHP
    save: () => null,
});
```

Create `src/block/edit.js`:

```javascript
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { 
    PanelBody, 
    SelectControl, 
    ToggleControl,
    RangeControl
} from '@wordpress/components';

const Edit = ({ attributes, setAttributes }) => {
    const { position, initiallyOpen, mobileScale } = attributes;
    
    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Dice Roller Settings', 'dice-roller-block')}>
                    <SelectControl
                        label={__('Position', 'dice-roller-block')}
                        value={position}
                        options={[
                            { label: 'Bottom Right', value: 'bottom-right' },
                            { label: 'Bottom Left', value: 'bottom-left' },
                            { label: 'Top Right', value: 'top-right' },
                            { label: 'Top Left', value: 'top-left' },
                            { label: 'Center', value: 'center' },
                        ]}
                        onChange={(newPosition) => setAttributes({ position: newPosition })}
                    />
                    <ToggleControl
                        label={__('Initially Open', 'dice-roller-block')}
                        checked={initiallyOpen}
                        onChange={(newState) => setAttributes({ initiallyOpen: newState })}
                    />
                    <RangeControl
                        label={__('Mobile Scale', 'dice-roller-block')}
                        value={mobileScale}
                        onChange={(value) => setAttributes({ mobileScale: value })}
                        min={0.5}
                        max={1.5}
                        step={0.1}
                    />
                </PanelBody>
            </InspectorControls>
            <div className="dice-roller-block-editor">
                <div className="dice-roller-preview">
                    <img 
                        src={`${diceRollerSettings.pluginUrl}assets/dice-roller-preview.png`} 
                        alt="Dice Roller Preview" 
                    />
                    <div className="dice-roller-preview-info">
                        <p>{__('Dice Roller will appear here on the frontend', 'dice-roller-block')}</p>
                        <p>{__(`Position: ${position}`, 'dice-roller-block')}</p>
                        <p>{initiallyOpen 
                            ? __('Initially open: Yes', 'dice-roller-block') 
                            : __('Initially open: No', 'dice-roller-block')}
                        </p>
                        <p>{__(`Mobile scale: ${mobileScale}x`, 'dice-roller-block')}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;
```

Create `src/block/editor.scss`:

```scss
.dice-roller-block-editor {
    background: #f0f0f0;
    border: 1px dashed #ccc;
    padding: 20px;
    text-align: center;
    
    .dice-roller-preview {
        max-width: 300px;
        margin: 0 auto;
        
        img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        &-info {
            margin-top: 15px;
            padding: 10px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            
            p {
                margin: 5px 0;
                font-size: 13px;
            }
        }
    }
}

// Add Astra-specific editor styles
.editor-styles-wrapper {
    .block-editor-block-list__block {
        .dice-roller-block-editor {
            margin-bottom: 20px;
        }
    }
}
```

Create `src/block/style.scss`:

```scss
/* Frontend styles for the dice roller */
#dice-roller-mount {
    position: relative;
    
    /* Position classes */
    &.dice-roller-bottom-right {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
    }
    
    &.dice-roller-bottom-left {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 10000;
    }
    
    &.dice-roller-top-right {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
    }
    
    &.dice-roller-top-left {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 10000;
    }
    
    &.dice-roller-center {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
    }
}

/* Mobile optimizations */
@media (max-width: 768px) {
    #dice-roller-container {
        max-width: 90vw;
        max-height: 80vh;
        overflow: auto;
    }
    
    /* Ensure buttons are touch-friendly */
    #dice-applet .die-button,
    #dice-applet .number-button,
    #dice-applet button {
        min-width: 44px;
        min-height: 44px;
        padding: 8px;
    }
    
    /* Improved scrolling */
    .results-area {
        -webkit-overflow-scrolling: touch;
    }
}

/* Astra-specific overrides handled via PHP */
```

## Phase 4: Dice Roller Code Integration

### 1. Bundle Dice Roller Code

The key step is to convert the modular ES6 code into a single bundle that doesn't rely on imports/exports:

1. Copy all dice roller files to `src/dice-roller/` directory
2. Create a webpack configuration to bundle these files:

Create `webpack.config.js` in the plugin root:

```javascript
const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    ...defaultConfig,
    entry: {
        'block': './src/block/index.js',
        'dice-roller': './src/dice-roller/bundler.js',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
    },
    optimization: {
        ...defaultConfig.optimization,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: process.env.NODE_ENV === 'production',
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
};
```

Create `src/dice-roller/bundler.js` to import and initialize all dice roller components:

```javascript
// This file bundles all dice roller components
import './index';

// Initialize the dice roller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Get mount point
    const mountPoint = document.getElementById('dice-roller-mount');
    if (!mountPoint) return;
    
    // Get settings from WordPress
    const settings = window.diceRollerSettings || {};
    
    // Initialize dice roller with error handling
    try {
        initializeDiceRoller(mountPoint, settings);
    } catch (error) {
        console.error('Failed to initialize dice roller:', error);
        // Provide fallback behavior or error message
        if (mountPoint) {
            mountPoint.innerHTML = `
                <div style="padding: 10px; background: #f8d7da; color: #721c24; border-radius: 4px;">
                    Failed to load dice roller. Please refresh the page or contact support.
                </div>
            `;
        }
    }
});

// Copy the dice roller mount HTML structure
function initializeDiceRoller(mountPoint, settings) {
    // Apply mobile scaling if needed
    if (settings.isMobile && settings.mobileScale) {
        mountPoint.style.transform = `scale(${settings.mobileScale})`;
        mountPoint.style.transformOrigin = settings.position || 'bottom right';
    }
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'dice-roller-button-container';
    
    // Create button
    const button = document.createElement('img');
    button.id = 'dice-roller-button';
    button.src = `${settings.pluginUrl}assets/d20-icon.png`;
    button.alt = 'Launch Dice Roller';
    
    // Make button accessible
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('aria-label', 'Open Dice Roller');
    
    buttonContainer.appendChild(button);
    
    // Create dice roller container (initially hidden)
    const container = document.createElement('div');
    container.id = 'dice-roller-container';
    container.style.display = 'none';
    
    // Populate with dice roller HTML structure
    container.innerHTML = `
        <div id="dice-applet" class="draggable">
            <!-- Full dice roller HTML structure here -->
        </div>
    `;
    
    // Add to mount point
    mountPoint.appendChild(buttonContainer);
    mountPoint.appendChild(container);
    
    // Add event listeners
    button.addEventListener('click', toggleDiceRoller);
    
    // Make button keyboard accessible
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDiceRoller();
        }
    });
    
    // Initialize in open state if settings indicate
    if (settings.initiallyOpen) {
        toggleDiceRoller();
    }
}

function toggleDiceRoller() {
    // Implementation of toggle function
}
```

### 2. Update File References

In the bundler, modify all image references to use WordPress plugin URLs:

```javascript
// Change all asset references from:
const imgSrc = "https://annotatedtoa.com/wp-content/uploads/2025/03/d20.svg";

// To:
const imgSrc = `${diceRollerSettings.pluginUrl}assets/d20.svg`;
```

### 3. Create Assets Directory

Create an `assets` directory in the plugin root to store all required images:

```
dice-roller-block/
├── assets/
│   ├── d20-icon.png
│   ├── d4.svg
│   ├── d6.svg
│   ├── d8.svg
│   ├── d10.svg
│   ├── d12.svg
│   ├── d20.svg
│   ├── dice-roller-preview.png
│   └── ... (other images)
```

## Phase 5: Build & Deploy

### 1. Install Dependencies

```bash
cd wp-content/plugins/dice-roller-block
npm install
```

### 2. Build the Plugin

For development:
```bash
npm run start
```

For production:
```bash
NODE_ENV=production npm run build
```

### 3. Deploy to WordPress

1. Ensure all files are in the correct plugin directory
2. Activate the plugin in WordPress admin
3. Add the dice roller block to a page using the Gutenberg editor
4. Test with Astra theme in various positions

## Phase 6: Performance Optimization

### 1. Configure Caching for Bluehost

Create `.htaccess` in the plugin directory:

```
# Enable browser caching for static assets
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  
  # CSS, JavaScript
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>
```

### 2. Implement Code Splitting

For larger features, implement code splitting to load components only when needed:

```javascript
// In bundler.js
// Lazy load help system when help button is clicked
document.querySelector('#help-button').addEventListener('click', () => {
  import('./help.js').then(module => {
    module.showHelpPopup();
  });
});
```

### 3. Implement Critical CSS

Separate critical styles (needed for initial render) from non-critical:

```php
function dice_roller_add_critical_css() {
    echo '<style>
        /* Critical CSS for immediate rendering */
        #dice-roller-mount {
            position: relative;
        }
        #dice-roller-button-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1100;
        }
        #dice-roller-button {
            width: 50px;
            height: 50px;
            cursor: pointer;
        }
    </style>';
}
add_action('wp_head', 'dice_roller_add_critical_css');
```

## Troubleshooting

### Common Issues

1. **Block Not Appearing in Editor**
   - Check browser console for errors
   - Verify block registration code is correct
   - Make sure all dependencies in package.json are installed

2. **Styles Not Loading**
   - Check that style.css is being properly enqueued
   - Verify CSS files are being generated in the build directory

3. **JavaScript Errors**
   - Look for syntax errors in the console
   - Verify bundling worked correctly
   - Check paths to assets are correct

4. **Asset Loading Issues**
   - Ensure all images and assets are in the correct location
   - Verify URLs are being correctly generated with `DICE_ROLLER_PLUGIN_URL`

5. **Astra Theme Compatibility**
   - Check for conflicts with Astra's z-index values
   - Test in various Astra widget areas
   - Verify mobile responsiveness with Astra's breakpoints

6. **Block Editor Integration**
   - Test compatibility with Spectra and Wonderblocks
   - Verify the block renders correctly in both the editor and frontend

### Advanced Features

1. **Custom Color Schemes**
   - Add color options to block attributes
   - Implement theme-specific color schemes

2. **Accessibility Improvements**
   - Ensure keyboard navigation works properly
   - Implement ARIA attributes for screen readers
   - Test with screen readers and keyboard-only navigation

### Functionality Preservation Checklist

1. **Dice Rolling Methods**
   - Standard click to roll individual dice ✓
   - Multi-dice pools with proper visual feedback ✓
   - Modifier handling and display ✓
   - Clear button functionality ✓
   - Roll button for re-rolling existing dice ✓

2. **Percentile Dice Functionality**
   - Long-press activation of d10 percentile mode ✓
   - Double-click activation of d10 percentile mode ✓
   - Shift-click activation of d10 percentile mode ✓
   - Correct d00+d10 calculation (00+0=100) ✓
   - Proper percentile visual feedback ✓

3. **Keyboard Controls**
   - Enter key to roll dice; rolls all in dice pool ✓
   - Backspace to clear applet ✓
   - Spacebar to minimize/maximize ✓
   - Escape to close OR to blur focus in text input mode ✓
   - NO tab navigation between interactive elements necessary (no focus on buttons allowed) ✓

4. **Animation System**
   - Dice rolling animations with proper timing ✓
   - Result number animations ✓
   - Deceleration physics in animations ✓
   - Percentile dice special animations ✓
   - Animation state restoration on page focus ✓

5. **GM Features**
   - Critical success/failure modes ✓
   - High/low roll fudging ✓
   - Fudge mode single-use behavior ✓
   - Hidden trigger areas working correctly ✓

6. **Textual Input & Number Buttons**
   - Text input field accepting dice notation (e.g., "2d6+3") ✓
   - Number button selection for dice quantity (0-9) ✓
   - Proper parsing of typed dice notation ✓
   - Clearing number input after dice roll ✓
   - Handling of complex notation with multiple die types ✓

7. **Modifier System**
   - Adding/subtracting modifiers with "+/-" buttons ✓
   - Displaying current modifier value ✓
   - Applying modifiers to roll results ✓
   - Proper display of modifier in dice notation ✓
   - Clearing modifiers with the clear button ✓

8. **Special Event Handlers** 
   - Shift-click on d10 for percentile mode ✓
   - Long-press detection working on mobile/touch devices ✓
   - Double-click detection with proper timing ✓
   - Click handling that accommodates all three special interactions ✓
   - Touch event prevention of unwanted double-actions ✓

Before deploying to production, manually verify each item on this checklist to ensure no functionality has been lost during the transfer to WordPress.

### Implementation Strategy: Prioritized Task Order

1. **Setup Basic Block Structure & Environment** (2 hours)
   - Create plugin directory structure and base files
   - Set up WordPress block registration without dice roller functionality
   - Create image path utility and verify asset loading works
   - Test that empty block loads correctly in editor and frontend

2. **Implement State Management Layer** (3 hours)
   - Port state.js as an independent module first
   - Create simple test functions to verify state operations
   - Verify state persistence works correctly
   - Test thoroughly before adding any dependent code

3. **Add Core Dice Logic** (3 hours)
   - Implement dice-logic.js with state dependencies
   - Create test harness for dice rolling algorithms
   - Verify percentile dice calculation works properly (00+0=100)
   - Test all edge cases before proceeding

4. **Implement Core Functions Layer** (3 hours)
   - Add core-functions.js that connects state and logic
   - Test each API function independently
   - Verify event flow for standard and percentile rolls
   - Create UI-less test page to verify functionality

5. **Add UI Components & Display** (4 hours)
   - Implement basic UI structure
   - Add dice buttons and layout
   - Add number buttons and modifier controls
   - Add results display components
   - Test each component in isolation

6. **Implement Event Handlers** (3 hours)
   - Add button-handler.js with all three percentile triggers
   - Implement input-handler.js for keyboard/text input
   - Test each event type individually
   - Verify shift-click and other special interactions

7. **Integrate Animation System** (2 hours)
   - Port animation code last (most complex)
   - Test each animation type separately
   - Verify physics-based deceleration works
   - Ensure animations don't interfere with functionality

8. **Block Editor Integration & Final Testing** (2 hours)
   - Complete block controls for customization
   - Test block in various content layouts
   - Verify against Functionality Preservation Checklist
   - Test on multiple browsers and devices

Total estimated time: 22 hours

### Critical Positioning Fix

**Issue:** Previous implementations constrained the dice roller applet within a viewport window, preventing free movement across the page.

**Solution:** Restructured the positioning system to:
- Make mount point static and unconstrained
- Create a full-viewport container with `pointer-events: none`
- Position applet relative to viewport using `position: fixed`
- Remove all overflow constraints and container boundaries
- Override theme-specific positioning constraints

This ensures the applet can be dragged anywhere on screen while remaining fully visible and interactive.

### Pre-Deployment Verification Checklist

Before moving to production, verify these critical items to avoid common deployment issues:

1. **File Path Verification**
   - [ ] Build the plugin with `npm run build`
   - [ ] Check the actual filenames in the `build/` directory
   - [ ] Verify PHP registration in `dice-roller-block.php` matches actual filenames
   - [ ] Confirm CSS files are correctly referenced (`style-dice-roller.css` not `style.css`)

2. **Asset Path Testing**
   - [ ] Load the plugin in WordPress
   - [ ] Open browser console and look for 404 errors
   - [ ] Verify all images load correctly
   - [ ] Check that SVG paths use the `getDiceRollerImagePath()` utility

3. **Environment Transition Issues**
   - [ ] Verify WordPress hooks are firing in the correct order
   - [ ] Test with Gutenberg editor enabled and disabled
   - [ ] Check mobile vs. desktop behavior
   - [ ] Test with caching plugins active

---

## Building for Production