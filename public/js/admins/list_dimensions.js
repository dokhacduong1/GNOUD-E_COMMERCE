
function toggleProductDimensions() {
  const list_product_dimensions = document.querySelector(".list-product-dimensions");
  list_product_dimensions.classList.toggle("hidden");
  window.scrollTo(0, document.body.scrollHeight);
}


function createDivProductDimension(element) {
  const div = document.createElement("div");
  div.classList.add("flex", "flex-row", "gap-1", "options-dimension", "mb-2", "item-node");
  div.innerHTML = `
    <input class="bg-white outline-none border border-gray-200 rounded-lg p-3 w-full" type="text" />
    <div class="button-remove-option">
      <div class="button-add-option-select">
        <i class="fa-solid fa-xmark text-3xl"></i>
      </div>
    </div>
  `;
  element.insertAdjacentElement("beforebegin", div);
  div.querySelector(".button-remove-option").addEventListener("click", () => div.remove());
  window.scrollTo(0, document.body.scrollHeight);
}


function addRowDimension() {
  const dimensionProduct = document.querySelectorAll(".dimension-product");
  const dimensionsProduct = document.querySelector(".dimensions-product");
  const div = document.createElement("div");
  div.classList.add("2xl:basis-[14%]","xl:basis-[24%]","lg:basis-[49%]","sm:basis-full", "flex-col", "overflow-hidden", "p-3", "dimension-product", "relative", "flex");
  div.innerHTML = `
    <div class="mb-2 label_dimension flex flex-row justify-between items-center w-full">
      <label class="block text-xl font-semibold text-main-300">Options ${dimensionProduct.length+1}</label>
      <div class="text-red-300 text-xl cursor-pointer delete-option hover:text-red-400 transition-all">
        <i class="fa-solid fa-trash-can"></i>
      </div>
    </div>
    <div class="dimension-check">
      <div class="title_dimension">
        <input class="text-main-200 bg-[#efefef] outline-none border border-gray-200 rounded-lg p-3 w-full mb-2" type="text" />
      </div>
      <div class="flex flex-row gap-1 options-dimension mb-2 item-node">
        <input class="bg-white outline-none border border-gray-200 rounded-lg p-3 w-full" type="text" />
      </div>
      <div class="button-add-option select-none">
        <div class="text-center transition-all bg-main text-white inline-block p-4 rounded-md cursor-pointer hover:text-ellipsis w-full hover:bg-main-50">
          Add Option
        </div>
      </div>
    </div>
  `;
  dimensionsProduct.appendChild(div);
  div.querySelector(".button-add-option").addEventListener("click", function () {
    createDivProductDimension(this);
  });
  div.querySelector(".delete-option").addEventListener("click", () => div.remove());
}


document.querySelector(".product-dimensions .switch input")?.addEventListener("change", toggleProductDimensions);
document.querySelector(".product-dimensions .button-add-option")?.addEventListener("click", function () {
  createDivProductDimension(this);
});
document.querySelector(".product-dimensions .add-row-dimension")?.addEventListener("click", addRowDimension);

