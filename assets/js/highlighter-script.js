// js/highlight-script.js
(function ($) {
    wp.hooks.addFilter(
        'editor.BlockEdit',
        'plugins-cap/highlight-toolbar',
        addHighlightToolbar
    );

    function addHighlightToolbar(BlockEdit) {
        return function (props) {
            return (
                <div>
                    <BlockEdit {...props} />
                    <MyHighlightToolbar {...props} />
                </div>
            );
        };
    }

    function MyHighlightToolbar(props) {
        const { isSelected } = props;

        if (!isSelected) {
            return null;
        }

        return (
            <div className="editor-block-toolbar">
                <button
                    className="components-button components-icon-button"
                    onClick={() => {
                        // Ajoutez votre logique de mise en évidence ici
                        alert('Fonctionnalité de mise en évidence à implémenter !');
                    }}
                >
                    Mon Onglet
                </button>
            </div>
        );
    }
})(jQuery);
