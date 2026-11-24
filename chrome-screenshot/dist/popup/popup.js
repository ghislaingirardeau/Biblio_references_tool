"use strict";
// Helper DOM typé
function $(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Élément HTML introuvable : ${id}`);
    }
    return element;
}
// Éléments principaux
const form = $('reference-form');
const submitBtn = $('submit-btn');
const errorMessage = $('error-message');
const successMessage = $('success-message');
let currentMetadata = null;
console.log('ts ready !');
// Affichage des messages
function showMessage(element, message) {
    errorMessage.classList.add('hidden');
    successMessage.classList.add('hidden');
    element.textContent = message;
    element.classList.remove('hidden');
}
// Récupération des métadonnées de la page
async function getPageMetadata() {
    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
    const [toolTab] = await chrome.tabs.query({
        url: [
            'http://localhost:9000/*',
            'http://localhost:9200/*',
            'https://biblio-references-tool.onrender.com/*',
        ],
    });
    console.log('render extension');
    if (toolTab) {
        $('connection-status').textContent = 'Connected';
    }
    else {
        $('connection-status').classList.toggle('status-disconnected');
        $('status-dot').classList.toggle('status-dot-disconnected');
        $('connection-status').textContent = 'Disconnected';
        // submitBtn.disabled = true;
    }
    if (tab && (!tab.id || !tab.url)) {
        throw new Error('Impossible de récupérer la page.');
    }
    if (tab && !/^https?:\/\//i.test(tab.url)) {
        throw new Error('Cette page ne permet pas la récupération des informations.');
    }
    const results = await chrome.scripting.executeScript({
        target: { tabId: tab?.id },
        func: () => {
            const meta = (...selectors) => {
                for (const selector of selectors) {
                    const value = document.querySelector(selector)?.content?.trim();
                    if (value)
                        return value;
                }
                return undefined;
            };
            const authors = Array.from(document.querySelectorAll('meta[name="citation_author"]'))
                .map((el) => el.content.trim())
                .filter(Boolean);
            const singleAuthor = meta('meta[name="author"]', 'meta[property="article:author"]');
            if (authors.length === 0 && singleAuthor) {
                authors.push(singleAuthor);
            }
            return {
                title: meta('meta[name="citation_title"]', 'meta[property="og:title"]') || document.title,
                url: location.href,
                authors,
                description: meta('meta[name="description"]', 'meta[property="og:description"]'),
                publishedDate: meta('meta[name="citation_publication_date"]', 'meta[property="article:published_time"]', 'meta[name="date"]'),
                siteName: meta('meta[property="og:site_name"]') || location.hostname,
                doi: meta('meta[name="citation_doi"]', 'meta[name="dc.identifier"]'),
            };
        },
    });
    const metadata = results[0]?.result;
    if (!metadata) {
        throw new Error('Aucune information récupérée.');
    }
    return metadata;
}
// Préremplissage du formulaire
function populateForm(data) {
    currentMetadata = data;
    $('page-title').textContent = data.title;
    $('page-domain').textContent = new URL(data.url).hostname;
    $('title').value = data.title;
    $('authors').value = data.authors.join(', ');
    $('url').value = data.url;
    $('description').value = data.description ?? '';
    $('siteName').value = data.siteName ?? '';
}
// Initialisation du popup
async function init() {
    try {
        const metadata = await getPageMetadata();
        populateForm(metadata);
    }
    catch (error) {
        $('page-title').textContent = 'Page inaccessible';
        showMessage(errorMessage, error instanceof Error ? error.message : 'Erreur de récupération.');
    }
}
// Soumission du formulaire
form.addEventListener('submit', (event) => {
    event.preventDefault();
    void handleSubmit();
});
async function handleSubmit() {
    if (!currentMetadata) {
        showMessage(errorMessage, 'Aucune page récupérée.');
        return;
    }
    if (!currentMetadata) {
        showMessage(errorMessage, 'Aucune page récupérée.');
        return;
    }
    const url = $('url').value.trim();
    try {
        if (!['http:', 'https:'].includes(new URL(url).protocol)) {
            throw new Error('URL invalide.');
        }
    }
    catch {
        showMessage(errorMessage, 'Veuillez saisir une URL valide.');
        return;
    }
    const payload = {
        type: 'web',
        title: $('title').value.trim(),
        URL: $('url').value.trim(),
        authors: $('authors')
            .value.split(',')
            .map((author) => author.trim())
            .filter(Boolean),
        description: $('description').value.trim(),
        name: $('siteName').value.trim(),
        accessDate: Date.now(),
    };
    if (!payload.title) {
        showMessage(errorMessage, 'Le titre est obligatoire.');
        return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Importation...';
    console.log('Importation...');
    try {
        const response = await chrome.runtime.sendMessage({
            type: 'IMPORT_WEB_REFERENCE',
            payload,
        });
        console.log(response);
        if (!response?.success) {
            throw new Error(response?.error || "Erreur lors de l'importation.");
        }
        showMessage(successMessage, 'Référence ajoutée avec succès !');
        submitBtn.textContent = 'Référence ajoutée ✓';
    }
    catch (error) {
        showMessage(errorMessage, error instanceof Error ? error.message : "Erreur lors de l'importation.");
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ajouter à mes références';
    }
}
// Fermeture du popup
$('cancel-btn').addEventListener('click', () => {
    window.close();
});
// Démarrage
void init();
