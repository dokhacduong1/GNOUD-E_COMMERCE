// Phân Trang
function Pagination() {
    const url = new URL(window.location.href);
    // Đoạn này thao tác cho người dùng nhấn next hoặc chuyển trang gì đó
    const buttonPagination = document.querySelectorAll("[button-pagination]");
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            if (page) {
                window.location.href = `${url.origin}${url.pathname}?page=${page}`;
            }
        });
    });
}
// End
Pagination();