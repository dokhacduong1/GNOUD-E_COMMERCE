function handleSizeItemClick() {

    const activeItem = document.querySelector('.item-size.size-select');
    const contentMain = this.textContent + '・' + titleCategorySize.textContent.split('・')[1];
    titleCategorySize.textContent = contentMain;
    titleCategorySizeMobile.textContent = contentMain;
    const idSize = this.getAttribute("id-size");
    const idProduct = document.querySelector('.product-options .color-list .color-item.active-outline-detail')?.getAttribute('id-product');

    const sizeMobileActive = document.querySelector(`li.options-moible[id-size="${idSize}"][id-product="${idProduct}"]`);
    const activeMobileItem = document.querySelector('.active-outline-detail-mobile');
    if (activeMobileItem) {
        activeMobileItem.classList.remove('active-outline-detail-mobile');

        sizeMobileActive?.classList.add('active-outline-detail-mobile');
    }
   
    if (activeItem) {
        activeItem.classList.remove('size-select');
    }
    this.classList.add('size-select');
}

const itemSizes = document.querySelectorAll('.item-size');
const titleCategorySize = document.querySelector('.info-product .product-content .product-category');
const titleCategorySizeMobile = document.querySelector('.StickyCart .StickyCartContainer .product-category-mobile');

if (itemSizes.length > 0) {
    itemSizes.forEach(itemSize => {
        itemSize.addEventListener('click', handleSizeItemClick);
    });
}


const itemSizesMobile = document.querySelectorAll('.options-moible');
if (itemSizesMobile.length > 0) {
    itemSizesMobile.forEach(itemSizeMobile => {
        itemSizeMobile.addEventListener('click', function () {
            const idSize = this.getAttribute('id-size');
            const idProduct = this.getAttribute('id-product');
            const titleProduct = this.getAttribute('title');
            const contentMain =  idSize+ '・' + titleProduct;
            titleCategorySize.textContent = contentMain;
            titleCategorySizeMobile.textContent = contentMain;

            const activeItem = document.querySelector('.item-size.size-select');
            if (activeItem) {
                activeItem.classList.remove('size-select');
                document.querySelector(`.item-size[id-size="${idSize}"]`)?.classList.add('size-select');
            }
            
            // // actionChangeMobile(idProduct);
            const colorItem = document.querySelector(`.color-list .color-item[id-product="${idProduct}"]`);
            colorItem.click();
        });
    });
}