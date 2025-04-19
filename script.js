const inputSection = document.getElementById("inputSection");
const chatSection = document.getElementById("chatSection");
const chat = document.getElementById("chat");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

generateBtn.onclick = async () => {
  const inputText = document.getElementById("conversationInput").value.trim();
  const userName = document.getElementById("userName").value.trim();
  const botName = document.getElementById("botName").value.trim();
  const chatTitle = document.getElementById("chatTitle");

  if (!inputText || !userName || !botName) {
    alert("Please fill all fields!");
    return;
  }

  chat.innerHTML = "";
  chatTitle.textContent = botName;

  const lines = inputText.split("\n");

  inputSection.style.display = "none";
  chatSection.style.display = "flex";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^([A-Za-z]+):\s*(.+)$/);
    if (!match) continue;

    const name = match[1];
    const message = match[2];
    const sender = name.toLowerCase() === userName.toLowerCase() ? "user" : "bot";

    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${sender}`;
    wrapper.style.animationDelay = `${i * 0.5}s`;

    const avatar = document.createElement("img");
    avatar.src = sender === "user" ? "images/user.png" : "images/bot.png";
    avatar.className = "avatar";

    const bubble = document.createElement("div");
    bubble.className = `message ${sender}`;
    bubble.textContent = message;

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    chat.appendChild(wrapper);

    // Delay between messages
    await new Promise(resolve => setTimeout(resolve, 500));
    chat.scrollTop = chat.scrollHeight;
  }
};

// Download chat as video
downloadBtn.onclick = () => {
  const chatWrapper = document.querySelector(".chat-wrapper");
  const stream = chatWrapper.captureStream(30);
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  recorder.ondataavailable = e => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "chat_recording.webm";
    a.click();
  };

  recorder.start();
  setTimeout(() => recorder.stop(), 4000); // Adjust recording length if needed
};
