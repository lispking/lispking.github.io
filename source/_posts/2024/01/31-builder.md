---
title: 跟我一起编写 Buildpacks：Builder 篇
date: 2024-01-27 11:00:34
categories: Builpacks
tags: [Builpacks,Dockerfile,Builder]
---

## 上节回顾

在【[跟我一起编写 Buildpacks：Meta 篇](https://mp.weixin.qq.com/s/9nROJHl1OCEoeup2q31zSQ)】介绍了 Meta-Buildpack 的概念和用法，它是一个特殊的构建包，通过引用其他构建包来实现功能。可以通过配置文件中的顺序确定构建包的加载顺序。文章提供了一个示例来演示如何编写和构建 Meta-Buildpack。

本节，我们将继续分享 Buildpacks 相关的内容，本节的主题是 Builder。

<!-- more -->

## 什么是 builder？

在编写 builder 之前，我们需要先了解 builder 的组成结构。

![CreateBuilder](/images/buildpacks/builder.png)

builder 是一个包含执行构建所需所有组件的镜像。builder 镜像是通过获取一个构建镜像，并添加一个生命周期、构建包以及配置构建各个方面（包括构建包检测顺序和运行镜像的位置）的文件来创建的。

## builder, meta-buildpack 和 buildpack 三者关系

为了更好地理解 builder、meta-buildpack 以及 buildpack 三者之间的层次关系，我们继续以"Leo"为例进行分析。

* 在 builder 层面，我们指的是 leo-builder，它仅包含 meta-buildpack。
* meta-buildpack 则是一个更为综合的概念，它包含了多个底层包以及 procfile。以 leo 为例，它涵盖了 leo-dist buildpack以及procfile buildpack。
* 而 buildpack 则构成了整个架构的最底层实现，它分布在多个仓库中。以 leo-dist buildpack 为例，它们分别包含了业务逻辑的实现，这是基本上所有链都需要实现的功能，比如钱包初始化、devnet取水、合约编译、合约部署等重要操作。这些操作往往需要花费较长时间来完成，这也体现了对智能合约以及区块链知识的理解和熟悉程度。

## 编写 Builder

以 leo 为例，首先，创建一个名为 leo-builder 目录，并在该目录下创建一个名为 builder.toml 文件，内容如下所示。

```toml
description = "A Cloud Native Buildpacks (CNB) builder with Paketo stacks (Jammy Jellyfish) and Leo buildpacks"

[[buildpacks]]
  id = "amp-buildpacks/leo"
  uri = "docker://ghcr.io/amp-buildpacks/leo:0.1.7"

[[order]]
  [[order.group]]
    id = "amp-buildpacks/leo"
    version = "0.1.7"

[stack]
  id = "io.buildpacks.stacks.jammy.tiny"
  build-image = "docker.io/paketobuildpacks/build-jammy-tiny"
  run-image = "index.docker.io/paketobuildpacks/run-jammy-tiny"
```

> 至此，Builder 的编写工作已经圆满完成。的确，这个过程简洁明了，这是因为在前期的 Meta-Buildpack 和 Buildpack 已经完成了大量的准备工作。

以下是一些关于 `[[order]]` 的实用小贴士：

* 当您采用逻辑与（`AND`）的方式定义 `[[order]]` 时，构建的顺序将严格遵循 `[[order.group]]` 中的排列顺序依次执行，且在执行过程中必须满足所有相应的 `buildpack` 检查逻辑。

```toml
[[order]]
  [[order.group]]
    id = "buildpack 1"
    version = "0.1.0"

  [[order.group]]
    id = "buildpack 2"
    version = "0.1.0"
```

* 当您采用逻辑或（`OR`）的方式定义 `[[order]]`，则只要满足其中任何一个条件，构建过程便会顺利通过。为了实现这一点，您可以在 `buildpack` 中灵活地编写 `Detect` 检查逻辑。

```toml
[[order]]
  [[order.group]]
    id = "buildpack 1"
    version = "0.1.0"

[[order]]
  [[order.group]]
    id = "buildpack 2"
    version = "0.1.0"
```

> 请根据您的需求合理安排 [[order]] 的编写方式，以确保构建过程的顺利进行。

## 构建 Builder

接下来，使用以下命令构建 Builder。

```bash
pack builder create amp-buildpacks/leo-builder --config builder.toml -v
```

如果最终输出信息中显示了 `Successfully created builder image amp-buildpacks/leo-builder`，那么这就意味着镜像打包过程已经成功完成。

```bash
Creating builder with the following buildpacks:
-> amp-buildpacks/leo@0.1.7
-> amp-buildpacks/aleo@0.1.10
-> amp-buildpacks/leo-dist@0.1.6
-> paketo-buildpacks/procfile@5.6.8
Adding buildpack amp-buildpacks/aleo@0.1.10 (diffID=sha256:ba7d3db0b9f6571ce1dacb1a36d203f5c141eb2d4aebf10de733b8b2f4080141)
Adding buildpack amp-buildpacks/leo-dist@0.1.6 (diffID=sha256:f04d3fccf0737f4ebf4b72741ccd823ae2083a71c470c16166131033c1e99693)
Adding buildpack amp-buildpacks/leo@0.1.7 (diffID=sha256:d1f1c92194fd8358a20f395dd4978a809f294fbe93b7213b3dfeade6b93aa8db)
Adding buildpack paketo-buildpacks/procfile@5.6.8 (diffID=sha256:7ed29173481c523f069fd9d4ca8a168733a161a2c45660423afb1bd9ada3545a)
Successfully created builder image amp-buildpacks/leo-builder
Tip: Run pack build <image-name> --builder amp-buildpacks/leo-builder to use this builder
```

> 最终，您可以参照上述的提示信息来验证 Builder 的有效性。

## 检查 Builder

接下来，使用以下命令检查 Builder。

```bash
pack builder inspect ghcr.io/amp-buildpacks/leo-builder
```

> 由于文中镜像是通过持续集成与持续部署（CI/CD）流程自动构建，因此输出的结果显示与此处的描述相符，内容上一致。

```bash
Inspecting builder: ghcr.io/amp-buildpacks/leo-builder

REMOTE:

Description: A Cloud Native Buildpacks (CNB) builder with Paketo stacks (Jammy Jellyfish) and Leo buildpacks

Created By:
  Name: Pack CLI
  Version: 0.32.1+git-b14250b.build-5241

Trusted: No

Stack:
  ID: io.buildpacks.stacks.jammy.tiny

Lifecycle:
  Version: 0.17.2
  Buildpack APIs:
    Deprecated: 0.2, 0.3, 0.4, 0.5, 0.6
    Supported: 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.10
  Platform APIs:
    Deprecated: 0.3, 0.4, 0.5, 0.6
    Supported: 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.10, 0.11, 0.12

Run Images:
  index.docker.io/paketobuildpacks/run-jammy-tiny

Buildpacks:
  ID                                NAME                                      VERSION        HOMEPAGE
  amp-buildpacks/aleo               AMP Buildpack for Aleo Tool Suite         0.1.10         https://github.com/amp-buildpacks/aleo
  amp-buildpacks/leo                AMP Buildpack for Leo                     0.1.7          https://github.com/amp-buildpacks/leo
  amp-buildpacks/leo-dist           AMP Buildpack for Leo Distribution        0.1.6          https://github.com/amp-buildpacks/leo-dist
  paketo-buildpacks/procfile        Paketo Buildpack for Procfile             5.6.8          https://github.com/paketo-buildpacks/procfile

Detection Order:
 └ Group #1:
    └ amp-buildpacks/leo@0.1.7
       └ Group #1:
          ├ amp-buildpacks/leo-dist@0.1.6
          ├ amp-buildpacks/aleo@0.1.10
          └ paketo-buildpacks/procfile@5.6.8    (optional)

LOCAL:
(not present)
```

> 请注意打印出的检测顺序 `Detection Order` 结果，其中列出了 `amp-buildpacks/leo-dist@0.1.6`，这正是我们所期望看到的结果。

## 未完待续

恭喜！现在我们已经成功完成了 Builder 构建。接下来，我们可以着手对其进行扩展，以满足更广泛的需求。例如：自动化测试您的 buildpack？

> 以上内容就是对《跟我一起编写 Buildpacks：Builder 篇》的全部解读，希望以上内容对同学们能有所启发和帮助。

> 如果您喜欢这篇文章，欢迎关注微信公众号《猿禹宙》、点赞、转发和赞赏。每一位读者的认可都是我持续创作的动力。

![公众号](/images/wechat-blog.png)
