const listShoppingGuide = document.querySelectorAll('.shopping-guilde');
listShoppingGuide.forEach((shoppingGuide) => {
    const buttonShow = shoppingGuide.querySelector('.shopping-guilde__button-show');
    const content = shoppingGuide.querySelector('.shopping-guilde__content');
    const buttonCong = shoppingGuide.querySelector('.button-cong');
    const buttonTru = shoppingGuide.querySelector('.button-tru');
    buttonShow.addEventListener('click', () => {
        //Lấy chiều cao của content
        const isContentShown = content.offsetHeight !== 0;
        content.style.height = isContentShown ? '0px' : content.scrollHeight + 'px';
        buttonCong.classList.toggle('hidden');
        buttonTru.classList.toggle('hidden');
    });
});

const buttonShowModelGuide = document.querySelectorAll(".button-show-modal_guide");
if(buttonShowModelGuide.length>0){
    buttonShowModelGuide.forEach((button)=>{
        button.addEventListener('click',function(){
            const modalCustom = this.closest('.shopping-guilde').querySelector(".modal .modal-custom");
            if(modalCustom){
                const srcIframe = modalCustom.getAttribute("data-src");
                const iframeMain = modalCustom.querySelector("iframe");
                iframeMain.src = srcIframe;
                modalCustom.classList.toggle("hidden");

                // Add event listener for close button
                const closeButton = modalCustom.querySelector(".modal-close");
                closeButton.addEventListener('click', function() {
                    modalCustom.classList.add("hidden");
                });

                // Add event listener for modal background
                const modalBackground = modalCustom.querySelector(".fixed.inset-0.transition-opacity");
                modalBackground.addEventListener('click', function() {
                    modalCustom.classList.add("hidden");
                });
            }
        })
    })
}