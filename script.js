const chat = document.getElementById("chat");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

let botImgURL = "images/bot.png";
let userImgURL = "images/user.png";
let chatImages = [];

document.getElementById("botAvatarInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    botImgURL = URL.createObjectURL(file);
    document.getElementById("botAvatar").src = botImgURL;
  }
});

document.getElementById("userAvatarInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) userImgURL = URL.createObjectURL(file);
});

document.getElementById("chatImagesInput").addEventListener("change", (e) => {
  chatImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
});

generateBtn.onclick = async () => {
  const botName = document.getElementById("botName").value || "Bot";
  const userName = document.getElementById("userName").value || "You";
  const conversation = document.getElementById("conversationInput").value.trim();
  const lines = conversation.split("\n").filter(line => line.trim() !== "");

  document.getElementById("botHeader").textContent = botName;
  chat.innerHTML = "";
  let imgIndex = 0;

  for (let line of lines) {
    const sender = line.startsWith(userName + ":") ? "user" : "bot";
    const content = line.substring(line.indexOf(":") + 1).trim();

    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${sender}`;

    const avatar = document.createElement("img");
    avatar.src = sender === "user" ? userImgURL : botImgURL;
    avatar.className = "avatar";

    const bubble = document.createElement("div");
    bubble.className = `message ${sender}`;

    if (content.toLowerCase().includes("[image]") && chatImages[imgIndex]) {
      const img = document.createElement("img");
      img.src = chatImages[imgIndex++];
      img.className = "media";
      bubble.appendChild(img);
    } else {
      bubble.textContent = content;
    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    chat.appendChild(wrapper);

    await new Promise(resolve => setTimeout(resolve, 1200));
    chat.scrollTop = chat.scrollHeight;
    function scrollToBottom() {
      chat.scrollTop = chat.scrollHeight;
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    scrollToBottom();

  }
};

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
    a.download = "chat_video.webm";
    a.click();
  };

  recorder.start();

  // Stop recording after chat finishes displaying + 3s
  setTimeout(() => recorder.stop(), (chat.children.length * 1200) + 3000);
};
