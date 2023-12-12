---
title: 解剖 Robius Demo 之 Wechat 应用
date: 2023-10-22 20:00:33
categories: Robius
tags: [Robius,Rust]
description: 在本篇文章中，我们将对 Robius Demo 中的 Wechat 应用进行解剖。通过对这个示例应用的深入分析，你将能够更好地理解其内部工作原理和实现细节。通过阅读这篇文章，你将能够掌握如何在 Robius Demo 中构建和实现 Wechat 应用，以及如何利用其提供的工具和组件来创建具有相似功能和性能的实际应用程序。让我们开始吧！
---

## 上一节回顾

在[Robius：用 Rust 开发多平台应用](https://lispking.github.io/2023/10/15/rust-robius-project-update/)一文介绍了 Robius 的愿景和未来的一些规划，Robius 是一个完全开源的、去中心化的、由社区驱动的项目，旨在让 Rust 成为多平台应用开发的理想选择，本章节，我们一起来解剖 Robius 里的 `Wechat` 应用 Demo。

## Makepad 项目介绍

在开始解剖 `Wechat` 项目之前，我们先来学习一下所使用的 [Makepad] 项目的基本知识。

* [Makepad] 包括 Makepad Framework 和 Makepad Studio。  
* Makepad Framework 是一个跨平台的 `UI 框架`。包括多个 crate，顶级 crate 是 [makepad-widgets]。有关 Makepad Framework 的更多详细解释，请参阅[makepad-widgets组件介绍](#makepad-widgets介绍)。  
* Makepad Studio 是使用 Makepad Framework 构建的一个 `IDE 原型`。它仍然在重度开发中，但我们的最终目标是创建一个可以在运行时更改应用程序设计的 IDE。Makepad Studio 的主 crate 是 [makepad-studio]。有关更多信息，请参阅[makepad-studio章节介绍](#makepad-studio介绍)。

### makepad-widgets介绍

* 这是 Makepad Framework 的顶级 crate，它是一个为 Rust 开发的下一代 UI 框架。使用 Makepad Framework 构建的应用程序可以在本地和 web 上运行，完全在 GPU 上渲染，并支持名为 live design 的新颖功能。
* Live design 意味着 Makepad Framework 为其他应用程序（例如 IDE）提供基础设施，使其可以挂载到您的应用程序并在线运行时更改其设计。为此，Makepad Framework 应用程序的样式使用 DSL 描述。编写的代码通过使用 proc_macros 与主要 Rust 代码紧密集成。
* 一个具有 live design 意识的 IDE 检测 `DSL` 代码中发生的更改，而不是 Rust 代码，因此，它可以在触发完整重新编译之前将更改发送到应用程序，使其更新自身。（[makepad-studio] crate 包含一个可以最终实现此功能的 IDE 原型，但仍在进行大量开发。）
* 此 crate 包含一组基本控件，几乎每个应用程序都需要。在撰写本文时，支持的控件有：窗口、下拉菜单、停靠栏、分割器、标签栏、框架、滚动条、文件树、标签、按钮、复选框、单选框、颜色选择器
* 除了这些控件外，此 crate 还包含两个低级 crate 的重导出，分别是 [makepad-draw-2d]（包含所有与绘制应用程序相关的代码）和 [makepad-platform]（包含所有特定于平台的代码）。最后，它包含一组基本字体。

> 简而言之，要在 Makepad Framework 中构建应用程序，大多数时候，这个 crate 是您唯一需要的。

> <font color='red'>注意事项</font>：尽管 [Makepad] 框架已经足够完整，可以让你使用它来编写自己的应用程序，但目前它`仍然处于激烈的开发阶段`。目前，我们只支持 `Mac` 和 `Web`（尽管我们很快就会添加对 Windows 和 Linux 的支持）。在此阶段，我们无法保证 API 的稳定性。请在使用 [Makepad] 框架为自己的应用程序时牢记这一点。最后，我们在`字体渲染`、`国际化`等领域仍然缺乏许多功能。

### makepad-studio介绍

* 这是一个使用 [Makepad] 框架编写的 IDE 原型。关于 [Makepad] 框架的解释，请参阅 [makepad-widgets 组件介绍](#makepad-widgets介绍)。  
* 最终目标是将其开发成为一个支持实时设计意识的 IDE。这样的 IDE 能够检测到描述应用程序样式的 DSL 代码（而非本地 Rust 代码）发生更改时，无需重新编译，而是将更改发送到 DSL 代码的应用程序，使其自行更新。  
* 尽管如此，这个组件目前`仍然处于激烈的开发阶段`。在撰写本文时，它具有一个带有选项卡的工作栏系统，一个带有折叠的文件树，以及一个基本代码编辑器，支持语法高亮。我们目前的主要挑战是重新设计 IDE，使其具有适当的扩展模型和沙箱化。


## 环境准备 

### 安装 [Makepad]

* 构建 [Makepad] 组件之前，首先，需要安装 `Rust`，`Rust` 的安装指南请参考：https://www.rust-lang.org/tools/install
* 本地构建通常会使用`stable`版本的 Rust 工具链，然而，[Makepad] 在运行时生成的一些错误（尤其是来自 DSL 的错误）除非你使用`nightly`版本的 Rust 工具链，否则，不会包含行信息。_此外，[Makepad] 的 `Web` 构建目前仅在`nightly`版本工作。因此，建议您使用`nightly`版本的 Rust 工具链来构建 [Makepad]_。  
* 对于非标准构建目标（`ios`、`android`、`wasm`），需要安装一个名为 `cargo-makepad` 的构建工具，有两种安装方式。  
    - 仓库安装： `git clone https://github.com/makepad/makepad.git && cd makepad && cargo install --path=./tools/cargo_makepad`
    - `cargo` 安装：`cargo install cargo-makepad` (推荐用该方法，省心)
* `cargo-makepad`工具安装成功后，可根据平台所需安装相应的工具链，具体命令如下：
    ```shell
    cargo makepad wasm install-toolchain
    cargo makepad ios install-toolchain
    cargo makepad android --abi=all install-toolchain
    ```

### 在 `iOS` 安装 [`makepad_wechat`] 应用

> 鉴于 `iOS` 模拟器的安装过程相对较为复杂，本章节将仅针对 `iOS` 模拟器的安装进行讲解。而 `Android` 的安装过程类似，因此不再赘述。

* `clone` 源码
```shell
git clone https://github.com/project-robius/makepad_wechat.git
```

* `iOS` 安装应用前准备
    - 请启用您的 `iPhone` 的开发者模式，具体操作步骤，请参考[这里](https://www.delasign.com/blog/how-to-turn-on-developer-mode-on-an-iphone/)
    - 创建一个 `Apple 开发者账户`  
    - 在 XCode 中创建一个空白的骨架项目  
        - 文件 -> 新建 -> 项目: 创建一个新 "App"  
        - 将产品名称设置为 `WeChat`（后面 --org 参数中使用）  
        - 将组织标识符设置为您选择的任何值，例如，本示例将使用 `rs.robius`（后面 --app 参数中使用）  
        - 设置项目签名和功能，选择正确的团队账户  
    - 在 `XCode` 中，构建/运行此项目以在模拟器和设备上安装并运行应用  
    - 一旦模拟器和设备上正确安装并运行了 "skeleton" 应用，接下来，就可以使用 [Makepad] 安装其应用程序。

* 在 `iOS` 模拟器上安装应用
    ```shell
    cd ~/makepad_wechat
    cargo makepad ios --org=rs.robius --app=WeChat run-sim -p makepad_wechat --release
    ```

* 在 `iOS` 设备上安装应用
    ```shell
    cd ~/makepad_wechat
    cargo makepad ios --ios-version=16 --org-id=<ORGIDVALUE> --org=rs.robius --app=WeChat run-device -p makepad_wechat --release
    ```

    其中，`--org-id`：这是位于 `~/Library/MobileDevice/Provisioning Profiles` 目录中的 `**.mobileprovision` 文件中的 ApplicationIdentifierPrefix <key> 的 <string> 值。它应该是一个 10 位数的字母数字值。

* 以下是在 `iOS` 模拟器安装成功运行效果图

    ![iOS模块器效果](/images/robius/TheRobiusWechatDemo.png)

## [`makepad_wechat`] 应用源码解读

### 源码结构分析

![makepad_wechat源码目录](/images/robius/TheRobiusWechatDemoSource.png)

`Demo` 源码目录整体较为简洁，具体解析如下：
- `resources`：资源目录，主要存放字体、图标、图片等。
- `src`: 源码目录，主要包含程序启动、模块定义以及数据交互等
    - `main.rs`: 服务启动入口，实际上是调用`app.rs`的`app_main`方法。
    - `app.rs`: 应用程序入口，由 [Makepad] 提供的 `app_main!` 宏提供服务，同时，使用 `live_design!` 来定义应用需要用到的相关`组件`以及`布局`。
    - `api.rs`: 定义聊天应用相关结构体，例如，`ChatEntry`、`MessagePreview`、`MessageDirection`、`MessageEntry`和`Db`等，以及 `mock` 相关应用使用到的数据和方法。
    - `contacts`: 定义联系人组件以及其相关布局
    - `discover`: 定义发现组件以及其相关布局
    - `home`: 定义首页（聊天列表）组件以及其相关布局
    - `profile`: 定义我的组件以及其相关布局
    - `shared`: 一些公共组件的定义，比如，header、搜索框、弹出菜单等等

### 项目依赖分析

从 `Cargo.toml` 文件分析，`Demo` 项目主要引入了 `makepad-widgets` 依赖。初步浏览了所有源代码，由于没有第三方服务相关调用，因此，暂不需要其他依赖。

```toml
[dependencies]
makepad-widgets = { path = "../makepad/widgets", version = "0.6.0" }
```

### `app.rs` 框架分析

关键源码框架解读如下：

* `live_design!`宏: 定义了一个 `live_design` 函数，该函数将一个 `Live DSL` 代码块注册到 `live` 系统中。宏中的代码被序列化为一个字符串，稍后由 `live` 系统解析。新创建的 Rust 结构体的字段被初始化为对应默认值，[Makepad] 的 `live` 系统应用该结构的 `Live DSL` 定义，覆盖所有 `Live DSL` 有定义的字段。导入了相关的模块和主题，并且定义应用相关组件及布局。
* `app_main!(App)`: 定义了所有支持平台（`Web`、`Android` 和`桌面`）的应用程序入口点。为了实现跨平台支持，代码必须是宏生成的，不能是一个简单的 `fn main()` 函数。
* `struct App { ... }`: 使用 `derive(Live)` 过程宏来生成将 `live_design DSL` 反序列化为 `App` 结构体的粘合剂。在 [Makepad] 的术语中，这被称为将 `live DSL` 应用到 `Rust 结构体`，该示例包含了两个字段：一个 `WidgetRef` 类型的 `ui`，用于存储组件；一个 `HashMap` 类型的 `navigation_destinations`，用于存储导航目标。
* `impl LiveHook for App { ... }`: 为 `App` 实现 `LiveHook` 特质，定义了 `before_live_design` 钩子函数，该函数在生命周期开始前执行，`App` 的 `LiveHook` 实现允许在连接到 `Live DSL` 的各种对象生命周期阶段时进行挂载。。
* `impl AppMain for App { ... }`: `AppMain` 是为 `App` 实现的特质。它提供了从系统进入应用程序的唯一入口点：`fn handle_event`。该特质提供了鼠标、计时器和滑动事件，这些事件被传递到 `UI` 树中进行处理。该示例中，`Event::Draw` 事件是系统请求应用程序生成必要渲染结构的地方。

```rust
live_design! {
    import makepad_widgets::base::*;
    import makepad_widgets::theme_desktop_dark::*;

    ... ...
}

app_main!(App);

#[derive(Live)]
pub struct App {
    #[live]
    ui: WidgetRef,

    #[rust]
    navigation_destinations: HashMap<StackViewAction, LiveId>,
}

impl LiveHook for App {
    fn before_live_design(cx: &mut Cx) {
        ... ...
    }
}

impl AppMain for App {
    fn handle_event(&mut self, cx: &mut Cx, event: &Event) {
        ... ...
    }
}
```


> 由于 [Makepad] 文档较少，我们需要花费更多时间来分析其底层设计。

> 以上就是关于 `Robius Demo` 中的 `Wechat` 应用源码剖析过程，希望对您有所帮助。祝大家玩得开心 ^_^

> 如果您喜欢这篇文章，欢迎关注微信公众号《猿禹宙》、点赞、转发和赞赏。每一位读者的认可都是我持续创作的动力。

![公众号](/images/wechat-blog.png)


<!-- Links below -->
[Makepad]: https://makepad.nl/
[makepad-widgets]: https://crates.io/crates/makepad-widgets
[makepad-studio]: https://crates.io/crates/makepad-studio
[makepad-draw-2d]: https://crates.io/crates/makepad-draw-2d
[makepad-platform]: https://crates.io/crates/makepad-platform
[`makepad_wechat`]: https://github.com/project-robius/makepad_wechat
