document.getElementById("run-btn").addEventListener("click", async () => {
  const query = document.getElementById("user-input").value;

  const models = ["chatgpt", "gemini", "grok"];
  for (const m of models) {
    document.getElementById(`res-${m}`).textContent = "loading...";
  }

  const responses = {};

  for (const model of models) {
    const res = await fetch("/.netlify/functions/proxy", {
      method: "POST",
      body: JSON.stringify({ model, query })
    });

    const data = await res.json();
    responses[model] = data.result;
    document.getElementById(`res-${model}`).textContent = data.result;
  }

  window.debateResponses = responses;
});

document.getElementById("judge-btn").addEventListener("click", async () => {
  const q = document.getElementById("user-input").value;
  const r = window.debateResponses;

  const judgePrompt = `
【タスク】
以下は ChatGPT / Gemini / Grok の回答である。
誤りを優先的に抽出し、曖昧な部分を危険ポイントとして提示し、
第三者専門家として最終結論を構造化して示せ。
甘やかし・称賛・慰め・理想論は禁止。

【質問】
${q}

【ChatGPTの回答】
${r.chatgpt}

【Geminiの回答】
${r.gemini}

【Grokの回答】
${r.grok}
  `;

  const res = await fetch("/.netlify/functions/proxy", {
    method: "POST",
    body: JSON.stringify({ model: "judge", query: judgePrompt })
  });

  const data = await res.json();
  document.getElementById("final-output").textContent = data.result;
});
