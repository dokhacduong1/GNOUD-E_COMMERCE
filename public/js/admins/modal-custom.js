

    const closeModel = document.querySelector(".close-modal");
    const btnClose = document.querySelector(".btn-close");
    const modalCustom = document.querySelector(".modal-custom");
    if(closeModel && btnClose && modalCustom){
        closeModel.addEventListener("click", function(){
            
            modalCustom.classList.add("hidden");
        });
        btnClose.addEventListener("click", function(){
            modalCustom.classList.add("hidden");
        });
    }
