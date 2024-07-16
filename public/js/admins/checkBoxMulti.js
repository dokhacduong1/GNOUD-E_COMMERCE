function CheckBoxMulti() {
    const checkBoxMulti = document.querySelector("[checkbox-multi]");
  
    if (checkBoxMulti) {
        const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']");
        const inputsId = checkBoxMulti.querySelectorAll("input[name='id'")
        //Đoạn này là check all
        inputCheckAll.addEventListener("click", () => {
          
            inputsId.forEach(input => {
                input.checked = inputCheckAll.checked
            })
        })

        //Đoạn này là check rời
        inputsId.forEach(input => {
            input.addEventListener("click", () => {
                const countChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length;
                inputCheckAll.checked = countChecked === inputsId.length
            })
        })
    }
}
CheckBoxMulti()