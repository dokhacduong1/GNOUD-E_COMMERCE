const searchItemBox = document.querySelector(".search-item-box input");
//Bắt sự kiện khi người dùng ấn enter
searchItemBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const searchItem = e.target.value;
        const url = new URL(window.location.href);
        url.searchParams.set("keyword", searchItem);
        window.location.href = url;
    }
});
