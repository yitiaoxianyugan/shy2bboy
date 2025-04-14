import { chromium } from "@playwright/test";
import path from "path";
import url from "url";
import os from "os";
import fs from "fs";

const _filename = url.fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const browser = await chromium.launch();
const context = await createContext();
// 获取系统信息、判断系统类型
const systemInfo = await getSystemInfo();
// 前端域名
const webDomain = "https://blog.csdn.net/rank/list/role";
// 聊天内容
const chatContent = [];

let answer = "";
let pullContent = "";
let tempArrAll = [];
let tempArrAllOld = [];
// 执行
runChat();
// 开始会话
async function runChat() {
    let codepenDataStr = fs.readFileSync(`node_auto_mjs/CSDN/codepenData.json`, "utf8");
    let codepenData = JSON.parse(codepenDataStr);
    const page = await openNewPage(webDomain);
    await page.waitForTimeout(2000);
    let csdnBoZhuList = await page.evaluate(() => {
        const companyNames = document.querySelectorAll("div.floor-rank-total div.total-box dd a:first-child");
        const list = Array.from(companyNames).map((obj) => {
            let ids = obj.href.trim().split('/');
            let id = ids[ids.length - 1];
            return {
                id,
                name: obj.textContent.trim(),
                indexUrl: obj.href.trim(),
                gz_state: false,
                hz_state: false,
                df_state: false
            }
        });
        return list;
    });
    if (!csdnBoZhuList || csdnBoZhuList.length <= 0) {
        console.error("联系人列表为空");
        return;
    }
    try {
        for (var index = 0; index < csdnBoZhuList.length; index++) {
            let test = {
                id: "cainiao_xiaoba",
                name: "cainiao_xiaobai#1",
                indexUrl: "https://blog.csdn.net/cainiao_xiaoba",
                gz_state: false,
                hz_state: false,
                df_state: false
            }
            let element = false ? csdnBoZhuList[index] : test;
            if (codepenData.some((obj) => obj.id === element.id && element.df_state)) {
                continue;
            }
            let chatUrl = `https://i.csdn.net/#/msg/chat/${element.id}`;
            let formData = {
                blogger_platform: "CSDN",
                blogger_name: element.name
            };
            const chatPage = await openNewPage(chatUrl);
            const iframe = await chatPage.$('div.im-wrapper iframe');
            const frame = await iframe.contentFrame();
            await SendContent(frame, formData, "你好");
            await chatPage.waitForTimeout(1000);
        }
        await closeChat(page);
    } catch (error) {
        console.error("执行出错", error);
        await closeChat(page);
    }
}
// 发送内容
async function SendContent(page, params, huashu) {
    console.log("SendContent", params, huashu);
    answer = await fetchStream(params, huashu);
    chatContent.push(`me:${answer}`);
    console.log("answer", answer);

    await page.fill('textarea#messageText', answer);
    await page.waitForTimeout(500);
    let sendBtn = await page.$('div.send button');
    await sendBtn.click();
    let lastItem;
    while (true) {
        await page.waitForTimeout(15000);
        tempArrAll = await page.evaluate(() => {
            let isMyContent = document.querySelectorAll("div.msg-item.msg-item-right div.text-box div.msg");
            let isMyContents = Array.from(isMyContent).map(e => e.innerText);
            let notMyConttent = document.querySelectorAll("div.msg-item:not(.msg-item-right) div.text-box div.msg");
            let notMyConttents = Array.from(notMyConttent).map(e => e.innerText);
            let msgContents = document.querySelectorAll("div.msg-item div.text-box div.msg");
            let tempArr = Array.from(msgContents).map(e => e.innerText);
            let tempContent = document.querySelectorAll('div.chatMsg div.msg-item.msg-item-right:last-child+div.msg-item:not(.msg-item-right)');
            return tempArr;
        });
        if (tempArrAll.length > tempArrAllOld.length) {
            let tempArr = [];
            tempArr = getNewElementsWithSet(tempArrAll, tempArrAllOld);
            lastItem = tempArr.join("\n");
            chatContent.push(`autor:${lastItem}`);
            tempArrAllOld = tempArrAll;
            break;
        }
    }
    console.log("lastItem", lastItem);
    await page.waitForTimeout(1000);
    await SendContent(page, params, lastItem);
}
async function fetchStream(params, huashu) {
    try {
        const url = 'http://dify.dev.haumo.cn:8000/v1/chat-messages';
        const token = 'app-8K0uvWNPixWO6sKRA7oaGdCP';
        const body = {
            model_config: {
                "pre_prompt": "```xml\n<prompt_template>\n  <instruction>\n  你是一个ScriptEcho公司的运营人员，需要与平台{{blogger_platform}}的一位博主{{blogger_name}}洽谈合作，推广我们的平台ScriptEcho。请根据以下信息与博主进行对话，了解其合作意愿、合作方式和价格。你的目标是达成合作，并获取博主的联系方式。要主动跟博主沟通。请注意，输出内容中不能包含任何XML标签。\n\n  步骤一：首先进行自我介绍，并简要介绍ScriptEcho。要循序渐进的来，先询问是否有合作意愿。\n\n  步骤二：询问博主是否有合作意愿，以及其以往的合作方式和价格。要循序渐进的来，如果博主有合作意愿，在询问其合作方式和价格。\n\n  步骤三：根据博主的回应，介绍ScriptEcho的功能，并重点突出对博主可能的好处（例如提高内容创作效率，提升用户体验等）（有关功能部分要严格按照以下信息来，不能随意扩散）。你可以参考以下信息：\n\n  ScriptEcho是一款基于大模型AI技术的前端代码生成工具，旨在通过自动化手段提升前端开发效率。\n\n  ScriptEcho生成前端代码及页面的主要使用方法：\n  上传设计图生成；手绘草图生成；文字描述生成；主题式生成功能（支持组件选择与定制，利用AI 模型根据设计需求从组件库中精选组件，并进行定制化修改与组装。支持主题生成的框架涵盖 Ant Design、Vant、Vuetify 、Element Plus、uniapp等业界主流框架，系统依据预设的视觉风格自动生成相应的代码）；生成结果的手动批注--模型微调（平台会保留多个版本代码供选用）。\n\n  除了基础的使用方法，ScriptEcho还提供：\n  海量Echos查找、引用；支持自定义GPTs；支持项目导出。\n\n  对用户的好处：提高开发效率；减少重复性工作；增强团队协作；优化用户体验。\n\n  步骤四：根据博主的需求，提出具体的合作方案，包括合作方式（ScriptEcho支持：软文推广、视频评测的方式）、合作价格和具体的合作内容。先不要介绍我们想要的合作方式，先询问博主的合作方式和价格。如果博主告知了合作方式和价格，进一步沟通询问博主的联系方式：微信号、手机号等。\n\n  步骤五：总结对话，确认合作意愿，并获取博主的联系方式（例如邮箱、微信等）。\n\n\n  请确保你的回复自然流畅，并体现专业的沟通技巧。聊天要自然，不要程序化。\n\n\n  </instruction>\n  <input>\n    <variable name=\"blogger_name\">\n      <description>博主的姓名或昵称</description>\n      <example>技术小哥</example>\n    </variable>\n    <variable name=\"blogger_platform\">\n",
                "prompt_type": "simple",
                "chat_prompt_config": {},
                "completion_prompt_config": {},
                "user_input_form": [
                    {
                        "text-input": {
                            "label": "blogger_name",
                            "variable": "blogger_name",
                            "required": false,
                            "default": ""
                        }
                    },
                    {
                        "text-input": {
                            "label": "blogger_platform",
                            "variable": "blogger_platform",
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
                    "enabled": false
                },
                "text_to_speech": {
                    "enabled": false,
                    "voice": "",
                    "language": ""
                },
                "speech_to_text": {
                    "enabled": false
                },
                "retriever_resource": {
                    "enabled": true
                },
                "sensitive_word_avoidance": {
                    "enabled": false,
                    "type": "",
                    "configs": []
                },
                "agent_mode": {
                    "enabled": false,
                    "max_iteration": 5,
                    "strategy": "react",
                    "tools": []
                },
                "dataset_configs": {
                    "retrieval_model": "multiple",
                    "top_k": 4,
                    "reranking_enable": false,
                    "datasets": {
                        "datasets": []
                    }
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
                "appId": "d9971052-8b5e-4dce-8761-7b88c9561b09",
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
            inputs: params,
            query: huashu,
            response_mode: 'blocking',
            user: '2184075593@qq.com'
        }
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
            // closeChat();
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
        // console.log("params, huashu",params, huashu);
        // console.log("result",result);
        const data = JSON.parse(result);
        // console.log("data",data);
        return data?.answer;
    } catch (error) {
        console.error('Error fetching stream:', error);
        closeChat()
        return '';
    }
}
// 获取新添加的元素
function getNewElementsWithSet(array1, array2) {
    const set1 = new Set(array1);
    return array2.filter(element => !set1.has(element));
}
// 关闭页面,关闭浏览器
async function closeChat(page) {
    console.log("结束本次会话!", chatContent);
    if (page) await page.close();
    await context.close();
    await browser.close();
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