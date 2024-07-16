const buttonPreview = document.querySelector('[preview]');

if (buttonPreview) {
    buttonPreview.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.querySelector('.button-delete-image').classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    });
}

const buttonClose = document.querySelector('.button-delete-image');
if(buttonClose){
    buttonClose.addEventListener('click', (e) => {
        document.getElementById('imagePreview').src = '/images/no-image.png';
        document.querySelector('.button-delete-image').classList.add('hidden');
        document.querySelector('[preview]').value = '';
    });
}
