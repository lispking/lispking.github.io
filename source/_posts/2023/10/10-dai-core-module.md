---
title: 解读 DAI 架构流程图 —— Core模块
date: 2023-10-10 15:00:00
categories: MakerDAO
tags: [MakerDAO,DAI]
description: 本文介绍了 DAI `Core`相关合约模块的细节，包括 `Vat`合约和`Spot`合约。`Vat` 是 `dss` 的核心 `Vault` 引擎。它存储 `Vault` 并跟踪所有相关的 `Dai` 和抵押品余额。它还定义了可以通过操作 `Vault` 和余额的规则。`Vat` 中定义的规则是不可变的，因此在某种程度上，可以将 `Vat` 中的规则视为 `dss` 的宪法。`Spot`是负责连接预言机（`Oracles`）与核心合约的现货接口。作为一个接口合约，它只存储当前的 `ilk` 列表。
---

> 免责声明：本文不构成投资建议，仅研究技术为主，祝玩得开心 ^_^

### 上一节回顾

> 上个章节主要讲解了[DAI 合约模块的细节](https://lispking.github.io/2023/09/26/dai-module/)，其中，包括 DAI 代币合约和所有的 DaiJoin 适配器。本章节，我们来解读Core模块的细节。

### 核心模块介绍

> 核心模块由[Vat](https://github.com/makerdao/dss/blob/master/src/vat.sol)和[Spot](https://github.com/makerdao/dss/blob/master/src/spot.sol)两个合约组成，该模块对系统至关重要，因为它包含了 Maker 协议的完整状态，并在系统正常运行状态下控制着系统的核心机制。

* `Vat` - `Vat` 是核心金库，`Dai` 和抵押品状态都保存在 `Vat` 中。`Vat` 合约没有外部依赖关系，并维护 `Dai` 的中心“会计不变量”。  

* `Spot` - `poke` 是现货中唯一的非认证函数。该函数接收一个32字节（`bytes32`）“`poke`”的 `ilk`。`poke` 调用两个外部函数，分别是`peek` 和 `file`。


> 需要注意的问题（潜在的用户错误来源）

* `Vat` 中的方法被编写得尽可能通用，因此它们的接口可能相当冗长。应注意确保您没有混淆参数的顺序。任何经过 `Vat` 身份验证的模块都具有完整的根访问权限，因此可以窃取系统中的所有抵押品。这意味着添加新的抵押品类型（以及相关的适配器）具有相当的风险。
* 当 `Cat` 升级时，必须同时更新多个对其的引用（`End`，`Vat.rely`，`Vow.rely`）。它还必须依赖于 `End` 和系统的 `pause.proxy()`。更多的注意点，等后续讲到`Cat`合约时，再次展开。
* 与 `dss` 的其他大部分部分相比，`spotter` 中的方法相对基本。单个未认证方法 `poke` 中用户错误的余地不大。如果提供了错误的 `bytes32`，则调用将失败。任何经过 `spot` 身份验证的模块都具有完整的根访问权限，因此可以添加和删除可以被“`poke`”的 `ilks`。虽然这并没有完全破坏系统，但可能会导致相当的风险。

> 故障模式（操作条件范围和外部风险因素）  

* 编码错误风险 
    - `Vat` - `Vat` 中的错误可能是灾难性的，可能导致系统中所有 `Dai` 和抵押品的丢失（或锁定）。这将使得无法修改金库或转移 `Dai`。拍卖可能会停止运作。关机可能会失败。  
    - `Spot` - `Spot` 中的错误很可能导致抵押品价格不再更新。在这种情况下，系统需要授权一个新的 `Spot`，然后该 `Spot` 将能够更新价格。总的来说，这不是一种灾难性的故障，因为这只会在某段时间内暂停所有价格波动。  
* 数据源风险 
    - `Vat`和`Spot`都依赖一组可信任的预言机来提供价格数据。如果这些价格数据源失败，将可能允许创建无支持的 `Dai`，或者不公平地清算安全的金库。
* 治理风险
    - `Vat` - 治理可以授权 `Vat` 对新的模块。这使得他们可以窃取抵押品（`slip`）或铸造无支持的 Dai（`suck`或添加无价值的抵押品类型）。如果使这样做变得代价高昂的加密经济保护措施失败，系统可能会受到攻击并被不良行为者榨取抵押品。

### `Vat`合约详细介绍

> `Vat` 是 `dss` 的核心 `Vault` 引擎。它存储 `Vault` 并跟踪所有相关的 `Dai` 和抵押品余额。它还定义了可以通过操作 `Vault` 和余额的规则。`Vat` 中定义的规则是不可变的，因此在某种程度上，可以将 `Vat` 中的规则视为 `dss` 的宪法。

![SystemDiagram](/images/makedao/TheMakerProtocolSystemDiagram.png)

* `Vat` - `Vault`引擎术语解析
    - `gem`: collateral tokens.
    - `dai`: stablecoin tokens.
    - `sin`: unbacked stablecoin (system debt, not belonging to any urn).
    - `ilks`: a mapping of Ilk types.
    - `Ilk`: a collateral type.
        - `Art`: total normalized stablecoin debt.
        - `rate`: stablecoin debt multiplier (accumulated stability fees).
        - `spot`: collateral price with safety margin, i.e. the maximum stablecoin allowed per unit of collateral.
        - `line`: the debt ceiling for a specific collateral type.
        - `dust`: the debt floor for a specific collateral type.
    - `urns`: a mapping of Urn types.
    - `Urn`: a specific Vault.
        - `ink`: collateral balance.
        - `art`: normalized outstanding stablecoin debt.
    - `init`: create a new collateral type.
    - `slip`: modify a user's collateral balance.
    - `flux`: transfer collateral between users.
    - `move`: transfer stablecoin between users.
    - `grab`: liquidate a Vault.
    - `heal`: create / destroy equal quantities of stablecoin and system debt (vice).
    - `fold`: modify the debt multiplier, creating / destroying corresponding debt.
    - `suck`: mint unbacked stablecoin (accounted for with vice).
    - `Line`: the total debt ceiling for all collateral types.
    - `frob`: modify a Vault.
        - `lock`: transfer collateral into a Vault.
        - `free`: transfer collateral from a Vault.
        - `draw`: increase Vault debt, creating Dai.
        - `wipe`: decrease Vault debt, destroying Dai.
        - `dink`: change in collateral.
        - `dart`: change in debt.
    - `fork`: to split a Vault - binary approval or splitting/merging Vaults.
        - `dink`: amount of collateral to exchange.
        - `dart`: amount of stablecoin debt to exchange.
    - `wish`: check whether an address is allowed to modify another address's gem or dai balance.
        - `hope`: enable wish for a pair of addresses.
        - `nope`: disable wish for a pair of addresses.

    <font color='red'>注意</font>：`art` 和 `Art` 代表标准化债务，即当乘以正确的利率时，可以得到最新的、当前的稳定币债务。

* Accounting
    - `debt` is the sum of all dai (the total quantity of dai issued).
    - `vice` is the sum of all sin (the total quantity of system debt).
    - `Ilk.Art` the sum of all art in the urns for that Ilk.
    - `debt` is vice plus the sum of `Ilk.Art * Ilk.rate` across all `ilks`.

* Collateral
    - `gem` can always be transferred to any address by it's owner.

* Dai
    - `dai` can only move with the consent of it's owner.
    - `dai` can always be transferred to any address by it's owner.

### `Vat`合约的核心机制和概念

* `Vat` 中的核心 `Vault`、`Dai` 和抵押状态由 `Vat` 维护。`Vat` 合约没有外部依赖关系，并维护 `Dai` 的中央“会计不变量”。适用于 `Vat` 的核心原则如下：  

    1. `Dai` 不能没有抵押品存在：  
    - `Ilk` 是一种特殊类型的抵押品。  
    - 抵押品`gem`分配给具有`slip`的用户。  
    - 抵押品`gem`在用户之间转移`flux`。  

    2. `Vault` 数据结构是 `Urn`：  
    - has `ink` - 负担的抵押品  
    - has `art` - 负担、标准化债务  

    3. 类似地，一个抵押品是一个 `Ilk`：  
    - has `Art` - 负担、标准化债务  
    - has `rate` - 债务缩放因子（下面进一步讨论）  
    - has `spot` - 带安全余量的价格  
    - has `line` - 债务上限  
    - has `dust` - 债务下限  
    <font color='red'>注意</font>：在上面的使用“`encumbered`”一词时，这是指“被锁定在 `Vault` 中”。 

* `Vault` 管理  
    - `Vault` 通过 `frob(i, u, v, w, dink, dart)` 进行管理，它使用用户 `van` 的 `gem` 修改用户 `u` 的 `Vault`，并为用户 `w` 创建 `dai`。
    - 通过调用 `grab(i, u, v, w, dink, dart)`，修改用户 `u` 的 `Vault`，将`gem`给用户 `v` 并为用户 `w` 创建 `sin`。`grab` 是 `Vault` 变现的手段，将债务从 `Vault` 转移到用户的 `sin` 余额。
    - `Sin` 代表“被查获”或“不良”债务，可以使用 `heal(uint rad where msg.sender is used as the address for the dai and sin balances)` 使用相等数量的 Dai 进行抵消。
        - <font color='red'>注意</font>：只有 `Vow` 才会有 `sin`，因此只有 `Vow` 能成功调用 `heal`。这是因为每当调用 `grab` 和 `suck` 时，将 `Vow` 的地址作为 `sin` 的接收方传递。需要注意的是，这取决于当前系统的设计和实现。
        - <font color='red'>注意</font>：heal 只能用正数（`uint`）调用，并将 `sub(dai[u])` 以及 `sub` 掉 `sin`。
    - `dai` 的数量可以通过 `move` 在用户之间转移。

* 通过 `fold(bytes32 ilk, address u, int rate)` 更新利率  
    - 一个 `ilk` 的利率是其与任何正常化债务（`art`）之间的转换因子，该债务的现值包括累积的费用。`fold` 的 `rate` 参数实际上是 `Ilk.rate` 值的变化，即缩放因子的差值（新 - 旧）。它是一个有符号整数，因此当前账户值可能增加或减少。将 `Ilk.Art * rate` 添加到地址 `u` 的 `dai` 余额（表示系统盈余的增加或减少）；通过将 `rate` 添加到 `Ilk.rate` 来隐式地更新所有与指定 `Ilk` 抵押的 `Vault` 的债务余额。
    - 关于利率和系统稳定，请参阅[利率模块](https://docs.makerdao.com/smart-contract-modules/rates-module)和[系统稳定器模块](https://docs.makerdao.com/smart-contract-modules/system-stabilizer-module)文档

### `Spot`合约详细介绍

> `Spot`是负责连接预言机（`Oracles`）与核心合约的现货接口。作为一个接口合约，它只存储当前的 `ilk` 列表。

![SpotDiagram](/images/makedao/TheMakerSpot.png)

### `Spot`合约的核心机制和概念

> `Poke` 是 `spot` 中唯一的非认证函数。该函数接收一个要`poked`的 `ilk` 的 `bytes32`。`Poke` 调用两个外部函数：  
1. `Peek` 调用给定 `ilk` 的 `OSM` 并将 `val`（值）和 `has`（布尔值，如果 `OSM` 中发生错误则为 `false`）作为返回值。只有在 `has == true` 时才会发生第二次外部调用。  
2. 在计算现货价格时，`par`（基本价格单位）对于计算 `DAI` 与价格中的 1 个单位的关系至关重要。然后将 `val`（值）除以 `par`（得到 `val` 与 `DAI` 的比率），再将结果除以 `ilk.mat`。这给我们提供了给定 `ilk` 的当前现货价格。  
3. 在计算`spot`后调用 `file`。这个函数用于 `ilk` 的当前清算价格更新 `vat`。

### 参考资料

* [Core Module](https://docs.makerdao.com/smart-contract-modules/core-module)
* [Vat Module](https://docs.makerdao.com/smart-contract-modules/core-module/vat-detailed-documentation)
* [Spot Module](https://docs.makerdao.com/smart-contract-modules/core-module/spot-detailed-documentation)