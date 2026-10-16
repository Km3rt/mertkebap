const categoryNav = document.getElementById('categoryNav');
const menuContent = document.getElementById('menuContent');
const categoryIconMarkup = new Map(
    [...categoryNav.querySelectorAll('.category-tab')].map((button) => [
        button.id.replace(/^tab-/, ''),
        button.querySelector('.icon-box')?.innerHTML.trim() ?? ''
    ])
);

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
})[character]);

const toId = (value) => String(value).toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '');

function renderItem(item, layout) {
    const name = escapeHtml(item.name);
    const price = escapeHtml(item.price ?? '');

    if (layout === 'price-list') {
        return `<div class="menu-item flex items-baseline justify-between"><span class="font-bold text-stone-900">${name}</span><span class="dotted-leader"></span><span class="font-bold text-stone-900">${price}</span></div>`;
    }

    const germanName = item.germanName
        ? `<p class="text-sm font-medium text-stone-600">${escapeHtml(item.germanName)}</p>`
        : '';
    const content = Array.isArray(item.content) && item.content.length
        ? `<p class="text-xs text-stone-400">${item.content.map((entry) => `• ${escapeHtml(entry)}`).join('<br>')}</p>`
        : '';

    return `<div class="menu-item"><div class="flex items-baseline justify-between"><span class="font-bold text-stone-900">${name}</span><span class="dotted-leader"></span><span class="font-bold text-stone-900">${price}</span></div>${germanName}${content}</div>`;
}

function renderSection(section) {
    const heading = section.name
        ? `<h3 class="text-center font-semibold text-red-600 mb-6 text-lg">${escapeHtml(section.name)}</h3>`
        : '';
    const itemSpacing = section.layout === 'price-list' ? 'space-y-5' : 'space-y-6';
    const items = (section.items ?? []).map((item) => renderItem(item, section.layout)).join('');

    return `<div>${heading}<div class="${itemSpacing}">${items}</div></div>`;
}

function renderCategory(category, index) {
    const id = toId(category.id || category.name);
    const sections = Array.isArray(category.sections) ? category.sections : [];
    const contentLayout = sections.length > 1
        ? 'grid md:grid-cols-2 gap-x-12 gap-y-8'
        : category.subtitle
            ? 'max-w-2xl mx-auto space-y-6'
            : 'max-w-3xl mx-auto space-y-5';
    const iconMarkup = categoryIconMarkup.get(category.icon || id)
        || '<svg class="h-12 w-12" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22" fill="#d7f1ff" stroke="#111" stroke-width="3"/><circle cx="32" cy="32" r="14" fill="#fff" stroke="#111" stroke-width="2.5"/></svg>';
    const sectionMarkup = sections.map(renderSection).join('');
    const subtitle = category.subtitle
        ? `<p class="text-center text-sm text-stone-500 mb-8">${escapeHtml(category.subtitle)}</p>`
        : '';

    return {
        id,
        button: `<button type="button" id="tab-${id}" class="category-tab ${index === 0 ? 'active' : ''} flex flex-col items-center min-w-[70px]" data-category-id="${id}" aria-controls="cat-${id}" aria-pressed="${index === 0}"><div class="icon-box mb-2">${iconMarkup}</div><span class="text-sm font-semibold">${escapeHtml(category.name)}</span></button>`,
        content: `<section class="menu-category ${index === 0 ? '' : 'hidden'}" id="cat-${id}" aria-labelledby="tab-${id}"><div class="flex items-center justify-center my-8"><div class="h-[1.5px] bg-red-700 flex-grow max-w-[150px]"></div><div class="flex items-center gap-2 px-4 text-red-700 text-2xl font-bold"><span>${escapeHtml(category.name)}</span></div><div class="h-[1.5px] bg-red-700 flex-grow max-w-[150px]"></div></div>${subtitle}<div class="${contentLayout}">${sectionMarkup}</div></section>`
    };
}

function activateCategory(categoryId) {
    categoryNav.querySelectorAll('.category-tab').forEach((button) => {
        const isActive = button.dataset.categoryId === categoryId;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    menuContent.querySelectorAll('.menu-category').forEach((category) => {
        category.classList.toggle('hidden', category.id !== `cat-${categoryId}`);
    });
}

categoryNav.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-category-id]');
    if (button) activateCategory(button.dataset.categoryId);
});

async function loadMenu() {
    menuContent.innerHTML = '<p class="py-8 text-center text-sm text-stone-500">Speisekarte wird geladen …</p>';

    try {
        const response = await fetch('speisekarte.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data.categories) || data.categories.length === 0) {
            throw new Error('Keine Kategorien in speisekarte.json gefunden.');
        }

        const rendered = data.categories.map(renderCategory);
        categoryNav.innerHTML = rendered.map((category) => category.button).join('');
        menuContent.innerHTML = rendered.map((category) => category.content).join('');
    } catch (error) {
        console.error('Die Speisekarte konnte nicht geladen werden:', error);
        categoryNav.replaceChildren();
        menuContent.innerHTML = '<p class="py-8 text-center text-sm text-stone-600">Die Speisekarte konnte nicht geladen werden. Öffne die Website über einen lokalen Webserver oder die gehostete Website.</p>';
    }
}

loadMenu();
