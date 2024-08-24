// Lấy tất cả các phần tử có class là 'color-item' bên trong '.color-list'
const colorItems = document.querySelectorAll('.color-list .color-item');

// Lấy phần tử loader bên trong swiper container của gallery-top
const loader = document.querySelector('.swiper-container.gallery-top .swiper-wrapper .loader');

// Lấy phần tử hình ảnh đang tải bên trong swiper container của gallery-top
const loadingImage = document.querySelector('.swiper-container.gallery-top .swiper-wrapper .loading-image');

// Lấy tất cả các slide bên trong swiper-gallery
const swiperGallery = document.querySelectorAll('.swiper-gallery .swiper-container .swiper-wrapper .swiper-slide');

// Lấy thẻ script với id là 'list'
const scriptTag = document.getElementById('list');

// Lấy phần tử chứa danh mục sản phẩm trong giao diện chính
const titleCategory = document.querySelector('.info-product .product-content .product-category');

// Lấy phần tử chứa danh mục sản phẩm trong giao diện di động
const titleCategoryMobile = document.querySelector('.StickyCart .StickyCartContainer .product-category-mobile');

// Lấy phần tử hiển thị màu sắc sản phẩm trong giao diện di động
const colorMobile = document.querySelector('.item-color-mobile');

// Lấy tất cả các phần tử kích thước sản phẩm trong giao diện di động
const itemSizesMobile = document.querySelectorAll('.options-moible');

// Lấy tất cả các phần tử kích thước sản phẩm trong giao diện chính
const itemSizes = document.querySelectorAll('.item-size');

// Lấy phần tử chứa danh mục sản phẩm trong giao diện di động (giống như titleCategoryMobile)
const titleCategorySizeMobile = document.querySelector('.StickyCart .StickyCartContainer .product-category-mobile');

// Lấy button ấn để mở modal chọn size màu sắc
const StickyCartButton = document.querySelector('.StickyCart .StickyCartContainer .StickyCartButton');

const modelShowOptionMobile = document.querySelector('.StickyCart .StickyCartContainer .modal-show-otion-mobile');

const buttonShowOptionMobile = document.querySelector('.StickyCart');

// Chuyển đổi nội dung text của thẻ script (nếu có) thành JSON
const data = JSON.parse(scriptTag?.textContent || '[]');

// Hàm cập nhật nội dung danh mục với kích thước và màu sắc sản phẩm
function updateContentCategory(nameSize, nameColor) {
    const contentMain = nameSize + '・' + nameColor;
    titleCategory.textContent = contentMain;
    titleCategoryMobile.textContent = contentMain;
}


// Hàm loại bỏ một class từ phần tử hiện tại và thêm class vào phần tử mới
function removeDomAndActive(className="", activeDom="", dom) {
    const activeItem = document.querySelector(className);
    if (activeItem) {
        activeItem.classList.remove(activeDom);
    }
    dom.classList.add(activeDom);
}

// Hàm xử lý sự kiện khi người dùng chọn kích thước sản phẩm trên giao diện di động
function handleSizeMobileClick() {
   
    const checkStockMobile = this.classList.contains('no-stock-mobile');
    if (checkStockMobile) return;
    const idSize = this.getAttribute('id-size');
   
    const idProduct = this.getAttribute('id-product');
    const titleProduct = this.getAttribute('title');
    updateContentCategory(idSize, titleProduct);

    // Lấy phần tử kích thước sản phẩm trong giao diện chính tương ứng với kích thước đã chọn
    const sizeItem = document.querySelector(`.item-size[id-size="${idSize}"]`);
    removeDomAndActive('.item-size.size-select', 'size-select', sizeItem);

    // Lấy phần tử màu sắc sản phẩm tương ứng và kích hoạt sự kiện click
    const colorItem = document.querySelector(`.color-list .color-item[id-product="${idProduct}"]`);
    colorItem.click();
    modelShowOptionMobile.classList.toggle('hidden');
    //Keos len dau trang
    window.scrollTo(0, 0);
}

// Hàm trợ giúp tìm sản phẩm theo ID trong dữ liệu
function findById(data, id) {
    return data.find(item => parseInt(item.ID) === parseInt(id)) || {};
}

