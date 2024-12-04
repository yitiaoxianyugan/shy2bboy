// 平台:CSDN
// 问题:私信界面是iframe嵌套,需要先获取iframe
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
// 获取当前文件目录名和文件名
const _filename = url.fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
// 初始化浏览器实例
const browser = await chromium.launch();
const context = await createContext();
// 获取系统信息、判断系统类型
const systemInfo = await getSystemInfo();

/**
 * 需要更改
 */
// 前端域名
const webDomain = "https://blog.csdn.net/?spm=1001.2100.3001.4477";
// 话术
const huashu = "您好!好高兴认识你!";
// 计数
let count = 0;

/**
 * waitForTimeout(3000) 等待时间(1000 = 1s;无法进行下一步可以调大一点)
 */

/**
 * 主任务入口
 * 页面数据依靠滚动加载更多
 */
async function run() {
    const page = await openNewPage(webDomain);
    await page.waitForTimeout(3000);
    
    let flag = true;
    let filteredUrlsArray = [];
    let filteredUrlsArrayOldLen = 0;
    while (flag !== false) {
        filteredUrlsArrayOldLen = filteredUrlsArray.length;
        // 页面滚动(120)一下
        await page.evaluate(() => {
            let totalHeight = 0;
            const distance = 120;
            const scrollHeight = document.documentElement.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            flag = true;
        });
        await page.waitForTimeout(1000);
        const filteredUrls = await processAndClosePages(page);
        await processPage(filteredUrls);
        filteredUrlsArray = [...filteredUrlsArray, ...filteredUrls];
        // 这次数据长度与上次数据长度一样,说明到底了
        if (filteredUrlsArray.length - filteredUrlsArrayOldLen == 0) {
            console.log("没有更多数据了");
            flag = false
        }
    }
    // 关闭页面
    await page.close();
    // 关闭浏览器
    await context.close();
    await browser.close();
}

/**
 * 获取页面中所有符合需要的数据
 */
async function processAndClosePages(page) {
    const filteredUrls = await page.evaluate(() => {
        const companyNames = document.querySelectorAll("div.active-blog div.operation-c a");
        const names = Array.from(companyNames).map((obj) => {
            let href = obj.href.trim();
            const myURL = new URL(href);
            const pathParts = myURL.pathname.split('/');
            const user_id = pathParts[pathParts.length - 1];
            return {
                "user_id":user_id,
                "href": href,
                "name": obj.textContent.trim()
            };
        });
        const data = names.map((item, index) => ({
            "user_id":item.user_id,
            "href": item.href.trim(),
            "name": item.name.trim(),
        }));
        return data;
    });
    return filteredUrls;
}

/**
 * 对获取的数据进行操作
 * 自定义操作
 */
async function processPage(uniqueData) {
    let codepenDataStr = fs.readFileSync(`node_auto_mjs/CSDN/csdn-codepenData.json`, "utf8");
    let codepenData = JSON.parse(codepenDataStr);
    for (let index = 0; index < uniqueData.length; index++) {
        const element = uniqueData[index];
        // 最好使用一个唯一值,避免同名情况
        if (codepenData.some((obj) => obj.user_id === element.user_id)) {
            continue;
        }
        // 这里图方便,直接打开私信页面
        let tempUrl = `https://i.csdn.net/#/msg/chat/${element.user_id}`
        const page = await openNewPage(tempUrl);
        await page.waitForTimeout(2000);
        if (!page) {
            await new Promise((resolve) => setTimeout(resolve, 60000));
        }
        // 由于私信操作被嵌套在iframe,只能先获取iframe内容
        const iframe = await page.$('div.im-wrapper iframe');
        const frame = await iframe.contentFrame();

        await frame.waitForTimeout(2000);
        const editBox = await frame.$('div.Editor textarea'); // 私信框css
        await setCode(page, huashu);
        await editBox.click();
        await pasteCode(page);
        await page.waitForTimeout(1000);

        /**
         * 可以通过快捷键直接发送消息
         * 没问题需解除注释
         */
        // await page.keyboard.down("Control");
        // await page.keyboard.press("Enter");

        await page.waitForTimeout(1000);
        await page.close();
        count += 1;
        element["id"] = count;
        console.log("发送成功", element.id, element.name);
        codepenData.push(element);
        fs.writeFileSync("node_auto_mjs/CSDN/csdn-codepenData.json", JSON.stringify(codepenData));
    }
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
 * 初始化浏览器实例
 * @returns
 */
async function createContext() {
    return await chromium.launchPersistentContext(
        path.join(_dirname, "../browser"),
        {
            headless: false,
            args: [
                "--disable-gpu",
                "--disable-software-rasterize",
                "--disable-blink-features=AutomationControlled",
            ],
        }
    );
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
    await page.setViewportSize({ width: 1440, height: 1200 });
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
run();
// openNewPage(webDomain) // 没有登录先执行这段登录

