// Parts data structure
const partsData = {
    cosmetic: [
        { name: 'Lakier - kolor 1', price: 200 },
        { name: 'Lakier - kolor 2', price: 50 },
        { name: 'Lakier - kolor 3', price: 50 },
        { name: 'Lakier - kolor 4', price: 50 },
        { name: 'Lakier - kolor 5', price: 50 },
        { name: 'Szyby', stages: [{ name: 'stage 1', price: 200 }, { name: 'stage 2', price: 250 }, { name: 'stage 3', price: 300 }] },
        { name: 'Livery', price: 500 },
        { name: 'Immo', price: 0, note: '??' },
        { name: 'Alarm', price: 0, note: '??' },
        { name: 'Hydraulika', price: 0, note: '??' }
    ],
    bodyParts: [
        { name: 'Spoiler', price: 400, percentages: { low: 0, mid: 4, high: 2 } },
        { name: 'Przód zderzak', price: 400, percentages: { low: 0, mid: 4, high: 2 } },
        { name: 'Tył zderzak', price: 400, percentages: { low: 0, mid: 4, high: 2 } },
        { name: 'Klatka', price: 400, percentages: { low: 0, mid: 4, high: 2 } },
        { name: 'Maska', price: 400, percentages: { low: 0, mid: 4, high: 2 } },
        { name: 'Dach', price: 400, percentages: { low: 0, mid: 4, high: 2 } },
        { name: 'Progi', price: 200, percentages: { low: 0, mid: 4, high: 2 } },
        { name: 'Błotnik lewy', price: 200, percentages: { low: 0, mid: 4, high: 2 } },
        { name: 'Błotnik prawy', price: 200, percentages: { low: 0, mid: 4, high: 2 } },
        { name: 'Wydech', price: 150, percentages: { low: 0, mid: 4, high: 2 } },
        { name: 'Grill', price: 150, percentages: { low: 0, mid: 4, high: 2 } },
        { name: 'Xenon', price: 150, percentages: { low: 0, mid: 4, high: 2 } }
    ],
    wheels: [
        { name: 'Felgi - Lowrider', price: 400 },
        { name: 'Felgi - Street', price: 600 }
    ],
    performance: [{
            name: 'Silnik',
            stages: [
                { name: 'stage 1', base: 1000, percentages: { low: 0, mid: 10, high: 5 } },
                { name: 'stage 2', base: 1500, percentages: { low: 0, mid: 14, high: 6 } },
                { name: 'stage 3', base: 2000, percentages: { low: 0, mid: 17, high: 8 } },
                { name: 'stage 4', base: 3000, percentages: { low: 0, mid: 20, high: 10 } }
            ]
        },
        {
            name: 'Hamulce',
            stages: [
                { name: 'stage 1', base: 500, percentages: { low: 0, mid: 6, high: 2 } },
                { name: 'stage 2', base: 700, percentages: { low: 0, mid: 10, high: 3 } },
                { name: 'stage 3', base: 900, percentages: { low: 0, mid: 13, high: 5 } }
            ]
        },
        {
            name: 'Skrzynia',
            stages: [
                { name: 'stage 1', base: 1000, percentages: { low: 0, mid: 10, high: 5 } },
                { name: 'stage 2', base: 1500, percentages: { low: 0, mid: 14, high: 6 } },
                { name: 'stage 3', base: 2000, percentages: { low: 0, mid: 17, high: 8 } }
            ]
        },
        {
            name: 'Zawieszenie',
            stages: [
                { name: 'stage 1', base: 500, percentages: { low: 0, mid: 6, high: 2 } },
                { name: 'stage 2', base: 700, percentages: { low: 0, mid: 10, high: 3 } },
                { name: 'stage 3', base: 900, percentages: { low: 0, mid: 13, high: 5 } },
                { name: 'stage 4', base: 1100, percentages: { low: 0, mid: 15, high: 6 } }
            ]
        },
        {
            name: 'Turbo',
            stages: [
                { name: 'stage 1', base: 1000, percentages: { low: 0, mid: 20, high: 10 } }
            ]
        }
    ]
};

const partsContainer = document.getElementById('partsContainer');
const carPriceRange = document.getElementById('carPriceRange');
const totalEl = document.getElementById('total');
const robociznaInput = document.getElementById('robocizna');

let selectedParts = new Map();

function init() {
    renderParts();
    carPriceRange.addEventListener('change', updateTotals);
    robociznaInput.addEventListener('input', updateTotals);
}

function renderParts() {
    partsContainer.innerHTML = '';

    // Cosmetic parts
    renderCategory('Części kosmetyczne', partsData.cosmetic);

    // Body parts
    renderCategory('Części nadwozia', partsData.bodyParts);

    // Wheels
    renderCategory('Felgi', partsData.wheels);

    // Performance parts
    renderCategory('Części wydajnościowe', partsData.performance);
}

function renderCategory(categoryName, parts) {
    const header = document.createElement('div');
    header.className = 'category-header';
    header.textContent = categoryName;
    partsContainer.appendChild(header);

    parts.forEach(part => {
        if (part.stages) {
            renderPartWithStages(part);
        } else {
            renderSimplePart(part);
        }
    });
}

