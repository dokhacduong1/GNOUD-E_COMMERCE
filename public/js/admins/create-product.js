const addOptions = document.querySelector(".add-options");
const optionsProduct = document.querySelector(".options-product");
function convertToSlug(Text) {
  return `${Text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")}-${new Date().getTime()}`;
}
addOptions.addEventListener("click", function (e) {
  const newOption = document.createElement("div");
  var nameClass = "option-" + Math.random().toString(36).substring(7);
  var nameClass2 = "option-" + Math.random().toString(36).substring(7);
  const divCustom = `
  <div class="border border-main-50 rounded-lg p-5 mb-4 option-product relative">
  <div class="form-group pb-5">
    <label
      class="block text-xl font-semibold mb-2 text-main-300"
      for="title-option"
      >Name Color</label
    >
    <input
      class="form-control w-full py-3 outline-none bg-[#f2f2f2] rounded-lg px-5"
      id="title-option"
      name="title-option"
      type="text"
      placeholder="Enter name color"
    />
  </div>
  <div class="form-group pb-5 color-check">
    <label class="block text-xl font-semibold mb-2 text-main-300" for="color"
      >Color Product</label
    >
    <style>
      .dropzone-${nameClass} .dz-preview .dz-image {
      width: 120px;
      height: 120px;
      }
      .dropzone-${nameClass} .dz-preview .dz-image {
      width: auto !important;
      height: auto !important;
      max-width: 120px;
      max-height: 120px;
      }
      .dropzone-${nameClass} .dz-preview .dz-image {
      width: 100%;
      height: 100%;
      }
    </style>
    <div class="my-3">
      <div
        class="dropzone dropzone-${nameClass} flex-wrap border-none flex flex-row items-center p-0 min-h-0"
        action="/admin/upload/multi-image"
        id="${nameClass}"
        method="POST"
        enctype="multipart/form-data"
      >
        <div
          class="mr-[1rem] bg-main text-white px-7 py-5 rounded-lg inline-block cursor-pointer hover:bg-gray-500 transition-all dz-clickable"
          id="btnDraw-${nameClass}"
        >
          <i class="fa-solid fa-plus"></i>
        </div>
        <div class="dz-default dz-message">
          <button class="dz-button" type="button">
            Drop files here to upload
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="form-group pb-5 list-image-check">
    <label
      class="block text-xl font-semibold mb-2 text-main-300"
      for="listImages"
      >List Image Product</label
    ><style>
      .dropzone-${nameClass2} .dz-preview .dz-image {
      width: 80px;
      height: 80px;
      }
      .dropzone-${nameClass2} .dz-preview .dz-image {
      width: auto !important;
      height: auto !important;
      max-width: 80px;
      max-height: 80px;
      }
      .dropzone-${nameClass2} .dz-preview .dz-image {
      width: 100%;
      height: 100%;
      }
    </style>
    <div class="my-3">
      <div
        class="dropzone dropzone-${nameClass2} flex-wrap border-none flex flex-row items-center p-0 min-h-0"
        action="/admin/upload/multi-image"
        id="${nameClass2}"
        method="POST"
        enctype="multipart/form-data"
      >
        <div
          class="mr-[1rem] bg-main text-white px-7 py-5 rounded-lg inline-block cursor-pointer hover:bg-gray-500 transition-all dz-clickable"
          id="btnDraw-${nameClass2}"
        >
          <i class="fa-solid fa-plus"></i>
        </div>
        <div class="dz-default dz-message">
          <button class="dz-button" type="button">
            Drop files here to upload
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="pb-5 what-size-check">
    <label class="block text-xl font-semibold mb-2 text-main-300"
      >What Size?</label
    ><label class="switch select-none"
      ><input type="checkbox" /><span class="slider round"></span
    ></label>
  </div>
  <div class="hidden size-check">
    <div class="form-group pb-5 size-check">
      <label class="block text-xl font-semibold mb-2 text-main-300" for="size"
        >Size Product</label
      >
      <fieldset>
        <div class="flex flex-row flex-wrap gap-5 list-size-products">
          <div
            class="flex items-center gap-3 bg-main-50 p-3 text-white rounded-md basic-4/12"
          >
            <input
              class="accent-main text-white cursor-pointer border-none"
              type="checkbox"
              id="XS"
              name="size"
              value="XS"
            />
            <label for="coding">XS</label>
          </div>
          <div
            class="flex items-center gap-3 bg-main-50 p-3 text-white rounded-md basic-4/12"
          >
            <input
              class="accent-main text-white cursor-pointer"
              type="checkbox"
              id="S"
              name="size"
              value="S"
            /><label for="S">S</label>
          </div>
          <div
            class="flex items-center gap-3 bg-main-50 p-3 text-white rounded-md basic-4/12"
          >
            <input
              class="accent-main text-white cursor-pointer"
              type="checkbox"
              id="M"
              name="size"
              value="M"
            />
            <label for="M">M</label>
          </div>
          <div
            class="flex items-center gap-3 bg-main-50 p-3 text-white rounded-md basic-4/12"
          >
            <input
              class="accent-main text-white cursor-pointer"
              type="checkbox"
              id="L"
              name="size"
              value="L"
            /><label for="L">L</label>
          </div>
          <div
            class="flex items-center gap-3 bg-main-50 p-3 text-white rounded-md basic-4/12"
          >
            <input
              class="accent-main text-white cursor-pointer"
              type="checkbox"
              id="XL"
              name="size"
              value="XL"
            /><label for="XL">XL</label>
          </div>
          <div
            class="flex items-center gap-3 bg-main-50 p-3 text-white rounded-md basic-4/12"
          >
            <input
              class="accent-main text-white cursor-pointer"
              type="checkbox"
              id="XXL"
              name="size"
              value="XXL"
            /><label for="XXL">XXL</label>
          </div>
          <div
            class="add-size-product cursor-pointer flex items-center gap-3 bg-main hover:bg-main-100 transition-all p-3 text-white rounded-md basic-4/12"
          >
            Add Size
          </div>
        </div>
        

      </fieldset>
    </div>
    <div
      class="pb-5 stock-size flex flex-row flex-wrap gap-6 items-center justify-start"
    >
      <div class="form-group pb-5 basis-1/4">
        <label
          class="block text-xl font-semibold mb-2 text-main-300"
          for="stockXS"
          >Stock Size XS</label
        ><input
          class="form-control py-3 outline-none bg-[#f2f2f2] rounded-lg px-5 block w-full"
          id="stockXS"
          sizecolor="XS"
          disabled=""
          name="stock"
          min="0"
          max="100"
          value="0"
          type="number"
          placeholder="Enter stock"
        />
      </div>
      <div class="form-group pb-5 basis-1/4">
        <label
          class="block text-xl font-semibold mb-2 text-main-300"
          for="stockS"
          >Stock Size S</label
        ><input
          class="form-control py-3 outline-none bg-[#f2f2f2] rounded-lg px-5 block w-full"
          id="stockS"
          sizecolor="S"
          disabled=""
          name="stock"
          min="0"
          max="100"
          value="0"
          type="number"
          placeholder="Enter stock"
        />
      </div>
      <div class="form-group pb-5 basis-1/4">
        <label
          class="block text-xl font-semibold mb-2 text-main-300"
          for="stockM"
          >Stock Size M</label
        ><input
          class="form-control py-3 outline-none bg-[#f2f2f2] rounded-lg px-5 block w-full"
          id="stockM"
          sizecolor="M"
          disabled=""
          name="stock"
          min="0"
          max="100"
          value="0"
          type="number"
          placeholder="Enter stock"
        />
      </div>
      <div class="form-group pb-5 basis-1/4">
        <label
          class="block text-xl font-semibold mb-2 text-main-300"
          for="stockL"
          >Stock Size L</label
        ><input
          class="form-control py-3 outline-none bg-[#f2f2f2] rounded-lg px-5 block w-full"
          id="stockL"
          sizecolor="L"
          disabled=""
          name="stock"
          min="0"
          max="100"
          value="0"
          type="number"
          placeholder="Enter stock"
        />
      </div>
      <div class="form-group pb-5 basis-1/4">
        <label
          class="block text-xl font-semibold mb-2 text-main-300"
          for="stockXL"
          >Stock Size XL</label
        ><input
          class="form-control py-3 outline-none bg-[#f2f2f2] rounded-lg px-5 block w-full"
          id="stockXL"
          sizecolor="XL"
          disabled=""
          name="stock"
          min="0"
          max="100"
          value="0"
          type="number"
          placeholder="Enter stock"
        />
      </div>
      <div class="form-group pb-5 basis-1/4">
        <label
          class="block text-xl font-semibold mb-2 text-main-300"
          for="stockXXL"
          >Stock Size XXL</label
        ><input
          class="form-control py-3 outline-none bg-[#f2f2f2] rounded-lg px-5 block w-full"
          id="stockXXL"
          sizecolor="XXL"
          disabled=""
          name="stock"
          min="0"
          max="100"
          value="0"
          type="number"
          placeholder="Enter stock"
        />
      </div>
    </div>
  </div>
  <div class="form-group pb-5 normal-check">
    <label class="block text-xl font-semibold mb-2 text-main-300" for="stock"
      >Stock</label
    ><input
      class="form-control py-3 outline-none bg-[#f2f2f2] rounded-lg px-5 inline-block"
      id="stock"
      name="stock"
      min="0"
      max="100"
      type="number"
      placeholder="Enter stock"
    />
  </div>
  <div
  class="remove-option text-3xl cursor-pointer text-red-500 font-semibold absolute top-4 right-[1.25rem]"
  >
    <i class="fa-solid fa-xmark"></i>
  </div>
</div>

    `;
  newOption.innerHTML = divCustom;

  optionsProduct.appendChild(newOption);

  Dropzone.autoDiscover = false;
  dropzones[nameClass] = new Dropzone(`#${nameClass}`, {
    autoProcessQueue: false,
    paramName: "file",
    uploadMultiple: true,
    parallelUploads: 100,
    maxFilesize: 2,
    acceptedFiles: "image/*",
    addRemoveLinks: true,
    clickable: true,
    clickable: `#btnDraw-${nameClass}`,
    maxFiles: 1,
    dictRemoveFile: '<i class="fa-solid fa-xmark"></i>',
    thumbnailWidth: 120,
    thumbnailHeight: 120,
    init: function () {
      this.on("addedfile", (file) => {
        if (
          this.files.length > this.options.maxFiles &&
          this.files.length > 1
        ) {
          this.removeFile(this.files[this.files.length - 1]); // remove the first file
        }
        console.log();
        if (this.files.length >= this.options.maxFiles) {
          this.previewsContainer.querySelector(".bg-main").style.display =
            "none";
        }
      });
      this.on("removedfile", (file) => {
        // If a file is removed and the number of files is less than the limit, show the add file button
        if (this.files.length < this.options.maxFiles) {
          this.previewsContainer.querySelector(".bg-main").style.display =
            "block";
        }
      });
    },
  });
  dropzones[nameClass2] = new Dropzone(`#${nameClass2}`, {
    autoProcessQueue: false,
    paramName: "file",
    uploadMultiple: true,
    parallelUploads: 100,
    maxFilesize: 2,
    acceptedFiles: "image/*",
    addRemoveLinks: true,
    clickable: true,
    clickable: `#btnDraw-${nameClass2}`,
    maxFiles: 8,
    dictRemoveFile: '<i class="fa-solid fa-xmark"></i>',
    thumbnailWidth: 80,
    thumbnailHeight: 80,
    init: function () {
      this.on("addedfile", (file) => {
        if (
          this.files.length > this.options.maxFiles &&
          this.files.length > 1
        ) {
          this.removeFile(this.files[this.files.length - 1]); // remove the first file
        }
        console.log();
        if (this.files.length >= this.options.maxFiles) {
          this.previewsContainer.querySelector(".bg-main").style.display =
            "none";
        }
      });
      this.on("removedfile", (file) => {
        // If a file is removed and the number of files is less than the limit, show the add file button
        if (this.files.length < this.options.maxFiles) {
          this.previewsContainer.querySelector(".bg-main").style.display =
            "block";
        }
      });
    },
  });


  const switchButton = newOption.querySelector(".switch input");
  switchButton.addEventListener("change", function () {
    const sizeCheck = this.closest(".option-product").querySelector(".size-check")
    const normalCheck = this.closest(".option-product").querySelector(".normal-check")
    sizeCheck.classList.toggle("hidden");
    normalCheck.classList.toggle("hidden");
  });


  //ĐOạn này js cho chọn size
  const sizeCheckboxesAll = newOption.querySelectorAll("[name='size']");
  sizeCheckboxesAll.forEach(checkbox => {
    checkbox.addEventListener("change", function () {
   
      const atr = this.getAttribute("id");
      const inputColor = newOption.querySelector(`input[sizeColor='${atr}']`);
 
      if (this.checked) {
        inputColor.removeAttribute("disabled");
      } else {
        inputColor.value = 0;
        inputColor.setAttribute("disabled", "disabled");
      }
    });
  })

  //Đoạn này js cho thêm size

  newOption.querySelector(".add-size-product")?.addEventListener("click", function () {
    let userInput = prompt("Please enter size:");
    if (!userInput) return;
    const sizeConvertSlug = convertToSlug(`stock${userInput}`);
    const idConvertSlug = convertToSlug(`${userInput}`);
    this.insertAdjacentHTML("beforebegin", `
      <div class="flex items-center gap-3 bg-main-50 p-3 text-white rounded-md basic-4/12">
        <input class="accent-main text-white cursor-pointer border-none" type="checkbox" id="${idConvertSlug}" name="size" value="${userInput}"/>
        <label for="coding">${userInput}</label>
      </div>
    `);

    newOption.querySelector(".stock-size").insertAdjacentHTML("beforeend", `
      <div class="form-group pb-5 basis-1/4">
        <label title="${userInput}" class="block text-xl font-semibold mb-2 text-main-300 overflow-hidden overflow-ellipsis whitespace-nowrap w-[10rem]" for="${sizeConvertSlug}">Stock Size ${userInput}</label>
        <input class="form-control py-3 outline-none bg-[#f2f2f2] rounded-lg px-5 block w-full" id="${sizeConvertSlug}" sizecolor="${idConvertSlug}" disabled="" name="stock" min="0" max="100" value="0" type="number" placeholder="Enter stock"/>
      </div>
    `);


    document.getElementById(idConvertSlug)?.addEventListener("change", function () {
      const inputColor = newOption.querySelector(`input[sizeColor='${this.getAttribute("id")}']`);
      if (this.checked) {
        inputColor.removeAttribute("disabled");
      } else {
        inputColor.value = 0;
        inputColor.setAttribute("disabled", "disabled");
      }
    });
  });


  //Đoạn này sẽ xóa thẻ div option-product
  newOption.querySelector(".remove-option")?.addEventListener("click", function () {
    newOption.remove();
  });
});







