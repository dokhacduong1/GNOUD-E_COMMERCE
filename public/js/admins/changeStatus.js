const buttonChangeStatus = document.querySelectorAll('[change-status]');
let prefix_link = document.querySelector('[prefix-status').getAttribute('prefix-status');


//// [PATCH] /admins/categories/change-status/:status/:id
if (prefix_link && buttonChangeStatus.length > 0) {
    buttonChangeStatus.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('change-status');
            const status = button.getAttribute('status') === "active" ? "inactive" : "active";
       
            prefix_link = prefix_link + status + "/" + id;
            fetch(prefix_link, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        window.location.reload();
                    }
                })

        })
    })
}