//Lấy dữ liệu từ API upload của mình
const getImageJson = async (formData) => {
  const currentURLOrigin = window.location.origin;
  let data = "";
  const response = await fetch(`${currentURLOrigin}/admin/upload?_method=POST`, {
      method: 'POST',
      body: formData,
  })
  if (response.ok) {
      const responseData = await response.json()
      data = responseData.url
  }
  return data
}
//Hàm này có nhiệm vụ sử lý logic của images_upload_handler khi gửi ảnh lên
const example_image_upload_handler = (blobInfo, success, failure) => {
  return new Promise(async (resolve, reject) => {
      const formData = new FormData();
      formData.append('thumbnail', blobInfo.blob(), blobInfo.filename());
      const url = await getImageJson(formData)
      // Trả về link ảnh cho TinyMCE
      resolve(url);
  });
}

  //Cấu hình init
tinymce.init({
  selector: '[tinymce]',
 
  plugins: [
      'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
      'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
      'media', 'table', 'emoticons', 'template', 'help'
  ],
  toolbar: 'undo redo | styles | fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons',
  menu: {
      favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
  },
  menubar: 'favs file edit view insert format tools table help',
  images_upload_handler: example_image_upload_handler
});

