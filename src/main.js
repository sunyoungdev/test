'use strict';

const sidebar = document.querySelector('.sidebar');

// Fetch the items from JSON data
function loadItems() {
    return fetch('src/data/buildings.json')
    .then(response => { 
        return response.json(); 
    }) 
}

// Update the list with given items
function displayItems(items) {
    const list = document.querySelector('.offering__list');
    list.innerHTML = items.map(item => createItemHTML(item)).join('');
}

// Create HTML list items from the given data item
function createItemHTML(item) {
    return `
        <li class="offering__item">
            <img src="./assets/${item.imageSrc}" alt="${item.name}">
            <div class="offering__info">
            <h2>${item.name}</h2>
            <div>
                <dl>
                    <dt>Type:</dt>
                    <dd>${item.type}</dd>
                </dl>
                <dl>
                    <dt>Status</dt>
                    <dd>${item.status}</dd>
                </dl>
                <dl>
                    <dt>Gross area</dt>
                    <dd>${item.grossArea.toLocaleString('en-GB')} sq ft</dd>
                </dl>
            </div>
            <button type="button" class="offering__btn" data-id="${item.id}">VIEW DETAILS</button>
            </div>
        </li>
    `;
}

function setClickListener(items) {
    const detailBtns = document.querySelectorAll('.offering__btn');  
    detailBtns.forEach((detailBtn) => {
        detailBtn.addEventListener('click', (event) => {onBtnClick(event, items)})
    })
    
    sidebar.addEventListener('click', (event) => {
        if (event.target.nodeName === 'I') {
            sidebar.classList.remove('active');
        }
    })
}

function onBtnClick (event, items) {
    sidebar.classList.add('active');
    const dataId = event.target.dataset.id;
    // console.log(dataId)
    displayTable(dataId, items);
}

function displayTable(dataId, items) {
    const container = document.querySelector('.building');
    const item = items.filter(item => item.id === dataId)[0];
    container.innerHTML = createTableHTML(item);
}

function createTableHTML(item) {
    const floors = item.floors;
    const tableRow = floors.map(floor => {
        return `
            <tr>
                <td>${floor.label}</td>
                <td>${floor.availableSpace === 0 ? '-' : `${floor.availableSpace.toLocaleString('en-GB')} sq ft`}</td>
                <td>${floor.occupier}</td>
            </tr>
        `;
    }).join('');

    return `
        <img src="./assets/${item.imageSrc}" alt="${item.name}">
        <h3 class="building__title">${item.name}</h3>
        <div class="building__info">
            <dl>
                <dt>Type:</dt>
                <dd>${item.type}</dd>
            </dl>
            <dl>
                <dt>Status</dt>
                <dd>${item.status}</dd>
            </dl>
            <dl>
                <dt>Gross area</dt>
                <dd>${item.grossArea.toLocaleString('en-GB')} sq ft</dd>
            </dl>
        </div>
        <div class="building__desc">${item.description}</div>
        <table class="building__table">
            <colgroup>
                <col style="width: 23.89%;">
                <col style="width: 23.89%;">
                <col>
            </colgroup>
            <thead>
                <tr>
                    <td scope="col">FLOOR</td>
                    <td scope="col">AVAILABLE SPACE</td>
                    <td scope="col">OCCUPIER(S)</td>
                </tr>
            </thead>
            <tbody>
                ${tableRow}
            </tbody>
        </table>
    `;
}

// main
loadItems() 
    .then(items => {
        // console.log(items)
        displayItems(items);    
        setClickListener(items);    
    })  
    .catch(console.log) 

