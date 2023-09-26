---
title: DAI 架构流程图 —— Dai模块
date: 2023-09-26 15:16:18
categories: MakerDAO
tags: [MakerDAO,DAI]
description: 本文主要介绍DAI合约和DAI Join适配器
---

> 免责声明：本文不构成投资建议，仅研究技术为主，祝玩得开心 ^_^

### 上一节回顾

> 上个章节主要讲解了 DAI 架构流程图，其中包含了一些[晦涩难懂的术语](https://lispking.github.io/2023/09/22/dai-terminology/)。从本章节开始，我们将逐步解读每个合约模块的细节，以深入了解其工作原理。

### DAI 模块分绍

> DAI 的起源设计是为了代表核心系统认为与其内部债务单位等值的任何代币。因此，DAI 模块包含 [DAI 代币合约](https://github.com/makerdao/dss/blob/master/src/dai.sol)以及所有的 [DaiJoin](https://github.com/makerdao/dss/blob/2318555e87b1798e322feaab36265a6e20d637be/src/join.sol#L100) 适配器。

### DAI 合约交互流程图

> DAI 合约是面向用户的 ERC20 代币合约，负责维护外部 DAI 余额的会计核算。大多数功能对于具有变动供应的代币来说是标准的，但它还值得注意的是具有根据签名消息发行转账批准的能力。

![Dai Interactions with the Maker Protocol](images/makedao/DaiInteractions.png)


### DAI 关键机制和概念
* 在大多数情况下，[dai.sol](https://github.com/makerdao/dss/blob/master/src/dai.sol) 充当了一个典型的 ERC20 代币。这些代币已经被这里详细记录，建议阅读有关 ERC20 代币核心功能的文档。

* 与 ERC20 的区别：
    - DAI 合约中的 `transferFrom` 函数与通用的 `transferFrom` 函数的工作形式略有不同。DAI 合约允许进行“无限授权”。如果用户授权一个地址用于最大的 uint256 值，则该地址将具有无限授权，否则直到被告知。
    - `push`、`pull` 和 `move` 是 `transferFrom` 调用的别名，形式为 `transferFrom(msg.sender, usr, amount)` ，`transferFrom(usr, msg.sender, amount)` & `transferFrom(src, dst, amount)` 。
    - `permit` 是一种基于签名的批准函数。这允许最终用户签署一条消息，然后由另一方转发以提交其批准。这对于不需要最终用户持有 ETH 的应用程序很有用。要使用此功能，用户的地址必须与持有者、消费者、随机数、到期时间和允许的金额一起签署一条消息。然后，将其提交给 `permit()` 以更新用户的批准。

* <font color='red'>无限允许是一项相对不常见的做法（尽管变得越来越普遍）</font>。这可能是一种通过恶意合约欺骗用户，使其放弃所有 DAI 访问权限的手段。这在可升级合约中尤为令人担忧，因为合约可能在升级为恶意合约之前看起来无害。
* DAI 也容易受到已知的 [ERC20 竞态条件的影响](https://github.com/0xProject/0x-monorepo/issues/850)，但在无限授权的情况下通常不应成为问题。我们建议使用特定金额授权的任何用户都应注意这个问题，并在授权其他合约代表他们执行转账时谨慎行事。
* 在 `transferFrom` 功能中存在轻微的偏差：如果 `src == msg.sender`，则该函数不需要事先获得批准，而是将其视为从 `msg.sender` 到 `dst` 的正常转账。
* DAI 内置的元交易功能：DAI 代币提供了一种链下授权，这意味着作为以太坊地址的所有者，您可以使用 `permit()` 函数签署权限，基本上将允许另一以太坊地址获得额度。您授权的以太坊地址可以负责执行转账，但有一个额度限制。

### DAI 常见问题

> 为什么这些组件对多抵押物 Dai（MCD）系统如此重要？  
* Dai 合约是用户面向的 ERC20 合约，负责维护外部 Dai 余额的会计核算。
* 大多数功能对于具有变动供应的代币都是标准的，但它还值得注意的是，具有根据签名消息发行转移批准的能力。
* `join` 由三个智能合约组成，其中一个是 `DaiJoin` 合约。每个 `join` 合约都是专门为给定的代币类型加入 `vat` 而创建的。因此，每个 `join` 合约在系统中的代币类型略有不同的逻辑。`DaiJoin` 合约允许用户将其 Dai 从系统中撤回到标准 ERC20 代币中。


> 需要注意的问题（潜在的用户错误来源）

* DAI 也容易受到已知的 [ERC20 竞态条件](https://github.com/0xProject/0x-monorepo/issues/850)影响，但对于无限授权来说，通常不应该是个问题。<font color='red'>建议使用指定金额授权的用户要特别注意这个问题，并在授权其他合约代为执行转账时要谨慎。</font>
* 由于`join`合约系统的功能有限，用户错误的来源也相对较少。除合约错误外，如果用户不小心调用了`join`功能，他们总是可以通过在相应Join合约中的退出调用找回自己的代币。这里需要特别注意的问题是一个执行得当的网络钓鱼攻击。随着系统的发展，可能会创建更多的`join`合约，或者更多的用户界面，这可能会导致用户的资金被恶意的`join`合约盗取，这些合约实际上并没有将代币发送到汇集地址，而是发送到了其他合约或钱包。


> 故障模式（操作条件范围和外部风险因素）  

* 可能会出现需要创建新的 `join` 合约的 `vat` 更新。
* 如果一个 `gem` 合约在用户抵押品在系统中的时候进行代币升级或者将代币冻结，可能会出现一种情况，即用户在冻结或升级完成后无法赎回他们的抵押品。然而，这似乎是一个较小的风险，因为似乎正在进行这种升级的代币很可能会希望与 maker 社区合作，确保这不是一个问题。

### 参考资料

* [Dai Module](https://docs.makerdao.com/smart-contract-modules/dai-module)
* [Dai - Detailed Documentation](https://docs.makerdao.com/smart-contract-modules/dai-module/dai-detailed-documentation)
