
const selectRow = document.querySelector('.select-row');

// Kiểm tra xem phần tử có tồn tại không
if (selectRow) {
    // Lấy tất cả các phần tử con có thuộc tính 'key'
    const buttonKey = selectRow.querySelectorAll('[key]');

    // Kiểm tra xem có phần tử con nào không
    if (buttonKey.length > 0) {
        // Duyệt qua từng phần tử con
        buttonKey.forEach((button) => {
            // Thêm sự kiện click cho mỗi phần tử
            button.addEventListener('click', () => {
                // Lấy giá trị của thuộc tính 'key'
                const key = button.getAttribute('key');

                // Tạo một URL mới từ URL hiện tại
                const url = new URL(window.location.href);

                // Đặt giá trị của tham số 'status' trong URL bằng giá trị của 'key'
                url.searchParams.set('status', key);

                // Điều hướng trình duyệt đến URL mới
                window.location.href = url;
            });
        })
    }
}