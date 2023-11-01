---
title: RISC-V：跟着清华训练营从零打造OS【第四课】
date: 2023-11-01 16:52:38
categories: RISC-V
tags: [RISC-V,Rust]
description: 在 RISC-V：跟着清华训练营从零打造OS【第三课】中，我们学习了地址空间和进程管理的设计。本节课将主要探讨文件系统的设计，文件系统在 UNIX 操作系统中具有举足轻重的地位。根据史料《UNIX:A History and a Memoir》记载，1969 年，UNIX 的作者 Ken Thompson 在贝尔实验室的空闲时间里，编写了一个用于提高 PDP-7 计算机磁盘吞吐量的调度算法。为了测试这个算法，他打算编写一个批量读写数据的测试程序。然而，在编写过程中，Thompson 在某一刻意识到，这个测试程序稍作扩展，就能成为一个文件系统，再进一步扩展，便可以成为一个完整的操作系统。他意识到，自己距离实现一个操作系统仅有短短三周的时间。
---

## 上一节回顾

在 [RISC-V：跟着清华训练营从零打造OS【第三课】](https://lispking.github.io/2023/10/30/risc-v-learning-ch3/)中，我们主要讲解了操作系统中的地址空间和进程管理的设计。通过利用硬件的分页机制，实现了内核的安全核心机制，构建了一种经典的抽象 —— `地址空间`。同时，介绍了`进程管理机制`的设计与实现，以满足多道程序在系统中高效运行的需求。通过这些改进，可以为应用程序提供更流畅、更安全、更便捷、高效的操作系统环境。

## 文件系统

先来看一段有趣的 UNIX 历史， 在 UNIX 文件系统眼中有一个著名的理念：`一切皆文件`，可见得文件系统在 UNIX 操作系统中具有举足轻重的地位。

```
根据史料《UNIX: A History and a Memoir》记载，1969 年，UNIX 的作者 Ken Thompson 在贝尔实验室的空闲时间里，编写了一个用于提高 PDP-7 计算机磁盘吞吐量的调度算法。为了测试这个算法，他打算编写一个批量读写数据的测试程序。然而，在编写过程中，Thompson 在某一刻意识到，这个测试程序稍作扩展，就能成为一个文件系统，再进一步扩展，便可以成为一个完整的操作系统。他意识到，自己距离实现一个操作系统仅有短短三周的时间。

第一周，他专注于编写代码编辑器；第二周，编写汇编器；第三周，编写 shell 程序。在编写这些程序的过程中，他还需添加操作系统的功能（如 exec 等系统调用），以支持这些应用程序。经过三周的努力，Thompson 成功创建了一个用于测试磁盘调度算法性能的 UNIX 操作系统雏形。
```

本节课将实现一个简单的文件系统 —— `EasyFS`，它能对持久存储设备（`Persistent Storage`）这种 I/O 资源进行有效管理。

为了满足应用程序对持久存储设备的访问需求，内核需新增两种文件类型：`常规文件`和`目录文件`。这两种文件均以文件系统所维护的磁盘文件形式组织并存储在持久存储设备上。从而，形成了具备强大 UNIX 操作系统基本功能的 `霸王龙` 操作系统。

* 常规文件：用于存储应用程序的数据。
* 目录文件：用于存储文件系统内部的信息。

这两种文件类型共同构成了文件系统的基础，使得操作系统能够对存储设备进行高效的管理和访问。

![FilesystemOS](images/risc-v/FilesystemOS.png)

通过上图，我们可以大致了解`霸王龙`操作系统 —— `FilesystemOS` 对文件系统的支持以及为应用程序提供的文件访问相关系统调用服务。在进程管理方面，`FilesystemOS` 进一步扩展了资源管理的范围，将打开文件的相关信息放入 `fd table` 数据结构中，纳入进程管理，并基于此提供了一系列与文件访问相关的系统调用服务，如 `sys_open`、`sys_close`、`sys_read`、`sys_write` 等。

在设备管理层面，`FilesystemOS` 增加了块设备驱动 —— `BlockDrv`，通过访问块设备数据来实现对文件系统与文件各种数据的读写。文件系统 —— `EasyFS` 成为 `FilesystemOS` 的核心内核模块，负责完成文件与存储块之间的数据/地址映射关系，并基于存储块进行读写操作。

`EasyFS` 的核心数据结构包括：
* `Superblock`：表示整个文件系统结构
* `inode bitmap`：表示存放 inode 磁盘块空闲情况的位图
* `data bitmap`：表示存放文件数据磁盘块空闲情况的位图
* `inode blks`：存放文件元数据的磁盘块
* `data blks`：存放文件数据的磁盘块

此外，`EasyFS` 中的块缓存管理器 `BlockManager` 在内存中管理有限个 `BlockCache` 磁盘块缓存，并通过 `Blk Interface`（与块设备驱动对接的读写操作接口）与 `BlockDrv` 块设备驱动程序进行互操作。

接下来，让我们共同探讨文件系统的数据结构。

![FilesystemStruct](images/risc-v/FilesystemStruct.png)

在 `EasyFS` 设计中，采用了松耦合的模块化设计理念。通过使用抽象接口 `BlockDevice`，`EasyFS` 与底层设备驱动之间实现了解耦，避免了与设备驱动的绑定。此外，`EasyFS` 借助 `Rust` 提供的 `alloc crate` 实现了对操作系统内核内存管理的隔离，避免了直接调用内存管理的内核函数。

在底层驱动方面，采用轮询方式访问 `virtio_blk` 虚拟磁盘设备，从而避免了访问外设中断相关的内核函数。在设计过程中，`EasyFS` 充分考虑了避免直接访问进程相关的数据和函数，从而实现了与操作系统内核的进程管理隔离。

`EasyFS` `crate` 自下而上大致可以分成五个不同的层次：

* 磁盘块设备接口层：定义了以块大小为单位对磁盘块设备进行读写的 `trait` 接口
* 块缓存层：在内存中缓存磁盘块的数据，避免频繁读写磁盘
* 磁盘数据结构层：磁盘上的超级块、位图、索引节点、数据块、目录项等核心数据结构和相关处理
* 磁盘块管理器层：合并了上述核心数据结构和磁盘布局所形成的磁盘文件系统数据结构，以及基于这些结构的创建/打开文件系统的相关处理和磁盘块的分配和回收处理
* 索引节点层：管理索引节点（即文件控制块）数据结构，并实现文件创建/文件打开/文件读写等成员函数来向上支持文件操作相关的系统调用

最后，一起看看相关接口代码定义：

```rust
/// 块设备的抽象接口 BlockDevice
pub trait BlockDevice : Send + Sync + Any {
    /// 将编号为 block_id 的块从磁盘读入内存中的缓冲区 buf ；
    fn read_block(&self, block_id: usize, buf: &mut [u8]);
    /// 将内存中的缓冲区 buf 中的数据写入磁盘编号为 block_id 的块。
    fn write_block(&self, block_id: usize, buf: &[u8]);
}


pub const BLOCK_SZ: usize = 512;

/// 块缓存 BlockCache
pub struct BlockCache {
    /// 一个 512 字节的数组，表示位于内存中的缓冲区；
    cache: [u8; BLOCK_SZ],
    /// 记录这个块缓存来自于磁盘中的块的编号
    block_id: usize,
    /// 一个底层块设备的引用，可通过它进行块读写
    block_device: Arc<dyn BlockDevice>,
    /// 记录这个块从磁盘载入内存缓存之后，它有没有被修改过
    modified: bool,
}

/// 超级块 SuperBlock
#[repr(C)]
pub struct SuperBlock {
    /// 用于文件系统合法性验证的魔数
    magic: u32,
    /// 文件系统的总块数
    pub total_blocks: u32,
    /// 索引节点位图，长度为若干个块。记录后面的索引节点区域中有哪些索引节点已经被分配出去使用了，而哪些还尚未被分配出去
    pub inode_bitmap_blocks: u32,
    /// 索引节点区域，长度为若干个块。其中的每个块都存储了若干个索引节点
    pub inode_area_blocks: u32,
    /// 数据块位图，长度为若干个块。记录后面的数据块区域中有哪些数据块已经被分配出去使用了，而哪些还尚未被分配出去。
    pub data_bitmap_blocks: u32,
    /// 数据块区域，顾名思义，其中的每一个已经分配出去的块保存了文件或目录中的具体数据内容。
    pub data_area_blocks: u32,
}

/// 磁盘块管理器
pub struct EasyFileSystem {
    /// 块设备指针
    pub block_device: Arc<dyn BlockDevice>,
    /// 索引节点位图
    pub inode_bitmap: Bitmap,
    /// 数据块位图
    pub data_bitmap: Bitmap,
    /// 索引节点区域起始块编号
    inode_area_start_block: u32,
    /// 数据块区域起始块编号
    data_area_start_block: u32,
}

/// 索引节点，在内存中记录文件索引节点信息
pub struct Inode {
    /// 记录该 Inode 对应的 DiskInode 保存在磁盘上的 id
    block_id: usize,
    /// 记录该 Inode 对应的 DiskInode 保存在磁盘上的偏移量
    block_offset: usize,
    /// 指向 EasyFileSystem 的一个指针
    fs: Arc<Mutex<EasyFileSystem>>,
    block_device: Arc<dyn BlockDevice>,
}
```

## 未完待续 ... ...

> 以上就是关于 [清华开源操作系统训练营] 第四课学到的知识，文件系统领域仍有很多待探索之处，后续的学习之路亦颇为漫长。希望这节课对您有所帮助。祝大家玩得开心 ^_^

> 如果您喜欢这篇文章，欢迎关注微信公众号《猿禹宙》、点赞、转发和赞赏。每一位读者的认可都是我持续创作的动力。

![公众号](images/wechat-blog.png)
