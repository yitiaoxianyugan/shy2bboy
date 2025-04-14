import { chromium } from "@playwright/test";
import path from "path";
import url from "url";
import os from "os";

const _filename = url.fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const browser = await chromium.launch();
const context = await createContext();
// 获取系统信息、判断系统类型
const systemInfo = await getSystemInfo();
// 前端域名
const webDomain = "https://www.xiaohongshu.com/explore";

