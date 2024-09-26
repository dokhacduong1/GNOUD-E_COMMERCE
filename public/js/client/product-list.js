//Mở modal xem thêm màu sắc
const listColorDemp = document.querySelectorAll('.list-products .lists-color-demo');
if (listColorDemp.length > 0) {
    listColorDemp.forEach((colorDemo) => {

        const listColorClick = colorDemo.querySelector('.list-color-click');
        listColorClick.addEventListener('click', () => {

            const showModal = colorDemo.querySelector('.modal-custom');
            if (showModal) {
                showModal.classList.toggle('hidden');
            }
        });
    });
}

//Sử lý nút add to cart