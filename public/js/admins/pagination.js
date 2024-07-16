function isNumber(str) {
    // Chuyển chuỗi thành số và kiểm tra nếu kết quả là NaN
    return !isNaN(parseFloat(str));
}

const prev = document.querySelector(".pagination-prev");
const next = document.querySelector(".pagination-next");
const pagi = document.querySelector(".pagination");

if (prev && next && pagi) {
    let pageSelect = parseInt(pagi.getAttribute("current"));
    if (isNaN(pageSelect)) {
        pageSelect = 1;
    }

    const url = new URL(window.location.href);
    prev.addEventListener("click", () => {
        if (pageSelect > 1) {
            url.searchParams.set("page", pageSelect - 1);
            window.location.href = url;
        }
    })

    next.addEventListener("click", () => {
        const maxNext = parseInt(next.getAttribute("value"));
        if(pageSelect < maxNext){
            url.searchParams.set("page", pageSelect + 1);
            window.location.href = url;
        }
    })
}