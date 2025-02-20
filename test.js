const axios = require('axios');
const https = require('https');
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://localhost:3000/api/v1/client/search/general/preview?keyword=%E7%B4%B3%E5%A3%AB%E3%80%80%E9%A2%A8%E3%82%92%E9%80%9A%E3%81%99%E3%82%B9%E3%83%88%E3%83%AC%E3%83%83%E3%83%81%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3%E3%82%AB%E3%83%A9%E3%83%BC%E5%8D%8A%E8%A2%96%E3%82%B7%E3%83%A3%E3%83%84&idCategory=0',
  headers: { 
    'Accept': '*/*', 
    'Accept-Language': 'en,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,zh-CN;q=0.5,zh;q=0.4', 
    'Cache-Control': 'no-cache', 
    'Connection': 'keep-alive', 
    'Cookie': 'fdsfdsjoisfdjklfdskldsf=U2FsdGVkX1!2BjbRqOYUwNLMHPRozjPksYQrdtMm6NlKA!3D; cookie_name=cookie_value; cart_code=62615c20-fbd8-4d59-8261-91426a7ce272; _session_cart=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJ0X2NvZGUiOiI2MjYxNWMyMC1mYmQ4LTRkNTktODI2MS05MTQyNmE3Y2UyNzIiLCJpYXQiOjE3MzAwMDAxMjQsImV4cCI6MTczMDAwMTAyNH0.vsROuPtI2q02cvtEk43tB4ZIo2-skVt_PsWsrW3IiAI; connect.sid=s%3AAR2QyX6mEw0B53s-QVxCpcmSqPjHw4ur.C3BCYkaelCkM02%2FrYKbHG4j2BaYuFxe7Mk4nD4%2B1cuU; _session_cart=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJ0X2NvZGUiOiI2MjYxNWMyMC1mYmQ4LTRkNTktODI2MS05MTQyNmE3Y2UyNzIiLCJpYXQiOjE3MzAwMDE2MDIsImV4cCI6MTczMDAwMjUwMn0.1Aq0rEDTrDOYB-F567lQb5H8fI4mUadYmNqFa2UdXnA; cart_code=62615c20-fbd8-4d59-8261-91426a7ce272; connect.sid=s%3AezO06lES5LX82YFMMnOiu71X-XSCt7PG.nGPRhiYTU%2BMJ9fWWg0IE6tV3nVGM8fpjYyaWqeTAzx4', 
    'Pragma': 'no-cache', 
    'Referer': 'https://localhost:3000/product/%E7%B4%B3%E5%A3%AB-%E9%A2%A8%E3%82%92%E9%80%9A%E3%81%99%E3%82%B9%E3%83%88%E3%83%AC%E3%83%83%E3%83%81%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3%E3%82%AB%E3%83%A9%E3%83%BC%E5%8D%8A%E8%A2%96%E3%82%B7%E3%83%A3%E3%83%84', 
    'Sec-Fetch-Dest': 'empty', 
    'Sec-Fetch-Mode': 'cors', 
    'Sec-Fetch-Site': 'same-origin', 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', 
    'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"'
  },
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
};


async function test() {
  try {
    let res = await axios(config);

  } catch (error) {
    console.error(error.response.data);
  }
}
test();