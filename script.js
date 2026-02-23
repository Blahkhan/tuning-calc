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
const carUidInput = document.getElementById('carUid');
const licensePlateInput = document.getElementById('licensePlate');
const tunerNameInput = document.getElementById('tunerName');
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
    renderCategory('Części kosmetyczne', partsData.cosmetic);
    renderCategory('Części nadwozia', partsData.bodyParts);
    renderCategory('Felgi', partsData.wheels);
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
    document.querySelectorAll('[id^="price-"]').forEach(priceEl => {
        const partName = priceEl.id.replace('price-', '');
        const checkbox = document.getElementById(`part-${partName}`);

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

    let partsCost = 0;
    selectedParts.forEach(({ price }) => {
        partsCost += price;
    });

    const laborCost = parseFloat(robociznaInput.value) || 0;
    const total = partsCost + laborCost;

    partsCostEl.textContent = `$${formatPrice(partsCost)}`;
    laborCostEl.textContent = `$${formatPrice(laborCost)}`;
    totalEl.textContent = `$${formatPrice(total)}`;
}

function formatPrice(price) {
    return price.toFixed(2);
}

async function getLogoDataUrl() {
    try {
        const response = await fetch('logo.png', { cache: 'no-store' });
        if (!response.ok) {
            return null;
        }
        const blob = await response.blob();
        return await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        return null;
    }
}

// PDF Export Function
async function exportPDF() {
    const { jsPDF } = window.jspdf;

    const now = new Date();
    const dateStr = now.toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
    const invoiceNo = `DSS-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const carName = carNameInput.value || 'Pojazd';
    const carUid = carUidInput.value.trim() || 'Brak';
    const licensePlate = licensePlateInput.value.trim() || 'Brak';
    const tunerName = tunerNameInput.value.trim() || 'Brak';
    const carPrice = parseFloat(carPriceInput.value) || 0;
    const carValue = formatPrice(carPrice);

    const selectedItems = [];
    selectedParts.forEach(({ part, price, stage }) => {
        const stageName = stage !== null ? ` - ${part.stages[stage].name}` : '';
        selectedItems.push({
            name: part.name + stageName,
            price: price
        });
    });

    const partsCost = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const laborCost = parseFloat(robociznaInput.value) || 0;
    const total = partsCost + laborCost;

    // Create PDF
    const doc = new jsPDF('p', 'mm', 'a4');

    // Colors
    const gold = [212, 175, 55];
    const dark = [17, 24, 39];
    const gray = [107, 114, 128];
    const lightGray = [229, 231, 235];

    let y = 15;

    // Load and add logo
    try {
        const logoDataUrl = await getLogoDataUrl();
        if (logoDataUrl) {
            doc.addImage(logoDataUrl, 'PNG', 15, y, 40, 15);
        }
    } catch (e) {
        console.warn('Logo not loaded:', e);
    }

    // Header - Company name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...dark);
    doc.text('DEUTSCHE STYLE STUDIO', 15, y + 20);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text('Premium Car Customization Studio', 15, y + 25);

    // Invoice chip and info (right side)
    doc.setFillColor(...dark);
    doc.roundedRect(150, y, 45, 8, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(245, 233, 196);
    doc.text('RACHUNEK', 172.5, y + 5.5, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...dark);
    doc.text(`Data: ${dateStr}`, 195, y + 12, { align: 'right' });
    doc.text(`Numer: ${invoiceNo}`, 195, y + 17, { align: 'right' });

    // Gold accent line
    doc.setDrawColor(...gold);
    doc.setLineWidth(1);
    doc.line(15, y + 28, 195, y + 28);

    y += 35;

    // Vehicle banner
    doc.setFillColor(255, 247, 230);
    doc.rect(15, y, 180, 8, 'F');
    doc.setDrawColor(...gold);
    doc.setLineWidth(1);
    doc.line(15, y, 15, y + 8);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(90, 69, 21);
    doc.text(`Pojazd: ${carName}`, 18, y + 5.5);

    y += 14;

    // Info blocks
    const blockWidth = 87;
    const blockHeight = 22;

    // Vehicle data block
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, y, blockWidth, blockHeight, 2, 2, 'S');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gray);
    doc.text('DANE POJAZDU', 18, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...dark);
    doc.setFontSize(9);
    doc.text('Wartosc', 18, y + 11);
    doc.text(`$${carValue}`, 18 + blockWidth - 6, y + 11, { align: 'right' });
    doc.text('UID', 18, y + 16);
    doc.text(carUid, 18 + blockWidth - 6, y + 16, { align: 'right' });
    doc.text('Tablica', 18, y + 21);
    doc.text(licensePlate, 18 + blockWidth - 6, y + 21, { align: 'right' });

    // Tuner data block
    doc.roundedRect(108, y, blockWidth, blockHeight, 2, 2, 'S');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gray);
    doc.text('DANE TUNERA', 111, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...dark);
    doc.setFontSize(9);
    doc.text('Imie i nazwisko', 111, y + 11);
    doc.text(tunerName, 111 + blockWidth - 6, y + 11, { align: 'right' });

    y += blockHeight + 8;

    // Parts table
    const tableData = selectedItems.length ?
        selectedItems.map(item => [item.name, `$${formatPrice(item.price)}`]) : [
            [{ content: 'Brak wybranych usług', colSpan: 2, styles: { halign: 'center', textColor: gray } }]
        ];

    doc.autoTable({
        startY: y,
        head: [
            ['Usluga / Czesc', 'Cena (PLN)']
        ],
        body: tableData,
        theme: 'plain',
        styles: {
            fontSize: 9,
            cellPadding: 3,
            textColor: dark
        },
        headStyles: {
            fillColor: dark,
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: 'bold',
            halign: 'left'
        },
        columnStyles: {
            0: { cellWidth: 130 },
            1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 15, right: 15 }
    });

    y = doc.lastAutoTable.finalY + 8;

    // Totals section
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, y, 180, 26, 2, 2, 'S');
    doc.setFillColor(252, 252, 252);
    doc.roundedRect(15, y, 180, 26, 2, 2, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...dark);
    doc.text('Razem czesci', 18, y + 6);
    doc.text(`$${formatPrice(partsCost)}`, 192, y + 6, { align: 'right' });

    doc.text('Robocizna', 18, y + 12);
    doc.text(`$${formatPrice(laborCost)}`, 192, y + 12, { align: 'right' });

    // Grand total
    doc.setFillColor(245, 233, 196);
    doc.roundedRect(18, y + 16, 174, 8, 1.5, 1.5, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RAZEM DO ZAPLATY', 21, y + 21.5);
    doc.text(`$${formatPrice(total)}`, 189, y + 21.5, { align: 'right' });

    y += 32;

    // Footer
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.2);
    doc.line(15, y, 195, y);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text('Dziekujemy za wybranie Deutsche Style Studio!', 105, y + 5, { align: 'center' });
    doc.text('Dokument wygenerowany automatycznie', 105, y + 9, { align: 'center' });

    // Save
    doc.save(`Deutsche-Style-Invoice-${dateStr}.pdf`);
}

// Initialize on load
init();

// Add PDF export event listener
document.getElementById('exportPdfBtn').addEventListener('click', exportPDF);