// Thêm sự kiện khi nút có class "add-size-product" được click
document.querySelectorAll(".add-size-product")?.forEach(addSizeProduct => {
  addSizeProduct.addEventListener("click", function () {
    console.log(this.closest(".option-product"));
    let userInput = prompt("Please enter size:"); // Hiển thị prompt để nhập size
    if (!userInput) return;
    // Tạo slug từ size và thêm một đoạn HTML mới trước nút add-size-product
    const idConvertSlug = convertToSlug(`${userInput}`);
    const sizeConvertSlug = convertToSlug(`stock${userInput}`);
    this.insertAdjacentHTML("beforebegin", `
      <div class="flex items-center gap-3 bg-main-50 p-3 text-white rounded-md basic-4/12">
        <input class="accent-main text-white cursor-pointer border-none" type="checkbox" id="${idConvertSlug}" name="size" value="${userInput}"/>
        <label for="coding">${userInput}</label>
      </div>
    `);
    
    // Thêm một đoạn HTML mới vào phần tử cha có class "options-product"
    this.closest(".option-product").querySelector(".stock-size").insertAdjacentHTML("beforeend", `
      <div class="form-group pb-5 basis-1/4">
        <label title="${userInput}" class="block text-xl font-semibold mb-2 text-main-300 overflow-hidden overflow-ellipsis whitespace-nowrap w-[10rem]" for="${sizeConvertSlug}">Stock Size ${userInput}</label>
        <input class="form-control py-3 outline-none bg-[#f2f2f2] rounded-lg px-5 block w-full" id="${sizeConvertSlug}" sizecolor="${idConvertSlug}" disabled name="stock" min="0" max="100" value="0" type="number" placeholder="Enter stock"/>
      </div>
    `);
    
    // Thêm sự kiện khi checkbox mới được thêm vào có sự thay đổi
    document.getElementById(idConvertSlug)?.addEventListener("change", function () {
      const inputColor = document.querySelector(`input[sizeColor='${this.getAttribute("id")}']`);
      console.log(`input[sizeColor='${this.getAttribute("id")}]`);
      if (this.checked) {
        inputColor.removeAttribute("disabled");
      } else {
        inputColor.value = 0;
        inputColor.setAttribute("disabled", "disabled");
      }
    });
  });
})


// Thêm sự kiện khi có sự thay đổi trên input trong phần tử có class "switch"
document.querySelector(".what-size-check .switch input").addEventListener("change", function () {
  // Tìm phần tử cha gần nhất có class "option-product"
  const optionProduct = this.closest(".option-product");
  // Thay đổi hiển thị của các phần tử có class "size-check" và "normal-check"
  ["size-check", "normal-check"].forEach(className => optionProduct.querySelector(`.${className}`).classList.toggle("hidden"));
});



// Thêm sự kiện khi có thay đổi trên các checkbox có name "size"
document.querySelectorAll("[name='size']").forEach(checkbox => {
 
  checkbox.addEventListener("change", function () {
   
    // Lấy input có thuộc tính sizeColor tương ứng với id của checkbox
    const inputColor = this.closest(".option-product").querySelector(`input[sizeColor='${this.getAttribute("id")}']`);

    if (this.checked) {
      inputColor.removeAttribute("disabled"); // Bỏ thuộc tính disabled nếu checkbox được chọn
    } else {
      inputColor.value = 0;
      inputColor.setAttribute("disabled", "disabled"); // Đặt giá trị về 0 và thêm thuộc tính disabled nếu checkbox không được chọn
    }
  });
});


