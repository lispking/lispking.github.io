---
title: 解读 DAI 架构流程图 —— 晦涩难懂的术语
date: 2023-09-22 11:20:39
categories: MakerDAO
tags: [MakerDAO,DAI]
description: 本文详细讲述了Maker协议中的各种术语及其相关合约接口的说明，让读者逐步明白其中的奥秘。同时，介绍了DAI的诞生背景，以及Maker晦涩难懂的代码是刻意的。文章列举了大量术语，包括Cat、Dai、End、Flipper、Flapper、Flopper等等
---

> 免责声明：本文不构成投资建议，仅研究技术为主，祝玩得开心 ^_^

### 上一节回顾

> 上个章节主要讲解了 [Maker 协议的介绍](https://lispking.github.io/2023/09/15/maker-protocol-introduce/)，同时在最后贴了两张图，一张是 Maker 协议智能合约模块系统图，另一张是 Maker 101 协议交互图。细心的读者可能会发现，合约模块的图异常复杂，而且上面的单词背后的意义可能并未完全理解。不用担心，本文将会详细讲述这些术语以及相关合约接口的说明，让你逐步明白其中的奥秘。

### DAI 诞生于以太坊测试网发布前

> 在在讲解这些术语之前，我们先来了解一下 DAI 的诞生背景。DAI 的最早雏形诞生于 2015 年 3 月，这个时间点比以太坊测试网的正式发布还要早两个月。创始人 Rune 在 Reddit 上与以太坊社区的成员，包括 Vitalik 分享了协议的设计、合约代码以及测试前端。

### Maker 晦涩难懂的代码是刻意的

> 乍一看，这些术语确实令人费解，许多研究 Maker 协议的开发者常常惊讶于其复杂且几乎晦涩的术语。实际上，这种复杂性是有意为之。变量名不同的字母长度和词性，严格而清晰地对应着不同的方程和模块。

### 架构流程图

![MakerActions](images/makedao/TheMakerActions.png)

### 术语介绍

#### [Cat](https://github.com/makerdao/dss/blob/master/src/cat.sol) - Liquidator
* Bite - Trigger liquidation of an unsafe Cdp (vat.grab)

#### [Dai](https://github.com/makerdao/dss/blob/master/src/vow.sol) - Token
* Mint - Mint to an address
* Burn - Burn at an address
* Push - Transfer
* Pull - Transfer From
* Move - Transfer From
* Approve - Allow pulls and moves
* Permit - Approve by signature

#### [End](https://github.com/makerdao/dss/blob/master/src/end.sol) - Global settlement
* Cage - Freeze user-facing actions. Tag Ilk prices.
* Skim - Settle a Cdp at the tagged price
* Free - Remove collateral from a settled Cdp
* Thaw - Fix outstanding Dai supply after all Skims
* Flow - Calculate final Ilk prices
* Pack - Lock Dai ahead of Cash
* Cash - Exchange packed Dai for collateral

#### [Flipper](https://github.com/makerdao/dss/blob/master/src/flip.sol) - Collateral auctions
* Kick - Put up a new GEM `lot` for auction
* Tick - Bump the end date for an auction with no bids
* Tend - Submit a DAI bid (increasing `bid`)
* Dent - Submit a DAI bid (decreasing `lot`)
* Deal - Settle a completed auction

#### [Flapper](https://github.com/makerdao/dss/blob/master/src/flap.sol) - Surplus auctions
* Kick - Put up a new DAI `lot` for auction
* Tend - Submit an MKR bid (increasing `bid`)
* Deal - Settle a completed auction

#### [Flopper](https://github.com/makerdao/dss/blob/master/src/flop.sol) - Defecit auctions
* Kick - Put up a new MKR `bid` for auction
* Dent - Submit a DAI bid (decreasing `lot`)
* Deal - Settle a completed auction

#### [Join](https://github.com/makerdao/dss/blob/master/src/join.sol) - Token adapters
* Join - Deposit tokens to the system
* Exit - Remove tokens from the system

#### [Jug](https://github.com/makerdao/dss/blob/master/src/jug.sol) - Stability fees
* Drip - Trigger stability fee accumulation (vat.fold)

#### [Median](https://github.com/makerdao/median/blob/master/src/median.sol) - Price oracle
* Read - Get valid price or fail
* Peek - Get price and validity
* Poke - Set price from white-listed feed providers

#### [OSM](https://github.com/makerdao/osm/blob/master/src/osm.sol) - Oracle security module
* Read - Get current valid price or fail
* Peek - Get current price and validity
* Peep - Get next price and validity
* Poke - Set next price if delay has elapsed

#### [Pause](https://github.com/dapphub/ds-pause/blob/master/src/pause.sol) - System governance
* Plot - Schedule a plan
* Exec - Execute a plan
* Drop - Cancel a plan

#### [Pot](https://github.com/makerdao/dss/blob/master/src/pot.sol) - Dai savings
* Join - Add Dai to the Pot
* Exit - Remove Dai from the Pot
* Drip - Trigger savings accumulation (vat.suck)

#### [Spotter](https://github.com/makerdao/dss/blob/master/src/spot.sol) - Price relayer
* Poke - Update the spot price for a given Ilk (vat.file)

#### [Vat](https://github.com/makerdao/dss/blob/master/src/vat.sol) - User balances
* Hope - Permit `flux` and `move`
* Nope - Deny `flux` and `move`
* Slip - Add and remove Gem
* Move - Transfer Dai
* Flux - Transfer Gem
* Frob - Cdp Management
* Fork - Transfer Cdp balances
* Grab - Seize Cdp balances
* Heal - Balance system surplus/defecit
* Suck - Print Dai
* Fold - Apply rates across an Ilk

#### [Vow](https://github.com/makerdao/dss/blob/master/src/vow.sol) - Liquidations manager
* Fess - Push bad debt to the auctions queue
* Flog - Release queued debt for auction
* Heal - Optimise debt buffer (vat.heal)
* Kiss - Release on-auction debt and Heal (vat.heal)
* Flap - Trigger a surplus auction (flapper.kick)
* Flop - Trigger a defecit auction (flopper.kick)


### 参考资料

* [关于 Maker 的十个冷知识](https://blog.makerdao.com/zh/%E5%85%B3%E4%BA%8E-maker-%E7%9A%84%E5%8D%81%E4%B8%AA%E5%86%B7%E7%9F%A5%E8%AF%86/)
* [DAI官方Wiki之Actions](https://github.com/makerdao/dss/wiki/Actions)