// サーバ側はapiのconsumer_secretしか使ってない
//https://github.com/twitterdev/twitter-webhook-boilerplate-node/
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const crypto = require('crypto');
const config = require("./config.json");
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get(config.expressWatchPath, (request, response) => {
    // getでchallenge response check (CRC)が来るのでその対応
    const crc_token = request.query.crc_token;
    if (crc_token) {
        const hash = crypto.createHmac('sha256', config.TWITTER_CONSUMER_SECRET).update(crc_token).digest('base64')
        console.log(`receive crc check. token=${crc_token} responce=${hash}`);
        response.status(200);
        response.send({
            response_token: 'sha256=' + hash
        });
    } else {
        response.status(400);
        response.send('Error: crc_token missing from request.');
    }
});

app.post(config.expressWatchPath, (request, response) => {
    const mode = "整形してjson表示";
    if (mode == "整形してjson表示") {
        console.log(`${JSON.stringify(request.body, null, "  ")}`);
    } else if (mode == "1行のjsonの先頭n文字だけ表示") {
        console.log(`${JSON.stringify(request.body).substring(0, 100)}`);
    }
    response.send('200 OK');
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});