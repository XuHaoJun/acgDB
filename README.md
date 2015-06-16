# acgDB
acgDB 是一個集合大量 ACG(Anime Comics Games) 動畫、漫畫、遊戲作品基本資料的資料庫，
資料來源是 [巴哈姆特](http://www.gamer.com.tw/) 網頁爬蟲。

* [Try it Online!](http://acgdb.herokuapp.com/)

* Source: [Github](https://github.com/XuHaoJun/acgDB)

<div class="fb-like" data-href="http://acgdb.herokuapp.com/" data-layout="standard" data-action="like" data-show-faces="true" data-share="true"></div>
<div class="fb-comments" data-href="http://acgdb.herokuapp.com/" data-numposts="5" data-colorscheme="light"></div>

# 使用方式
* GET api/:acgType/:id

*GET* 代表為 http 中的 *GET*，*api/:acgType* 則是代表主網址後所需接的網址，
其中 *:acgType* 代表的是一個必要參數，部份 API 會有可選參數或必要參數，使用方法是和一般
*GET* 的參數一樣。

# 簡單範例

* GET api/:acgType/:id

http://acgdb.herokuapp.com/api/anime/71736

* GET api/:acgsType/search

http://acgdb.herokuapp.com/api/animes/search?q=火影

* GET api/db/collection/comic

http://acgdb.herokuapp.com/api/db/collection/comic/find?query={"nameTW":{"$regex":"貓"}}&fields={"id":true,"nameTW":true}


# GET api/:acgType/:id

提供一筆某個 ACG 類型的作品資料。

參數 | 選填類型 | 說明 |
------- | ---------------- | ----------:
acgType  | 必要 | 可用值為其一 : [anime, comic, novel, PC, OLG, PS4, PS3, wiiu, web, GBA, PSP, PSV, 3DS, android, ios]
id | 必要 | 作品 id

### 範例

http://acgdb.herokuapp.com/api/anime/71736

### 範例輸出
```javascript
{
    "id": 71736,
    "type": "奇幻冒險",
    "platform": "動畫",
    "nameTW": "最終章 - 火影忍者劇場版",
    "nameJP": "劇場版NARUTO-ナルト- ザ・ラスト",
    "nameEN": "The Last: Naruto the Movie",
    "author": "岸本斉史",
    "director": "小林常夫",
    "numEpisodes": 1,
    "broadcastType": "電影",
    "firstBroadcastLocal": "2014-12-06T00:00:00.000Z",
    "sellDateLocal": "2015-07-22T00:00:00.000Z",
    "firstBroadcastTaiwan": "2015-01-16T00:00:00.000Z",
    "sellDateTaiwan": null,
    "ceroRating": "保護級",
    "company": "ぴえろ",
    "officalSite": "http://www.naruto-movie.com/",
    "taiwanAgent": "威視",
    "targetGroup": "少年"
}
```

# GET api/:acgsType

提供某個 ACG 類型的所有作品資料。

參數 | 選填類型 | 說明 |
------- | ---------------- | ----------:
acgsType  | 必要 | 可用值為其一 : [animes, comics, novels, PCs, OLGs, PS4s, PS3s, wiius, webs, GBAs, PSPs, PSVs, 3DSs, androids, ioss]

### 範例

http://acgdb.herokuapp.com/api/OLGs

# GET api/:acgsType/search

藉由作品名字搜尋某種 ACG 類型的作品資料。

參數 | 選填類型 | 說明 |
------- | ---------------- | ----------:
acgsType  | 必要 | 可用值為其一 : [animes, comics, novels, PCs, OLGs, PS4s, PS3s, wiius, webs, GBAs, PSPs, PSVs, 3DSs, androids, ioss]
q | 必要 | 關鍵字
lang | 可選 | 可用值為其一 : [TW, EN, JP] 分別代表 中文、英文、日文，預設值是 TW


### 範例

http://acgdb.herokuapp.com/api/OLGs/search?q=魔獸世界


# GET api/acg/:id
提供一筆 ACG 作品資料。

參數 | 選填類型 | 說明 |
------- | ---------------- | ----------:
id | 必要 | 作品 id

### 範例

http://acgdb.herokuapp.com/api/acg/29821

# GET api/acgs

列出所有類型的 ACG 作品資料。

### 範例

http://acgdb.herokuapp.com/api/acgs

# GET api/acgs/search

參數 | 選填類型 | 說明 |
------- | ---------------- | ----------:
q | 必要 | 關鍵字
lang | 可選 | 可用值為其一 : [TW, EN, JP] 分別代表 中文、英文、日文，預設值是 TW

### 範例

http://acgdb.herokuapp.com/api/acgs/search?q=Cat&lang=EN

# GET api/lastACGs/pages/:numPage
最新 ACG 作品資料並限制分頁。

參數 | 選填類型 | 說明 |
------- | ---------------- | ----------:
numPage | 必要 | 數字

### 範例

http://acgdb.herokuapp.com/api/lastACGs/pages/1

# GET api/db/collection/:acgType/count
回傳某個 ACG 類型的所有作品數量。

參數 | 選填類型 | 說明 |
------- | ---------------- | ----------:
acgType | 必要 | 可用值為其一 : [anime, comic, novel, PC, OLG, PS4, PS3, wiiu, web, GBA, PSP, PSV, 3DS, android, ios]

### 範例

http://acgdb.herokuapp.com/api/db/collection/comic/count

# GET api/db/collection/:acgType/find

提供 Mongodb 查詢風格的 API， 詳細參數設定請見 [Queries — MongoDB Node.JS Driver documentation](http://mongodb.github.io/node-mongodb-native/markdown-docs/queries.html)。

參數 | 選填類型 | 說明 |
------- | ---------------- | ----------:
acgType | 必要 | 可用值為其一 : [anime, comic, novel, PC, OLG, PS4, PS3, wiiu, web, GBA, PSP, PSV, 3DS, android, ios]
query | 可選 | 搜尋設定
fields | 可選 | 欄位相關設定
options | 可選 | 排序、限制數量等設定

### 範例

http://acgdb.herokuapp.com/api/db/collection/anime/find?query={"nameTW":{"$regex":"貓"},"type":"幽默搞笑"}&fields={"id":true,"nameTW":true}&options={"sort":[["firstBroadcastLocal","asc"]]}

### 範例說明
搜尋"幽默搞笑"類型的動畫作品名稱中有"貓"的資料，並以當地首播日期作排序(新->舊)，且只提取 id 和 nameTW 欄位。

### 範例輸出
```javascript
[
    {
        "id": 55435,
        "nameTW": "鞋貓劍客番外篇：三小惡貓"
    }, {
        "id": 43081,
        "nameTW": "鞋貓劍客"
    }, {
        "id": 40688,
        "nameTW": "功夫熊貓 2"
    }, {
        "id": 42073,
        "nameTW": "眾神中的貓神"
    }, {
        "id": 33612,
        "nameTW": "嬌蠻貓娘大橫行！"
    }, {
        "id": 25301,
        "nameTW": "貓願三角戀"
    }, {
        "id": 29674,
        "nameTW": "貓語少女"
    }, {
        "id": 23288,
        "nameTW": "霹靂酷樂貓"
    }, {
        "id": 42430,
        "nameTW": "叮噹貓"
    }, {
        "id": 23140,
        "nameTW": "加菲貓"
    }, {
        "id": 45769,
        "nameTW": "無敵神貓"
    }
]
```

# 資料格式

目前共有 18 種 ACG 類型的作品資料，每種類型都有他的資料格式。

ACG 類型(acgType) | 說明 |
-----------------| ------:
anime | 動畫
comic | 漫畫
novel | 輕小說
PC  | 單機遊戲
PS4 | PS4 遊戲
PS3 | PS3 遊戲
wiiu | Wii U 遊戲
xbone | XboxOne 遊戲
xbox360 | Xbox360 遊戲
GBA | GBA 掌機遊戲
PSP | PSP 掌機遊戲
PSV | PSV 掌機遊戲
3DS | 3DS 掌機遊戲
OLG | 線上遊戲
web | 網頁遊戲
facebook | Facebook 平台網頁遊戲
android | Android 手機遊戲
ios | iOS 手機遊戲


### anime (動畫)
欄位名稱 | 變數類型 | 說明 |
------- | ---------------- | ----------:
id | Int | 作品 Id
type | String | 作品類型
platform | String  | 作品平台
nameTW | String | 中文名稱
nameEN | String | 英文名稱
nameJP | String | 日文名稱
targetGroup | String | 對象族群
author | String | 原著作者
director | String | 導演監督
numEpisodes | Int | 播出集數
broadcastType | String | 播映方式
firstBroadcastLocal | Date | 當地首播
sellDateLocal | Date | 當地發售
firstBroadcastTaiwan | Date | 台灣首播
ceroRating | String | 作品分級
company | String | 製作廠商
officalSite | String | 官方網站
taiwanAgent | String | 台灣代理

### comic (漫畫)
欄位名稱 | 變數類型 | 說明 |
------- | ---------------- | ----------:
id | Int | 作品 Id
type | String | 作品類型
platform | String | 作品平台
nameTW | String | 中文名稱
nameEN | String | 英文名稱
nameJP | String | 日文名稱
targetGroup | String | 對象族群
comicAuthor | String | 漫畫作者
originAuthor | String | 原著作者
numEpisodes | Int | 發行集數
ceroRating | String | 作品分級
company | String | 原廠出版
officalSite | String | 官方網站
taiwanAgent | String | 台灣代理

### novel (輕小說)
欄位名稱 | 變數類型 | 說明 |
------- | ---------------- | ----------:
id | Int | 作品 Id
type | String | 作品類型
platform | String | 作品平台
nameTW | String | 中文名稱
nameEN | String | 英文名稱
nameJP | String | 日文名稱
targetGroup | String | 對象族群
novelAuthor | String | 小說作者
originAuthor | String | 原著作者
iiiustrator | String | 插畫作者
numEpisodes | Int | 發行集數
ceroRating | String | 作品分級
publisher | String | 出版廠商
officalSite | String | 官方網站
taiwanAgent | String | 台灣代理

### PC (單機遊戲)

欄位名稱 | 變數類型 | 說明 |
------- | ---------------- | ----------:
id | Int | 作品 Id
type | String | 作品類型
platform | String | 作品平台
nameTW | String | 中文名稱
nameEN | String | 英文名稱
nameJP | String | 日文名稱
numPlayer | String | 遊戲人數
sellDate | Date | 發售日期
ceroRating | String | 作品分級
price | String | 遊戲售價
productCompany | String | 製作廠商
dirturbuteCompany | String | 發行廠商
agent | String | 代理廠商
officalSite | String | 官方網站

### PS4 (PS4遊戲)

資料格式同 PC (單機遊戲)。

### PS3 (PS3遊戲)

資料格式同 PC (單機遊戲)。

### wiiu (Wii U 遊戲)

資料格式同 PC (單機遊戲)。

### xbone (XboxOne 遊戲)

資料格式同 PC (單機遊戲)。

### xbox360 (Xbox360 遊戲)

資料格式同 PC (單機遊戲)。

### GBA (GBA 掌機遊戲)

資料格式同 PC (單機遊戲)。

### PSP (PSP 掌機遊戲)

資料格式同 PC (單機遊戲)。

### PSV (PSV 掌機遊戲)

資料格式同 PC (單機遊戲)。

### 3DS (3DS 掌機遊戲)

資料格式同 PC (單機遊戲)。

### OLG (線上遊戲)
欄位名稱 | 變數類型 | 說明 |
------- | ---------------- | ----------:
id | Int | 作品 Id
type | String | 作品類型
platform | String | 作品平台
nameTW | String | 中文名稱
nameEN | String | 英文名稱
nameJP | String | 日文名稱
numPlayer | String | 遊戲人數
ceroRating | String | 作品分級
priceType | String | 收費模式
closeBetaDate | Date | 封測日期
openBetaDate | Date | 公測日期
productCompany | String | 製作廠商
dirturbuteCompany | String | 發行廠商
agent | String | 代理廠商
officalSite | String | 官方網站

### web (網頁遊戲)

資料格式同 OLG (線上遊戲)。

### facebook (Facebook 平台網頁遊戲)

欄位名稱 | 變數類型 | 說明 |
------- | ---------------- | ----------:
id | Int | 作品 Id
type | String | 作品類型
platform | String | 作品平台
nameTW | String | 中文名稱
nameEN | String | 英文名稱
nameJP | String | 日文名稱
numPlayer | String | 遊戲人數
ceroRating | String | 作品分級
priceType | String | 收費模式
productCompany | String | 製作廠商
dirturbuteCompany | String | 發行廠商
agent | String | 代理廠商
officalSite | String | 官方網站


### android (Android 遊戲)

欄位名稱 | 變數類型 | 說明 |
------- | ---------------- | ----------:
id | Int | 作品 Id
type | String | 作品類型
platform | String | 作品平台
nameTW | String | 中文名稱
nameEN | String | 英文名稱
nameJP | String | 日文名稱
numPlayer | String | 遊戲人數
ceroRating | String | 作品分級
price | String | 遊戲售價
productCompany | String | 製作廠商
dirturbuteCompany | String | 發行廠商
agent | String | 代理廠商
storeSite | String | Play 商店

### ios (iOS 遊戲)

資料格式同 android (Android 遊戲)。

<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=393715140792789";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
