const buttonAddToCart = document.querySelectorAll('.add-to-cart');
const modalAddToCart = document.querySelector('.modal-add-to-cart .modal-custom');
const modalContent = document.querySelector('.modal-add-to-cart .modal-content');
const infoProductId = document.querySelector('.modal-add-to-cart .info-product');
const quantityCart = modalContent.querySelector('.quantity-product-cart');

function removeActiveAll(list) {
    list.forEach(item => item.classList.remove('size-select'));
}

function generateColorProductHTML(data) {
    return data.map((item, index) => `
        <li title=${item.Title} id-product-img=${item.ID}  class="item-color-product relative overflow-hidden">
            <button id-color=${item.ID} class="${index === 0 ? "size-select" : ""} color-item border !p-0 size-[8rem] rounded-md overflow-hidden relative">
                <img class="object-cover w-full h-full absolute inset-0" src="${item.ImageURL}" alt="color-black" />
            </button>
            <div class="rounded-full absolute size-[2rem] -top-[0.7rem] -right-[0.6rem] shadow-md " style="background:url(${item.Color});background-repeat: no-repeat;background-size: cover;"></div>
        </li>
    `).join('');
}

function generateSizeProductHTML(listOption, sizeActive = "") {
    return listOption.map((item) => `
        <li>
            <button class="w-full">
                <div id-size="${item.size}" stock="${item.stock}" title="${item.size}" class="${item.size === sizeActive ? "size-select" : ""} item-size w-full size-button item-size-cart ${item.stock === 0 ? "no-stock" : ""} text-[1.2rem] flex items-center justify-center border bg-white rounded-[0.4rem] cursor-pointer min-h-[4.5rem]">
                    <span>${item.size}</span>
                </div>
            </button>
        </li>
    `).join('');
}

function generateProductHTML(dom, data, listOption, stock) {
    const titleProduct = dom.querySelector('.title-product').textContent;
    const colorProductHTML = generateColorProductHTML(data);
    const sizeProductHTML = generateSizeProductHTML(listOption[0]);

    return `
        <div class="title-product-cart">
            <p class="text-[1.8rem]">${titleProduct}</p>
        </div>
        <div class="color-product-cart product-option-color flex flex-col gap-[0.8rem]">
            <div class="title-color-product-cart">
                <p class="text-[1.6rem] text-main"><span class="font-bold">カラー：</span><span class="title_img">${data[0].Title}</span></p>
            </div>
            <div class="list-color-product-cart">
                <ul class="flex gap-[1.6rem] flex-wrap">${colorProductHTML}</ul>
            </div>
        </div>
        <div class="size-product-cart flex flex-col gap-[0.8rem]">
            <div class="title-size-product-cart">
                <p class="text-[1.6rem] text-main"><span class="font-bold">サイズ：</span><span class="title_size">${listOption[0].length > 0 ? listOption[0][0].size : stock}</span></p>
            </div>
            <div class="list-size-product-cart product-option-size">
                <ul class="grid gap-[1rem] grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">${sizeProductHTML}</ul>
            </div>
        </div>
    `;
}

async function getProductData(idProduct) {
    const storedData = sessionStorage.getItem(`productData-${idProduct}`);

    if (storedData) {
        return JSON.parse(storedData);
    } else { const response = await fetch(`/api/v1/client/category/get_size/${idProduct}`);
        const data = await response.json();
       
        sessionStorage.setItem(`productData-${idProduct}`, JSON.stringify(data));
        return data;
    }
}

function getSessionStorageSize() {
    let total = 0;
    Object.keys(sessionStorage).forEach(key => {
        const amount = (sessionStorage[key].length * 2) / 1024 / 1024;
        total += isNaN(amount) ? 0 : amount;
    });
    return total.toFixed(2);
}

function removeDomReload() {
    ['.title-product-cart', '.color-product-cart', '.size-product-cart'].forEach(selector => {
        const element = modalContent.querySelector(selector);
        if (element) element.remove();
    });
}

async function handleButtonClick(button) {
    try {
        if (getSessionStorageSize() > 4.8) {
            sessionStorage.clear();
        }
        removeDomReload();
        modalAddToCart.classList.toggle('hidden');

        const productParent = button.closest('.product-item');
        const idProduct = productParent.getAttribute('id-product');
        const dataProduct = await getProductData(idProduct);

        if (dataProduct.code === 200) {
            infoProductId.setAttribute('id-product', idProduct);
        
            const listOption = dataProduct.data.map(item => JSON.parse(item.List_Options ?? "[]"));
            const stock = dataProduct.data.map(item => item.Stock);
            const content = generateProductHTML(productParent, dataProduct.data, listOption, stock);
            quantityCart.insertAdjacentHTML("beforebegin", content);

            const sizeTitle = modalContent.querySelector('.title_size');
            const colorTitle = modalContent.querySelector('.title_img');

            const listColorProduct = modalContent.querySelector('.list-color-product-cart');
            const listSizeProduct = modalContent.querySelector('.list-size-product-cart');

            listColorProduct.addEventListener('click', event => {
                if (event.target.closest('button')) {
                    handleColorProductClick(event.target.closest('button'), dataProduct, listColorProduct.querySelectorAll('button'), colorTitle, sizeTitle);
                }
            });

            listSizeProduct.addEventListener('click', event => {
                
                if (event.target.closest('button')) {
                    handleSizeProductClick(event.target.closest('button'), listSizeProduct.querySelectorAll('.item-size-cart'), sizeTitle);
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
}

function handleColorProductClick(button, dataProduct, listColorButtons, colorTitle, sizeTitle) {
    const idProductImg = button.closest('.item-color-product').getAttribute('id-product-img');
    const dataFilter = dataProduct.data.find(item => item.ID === parseInt(idProductImg));
    
    if (dataFilter) {
        colorTitle.textContent = dataFilter.Title;
        const listOption = JSON.parse(dataFilter.List_Options ?? "[]");
        const sizeHTML = generateSizeProductHTML(listOption, sizeTitle.textContent);
        const listSizeProductDom = modalContent.querySelector('.list-size-product-cart ul');
        listSizeProductDom.innerHTML = sizeHTML;

        listSizeProductDom.addEventListener('click', event => {
            if (event.target.closest('button')) {
                handleSizeProductClick(event.target.closest('button'), listSizeProductDom.querySelectorAll('.item-size-cart'), sizeTitle);
            }
        });
        removeActiveAll(listColorButtons);
        button.classList.add('size-select');
    }
}

function handleSizeProductClick(button, listSizeButtons, sizeTitle) {
   
    const divButton = button.querySelector('div');
    const stock = button.getAttribute('stock');
   
    if (stock !== "0") {
        sizeTitle.textContent = divButton.getAttribute('title');

        removeActiveAll(listSizeButtons);
        divButton.classList.add('size-select');
    }
}



if (buttonAddToCart.length > 0) {
    buttonAddToCart.forEach(button => {
        button.addEventListener('click', () => handleButtonClick(button));
    });
}
