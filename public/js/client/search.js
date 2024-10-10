let timeoutId = null;
const debounceTime = 500; // Thời gian debounce là 500ms

async function searchProduct(keyword = "", idCategory = "0") {
    const response = await fetch(`/api/v1/client/search/general/preview?keyword=${keyword}&idCategory=${idCategory}`);
    const result = await response.json();
    return result.code === 200 ? result.data : [];
}

const seacrhMenu = document.querySelector('.search-menu');
const htmlEmpty = `<li class="p-[2rem_1.5rem] transition-all list-empty text-center"><div class="block text-[#00000073]   text-[1.4rem] " href="#">データがありません</div></li>`

if (seacrhMenu) {
    const itemsCategorySearch = seacrhMenu.querySelector('.items-category-search');
    const itemsProductSearch = seacrhMenu.querySelector('.items-product-search');
    const boxSearchOverlay = seacrhMenu.querySelector('.box-search-overlay');
    const searchBox = seacrhMenu.querySelector('.search-box');

    if (itemsCategorySearch && itemsProductSearch && boxSearchOverlay && searchBox) {
        searchBox.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const idCategory = searchBox.getAttribute('id-main-category');
                const keyword = e.target.value || "";
                window.location.href = `/search/GD${idCategory}?keyword=${keyword}`;
            }
        });
        searchBox.addEventListener('input', function (e) {
            boxSearchOverlay.classList.remove('hidden');
            if (timeoutId) clearTimeout(timeoutId);

            timeoutId = setTimeout(async () => {
                const idCategory = searchBox.getAttribute('id-main-category');
                if (!e.target.value) return;
                const dataApi = await searchProduct(e.target.value, idCategory);
                if (Object.keys(dataApi).length > 0) {
                    itemsCategorySearch.innerHTML = dataApi.listCategories.length > 0 ? 
                        dataApi.listCategories.map(category => `
                            <li class="p-[2rem_1.5rem] hover:bg-[#f2f2f2] cursor-pointer transition-all">
                                <a class="hover:text-main block text-main-400 mt-[0.7rem] text-[1.4rem] font-semibold" href="/category/GD${category.ID}">${category.Title}</a>
                            </li>
                        `).join('') : htmlEmpty;

                    itemsProductSearch.innerHTML = dataApi.products.length > 0 ? 
                        dataApi.products.map(product => `
                            <li class="p-[2rem_1.5rem] hover:bg-[#f2f2f2] cursor-pointer transition-all">
                                <a class="item-product"  href="/product/${product.Slug}">
                                    <div class="flex flex-row items-center gap-[1.5rem] text-[1.4rem]">
                                        <div class="item-product-img lg:basis-2/12 basis-3/12">
                                            <img class="size-[6rem] object-cover" src="${product.image}" alt="product" />
                                        </div>
                                        <div class="lg:basis-10/12 basis-9/12 item-product-title text-[1.4rem] text-main-400 ml-[1rem]">${product.Title}</div>
                                    </div>
                                </a>
                            </li>
                        `).join('') : htmlEmpty;
                }
            }, debounceTime);
        });
    }
}