function renderSimplePart(part) {
    const div = document.createElement('div');
    div.className = 'part-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `part-${part.name}`;
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            const price = calculatePartPrice(part);
            selectedParts.set(part.name, { part, price, stage: null });
        } else {
            selectedParts.delete(part.name);
        }
        updateTotals();
    });

    const label = document.createElement('label');
    label.className = 'part-name';
    label.htmlFor = checkbox.id;
    label.textContent = part.name + (part.note ? ` (${part.note})` : '');

    const priceSpan = document.createElement('span');
    priceSpan.className = 'part-price';
    priceSpan.textContent = `$${formatPrice(calculatePartPrice(part))}`;
    priceSpan.id = `price-${part.name}`;

    div.appendChild(checkbox);
    div.appendChild(label);
    div.appendChild(priceSpan);
    partsContainer.appendChild(div);
}

function renderPartWithStages(part) {
    const div = document.createElement('div');
    div.className = 'part-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `part-${part.name}`;

    const label = document.createElement('label');
    label.className = 'part-name';
    label.htmlFor = checkbox.id;
    label.textContent = part.name;

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'part-options';

    const stageLabel = document.createElement('label');
    stageLabel.textContent = 'Poziom:';

    const stageSelect = document.createElement('select');
    stageSelect.id = `stage-${part.name}`;
    stageSelect.disabled = true;

    part.stages.forEach((stage, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = stage.name;
        stageSelect.appendChild(option);
    });

    optionsDiv.appendChild(stageLabel);
    optionsDiv.appendChild(stageSelect);

    const priceSpan = document.createElement('span');
    priceSpan.className = 'part-price';
    priceSpan.id = `price-${part.name}`;
    priceSpan.textContent = `$${formatPrice(calculateStagePrice(part.stages[0]))}`;

    checkbox.addEventListener('change', (e) => {
        stageSelect.disabled = !e.target.checked;
        if (e.target.checked) {
            const stageIdx = parseInt(stageSelect.value);
            const stage = part.stages[stageIdx];
            const price = calculateStagePrice(stage);
            selectedParts.set(part.name, { part, price, stage: stageIdx });
        } else {
            selectedParts.delete(part.name);
        }
        updateTotals();
    });

    stageSelect.addEventListener('change', () => {
        if (checkbox.checked) {
            const stageIdx = parseInt(stageSelect.value);
            const stage = part.stages[stageIdx];
            const price = calculateStagePrice(stage);
            selectedParts.set(part.name, { part, price, stage: stageIdx });
            priceSpan.textContent = `$${formatPrice(price)}`;
            updateTotals();
        }
    });

    div.appendChild(checkbox);
    div.appendChild(label);
    div.appendChild(optionsDiv);
    div.appendChild(priceSpan);
    partsContainer.appendChild(div);
}

function calculatePartPrice(part) {
    if (part.price !== undefined) {
        if (part.percentages) {
            const carPrice = parseInt(carPriceRange.value);
            const range = getPriceRange(carPrice);
            const percentage = part.percentages[range];
            return part.price + (carPrice * percentage / 100);
        }
        return part.price;
    }
    return 0;
}

function calculateStagePrice(stage) {
    if (stage.percentages) {
        const carPrice = parseInt(carPriceRange.value);
        const range = getPriceRange(carPrice);
        const percentage = stage.percentages[range];
        return stage.base + (carPrice * percentage / 100);
    }
    return stage.price || stage.base || 0;
}

function getPriceRange(carPrice) {
    if (carPrice <= 10000) return 'low';
    if (carPrice <= 30000) return 'mid';
    return 'high';
}

function updateTotals() {
    // Update all prices based on car price range
    document.querySelectorAll('[id^="price-"]').forEach(priceEl => {
        const partName = priceEl.id.replace('price-', '');
        const checkbox = document.getElementById(`part-${partName}`);

        // Find the part
        let foundPart = null;
        Object.values(partsData).forEach(category => {
            const part = category.find(p => p.name === partName);
            if (part) foundPart = part;
        });

        if (foundPart) {
            if (foundPart.stages) {
                const stageSelect = document.getElementById(`stage-${partName}`);
                const stageIdx = parseInt(stageSelect.value);
                const price = calculateStagePrice(foundPart.stages[stageIdx]);
                priceEl.textContent = `$${formatPrice(price)}`;

                if (checkbox.checked) {
                    selectedParts.set(partName, { part: foundPart, price, stage: stageIdx });
                }
            } else {
                const price = calculatePartPrice(foundPart);
                priceEl.textContent = `$${formatPrice(price)}`;

                if (checkbox.checked) {
                    selectedParts.set(partName, { part: foundPart, price, stage: null });
                }
            }
        }
    });

    // Calculate total
    let total = 0;
    selectedParts.forEach(({ price }) => {
        total += price;
    });

    // Add Robocizna (labor cost)
    const robocizna = parseFloat(robociznaInput.value) || 0;
    total += robocizna;

    totalEl.textContent = formatPrice(total);
}

function formatPrice(price) {
    return price.toFixed(2);
}

// Initialize on load
init();