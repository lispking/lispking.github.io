---
title: Robius：用 Rust 开发多平台应用
date: 2023-10-15 11:00:33
categories: Robius
tags: [Robius,Rust]
description: 本文重点介绍 Robius 的愿景和未来的一些规划，Robius 是一个完全开源的、去中心化的、由社区驱动的项目，旨在让 Rust 成为多平台应用开发的理想选择。 Robius 生态系统包括几个独立的项目，这些项目可以组合成一个完整的系统堆栈，实现跨多个平台的快速、无痛的纯 Rust 应用开发。
---

### 项目简介

Robius 是一个完全开源的、去中心化的、由社区驱动的项目，旨在让 Rust 成为多平台应用开发的理想选择。  

Robius 组织还作为一个非正式的工作组：一个友好、公开的空间，收集并讨论与改善和进一步推动 Rust 中的应用开发体验相关的资源。  

> 有问题吗？想加入我们吗？想贡献吗？
> 请加入我们在 [Matrix 聊天平台上的 Robius 社区](https://matrix.to/#/#robius:matrix.org)。

### 我们的愿景

我们相信 Rust 编程语言是下一代应用程序开发人员的正确选择，但是我们认为该语言生态系统需要更多的关注和照顾，以便使其在应用程序开发的世界中成为一个一流公民，尤其是在移动平台上。  

我们设想一个未来：  
1. Rust 开发人员可以在多种平台上创建安全、美观和健壮的应用程序，尤其是在移动平台上执行高效且性能优越。  
2. 使用其他语言的前端开发人员受到鼓励，尝试投身于 Rust 的世界，并实现无缝过渡体验，以克服通常与 Rust 相关的陡峭的学习曲线。  
3. Rust 生态系统得到拓展和加强，向其他领域的 Rust 专家展示 Rust 非常适合应用开发，不仅仅局限于低级系统和嵌入式编程。


### Robius的名字意味着什么？

Robius 的名字来源于拉丁语单词 [robius](http://latin-dictionary.net/definition/33662/robius-robia-robium)，意为红色，如牛、小麦、铁锈等。这使得这个名字与 Rust（我们选择的编程语言）有了基于颜色的联系。
Robius 与 Mobius 押韵，我们的标志/图标从“Rust”和“Mobius 带”的文字游戏组合中获取灵感。

> 是的，从技术上讲，原来的德国名字是 Möbius，但我们都使用美式发音，并带有长 "o" 音： "Roe-bee-us" / ˈɹoʊˈbiəs。


### 当前状态

Robius 是一个全新的愿景，我们刚刚开始启动。

目前，开始使用它的最佳方法是直接使用[推荐的 UI 工具包](#关键社区项目)来构建应用程序的 UI 并定义其 UX 行为。目前，除了 UI 之外，其他一切都要求您自己添加缺失的部分，例如网络连接、异步多任务处理和对其他设备外设或系统服务的访问。

所有东西都在这里公开开发，所以请经常查看[更新](https://github.com/project-robius/.github/blob/main/profile/README.md)！我们计划在 2024 年初至中旬推出 Robius 系统的pre-alpha版本（包括应用程序下面的所有内容），这将使您更容易访问和整合其他平台/操作系统功能，同时还可以使用 UI 工具包。

#### 平台支持  
即将推出：一个表格，其中列出了在哪些平台上支持哪些应用开发功能。


### 关键社区项目

Robius 生态系统包括几个独立的项目，这些项目可以组合成一个完整的系统堆栈，实现跨多个平台的快速、无痛的纯 Rust 应用开发。组件之间松耦合，允许开发人员（在未来）自定义使用哪些组件来组成底层系统，例如选择

* [Makepad](https://makepad.nl/) 是一个正在积极开发的跨平台 UI 工具包，提供了一种混合的保留模式和即时模式 UI 模型。
    - 快速开发周期：由于自定义的最小依赖集和用于实时设计的自定义 DSL，编译时间非常快，同时还支持 UI 元素的的热重载。
    - Makepad Studio：一个使用 Makepad 本身构建的 IDE 原型，具有独特的功能，如跨进程共享纹理以实现窗口内 UI 应用的实时重载，文件/窗口视图的停靠标签，超平滑的代码折叠等。
    - Makepad 框架：一个（不断增长的）高性能小部件和最小、零/低开销平台抽象的集合。

* [Dioxus](https://dioxuslabs.com/) 是一个跨平台的、生产就绪的 UI 工具包，受 React 启发，使用自定义金属语言 RSX 声明 UI 元素/布局，采用类似 HTML 的风格。
    - 支持许多平台，有一套可互换的目标渲染器，包括桌面、网络应用、静态网站、文本 UI、实时查看和移动设备。
    - 快速且内存高效，具有完美的 Lighthouse 分数，性能比 Node 或 Python 好几个数量级。
    - 优秀的内置状态管理抽象。
    - 使用熟悉的 Vaniall CSS 或您选择的 CSS 框架（例如 Tailwind）进行轻松、熟悉的样式设置。

* [Osiris](https://github.com/osiris-apis) 是一套用于在各种操作系统服务和平台特定功能之上开发沉浸式应用的 Rust 接口。
    - Osiris 旨在为 Rust 应用程序提供一种简单且规范化的方式来访问诸如存储、网络、多媒体（视频、音频、摄像头）、地理位置、设备方向（加速器、陀螺仪）、计时器和闹钟、通知、剪贴板、拖放等平台功能。
    - `osi` 是主要暴露 OS 接口的 Rust 软件包。在为更多平台提供原始接口之后，将很快提供更高层次的 Rust 抽象。
    - Osiris 提供构建工具，可以：  
        - 为特定平台集成组件设置新项目目录，并在创建后自定义自动生成的脚手架。  
        - 生成符合各平台政策的应用程序 artifact，例如可以发布到常见应用商店（Google Play、Apple App Store、Microsoft Store 等）的软件包。

* [ylong](https://gitee.com/openharmony/commonlibrary_rust_ylong_runtime) 是一个包含以下内容的异步运行时 for Rust：  
    - 基于优先级的任务调度。  
    - 用于自动并行化计算的抽象，以类似于 [rayon](https://crates.io/crates/rayon) 的方式提供并行迭代器，但适用于异步任务而不是本地（OS 级别）线程。  
    - 用于非阻塞异步 I/O、异步同步和异步计时的标准原语。  
    - 执行器和反应堆，分别用于调度任务和响应系统事件。


### 感兴趣的仓库  

Robius 旨在提供整个应用程序下方系统堆栈的全功能参考设计，为此将提供架构概述和详细文档。  

我们还打算提供两类实际应用程序：  
1. 旗舰应用：完整、功能齐全的应用程序，具有简洁的 UI 设计、抛光的 UX 和功能性的业务逻辑。这些应用程序可以发布到平台应用商店。  
2. 简单演示应用：一系列基本示例应用程序，展示几个关键功能，并在其他地方使用模拟组件。

#### 旗舰应用程序  
* Robrix：Robius 矩阵聊天客户端。即将推出！  
    - 此应用程序的需求将是 Robius 开发的主要驱动力。

#### 简单演示应用程序  

* [makepad_social_media_feed](https://github.com/project-robius/makepad_social_media_feed)：社交媒体信息流的移动 UI 演示。  
也请查看 Makepad 的最新示例：[Makepad 新闻推送](https://github.com/makepad/makepad/tree/master/examples/news_feed)。  
* [makepad_taobao](https://github.com/project-robius/makepad_taobao)：类似于 eBay 或淘宝的在线购物应用的 UI 演示。  
* [todo_makepad](https://github.com/project-robius/todo_makepad)：简单的待办事项列表应用程序。  
* [makepad_wechat](https://github.com/project-robius/makepad_wechat)：类似于微信、WhatsApp、Signal 等聊天应用的聊天式应用 UI 演示。  
* [makepad_tiktok](https://github.com/project-robius/makepad_tiktok)：类似于 TikTok 的短视频浏览应用的 UI 演示。  
* [makepad_widgets_sample](https://github.com/project-robius/makepad_widgets_sample)：展示 Makepad 提供的各种部件的应用程序。  
* [makepad_image_manipulation](https://github.com/project-robius/makepad_image_manipulation)：展示 Makepad 对高性能图片进行有趣转换的能力的示例。  
* 7 个 GUI：在 Makepad 和 Dioxus 上选择实现的 7 个 GUI 基准测试。  

> 更多示例，请查看 [Dioxus 示例应用程序](https://github.com/DioxusLabs/example-projects)和 [Makepad 示例应用程序](https://github.com/makepad/makepad/tree/master/examples)。Osiris 特定示例即将推出。

### 贡献  

* 我们欢迎任何人贡献、提出想法和建议！我们也很乐意帮助您在 Robius 组织的伞下托管和维护您的项目。  
* 如前所述，请随时通过 [Matrix 聊天室的 Robius 社区](https://matrix.to/#/#robius:matrix.org)与我们联系。
* 有关Robius更多信息请持续关注[作者](https://github.com/project-robius/.github/blob/main/profile/README.md)持续更新，祝大家玩得开心！