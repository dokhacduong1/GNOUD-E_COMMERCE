function alertWeb(content = "") {
    const alertElement = document.querySelector('.alert-client');
    if (alertElement) {
        const boxInnerText = alertElement.querySelector('.inner-text-alert');
        boxInnerText.textContent = content;

        // Hiển thị thông báo với hiệu ứng mờ dần vào
        alertElement.style.opacity = '1';
        alertElement.style.display = 'block';

        // Ẩn sau 5 giây với hiệu ứng mờ dần ra
        setTimeout(() => {
            alertElement.style.opacity = '0';
            setTimeout(() => {
                alertElement.style.display = 'none';
            }, 500); // Thời gian khớp với `transition-duration`
        }, 5000);
    }
}
