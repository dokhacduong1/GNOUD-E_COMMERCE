// Lấy danh sách tất cả các phần tử có class "item-color" nằm trong phần tử có class "slick-item"
const slickItemListColor = document.querySelectorAll(".slick-item .item-color");

// Kiểm tra nếu danh sách slickItemListColor có phần tử
if(slickItemListColor.length > 0){
    // Duyệt qua từng phần tử trong danh sách slickItemListColor
    slickItemListColor.forEach((item) => {
        // Thêm sự kiện click cho từng phần tử
        item.addEventListener("click", function(){
           
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
        })
    })
}