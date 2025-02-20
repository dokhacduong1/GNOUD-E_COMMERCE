const form = document.getElementById('form-profile');

function validateForm(formData) {
    // Kiểm tra email


    // Kiểm tra tên
    if (!formData.fullName || formData.fullName.trim() === "") {
        return "名前を入力してください。";
    }

    // Kiểm tra giới tính
    if (!formData.sex) {
        return "性別を選択してください。";
    }

    // Kiểm tra ngày, tháng, năm
    const day = parseInt(formData.day, 10);
    const month = parseInt(formData.month, 10);
    const year = parseInt(formData.year, 10);

    if (!day || day < 1 || day > 31) {
        return "無効な日付です。";
    }
    if (!month || month < 1 || month > 12) {
        return "無効な月です。";
    }
    if (!year || year < 1900 || year > new Date().getFullYear()) {
        return "無効な年です。";
    }

    // Nếu tất cả các trường hợp trên đều hợp lệ, trả về null
    return null;
}

function readImageAsBase64(fileInput) {
    return new Promise((resolve, reject) => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();

            // Khi file được đọc thành công
            reader.onload = function (e) {
                resolve(e.target.result); // Trả về chuỗi Base64
            };

            // Xử lý lỗi khi đọc file
            reader.onerror = function () {
                reject("画像を読み込む際にエラーが発生しました。");
            };

            reader.readAsDataURL(file); // Đọc file dưới dạng URL Base64
        } else {
            resolve(null); // Không có file được chọn
        }
    });
}

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Ngăn gửi form để xử lý bằng JavaScript
    turnOnLoading();
    // Lấy dữ liệu form dưới dạng object
    const formData = getFormObject(form);

    const validationError = validateForm(formData);
    if (validationError) {
        alertWeb(validationError); // Hiển thị thông báo lỗi
        turnOffLoading();
        return;
    }

    const fileInput = document.getElementById('fileInput');
    try {
        const base64Image = await readImageAsBase64(fileInput);
        if (base64Image) {
            formData.image = base64Image; // Gán chuỗi Base64 vào formData
        }

        // Kiểm tra và ghép ngày, tháng, năm thành định dạng `YYYY-MM-DD`
        const year = formData.year.trim();
        const month = formData.month.trim().padStart(2, '0'); // Thêm số 0 nếu tháng < 10
        const day = formData.day.trim().padStart(2, '0'); // Thêm số 0 nếu ngày < 10
        const birthday = `${year}-${month}-${day}`; // Ghép thành định dạng `YYYY-MM-DD`
        formData.birthday = birthday; // Gán vào formData


        // // Gửi dữ liệu lên server
        const response = await fetch('/my_page/edit-profile', {
            method: 'PATCH',
            credentials: 'include', // Đính kèm cookie vào request
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if(result.code===200){
            alertWeb("プロフィールが更新されました。");
        }else{
            alertWeb("エラーが発生しました。");
        }
        turnOffLoading();
        // Xử lý kết quả từ server (nếu cần)
    } catch (error) {
        alertWeb(error); // Hiển thị lỗi nếu có
    }
});
