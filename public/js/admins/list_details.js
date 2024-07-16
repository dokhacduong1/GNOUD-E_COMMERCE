function toggleProductDetails() {
    const list_product_details = document.querySelector(".list-product-details");
    list_product_details.classList.toggle("hidden");
    window.scrollTo(0, document.body.scrollHeight);
}

function addColDetail() {
    console.log("addColDetail");
    const item_product_details = document.querySelector(".item-product-details");
    const customDiv = `
        <div class="basis-1/2 relative key-detail border-b border-[#d7d8d9]">
            <input
                class="text-main-200 bg-[#f1f0f0] outline-none p-3 w-full mb-2 h-full"
                type="text"
            />
        </div>
        <div class="border-r border-t  basis-1/2 relative value-detail">
            <input class="bg-white outline-none p-3 w-full h-full" type="text" />
        </div>
        <div
        class="delete-product-details absolute top-0 h-full flex justify-center items-center -right-8 cursor-pointer"
        >
            <i class="fa-solid fa-trash-alt text-2xl"></i>
        </div>

  `
    const div = document.createElement("div");
    div.classList.add("flex", "flex-row", "relative","item-product-detail");
    div.innerHTML = customDiv;
    item_product_details.appendChild(div);
    div.querySelector(".delete-product-details").addEventListener("click", function () {
        div.remove();
    });
    window.scrollTo(0, document.body.scrollHeight);
}


document.querySelector(".product-details .switch input")?.addEventListener("change", toggleProductDetails);
document.querySelector(".product-details .add-col-details")?.addEventListener("click", addColDetail);