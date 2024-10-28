// Lấy tất cả các phần tử có class là 'product-count'
const productCounts = document.querySelectorAll('.product-count');

// Lấy phần tử có class là 'input-count-product'
const inputElement = document.querySelector('.input-count-product');

// Lấy giá trị min từ thuộc tính min của inputElement và chuyển thành số nguyên
const minInput = 1;


// Lấy giá trị max từ thuộc tính max của inputElement và chuyển thành số nguyên
const maxInput = parseInt(document.querySelector('.list-products').getAttribute('maxCountCart') ?? 30);

// Hàm cập nhật giá trị mới cho inputElement và tất cả các input trong productCounts
function updateValue(valueNew) {
    productCounts.forEach(pc => {
        const inputCurrent = pc.querySelector('input');
        inputElement.value = valueNew;
        inputCurrent.value = valueNew;
    });
}

// Hàm xử lý sự kiện click cho nút tăng
function handleIncrementClick() {
    let valueNew = parseInt(inputElement.value) + 1;
    if (valueNew > maxInput) valueNew = maxInput;
    updateValue(valueNew);
    updateButtonState(valueNew);
}

// Hàm xử lý sự kiện click cho nút giảm
function handleDecrementClick() {
    let valueNew = parseInt(inputElement.value) - 1;
    if (valueNew < minInput) valueNew = minInput;
    updateValue(valueNew);
    updateButtonState(valueNew);
}

// Hàm xử lý sự kiện thay đổi giá trị của input
function handleInputChange() {
    let valueNew = parseInt(this.value);
    if (valueNew < minInput) valueNew = minInput;
    if (valueNew > maxInput) valueNew = maxInput;
    if (isNaN(valueNew)) valueNew = 0;
    updateValue(valueNew);
    updateButtonState(valueNew);
}

// Hàm cập nhật trạng thái của nút tăng và giảm
function updateButtonState(value) {
    productCounts.forEach(pc => {
        const incrementButton = pc.querySelector('button:last-child');
        const decrementButton = pc.querySelector('button:first-child');
        incrementButton.classList.toggle('button-no-active-count', value >= maxInput);
        incrementButton.classList.toggle('button-active-count', value < maxInput);
        decrementButton.classList.toggle('button-no-active-count', value <= minInput);
        decrementButton.classList.toggle('button-active-count', value > minInput);
    });
}

// Nếu có ít nhất một phần tử 'product-count', thì thêm sự kiện cho các nút và input
if (productCounts.length > 0) {
    productCounts.forEach(productCount => {
        const decrementButton = productCount.querySelector('button:first-child');
        const incrementButton = productCount.querySelector('button:last-child');
        const inputCurrent = productCount.querySelector('input');

        incrementButton.addEventListener('click', handleIncrementClick);
        decrementButton.addEventListener('click', handleDecrementClick);
        inputCurrent.addEventListener('input', handleInputChange);
    });
}