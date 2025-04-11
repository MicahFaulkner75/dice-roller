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
        DICE_ROLLER_PLUGIN_URL . 'build/style-dice-roller.css',
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

    // IMPORTANT: The following assets are available in the plugin:
    // - Dice SVGs: assets/images/d4.svg, d6.svg, d8.svg, d10.svg, d12.svg, d20.svg
    // - Percentile dice: assets/images/d10red.svg, d10blue.svg
    // - Control buttons: assets/images/ban.svg (clear), reroll.svg, up.svg, down.svg
    // - Plugin icon: assets/d20-icon.png
    // 
    // When referencing these in JS, use: DICE_ROLLER_PLUGIN_URL + 'assets/images/...'
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