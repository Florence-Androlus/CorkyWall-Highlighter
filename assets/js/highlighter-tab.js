function getEditorDoc() {
    var iframe = document.querySelector('iframe[name="editor-canvas"]');
    if (iframe) return iframe.contentDocument || iframe.contentWindow.document;
    return document;
}

function getSelectedText() {
    var iframeDoc = getEditorDoc();
    var sel = iframeDoc.defaultView.getSelection();
    return sel ? sel.toString() : '';
}

function findMarkElement(range) {
    var start = range.startContainer;
    if (start.nodeType === 3) {
        return start.parentNode.nodeName === 'MARK' ? start.parentNode : null;
    }
    var next = start.childNodes[range.startOffset];
    return next && next.nodeName === 'MARK' ? next : null;
}

function updateBlockContent(clientId, selectedText, color) {
    var iframeDoc = getEditorDoc();
    var blockElement = iframeDoc.querySelector('[data-block="' + clientId + '"]');
    if (!blockElement) return;

    var sel = iframeDoc.defaultView.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    var range = sel.getRangeAt(0);

    // Nettoie d'abord toutes les marks vides parasites
    blockElement.querySelectorAll('mark').forEach(function(m) {
        if (m.textContent.trim() === '') {
            var parent = m.parentNode;
            parent.removeChild(m);
            parent.normalize();
        }
    });

    // Cherche une mark existante qui contient le texte sélectionné
    var markElement = null;
    blockElement.querySelectorAll('mark').forEach(function(m) {
        if (m.textContent === selectedText || sel.containsNode(m, true)) {
            markElement = m;
        }
    });

    // Fallback : vérifie via le range
    if (!markElement) {
        markElement = findMarkElement(range);
    }

    if (markElement) {
        if (color === 'supmark') {
            // Supprime la mark et restaure le texte
            var textNode = iframeDoc.createTextNode(markElement.textContent);
            markElement.parentNode.replaceChild(textNode, markElement);
            blockElement.normalize();
        } else if (markElement.style.background === color) {
            // Même couleur → supprime
            var textNode = iframeDoc.createTextNode(markElement.textContent);
            markElement.parentNode.replaceChild(textNode, markElement);
            blockElement.normalize();
        } else {
            // Couleur différente → change juste la couleur, ne recrée pas
            markElement.style.background = color;
        }
    } else if (color !== 'supmark') {
        // Pas de mark existante → on entoure la sélection
        // On extrait le contenu SANS le supprimer d'abord
        var fragment = range.extractContents();
        var mark = iframeDoc.createElement('mark');
        mark.style.background = color;
        // Récupère juste le texte du fragment (évite les nodes imbriqués)
        mark.textContent = fragment.textContent;
        range.insertNode(mark);
        // Remet la sélection sur la mark
        sel.removeAllRanges();
        var newRange = iframeDoc.createRange();
        newRange.selectNodeContents(mark);
        sel.addRange(newRange);
    }

    // Nettoie une dernière fois les marks vides
    blockElement.querySelectorAll('mark').forEach(function(m) {
        if (m.textContent === '') {
            m.parentNode.removeChild(m);
        }
    });
    blockElement.normalize();

    wp.data.dispatch('core/block-editor').updateBlockAttributes(clientId, {
        content: blockElement.innerHTML,
    });
}

function SelectedblocAndColor(color) {
    var selectedBlock = wp.data.select('core/block-editor').getSelectedBlock();
    if (!selectedBlock) return;

    // Fonctionne aussi sur les titres (heading)
    if (selectedBlock.name === 'core/paragraph' || selectedBlock.name === 'core/heading') {
        var selectedText = getSelectedText();
        if (selectedText) {
            updateBlockContent(selectedBlock.clientId, selectedText, color);
        }
    }
}

// --- 2. LOGIQUE D'INJECTION DE L'INTERFACE (ONGLET FLUO) ---

