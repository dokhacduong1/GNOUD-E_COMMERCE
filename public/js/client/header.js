function getFormObject(form) {
    return Array.from(new FormData(form).entries()).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
}
//Đây là chọn category select ở ô search
// Khởi tạo các phần tử DOM
const elements = {
    boxFullBlur: document.querySelector('.box-full-blur'), // Hộp tìm kiếm
    divBlur: document.querySelector('.blur-full'), // Phần tử div chứa hộp tìm kiếm
    inputBlur: document.querySelector('.input-full-blur'), // Ô nhập tìm kiếm
    selectBlur: document.querySelector('.select-blur'), // Phần tử select
    categoriesBlur: document.querySelector('.categories-full-blur'), // Danh mục tìm kiếm
    arrowUp: document.querySelector('.arrow-up'), // Mũi tên lên
    arrowDown: document.querySelector('.arrow-down'), // Mũi tên xuống
    itemCategories: document.querySelectorAll('.item-categories'), // Các mục trong danh mục
    activeSelect: document.querySelector('.active-select'), // Mục đang được chọn
    inputMain: document.querySelector('.search-menu .search-box'),
    boxSearchOverlay: document.querySelector('.search-menu .box-search-overlay')
};

// Hàm chuyển đổi trạng thái hiển thị của một phần tử
function toggleVisibility(element) {
    element.classList.toggle('hidden'); // Thêm hoặc xóa class 'hidden'
}

// Hàm đặt chiều rộng cho divBlur
function setDivBlurWidth(width) {
    elements.divBlur.style.width = width; // Đặt chiều rộng
}

// Thêm event listener cho sự kiện focus của inputBlur
elements.inputBlur.addEventListener('focus', () => {

    setDivBlurWidth('100%');
    if (!elements.categoriesBlur.classList.contains('hidden')) {
        toggleVisibility(elements.categoriesBlur);
        toggleVisibility(elements.arrowDown);
        toggleVisibility(elements.arrowUp);
    }
});

// Thêm event listener cho sự kiện blur của inputBlur
elements.inputBlur.addEventListener('blur', () => {
    if (elements.categoriesBlur.classList.contains('hidden')) {
        // setDivBlurWidth('0%');
        // toggleVisibility(elements.categoriesBlur);
    }
})

// Thêm event listener cho sự kiện click của selectBlur
elements.selectBlur.addEventListener('click', () => {
    elements.inputBlur.blur();
    toggleVisibility(elements.arrowUp);
    toggleVisibility(elements.arrowDown);
    toggleVisibility(elements.categoriesBlur);
    if (!elements.categoriesBlur.classList.contains('hidden')) {
        setDivBlurWidth('100%');
    }
});

// Thêm event listener cho sự kiện click của mỗi mục trong danh mục
elements.itemCategories.forEach(item => {
    item.addEventListener('click', () => {

        // Xóa class 'active-blur' khỏi tất cả các mục
        elements.itemCategories.forEach(i => i.classList.remove('active-blur'));
        // Thêm class 'active-blur' vào mục được nhấp
        item.classList.add('active-blur');
   
        elements.inputMain.setAttribute('id-main-category', item.getAttribute('id-category') ?? 0);

        // Đặt nội dung của mục đang được chọn thành nội dung của mục được nhấp
        elements.activeSelect.textContent = item.textContent;
        // Ẩn danh mục
        toggleVisibility(elements.categoriesBlur);

        elements.inputBlur.focus(); // Đã được comment lại
    });
});

// Thêm event listener cho sự kiện click của document
document.addEventListener('click', (e) => {

    if (e.target.contains(elements.divBlur)) { // Nếu nhấp vào bên ngoài divBlur
        
        setDivBlurWidth('0%'); // Đặt chiều rộng của divBlur thành 0%
        if (!elements.categoriesBlur.classList.contains('hidden')) {
            toggleVisibility(elements.categoriesBlur); // Ẩn danh mục
        }
        if(!elements.boxSearchOverlay.classList.contains('hidden')){
            toggleVisibility(elements.boxSearchOverlay);
        }
        if (elements.arrowDown.classList.contains('hidden')) {
            toggleVisibility(elements.arrowDown); // Hiển thị mũi tên xuống
            toggleVisibility(elements.arrowUp); // Ẩn mũi tên lên
        }
    }
});


//Đoạn này là thanh chọn danh mục ở trang chính
const navCategories = document.querySelectorAll('.nav__categories ul li button');
const divAllDropCategories = document.querySelector('.category-modal');
const dropCategoriesList = document.querySelectorAll('.dropMenuCategory__all');

navCategories.forEach((item) => {
    item.addEventListener('click', () => {
        navCategories.forEach((i) => {
            if (i !== item) i.classList.remove('select-categories');
        });
        item.classList.toggle('select-categories');

        const activeDropCategories = item.getAttribute('active');
        const dropCategories = document.querySelector(`.${activeDropCategories}`);
        if (dropCategories === null) return;
        dropCategoriesList.forEach((i) => {
            if (dropCategories != i && !i.classList.contains('hidden')) {
                i.classList.add('hidden');
            }
        });

        dropCategories.classList.toggle('hidden');
        divAllDropCategories.classList.toggle('hidden', dropCategories.classList.contains('hidden'));
    });
});


//Đây là khi ấn button nó hiện cái modal category khi ở điện thoại
const btnCategory = document.querySelector('.button-category');
const modalCategory = document.querySelector('.search-modal-container');
const btnCloseModal = document.querySelector('.close-modal-button');
const removePlay = document.querySelector(".remodal-overlay")
if (btnCategory) {
    btnCategory.addEventListener('click', () => {

        modalCategory.classList.remove('hidden');
       
      
    })
};

if(btnCloseModal){
    btnCloseModal.addEventListener('click', () => {
        modalCategory.classList.add('hidden');
      
    })
}



//Đây là ấn vào categories để mở ra ở màn mobile
const itemCategories = document.querySelectorAll('.co-dropMenuCategory__menu__title__item');
if(itemCategories){
    itemCategories.forEach((item) => {
        item.addEventListener('click', () => {
           item.classList.toggle('item-categories-active');
        });
    });
}
