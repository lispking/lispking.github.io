---
title: RISC-V：跟着清华训练营从零打造OS之第一课
date: 2023-10-24 11:16:37
categories: RISC-V
tags: [RISC-V,Rust]
description: 本文主要分享了我在参加清华开源操作系统训练营第一节课时遇到的一些问题，希望对后续同学的学习能够有所帮助，让大家少走弯路，更高效地开展操作系统学习。
---

## 前言

今天是 1024 程序员节，祝所有程序员节日快乐！你们用智慧和勤奋创造了世界上最复杂、最神奇、最优秀的软件和系统，让我们享受到了科技的便捷和乐趣。感谢你们一直以来的努力和付出，希望你们继续前行，不断创新，让我们的世界更加美好！

大家是否还记得我之前提到过想要用 `Rust` 编写操作系统的感言？事实上，最近我一直在忙碌地参加[清华开源操作系统训练营]的学习。昨天是课程的第一课，我学到了很多新的知识。现在，我想和大家分享一下第一节课的内容。

既然要编写操作系统，首先，需要准备好开发环境。这听起来很基础，但这是非常重要的一步。然后，我们开始了熟悉的 `Hello World` 示例。这个示例可以帮助我们熟悉操作系统的最基本概念，例如进程管理、内存管理和文件系统等。

总的来说，这节课让我学到了很多有用的知识，并且让我更加坚定了编写操作系统的决心。我会继续努力学习，并和大家分享我的进展。

## 环境准备

### 基础环境信息

