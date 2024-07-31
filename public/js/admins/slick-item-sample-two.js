// Lấy danh sách tất cả các phần tử có class "item-color" nằm trong phần tử có class "slick-item"
const slickItemListColor = document.querySelectorAll(".slick-item .item-color");

// Kiểm tra nếu danh sách slickItemListColor có phần tử
if (slickItemListColor.length > 0) {
    // Duyệt qua từng phần tử trong danh sách slickItemListColor
    slickItemListColor.forEach((item) => {
        // Thêm sự kiện click cho từng phần tử
        item.addEventListener("click", function () {

            // Khi một phần tử được click, xóa class "active-outline" khỏi tất cả các phần tử trong danh sách slickItemListColor
            this.closest(".items-color").querySelectorAll(".item-color img").forEach((img) => {
                img.classList.remove("active-outline");
            })

            // Lấy giá trị thuộc tính "link-img" của phần tử được click
            const srcImage = this.getAttribute("link-img");

            // Tìm phần tử img để cập nhật src
            const imgActive = this.closest(".slick-box").querySelector(".slick-item__img-index img");

            // Cập nhật src cho phần tử img
            imgActive.src = srcImage;

            // Thêm class "active-outline" vào phần tử img của phần tử được click
            this.querySelector("img").classList.add("active-outline");
            const scriptTag = this.querySelector(".list-options")

            const dataOption = JSON.parse(scriptTag.innerHTML).map((item) => {
                return `
                <div class="flex flex-row border-b justify-between">
                    <div class="size text-center basis-1/2 border-r py-3">${item.size}</div>
                    <div class="stock text-center basis-1/2 py-3" style=${item.stock == 0 ? 'color:red' : ''}>${item.stock}</div>
                </div>
              `
            }).join("");

            const showOptions = this.closest(".product-item").querySelector(".show-options-info");
  
            showOptions.innerHTML = dataOption;

        })
    })
}