function addCustomTab() {
    const tabList = document.querySelector('.components-popover__content [role="tablist"]');
    if (!tabList || document.getElementById('tab-fluo-custom')) return;

    const refBtn = tabList.querySelector('button');

    // Création du bouton de l'onglet
    const TabButton = document.createElement('button');
    TabButton.type = 'button';
    TabButton.role = 'tab';
    TabButton.id = 'tab-fluo-custom';
    TabButton.className = refBtn ? refBtn.className : 'components-button';
    TabButton.innerHTML = `<span class="${refBtn?.querySelector('span')?.className || ''}">Fluo</span>`;

    // Création du panel
    const TabContent = document.createElement('div');
    TabContent.id = 'tab-fluo-view';
    TabContent.role = 'tabpanel';
    TabContent.className = document.querySelector('[role="tabpanel"]')?.className || '';
    TabContent.style.display = 'none';
    const pickerContainer = document.createElement('div');
    pickerContainer.style.cssText = 'position: relative; contain: layout;';
    pickerContainer.style.padding = '10px';
    TabContent.appendChild(pickerContainer);

    tabList.appendChild(TabButton);
    tabList.parentNode.appendChild(TabContent);

    let mounted = false;

    TabButton.addEventListener('click', () => {
        const allButtons = tabList.querySelectorAll('button');
        const allPanels = Array.from(tabList.parentNode.querySelectorAll('[role="tabpanel"]'));

        allButtons.forEach(b => b.setAttribute('aria-selected', 'false'));
        allPanels.forEach(p => p.style.display = 'none');

        TabButton.setAttribute('aria-selected', 'true');
        TabContent.style.display = 'block';

        // Masque l'indicateur natif et simule le soulignement sur Fluo
        tabList.style.setProperty('--selected-width', '0');
        tabList.style.setProperty('--selected-height', '0');

        TabButton.style.borderBottom = '2px solid var(--wp-admin-theme-color, #3858e9)';
        TabButton.style.borderRadius = '0';

        // Retire le soulignement des autres onglets natifs
        allButtons.forEach(b => {
            if (b !== TabButton) b.style.borderBottom = '';
        });

        if (!mounted) {
            mounted = true;

            const { createElement, useState } = wp.element;
            const { render } = wp.element;
            const { __experimentalColorGradientControl: ColorGradientControl } = wp.blockEditor;
            const settings = wp.data.select('core/block-editor').getSettings();

            const GradientComponent = () => {
                const [gradient, setGradient] = wp.element.useState();
                const { createElement: el } = wp.element;
                const { __experimentalColorGradientControl: ColorGradientControl } = wp.blockEditor;
                const { Popover } = wp.components;
                const settings = wp.data.select('core/block-editor').getSettings();

                return el(
                    // SlotFillProvider donne un contexte aux Popover enfants
                    wp.components.SlotFillProvider,
                    null,
                    el(ColorGradientControl, {
                        label: 'Fluo',
                        gradientValue: gradient,
                        gradients: settings.gradients,
                        colorValue: undefined,
                        colors: [],
                        onGradientChange: function(value) {
                            setGradient(value);
                            SelectedblocAndColor(value);
                        },
                        clearable: true,
                        onClear: function() {
                            setGradient(undefined);
                            SelectedblocAndColor('supmark');
                        },
                        // Force les popovers enfants à rester dans le conteneur
                        __unstablePopoverSlot: 'block-toolbar',
                    }),
                    // Slot qui capture les popovers et les affiche dans le bon contexte
                    el(Popover.Slot, null)
                );
            };

            render(createElement(GradientComponent), pickerContainer);
        }
    });

    // Masquer l'onglet si un autre est cliqué
    tabList.querySelectorAll('button').forEach(btn => {
        if (btn !== TabButton) {
            btn.addEventListener('click', () => {
                TabContent.style.display = 'none';
                TabButton.setAttribute('aria-selected', 'false');
                TabButton.style.borderBottom = '';
            });
        }
    });
}

// --- 3. ÉCOUTEURS D'ÉVÉNEMENTS (DÉCLENCHEMENT) ---

function prepareMiseEnEvidenceListener() {
    let attempts = 0;
    const interval = setInterval(() => {
        const btns = document.querySelectorAll('.components-popover__content button');
        const target = Array.from(btns).find(b => b.innerText.includes('Mettre en évidence') || b.innerText.includes('Highlight'));
        
        if (target) {
            clearInterval(interval);
            target.addEventListener('click', () => {
                setTimeout(addCustomTab, 100);
            }, { once: true });
        }
        if (attempts++ > 30) clearInterval(interval);
    }, 100);
}

document.addEventListener('click', (e) => {
    if (e.target.closest('button[aria-label="Plus"]') || e.target.closest('button[aria-label="More"]')) {
        prepareMiseEnEvidenceListener();
    }
});