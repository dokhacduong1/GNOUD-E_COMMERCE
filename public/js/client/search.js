let timeoutId = null;
const debounceTime = 500; // Thời gian debounce là 500ms
async function searchProduct(keyword = "", idCategory = "0") {
    const response = await fetch(`/api/v1/client/search/general/preview?keyword=${keyword}&idCategory=${idCategory}`);
    const result = await response.json();
    if(result.code === 200){
        return result.data;
    }
    return [];
}

const seacrhMenu = document.querySelector('.search-menu');
if(seacrhMenu){
    const searchBox = seacrhMenu.querySelector('.search-box');
  
    searchBox.addEventListener('input', function(e) {
      
        // Xóa timeout cũ nếu có
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Thiết lập timeout mới để gọi API sau khi người dùng dừng nhập
        timeoutId = setTimeout(async () => {
            const idCategory = searchBox.getAttribute('id-main-category');
            // Gọi API ở đây
            const dataApi =  await searchProduct(e.target.value,idCategory);
           console.log(dataApi);
      
        }, debounceTime);
    });
}