const request = require('request');
const config = require(`./config.json`);
// regist の次にsubscで登録。get-listで一覧確認
// 削除はdel。webhookIdとやらは、delの時にしか使わない。
// oauth認証に使う値
const twitter_oauth = {
  consumer_key: config.TWITTER_CONSUMER_KEY.trim(),
  consumer_secret: config.TWITTER_CONSUMER_SECRET.trim(),
  token: config.TWITTER_ACCESS_TOKEN.trim(),
  token_secret: config.TWITTER_ACCESS_TOKEN_SECRET.trim()
}
// https://developer.twitter.com/en/account/environments にある Dev environment label

const command = process.argv[2];
// https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/api-reference コマンド順番に。
if (command == "regist") {
  // Registers a webhook URL / Generates a webhook_id
  const request_options = {
    url: `https://api.twitter.com/1.1/account_activity/all/${config.devLabel}/webhooks.json`,
    oauth: twitter_oauth,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    form: { url: config.webhookUrl }
  };
  request.post(request_options, (error, response, body) => { console.log(body) });
} else if (command == "get-list") {
  // Returns all webhook URLs and their statuses
  // アクティブなwebhookのURL一覧を取得
  // [{"id":"900000000000000000","url":"https://example.com/twitter-webhook-test/","valid":true,"created_timestamp":"2018-05-16 17:04:41 +0000"}]
  const request_options = {
    url: `https://api.twitter.com/1.1/account_activity/all/${config.devLabel}/webhooks.json`,
    oauth: twitter_oauth,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  };
  request.get(request_options, (error, response, body) => { console.log(body) });
} else if (command == "put-hook") {
  // Manually triggers a challenge response check
  // Registers a webhook URL / Generates a webhook_id
  // 登録したurlに "GET /twitter-webhook-test/index?crc_token=xxxxxxxxxxxxxxxxxxx&nonce=yyyyyyyyyyyyyyyy HTTP/1.1" のリクエストを送る
  // webhookの定期的なリクエストのテスト？
  const request_options = {
    url: `https://api.twitter.com/1.1/account_activity/all/${config.devLabel}/webhooks/${config.hookId}.json`,
    oauth: twitter_oauth,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
  };
  request.put(request_options, (error, response, body) => { console.log(body) });
} else if (command == "subsc") {
  // Subscribes an application to an account's events
  // これが登録らしいんだけど、来ないんだよなあ
  const request_options = {
    url: `https://api.twitter.com/1.1/account_activity/all/${config.devLabel}/subscriptions.json`,
    oauth: twitter_oauth
  };
  request.post(request_options, (error, response, body) => { console.log(`${response.statusCode} ${response.statusMessage}`); console.log(body) });
} else if (command == "count") {
  // Returns a count of currently active subscriptions
  // {"errors":[{"message":"Your credentials do not allow access to this resource","code":220}]}
  // 無料だと取れないっぽい？
  const request_options = {
    url: `https://api.twitter.com/1.1/account_activity/subscriptions/count.json`,
    oauth: twitter_oauth,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  };
  request.get(request_options, (error, response, body) => { console.log(body) });
} else if (command == "get-subsc") {
  // Check to see if a webhook is subscribed to an account
  // よくわからん。204が返ってきているのでOKの事らしいが
  const request_options = {
    url: `https://api.twitter.com/1.1/account_activity/all/${config.devLabel}/subscriptions.json`,
    oauth: twitter_oauth,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  };
  request.get(request_options, (error, response, body) => { console.log(`${response.statusCode} ${response.statusMessage} ( 204ならok)`); console.log(body) });
} else if (command == "list") {
  // Returns a list of currently active subscriptions
  // {"errors":[{"message":"Your credentials do not allow access to this resource","code":220}]}
  // 無料では取れないっぽい？
  const request_options = {
    url: `https://api.twitter.com/1.1/account_activity/all/${config.devLabel}/subscriptions/list.json`,
    oauth: twitter_oauth,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  };
  request.get(request_options, (error, response, body) => { console.log(`${response.statusCode} ${response.statusMessage}`); console.log(body) });
} else if (command == "del") {
  // Deletes the webhook
  // これを実行すると、get-listの戻り値がカラになる。
  const request_options = {
    url: `https://api.twitter.com/1.1/account_activity/all/${config.devLabel}/webhooks/${config.hookId}.json`,
    oauth: twitter_oauth,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  };
  request.delete(request_options, (error, response, body) => { console.log(`${response.statusCode} ${response.statusMessage}`); console.log(body) });
} else if (command == "des") {
  // Deactivates subscription
  // delを実行した後なのでわからん
  const request_options = {
    url: `https://api.twitter.com/1.1/account_activity/all/${config.devLabel}/subscriptions.json`,
    oauth: twitter_oauth,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  };
  request.delete(request_options, (error, response, body) => { console.log(`${response.statusCode} ${response.statusMessage} (204ならOKかな？)`); console.log(body) });
}
