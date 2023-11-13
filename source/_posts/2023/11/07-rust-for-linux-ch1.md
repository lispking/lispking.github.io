---
title: RustForLinux：跟着清华训练营从零打造 Linux 驱动【第一课】
date: 2023-11-07 10:26:33
categories: RustForLinux
tags: [Linux,Rust]
description: 不知不觉，我已经步入清华训练营的第三阶段。第一阶段主要学习了 `Rust` 编程语言，并完成了 `Rustlings` 题目训练。在第二阶段，老师引导我们运用 `Rust` 从零开始构建一个小型操作系统。在这个过程中，我掌握了从裸机、批处理程序、分时系统、地址转换，到虚拟地址与物理内存页表映射处理，再到进程管理、文件系统以及并发设计等知识。一个名为 `rCore OS` 的操作系统便如此一步步地呈现在眼前。作业撰写属实不易，历经艰辛，我终于迎来了第三阶段。在这个阶段，我选修了《Rust fox Linux》课程，以期为未来的 `Linux` 设备驱动开发贡献力量。昨日是课程的第一节课，我又开始了各种环境准备工作。
---

## 从零打造 OS 回顾

不知不觉，我已经步入清华训练营的第三阶段。第一阶段主要学习了 `Rust` 编程语言，并完成了 `Rustlings` 题目训练。在第二阶段，老师引导我们运用 `Rust` 从零开始构建一个小型操作系统。在这个过程中，我掌握了从裸机、批处理程序、分时系统、地址转换，到虚拟地址与物理内存页表映射处理，再到进程管理、文件系统以及并发设计等知识。一个名为 `rCore OS` 的操作系统便如此一步步地呈现在眼前。作业撰写属实不易，历经艰辛，我终于迎来了第三阶段。在这个阶段，我选修了《Rust fox Linux》课程，以期为未来的 `Linux` 设备驱动开发贡献力量。昨日是课程的第一节课，我又开始了各种环境准备工作。

## Rust fox Linux 环境准备

### 练习题目说明

