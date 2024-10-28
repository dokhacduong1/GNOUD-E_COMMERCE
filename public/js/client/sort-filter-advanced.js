

const boxFilterClient = document.querySelector('.box-filter-client');
// Đoạn này mở modal
const buttonFilter = document.querySelector('.filter-button .button-filter');
const modalFilter = document.querySelector('.filter-button-advanced .filter-button .modal-custom');
const modalShortedCategory = document.querySelector('.remodal-overlay-category');
const listIdCategoryProduct = document.querySelector('.category-full')?.getAttribute('listProductId');
//Tôi muốn đổi hàm này xíu là nếu nó vào hàm này nó sẽ dữ nguyên keyword và page còn các tham số khác sẽ bị xóa
function redirectToSortedUrl(query, key) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set(query, key);
    currentUrl.searchParams.set('listIdProduct', listIdCategoryProduct);

    window.location.assign(currentUrl.toString());
}
// Hàm để chuyển hướng đến URL với các tham số đã sắp xếp và giới hạn
function redirectToSortLimitUrl(params) {
    // Tạo một đối tượng URL từ URL hiện tại của cửa sổ
    const currentUrl = new URL(window.location.href);
    const page = new URL(window.location.href).searchParams.get('page');
    const sort = new URL(window.location.href).searchParams.get('sort');
    const keyword = new URL(window.location.href).searchParams.get('keyword');
    params['keyword'] = keyword || ''; // Nếu không có tham số keywords, mặc định là ''
    params['page'] = page || '1'; // Nếu không có tham số page, mặc định là '1'
    params['sort'] = sort || ''; // Nếu không có tham số sort, mặc định là 'id'
    params['listIdProduct'] = listIdCategoryProduct;
    // Lấy tất cả các tham số từ URL hiện tại
    const urlParams = new Set([...currentUrl.searchParams.keys()]);

    // Xóa các tham số không có trong `params` khỏi URL
    for (let param of urlParams) {
        // Nếu tham số không có trong `params`, xóa nó
        if (!(param in params)) {
            currentUrl.searchParams.delete(param);
        }
    }

    // Thêm các tham số mới từ `params` vào URL
    Object.entries(params).forEach(([key, values]) => {
        // Nếu có giá trị cho tham số
        if (values.length > 0 && Array.isArray(values)) {
            // Xóa tất cả các giá trị hiện tại của tham số từ URL
            currentUrl.searchParams.delete(key);

            // Thêm từng giá trị mới vào tham số trong URL
            for (let value of values) {

                currentUrl.searchParams.append(key, value);
            }
        } else {
            currentUrl.searchParams.set(key, values.toString());
        }
    })
    console.log(currentUrl.toString());
    // Chuyển hướng đến URL mới
    window.location.assign(currentUrl.toString());
}

//Đoạn này cho khi ấn button sort thì hiện ra list sort và hiện ra khung thu gọn gợi ý category
if (boxFilterClient) {
    const buttonSort = boxFilterClient.querySelector('.sort-button button');
    const listSort = boxFilterClient.querySelector('.list-sort');
    const buttonShortCategory = boxFilterClient.querySelector('.button-shorted-category');
   
    if (buttonSort && listSort) {

        buttonSort.addEventListener('click', () => {
            listSort.classList.toggle('hidden');
            buttonSort.classList.toggle('SortButton_sortButton');
        });

        const listSortItems = listSort.querySelectorAll('.sort-item');
        listSortItems.forEach(item => {
            item.addEventListener('click', () => {
                const key = item.getAttribute('key');

                redirectToSortedUrl('sort', key);
            });
        });
    }
    if(buttonShortCategory){
        buttonShortCategory.addEventListener('click', () => {
          
            modalShortedCategory.classList.remove('hidden');
        });
    }
}






//Đoạn này cho khi ấn button filter thì hiện ra modal
buttonFilter?.addEventListener('click', () => {
    modalFilter?.classList?.toggle('hidden');
});


//Đoạn này cho khi ấn button filter thì hiện ra list filter sổ xuống
const buttonClickAccordionFilter = document.querySelectorAll('.accordion-filter');
if (buttonClickAccordionFilter.length > 0) {
    buttonClickAccordionFilter.forEach(button => {
        const buttonClick = button.querySelector('button');
        buttonClick.addEventListener('click', () => {
            const boxContent = button.querySelector('.filter-content-select');
            boxContent.style.height = boxContent.classList.toggle('action') ? `${boxContent.scrollHeight + 20}px` : '0px';
            button.querySelectorAll('img').forEach(img => {
                img.classList.toggle('hidden');
            });
        });
    });
}

const buttonSubmitFilters = document.querySelectorAll('.filter-advanced .button-submit-form');
const alertModal = document.querySelector(".filter-advanced .box-alert");
const contentAlert = alertModal.querySelector("p");


function alertModalCustom(content) {
    contentAlert.innerText = content;
    alertModal.style.height = alertModal.scrollHeight + 'px';
    setTimeout(() => {
        alertModal.style.height = '0px';
    }, 3000);
}
if (buttonSubmitFilters.length > 0) {
    buttonSubmitFilters.forEach(buttonSubmitFilter => {

        buttonSubmitFilter.addEventListener('click', function(){
            console.log('click');
            const filyerAdvanced = this.closest(".filter-advanced");
            const checkBoxFilter = filyerAdvanced.querySelectorAll('.checkbox_input_form[type="checkbox"]:checked');

            const priceMin = parseInt(filyerAdvanced.querySelector(".input-price-min").value);
            const priceMax = parseInt(filyerAdvanced.querySelector(".input-price-max").value);
            if (priceMin > priceMax) {
                alertModalCustom("エントリー価格が無効です。再入力してください!")
                return;
            }
            const params = {}
            params['priceMin'] = priceMin.toString();
            params['priceMax'] = priceMax.toString();

            checkBoxFilter.forEach(checkBox => {
                const key = checkBox.getAttribute('query');
                const value = checkBox.getAttribute('item-query');
                if (params[key]) {
                    params[key].push(value);
                }
                else {
                    params[key] = [value];

                }

            })

            if (Object.keys(params).length > 0) {
                redirectToSortLimitUrl(params)
            }

        });
    })

}


//Đoạn này thu hẹp phạm vi category
