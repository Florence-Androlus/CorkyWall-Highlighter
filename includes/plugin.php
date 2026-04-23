<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Styles et styles de blocs
add_action( 'init', 'fandcorkywallhighlighter_register_block_styles' );
function fandcorkywallhighlighter_register_block_styles() {
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
function fandcorkywallhighlighter_add_stylesheet() {
    wp_enqueue_style( 'corkywall-style', plugins_url('corkywall-style.css', __FILE__), array(), CORKYWALL_HIGHLIGHTER_VERSION );
    wp_enqueue_style( 'highlighter--tabs-style', plugins_url('../assets/css/highlighter-stylestab.css', __FILE__), array(), CORKYWALL_HIGHLIGHTER_VERSION );
}
add_action( 'enqueue_block_assets', 'fandcorkywallhighlighter_add_stylesheet', 5 );
add_action( 'wp_enqueue_scripts', 'fandcorkywallhighlighter_add_stylesheet' );

/**
 * 2. Chargement des JS pour l'EDITEUR (Gutenberg)
 */
function fandcorkywallhighlighter_enqueue_editor_assets() {
    
    wp_enqueue_script(
        'awp-gutenberg-filters', 
        plugins_url('../assets/js/highlighter-tab.js', __FILE__), 
        array('wp-edit-post', 'wp-blocks', 'wp-dom-ready', 'wp-data', 'wp-element'), 
        filemtime(plugin_dir_path(__FILE__) . '../assets/js/highlighter-tab.js'),  // FIX : time() force le rechargement à chaque page
        true
    );

}
add_action('enqueue_block_editor_assets', 'fandcorkywallhighlighter_enqueue_editor_assets');