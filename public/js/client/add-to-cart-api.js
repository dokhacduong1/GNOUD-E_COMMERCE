const buttonAddToCartq = document.querySelector('.btn-add-to-cart');
const cartCount = document.querySelector('.header .inner-text-cart-count');
const modalCartProduct = document.querySelector('.modal-cart-product');
const modalInnerMasterCartCategories = document.querySelector('.modal-add-to-cart');

if (buttonAddToCartq) {
    buttonAddToCartq.addEventListener('click', async function () {
        const infoProduct = this.closest('.info-product');
        const idProduct = infoProduct?.getAttribute('id-product');
        const colorItem = infoProduct?.querySelector('.product-option-color .color-item.active-outline-detail') ||
                          infoProduct?.querySelector('.product-option-color .color-item.size-select');
        const idColor = colorItem?.getAttribute('id-color');
        const idSize = infoProduct?.querySelector('.product-option-size .item-size.size-select')?.getAttribute('id-size');
        const quantity = parseInt(infoProduct?.querySelector('.product-count .input-count-product')?.value) || 0;

        // Validate input data
        if (!idProduct || !idColor || !idSize || quantity <= 0) {
            alertWeb('無効なデータです。');
            return;
        }

        const objectRecord = {
            Product_ID: idProduct,
            Product_Option_ID: idColor,
            SizeProduct: idSize,
            Quantity: quantity,
        };

        try {
            turnOnLoading();
            const response = await fetch(`/api/v1/client/carts/add-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objectRecord),
            });

            const data = await response.json();

            if (data.code === 200) {
                modalInnerMasterCartCategories?.querySelector('.modal-custom')?.classList.toggle('hidden');
                modalCartProduct?.closest('.modal-custom')?.classList.toggle('hidden');
                cartCount.textContent = data.quantity_cart > 99 ? "99+" : data.quantity_cart.toString();
            }

            else if(data.code === 401) {
                //Tôi muốn nó về trang login
                alertWeb('ログインしてください。');
                setTimeout(() => {
                    const currentURL = window.location.pathname;

                    window.location.href = `/login?redirect=${currentURL}`;
                }, 1000);
            }
            else {
                alertWeb(data.message);
            }
            turnOffLoading();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    });
}