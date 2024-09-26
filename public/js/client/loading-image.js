document.addEventListener("DOMContentLoaded", function () {
    const imgs = document.querySelectorAll(".loading-image");

    imgs.forEach(img => {
        const loader = img.parentElement.querySelector(".loader");
        loader.style.display = "block"; // Hiển thị loader trước khi ảnh tải

        img.addEventListener("load", function () {
          
            loader.style.display = "none";
            img.style.display = "block";
        });

       

        // Đảm bảo rằng sự kiện được kích hoạt
        if (img.complete) {
            img.dispatchEvent(new Event('load'));
        }
    });
});
