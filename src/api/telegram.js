const axios = require('axios').default;

async function updateAvail(msg) {
    await axios.post('https://us-central1-chopefirst-fb124.cloudfunctions.net/function-2', {
        userId: -1001684934806,
        message: msg
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      //handle receveing updaye from user, webhook
      // 1. setting webhook w telegram
      // 2. add logic when user /start > add chat_id into database
      // 3. going into firebase to get chat_id
    console.log("axios posting")
}

export {
    updateAvail
}