> 关于 Rust Fox Linux 的详细介绍，大家可直接访问[官网](https://rust-for-linux.com/)了解，此处不再赘述。现在，我们直接进入环境配置的主题。

首先，让我们一起来查看本节课的练习题目：`Rust for Linux` 仓库源码获取，编译环境部署，及Rust内核编译。之后尝试在模拟器 `Qemu` 上运行起来。

### 练习过程及运行结果

因为 `Rust-for-Linux/linux` 仓库下载确实太慢，所以，这次实验使用仓库是 `fujita/linux`：

```shell
git clone git@github.com:fujita/linux.git -b rust-e1000 --depth 1 linux-rust-e1000
```

> 注：这里用了两个小技巧：
> 1. 使用 `git` 协议下载，可以非常稳定将代码下载到本地
> 2. 不需要关注历史 commit 信息，加上 `--depth 1`命令


### 0. 环境准备

#### 环境说明

* 机器配置： `CPU：M1；内存：16G；磁盘：256G`
* 主机OS：`macOS Sonoma 14.0`
* 虚拟机：`Ubuntu 23.04`

#### 环境依赖

```shell
## first Update
sudo apt-get update

## Install dependency packages
sudo apt-get -y install \
  binutils build-essential libtool texinfo \
  gzip zip unzip patchutils curl git \
  make cmake ninja-build automake bison flex gperf \
  grep sed gawk bc \
  zlib1g-dev libexpat1-dev libmpc-dev \
  libglib2.0-dev libfdt-dev libpixman-1-dev libelf-dev libssl-dev

## Install the LLVM
sudo apt-get install clang-format clang-tidy clang-tools clang clangd libc++-dev libc++1 libc++abi-dev libc++abi1 libclang-dev libclang1 liblldb-dev libllvm-ocaml-dev libomp-dev libomp5 lld lldb llvm-dev llvm-runtime llvm python3-clang

## Add Rust environment
cd linux
make LLVM=1 rustavailable
rustup override set $(scripts/min-tool-version.sh rustc)
rustup component add rust-src
cargo install --locked --version $(scripts/min-tool-version.sh bindgen) bindgen
```

> 小技巧：若本地已经安装过 `bindgen`，在执行 `make LLVM=1 rustavailable` 会提示版本有差异，可以使用 `--force` 命令强制安装当前 `linux` 源码需要用到的版本。

### 1. 生成默认配置

```shell
make ARCH=arm64 LLVM=1 O=build defconfig
```

![make-defconfig-result](images/rust-for-linux/make-defconfig-result.png)


### 2. 支持 Rust 选项开启
```shell
make ARCH=arm64 LLVM=1 O=build menuconfig
```

#### 2.1 进入配置页面，按回车选择 `General setup`

![General-setup](images/rust-for-linux/General-setup.png)

#### 2.2 滚动到最下方，按空格选择 `Rust support`，然后，按 `ESC` 返回上一层

![make-menuconfig-result](images/rust-for-linux/make-menuconfig-result.png)

#### 2.3 再按一次 `ESC` 弹窗，按回车确认 `Yes` 即可保存配置
![Yes-confirm](images/rust-for-linux/Yes-confirm.png)

#### 2.4 配置保存结果如下图所示：

![save-config](images/rust-for-linux/save-config.png)

### 3. 编译内核

```shell
cd build && time make ARCH=arm64 LLVM=1 -j8
```

> 编译结果如下图所示，代表编译成功（整体时间花费约 `半小时`），若编译出错，最后会出现 `Error` 字眼

![compile-result](images/rust-for-linux/compile-result.png)


### 4. 进入 `Qemu` 环境验证

#### 4.1 准备 `busybox` 工具

```shell
## 下载，写作时，最新版本是 busybox-1.36.1
$ wget https://busybox.net/downloads/busybox-1.36.1.tar.bz2
## 解压
$ tar xjf busybox-1.36.1.tar.bz2
## 进入目录
$ cd busybox-1.36.1
## 开启静态二进制，架构用 arm64
$ make menuconfig ARCH=arm64
```

> 进入 `busybox` 菜单选择页，在 `Settings` 按回车进入下一个页面

![busybox-setting](images/rust-for-linux/busybox-setting.png)

> 找到 `Build static binary (no shared libs)` 选项，并按空格选中后，按 `ESC` 返回上层，再按一次进入提示保存页面，回车选择 `Yes` 保存即完成静态二进制编译支持。

![busybox-setting-build-staice-binary](images/rust-for-linux/busybox-setting-build-static-binary.png)


> 编译 busybox 二进制文件，并将该执行文件 copy 到 linux 源码目录

```shell
## 编译 busybox，编译成功后，会生成 busybox 可执行文件在 busybox-1.36.1 目录下
$ make -j8
## 拷贝文件到 rust-for-linux 工程项目根目录
cp /tmp/busybox-1.36.1/busybox $HOME/linux/
```

#### 4.2 开启 `Rust Samples`

* 按 [2. 支持 Rust 选项开启](#2-支持-rust-选项开启) 步骤，重新进入 `menuconfig`，开启所有 `Rust Samples`

* 增加 `rust_module_parameters` 模块，并将文件名及源码内容作如下修改

```shell
cd $HOME/linux

cp samples/rust/rust_module_parameters.rs samples/rust/rust_module_parameters_builtin_default.rs
cp samples/rust/rust_module_parameters.rs samples/rust/rust_module_parameters_builtin_custom.rs
cp samples/rust/rust_module_parameters.rs samples/rust/rust_module_parameters_loadable_default.rs
cp samples/rust/rust_module_parameters.rs samples/rust/rust_module_parameters_loadable_custom.rs

sed -i 's:rust_module_parameters:rust_module_parameters_builtin_default:g'  samples/rust/rust_module_parameters_builtin_default.rs
sed -i 's:rust_module_parameters:rust_module_parameters_builtin_custom:g'   samples/rust/rust_module_parameters_builtin_custom.rs
sed -i 's:rust_module_parameters:rust_module_parameters_loadable_default:g' samples/rust/rust_module_parameters_loadable_default.rs
sed -i 's:rust_module_parameters:rust_module_parameters_loadable_custom:g'  samples/rust/rust_module_parameters_loadable_custom.rs

echo 'obj-y	+= rust_module_parameters_builtin_default.o'  >> samples/rust/Makefile
echo 'obj-y	+= rust_module_parameters_builtin_custom.o'   >> samples/rust/Makefile
echo 'obj-m	+= rust_module_parameters_loadable_default.o' >> samples/rust/Makefile
echo 'obj-m	+= rust_module_parameters_loadable_custom.o'  >> samples/rust/Makefile
```
* 按 [3. 编译内核](#3-编译内核) 命令，将 `Rust Samples` 源码编译成 `.ko` 文件

#### 4.3 生成 `qemu-initramfs.img` 镜像

```shell
$ sed -i 's:samples/rust/:build/samples/rust/:' .github/workflows/qemu-initramfs.desc

$ build/usr/gen_init_cpio .github/workflows/qemu-initramfs.desc > qemu-initramfs.img
```

#### 4.4 执行 `qemu` 命令验证结果

```shell
qemu-system-aarch64 \
  -kernel build/arch/arm64/boot/Image.gz \
  -initrd qemu-initramfs.img \
  -M virt \
  -cpu cortex-a72 \
  -smp 2 \
  -nographic \
  -vga none \
  -no-reboot \
  -append ' \
    rust_module_parameters_builtin_custom.my_bool=n \
    rust_module_parameters_builtin_custom.my_i32=345543 \
    rust_module_parameters_builtin_custom.my_str=🦀mod \
    rust_module_parameters_builtin_custom.my_usize=84 \
    rust_module_parameters_builtin_custom.my_array=1,2,3 \
  ' \
  | sed 's:\r$::'
```

> 若执行结果如下所示，则代表内核准备一切就绪，然后，就可以愉快地开始编写内核驱动了。

```shell
[    0.000000] Booting Linux on physical CPU 0x0000000000 [0x410fd083]
[    0.000000] Linux version 6.1.0-rc1-gbb59bfc550bc-dirty (lispking@ubuntu) (Ubuntu clang version 15.0.7, Ubuntu LLD 15.0.7) #4 SMP PREEMPT Tue Nov  7 00:39:03 CST 2023
[    0.000000] random: crng init done
[    0.000000] Machine model: linux,dummy-virt
[    0.000000] efi: UEFI not found.
[    0.000000] NUMA: No NUMA configuration found
[    0.000000] NUMA: Faking a node at [mem 0x0000000040000000-0x0000000047ffffff]
[    0.000000] NUMA: NODE_DATA [mem 0x47fb0a00-0x47fb2fff]
[    0.000000] Zone ranges:
[    0.000000]   DMA      [mem 0x0000000040000000-0x0000000047ffffff]
[    0.000000]   DMA32    empty
[    0.000000]   Normal   empty
[    0.000000] Movable zone start for each node
[    0.000000] Early memory node ranges
[    0.000000]   node   0: [mem 0x0000000040000000-0x0000000047ffffff]
[    0.000000] Initmem setup node 0 [mem 0x0000000040000000-0x0000000047ffffff]
[    0.000000] cma: Reserved 32 MiB at 0x0000000045c00000
[    0.000000] psci: probing for conduit method from DT.
[    0.000000] psci: PSCIv1.1 detected in firmware.
[    0.000000] psci: Using standard PSCI v0.2 function IDs
[    0.000000] psci: Trusted OS migration not required
[    0.000000] psci: SMC Calling Convention v1.0
[    0.000000] percpu: Embedded 20 pages/cpu s44840 r8192 d28888 u81920
[    0.000000] Detected PIPT I-cache on CPU0
[    0.000000] CPU features: detected: Spectre-v2
[    0.000000] CPU features: detected: Spectre-v3a
[    0.000000] CPU features: detected: Spectre-v4
[    0.000000] CPU features: detected: Spectre-BHB
[    0.000000] CPU features: kernel page table isolation forced ON by KASLR
[    0.000000] CPU features: detected: Kernel page table isolation (KPTI)
[    0.000000] CPU features: detected: ARM erratum 1742098
[    0.000000] CPU features: detected: ARM errata 1165522, 1319367, or 1530923
[    0.000000] alternatives: applying boot alternatives
[    0.000000] Fallback order for Node 0: 0
[    0.000000] Built 1 zonelists, mobility grouping on.  Total pages: 32256
[    0.000000] Policy zone: DMA
[    0.000000] Kernel command line:  \
[    0.000000]     rust_module_parameters_builtin_custom.my_bool=n \
[    0.000000]     rust_module_parameters_builtin_custom.my_i32=345543 \
[    0.000000]     rust_module_parameters_builtin_custom.my_str=🦀mod \
[    0.000000]     rust_module_parameters_builtin_custom.my_usize=84 \
[    0.000000]     rust_module_parameters_builtin_custom.my_array=1,2,3 \
[    0.000000]
[    0.000000] Unknown kernel command line parameters "\ \ \ \ \ \", will be passed to user space.
[    0.000000] Dentry cache hash table entries: 16384 (order: 5, 131072 bytes, linear)
[    0.000000] Inode-cache hash table entries: 8192 (order: 4, 65536 bytes, linear)
[    0.000000] mem auto-init: stack:all(zero), heap alloc:off, heap free:off
[    0.000000] Memory: 58068K/131072K available (16640K kernel code, 3724K rwdata, 9340K rodata, 1920K init, 610K bss, 40236K reserved, 32768K cma-reserved)
[    0.000000] SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=2, Nodes=1
[    0.000000] rcu: Preemptible hierarchical RCU implementation.
[    0.000000] rcu: 	RCU event tracing is enabled.
[    0.000000] rcu: 	RCU restricting CPUs from NR_CPUS=256 to nr_cpu_ids=2.
[    0.000000] 	Trampoline variant of Tasks RCU enabled.
[    0.000000] 	Tracing variant of Tasks RCU enabled.
[    0.000000] rcu: RCU calculated value of scheduler-enlistment delay is 25 jiffies.
[    0.000000] rcu: Adjusting geometry for rcu_fanout_leaf=16, nr_cpu_ids=2
[    0.000000] NR_IRQS: 64, nr_irqs: 64, preallocated irqs: 0
[    0.000000] Root IRQ handler: gic_handle_irq
[    0.000000] GICv2m: range[mem 0x08020000-0x08020fff], SPI[80:143]
[    0.000000] rcu: srcu_init: Setting srcu_struct sizes based on contention.
[    0.000000] arch_timer: cp15 timer(s) running at 62.50MHz (virt).
[    0.000000] clocksource: arch_sys_counter: mask: 0x1ffffffffffffff max_cycles: 0x1cd42e208c, max_idle_ns: 881590405314 ns
[    0.000034] sched_clock: 57 bits at 63MHz, resolution 16ns, wraps every 4398046511096ns
[    0.002980] Console: colour dummy device 80x25
[    0.004651] printk: console [tty0] enabled
[    0.007369] Calibrating delay loop (skipped), value calculated using timer frequency.. 125.00 BogoMIPS (lpj=250000)
[    0.007492] pid_max: default: 32768 minimum: 301
[    0.008003] LSM: Security Framework initializing
[    0.009418] Mount-cache hash table entries: 512 (order: 0, 4096 bytes, linear)
[    0.009460] Mountpoint-cache hash table entries: 512 (order: 0, 4096 bytes, linear)
[    0.026170] cacheinfo: Unable to detect cache hierarchy for CPU 0
[    0.029376] cblist_init_generic: Setting adjustable number of callback queues.
[    0.029473] cblist_init_generic: Setting shift to 1 and lim to 1.
[    0.029646] cblist_init_generic: Setting shift to 1 and lim to 1.
[    0.030432] rcu: Hierarchical SRCU implementation.
[    0.030469] rcu: 	Max phase no-delay instances is 1000.
[    0.033692] EFI services will not be available.
[    0.034218] smp: Bringing up secondary CPUs ...
[    0.036121] Detected PIPT I-cache on CPU1
[    0.036535] cacheinfo: Unable to detect cache hierarchy for CPU 1
[    0.036748] CPU1: Booted secondary processor 0x0000000001 [0x410fd083]
[    0.038806] smp: Brought up 1 node, 2 CPUs
[    0.038882] SMP: Total of 2 processors activated.
[    0.038931] CPU features: detected: 32-bit EL0 Support
[    0.038972] CPU features: detected: 32-bit EL1 Support
[    0.039029] CPU features: detected: CRC32 instructions
[    0.040936] CPU: All CPU(s) started at EL1
[    0.041181] alternatives: applying system-wide alternatives
[    0.051596] devtmpfs: initialized
[    0.059255] clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 7645041785100000 ns
[    0.059383] futex hash table entries: 512 (order: 3, 32768 bytes, linear)
[    0.061648] pinctrl core: initialized pinctrl subsystem
[    0.067754] DMI not present or invalid.
[    0.073072] NET: Registered PF_NETLINK/PF_ROUTE protocol family
[    0.078576] DMA: preallocated 128 KiB GFP_KERNEL pool for atomic allocations
[    0.078836] DMA: preallocated 128 KiB GFP_KERNEL|GFP_DMA pool for atomic allocations
[    0.078989] DMA: preallocated 128 KiB GFP_KERNEL|GFP_DMA32 pool for atomic allocations
[    0.079167] audit: initializing netlink subsys (disabled)
[    0.080306] audit: type=2000 audit(0.060:1): state=initialized audit_enabled=0 res=1
[    0.082648] thermal_sys: Registered thermal governor 'step_wise'
[    0.082679] thermal_sys: Registered thermal governor 'power_allocator'
[    0.082882] cpuidle: using governor menu
[    0.083577] hw-breakpoint: found 6 breakpoint and 4 watchpoint registers.
[    0.083998] ASID allocator initialised with 32768 entries
[    0.086946] Serial: AMBA PL011 UART driver
[    0.109495] 9000000.pl011: ttyAMA0 at MMIO 0x9000000 (irq = 13, base_baud = 0) is a PL011 rev1
[    0.119838] printk: console [ttyAMA0] enabled
[    0.126688] KASLR enabled
[    0.141667] HugeTLB: registered 1.00 GiB page size, pre-allocated 0 pages
[    0.141915] HugeTLB: 16380 KiB vmemmap can be freed for a 1.00 GiB page
[    0.142109] HugeTLB: registered 32.0 MiB page size, pre-allocated 0 pages
[    0.142461] HugeTLB: 508 KiB vmemmap can be freed for a 32.0 MiB page
[    0.142690] HugeTLB: registered 2.00 MiB page size, pre-allocated 0 pages
[    0.142918] HugeTLB: 28 KiB vmemmap can be freed for a 2.00 MiB page
[    0.143139] HugeTLB: registered 64.0 KiB page size, pre-allocated 0 pages
[    0.143369] HugeTLB: 0 KiB vmemmap can be freed for a 64.0 KiB page
[    0.149168] ACPI: Interpreter disabled.
[    0.153037] iommu: Default domain type: Translated
[    0.153210] iommu: DMA domain TLB invalidation policy: strict mode
[    0.154257] SCSI subsystem initialized
[    0.156496] usbcore: registered new interface driver usbfs
[    0.156855] usbcore: registered new interface driver hub
[    0.157162] usbcore: registered new device driver usb
[    0.158855] pps_core: LinuxPPS API ver. 1 registered
[    0.159028] pps_core: Software ver. 5.3.6 - Copyright 2005-2007 Rodolfo Giometti <giometti@linux.it>
[    0.159383] PTP clock support registered
[    0.159870] EDAC MC: Ver: 3.0.0
[    0.163239] FPGA manager framework
[    0.163795] Advanced Linux Sound Architecture Driver Initialized.
[    0.169565] vgaarb: loaded
[    0.171109] clocksource: Switched to clocksource arch_sys_counter
[    0.171928] VFS: Disk quotas dquot_6.6.0
[    0.172122] VFS: Dquot-cache hash table entries: 512 (order 0, 4096 bytes)
[    0.172992] pnp: PnP ACPI: disabled
[    0.193200] NET: Registered PF_INET protocol family
[    0.194162] IP idents hash table entries: 2048 (order: 2, 16384 bytes, linear)
[    0.196748] tcp_listen_portaddr_hash hash table entries: 256 (order: 0, 4096 bytes, linear)
[    0.197047] Table-perturb hash table entries: 65536 (order: 6, 262144 bytes, linear)
[    0.197220] TCP established hash table entries: 1024 (order: 1, 8192 bytes, linear)
[    0.197443] TCP bind hash table entries: 1024 (order: 3, 32768 bytes, linear)
[    0.197638] TCP: Hash tables configured (established 1024 bind 1024)
[    0.198354] UDP hash table entries: 256 (order: 1, 8192 bytes, linear)
[    0.198603] UDP-Lite hash table entries: 256 (order: 1, 8192 bytes, linear)
[    0.199405] NET: Registered PF_UNIX/PF_LOCAL protocol family
[    0.202377] RPC: Registered named UNIX socket transport module.
[    0.202521] RPC: Registered udp transport module.
[    0.202608] RPC: Registered tcp transport module.
[    0.202683] RPC: Registered tcp NFSv4.1 backchannel transport module.
[    0.202833] PCI: CLS 0 bytes, default 64
[    0.205553] Unpacking initramfs...
[    0.213224] hw perfevents: enabled with armv8_pmuv3 PMU driver, 7 counters available
[    0.214024] kvm [1]: HYP mode not available
[    0.216554] Initialise system trusted keyrings
[    0.217642] workingset: timestamp_bits=42 max_order=15 bucket_order=0
[    0.220620] Freeing initrd memory: 4044K
[    0.226110] squashfs: version 4.0 (2009/01/31) Phillip Lougher
[    0.227693] NFS: Registering the id_resolver key type
[    0.227973] Key type id_resolver registered
[    0.228052] Key type id_legacy registered
[    0.228325] nfs4filelayout_init: NFSv4 File Layout Driver Registering...
[    0.228437] nfs4flexfilelayout_init: NFSv4 Flexfile Layout Driver Registering...
[    0.229037] 9p: Installing v9fs 9p2000 file system support
[    0.257877] Key type asymmetric registered
[    0.258024] Asymmetric key parser 'x509' registered
[    0.258280] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 245)
[    0.258430] io scheduler mq-deadline registered
[    0.258528] io scheduler kyber registered
[    0.281173] pl061_gpio 9030000.pl061: PL061 GPIO chip registered
[    0.284802] pci-host-generic 4010000000.pcie: host bridge /pcie@10000000 ranges:
[    0.285298] pci-host-generic 4010000000.pcie:       IO 0x003eff0000..0x003effffff -> 0x0000000000
[    0.285706] pci-host-generic 4010000000.pcie:      MEM 0x0010000000..0x003efeffff -> 0x0010000000
[    0.285822] pci-host-generic 4010000000.pcie:      MEM 0x8000000000..0xffffffffff -> 0x8000000000
[    0.286200] pci-host-generic 4010000000.pcie: Memory resource size exceeds max for 32 bits
[    0.286582] pci-host-generic 4010000000.pcie: ECAM at [mem 0x4010000000-0x401fffffff] for [bus 00-ff]
[    0.287438] pci-host-generic 4010000000.pcie: PCI host bridge to bus 0000:00
[    0.287643] pci_bus 0000:00: root bus resource [bus 00-ff]
[    0.287751] pci_bus 0000:00: root bus resource [io  0x0000-0xffff]
[    0.287839] pci_bus 0000:00: root bus resource [mem 0x10000000-0x3efeffff]
[    0.287906] pci_bus 0000:00: root bus resource [mem 0x8000000000-0xffffffffff]
[    0.288793] pci 0000:00:00.0: [1b36:0008] type 00 class 0x060000
[    0.290987] pci 0000:00:01.0: [1af4:1000] type 00 class 0x020000
[    0.291333] pci 0000:00:01.0: reg 0x10: [io  0x0000-0x001f]
[    0.291441] pci 0000:00:01.0: reg 0x14: [mem 0x00000000-0x00000fff]
[    0.291557] pci 0000:00:01.0: reg 0x20: [mem 0x00000000-0x00003fff 64bit pref]
[    0.291702] pci 0000:00:01.0: reg 0x30: [mem 0x00000000-0x0007ffff pref]
[    0.299655] pci 0000:00:01.0: BAR 6: assigned [mem 0x10000000-0x1007ffff pref]
[    0.299938] pci 0000:00:01.0: BAR 4: assigned [mem 0x8000000000-0x8000003fff 64bit pref]
[    0.300120] pci 0000:00:01.0: BAR 1: assigned [mem 0x10080000-0x10080fff]
[    0.300216] pci 0000:00:01.0: BAR 0: assigned [io  0x1000-0x101f]
[    0.304368] EINJ: ACPI disabled.
[    0.325575] virtio-pci 0000:00:01.0: enabling device (0000 -> 0003)
[    0.337729] Serial: 8250/16550 driver, 4 ports, IRQ sharing enabled
[    0.342061] SuperH (H)SCI(F) driver initialized
[    0.342814] msm_serial: driver initialized
[    0.345114] cacheinfo: Unable to detect cache hierarchy for CPU 0
[    0.363970] loop: module loaded
[    0.365534] megasas: 07.719.03.00-rc1
[    0.369024] physmap-flash 0.flash: physmap platform flash device: [mem 0x00000000-0x03ffffff]
[    0.370110] 0.flash: Found 2 x16 devices at 0x0 in 32-bit bank. Manufacturer ID 0x000000 Chip ID 0x000000
[    0.370513] Intel/Sharp Extended Query Table at 0x0031
[    0.371197] Using buffer write method
[    0.372739] physmap-flash 0.flash: physmap platform flash device: [mem 0x04000000-0x07ffffff]
[    0.373227] 0.flash: Found 2 x16 devices at 0x0 in 32-bit bank. Manufacturer ID 0x000000 Chip ID 0x000000
[    0.373411] Intel/Sharp Extended Query Table at 0x0031
[    0.373823] Using buffer write method
[    0.374013] Concatenating MTD devices:
[    0.374080] (0): "0.flash"
[    0.374135] (1): "0.flash"
[    0.374183] into device "0.flash"
[    0.402443] tun: Universal TUN/TAP device driver, 1.6
[    0.412486] thunder_xcv, ver 1.0
[    0.412655] thunder_bgx, ver 1.0
[    0.412775] nicpf, ver 1.0
[    0.414505] hns3: Hisilicon Ethernet Network Driver for Hip08 Family - version
[    0.414606] hns3: Copyright (c) 2017 Huawei Corporation.
[    0.414884] hclge is initializing
[    0.415188] e1000: Intel(R) PRO/1000 Network Driver
[    0.415334] e1000: Copyright (c) 1999-2006 Intel Corporation.
[    0.415495] e1000e: Intel(R) PRO/1000 Network Driver
[    0.415565] e1000e: Copyright(c) 1999 - 2015 Intel Corporation.
[    0.415691] igb: Intel(R) Gigabit Ethernet Network Driver
[    0.415762] igb: Copyright (c) 2007-2014 Intel Corporation.
[    0.415936] igbvf: Intel(R) Gigabit Virtual Function Network Driver
[    0.416031] igbvf: Copyright (c) 2009 - 2012 Intel Corporation.
[    0.416566] sky2: driver version 1.30
[    0.418481] VFIO - User Level meta-driver version: 0.3
[    0.424271] usbcore: registered new interface driver usb-storage
[    0.430233] rtc-pl031 9010000.pl031: registered as rtc0
[    0.430844] rtc-pl031 9010000.pl031: setting system clock to 2023-11-07T02:07:24 UTC (1699322844)
[    0.432472] i2c_dev: i2c /dev entries driver
[    0.441267] sdhci: Secure Digital Host Controller Interface driver
[    0.441431] sdhci: Copyright(c) Pierre Ossman
[    0.442435] Synopsys Designware Multimedia Card Interface Driver
[    0.443827] sdhci-pltfm: SDHCI platform and OF driver helper
[    0.446804] ledtrig-cpu: registered to indicate activity on CPUs
[    0.450360] usbcore: registered new interface driver usbhid
[    0.450516] usbhid: USB HID core driver
[    0.460351] NET: Registered PF_PACKET protocol family
[    0.461240] 9pnet: Installing 9P2000 support
[    0.461505] Key type dns_resolver registered
[    0.462550] registered taskstats version 1
[    0.462788] Loading compiled-in X.509 certificates
[    0.478386] input: gpio-keys as /devices/platform/gpio-keys/input/input0
[    0.485333] ALSA device list:
[    0.485476]   No soundcards found.
[    0.487838] uart-pl011 9000000.pl011: no DMA platform data
[    0.552766] Freeing unused kernel memory: 1920K
[    0.554425] Run /init as init process
[    0.599959] rust_minimal: Rust minimal sample (init)
[    0.600217] rust_minimal: Am I built-in? false
[    0.608276] rust_minimal: My numbers are [72, 108, 200]
[    0.608700] rust_minimal: Rust minimal sample (exit)
[    0.634221] rust_print: Rust printing macros sample (init)
[    0.634386] rust_print: Emergency message (level 0) without args
[    0.634500] rust_print: Alert message (level 1) without args
[    0.634600] rust_print: Critical message (level 2) without args
[    0.634698] rust_print: Error message (level 3) without args
[    0.634792] rust_print: Warning message (level 4) without args
[    0.634893] rust_print: Notice message (level 5) without args
[    0.635004] rust_print: Info message (level 6) without args
[    0.635326] rust_print: A line that is continued without args
[    0.635472] rust_print: Emergency message (level 0) with args
[    0.635612] rust_print: Alert message (level 1) with args
[    0.635717] rust_print: Critical message (level 2) with args
[    0.635832] rust_print: Error message (level 3) with args
[    0.635923] rust_print: Warning message (level 4) with args
[    0.636029] rust_print: Notice message (level 5) with args
[    0.636168] rust_print: Info message (level 6) with args
[    0.636271] rust_print: A line that is continued with args
[    0.641051] rust_print: Rust printing macros sample (exit)
[    0.661989] rust_module_parameters: Rust module parameters sample (init)
[    0.662277] rust_module_parameters: Parameters:
[    0.662482] rust_module_parameters:   my_bool:    true
[    0.662831] rust_module_parameters:   my_i32:     42
[    0.663290] rust_module_parameters:   my_str:     default str val
[    0.663454] rust_module_parameters:   my_usize:   42
[    0.663619] rust_module_parameters:   my_array:   [0, 1]
[    0.668656] rust_module_parameters: Rust module parameters sample (exit)
[    0.706889] rust_sync: Rust synchronisation primitives sample (init)
[    0.707309] rust_sync: Value: 10
[    0.707539] rust_sync: Value: 10
[    0.712511] rust_sync: Rust synchronisation primitives sample (exit)
[    0.738252] rust_chrdev: Rust character device sample (init)
[    0.748668] rust_chrdev: Rust character device sample (exit)
[    0.774016] rust_miscdev: Rust miscellaneous device sample (init)
[    0.779921] rust_miscdev: Rust miscellaneous device sample (exit)
[    0.805377] rust_stack_probing: Rust stack probing sample (init)
[    0.805577] rust_stack_probing: Large array has length: 514
[    0.810494] rust_stack_probing: Rust stack probing sample (exit)
[    0.830702] rust_semaphore: Rust semaphore sample (init)
[    0.836407] rust_semaphore: Rust semaphore sample (exit)
[    0.857872] rust_semaphore_c: Rust semaphore sample (in C, for comparison) (init)
[    0.863246] rust_semaphore_c: Rust semaphore sample (in C, for comparison) (exit)
[    0.906868] rust_selftests: Rust self tests (init)
[    0.907530] rust_selftests: test_example passed!
[    0.907692] rust_selftests: 1 tests run, 1 passed, 0 failed, 0 hit errors
[    0.908698] rust_selftests: All tests passed. Congratulations!
[    0.918844] rust_selftests: Rust self tests (exit)
[    0.946373] rust_module_parameters: Rust module parameters sample (init)
[    0.946562] rust_module_parameters: Parameters:
[    0.946660] rust_module_parameters:   my_bool:    true
[    0.946769] rust_module_parameters:   my_i32:     42
[    0.946883] rust_module_parameters:   my_str:     default str val
[    0.947132] rust_module_parameters:   my_usize:   42
[    0.947252] rust_module_parameters:   my_array:   [0, 1]
[    0.955361] rust_module_parameters: Rust module parameters sample (init)
[    0.955539] rust_module_parameters: Parameters:
[    0.955638] rust_module_parameters:   my_bool:    false
[    0.955742] rust_module_parameters:   my_i32:     345543
[    0.955977] rust_module_parameters:   my_str:     🦀mod
[    0.956086] rust_module_parameters:   my_usize:   84
[    0.956192] rust_module_parameters:   my_array:   [1, 2, 3]
[    0.961556] rust_module_parameters: Rust module parameters sample (exit)
[    0.984385] rust_module_parameters: Rust module parameters sample (exit)
[    1.021134] Flash device refused suspend due to active operation (state 20)
[    1.021312] Flash device refused suspend due to active operation (state 20)
[    1.021651] reboot: Restarting system
```

## 未完待续

> 以上就是关于 [清华开源操作系统训练营] 《Rust fox Linux》第一课学到的知识，希望这节课能对您有所帮助。祝大家玩得开心 ^_^

> 如果您喜欢这篇文章，欢迎关注微信公众号《猿禹宙》、点赞、转发和赞赏。每一位读者的认可都是我持续创作的动力。

![公众号](images/wechat-blog.png)