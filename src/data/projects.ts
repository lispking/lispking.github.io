export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  demo: string;
  type: 'personal' | 'contributed';
}

export const personalProjects: Project[] = [
  {
    title: "Gas Dog",
    description: "一个Monad链Gas费用分析工具，帮助用户追踪和分析Monad网络上的Gas消耗情况。",
    image: "/images/projects/gas-dog.svg",
    tags: ["Web3", "React", "TypeScript", "Monad"],
    github: "https://github.com/lispking/gas-dog",
    demo: "https://gas-dog.netlify.app",
    type: "personal",
  },
  {
    title: "Rust Tips",
    description: "分享实用的 Rust 编程技巧和示例代码，帮助开发者提升 Rust 编程技能。深耕技术领域，将知识分享给更多人。",
    image: "/images/projects/rust-tips.svg",
    tags: ["Rust", "技术分享", "教程"],
    github: "https://github.com/lispking/rust-tips",
    demo: "https://github.com/lispking/rust-tips",
    type: "personal",
  },
  {
    title: "Browser JSON",
    description: "一个美观、实用的 Chrome 扩展，用于格式化和高亮显示JSON内容。",
    image: "/images/projects/browser-json.svg",
    tags: ["Chrome扩展", "JavaScript", "JSON"],
    github: "https://github.com/lispking/browser-json",
    demo: "https://github.com/lispking/browser-json",
    type: "personal",
  },
  {
    title: "Browser Proxy",
    description: "一个简单的 Chrome 浏览器代理管理插件，可以帮助用户快速切换和管理代理设置。",
    image: "/images/projects/browser-proxy.svg",
    tags: ["Chrome扩展", "JavaScript", "浏览器代理"],
    github: "https://github.com/lispking/browser-proxy",
    demo: "https://github.com/lispking/browser-proxy",
    type: "personal",
  },
];

export const contributedProjects: Project[] = [
  {
    title: "OHW",
    description: "OHW ELF是一款开源硬件钱包，打破供应商锁定的限制，支持来自多家制造商的数百种芯片，其中最低成本的芯片仅售0.3美元。它兼容性强，适配多种硬件架构，针对资源受限设备优化，从设计之初就将安全性纳入考量。此外，还提供蓝牙、WiFi功能及屏幕等可选配置，能满足多样化需求 。 ",
    image: "/images/projects/ohw.svg",
    tags: ["Infrastructure", "Rust", "TypeScript", "C", "OpenBuild"],
    github: "https://github.com/butterfly-communtiy/",
    demo: "https://ohw-app.vercel.app/",
    type: "contributed",
  },
  {
    title: "Amphitheatre",
    description: "Amphitheatre是一个开源开发者平台，全力助推应用程序与微服务的持续开发进程。借助它，你能够在本地对应用程序源代码进行迭代优化，随后轻松将其部署至本地或远程的Kubernetes集群，操作过程如同执行“docker build && kubectl apply” 或 “docker-compose up”这般便捷流畅。 ",
    image: "/images/projects/amphitheatre.png",
    tags: ["Infrastructure", "Rust", "TypeScript", "Go", "OpenBuild"],
    github: "https://github.com/amphitheatre-app",
    demo: "https://amphitheatre.app",
    type: "contributed",
  },
  {
    title: "Sui",
    description: "Sui 是一个下一代智能合约平台，具有高吞吐量、低延迟的特点，并且拥有一个由 Move 编程语言驱动的面向资产的编程模型。",
    image: "/images/projects/sui.svg",
    tags: ["Blockchain", "Rust", "Sui", "Move"],
    github: "https://github.com/mystenLabs/sui",
    demo: "https://sui.io",
    type: "contributed",
  },
  {
    title: "Rooch",
    description: "Rooch是一种适用于比特币生态系统、采用Move语言的虚拟应用程序容器。 ",
    image: "/images/projects/rooch.webp",
    tags: ["Blockchain", "Rust", "Bitcoin", "Move"],
    github: "https://github.com/rooch-network/rooch",
    demo: "https://rooch.network/",
    type: "contributed",
  },
  {
    title: "Rig",
    description: "Rig是一个Rust库，用于构建可扩展、模块化且符合人体工程学（即易用性好）的大语言模型驱动的应用程序。 ",
    image: "/images/projects/rig.svg",
    tags: ["AI Agent", "Rust"],
    github: "https://github.com/0xPlaygrounds/rig",
    demo: "https://rig.rs/",
    type: "contributed",
  },
  {
    title: "Eliza 🤖",
    description: "Eliza 是一个简单、快速且轻量级的人工智能代理框架。为所有人提供灵活、可扩展的人工智能代理。  ",
    image: "/images/projects/eliza.png",
    tags: ["AI Agent", "TypeScript"],
    github: "https://github.com/elizaos/eliza",
    demo: "https://elizaos.github.io/eliza",
    type: "contributed",
  },
];
