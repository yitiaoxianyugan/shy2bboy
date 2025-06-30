/*
 * 服务端实现 server.js
 */
const WebSocket = require('ws');
// 创建 WebSocket 服务器，监听 8080 端口
const wss = new WebSocket.Server({
	port: 8080
});
// 监听客户端连接事件
wss.on('connection', (ws) => {
	console.log('客户端已连接');
	// 监听客户端发送的消息
	ws.on('message', (message) => {
		console.log(`收到消息: ${message}`);
		// 向客户端发送响应
		ws.send(`服务器已收到消息: ${message}`);
		// 向所有客户端广播消息（除发送者外）
		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(`有新消息: ${message}`);
			}
		});
	});
	// 监听连接关闭事件
	ws.on('close', () => {
		console.log('客户端已断开连接');
	});
	// 监听错误事件
	ws.on('error', (error) => {
		console.error(`WebSocket 错误: ${error}`);
	});
	// 向客户端发送欢迎消息
	ws.send('欢迎连接到 WebSocket 服务器！');
});
console.log('WebSocket 服务器已启动，监听端口 8080');
/*
 * 客户端实现 client.js
 */
// 创建 WebSocket 连接
const socket = new WebSocket('ws://localhost:8080');
socket.onopen = () => {
	console.log('已连接到服务器'); // 监听连接建立事件
	socket.send('Hello, server!'); // 向服务器发送消息
};
// 监听服务器发送的消息
socket.onmessage = (event) => {
	console.log(`收到服务器消息: ${event.data}`);
	const messageElement = document.createElement('div'); // 在页面上显示消息
	messageElement.textContent = `服务器: ${event.data}`;
	document.body.appendChild(messageElement);
};
// 监听连接关闭事件
socket.onclose = (event) => {
	console.log(`连接已关闭，代码: ${event.code}，原因: ${event.reason}`);
};
// 监听错误事件
socket.onerror = (error) => {
	console.error(`WebSocket 错误: ${error}`);
};
// 创建一个函数用于从页面发送消息
function sendMessage() {
	const input = document.getElementById('messageInput');
	const message = input.value;

	if (message && socket.readyState === WebSocket.OPEN) {
		socket.send(message);
		input.value = '';
	}
}
/*
 * HTML 页面
 */
<
h1 > WebSocket 聊天 < /h1> <
input type = "text"
id = "messageInput"
placeholder = "输入消息..." >
	<
	button onclick = "sendMessage()" > 发送 < /button> <
script src = "client.js" > < /script>