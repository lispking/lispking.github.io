---
title: 深入了解Rust - Hello World汇编初探
date: 2023-10-17 11:43:51
categories: Rust
tags: [Rust]
description: 本文介绍了在Rust中编写Hello World程序的方法，并探索了底层汇编知识。通过分析汇编代码，可以了解程序的结构和功能，以及各个函数和变量之间的关系。本文主要介绍了启动函数和main函数的解读，以及整个代码的执行过程。
---

## 引言

> `Hello World`是每一个程序员学习新语言时的小小里程碑。今天，我们就来学习如何编写一个 `Rust` 的 `Hello World` 程序，并且探索一些底层汇编知识。

## 前期准备工作

> 首先，我们需要安装 Rust。可以访问 Rust 官方网站 https://www.rust-lang.org/tools/install 下载安装程序并按照指示进行安装。

```shell
$ rustc --version
rustc 1.73.0 (cc66ad468 2023-10-03)
```

## 创建 Rust 项目

> 安装完成后，可执行上述命令查看 Rust 版本，接下来，我们打开终端并输入以下命令来创建一个新的 Rust 项目：

```shell
$ cargo new hello_world
$ cd hello_world  
$ tree
.
├── Cargo.toml
└── src
    ├── main.rs
```

这将会创建一个名为 `hello_world` 的新文件夹，并在其中生成一个名为 `Cargo.toml` 文件。这个文件是 Rust 项目的配置文件，我们可以在这里添加依赖项和其他项目设置。

> 执行`cargo new hello_world`命令后，会自动在`src`目录下创建一个 `main.rs` 源码文件，`cat src/main.rs`可以看到默认`cargo`已为您实现了 `Hello World` 程序：

```rust  
fn main() {  
   println!("Hello, world!");  
}
```

这段代码定义了一个名为 `main` 的函数，这是 Rust 程序的入口点。在 main 函数中，我们使用 println! 宏来输出"Hello, world!"。

> 现在，我们可以使用 cargo 命令来构建并运行程序。在终端中输入以下命令：
```shell
$ cargo run  
```
这将会在终端中输出"Hello, world!"。

> 但是，这只是一个表面上的 Hello World 程序。如果我们想要深入了解 Rust，我们就需要了解一些底层汇编知识。


## 编译汇编源码

`cargo`工具包带有`rustc`命令封装，可以执行以下命令将rs源码翻译为汇编。

```shell
$ cargo rustc -- --emit=asm
   Compiling hello_world v0.1.0 (/Users/xxx/Projects/demo/hello_world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.21s
```

生成的汇编代码会放在`target/debug/deps`目录下，名为`hello_world-xxx.s`，但是该汇编会包含很多和`cargo`工具相关的信息，不利于进一步学习分析，因此，可直接使用`rustc`工具来生成汇编代码`main.s`，命令如下：

```shell
$ cd src
$ rustc --emit=asm main.rs
$ ls
main.rs main.s
```

## 汇编源码解读

### 主要组成介绍

由于`main.s`文件内容较长，这里只分析关键部分代码，首先，一起回顾一些基础知识，这是一个 ELF（可执行链接格式）文件的分析，它包含了程序的代码和数据段。以下是该 ELF 文件的主要组成部分：
* `.section` 指令：这些指令用于定义程序中的各个段，如代码段、数据段和栈。  
* `.text` 段：包含程序的代码。  
* `.data` 段：包含程序的数据。  
* `.bss` 段：包含程序的未初始化数据。  
* `.rodata` 段：包含只读数据。  
* `.rela` 段：包含程序的动态链接信息。  
* `.symtab` 段：包含程序的符号表。  
* `.strtab` 段：包含程序的字符串表。

在给定的 ELF 文件中，我们可以看到以下几个重要的函数和变量：
* `__ZN3std10sys_common9backtrace28__rust_begin_short_backtrace17h41d6339a4d6b9b77E`：这是一个函数，用于开始调试。  
* `__ZN3std2rt10lang_start17h8b3af1e9d6ac7258E`：这是一个函数，用于启动语言运行时。  
* `__ZN4core3fmt9Arguments9new_const17h71bd3e081e7c68d0E`：这是一个函数，用于创建一个常量。  
* `__ZN4core3ops8function6FnOnce40call_once$u7b$$u7b$vtable.shim$u7d$$u7d$17h136ee7478585e27cE`：这是一个函数，用于调用一次。  
* `_main`：这是程序的主入口点。

> 此外，还有一些全局变量和局部变量，如`x0`、`x1`、`x2`、`x3`等。这些变量在程序中用于各种计算和数据存储。根据给定的 ELF 文件，我们可以看到程序的结构和功能。要深入了解程序的实现，我们需要分析每个函数和变量，以及它们之间的关系。

### 汇编代码解读

#### 启动函数解读

```shell
    .section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 11, 0
	.p2align	2
__ZN3std10sys_common9backtrace28__rust_begin_short_backtrace17h41d6339a4d6b9b77E:
    ... ...
__ZN3std2rt10lang_start17h8b3af1e9d6ac7258E:
    ... ...
```

