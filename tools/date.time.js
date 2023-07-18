const axios = require('axios');

let date;
let time;
//a
async function fetchDateTime()
 {
    try {
       const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Kathmandu');
       const { datetime } = response.data;
       return datetime
      }
       catch (error) {
       console.error('Server Error d/t:', error.message);
       return false;
      }
  }
module.exports = {fetchDateTime}

