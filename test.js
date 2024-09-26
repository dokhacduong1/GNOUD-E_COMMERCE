const axios = require('axios');
const https = require('https');
let config = {
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://localhost:3000/images/item/tos-alisg-i-375lmtcpo0-sg/fda93831471d4e9cbd53e9c3b9333385~tplv-375lmtcpo0-image.avif?w=37&h=37',
  headers: { 
    
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
