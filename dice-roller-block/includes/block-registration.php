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