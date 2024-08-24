function getFormObject(form) {
  return Array.from(new FormData(form).entries()).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
}

function getOptions() {
  return Array.from(document.querySelectorAll(".option-product")).map(boxOption => {
    const idOption = boxOption.getAttribute("id-option");



   
    const titleOption = boxOption.querySelector("#title-option")?.value;
    if (!titleOption) {
      alert("Please enter title option");
      return null;
    }
    
    const colorCheck = boxOption.querySelector(".color-check .dropzone");
    const listImageCheck = boxOption.querySelector(".list-image-check .dropzone");
 
    const record = {
      id: idOption,
      title: titleOption,
      color: dropzones[colorCheck.getAttribute("id")].files.map(file => ({image: file.dataURL,id:file.ID})),
      listImages: dropzones[listImageCheck.getAttribute("id")].files.map(file => ({image: file.dataURL,id:file.ID})),
    };
  

    const switchInput = boxOption.querySelector(".what-size-check .switch input");
    if (switchInput.checked) {
      record.listOptions = Array.from(boxOption.querySelectorAll("[name='size']"))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => ({
          size: checkbox.value,
          stock: parseInt(boxOption.querySelector(`input[sizeColor='${checkbox.id}']`).value)
        }));
    } else {
      record.stock = parseInt(boxOption.querySelector("#stock")?.value) || 0;
    }

    return record;
  }).filter(record => record !== null);
}

function getDimensionsOptions() {
  const optionsDimensionsTitle = document.querySelectorAll('.dimension-product .title_dimension input');
  const dimensionCheck = document.querySelectorAll('.dimension-product .dimension-check');
  if (document.querySelector(".product-dimensions .switch input").checked) {
    const listTitle = Array.from(optionsDimensionsTitle).map(title => title.value);
    const listOptions = Array.from(dimensionCheck).map(dimension =>
      Array.from(dimension.querySelectorAll('.options-dimension input')).map(input => input.value)
    );
    return {
      listTitle,
      listOptions: listOptions[0].map((_, i) => listOptions.reduce((acc, val) => [...acc, val[i]], []))
    };
  }
  return null;
}
function getDetails() {
  if (document.querySelector(".product-details .switch input").checked) {
    return Array.from(document.querySelectorAll(".item-product-detail")).map(item => {
      const id = item.getAttribute("id-detail");
    
      const key = item.querySelector(".key-detail input").value;
      const value = item.querySelector(".value-detail input").value;
      return {id, key, value };
    });
  }
  return null;
}

function handleSubmitForm(e) {
  e.preventDefault();
  tinymce.triggerSave();
  
  const formObject = getFormObject(e.target);
  formObject.options = getOptions();
  formObject.size_specifications = getDimensionsOptions();
  formObject.product_information = getDetails();
  formObject.list_delete_images = IDoption;
  const pathParts = window.location.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  fetch('/admin/products/edit/'+id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formObject),
  })

 
}

document.querySelector('.create-record').addEventListener('submit', handleSubmitForm);



