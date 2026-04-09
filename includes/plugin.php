<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

error_log('LE FICHIER PLUGIN.PHP EST BIEN CHARGE');

// Styles et styles de blocs
add_action( 'init', 'fand_corkywall_register_block_styles' );
function fand_corkywall_register_block_styles() {
    register_block_style( 'core/image', ['name' => 'polaroid', 'label' => __( 'Polaroid', 'corkywall-highlighter' )] );
    register_block_style( 'core/image', ['name' => 'polaroid-tilt-left', 'label' => __( 'Polaroid: Tilt Left', 'corkywall-highlighter' )] );
    register_block_style( 'core/image', ['name' => 'scotch-tape', 'label' => __( 'Scotch Tape', 'corkywall-highlighter' )] );
    register_block_style( 'core/image', ['name' => 'polaroid-tilt-right', 'label' => __( 'Polaroid: Tilt Right', 'corkywall-highlighter' )] );
    register_block_style( 'core/image', ['name' => 'img-tape--1', 'label' => __( 'Scotch Top Bottom', 'corkywall-highlighter' )] );
    register_block_style( 'core/image', ['name' => 'img-tape--2', 'label' => __( 'Scotch Top Corners', 'corkywall-highlighter' )] );
    register_block_style( 'core/image', ['name' => 'img-tape--3', 'label' => __( 'Scotch Corners top left - bottom right', 'corkywall-highlighter' )] );
    register_block_style( 'core/image', ['name' => 'img-tape--4', 'label' => __( 'Scotch Middle left right', 'corkywall-highlighter' )] );
    register_block_style( 'core/image', ['name' => 'pins-vert', 'label' => __( 'Pins Green', 'corkywall-highlighter' )] );
    register_block_style( 'core/image', ['name' => 'pins-bleu', 'label' => __( 'Pins Blue', 'corkywall-highlighter' )] );
    register_block_style( 'core/image', ['name' => 'pins-orange', 'label' => __( 'Pins Orange', 'corkywall-highlighter' )] );
}

/**
 * 1. Chargement des CSS
 */
function fand_corkywall_add_stylesheet() {
    error_log('Enqueueing styles for CorkyWall & Highlighter');
    wp_enqueue_style( 'corkywall-style', plugins_url('corkywall-style.css', __FILE__), array(), CORKYWALL_HIGHLIGHTER_VERSION );
    wp_enqueue_style( 'highlighter--tabs-style', plugins_url('../assets/css/highlighter-stylestab.css', __FILE__), array(), CORKYWALL_HIGHLIGHTER_VERSION );
}
add_action( 'enqueue_block_assets', 'fand_corkywall_add_stylesheet', 5 );
add_action( 'wp_enqueue_scripts', 'fand_corkywall_add_stylesheet' );

/**
 * 2. Chargement des JS pour l'EDITEUR (Gutenberg)
 */
function fand_highlighter_enqueue_editor_assets() {
    
    wp_enqueue_script(
        'awp-gutenberg-filters', 
        plugins_url('../assets/js/highlighter-tab.js', __FILE__), 
        array('wp-edit-post', 'wp-blocks', 'wp-dom-ready', 'wp-data', 'wp-element'), 
        filemtime(plugin_dir_path(__FILE__) . '../assets/js/highlighter-tab.js'),  // FIX : time() force le rechargement à chaque page
        true
    );

    wp_enqueue_script(
        'highlighter-toolbar',
        plugins_url('../assets/js/highlighter-script.js', __FILE__), 
        array(
            'wp-edit-post',
            'wp-blocks',
            'wp-element',
            'wp-hooks',
            'wp-block-editor',        // FIX : nécessaire pour BlockControls
            'wp-components',          // FIX : nécessaire pour ToolbarGroup/ToolbarButton
            'awp-gutenberg-filters',  // FIX : garantit que custom-tab.js est chargé avant
        ),
        filemtime(plugin_dir_path(__FILE__) . '../assets/js/highlighter-script.js'),
        true
    );

    $settings = array(
        'nonce'   => wp_create_nonce('wp_rest'),
        'ajaxurl' => admin_url('admin-ajax.php'),
    );
    
    wp_localize_script('awp-gutenberg-filters', 'wpApiSettings', $settings);
    wp_localize_script('highlighter-toolbar',  'wpApiSettings', $settings);
}
add_action('enqueue_block_editor_assets', 'fand_highlighter_enqueue_editor_assets');