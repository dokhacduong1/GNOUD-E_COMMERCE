const boxProduct = document.querySelector('.cart-left-products');
const totalPrice = document.querySelector('.cart-right .info-price-all-product .total-price .totalPrice');
const sumAllPrice = document.querySelector('.cart-right .all-product-count .sumAllPrice');
const priceShip = document.querySelector('.cart-right .all-product-count .priceShip');
const countProduct = parseInt(document?.querySelector('.cart')?.getAttribute('maxCountCart')) ?? 30;

function updateDomTotalPrice() {
    const listProduct = boxProduct.querySelectorAll('.product');
    let total = 0;
    listProduct.forEach(product => {
        const sumPrice = product.querySelector('.sumPrice')?.getAttribute('sumprice');
        total += parseInt(sumPrice) || 0;
    });
    const priceShipValue = total < 1500 ? 500 : 0;
    priceShip.textContent = priceShipValue.toLocaleString();
    sumAllPrice.textContent = total.toLocaleString();
    countProduct.textContent = listProduct.length;
    totalPrice.textContent = (total + priceShipValue).toLocaleString();
}

let debounceTimeout;
//Hàm debounce để giảm số lần gọi API
function debounce(func, delay) {
    return function (...args) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(this, args), delay);
    };
}

async function deleteProduct(idProduct,sizeProduct,idColorProduct) {
    try {
        if(idProduct) {
            turnOnLoading();
            const response = await fetch(`/api/v1/client/carts/delete-product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idProduct,sizeProduct,idColorProduct })
            });
            turnOffLoading();
            return await response.json();
        }
        return { code: 400 };
    } catch (error) {
        console.error('Delete faild:', error);
        return { code: 500 };
    }
}
//Hàm cập nhật số lượng sản phẩm trong giỏ hàng
async function updateQuantityProduct(idProduct, quantity,sizeProduct,idColorProduct) {
    try {
        if (quantity > 0 && quantity <= countProduct+1) {
            turnOnLoading();
            const response = await fetch(`/api/v1/client/carts/update-quantity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idProduct, quantity,sizeProduct,idColorProduct })
            });
            turnOffLoading();
            return await response.json();
        }
        return { code: 400 };
    } catch (error) {
        console.error('Error updating product quantity:', error);
        return { code: 500 };
    }
}
//Hàm cập nhật giá sản phẩm trên giao diện
function updateDomPriceProduct(sumPrice, priceOrigin, quantity) {
    const total = parseInt(priceOrigin) * parseInt(quantity);
    sumPrice.textContent = total.toLocaleString();
    sumPrice.setAttribute('sumprice', total);
}
//Hàm xử lý sự kiện khi người dùng thay đổi số lượng sản phẩm
const debouncedUpdateQuantity = debounce(async (idProduct, valueNew, sumPrice, priceOrigin,sizeProduct,idColorProduct,warningCountProduct) => {
    const record = await updateQuantityProduct(idProduct, valueNew,sizeProduct,idColorProduct);
    
    if (record.code === 200) {
        if(valueNew == countProduct) {
            warningCountProduct.style.opacity = '100%';
        }else{
            warningCountProduct.style.opacity = '0';
        }
        updateDomPriceProduct(sumPrice, priceOrigin, valueNew);
        updateDomTotalPrice();
    }else{
        alertWeb(record.message);
    }
}, 300);


//Hàm xử lý sự kiện khi người dùng click vào nút xóa sản phẩm
async function handleDeleteProduct(event) {
    let target = event.target;
    const product = target.closest('.product');
    const idProduct = product.getAttribute('id-product');
    const sizeProduct = product.querySelector('.id-color-and-size-product')?.getAttribute("sizeProduct");
    const idColorProduct = product.querySelector('.id-color-and-size-product')?.getAttribute("colorId");
    const record = await deleteProduct(idProduct,sizeProduct,idColorProduct);
    if(record.code === 200) {
        product.remove();
        updateDomTotalPrice();
        alertWeb('製品は正常に削除されました。');
    }else{
        alertWeb(record.message);
    }
}
//Hàm xử lý sự kiện khi người dùng thay đổi số lượng sản phẩm trong input
async function handleInputChange(event) {
    const product = event.target.closest('.product');
    const idProduct = product.getAttribute('id-product');
    const sumPrice = product.querySelector('.sumPrice');
    const sizeProduct = product.querySelector('.id-color-and-size-product')?.getAttribute("sizeProduct");
    const warningCountProduct = product.querySelector('.text-full-count-warning');
    const idColorProduct = product.querySelector('.id-color-and-size-product')?.getAttribute("colorId");
    const priceOrigin = product.querySelector('.price-origin').getAttribute('priceOrigin') ?? 1;
    let valueNew = parseInt(event.target.value);
    if (isNaN(valueNew) || valueNew < 1) valueNew = 1;
    if (valueNew > countProduct) valueNew = countProduct;
    event.target.value = valueNew;

    debouncedUpdateQuantity(idProduct, valueNew, sumPrice, priceOrigin,sizeProduct,idColorProduct,warningCountProduct);
}
//Hàm xử lý sự kiện khi người dùng click vào nút + hoặc - để thay đổi số lượng sản phẩm
async function handleButtonClick(event) {
    let target = event.target;
    if (target.tagName === 'IMG') {
        target = target.parentElement;
    }

    const product = target.closest('.product');
    const idProduct = product.getAttribute('id-product');
    const warningCountProduct = product.querySelector('.text-full-count-warning');
    const sumPrice = product.querySelector('.sumPrice');
    const priceOrigin = product.querySelector('.price-origin').getAttribute('priceOrigin') ?? 1;
    const inputQuantity = product.querySelector('.quantity-cart');
    const sizeProduct = product.querySelector('.id-color-and-size-product')?.getAttribute("sizeProduct");
    const idColorProduct = product.querySelector('.id-color-and-size-product')?.getAttribute("colorId");
    let currentValue = parseInt(inputQuantity.value);

    if (target.classList.contains('btn-minus') && currentValue > 1) {
        inputQuantity.value = currentValue - 1;
    } else if (target.classList.contains('btn-plus') && currentValue < countProduct) {
        inputQuantity.value = currentValue + 1;
    } else {
        return; // Do not call the API if the quantity is already at its boundary value
    }


    const record = await updateQuantityProduct(idProduct, inputQuantity.value,sizeProduct,idColorProduct);
    
    if (record.code === 200) {
        if(inputQuantity.value == countProduct) {
            warningCountProduct.style.opacity = '100%';
        }else{
            warningCountProduct.style.opacity = '0';
        }
        updateDomPriceProduct(sumPrice, priceOrigin, inputQuantity.value);
        updateDomTotalPrice();
    }else{
        alertWeb(record.message);
    }
}
//Hàm xử lý sự kiện khi người dùng click vào nút xóa sản phẩm
if (boxProduct) {
    boxProduct.addEventListener('click', function (event) {
        if(event.target.classList.contains('btn-delete')) {
            handleDeleteProduct(event);
        }
        if (event.target.classList.contains('btn-plus') || event.target.classList.contains('btn-minus') || event.target.tagName === 'IMG') {
            handleButtonClick(event);
        }
    });

    boxProduct.addEventListener('input', function (event) {
        if (event.target.classList.contains('quantity-cart')) {
            handleInputChange(event);
        }
    });
}


