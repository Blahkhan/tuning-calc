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
const carNameInput = document.getElementById('carName');
const carPriceInput = document.getElementById('carPrice');
const totalEl = document.getElementById('total');
const robociznaInput = document.getElementById('robocizna');
const partsCostEl = document.getElementById('partsCost');
const laborCostEl = document.getElementById('laborCost');

let selectedParts = new Map();

function init() {
    renderParts();
    carPriceInput.addEventListener('input', updateTotals);
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
            const carPrice = parseFloat(carPriceInput.value) || 0;
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
        const carPrice = parseFloat(carPriceInput.value) || 0;
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

    // Calculate parts total
    let partsCost = 0;
    selectedParts.forEach(({ price }) => {
        partsCost += price;
    });

    // Get labor cost
    const laborCost = parseFloat(robociznaInput.value) || 0;
    const total = partsCost + laborCost;

    // Update display
    partsCostEl.textContent = `$${formatPrice(partsCost)}`;
    laborCostEl.textContent = `$${formatPrice(laborCost)}`;
    totalEl.textContent = `$${formatPrice(total)}`;
}

function formatPrice(price) {
    return price.toFixed(2);
}

// PDF Export Function
function exportPDF() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
    const carName = carNameInput.value || 'Pojazd';

    // Collect selected items
    const selectedItems = [];
    selectedParts.forEach(({ part, price, stage }) => {
        const stageName = stage !== null ? ` - ${part.stages[stage].name}` : '';
        selectedItems.push({
            name: part.name + stageName,
            price: formatPrice(price)
        });
    });

    const partsCost = selectedItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const laborCost = parseFloat(robociznaInput.value) || 0;
    const total = partsCost + laborCost;

    // Create invoice HTML
    const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                * { box-sizing: border-box; }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    color: #2c3e50; 
                    padding: 8px; 
                    margin: 0; 
                    width: 100%; 
                    background: white;
                }
                .header { 
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    border-bottom: 4px solid #D4AF37;
                    padding: 15px 12px;
                    margin: -8px -8px 15px -8px;
                    color: white;
                }
                .company-name { 
                    font-size: 22px; 
                    font-weight: 700; 
                    color: white; 
                    margin: 0 0 4px 0;
                    letter-spacing: 0.5px;
                }
                .tagline { 
                    font-size: 9px; 
                    color: #c0c0c0;
                    margin: 0;
                    font-weight: 300;
                    letter-spacing: 0.3px;
                }
                .invoice-section {
                    margin-bottom: 14px;
                }
                .invoice-title { 
                    font-size: 14px; 
                    font-weight: 700; 
                    color: #1a1a1a;
                    margin: 0 0 8px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .car-name { 
                    font-size: 11px; 
                    color: #D4AF37; 
                    font-weight: 600;
                    margin-bottom: 10px;
                    background: #f8f8f8;
                    padding: 6px 8px;
                    border-left: 3px solid #D4AF37;
                }
                .info-section { 
                    display: flex; 
                    justify-content: space-between; 
                    margin-bottom: 14px; 
                    font-size: 9.5px; 
                    gap: 12px;
                    background: #f9fafb;
                    padding: 10px;
                    border-radius: 4px;
                    border: 1px solid #e8e8e8;
                }
                .info-col { 
                    flex: 1; 
                    line-height: 1.5;
                }
                .info-row {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 4px;
                }
                .info-label { 
                    font-weight: 600; 
                    color: #D4AF37;
                    min-width: 70px;
                }
                .info-value { 
                    color: #2c3e50;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-bottom: 12px; 
                    table-layout: fixed;
                    border: 1px solid #e0e0e0;
                }
                th { 
                    background-color: #2c3e50;
                    color: white; 
                    padding: 8px 6px; 
                    text-align: left; 
                    font-size: 9.5px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                th:last-child { text-align: right; }
                td { 
                    padding: 7px 6px; 
                    border-bottom: 1px solid #e8e8e8;
                    font-size: 9.5px; 
                    word-wrap: break-word;
                }
                td:last-child { text-align: right; font-weight: 500; }
                tbody tr { background: white; }
                tbody tr:nth-child(even) { background-color: #f9fafb; }
                tbody tr:hover { background-color: #f0f0f0; }
                .total-section { 
                    margin-top: 12px; 
                    padding: 10px;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    background: #fafafa;
                }
                .total-row { 
                    display: flex; 
                    justify-content: space-between; 
                    margin-bottom: 6px; 
                    font-size: 9.5px;
                }
                .total-label { 
                    font-weight: 600;
                    color: #2c3e50;
                }
                .total-value {
                    color: #2c3e50;
                }
                .grand-total { 
                    display: flex; 
                    justify-content: space-between; 
                    font-size: 12px; 
                    font-weight: 700;
                    color: #1a1a1a;
                    background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%);
                    margin-top: 10px; 
                    padding: 10px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .footer { 
                    margin-top: 14px; 
                    padding-top: 10px; 
                    border-top: 1px solid #e0e0e0;
                    font-size: 8px; 
                    color: #7f8c8d; 
                    text-align: center; 
                    line-height: 1.5;
                }
                .footer-divider {
                    height: 1px;
                    background: #e0e0e0;
                    margin: 8px 0;
                }
                p { margin: 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <p class="company-name">DEUTSCHE STYLE STUDIO</p>
                <p class="tagline">Premium Car Customization Studio</p>
            </div>
            
            <div class="invoice-section">
                <div class="invoice-title">RACHUNEK</div>
                <div class="car-name">Pojazd: ${carName}</div>
            </div>
            
            <div class="info-section">
                <div class="info-col">
                    <div class="info-row">
                        <span class="info-label">Data:</span>
                        <span class="info-value">${dateStr}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Numer:</span>
                        <span class="info-value">INV-${now.getTime().toString().slice(-6)}</span>
                    </div>
                </div>
                <div class="info-col">
                    <div class="info-row">
                        <span class="info-label">Pojazd:</span>
                        <span class="info-value">$${formatPrice(parseFloat(carPriceInput.value) || 0)}</span>
                    </div>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Usługa / Część</th>
                        <th style="width: 65px; text-align: right;">Cena (PLN)</th>
                    </tr>
                </thead>
                <tbody>
                    ${selectedItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>$${item.price}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="total-section">
                <div class="total-row">
                    <span class="total-label">Razem części:</span>
                    <span class="total-value">$${formatPrice(partsCost)}</span>
                </div>
                <div class="total-row">
                    <span class="total-label">Robocizna:</span>
                    <span class="total-value">$${formatPrice(laborCost)}</span>
                </div>
                <div class="grand-total">
                    <span>RAZEM DO ZAPŁATY</span>
                    <span>$${formatPrice(total)}</span>
                </div>
            </div>
            
            <div class="footer">
                <p>Dziękujemy za wybranie Deutsche Style Studio!</p>
                <p>Dla najlepszych efektów zapoznaj się z naszymi usługami</p>
                <p style="margin-top: 6px; border-top: 1px solid #d0d0d0; padding-top: 6px;">Dokument wygenerowany automatycznie</p>
            </div>
        </body>
        </html>
    `;
    
    // Generate PDF using html2pdf
    const element = document.createElement('div');
    element.innerHTML = invoiceHTML;
    
    const opt = {
        margin: [5, 5, 5, 5],
        filename: `Deutsche-Style-Invoice-${dateStr}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4', compress: true }
    };
    
    html2pdf().set(opt).from(element).save();
}

// Initialize on load
init();

// Add PDF export event listener
document.getElementById('exportPdfBtn').addEventListener('click', exportPDF);