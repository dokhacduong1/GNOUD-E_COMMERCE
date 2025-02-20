

const linkGetCity = "/api/v1/locations/regions/city";
const linkGetWard = "https://localhost:3000/api/v1/locations/regions/ward";
const boxCreateAddrss = document.querySelector('.create-address')
const boxEditAddrss = document.querySelector('.edit-address')
const selectProvince = document.getElementById('province_id');
const selectWard = document.getElementById('ward_id');
const addressDetail = document.getElementById('address');
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}
if(boxCreateAddrss){
    async function getCity() {
        const data = await fetchData(linkGetCity);
        const listOption = data.map(city => `<option value="${city.value}">${city.option}</option>`);
        listOption.unshift('<option value="">選択してください</option>');
        selectProvince.innerHTML = listOption.join('');
    }
    getCity();
}

if (boxEditAddrss) {
    const dataAddressByJs = document.querySelector('.edit_address_js')?.innerText || '{}';
    const convertData = JSON.parse(dataAddressByJs);
    console.log(addressDetail);
    async function getCity() {
        const data = await fetchData(linkGetCity);
        const valueConvert = `${convertData.City}_${convertData.District}`;

        const listOption = data.map(city => {
            return `<option value="${city.value}"${valueConvert === city.value ? "selected" : ""}>${city.option}</option>`;
        });
        listOption.unshift('<option value="">選択してください</option>');
        selectProvince.innerHTML = listOption.join('');

        // Tự động load danh sách ward nếu đã có giá trị City và District
        if (convertData.City && convertData.District) {
            await loadWard(convertData.City, convertData.District);
        }
    }

    async function loadWard(province_id, district_code) {
        const data = await fetchData(`${linkGetWard}?province_id=${province_id}&district_code=${district_code}`);

        const listOption = data.map(ward => {

            return `<option value="${ward.value}" ${parseInt(convertData.Ward )=== ward.value ? "selected" : ""}>${ward.option}</option>`;
        });
        listOption.unshift('<option value="">選択してください</option>');
        selectWard.innerHTML = listOption.join('');
        selectWard.disabled = false; // Bỏ disabled nếu đang chỉnh sửa
    }

    getCity();
}

$('#province_id').on('select2:select', async function (e) {
    const { id } = e.params.data;

    const [province_id, district_code] = id.split('_');
    const data = await fetchData(`${linkGetWard}?province_id=${province_id}&district_code=${district_code}`);
    const listOption = data.map(district => `<option value="${district.value}">${district.option}</option>`);
    listOption.unshift('<option value="">選択してください</option>');
    selectWard.disabled = id === '';
    selectWard.innerHTML = listOption.join('');
    addressDetail.value = '';
});

