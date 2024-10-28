const buttonAddToCartq = document.querySelector('.btn-add-to-cart');
const cartCount = document.querySelector('.header .inner-text-cart-count');
if (buttonAddToCartq) {
    buttonAddToCartq.addEventListener('click', async function () {
        const infoProduct = this.closest('.info-product');


        const idProduct = infoProduct.getAttribute('id-product') || null;

        const colorItem = infoProduct.querySelector('.product-option-color .color-item.active-outline-detail') ||
            infoProduct.querySelector('.product-option-color .color-item.size-select');
        const idColor = colorItem ? colorItem.getAttribute('id-color') : null;

        const idSize = infoProduct.querySelector('.product-option-size .item-size.size-select')?.getAttribute('id-size') || null;

        const quantity = infoProduct.querySelector('.product-count .input-count-product').value || null;
        // Kiểm tra dữ liệu đầu vào
        if (!idProduct || !quantity || isNaN(quantity) || parseInt(quantity) <= 0 || !idColor ) {

            alertWeb('無効なデータです。');
            return;
        }
        if(!idSize){
            alertWeb('製品サイズを選択してください。');
            return;
        }
        const objectRecord = {
            Product_ID: idProduct,
            Product_Option_ID: idColor,
            SizeProduct: idSize,
            Quantity: parseInt(quantity),
        };
        const response = await fetch(`/api/v1/client/carts/add-cart`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objectRecord),
        });
        const data = await response.json();
        if(data.code === 200){
            //Api sẽ trả về số lượng sản phẩm trong giỏ hàng khi chưa thêm sản phẩm vào giỏ hàng lên phải +1
            cartCount.textContent = data.quantity_cart+1;
        }else{
            alertWeb(data.message);
        }
  
    });
}