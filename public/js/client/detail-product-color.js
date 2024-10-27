const colorItems = document.querySelectorAll('.color-list .color-item');
const loader = document.querySelector('.swiper-container.gallery-top .swiper-wrapper .loader');
const loadingImage = document.querySelector('.swiper-container.gallery-top .swiper-wrapper .loading-image');
const swiperGallery = document.querySelectorAll('.swiper-gallery .swiper-container .swiper-wrapper .swiper-slide');
const scriptTag = document.getElementById('list');
const titleCategory = document.querySelector('.info-product .product-content .product-category');
const titleCategoryMobile = document.querySelector('.StickyCart .StickyCartContainer .product-category-mobile');
const colorMobile = document.querySelector('.item-color-mobile');
const data = JSON.parse(scriptTag?.textContent || '[]');




// Hàm trợ giúp
function findById(data, id) {
    return data.find(item => parseInt(item.ID) === parseInt(id)) || {};
}

function extractImageUrl(element) {
    const style = element.getAttribute('style');
    const regex = /url\(["']?(.*?)["']?\)/;
    const match = style.match(regex);
    return match ? match[1] : null;
}

function actionChangeMobile(idColor) {
    const idSize = document.querySelector('.product-options .size-select').getAttribute('id-size');
    document.querySelector('.active-outline-detail-mobile')?.classList.remove('active-outline-detail-mobile');
    document.querySelector(`li.options-moible[id-product="${idColor}"][id-size="${idSize}"]`)?.classList.add('active-outline-detail-mobile');
}
function handleColorItemClick(event) {
    const idColor = this.getAttribute('id-product');
    const contentMain = titleCategory.textContent.split('・')[0] + '・' + this.getAttribute('title');
   
    actionChangeMobile(idColor);
 

    titleCategory.textContent = contentMain;
    titleCategoryMobile.textContent = contentMain;
    const activeItem = document.querySelector('.color-list .color-item.active-outline-detail');
    if (activeItem) {
        activeItem.classList.remove('active-outline-detail');
    }
    this.classList.add('active-outline-detail');
    //Đáp màu cho mobile
    const linkDemoColor = extractImageUrl(this)
    colorMobile.style.backgroundImage = `url(${linkDemoColor})`;

    const products = findById(data, idColor);
    if (!products || !products.dataImage || products.dataImage.length === 0) return;

    const product = products.dataImage;
    loader.style.display = "block";
    const activeIndex = galleryTop.activeIndex;

    loadingImage.src = product[activeIndex].ImageURLMain;
    swiperGallery.forEach((slide, index) => {
        const { ImageURL, ImageURLMain } = product[index] || {};
        if (ImageURL && ImageURLMain) {
            slide.style.backgroundImage = `url(${ImageURL})`;
            slide.setAttribute('data-image', ImageURLMain);
        }
    });

    const sizes = products.dataSize;
    const listsSize = document.querySelector('.lists-size');
    const sizeSelect = document.querySelector('.size-select');

    if (sizes.length > 0) {
        const children = Array.from(listsSize.children);
        const indexSize = children.indexOf(sizeSelect);
        const textHTMLSize = sizes.map((item, index) => `
            <div
                id-size=${item.size}
                class="${item.stock === 0 ? "no-stock" : ""} ${(index === indexSize && item.stock > 0) ? "size-select" : ""} item-size w-full text-[1.2rem] items-center bg-white border border-[#c4c4c6] rounded-[0.4rem] cursor-pointer flex justify-center min-h-[4.5rem] p-[0.8rem] text-center"
            >
                ${item.size}
            </div>
        `).join('');
        listsSize.innerHTML = textHTMLSize;
        // console.log(listsSize);
        listsSize.querySelectorAll('.item-size').forEach(itemSize => {
            itemSize.addEventListener('click', handleSizeItemClick);
        });
    }
}

// Sự kiện
if (colorItems.length > 0 && data.length > 0) {
    colorItems.forEach((colorItem) => {
        colorItem.addEventListener('click', handleColorItemClick);
    });
}

// Chuyển đổi giá
const price = "3900.00"
const convertPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);