import { chromium } from "@playwright/test";
import path from "path";
import url from "url";
import fs from "fs";
import os from "os";
import clipboardy from "clipboardy";

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
},{
    name: 'tk',
    value: '6JcSjjAsZkKXlewEMvXcT_Cu8qH6Mqqn3MsZW2-riWE92X1X0',
    domain: fromUrl,
    // path: '/',
}]
run();
async function run() {
    const page = await openNewPage(webDomain);
    await page.waitForTimeout(1000);
    if (!page) {
        await new Promise((resolve) => setTimeout(resolve, 60000));
    }
    await context.setCookie(cookies);
}
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