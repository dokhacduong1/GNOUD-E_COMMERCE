
// [Đoạn này thay đổi icon khi click vào menu]
const buttonMenuSider = document.querySelectorAll('.menu-bar');

buttonMenuSider.forEach(button => {
    // Thêm một trình nghe sự kiện click vào mỗi phần tử 'buttonMenuSider'
    button.addEventListener('click', function () {
        // Truy vấn để lấy phần tử 'i' đầu tiên trong phần tử 'buttonMenuSider' được nhấp
        const icon = this.querySelector(".button-menu-sider-icon i");

        // Chuyển đổi class 'bi-caret-down-fill' và 'bi-caret-up-fill' trên phần tử 'icon'
        icon.classList.toggle('bi-caret-down-fill');
        icon.classList.toggle('bi-caret-up-fill');

        // Truy vấn để lấy phần tử '.children-menu-sider' gần nhất và chuyển đổi class 'hidden' trên nó
        const buttonChildrenMenuSider = this.closest(".menu-menu").querySelector(".children-menu-sider");
        buttonChildrenMenuSider.classList.toggle('hidden');
    });
});



// [Đoạn này có tác dụng làm cho menu đang được chọn hiển thị màu định nghĩa]
// Lấy đường dẫn hiện tại từ window.location.pathname
let pathName = window.location.pathname;

// Tách đường dẫn thành mảng các phần tử, loại bỏ các phần tử không cần thiết (index <= 1)
pathName = pathName.split('/').filter((item, index) => index > 1);

// Truy vấn DOM để lấy phần tử li đầu tiên trong .nav-slider
const liActiveSlider = document.querySelector('.box-slider-content .nav-slider li');

// Định nghĩa activeButton bên ngoài các khối if-else để tránh lặp lại
let activeButton;

// Nếu đường dẫn không có phần tử nào (trang chủ), đặt activeButton là phần tử có key='admin'
if (pathName.length === 0) {
    activeButton = document.querySelector(`.box-slider-content .nav-slider [key='admin']`);
}
else {
    // Nếu không, đặt activeButton là phần tử có key tương ứng với phần tử đầu tiên trong đường dẫn
    activeButton = document.querySelector(`.box-slider-content .nav-slider [key='${pathName[0]}']`);

    // Nếu đường dẫn có 2 phần tử, thêm class 'active' cho phần tử con tương ứng trong menu
    if (pathName.length === 2) {
        const childrenMenu = activeButton.querySelector(`.children-menu-sider`);

        const keyChrenMenu = childrenMenu.querySelector(`[key='${pathName[1]}']`);
        keyChrenMenu.classList.add('active');
    }
}

// Loại bỏ class 'active-menu-sider' khỏi liActiveSlider và thêm vào activeButton
// Điều này được thực hiện bên ngoài các khối if-else để tránh lặp lại
liActiveSlider.classList.remove('active-menu-sider');
activeButton.classList.add('active-menu-sider');





const iconArrow = document.querySelector('.box-icon-arrow');
const icon = iconArrow.querySelector('i');
const sliderCheck = localStorage.getItem('sliderCheck');
if (sliderCheck === 'true') {
    icon.classList.remove('bi-arrow-left-circle-fill');
    icon.classList.add('bi-arrow-right-circle-fill');
    document.querySelector('.box-witdh-slider').classList.add('active-size-slider');
}

iconArrow.addEventListener('click', function () {
    // Kiểm tra nếu phần tử 'i' có class 'bi-arrow-left-circle-fill'
    if (icon.classList.contains('bi-arrow-left-circle-fill')) {
        localStorage.setItem('sliderCheck', 'true');
        // Nếu có, thay thế nó bằng 'bi-arrow-right-circle-fill'
        icon.classList.remove('bi-arrow-left-circle-fill');
        icon.classList.add('bi-arrow-right-circle-fill');
    } else {
        localStorage.setItem('sliderCheck', 'false');
        // Nếu không, thay thế 'bi-arrow-right-circle-fill' bằng 'bi-arrow-left-circle-fill'
        icon.classList.remove('bi-arrow-right-circle-fill');
        icon.classList.add('bi-arrow-left-circle-fill');
    }
    // Chuyển đổi class 'active-size-slider' trên phần tử '.box-witdh-slider'
    document.querySelector('.box-witdh-slider').classList.toggle('active-size-slider');
});
