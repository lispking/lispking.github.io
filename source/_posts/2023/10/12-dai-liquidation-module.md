---
title: 解读 DAI 架构流程图 —— 清算2.0模块
date: 2023-10-12 10:15:36
categories: MakerDAO
tags: [MakerDAO,DAI]
description: 本文着重讲解清算2.0模块的细节，这是Maker协议的抵押物拍卖行，主要解决从不足以抵押的 Vault 中自动转移抵押品，并同时将该 Vault 的债务转移至协议。在清算合约（Dog）中，会立即启动拍卖，试图通过出售转移的抵押品来换取 DAI，以抵消已分配给协议的债务。
---

> 免责声明：本文不构成投资建议，仅研究技术为主，祝玩得开心 ^_^

### 上一节回顾

> 上个章节主要讲解了[Collateral模块相关合约的细节](https://lispking.github.io/2023/10/11/dai-collateral-module/)，Collateral模块在MCD系统中充当抵押品角色，该模块会为 `Vat` 中添加的每个新抵押品类型（`collateral type`）进行部署。它包含了针对某一特定抵押品类型的所有适配器和拍卖合约。抵押品模块主要由[Join](https://github.com/makerdao/dss/blob/master/src/join.sol)和[Clip](https://github.com/makerdao/dss/blob/master/src/clip.sol)合约组成。本章节，我们来解读清算模块的细节。


### 清算模块介绍

> 在 `Maker`协议的背景下，清算（`liquidation`）是指从不足以抵押的 `Vault` 中自动转移抵押品，并同时将该 `Vault` 的债务转移至协议。在清算合约（`Dog`）中，会立即启动拍卖，试图通过出售转移的抵押品来换取 `DAI`，以抵消已分配给协议的债务。该模块主要由[clip](https://github.com/makerdao/dss/blob/master/src/clip.sol)、[dog](https://github.com/makerdao/dss/blob/master/src/dog.sol)和[abaci](https://github.com/makerdao/dss/blob/master/src/abaci.sol)等合约组成。


### 清算模块的那些特征

> 即时结算
* 与旧版 Liquidation 1.2 系统不同，该系统使用英语拍卖，其中 DAI 投标不断叠加，参与者的资金将在他们被竞标或拍卖结束之前一直处于锁定状态。Liquidation 2.0 使用荷兰拍卖，实现即时结算。这是根据起始价格以及自拍卖开始以来经过的时间计算的价格。关于价格与时间的曲线，我们将在后面进行更详细的讨论。缺乏锁定期大大减轻了拍卖参与者的价格波动风险，并允许更快地回收资金。

> 抵押品闪电借贷  
* 此功能由即时结算启用，消除了投标人（除燃气外）的任何资本要求 —— 换句话说，即使一个拥有零 DAI（没有可以用于交易 DAI 的资产）的参与者仍然可以通过将拍卖抵押品的销售引导到其他协议以换取 DAI 来购买拍卖品。因此，DeFi 中可用的所有 DAI 流动性都可以被任何参与者用于购买抵押品，仅受燃气要求限制。上述确切机制已进行讨论，但本质上，参与者需要指定一个符合特定接口的合约，以及提供给该合约的调用数据，拍卖合约将自动调用外部合约中的任何逻辑。

> 价格作为时间的函数  
* 价格 - 与时间曲线是通过一个接口来指定的，该接口将当前时间的价格视为拍卖初始价格的函数以及该价格设置的时间。如何确定给定抵押品最有效的价格曲线仍然是一个活跃的研究领域；一些初始选项（线性、分段指数和连续指数）已经为研究目的和初始部署而实施。除了这些选项之外，还包括分段线性曲线和分段指数曲线。此模块是可配置的，可以在创新过程中进行替换。
* 投标人应注意，尽管价格通常会随着时间的推移而下降，但偶尔会发生活跃拍卖的价格上升的情况，这可能导致以高于预期的价格购买抵押品。在运行拍卖中增加价格的最明显事件是重置拍卖（通过重做），但治理可以通过更改价格下降计算器（或甚至用另一个计算器替换）的可配置参数来增加价格。建议投标人（或抽象出此详细信息的投标 UI）选择最大可接受价格（max）参数仔细考虑，以确保在价格意外上升时获得理想的结果。

> 重置拍卖  
* 如上文所述，拍卖可能因以下两个原因进入失效状态而需要重置：  
* 自拍卖开始以来已经过去了太多时间（由尾随治理参数控制）  
* 当前价格与初始价格的比率已降至某一水平以下（由尖点治理参数指定）。  
* 当调用重置函数时，首先确保至少满足其中之一条件。然后，将拍卖的开始时间调整为当前时间，并将起始价格设置为初始化函数中执行的方式（即当前 OSM 价格百分比增加由 buf 参数确定）。这个过程将重复进行，直到所有抵押品都已售出或已收取全部债务（除非通过 yank 取消拍卖，例如在紧急关机期间），否则对比当前拍卖，在至少收到一个投标之前重置。

> 提高 Keeper 钱包安全性
* 如果保管人选择使用 `clipperCallee` 模式，那么他们就不需要在该账户上存储 DAI 或抵押品。这意味着保管人只需持有足够的 ETH 来执行可以协调 `Clipper.take` 调用的交易，将抵押品发送到一个返回 DAI 给 `msg.sender` 的合约以在一次交易中支付抵押品。实现 `clipperCallee` 接口的合约可以将保管人无法访问的冷钱包地址的任何剩余抵押品或 DAI 发送至保管人无法访问的冷钱包地址。<font color='red'>** 注意：如果保管人选择作为一个 EOA 地址行为，那么除非特别小心地创建一个代理合同，否则 DAI 和抵押品将像 LIQ-1.2 一样暴露。**</font>

### 清算模块的合约细节

> 通过文件设置的治理参数  
* Abacus/LinearDecrease -- tau [秒]  ：拍卖开始后价格达到零时的秒数。  
* Abacus/StairstepExponentialDecrease -- cut [ray]  ：每步乘法因子。cut = 0.99 * RAY 指定每步秒数下降 1%。  
* Abacus/StairstepExponentialDecrease -- step [秒]  ：价格下降之间的时间间隔。  
* Abacus/ExponentialDecrease -- cut [ray]  ：每秒乘法因子。cut = 0.99 * RAY 指定每秒下降 1%。  
* Clipper -- buf [ray]  ：增加拍卖起始价格的乘法因子。例如，如果某种资产的当前 OSM 价格为 1,000，而 buf = 1.2 * RAY（高出 20%），则该拍卖的初始价格将为 1,200。  
* Clipper -- calc [地址]  ：价格计算器函数的合约地址。遵循 Abacus 接口。有关价格函数的一些示例可以在 abaci.sol 文件中找到。  
* Clipper -- chip [wad]  ：从 vow 吸筹以激励保管人在清算金库或重置现有拍卖时的百分比。chip = 0.02 * WAD 为 2%。  
* Clipper -- cusp [ray]  ：在拍卖必须重置之前可以发生的价格下降百分比。与 tail 一起，此参数确定何时需要重置拍卖。例如，如果拍卖的初始价格（top）设定为 1,200，而 cusp = 0.6 * RAY（起始价格的 60%），则拍卖在达到刚好低于 720 的价格时需要重置。  
* Clipper -- dog [地址]  ：清算模块合约的地址。  
* Clipper -- spotter [地址]  ：抵押品价格模块合约地址。  
* Clipper -- tail [秒]  ：拍卖必须重置之前可以流逝的秒数。与 cusp 一起，此参数确定何时需要重置拍卖。例如，如果 tail 为 1800 秒，则如果拍卖在 30 分钟过去后仍未完成，它将需要重置。
* Clipper -- tip [rad]  ：从 vow 中提取的扁平费用，用于在清算金库或重置现有拍卖时激励保管人。tip = 100 * RAD 为 100 DAI。  
* Clipper -- vow [地址]  ：会计系统合约的地址。拍卖中筹集的 DAI 的接收者。  
* Dog -- Hole [rad]  ：用于支付活跃拍卖中的债务 + 清算罚款所需的最大 DAI。Hole = 10,000,000 * RAD 为 10M DAI。  
* Dog -- ilk.chop [wad]  ：每个抵押品（ilk）的清算罚款。例如，如果有一个准备清算的金库，其债务为 1,000 DAI，而 chop = 1.13 * WAD（高出 13%），则拍卖筹集的最大金额将为 1,130 DAI。  
* Dog -- ilk.clip [地址]  ：拍卖模块合约的地址。每个抵押品（ilk）有一个剪辑。  
* Dog -- ilk.hole [rad]  ：每个抵押品（ilk）用于支付活跃拍卖中的债务 + 清算罚款所需的最大 DAI。hole = 10,000,000 * RAD 为 10M DAI。  
* Dog -- vow [地址]  ：会计系统合约的地址。当金库被清算时，来自金库的坏账的接收者。

> `Vault`清算函数（`Dog.bark`）
* 接受三个调用者提供的参数：  
	- `ilk`：抵押品类型  
	- `urn`：要清算的金库  
	- `kpr`：DAI 激励将发送到的地址  
* `Dog.bark` 执行以下操作：  
	- 如果金库 `urn` 资本不足，则没收该金库 `urn`  
		- 将抵押品发送到 `ilk` 的 `Clipper`  
		- 增加 `vow` 的坏账累积器  
	- 将坏账推入债务队列  
	- 将坏账加清算罚款添加到带有 `Dirt` 累积器的 `Hole` 中  
	- 将坏账加清算罚款添加到 `ilk.hole` 中，使用 `ilk.dirt` 累积器  
	- 通过调用 `Clipper.kick()` 启动拍卖  
	- 触发 `Bark()`` 事件  
* 在 `Maker` 协议的背景下，"清算" 是将抵押品从资本不足的金库自动转移，以及将该金库的债务转移到协议。在清算 1.2 版本（`Cat`）和清算 2.0 版本（`Dog`）中，都会迅速启动拍卖，试图将转移的抵押品出售为 DAI，以抵消现在分配给协议的债务。这使得新合约的行为与旧合约非常相似，但有一些重要的区别，如下所述。

* 部分清算与全部清算  
	- 在当前系统中，每次调用清算函数（`Cat.bite`）都会从受影响的金库中转移固定数量的债务（`dunk`），以及相应的金库抵押品数量到协议。例如，如果协议接收了金库的 50% 的债务，那么也会接收其 50% 的抵押品。如果金库的债务少于 `dunk`，那么所有债务和抵押品都会被接收。
	- 在 2.0 版本中，当调用清算函数（`Dog.bark`）时，会接收所有债务，不存在 `dunk` 参数的类似物。这种变化的原因是，由于新的拍卖允许部分购买抵押品，参与者可用的流动性不再限制他们参与拍卖的能力，因此，应尽量减少拍卖的总数量。强调一下，不再对每个参与者出售抵押品设有最低的 DAI 流动性要求。
	
* 覆盖活跃拍卖的债务和费用所需的 DAI 限制  
	- 在涉及拍卖大量抵押品的情况下，当前和新的设计修改了前述部分描述的行为。无论是清算 1.2 还是 2.0 版本，都实现了一个限制，即用于覆盖所有活跃拍卖的债务和清算罚款总和所需的 DAI 总额。
	- 在 LIQ-1.2 中，这被称为 `box`，而在 LIQ-2.0 中，我们称之为 `Hole`。
	- 每当最大可能增加值小于将发送至拍卖的债务 + 费用金额时，会执行部分清算，以不超过此金额。
	- 在当前系统中，只有一个全局限制；在 2.0 版本中，除了全局限制外，还有每个抵押品的限制。
	- 类似于每个抵押品的债务上限有一个 `ilk.line` 和整个系统债务上限有一个 `Line`，现在还有一个 `ilk.hole` 与 `Hole` 对应。这确保了那些确定风险参数的人可以按抵押品逐个考虑典型市场对 DAI 的深度。
	- `Dirt` 累积器跟踪所有活跃拍卖的债务和罚款费用所需的总 DAI，必须小于 `Hole` 才能使 `bark` 调用成功。对于每种抵押品类型，`ilk.dirt` 跟踪该抵押品的所有活跃拍卖所需的总 DAI 以覆盖债务和罚款费用，并且必须小于 `ilk.hole` 才能使 `bark`（针对该抵押品的 `Vault`）调用成功。

> 拍卖启动函数（Clipper.kick）
* 接受四个调用者提供的参数：  
	- `tab`：从拍卖中增加的目标 DAI（债务 + 稳定性费用 + 清算罚款）[rad]  
	- `lot`：可用于购买的抵押品数量 [wad]  
	- `usr`：将任何剩余抵押品退回的地址  
	- `kpr`：将 DAI 激励发送到的地址  
* `Clipper.kick` 执行以下检查和操作：  
	- 检查调用者是否已授权（只有 `Dog` 或治理才能调用 `Clipper.kick`）  
	- 检查四阶段断路器中是否启用了清算  
	- 递增计数器并为新拍卖分配唯一的数字 ID  
	- 将 ID 插入跟踪活动拍卖的列表中  
	- 创建一个结构来记录拍卖的参数，包括：  
		- 在活动拍卖列表中的位置  
		- 从投标人那里增加的目标 DAI 金额（`tab`）  
		- 可用于购买的抵押品数量（`lot`）  
		- 为创建此拍卖而清算的 `Vault`  
			- 如果抵押品未全部售出，则允许退回抵押品  
			- 当 `End.snip` 调用 `Clipper.yank` 时，允许退回抵押品和 `tab`  
		- 拍卖创建的时间戳（作为 Unix 时代）  
		- 拍卖中抵押品的初始价格（`top`）  
	- 向 `kpr` 发送以 DAI 计价的激励  
	- 触发 `Kick()` 事件  
* 初始价格是通过读取相应 `Oracle` 安全模块（`OSM`）中的当前价格并将其乘以一个可配置的百分比（`buf` 参数）来设置的。请注意，当前的 `OSM` 价格与实际市场价格之间相差一到两个小时。守护者不会直接调用 `Clipper.kick`，而是调用 `Dog.bark`，后者会调用 `Clipper.kick`。

> 清算激励机制  
* 在这个设计中，迅速清算金库的动力不如当前系统，因为并没有通过这样做获得内在优势。相比之下，当前的拍卖系统赋予触发清算的账户在产生的拍卖中进行第一轮竞标的特权。目前尚不清楚这在实践中是否具有重要意义，还是应该添加更强的激励（例如，向清算者支付的小额 DAI 奖励）。  
* 为了确保解决这个潜在问题，为清算者添加了一个激励机制。激励的形式是，按抵押品类型为基础，清算债务的固定数量的 DAI 加上一个与清算债务成线性比例的 DAI。两个贡献都可以设置为零。这种结构有以下理由：  
	- 奖励按抵押品类型设置，以便在设置中不仅包括每种抵押品的风险参数（如抵押率 `mat` 和清算惩罚 `chop`），还可以允许独特的市场条件，这些条件可能只适用于一种或几种抵押品类型。  
	- 与总金库债务成线性增长的奖励部分旨在用于奖励清算者降低系统风险，因为风险本身与未充分抵押金库的大小成比例 - 一个是另一个的两倍大，代表着坏账累积的两倍风险。或者用另一种方式看，清算两个大小为 X 的金库与清算一个大小为 2X 的金库的风险降低相同 - 因此，清算者的奖励应该是相似的。此外，系统可以承受为较大的清算支付更多的费用，因为清算惩罚也是与给定金库的未偿还债务成比例的。  
	- 奖励的固定部分可以用于支付清算费用（对清算者而言，这些费用是按金库计算的），或者允许 MKR 持有者有效地向 Kee 支付。
* 这些参数必须非常小心地设置，以免通过`farming`清算奖励（例如，创建意图清算的 `Vault` 并从过高的奖励中获利）来利用系统。通常，清算奖励应保持在低于最低清算惩罚的某个安全余量，以使系统不太可能累积赤字。这并不一定阻止耕作，只是确保系统保持偿债能力。例如，当 `Dirt` 接近 `Hole`，或者对于某种抵押品类型，`ilk.dirt` 接近 `ilk.hole` 时，可以以资本高效的方式耕作激励。攻击者会从正在进行的拍卖中购买少量抵押品，释放相对于 `Hole` 或 `ilk.hole` 的少量空间，然后清算现有 `Vault` 的一小部分以收集奖励，并重复此过程。在同一交易中可以反复进行此操作，`EIP 2929` 的激活将显著降低相关 `gas` 费用（由于温存储读取和写入）。请注意，由于攻击者无需创建自己的 `Vault`，因此清算惩罚与激励价值之比不是阻止因素；攻击者只关心 `gas` 费用。`Dog`阻止从 `Vault` 中移除小于 `ilk.dust` 债务的部分清算有助于减轻这种情况 —— 只要清算惩罚超过此最小清算尺寸的总奖励，并且清算惩罚可靠地由结果拍卖收取（在市场或网络扰动条件下可能不适用），系统总体上不应累积坏账。

> 四阶段清算断路器  
* 在本节中，我们将介绍清算断路器的四个阶段。与 LIQ-1.2 不同，Liquidations 2.0 在 `Clipper` 合约中内置了四个阶段的断路器。这些阶段是：
	- 清算启用 (`0`)：这意味着断路器未跳闸，协议可以清算新 `Vault` 以及服务旧清算。  
	- 新清算禁用 (`1`)：这意味着没有新的清算（`Clipper.kick`）。  
	- 新清算和重置禁用 (`2`)：这意味着没有新的清算（`Clipper.kick`），而且达到价格或时间终点的拍卖不能被重置（`Clipper.redo`）。  
	- 清算禁用 (`3`)：这意味着没有新的清算（`Clipper.kick`），没有接收（`Clipper.take`），也没有重置（`Clipper.redo`）。  
* 与 LIQ-1.2 一样，断路器将通过 `ClipperMom` 合约提供，使治理能够绕过 `GSM` 延迟来执行断路器操作。

> 紧急关停机制[`end.sol`](https://github.com/makerdao/dss/blob/liq-2.0/src/end.sol)
* 一个已开始的拍卖可以通过调用 `Clipper` 合约中的 `yank` 认证函数来回滚。这个函数需要拍卖存在，并执行以下操作：  
	- 调用 `dog.digs` 以降低其 `Dirt` 和 `ilk.dirt` 值的剩余拍卖选项卡  
	- 将剩余的抵押品发送给它的 `msg.sender` 
	- 删除拍卖结构数据  
	- 触发 `Yank()`` 事件  
* 这个函数可能被认为是一个通用的操作，将现有的拍卖迁移到新的合约；然而，现在唯一的用例是在 `End` 模块中，负责系统关停。  
* `End` 模块将随着拍卖合约一起升级，因为需要一个新的 `End.snip` 函数。  
* `End.snip` 函数负责在关停被触发时调用 `Clipper.yank` 的任何运行拍卖。它将从 `Clipper.yank` 接收抵押品，并将其与剩余债务一起发送回金库所有者以进行恢复。需要注意的一个考虑是，金库所有者将收到的债务包括已经收取的清算罚款部分。

### 清算模块的那些已知风险  

> 激励耕作 
* 时而，治理可能会增加 `ilk.dust` 的数量。当这种情况发生时，通常是因为气体变得如此昂贵，以至于影响了清算的效率。也就是说，调用 `Dog.bark()`、`Clipper.take()` 或 `Clipper.redo()` 的成本可能超过提供的抵押品。激励可能被用作解决这个问题的一种方法，也可能是协议保持 `ilk.dust` 较低的一种方式；然而，在增加 `ilks dust`、`tip` 或 `chip` 时，治理必须小心，不要激励创建许多 `Vaults` 来耕作这种激励。一个利用示例如下：  
	- 治理决定在同一时刻将 `dust` 增加 `1500 DAI`，同时将 `ilk.tip` 调整为补贴拍卖。  
	- 攻击者意识到，在气体和砍柴之间，将现有的 `Vault` 分裂成许多 `Vaults` 或创建许多新的 `Vaults` 将是有利可图的。  
	- 该法案被投票通过并获得通过  
	- 通过一笔交易，攻击者将其 `Vaults` 置于不安全的边缘，在价格下次下跌时戳一下 `OSM`，然后对所有 `Vaults` 调用 `Dog.bark()` 以收集激励。  
	- 利用这些收益，他们还可以稍微过高竞标自己的 `Vaults` 拍卖。  
* 为了挫败这种攻击，治理必须在设置 `ilk.tip` 和 `ilk.chip` 时要小心，不要创造这种扭曲的激励。

> 价格下降过快  
* 如果价格下降过快，可能会导致以下后果：  
	- 拍卖在没有任何出价的情况下结束，然后需要重置，可能还会一直发生这种情况  
	- 竞拍者因拍卖在交易确认之前结束而产生退款  
	- 竞拍者最终支付的金额远低于他们愿意支付的金额（可能产生永久性坏账）

> 价格下降过慢  
* 如果价格下降过慢，可能会导致以下后果：  
	- 拍卖价格始终赶不上市场价格，最终被重置  
	- 重置后价格赶上了，但仍低于最佳市场价格  
	- 重置后价格赶上了，但仍然留下了坏账  
	- 重置后拍卖价格仍然可能无法赶上，导致更多重置，并极有可能留下坏账

> 抢跑  
* 在 LIQ-1.2 中，由于参与拍卖需要资金，因此抢跑风险有限；
* 然而，在清算 2.0 中，如果保管人选择不使用资金参与，则来自通用抢跑机器人的抢跑风险很大。替换交易发送地址为自己的地址越容易，风险就越大。
* 为了减轻这种风险，鼓励保管人使用经过授权的代理合同与清算 2.0 互动，并在竞标时提供部分自有资金。更高的燃料价格也可能起作用。然而，我们没有找到一种能防止通用抢跑且保持单块可组合性的好方法。

> 起始价格 `OSM` 风险  
* 由于 `Clipper.kick` 和 `Clipper.redo` 会咨询 `OSM` 来确定抵押物价格，因此我们容易受到只能通过 `oracle` 延迟、`Dog.Hole` 和 `ilk.hole` 等措施来减轻的 `oracle` 攻击。我们必须依靠已经设置的守卫数量来防止价格操纵和 `oracle` 攻击。然而，价格延迟一小时的事实也带来了一种风险：由于价格与市场的相对时间不同步，它可能要么过高，要么过低，无法在考虑其他参数如`buf`和价格下降函数的情况下实现有效的结算。上述两种情况的后果实际上都包含在关于价格下降过快或过慢的风险部分。

> 设置 `Dog.Hole` 或 `ilk.hole` 过高  
* 虽然在清算 2.0 中，`Dog.Hole` 和 `ilk.hole` 可以设置得更高，但仍然存在设置过高的风险。过高的 `Dog.Hole` 值可能导致对 DAI 的需求过高，打破高挂起。`PSM` 和稳定币抵押品类型对此有所缓解，但在设置此参数时应予以考虑。如果 `ilk.hole` 设置过高，可能会导致清算推动资产价格走低的恶性循环。此外，如果发生 `oracle` 攻击，这个参数可以被认为是我们的最大敞口。

> 设置 Dog.Hole 或 ilk.hole 过低  
* 如果我们将 `Dog.Hole` 或 `ilk.hole` 设置得太低，我们将面临无法一次性清算足够抵押品的风险。这可能导致系统中不足抵押的头寸逐渐累积，最终导致坏账的增加。

> 拍卖参数更改会影响进行中的拍卖  
* 尾数、临界值或价格下降函数及其任何参数都可以在任何时候通过治理进行更改，并会影响进行中的拍卖的行为。整合者应考虑到这种可能性，推理出参数突然变化将对其投标策略产生何种影响。治理应尽量减少参数更改的频率，如果可能的话，只在没有受影响的拍卖时进行更改。