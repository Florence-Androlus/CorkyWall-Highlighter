<?php
/*
 * Plugin Name:       CorkyWall & Highlighter
 * Plugin URI:        http://wordpress.org/plugins/plugins-cap 
 * Description:       CorkyWall & Highlighter est un plugin WordPress Gutenberg qui intègre trois outils décoratifs à votre mise en page : épinglez des images comme sur un tableau en liège, scotchez-les avec un effet ruban adhésif réaliste, et mettez en évidence votre texte avec de sublimes dégradés de couleurs, sans écrire une seule ligne de code.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.2
 * Author:            Florence Androlus
 * Author URI:        https://fan-develop.fr/
 * Contributors:	  fandevelop,khahina
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       corkywall-highlighter
 * Domain Path:       /languages
 */
 
 if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Définition de la version globale du plugin
if ( ! defined( 'CORKYWALL_HIGHLIGHTER_VERSION' ) ) {
    define( 'CORKYWALL_HIGHLIGHTER_VERSION', '1.0.0' );
}

 // Include cap-functions.php, use require_once to stop the script if cap-functions.php is not found
require_once plugin_dir_path(__FILE__) . 'includes/plugin.php';