* CPU: `Apple M1`
* 宿主机OS：`macOS Sonoma 14.0`
* 虚拟机：使用 [OrbStack] 安装 `ubuntu 23.04`，选用 [OrbStack] 理由看[这里](https://docs.orbstack.dev/)

### Ubuntu 环境准备

* 准备 `Rust` 环境
```shell
export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup
curl https://sh.rustup.rs -sSf | sh
```

* 安装 `rustc` 的 `nightly` 版本
```shell
rustup install nightly
rustup default nightly
```

* 修改 `cargo` 所用的软件包镜像地址
```shell
cat <<EOF > ~/.cargo/config
[source.crates-io]
registry = "https://github.com/rust-lang/crates.io-index"
replace-with = 'ustc'
[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
EOF
```

* 安装 `Rust` 相关的软件包
```shell
rustup target add riscv64gc-unknown-none-elf
cargo install cargo-binutils
rustup component add llvm-tools-preview
rustup component add rust-src
```

* 修改 `ubuntu` 源
```shell
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
sudo sed -i 's/ports.ubuntu.com/mirrors.ustc.edu.cn/' /etc/apt/sources.list
```

* 安装 `Qemu` 环境
```shell
# 安装编译所需的依赖包
sudo apt install autoconf automake autotools-dev curl libmpc-dev libmpfr-dev libgmp-dev \
    gawk build-essential bison flex texinfo gperf libtool patchutils bc \
    zlib1g-dev libexpat-dev pkg-config  libglib2.0-dev libpixman-1-dev libsdl2-dev \
    git tmux python3 python3-pip ninja-build
# 下载源码包
cd $HOME
wget https://download.qemu.org/qemu-7.0.0.tar.xz
# 解压
tar xJf qemu-7.0.0.tar.xz
# 编译安装并配置 RISC-V 支持
cd qemu-7.0.0
./configure --target-list=riscv64-softmmu,riscv64-linux-user  # 如果要支持图形界面，可添加 " --enable-sdl" 参数
make -j$(nproc)
```

* 设置 `Qemu` 环境变量，可将以下命令写入在 `.bashrc` 文件中
```shell
export QEMU_PATH="$HOME/qemu-7.0.0"
export PATH="$QEMU_PATH/build:$PATH"
export PATH="$QEMU_PATH/build/riscv64-softmmu:$PATH"
export PATH="$QEMU_PATH/build/riscv64-linux-user:$PATH"
```

* 验证 `Qemu` 和 `Rust` 版本，若效果如下所示，即代表环境​准备完成
```shell
$ qemu-system-riscv64 --version
QEMU emulator version 7.0.0
Copyright (c) 2003-2022 Fabrice Bellard and the QEMU Project developers

$ qemu-riscv64 --version
qemu-riscv64 version 7.0.0
Copyright (c) 2003-2022 Fabrice Bellard and the QEMU Project developers

$ rustc -Vv
rustc 1.75.0-nightly (1c05d50c8 2023-10-21)
binary: rustc
commit-hash: 1c05d50c8403c56d9a8b6fb871f15aaa26fb5d07
commit-date: 2023-10-21
host: aarch64-unknown-linux-gnu
release: 1.75.0-nightly
LLVM version: 17.0.3
```

## 理解App执行环境

### 三叶虫LibOS总体结构

通过下图，大致可以看出Qemu把包含app和三叶虫LibOS的image镜像加载到内存中，RustSBI（bootloader）完成基本的硬件初始化后，跳转到三叶虫LibOS起始位置，三叶虫LibOS首先进行app执行前的初始化工作，即建立栈空间和清零bss段，然后跳转到app去执行。app在执行过程中，会通过函数调用的方式得到三叶虫LibOS提供的OS服务，如输出字符串等，避免了app与硬件直接交互的繁琐过程。

![LibOS-arch](images/risc-v/LibOS-arch.png)

> 注: 图中的`S-Mode`和`M-Mode`是`RISC-V` 处理器架构中的两种特权级别。`S-Mode` 指的是 `Supervisor` 模式，是操作系统使用的特权级别，可执行特权指令等。`M-Mode`是 `Machine`模式，其特权级别比`S-Mode`还高，可以访问`RISC-V`处理器中的所有系统资源。


### App执行环境栈介绍

> 在现代通用操作系统（如 Linux）上运行应用程序，需要多层次的执行环境栈支持，图中的白色块自上而下表示各级执行环境，黑色块则表示相邻两层执行环境之间的接口。下层作为上层的执行环境，支持上层代码运行。

![OS环境栈](images/risc-v/os-env-stack.png)

```note
计算机科学中遇到的所有问题都可通过增加一层抽象来解决。
All problems in computer science can be solved by another level of indirection。
—— 计算机科学家 David Wheeler
```

### 编译器工作流程介绍

> 现代编译器工具集（以C或Rust编译器为例）的主要工作流程如下：

* 源代码（source code） –> 预处理器（preprocessor） –> 宏展开的源代码
* 宏展开的源代码 –> 编译器（compiler） –> 汇编程序
* 汇编程序 –> 汇编器（assembler）–> 目标代码（object code）
* 目标代码 –> 链接器（linker） –> 可执行文件（executables）


## Hello World之路

> 按照 [第一章：应用程序与基本执行环境] 教程步骤，一步一步编写`Hello World`时，可能会遇到以下问题：

- 执行`make run`命令后，可能没有任何响应。这可能是由于 [`rustsbi-qemu`] `bootloader`包需要更新。在本文撰写时，建议使用最新[`Prereleased 2023-03-06`版本](https://gitee.com/lispking/rCore-Tutorial-v3/blob/master/bootloader/rustsbi-qemu.bin)。
- 完成教程中所有代码后，可能会发现持续打印出 `It should shutdown!` 信息，并出现各种乱码。这主要是因为`sbi 标准`已经更改，原代码不再适用。我们已经在 [这里](https://gitee.com/lispking/rCore-Tutorial-v3/blob/master/ch1/os/src/sbi.rs) 提供了新版本的代码，并将相关代码上传到了 [ch1 目录](https://gitee.com/lispking/rCore-Tutorial-v3/tree/master/ch1/os)。执行`make run`后，若看到效果如下所示，那就代表第一课 `Hello World` 内容准备完成了。

![Hello World运行效果图](images/risc-v/hello-world.png)


## 未完待续 ... ...

> 以上就是关于 [清华开源操作系统训练营] 第一课学到的知识，希望对您有所帮助。祝大家玩得开心 ^_^

> 如果您喜欢这篇文章，欢迎关注微信公众号《猿禹宙》、点赞、转发和赞赏。每一位读者的认可都是我持续创作的动力。

![公众号](images/wechat-blog.png)

<!-- 参考资料 -->
[OrbStack]: https://orbstack.dev/
[清华开源操作系统训练营]: https://os2edu.cn/
[第一章：应用程序与基本执行环境]: https://learningos.cn/rCore-Tutorial-Guide-2023A/chapter1/0intro.html
[`rustsbi-qemu`]: https://github.com/rustsbi/rustsbi-qemu/releases