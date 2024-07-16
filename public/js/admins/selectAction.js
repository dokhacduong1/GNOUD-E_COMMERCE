const formSelectAction = document.querySelector("[select-options]")
if (formSelectAction) {
    const checkBoxMulti = document.querySelector("[checkbox-multi]");
    formSelectAction.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked");
        const inputValue = formSelectAction.querySelector("input[name='ids']")
        //Lấy ra các id đã chọn
        const typeChange = e.target.elements[0].value;
        if (typeChange === "delete-all" && !confirm("Bạn Có Muốn Xóa Những Sản Phẩm Này ?")) return;
        //Array from là chuyển đổi các phần html sang một mảng
        const ids = Array.from(inputChecked).map(input => {
            const id = input.value
            return id
        });
        if (ids.length > 0) {
            inputValue.value = ids
            formSelectAction.submit()
            return
        }
        alert("Please Select Item To Change!")
    })
}