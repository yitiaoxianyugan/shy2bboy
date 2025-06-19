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

// const webDomain = "https://www.12306.cn/index/index.html";
const webDomain = "https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=%E6%B7%B1%E5%9C%B3%E5%8C%97,IOQ&ts=%E5%8D%97%E6%98%8C,NCG&date=2025-01-25&flag=N,N,Y";
const fromUrl = extractDomainFromUrl(webDomain);
const cookies = [{
    name: 'uKey',
    value: '09dd48738567661a6f0277a2d55dfd0f38732000e63238cb93d2aab92fb43338',
    domain: fromUrl,
    // path: '/',
}, {
    name: 'tk',
    value: '6JcSjjAsZkKXlewEMvXcT_Cu8qH6Mqqn3MsZW2-riWE92X1X0',
    domain: fromUrl,
    // path: '/',
}];
const UserInfo = {
    user: "18770465658",
    pwd: "coolpad8076d",
    user_id_4: "4318"
};
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

// 账号登陆
async function Login(page) {
    let loginPage = null;
    if (page) {
        loginPage = page
    } else {
        let loginUrl = "https://kyfw.12306.cn/otn/resources/login.html";
        loginPage = await openNewPage(loginUrl);
    }
    let accInput = await loginPage.$("div.login-account input#J-userName");
    let pwdInput = await loginPage.$("div.login-account input#J-password");
    let loginBtn = await loginPage.$("div.login-btn a.btn.btn-primary.form-block");
    await setCode(loginPage, UserInfo.user);
    await accInput.click();
    await pasteCode(loginPage);
    await setCode(loginPage, UserInfo.pwd);
    await pwdInput.click();
    await pasteCode(loginPage);
    await loginBtn.click();
    await loginPage.waitForTimeout(200);
    let loginRule = await loginPage.$("div.modal-login");
    if (loginRule) {
        let id_rule = await loginPage.$("input#id_card");
        let get_code = await loginPage.$("a#verification_code");
        await setCode(loginPage, UserInfo.user_id_4);
        await id_rule.click();
        await pasteCode(loginPage);
        await get_code.click();
        const intervalId = setInterval(async () => {
            const hasValue = await checkElementHasValue(loginPage, 'div.modal-login input#code');
            if (hasValue && hasValue.length >= 6) {
                clearInterval(intervalId);
                let sure_click = await loginPage.$("div.modal-login a#sureClick");
                await sure_click.click();
            }
        }, 1000);
    }
};
// 主页
async function Index(from, to, time, toIndex, rang) {
    if (!time) {
        time = moment().format('YYYY-MM-DD');
    } else {
        time = moment(time).format('YYYY-MM-DD');
    }
    // 购买单程票 
    // let dcUrl =`https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc`+
    // `&leftTicketDTO.from_station=${from}`+
    // `&leftTicketDTO.to_station=${to}`+
    // `&leftTicketDTO.train_date=${time}`;
    let dcUrl = `https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=${from},EUG&ts=${to},THG&date=${time}&flag=N,N,Y`;
    const dcPage = await openNewPage(dcUrl);
    // let search_btn = await dcPage.$("div.btn-area a#query_ticket");
    // await search_btn.click();
    console.log("toIndex", toIndex);
    if (toIndex && toIndex > -1) {
        let index = 2 * toIndex + 1;
        let scheduled_btn = await dcPage.$(`tbody#queryLeftTable tr:nth-child(${index}) td.no-br`);
        await scheduled_btn.click();
    }else{
        const [response] = await Promise.all([
            dcPage.waitForResponse('https://kyfw.12306.cn/otn/leftTicket/queryG?leftTicketDTO.train_date=2025-01-27&leftTicketDTO.from_station=EUG&leftTicketDTO.to_station=THG&purpose_codes=ADULT'),
            dcPage.goto(dcUrl)
        ]);
        const responseBody = await response.json();
        console.log("responseBody", responseBody); // 接口数据
        if (responseBody.httpstatus == '200') {
            let tempRes = [];
            tempRes = responseBody.data.result;
            tempRes.forEach((e, index) => {
                console.log("tempRes", e, index);
            })
    
        } else {
            await dcPage.evaluate(() => {
                const companyNames = document.querySelectorAll("tbody#queryLeftTable tr");
            });
        }
    }
    await Login(dcPage);
    // https://kyfw.12306.cn/otn/confirmPassenger/initDc
    await page.evaluate(() => {
        const per_list = document.querySelectorAll("div.per-sel div:last-child() ul#normal_passenger_id li label");
    });
    let submit_btn = await dcPage.$("div.dcPage a#submitOrder_id");
    await submit_btn.click();
    await dcPage.waitForTimeout(120000);
}
async function run() {
    const page = await openNewPage(webDomain);
    await page.waitForTimeout(1000);
    if (!page) {
        await new Promise((resolve) => setTimeout(resolve, 60000));
    }
    let tempUrl = "https://kyfw.12306.cn/otn/leftTicket/queryG?leftTicketDTO.train_date=2025-01-27&leftTicketDTO.from_station=EUG&leftTicketDTO.to_station=THG&purpose_codes=ADULT"
    const newPage = await openNewPage(tempUrl);
    Index()
}
let from_ads = "兴国";
let to_ads = "泰和";
let from_to_time = "2025-01-27";
let toIndex = 3
// Login(user,pwd,user_id_4);
Index(from_ads, to_ads, from_to_time, toIndex);
// run();