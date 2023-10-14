---
title: 【正值当下】加入 Robius project 开发者社区
date: 2023-10-14 07:00:00
categories: Robius
tags: [Robius,Rust]
description: 呼吁开源爱好者加入 Robius project 开发者社区一起共建，本文重点介绍 Robius 基本架构设计，Robius 是一个多平台应用开发的项目，它的设计基于 Rust 语言。项目的主要目标是为开发者提供一套全面的工具和库，使他们能够在多种设备和操作系统上创建高效、响应快速的应用。
---

### 项目简介

Robius 是一个多平台应用开发的项目，它的设计基于 Rust 语言。项目的主要目标是为开发者提供一套全面的工具和库，使他们能够在多种设备和操作系统上创建高效、响应快速的应用。

![TheRobiusArch](images/robius/TheRobiusArch.png)


### 核心组件介绍
1. **应用(Application)**: 这一层包含了 UI 逻辑、UX 逻辑、应用逻辑和业务逻辑。这些逻辑层为开发者提供了定义应用功能和界面的基础。

2. **UI 工具包(UI toolkit)**: 包括 Makepad 和 Dioxus。这里定义了各种界面组件，例如小部件、动画、手势、事件和渲染。

![TheRobiusUIToolkit](images/robius/TheRobiusUIToolkit.png)
![TheRobiusChooseUI](images/robius/TheRobiusChooseUI.png)
![Bevy](images/robius/TheRobiusBevy.png)

3. **并发运行时(Concurrent Runtime)**: 一个重要的部分，它提供了异步执行器、多线程和线程池，确保应用能够充分利用设备的计算能力，并快速响应用户操作。

4. **OSIRIS 平台抽象(OSIRIS Platform Abstractions)**: 这是与底层操作系统和硬件交互的接口。从网络、存储、多媒体、权限到传感器和剪贴板，这一层为应用提供了一系列的服务和功能。

![TheRobiusOsris](images/robius/TheRobiusOsris.png)

5. **平台/OS 原生层(Platform/OS Native Layers)**: 这是与特定操作系统和硬件进行交互的层，例如 Android、iOS、HarmonyOS 和桌面等。

![Alt text](images/robius/TheRobiusPathTowards.png)

> 从图中的说明文本可以了解到，这个框架的指导哲学是“让 UI 专家做他们最擅长的事情”。这意味着 Robius 旨在让 UI 和 UX 开发者能够专注于设计和用户体验，而不是底层的技术细节。

> 总的来说，Robius 提供了一个完整的应用开发框架，从应用的逻辑和界面设计到与硬件和操作系统的交互，都有相应的工具和库来支持。这使得开发者能够专注于创造高质量的多平台应用，而不必担心底层的技术挑战。

### Flutter 与 Robius - 基本不同的方法  
- Flutter 开发者需要学习新的语言，Dart  
- Robius 是一个去中心化、松耦合的努力  
    - 不是由单个实体拥有  
    - 不是一个黑盒子，就像 Flutter 或 React Native  
- 填补了 Rust 中的真空  
    - 已经在 Rust 的许多相关子领域进行中  
    - 以服务于 Rust 社区为基础的建设：Rust 社区使用是我们的首要关注  
    - 组件化的架构支持选择针对您需求的特定组件：允许开发者深入到更低层次以理解、优化他们的应用和系统栈  
- 没有与 Flutter 竞争或取代 Flutter 的意图

### 将反馈融入 Rust/cargo  

- 利用应用程序和框架设计经验来改进 Rust  
- 已经在进行中，由 UI 工具包和系统打包程序驱动    
    - 需要更好的顶级构建工具周围的 cargo  
    - 需要 ability to hook into cargo commands, e.g., post-build action  
    - 需要在构建过程中注入元数据，稍后查询它    
    - 更好的统一配置空间来定义构建包含
        - 外部 cargo 方式 (例如：Make vars)
        - 内部 cargo (例如：--features)
        - 内部 rustc (例如：--cfg)  
    - 更好的、更灵活的功能，以及更合理的默认功能开关    
    - 存在性依赖项

### WebAssembly（WASM）的作用  

- 我们可能能够利用 WASM 进行更简单的部署  
    - 主要用于网络应用程序，加上桌面平台  
    - 移动应用商店不允许下载和运行任意代码  
- Rust 为 targeting WASM 提供了一等支持  
    - WASM 生态系统的大部分优先考虑 Rust 集成  
    - 组件模型可以帮助减轻大型应用二进制文件的影响    
- 通过网络交付的应用二进制文件仅能传输应用程序本身  
    - 重复使用客户端上已经存在的库、共享组件

### 项目结束语

* Community of Developers for Mobile Applications in Rust: https://github.com/project-robius

* Robius是个雨伞项目，重点发展[Makepad](https://github.com/makepad/makepad)，[Dioxus](https://github.com/DioxusLabs/dioxus)，Ylong，Osiris这些重点项目，促成他们之间的紧密集成。

* Robius项目是提供给Rust社区一套完整的App开发库和工具，上层app框架可能是[Dioxus](https://github.com/DioxusLabs/dioxus)这种类React的声明式框架，底层组件和UI库可以是[Makepad](https://github.com/makepad/makepad)，也可以是[egui](https://github.com/emilk/egui)或者[slint](https://github.com/slint-ui/slint)。

* 本群的目标希望可以组织国内开发者的力量参与到这个项目贡献中。项目刚起步，大家都可以参与贡献。

* 看视频了解 Robius【GOSIM WORKSHOP 开幕式 Kevin Boos：Robius：用 Rust 开发多平台应用程序的愿景-哔哩哔哩】: https://b23.tv/FzhitOd

> 正值当下，《Rust 编程之道》的作者张汉东老师正在国内积极呼吁开源爱好者们加入 [Robius Project](https://github.com/project-robius) 的开发者社区，一起共同参与建设，与众多专家一起从零开始打造 Robius。欢迎了解下 [Robius Project](https://github.com/project-robius)，有意向参与贡献，请私聊我加入Robius project开发者社区

![我的企业微信](images/wxe.png)
