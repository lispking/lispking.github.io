---
title: RustForLinux：跟着清华训练营从零打造 Linux 驱动【第二课】
date: 2023-11-14 00:25:26
categories: RustForLinux
tags: [Linux,Rust]
description: 本节课一起动手实践 Hello World 内核模块，逐步剖析驱动程序的开发过程，从而掌握 Linux 驱动的基本知识。
---

## 上一节回顾

在 [RustForLinux：跟着清华训练营从零打造 Linux 驱动【第一课】](https://lispking.github.io/2023/11/07/rust-for-linux-ch1/)中，主要讲解了如何配置 Rust for Linux 驱动环境。不知道各位同学在配置过程中是否顺利呢？如有任何问题，欢迎在后台私信留言与我交流。我将竭诚为您解答，本节课将一起探究如何从零开始编写一个 Hello World 驱动。让我们一起动手实践，逐步剖析驱动程序的开发过程，从而掌握 Linux 驱动的基本知识。

## Linux 源码目录结构分析

> 为了后续实验能够顺利开展，需要使用最新 `6.6.0-rc4` 版本内核，因此，本文将使用官方仓库中的 `rust-dev` 分支进行探讨和分析。

```shell
git clone git@github.com:Rust-for-Linux/linux.git -b rust-dev --depth 1
```

目前，`Rust for Linux` 官方主要维护四个分支：
* `rust-next`：包含将在`下一个 Linux 内核合并窗口`提交的 `Rust` 的新功能分支。通过邮件列表发送补丁更新。
* `rust-fixes`：包含针对`当前 Linux 内核周期的 Rust 修复`。通过邮件列表发送补丁更新。
* `rust-dev`：实验性分支，用于集成目的，是`看起来足够好`的补丁队列。尚未进入`主线`或 `rust-next` 的功能开发提供基础，例如，给予早期访问其他子系统相关的 `Rust` 更改。有一个注意点，这个分支可能会频繁更新/重排，并且在未来可能会消失。（**注：课程主要基于该分支做实验**）
* `rust`：在 `Rust` 支持合并到内核之前两年进行开发的原生分支，<font color='red'>该分支实际上已经冻结</font>。

> 在着手编写 Hello World 驱动之前，我们先来了解 Linux 源码目录结构。

* arch: 体系结构相关代码，比如，x86、arm64、risc-v等等，与系统架构和硬件规范相关，底层代码多用汇编实现
* block: Block I/O layer, 块设备抽象层
* certs: 数字签名相关证书
* crypto: 通用加密算法代码，比如，md5、sha、rsa、lz4等等。
* driver: 通用驱动代码，比如，电源、usb串行通信、pci、输入输出设备驱动等等
* fs: File system，虚拟文件系统（VFS）代码，以及各种文件系统的代码
* include: C语言头文件，#include <linux/***.h>
* ipc: Inter-process communication，进程间通信
* mm: Memory management，内存管理
* net: 网络设备驱动代码
* rust: **Rust for Linux 驱动代码**
* samples: 样例代码
* sound：音频设备驱动代码
* tools: 一些用于开发和维护内核的工具
* init-env.sh/make-aarch64.sh/qemu-aarch64-test.sh：细心的读者可能会发现，文章目录比官方多了几个脚本。这些额外的脚本是我自行添加的，其主要作用在[第一节课](https://lispking.github.io/2023/11/07/rust-for-linux-ch1/)中已经详细讲解过。在日常开发和测试过程中，这些脚本非常有用。

![rust-dev-source.png](images/rust-for-linux/rust-dev-source.png)


## 常用 Linux 内核模块命令

在内核编译配置过程中，可以在 `menuconfig` 界面中，通过按下 `Y` 键来编译内核模块并将其编译集成到内核中，或者按下 `M` 键将内核模块编译为独立的可加载模块。

接下来，将介绍在开发过程中，较为常用的内核模块相关命令：

* `insmod`：加载内核模块，例如：`insmod my_module.ko`
* `rmmod`：卸载内核模块，例如：`rmmod my_module`
* `lsmod`：显示已加载的内核模块。
* `modprobe`：根据依赖加载内核模块，例如：`modprobe my_module`
* `modprobe -r`：根据依赖卸载内核模块，例如：`modprobe -r my_module`
* `depmod`：分析内核模块之间的依赖关系
* `modinfo`：查看内核模块信息，例如：`modinfo my_module.ko`


## 创建内核模块：探索所需步骤与实现功能

首先，在 `samples/rust` 目录下创建 `rust_helloworld.rs` 源文件，内容如下：

```rust
// SPDX-License-Identifier: GPL-2.0

//! hello world module in rust

use kernel::prelude::*;

module! {
    type: RustHelloWorld,
    name: "rust_helloworld",
    author: "Rust for Linux Contributors",
    description: "hello world module in rust",
    license: "GPL",
}

struct RustHelloWorld;

impl kernel::Module for RustHelloWorld {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        pr_info!("Hello World from Rust module (init)\n");
        Ok(RustHelloWorld)
    }
}

impl Drop for RustHelloWorld {
    fn drop(&mut self) {
        pr_info!("Hello World from Rust module (exit)\n");
    }
}
```

接下来，参考 `samples/rust/Kconfig` 文件将 `rust_helloworld` 模块补充进去，在 `menuconfig` 命令中添加 `rust_helloworld` 模块。

最后，参考 `samples/rust/Makefile` 文件将 `rust_helloworld` 模块补充进去，以便在编译过程中包含 `rust_helloworld` 模块。

现在，可以使用 `make menuconfig` 命令配置内核，并使用 `make build` 命令编译包含 `rust_helloworld` 模块的内核。编译完成后，将 `rust_helloworld` 加载到内核，将会看到 `Hello World from Rust module (init)` 的输出信息，同时，可用 `lsmod` 命令进一步验证模块加载是否成功。

```shell
## 加载成功示例
(kernel) > lsmod
rust_helloworld 12288 0 - Live 0xffffb891261ea000 (O)
```

## 深入探索内核模块：逐步剖析其实现与工作机制

为了实现一个 `module` 做的事情，在 `macro/lib.rs` 中通过 `proc_macro` 过程宏定义了 `module!` 宏，然后，去调用 `macro/module.rs` 中的 `module` 函数其中，`TokenStream` 是传入的参数。

```rust
/// Declares a kernel module.
///
/// The `type` argument should be a type which implements the [`Module`] trait.
/// Also accepts various forms of kernel metadata.
///
/// # Supported argument types
///   - `type`: type which implements the [`Module`] trait (required).
///   - `name`: byte array of the name of the kernel module (required).
///   - `author`: byte array of the author of the kernel module.
///   - `description`: byte array of the description of the kernel module.
///   - `license`: byte array of the license of the kernel module (required).
///   - `alias`: byte array of alias name of the kernel module.
#[proc_macro]
pub fn module(ts: TokenStream) -> TokenStream {
    module::module(ts)
}
```

`module` 函数对各个参数进行解析，然后，使用 `format!` 宏返回一串字符串。这串字符串是在 `Rust` 中实现 `Linux` 内核 `C` 模块所需的大量定义。在其中，同样生成了 `C` 代码中实现模块所必需的`入口函数`、`出口函数`等一系列内容，并通过 [`Foreign Function Interface`](https://doc.rust-lang.org/nomicon/ffi.html)（`FFI`）形式最终调用了 `C` 模块的代码。

在阅读生成的代码时，发现了一个 `#[no_mangle]` 属性，该属性用于关闭 `Rust` 的名称修改。`Rust` 编译器在编译过程中会修改我们定义的名称以进行某些分析。然而，如果直接将这些名称用于 `C` 语言，可能会导致符号名称不匹配。通过使用 `#[no_mangle]` 属性，可以确保名称的一致性。

> 总结：在 `Rust for Linux` 中声明一个模块时，尽管外部看起来平静如水，但实际上 `Rust for Linux` 正在负重前行。


## 深入了解 Bindings 机制的必备知识

### Bindings 机制解读

`Rust for Linux` 针对部分关键内核框架提供了封装和抽象。这些抽象基于 `bindings` 和 `helper` 对 `Linux` 内核接口进行了封装。通过直接调用 `bindings` 和 `helper`，可以实现对 `Linux` 内核接口的访问。

值得关注的是，在 `Linux` 内核所提供的众多内核接口中，大部分尚未被 `Rust for Linux` 封装。因此，如需直接调用 `Linux` 内核中的接口，可直接调用 `bindings` 和 `helper`。

### Bindings 使用方式

在 `Linux` 中，通过头文件方式提供的接口可以在 `/rust/kernel/bindings_helper.h` 文件中直接添加相应的头文件。例如：

```c  
#include <linux/of_platform.h>
#include <linux/security.h>
#include <asm/io.h>
#include <linux/example.h>
```

只需将需要使用的头文件添加到该列表中，即可在 `Rust` 代码中使用相应的内核接口。

对于头文件中使用的宏等代码，可以在 `/rust/helpers.c` 文件中添加对应的函数封装来使用。例如，在 `examples.h` 中定义如下宏：

```c  
#define example(attr) \  
    example(attr)  
```

在 `helpers.c` 文件中添加如下内容：

```c  
#include <linux/of_platform.h>
#include <linux/security.h>
#include <asm/io.h>
#include <linux/example.h>

u32 rust_helper_example(u32 attr) {  
    return example(attr);  
}
EXPORT_SYMBOL_GPL(rust_helper_example);  
```

通过这种方式，可以在 `Rust` 代码中方便地使用这些封装好的函数。

在编译过程中，`bindgen` 工具会生成两个文件。

* `/rust/bindings/bindings_generated.rs`
* `/rust/bindings/bindings_helpers_generated.rs`
 
随后，在 `Rust` 驱动代码中，可以通过 `bindings::xxx` 的方式来实现对 `Linux` 内核接口的调用。这种方式为开发者提供了一种简洁的途径，使他们在 `Rust` 代码中充分利用 `Linux` 内核提供的功能。

> 注意，直接从 `bindings` 获取的内核代码接口通常是 `unsafe` 的，但可以通过封装将其转变为 `safe` 的代码。这意味着开发者可以放心地在 `Rust` 代码中使用这些接口，而不必担心安全问题。通过封装，开发者可以隐藏底层内核接口的复杂性，同时提供一种更安全、易于使用的替代方案。

![bindings-unsafe-safe](images/rust-for-linux/bindings-unsafe-safe.png)


## 未完待续

> 以上就是关于 [清华开源操作系统训练营] 《Rust fox Linux》第二课学到的知识，希望这节课能对您有所帮助。祝大家玩得开心 ^_^

> 如果您喜欢这篇文章，欢迎关注微信公众号《猿禹宙》、点赞、转发和赞赏。每一位读者的认可都是我持续创作的动力。

![公众号](images/wechat-blog.png)
