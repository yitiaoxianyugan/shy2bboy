import { chromium } from "@playwright/test";
import path from "path";
import url from "url";
import fs from "fs";
import XLSX from "xlsx";
import axios from "axios";
import os from "os";
import { spawn } from "child_process";
import clipboardy from "clipboardy";

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

const webDomain = "https://weixin.sogou.com/";
let huashu = ["github 硬件", "github 推荐", "github AI"];
let resultList = [];
run();
async function run() {
    for (let i = 0; i < huashu.length; i++) {
        let huashuItem = huashu[i];
        const page = await openNewPage(webDomain);
        if (!page) {
            await new Promise((resolve) => setTimeout(resolve, 6000));
        }
        const searchInput = await page.$('.search-in-box input.sec-input');
        const searchBtn = await page.$('.search-in-box .enter-input.article input');
        await setCode(page, huashuItem);
        await searchInput.focus();
        await pasteCode(page);
        await searchBtn.click();
        await page.waitForTimeout(500);
        let flag = await getSearchResult(page,huashuItem);
        while (flag == false) {
            await page.waitForTimeout(1000);
        }
    }
    const workbook = XLSX.readFile('node_auto_mjs/sougou_vx/resultData.xls');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const newData = XLSX.utils.json_to_sheet(resultList, { skipHeader: true });
    XLSX.utils.sheet_add_json(worksheet, resultList, { origin: -1, skipHeader: true });
    XLSX.writeFile(workbook, 'node_auto_mjs/sougou_vx/resultData.xls');
}
async function getSearchResult(page,huashuItemStr) {
    await page.waitForTimeout(1000);
    let tempList = [];
    tempList = await page.evaluate((huashuItemStr) => {
        const companyNames = document.querySelectorAll(".txt-box h3 a");
        const tip = Array.from(companyNames).map((obj) => {
            return {
                word:huashuItemStr,
                title: obj.textContent.trim(),
                href: obj.href.trim(),
            };
        });
        return tip;
    });
    resultList = [...resultList, ...tempList];
    let nextPageBtnHref = await page.evaluate(() => {
        const nextPageBtn = document.querySelector('#pagebar_container a#sogou_next');
        return nextPageBtn ? nextPageBtn.href : null;
    });
    let flagDom = await page.$("#pagebar_container span + a:not(#sogou_next)");
    await page.waitForTimeout(500);
    if (flagDom) {
        await page.close();
        const newpage = await openNewPage(nextPageBtnHref);
        await getSearchResult(newpage,huashuItemStr);
    } else {
        return false;
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
    await page.setViewportSize({ width: 1920, height: 1080 });
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