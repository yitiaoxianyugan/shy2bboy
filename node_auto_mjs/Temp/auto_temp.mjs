// 平台:temp
// 问题:
import { chromium } from "@playwright/test";
import path from "path";
import url from "url";
import fs from "fs";
import axios from "axios";
import os from "os";
import { spawn } from "child_process";
import clipboardy from "clipboardy";

/**
 * 无需更改
 */
// 获取系统信息、判断系统类型
const systemInfo = await getSystemInfo();
// 获取当前文件目录名和文件名
const _filename = url.fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
// 初始化浏览器实例
const browser = await chromium.launch({
    product: 'microsoftedge',
    headless: false,
});
const context = await createContext();


/**
 * 需要更改
 */
// 前端域名
const webDomain = "https://clm5.clmapp1.xyz/oneindex.php";
// 话术
const huashu = "FSDSS";
// 计数
let count = 0;
// 运行
run();

async function run() {
    const page = await openNewPage(webDomain);
    await page.waitForTimeout(2000);
    const input = await page.$('div.SearchForm_input_wrapper input#SearchForm_keyword');
    const search = await page.$('div#SearchForm_submit_btn_wrapper i.iconfont.icon-guanbi1');
    await setCode(page, huashu);
    await input.click();
    await pasteCode(page);
    await search.click();
    await page.waitForTimeout(2000);
    const fh = await page.$('div.Search_nav a:last-child');
    await fh.click();
    await page.waitForTimeout(2000);
    const searchTip = await page.evaluate(() => {
        const companyNames = document.querySelectorAll("div.Search_tip b");
        const tip = Array.from(companyNames).map((obj) => {
            return obj.textContent.trim()
        });
        return tip;
    });
    let pageNoge = 1;
    let pageTotal = searchTip[2];
    if (pageNoge <= pageTotal) {
        const currentData = await page.evaluate(() => {
            const companyNames = document.querySelectorAll("li div.Search_title_wrapper a");
            const lis = Array.from(companyNames).map((obj) => {
                return {
                    v_id:obj.id.trim(),
                    href:obj.href.trim(),
                    name:obj.textContent.trim()
                }
            });
            return lis;
        });
        processPage(currentData);
        pageNoge += 1;
    }
    console.log("没有更多数据了");
    // 关闭页面
    // await page.close();
    // 关闭浏览器
    // await context.close();
    // await browser.close();

    // https://clm5.clmapp1.xyz/cllj.php?name=VjdwwW29RlNEU1M%3DNjdwwW24
    // https://clm5.clmapp1.xyz/cllj.php?name=VjdwwW29RlNEU1M=NjdwwW24&sort=one
    // https://clm5.clmapp1.xyz/cllj.php?name=VjdwwW29RlNEU1M=NjdwwW24&sort=one&page=2
    // const searchResult = await openNewPage(element.href);
    // let nextButtons = await page.$$('button.vui_button.vui_pagenation--btn.vui_pagenation--btn-side');
}
async function processPage(uniqueData) {
    let codepenDataStr = fs.readFileSync(`node_auto_mjs/Temp/codepenData.json`, "utf8");
    let codepenData = JSON.parse(codepenDataStr);
    // uniqueData.length
    for (let index = 0; index < 1; index++) {
        const element = uniqueData[index];
        const itemPage = await openNewPage(element.href);
        await itemPage.waitForTimeout(2000);
        if (!itemPage) {
            await new Promise((resolve) => setTimeout(resolve, 60000));
        }
        await itemPage.evaluate(() => {
            element["car_number"] = document.querySelector("div.info p span#sbm111").textContent.trim()
        });
        
        console.log("element",index,element);
    }
}
/**
 * 初始化浏览器实例
 * @returns
 */
async function createContext() {
    if (!browser) {
        throw new Error("Browser instance has not been initialized.");
    }
    // 创建一个新的浏览器上下文
    const context = await browser.newContext();
    return context;
}

// 以下代码无需更改
/**
 * 自动滚动函数
 * @param {*} page 
 */
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.documentElement.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    });
}
/**
 * 将文本内容写入剪贴板中
 * @param {*} page
 */
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
/**
 * 复制代码
 * @param {*} page
 */
async function copyCode(page) {
    let dvc = systemInfo;
    if (dvc === "Mac") {
        //全选
        await page.keyboard.down("Meta");
        await page.keyboard.press("A");
        await page.keyboard.up("Meta");
        await page.waitForTimeout(1000);
        //复制
        await page.keyboard.down("Meta");
        await page.keyboard.press("C");
        await page.keyboard.up("Meta");
    } else {
        //全选
        await page.keyboard.down("Control");
        await page.keyboard.press("A");
        await page.keyboard.up("Control");
        await page.waitForTimeout(1000);
        //复制
        await page.keyboard.down("Control");
        await page.keyboard.press("C");
        await page.keyboard.up("Control");
    }

    await page.waitForTimeout(2000);
}
/**
 * 复制图片
 * @param {*} imagePath 
 */
function copyImageToClipboard(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString("base64");

        clipboardy.writeSync(base64Image);
    } catch (err) {
        console.error("复制到剪贴板失败:", err);
    }
}
/**
 * 获取剪贴板中的内容
 * @param {*} page
 */
async function getClipboardContent(page) {
    await page.evaluate(() => {
        const input = document.createElement("textarea");
        input.setAttribute("id", "myInput");
        document.body.appendChild(input);
    });
    await page.waitForSelector('textarea[id="myInput"]');
    await page.focus('textarea[id="myInput"]');
    await pasteCode(page);
    await page.waitForTimeout(500);
    let content = await page.$eval(
        'textarea[id="myInput"]',
        (textarea) => textarea.value
    );
    return content;
}
/**
 * 粘贴代码
 * @param {*} page
 */
async function pasteCode(page) {
    //获取系统信息    // 判断系统类型
    let dvc = systemInfo;

    // 全选并删除旧的代码
    await page.keyboard.down(dvc === "Mac" ? "Meta" : "Control");
    await page.keyboard.press("A");
    await page.keyboard.up(dvc === "Mac" ? "Meta" : "Control");
    await page.keyboard.press("Backspace");

    // 等待一小段时间，确保剪贴板中的文本已经准备好
    await page.waitForTimeout(100);

    // 粘贴代码
    await page.keyboard.down(dvc === "Mac" ? "Meta" : "Control");
    await page.keyboard.press("KeyV");
    await page.keyboard.up(dvc === "Mac" ? "Meta" : "Control");

    // 等待一小段时间，确保代码已经粘贴到页面中
    await page.waitForTimeout(500);
}
/**
 * 生成6位随机数
 * @param {*} length
 */
function generateRandomString(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}
/**
 * 判断当前操作系统
 * @returns 
 */
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
/**
 * 打开新页面
 */
async function openNewPage(pageUrl) {
    const page = await context.newPage();
    page.setDefaultTimeout(24 * 60 * 60 * 1000);
    await page.setViewportSize({ width: 640, height: 600 });
    const timeout = 60 * 1000;
    try {
        await page.goto(pageUrl, { timeout });
    } catch (error) {
        console.log("页面加载超时，正在重新加载页面...");
        await page.reload();
    }
    // await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);
    return page;
}