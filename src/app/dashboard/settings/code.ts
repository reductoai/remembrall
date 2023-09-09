import MarkdownIt from "markdown-it";
import {
  createDiffProcessor,
  createFocusProcessor,
  createHighlightProcessor,
  createRangeProcessor,
  defineProcessor,
  getHighlighter,
} from "shiki-processor";
import { preWrapperPlugin } from "~/lib/markdown/preWrapperPlugin";
import { join as pathJoin } from "path";
import * as fs from "fs/promises";

const getShikiPath = (): string => {
  return pathJoin(process.cwd(), "src/lib/shiki");
};

const touchShikiPath = (): void => {
  if (touched.current) return; // only need to do once
  fs.readdir(getShikiPath()); // fire and forget
  touched.current = true;
};

const touched = { current: false };

const CurlLogs = `
\`\`\`bash
curl https://api.openai.com/v1/chat/completions // [!code --] \\
curl https://remembrall.dev/api/openai/v1/chat/completions // [!code ++] \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "x-gp-api-key: $RMBR_API_KEY" // [!code ++] \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
`;

const JSLogs = `
\`\`\`js
fetch("https://api.openai.com/v1/chat/completions", { // [!code --]
fetch("https://remembrall.dev/api/openai/v1/chat/completions", { // [!code ++]
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
    "x-gp-api-key": \`\${process.env.RMBR_API_KEY}\`, // [!code ++]
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hello world" }],
  }),
})
\`\`\`
`;

const NodejsLogs = `

\`\`\`js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: "https://api.openai.com/v1",  // [!code --]
  basePath: "https://remembrall.dev/api/openai/v1",  // [!code ++]
  baseOptions: { // [!code ++:5]
    headers: {
      "x-gp-api-key": \`\${process.env.RMBR_API_KEY}\`,
    },
  }
});

const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello world" },
  ],
});
\`\`\`
`;

const PythonLogs = `
\`\`\`python
import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = "https://api.openai.com/v1"  // [!code --]
openai.api_base = "https://remembrall.dev/api/openai/v1"  // [!code ++]

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": "Hello!"}
  ],
  headers={
    "x-gp-api-key": os.getenv("RMBR_API_KEY"), // [!code ++]
  }
)

print(completion.choices[0].message)
\`\`\`
`;

const CurlUser = `
\`\`\`bash
curl https://api.openai.com/v1/chat/completions // [!code --] \\
curl https://remembrall.dev/api/openai/v1/chat/completions // [!code ++] \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "x-gp-api-key: $RMBR_API_KEY" // [!code ++] \\
  -H "x-gp-remember: myuser@example.com" // [!code ++] \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
`;

const JSUser = `
\`\`\`js
fetch("https://api.openai.com/v1/chat/completions", { // [!code --]
fetch("https://remembrall.dev/api/openai/v1/chat/completions", { // [!code ++]
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
    "x-gp-api-key": \`\${process.env.RMBR_API_KEY}\`, // [!code ++]
    "x-gp-remember": \`myuser@example.com\`, // [!code ++]
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hello world" }],
  }),
})
\`\`\`
`;

const NodejsUser = `

\`\`\`js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: "https://api.openai.com/v1",  // [!code --]
  basePath: "https://remembrall.dev/api/openai/v1",  // [!code ++]
  baseOptions: { // [!code ++:5]
    headers: {
      "x-gp-api-key": \`Bearer \${process.env.RMBR_API_KEY}\`,
      "x-gp-remember": \`myuser@example.com\`,
    },
  }
});

const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello world" },
  ],
});
\`\`\`
`;

const PythonUser = `
\`\`\`python
import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = "https://api.openai.com/v1"  // [!code --]
openai.api_base = "https://remembrall.dev/api/openai/v1"  // [!code ++]

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": "Hello!"}
  ],
  headers={
    "x-gp-api-key": os.getenv("RMBR_API_KEY"), // [!code ++]
    "x-gp-remember": "myuser@example.com", // [!code ++]
  }
)

print(completion.choices[0].message)
\`\`\`
`;

const highlighterConfig = {
  theme: "material-theme-palenight",
  processors: [
    createDiffProcessor(),
    createHighlightProcessor(),
    createFocusProcessor(),
    defineProcessor({
      name: "line",
      handler: createRangeProcessor({
        error: ["highlighted", "error"],
        warning: ["highlighted", "warning"],
      }),
      postProcess: ({ code }) => {
        const modifiedCode = code.replace(
          /(remembrall\.vercel\.app\/api)/g,
          '<span class="highlight-word">$1</span>'
        );
        // console.log("code", modifiedCode);
        return modifiedCode;
      },
    }),
  ],
  paths: {
    languages: `${getShikiPath()}/languages/`,
    themes: `${getShikiPath()}/themes/`,
  },
};

const markdownConfig = {
  html: true,
  linkify: true,
  typographer: true,
};

interface CodeResults {
  curl: string;
  js: string;
  nodejs: string;
  python: string;
}

interface Highlighter {
  codeToHtml: (
    code: string,
    options: { lang: string; theme?: string }
  ) => string;
}

let highlighterInstance: Highlighter | null = null;
let markdownItInstance: MarkdownIt | null = null;

async function getHighlighterInstance(): Promise<Highlighter> {
  touchShikiPath();

  if (!highlighterInstance) {
    highlighterInstance = await getHighlighter(highlighterConfig);
  }
  return highlighterInstance;
}

async function getMarkdownItInstance(): Promise<MarkdownIt> {
  if (!markdownItInstance) {
    const highlighter = await getHighlighterInstance();

    markdownItInstance = new MarkdownIt({
      ...markdownConfig,
      highlight: (code, lang) => highlighter.codeToHtml(code, { lang }),
    }).use(preWrapperPlugin);
  }

  return markdownItInstance;
}

export async function getUsersCode(): Promise<CodeResults> {
  const renderer = await getMarkdownItInstance();
  return {
    curl: renderer.render(CurlUser),
    js: renderer.render(JSUser),
    nodejs: renderer.render(NodejsUser),
    python: renderer.render(PythonUser),
  };
}

export async function getLogsCode(): Promise<CodeResults> {
  const renderer = await getMarkdownItInstance();
  return {
    curl: renderer.render(CurlLogs),
    js: renderer.render(JSLogs),
    nodejs: renderer.render(NodejsLogs),
    python: renderer.render(PythonLogs),
  };
}