// Hàm lấy URL hình ảnh từ thuộc tính style của phần tử
function extractImageUrl(element) {
    const style = element.getAttribute('style');
    const regex = /url\(["']?(.*?)["']?\)/;
    const match = style.match(regex);
    return match ? match[1] : null;
}

// Hàm thay đổi màu sắc sản phẩm trên giao diện di động
function actionChangeMobile(idColor) {
    const idSize = document.querySelector('.product-options .size-select')?.getAttribute('id-size');
    document.querySelector('.active-outline-detail-mobile')?.classList.remove('active-outline-detail-mobile');
    document.querySelector(`li.options-moible[id-product="${idColor}"][id-size="${idSize}"]`)?.classList.add('active-outline-detail-mobile');
}

// Hàm cập nhật tiêu đề danh mục sản phẩm
function updateTitle(contentMain) {
    titleCategory.textContent = contentMain;
    titleCategoryMobile.textContent = contentMain;
}

// Hàm cập nhật hình nền của phần tử bằng URL hình ảnh
function updateBackgroundImage(element, target) {
    const linkDemoColor = extractImageUrl(element);
    target.style.backgroundImage = `url(${linkDemoColor})`;
}

// Hàm cập nhật các slide của Swiper gallery với dữ liệu sản phẩm
function updateSwiperGallery(product) {
    swiperGallery.forEach((slide, index) => {
        const { ImageURL, ImageURLMain } = product[index] || {};
        if (ImageURL && ImageURLMain) {
            slide.style.backgroundImage = `url(${ImageURL})`;
            slide.setAttribute('data-image', ImageURLMain);
        }
    });
}

// Hàm cập nhật các tùy chọn kích thước sản phẩm
function updateSizes(sizes, listsSize, sizeSelect) {
    if (sizes.length > 0) {
        const children = Array.from(listsSize.children);
        const indexSize = children.indexOf(sizeSelect);
        const textHTMLSize = sizes.map((item, index) => `
            <div
                id-size=${item.size}
                class="basis-2/12 ${item.stock === 0 ? "no-stock" : ""} ${(index === indexSize && item.stock > 0) ? "size-select" : ""} item-size w-full text-[1.2rem] items-center bg-white border border-[#c4c4c6] rounded-[0.4rem] cursor-pointer flex justify-center min-h-[4.5rem] p-[0.8rem] text-center"
            >
                ${item.size}
            </div>
        `).join('');
        listsSize.innerHTML = textHTMLSize;

        // Thêm sự kiện click cho các tùy chọn kích thước mới tạo
        listsSize.querySelectorAll('.item-size').forEach(itemSize => {
            itemSize.addEventListener('click', handleSizeItemClick);
        });
    }
}

function checkNoStock(products) {
    const sizes = products.dataSize;
    return sizes.some(item => item.stock === 0);
}

// Hàm xử lý sự kiện khi người dùng chọn một màu sắc sản phẩm
function handleColorItemClick() {
    const idColor = this.getAttribute('id-product');
    const products = findById(data, idColor);
    let contentMain = '';
    if(!checkNoStock(products)){
        contentMain = titleCategory.textContent.split('・')[0] + '・' + this.getAttribute('title');  
    }else{
        contentMain = '製品' + '・' + '在庫切れ';
    };
    
    actionChangeMobile(idColor);
    updateTitle(contentMain);
    removeDomAndActive('.color-list .color-item.active-outline-detail','active-outline-detail',this);
    updateBackgroundImage(this, colorMobile);

   
    if (!products || !products.dataImage || products.dataImage.length === 0) return;

    const product = products.dataImage;
    loader.style.display = "block";
    const activeIndex = galleryTop.activeIndex;

    loadingImage.src = product[activeIndex].ImageURLMain;
    updateSwiperGallery(product);

    const sizes = products.dataSize;
    const listsSize = document.querySelector('.lists-size');
    const sizeSelect = document.querySelector('.size-select');

    updateSizes(sizes, listsSize, sizeSelect);
}

// Hàm xử lý sự kiện khi người dùng chọn một kích thước sản phẩm
function handleSizeItemClick() {
    const idSize = this.getAttribute("id-size");
    const checkStock = this.classList.contains('no-stock');
    if (checkStock) return;
    const idProduct = document.querySelector('.product-options .color-list .color-item.active-outline-detail')?.getAttribute('id-product');
    const sizeMobileActive = document.querySelector(`li.options-moible[id-size="${idSize}"][id-product="${idProduct}"]`);
    updateContentCategory(this.textContent, titleCategory.textContent.split('・')[1]);
    removeDomAndActive('.active-outline-detail-mobile','active-outline-detail-mobile',sizeMobileActive);
    removeDomAndActive('.item-size.size-select','size-select',this);
}

// Gán sự kiện click cho tất cả các tùy chọn kích thước sản phẩm trong giao diện chính
if (itemSizes.length > 0) {
    itemSizes.forEach(itemSize => {
        itemSize.addEventListener('click', handleSizeItemClick);
    });
}

// Gán sự kiện click cho tất cả các tùy chọn màu sắc sản phẩm nếu có dữ liệu
if (colorItems.length > 0 && data.length > 0) {
    colorItems.forEach((colorItem) => {
        colorItem.addEventListener('click', handleColorItemClick);
    });
}

// Gán sự kiện click cho tất cả các tùy chọn kích thước sản phẩm trong giao diện di động
if (itemSizesMobile.length > 0) {
    itemSizesMobile.forEach(itemSizeMobile => {
        itemSizeMobile.addEventListener('click', handleSizeMobileClick);
    });
}


//Mở modal trên mobile để chọn size màu sắc
StickyCartButton.addEventListener('click', function() {
    modelShowOptionMobile.classList.toggle('hidden');
    const iconCheck = this.querySelectorAll('.color-add img');
    iconCheck.forEach((icon) => {
        icon.classList.toggle('hidden');
    });
});

// Hàm được gọi khi phần tử thay đổi trạng thái quan sát
function handleVisibilityChange(entries, observer) {
    entries.forEach(entry => {
       
        if (window.innerWidth < 1024) { // Kiểm tra kích thước màn hình
            if (entry.isIntersecting) {
                buttonShowOptionMobile.style.display = 'none';
            } else {
                buttonShowOptionMobile.style.display = 'block';
            }
        } else {
            buttonShowOptionMobile.style.display = 'none'; // Ẩn nút nếu màn hình lớn hơn 1024px
        }
    });
}

// Tạo một observer mới với callback là hàm handleVisibilityChange
const observer = new IntersectionObserver(handleVisibilityChange, {
    root: null, // Sử dụng viewport của trình duyệt
    rootMargin: '0px',
    threshold: 0 // Gọi callback ngay khi bất kỳ phần nào của phần tử xuất hiện hoặc biến mất
});

// Bắt đầu quan sát phần tử
const targetDiv = document.querySelector('.info-product');
observer.observe(targetDiv);