require("dotenv").config();
const TOKEN = process.env.TOKEN;
const LIMIT = process.env.LIMIT;
const https = require("https");

function getJsonData(api) {
    let dataJson = "";
    return new Promise((t, f) => {
        https.get(api, (res) => {
            res.on("data", (data) => {
                dataJson += data;
            });
            res.on("end", () => {
                t(JSON.parse(dataJson));
            });
            res.on("error", (error) => {
                f(error);
            });
        });
    });
}

async function getListID(apiListID) {
    const arrID = await getJsonData(apiListID).then((data) => {
        const arrData = data.data;
        const arrID = [];
        for (let index = 0; index < arrData.length; index++) {
            arrID.push(arrData[index].id);
        }
        return arrID;
    });
    console.log("chuan bi" + arrID);
    return arrID;
}
async function startLike(idUser) {
    const apiGetListId = `https://graph.facebook.com/${idUser}/feed?fields=id&limit=${LIMIT}&access_token=${TOKEN}`;
    let listID = await getListID(apiGetListId);
    for (let index = 0; index < listID.length; index++) {
        await postLike(listID[index]);
    }
    console.log("Success");
}
function postLike(idPost) {
    const HOST_NAME = "graph.facebook.com";
    let API_LIKE = `/${idPost}/likes?access_token=${TOKEN}`;
    const options = {
        hostname: HOST_NAME,
        port: 443,
        path: API_LIKE,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    return new Promise((t, f) => {
        const req = https.request(options, (res) => {
            console.log(`status code ${res.statusCode}`);
            res.on("data", (d) => {
                console.log(JSON.parse(d));
            });
            res.on("end", () => {
                console.log("done " + idPost);
                t();
            });
        });
        req.on("error", (err) => {
            console.log(err);
            f();
        });
        req.end();
    });
}
startLike(process.env.USER_ID);
