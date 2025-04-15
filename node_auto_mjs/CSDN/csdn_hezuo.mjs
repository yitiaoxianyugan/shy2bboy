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
let chatContent = [];

let tempArrAll = {};
let codepenDataStr = fs.readFileSync(`node_auto_mjs/CSDN/codepenData.json`, "utf8");
let codepenData = JSON.parse(codepenDataStr);
// 执行
runChat();
// 开始会话
async function runChat() {
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
    for (let index = 0; index < csdnBoZhuList.length; index++) {
        const element = csdnBoZhuList[index];
        await page.waitForTimeout(30000);
        processElement(element)
    }
    // 将处理单个元素的逻辑封装成异步函数  
    async function processElement(element) {
        if (codepenData.some((obj) => obj.id === element.id && element.df_state)) {
            return; // 跳过不需要处理的元素  
        }
        let chatUrl = `https://i.csdn.net/#/msg/chat/${element.id}`;
        let formData = {
            ...element,
            blogger_platform: "CSDN",
            blogger_name: element.name
        };
        const chatPage = await openNewPage(chatUrl);
        let iframe = await chatPage.$('div.im-wrapper iframe');
        if (!iframe) {
            await chatPage.waitForTimeout(30000);
            iframe = await chatPage.$('div.im-wrapper iframe'); // 重新尝试获取 iframe  
        }
        if (!iframe) {
            console.error("Failed to find iframe for element:", element);
            return;
        }
        const frame = await iframe.contentFrame();
        await SendContent(frame, formData, "你好");
        await chatPage.close();
    }
}
// 发送内容
async function SendContent(page, params, huashu) {
     const answer = await fetchStream(params, huashu);
    console.log("answer",answer);
    chatContent.push(`ME:${answer}`);
    await page.fill('textarea#messageText', answer);
    await page.waitForTimeout(500);
    let sendBtn = await page.$('div.send button');
    await sendBtn.click();
    let blessingPhrases = ["祝您生活愉快", "祝您一切顺利", "祝您工作顺利"];
    let tempFlag = blessingPhrases.some(phrase => answer.includes(phrase))
    if (tempFlag) {
        console.log(`结束 -- ${params.blogger_name} -- 对话,准备进入下一个:`);
        params.df_state = false;
        params.chatContent = chatContent;
        codepenData.push(params);
        fs.writeFileSync("node_auto_mjs/CSDN/codepenData.json", JSON.stringify(codepenData));
        await page.waitForTimeout(500);
        return false;
    }
    let lastItem;
    while (true) {
        await page.waitForTimeout(18000);
        let cTempArr = tempArrAll[params.id];
        cTempArr = await page.evaluate(() => {
            let tempArr = [];
            const chatContainer = document.querySelector('div.chatMsg');
            const allRightItems = chatContainer.querySelectorAll('div.msg-item.msg-item-right');

            if (allRightItems.length > 0) {
                const lastRightItem = allRightItems[allRightItems.length - 1];
                const allItems = chatContainer.querySelectorAll('.msg-item');
                const lastItemIndex = Array.from(allItems).indexOf(lastRightItem);

                // 找到最后一个右侧消息项之后的所有消息项
                const subsequentItems = Array.from(allItems).slice(lastItemIndex + 1);

                // 过滤出左侧消息项并添加高亮
                const leftItemsToHighlight = subsequentItems.filter(
                    item => !item.classList.contains('msg-item-right')
                );

                leftItemsToHighlight.forEach(item => {
                    item.classList.add('highlight-left');
                });
                const tempContainer = chatContainer.querySelectorAll('div.highlight-left div.text-box div.msg');
                tempArr = Array.from(tempContainer).map(e => e.innerText);
                leftItemsToHighlight.forEach(item => {
                    item.classList.remove('highlight-left');
                });
            }
            return tempArr;
        });
        if (cTempArr.length >= 1) {
            lastItem = cTempArr.join("\n");
            break;
        }
    }
    console.log("lastItem", lastItem);
    chatContent.push(`${params.blogger_name}:${lastItem}`);
    await page.waitForTimeout(1000);
    await SendContent(page, params, lastItem);
}
async function fetchStream(params, huashu) {
    try {
        const url = 'http://dify.dev.haumo.cn:8000/v1/chat-messages';
        const token = 'app-8K0uvWNPixWO6sKRA7oaGdCP';
        const body = {
            model_config: {
                "pre_prompt": '```xml<prompt_template>  <instruction>化一些，根据博主的问题回答相应的问题。  步骤一：首先发起对话,进行自我介绍，并简要介绍ScriptEcho。要循序渐进的来，先询问是否有合作意愿。其合作方式和价格。用户体验等）（有关功能部分要严格按照以下信息来，不能随意扩散）。你可以参考以下信息：https://scriptecho.cn/index.html  ScriptEcho生成前端代码及页面的主要使用方法：--模型微调（平台会保留多个版本代码供选用）。  除了基础的使用方法，ScriptEcho还提供：  海量Echos查找、引用；支持自定义GPTs；支持项目导出。  对用户的好处：提高开发效率；减少重复性工作；增强团队协作；优化用户体验。定价：19.9尝鲜版、39.9标准版、79.9专业版、119旗舰版式：微信号、手机号等。随时谨记聊天回复字数一定要控制在500字以内。告诉博主我们的客服微信号：smmkkk-  请确保你的回复自然流畅，并体现专业的沟通技巧。聊天要自然，不要程序化。</instruction><input><variable name="blogger_name"><description>博主的姓名或昵称</description><example>技术小哥</example></variable><variable name="blogger_platform">```',
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