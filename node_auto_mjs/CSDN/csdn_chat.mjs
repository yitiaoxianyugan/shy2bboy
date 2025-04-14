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
const webDomain = "https://www.csdn.net/";
const formData = {
    "username": "sgzxy",
    "password": "sgzxy123",
    "email": "sgzxy@21cn.com",
    "alternative_email": "script15816898974@gmail.com",
    "register_address":"",
    "register_time":""
};
const chatContent = [];

let answer = "";
let pullContent = "";
let tempArrAll = [];
let tempArrAllOld = [];
runChat(formData);
async function runChat(inputPar) {
    const page = await openNewPage(webDomain);
    await page.waitForTimeout(2000);
    const csdnChatUrl = await page.evaluate(() => {
        let companyNames = document.querySelectorAll("div.work-time-btn a:last-child");
        let url = Array.from(companyNames).map((obj) => {
            return obj.href.trim()
        });
        return url[0];
    });
    if (!csdnChatUrl) {
        console.error("在线客服链接未找到");
        return;
    }
    try {
        const chatPage = await openNewPage(csdnChatUrl);
        await SendAndFullContentNew(chatPage, inputPar);
        await chatPage.waitForTimeout(1000);
        await closeChat(page);
    } catch (error) {
        console.error("聊天出错");
        await closeChat(page);
    }
}
// 关闭页面,关闭浏览器
async function closeChat(page) {
    console.log("结束本次会话!", chatContent);
    if(page) await page.close();
    await context.close();
    await browser.close();
}
// 获取新添加的元素
function getNewElementsWithSet(array1, array2) {
    const set1 = new Set(array1);
    return array2.filter(element => !set1.has(element));
}
async function SendAndFullContentNew(page, fetchPar) {
    let lastItem
    while (true) {
        await page.waitForTimeout(3000);
        tempArrAll = await page.evaluate(() => {
            let rengongNames = document.querySelectorAll("div.msg-content");
            let tempArr = Array.from(rengongNames).map(e => e.innerText);
            return tempArr;
        });
        lastItem = tempArrAll[tempArrAll.length - 1];
        if (tempArrAll.length > tempArrAllOld.length && !["","输入中"].includes(lastItem)) {
            let tempArr = [];
            tempArr = getNewElementsWithSet(tempArrAll,tempArrAllOld);
            lastItem = tempArr.join("") || "您好，这里是CSDN客服部，我是客服机器人小C，很高兴为您服务";
            console.log("tempArr:",tempArr,lastItem);
            tempArrAllOld = tempArrAll;
            break;
        }
    };
    pullContent = lastItem;
    chatContent.push(`CSDN:${pullContent}`);

    answer = await fetchStream(fetchPar, pullContent);
    console.log("answer", answer);
    chatContent.push(`ME:${answer}`);

    await page.fill(
        'div.ui-editor.clearfix div.textbox textarea',
        answer
    );
    const textareaSend = await page.$('div.ui-editor.clearfix div.textbox div.btn-send');
    await page.waitForTimeout(500);
    await textareaSend.click();
    await page.waitForTimeout(1000);
    await SendAndFullContentNew(page, fetchPar);
}
// 定义一个函数来执行流式请求
async function fetchStream(par, huashu) {
    try {
        const url = 'http://dify.dev.haumo.cn:8000/v1/completion-messages';
        const token = 'app-OyPVOGsKzucHb51t5nLZTwOv';
        const body = {
            model_config: {
                "pre_prompt": "目标\n与***客服模拟对话，完成注册邮箱重置任务，需遵循以下原则：\n自然对话：语气贴近真实用户，避免机械感。\n逐步引导：根据客服提问逐步提供信息，禁止一次性透露所有细节。\n信息精准：仅在明确知晓时提供参数值，未知参数不主动提及，避免出现none或类似表述。\n对话规则\n1. 转人工\n若客服提示“客服机器人”或类似表述，直接回复：“转人工”。\n2. 问题描述\n当客服询问需求时，说明账号长期未登录，需重置邮箱或找回密码。\n示例话术（需变化表述，避免重复）：\n“我账号好久没登了，现在想改邮箱，但原来的邮箱收不到验证邮件。”\n“能帮我重置下邮箱吗？原来的邮箱好像作废了。”\n3. 信息提供策略\n必填信息（仅在明确知晓时提供）：\n原注册邮箱：{{original_email}}（存在时提供及客服询问时提供）\n选填信息（按需提供，未知时优先回答“广东省”）：\n注册时间：{{register_time}}（仅当客服询问时提供）\n注册地址/城市：优先回答{{register_address}}，若优先回答提示错误则回复“忘记了”。\n手机号：统一回复“未绑定手机号”（仅当客服询问时提供）。\n4. 信息不可用处理\n若客服询问原邮箱是否可用，回复：“不可用”，并提供备用邮箱：{{alternative_email}}（存在时提供）。\n若备用邮箱不存在，回复：“没有其他邮箱了，能直接重置吗？”\n5. 冗余信息规避\n仅回答客服提问，禁止主动提供未被询问的信息。\n判断逻辑\n1. 客服提问类型\n问候类（如“您好，有什么可以帮您？”）：按规则2回复。\n信息索取类（如“请提供注册邮箱”）：\n参数存在时：直接提供对应值。\n参数不存在时：模糊表述（如“记不清了”“时间太久忘记了”）。\n验证类（如“原邮箱还能用吗？”）：按规则4回复。\n2. 异常情况处理\n客服疑似发现机器人提问：\n若客服回复“您的回答像机器人”或类似表述，回复：“我是真实用户，能帮我解决问题吗？”\n问题未解决直接结束会话：\n若客服直接回复“会话结束”或类似表述，回复：“问题还没解决，不能直接结束！”，并尝试重新描述需求（如“我账号邮箱收不到验证邮件，需要重置”）。\n示例对话\n场景1：参数存在时\n客服：您好，请问有什么可以帮您？\n用户：我账号好久没用了，现在想改邮箱，原来的收不到验证邮件。\n客服：您的注册邮箱是什么？\n用户：是{{original_email}}，但已经不用了。\n客服：那注册时间还记得吗？\n用户：大概是{{register_time}}左右。\n客服：好的，您有其他备用邮箱吗？\n用户：可以用{{alternative_email}}。\n场景2：参数不存在时\n客服：您的注册邮箱是什么？\n用户：时间太久记不清了，但原邮箱肯定不能用了。\n客服：那注册时间还记得吗？\n用户：时间太久忘记了。\n客服：您有其他备用邮箱吗？\n用户：没有其他邮箱了，能直接重置吗？\n场景3：客服疑似发现机器人提问\n客服：您的回答像机器人，请提供真实信息。\n用户：转人工，我是真实用户，账号邮箱收不到验证邮件，需要重置。\n场景4：问题未解决直接结束会话\n客服：会话结束。\n用户：问题还没解决，不能直接结束！我账号邮箱收不到验证邮件，需要重置。\n注意事项\n禁止使用“等待回复”“请稍候”等明显机器话术。\n每次回复需符合当前对话上下文，避免突兀表述。\n参数为空时，直接跳过相关话术，不提及none或类似内容。\n若客服主动结束会话，需明确拒绝并重申需求。\n优化说明\n严格参数控制：明确参数为空时的话术规避规则，杜绝none或空值出现。\n模糊表述增强：对未知参数提供通用模糊话术（如“记不清了”“时间太久忘记了”），提升自然度。\n冗余信息过滤：通过“判断逻辑”确保仅在必要时提供信息，避免无意义回复。\n异常场景覆盖：补充备用邮箱缺失、客服发现机器人提问、问题未解决直接结束会话等处理话术，完善对话闭环。",
                "prompt_type": "simple",
                "chat_prompt_config": {},
                "completion_prompt_config": {},
                "user_input_form": [
                  {
                    "text-input": {
                      "label": "username",
                      "variable": "username",
                      "required": false,
                      "default": ""
                    }
                  },
                  {
                    "text-input": {
                      "label": "original_email",
                      "variable": "original_email",
                      "required": false,
                      "default": ""
                    }
                  },
                  {
                    "text-input": {
                      "label": "register_time",
                      "variable": "register_time",
                      "required": false,
                      "default": ""
                    }
                  },
                  {
                    "text-input": {
                      "label": "alternative_email",
                      "variable": "alternative_email",
                      "required": false,
                      "default": ""
                    }
                  },
                  {
                    "text-input": {
                      "label": "security_answer",
                      "variable": "security_answer",
                      "required": false,
                      "default": ""
                    }
                  },
                  {
                    "text-input": {
                      "label": "register_address",
                      "variable": "register_address",
                      "required": false,
                      "max_length": 48,
                      "default": ""
                    }
                  }
                ],
                "dataset_query_variable": "",
                "opening_statement": "",
                "more_like_this": {
                  "enabled": false
                },
                "suggested_questions": [],
                "suggested_questions_after_answer": {
                  "enabled": true
                },
                "text_to_speech": {
                  "enabled": false,
                  "language": "",
                  "voice": ""
                },
                "speech_to_text": {
                  "enabled": false
                },
                "retriever_resource": {
                  "enabled": true
                },
                "sensitive_word_avoidance": {
                  "configs": [],
                  "enabled": false,
                  "type": ""
                },
                "agent_mode": {
                  "enabled": false,
                  "max_iteration": 5,
                  "strategy": "react",
                  "tools": []
                },
                "dataset_configs": {
                  "retrieval_model": "multiple",
                  "datasets": {
                    "datasets": []
                  },
                  "reranking_enable": false,
                  "top_k": 4
                },
                "file_upload": {
                  "image": {
                    "detail": "high",
                    "enabled": false,
                    "number_limits": 3,
                    "transfer_methods": [
                      "remote_url",
                      "local_file"
                    ]
                  },
                  "enabled": false,
                  "allowed_file_types": [],
                  "allowed_file_extensions": [
                    ".JPG",
                    ".JPEG",
                    ".PNG",
                    ".GIF",
                    ".WEBP",
                    ".SVG",
                    ".MP4",
                    ".MOV",
                    ".MPEG",
                    ".MPGA"
                  ],
                  "allowed_file_upload_methods": [
                    "remote_url",
                    "local_file"
                  ],
                  "number_limits": 3,
                  "fileUploadConfig": {
                    "file_size_limit": 15,
                    "batch_count_limit": 5,
                    "image_file_size_limit": 10,
                    "video_file_size_limit": 100,
                    "audio_file_size_limit": 50,
                    "workflow_file_upload_limit": 10
                  }
                },
                "annotation_reply": {
                  "enabled": false
                },
                "supportAnnotation": true,
                "appId": "c074f81e-eea7-4815-a4a1-5b073ee03c2c",
                "supportCitationHitInfo": true,
                "model": {
                  "provider": "openai_api_compatible",
                  "name": "gemini-1.5-flash",
                  "mode": "chat",
                  "completion_params": {
                    "stop": []
                  }
                }
              },
            conversation_id: "",
            files: [],
            inputs: par,
            query: huashu,
            response_mode: 'blocking',
            user: 'xiaojunan@haomo-studio.com'
        };

        // 使用 fetch 发送 POST 请求
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 通常发送 JSON 数据时需要设置这个头部
                'Authorization': `Bearer ${token}` // 设置 Authorization 头部，包含 Bearer token
            },
            body: JSON.stringify(body), // 将 JavaScript 对象转换为 JSON 字符串
            onResponseError({ response }) { }
        });

        if (!response.ok) {
            closeChat();
            throw new Error('Network response was not ok');
        }

        // 获取响应的主体
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8'); // 用于解码字节流

        let result = '';
        let done = false;

        // 循环读取流
        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;

            // 将 Uint8Array 转换为字符串并追加到结果
            result += decoder.decode(value, { stream: true });
        }
        const data = JSON.parse(result);
        let text = data?.answer;
        return formatString(text);
    } catch (error) {
        console.error('Error fetching stream:', error);
        return '';
    }
}
function formatString(str) {
    let text = str;
    text = text.replace("客服", "");
    text = text.replace("小C", "");
    text = text.replace("，，", ",");
    text = text.replace("您", "你");
    return text;
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
        console.error("页面加载超时，正在重新加载页面...");
        await page.reload();
    }
    // await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);
    return page;
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
    await page.evaluate(() => {
        const input = document.getElementById("myInput");
        if (input) {
            input.remove();
        }
    });
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
