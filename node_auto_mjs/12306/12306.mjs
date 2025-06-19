import { chromium } from "@playwright/test";
import path from "path";
import url from "url";
import fs from "fs";
import os from "os";
import clipboardy from "clipboardy";
import moment from "moment";

const systemInfo = await getSystemInfo();
const _filename = url.fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const browser = await chromium.launch({
    product: 'microsoftedge',
    headless: false,
});
const context = await createContext();
const indexUrl = "https://www.12306.cn/index/";
const loginUrl = "https://kyfw.12306.cn/otn/resources/login.html";

// 用于从 URL 中提取域名
function extractDomainFromUrl(url) {
    const parser = new URL(url);
    return parser.hostname;
}
// 初始化浏览器实例
async function createContext() {
    if (!browser) {
        throw new Error("Browser instance has not been initialized.");
    }
    // 创建一个新的浏览器上下文
    const context = await browser.newContext();
    return context;
}
// 判断当前操作系统
async function getSystemInfo() {
    if (os.platform() === "darwin") {
        console.log("当前系统为 macOS");
        return "Mac";
    } else if (os.platform() === "win32") {
        console.log("当前系统为 Windows");
        return "Windows";
    } else {
        console.log("当前系统为其他操作系统");
        return "Other";
    }
}
// 打开新页面
async function openNewPage(pageUrl) {
    const page = await context.newPage();
    page.setDefaultTimeout(24 * 60 * 60 * 1000);
    await page.setViewportSize({ width: 1280, height: 800 });
    const timeout = 60 * 1000;
    try {
        await page.goto(pageUrl, { timeout });
    } catch (error) {
        console.log("页面加载超时，正在重新加载页面...");
        await page.
            reload();
    }
    // await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);
    return page;
}
// 创建文本域
async function setCode(page, code) {
    await page.evaluate(() => {
        const input = document.createElement("textarea");
        input.setAttribute("id", "myInput");
        document.body.appendChild(input);
    });
    await page.waitForTimeout(500);
    await page.fill('textarea[id="myInput"]', code);
    await page.waitForTimeout(500);
    await copyCode(page);
}
// 复制
async function copyCode(page) {
    let dvc = systemInfo;
    await page.keyboard.down(dvc === "Mac" ? "Meta" : "Control");
    await page.keyboard.press("A");
    await page.keyboard.up(dvc === "Mac" ? "Meta" : "Control");
    await page.waitForTimeout(100);
    await page.keyboard.down(dvc === "Mac" ? "Meta" : "Control");
    await page.keyboard.press("C");
    await page.keyboard.up(dvc === "Mac" ? "Meta" : "Control");
}
// 粘贴
async function pasteCode(page) {
    let dvc = systemInfo;
    await page.keyboard.down(dvc === "Mac" ? "Meta" : "Control");
    await page.keyboard.press("A");
    await page.keyboard.up(dvc === "Mac" ? "Meta" : "Control");
    await page.keyboard.press("Backspace");
    await page.waitForTimeout(100);
    await page.keyboard.down(dvc === "Mac" ? "Meta" : "Control");
    await page.keyboard.press("KeyV");
    await page.keyboard.up(dvc === "Mac" ? "Meta" : "Control");
    await page.waitForTimeout(100);
}
// 检查dom是否有值，返回 值 或 false
async function checkElementHasValue(page, selector) {
    const element = await page.$(selector);
    if (element) {
        const value = await page.evaluate((el) => {
            return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ? el.value : el.innerText;
        }, element);
        return value;
    }
    return false;
};

async function init() {
    const page = await openNewPage(indexUrl);
}
async function run() {
    /**
     * l9B0blP%2FpLBMX9RLmNNWGtGmnWbJrWO4LpwqeCFiMLFgrCT7F%2BzQvB0RMScnZfB7xY%2Fft1ta%2FJ5A%0ArRkmlU6OV8s5P0SwsezpFE00qAUEcz8xy508bINJZU7rKML6EXDP64lR0Gv46RYBL1fqWHfP0P0b%0Am%2BKdWt7bGeyiKU%2BDgCsgAscU8Lv2sn9%2Fyg7c%2BuzaS%2FxrKf1KgdYTBjApkM6a1TjVcT9Mcc4X2b0u%0Ach%2BFwP%2BRDCdEWSYZWDIgx7iysMDqBsO%2BLRirpe10AM1OMkPTcKSKNNhXW3kKAr%2Be2%2BrEO759I04j%0AiJq21oApGhTXlRVLELk11g1fpU2XDZ5t
     * |预订|57000K87262G|K8726|DNG|JJG|THG|VAG|12:18|12:41|00:23|Y|TNtXWt5hBf9CQxmWVocUmg%2BfgUpVFX5FVmvLIXqxW858Q4w9|20250202|3|G1|06|07|1|0|||||||有||有|有|||||1030W0|131|0|0||100090002130055000211000903448|0|||||1|0#0#0#0#z#0#3#z||7|CHN,CHN|||N#N#|330055031006303200600||202501191730|Y|
     */
    /**
     * 44c60c678b2beb7edda98140029a7402696c23033c5228c3083b487002da5bcc490b4f757ad452eadaa66687abe47c84d3f81e61afd7bf6ceaa6c4bec04db0766f5d00435187b7d03879f4b4e7883714
     */
    // 查询余票接口
    let getQueueCountUrl = "https://kyfw.12306.cn/otn/confirmPassenger/getQueueCount";
    let getQueueCountPar = {
        train_date: "",
        train_no: "57000K87262G",
        stationTrainCode: "K8726",
        seatType: 1, // 座位类型 1:硬座,3:卧铺
        fromStationTelecode: "THG",
        toStationTelecode: "VAG",
        leftTicket: "TNtXWt5hBf9CQxmWVocUmg%2BfgUpVFX5FVmvLIXqxW858Q4w9",
        purpose_codes: "00",
        train_location: "G1",
        _json_att: null,
        REPEAT_SUBMIT_TOKEN: "76f61ed38b664a6e27fdc995bda2c95b"
    }
    let cookie = {
        tk: "8BSo8J2KjMAtyNGvZ3_Rbn1qxFcy5AZmTI2JDFW5D7851X1X0",
        uKey: "09dd48738567661a6f0277a2d55dfd0fcdb564379a73c2d77ad3f34e192a8517"
    }
    // https://kyfw.12306.cn/otn/confirmPassenger/queryOrderWaitTime?random=1738449461084&tourFlag=dc&_json_att=&REPEAT_SUBMIT_TOKEN=76f61ed38b664a6e27fdc995bda2c95b
    // 提交订单接口
    // https://kyfw.12306.cn/otn/payOrder/init?random=1738449475247
    let submitUrl = "https://kyfw.12306.cn/otn/confirmPassenger/queryOrderWaitTime";
    let submitPar = {
        random:1738449461084,
        tourFlag:"dc",
        _json_att:null,
        REPEAT_SUBMIT_TOKEN:"76f61ed38b664a6e27fdc995bda2c95b"
    }
}

init();