* .section 指示段落为文本段，.build_version 表示构建的版本为 macos 11.0。
* `__ZN3std2rt10lang_start17h8b3af1e9d6ac7258E`是启动时调用的一个函数。这个函数的主要作用是初始化 Rust 运行时的各个组件，为程序的执行做好准备。下面是代码的主要步骤：
    1. 保存寄存器：将 x29 和 x30 保存到栈上，为后面的操作腾出空间。  
    2. 调用`__ZN4core3ops8function6FnOnce9call_once17hf10fe04e07b46ffbE`函数：这个函数的作用是确保`std::function::FnOnce`类型的实例只被调用一次。  
    3. 恢复寄存器：将 x29 和 x30 恢复到原来的值。  
    4. 调用`__ZN3std2rt19lang_start_internal17hadaf077a6dd0140bE`函数：这个函数是 Rust 运行时的内部函数，用于进行一些初始化工作。  
    5. 保存寄存器：将 x29 和 x30 保存到栈上，为后面的操作腾出空间。  
    6. 调用`__ZN3std2rt19lang_start_internal17hadaf077a6dd0140bE`函数：这个函数是 Rust 运行时的内部函数，用于进行一些初始化工作。  
    7. 恢复寄存器：将 x29 和 x30 恢复到原来的值。  
    8. 返回：结束初始化过程，返回到调用者处。

> 整个代码的执行过程可以概括为：保存寄存器 -> 调用初始化函数 -> 恢复寄存器 -> 调用内部初始化函数 -> 恢复寄存器 -> 返回。这个过程为 Rust 程序的执行奠定基础，确保运行时的各个组件处于正确的状态。

#### 解读`main`函数

```shell
__ZN4main4main17hdd2613d9f6a2edd6E:
	.cfi_startproc
	sub	sp, sp, #80
	.cfi_def_cfa_offset 80
	stp	x29, x30, [sp, #64]
	add	x29, sp, #64
	.cfi_def_cfa w29, 16
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	add	x8, sp, #16
	str	x8, [sp, #8]
	adrp	x0, l___unnamed_5@PAGE
	add	x0, x0, l___unnamed_5@PAGEOFF
	mov	w9, #1
	mov	x1, x9
	bl	__ZN4core3fmt9Arguments9new_const17h71bd3e081e7c68d0E
	ldr	x0, [sp, #8]
	bl	__ZN3std2io5stdio6_print17ha1fabf8eb351d161E
	.cfi_def_cfa wsp, 80
	ldp	x29, x30, [sp, #64]
	add	sp, sp, #80
	.cfi_def_cfa_offset 0
	.cfi_restore w30
	.cfi_restore w29
	ret
	.cfi_endproc

	.globl	_main
	.p2align	2
_main:
	.cfi_startproc
	stp	x29, x30, [sp, #-16]!
	mov	x29, sp
	.cfi_def_cfa w29, 16
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	mov	x2, x1
	mov	x8, x0
	sxtw	x1, w8
	adrp	x0, __ZN4main4main17hdd2613d9f6a2edd6E@PAGE
	add	x0, x0, __ZN4main4main17hdd2613d9f6a2edd6E@PAGEOFF
	mov	w3, #0
	bl	__ZN3std2rt10lang_start17h8b3af1e9d6ac7258E
	ldp	x29, x30, [sp], #16
	ret
	.cfi_endproc

	.section	__DATA,__const
	.p2align	3, 0x0
... ...
l___unnamed_8:
	.ascii	"Hello, world!\n"

	.section	__DATA,__const
	.p2align	3, 0x0
l___unnamed_5:
	.quad	l___unnamed_8
	.asciz	"\016\000\000\000\000\000\000"
```

* 这段代码是 Rust 程序的入口点，即 `main` 函数。`main` 函数是 Rust 程序的起始点，程序从这里开始执行。这段代码的主要任务是初始化 Rust 运行时，并调用真正的程序入口点。
* 代码主要步骤如下：
    1. 保存寄存器：将 x29 和 x30 保存到栈上，为后面的操作腾出空间。  
    2. 计算栈指针：将栈指针减去 80，为后续操作腾出空间。  
    3. 保存 x29 和 x30：将 x29 和 x30 保存到栈上，为后面的操作腾出空间。  
    4. 恢复 x29 和 x30：将 x29 和 x30 恢复到原来的值。  
    5. 调用 `__ZN4core3fmt9Arguments9new_const17h71bd3e081e7c68d0E` 函数：这个函数用于创建一个 `Arguments` 实例，用于存储命令行参数。  
    6. 调用 `__ZN3std2io5stdio6_print17ha1fabf8eb351d161E` 函数：这个函数用于输出 "Hello, world!"。  
    7. 恢复 x29 和 x30：将 x29 和 x30 恢复到原来的值。  
    8. 返回：结束程序的执行，返回到调用者处。

> 整个代码的执行过程可以概括为：保存寄存器 -> 初始化运行时 -> 调用真正的程序入口点 -> 恢复寄存器 -> 返回。这个过程为 Rust 程序的执行奠定基础，确保运行时的各个组件处于正确的状态。

> 以上就是 Hello World 汇编初探解读，希望对你有用，祝大家玩得开心 ^_^

> 如果您喜欢这篇文章，欢迎关注微信公众号《猿禹宙》、点赞、转发和赞赏。每一位读者的认可都是我持续创作的动力。

![公众号](/images/wechat-blog.png)
