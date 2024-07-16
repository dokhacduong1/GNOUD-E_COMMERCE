function ShowAlert() {
    const showAlert = document.querySelector("[show-alert]");
    if (showAlert) {
        const closeAlert = showAlert.querySelector("[close-alert]");
        const time = parseInt(showAlert.getAttribute("data-time"));

        closeAlert.addEventListener("click", () => {
            showAlert.classList.add("alert-hidden")
        })

        setTimeout(() => {
            showAlert.classList.add("alert-hidden")
        }, time)
    }
}
ShowAlert()