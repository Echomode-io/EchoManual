import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  title: "EchoMode",
  description:
    "Product guides and API reference for alignment-aware conversational AI.",
  srcDir: "content",
  cleanUrls: true,

  head: [
    ["link", { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "EchoMode Documentation" }],
    ["meta", { property: "og:description", content: "Product guides and API reference for alignment-aware conversational AI." }],
    ["meta", { property: "og:url", content: "https://developers.echomode.io" }],
  ],

  // Serve the repo-root `public/` (CNAME + User Manual screenshots) as static
  // assets. VitePress points Vite's root at `srcDir` (content/), whose default
  // public dir is generated and holds no images, so set it explicitly here.
  vite: {
    publicDir: fileURLToPath(new URL("../public", import.meta.url)),
  },

  themeConfig: {
    // Brand lockup (logomark + wordmark) replaces the text title in the nav.
    // Variants bake the app's --text-primary per theme; orange accent is shared.
    logo: {
      light: "/echomode-lockup-light.svg",
      dark: "/echomode-lockup-dark.svg",
      alt: "EchoMode",
    },
    siteTitle: false,

    nav: [
      { text: "User Manual", link: "/manual/" },
      { text: "API", link: "/api/" },
    ],

    sidebar: {
      "/manual/": [
        {
          text: "User Manual",
          items: [{ text: "Overview", link: "/manual/" }],
        },
        {
          text: "Getting Started",
          items: [
            { text: "Create your account", link: "/manual/getting-started/create-account" },
            { text: "A tour of the interface", link: "/manual/getting-started/interface-tour" },
          ],
        },
        {
          text: "Chatting",
          items: [
            { text: "Start a chat", link: "/manual/chatting/start-a-chat" },
            { text: "Choosing an agent", link: "/manual/chatting/choosing-an-agent" },
            { text: "Switching models", link: "/manual/chatting/switching-models" },
            { text: "Managing chats", link: "/manual/chatting/managing-chats" },
          ],
        },
        {
          text: "Understanding Drift",
          items: [
            { text: "What drift is", link: "/manual/understanding-drift/what-drift-is" },
            { text: "How Echo keeps you on-topic", link: "/manual/understanding-drift/how-echo-keeps-you-on-topic" },
            { text: "Reading the signals", link: "/manual/understanding-drift/reading-the-signals" },
          ],
        },
        {
          text: "Datarooms & Documents",
          items: [
            { text: "Create a dataroom", link: "/manual/datarooms/create-a-dataroom" },
            { text: "Upload & manage documents", link: "/manual/datarooms/upload-manage-documents" },
            { text: "Viewing a document", link: "/manual/datarooms/viewing-a-document" },
          ],
        },
        {
          text: "Knowledge Base",
          items: [
            { text: "How search works", link: "/manual/knowledge-base/how-search-works" },
            { text: "Configuring a document", link: "/manual/knowledge-base/configuring-a-document" },
          ],
        },
        {
          text: "Agents",
          items: [
            { text: "Agent library", link: "/manual/agents/agent-library" },
            { text: "Building an agent", link: "/manual/agents/agent-settings" },
            { text: "Versions & publishing", link: "/manual/agents/agent-versions" },
          ],
        },
        {
          text: "Teams & Organization",
          items: [
            { text: "Invite members", link: "/manual/teams/invite-members" },
            { text: "Roles & permissions", link: "/manual/teams/roles-and-permissions" },
            { text: "Org settings", link: "/manual/teams/org-settings" },
          ],
        },
        {
          text: "Account",
          items: [
            { text: "Profile & avatar", link: "/manual/account/profile-and-avatar" },
            { text: "Password", link: "/manual/account/password" },
            { text: "Usage limits", link: "/manual/account/usage-limits" },
          ],
        },
      ],

      "/api/": [
        {
          text: "API Reference",
          items: [
            { text: "Overview", link: "/api/" },
            { text: "Auth", link: "/api/auth" },
            { text: "Chat", link: "/api/chat" },
            { text: "Agents", link: "/api/agents" },
            { text: "Agent Drafts", link: "/api/agent-drafts" },
            { text: "Agent Eval", link: "/api/agent-eval" },
            { text: "API Keys", link: "/api/api-keys" },
            { text: "Documents", link: "/api/documents" },
            { text: "Folders", link: "/api/folders" },
            { text: "RAG Configuration", link: "/api/rag" },
            { text: "Connectors", link: "/api/connectors" },
            { text: "Echo Configuration", link: "/api/echo" },
            { text: "Anchor Words", link: "/api/anchor-words" },
            { text: "Jobs", link: "/api/jobs" },
            { text: "Inference", link: "/api/inference" },
            { text: "Logs", link: "/api/logs" },
            { text: "Teams", link: "/api/teams" },
            { text: "Users & Organization", link: "/api/entity" },
            { text: "Limits", link: "/api/limits" },
            { text: "Health", link: "/api/health" },
          ],
        },
      ],
    },

  },
});
