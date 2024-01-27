---
title: 跟我一起编写 Buildpacks：Meta-Buildpack 篇
date: 2024-01-27 11:00:34
categories: Builpacks
tags: [Builpacks,Dockerfile,meta-buildpack]
---

## 上节回顾

在【[跟我一起编写 Buildpacks：Go 版本篇](https://mp.weixin.qq.com/s/u4nPO0oohpNlhxDLY92Qiw)】中，我们将竭尽所能地分享从头开始构建的源代码，涵盖了从buildpack.toml到Go源码的全过程，旨在让大家能够迅速掌握如何编写 Buildpack。

在【[跟我一起编写 Buildpacks：CICD 版本篇](https://mp.weixin.qq.com/s/Nl5EQjNfsYhVsEAGF8yzKQ)】中，我们深入探索用于为 Paketo 风格的 Buildpacks 创建 GitHub Actions 工作流的神器 Pipeline Builder，只需在仓库里配置两个文件即可完成 CICD 全流程。

本节，我们将继续分享 Buildpacks 相关的内容，本节的主题是 Meta-buildpack。

## Meta-buildpack 介绍

在构建 Buildpack 的过程中，我们通常会创作一个名为 buildpack.toml 的配置文件，其中详细记录了构建包的版本、名称、描述以及它所依赖的其他构建包等信息。

当我们开发多个构建包时，通常会为每个构建包编写独立的 buildpack.toml 文件，并将其存放在各自的仓库或特定目录中。

然而，在实际应用场景中，我们常常会采用一个buildpack.toml文件来引用其他构建包。

这种特殊的构建包被称作 Meta-Buildpack。它仅包含一个 buildpack.toml 文件，该文件中的配置确定了构建包的加载顺序，从而有效地引用了其他构建包。这一机制在制定复杂的应用程序检测策略时尤为关键。

下面，一起看看官方 [Schema Order 部分定义](https://buildpacks.io/docs/reference/spec/buildpack-api/#schema)：

![OrderIntroduce](/images/buildpacks/order.png)

从上图可以看出，Order 部分定义了构建包的加载顺序.

如果你在使用这个工具或框架来创建一个元构建包，你需要指定一个构建包组列表来定义测试的顺序。

> 但是，如果你没有指定这个列表，你可以使用 target 或 stacks 列表作为替代。但是，你不能同时使用构建包组列表和 target 或 stacks 列表，你只能选择其中一种来定义你的构建配置。

## 编写 Meta-Buildpack

还是以 leo 为例，首先，创建一个名为 leo 目录，并在该目录下创建一个名为 buildpack.toml 文件，内容如下所示。

```toml
api = "0.8"

[buildpack]
  description = "A Cloud Native Buildpack with an order definition suitable for Leo applications"
  homepage = "https://github.com/amp-buildpacks/leo"
  id = "amp-buildpacks/leo"
  keywords = ["Leo", "Aleo"]
  name = "AMP Buildpack for Leo"
  version = "{{.version}}"

  [[buildpack.licenses]]
    type = "Apache-2.0"
    uri = "https://github.com/amp-buildpacks/leo/blob/main/LICENSE"

[metadata]
  include-files = ["LICENSE", "README.md", "buildpack.toml"]

[[order]]

  [[order.group]]
    id = "amp-buildpacks/leo-dist"
    version = "0.1.6"

  [[order.group]]
    id = "amp-buildpacks/aleo"
    version = "0.1.10"

  [[order.group]]
    id = "paketo-buildpacks/procfile"
    optional = true
    version = "5.6.8"
```

接下来，创建一个名为 package.toml 文件，内容如下所示。

```toml
[[dependencies]]
  uri = "docker://ghcr.io/amp-buildpacks/leo-dist:0.1.6"

[[dependencies]]
  uri = "docker://ghcr.io/amp-buildpacks/aleo:0.1.10"

[[dependencies]]
  uri = "docker://gcr.io/paketo-buildpacks/procfile:5.6.8"
```

从上述内容可以看出，package.toml 文件中列出了构建过程中需要用到的依赖包。

> 至此，Meta-Buildpack 已经编写完成。

## 构建 Meta-Buildpack

接下来，使用以下命令构建 Meta-Buildpack。

```bash
pack build leo-sample \
    --path ./leo_sample \
    --buildpack ./leo \
    --builder paketobuildpacks/builder-jammy-base
```

若最终输出信息中显示“Successfully built image leo-sample”，则表明镜像打包已成功完成。

## 未完待续

恭喜！现在我们已经成功完成了 Meta-Buildpack 构建。接下来，我们可以着手对其进行扩展，以满足更广泛的需求。例如：自动化测试您的 buildpack？

> 以上内容就是对《跟我一起编写 Buildpacks：Meta-Buildpack 篇》全部内容，希望以上内容对同学们能有所启发和帮助。

> 如果您喜欢这篇文章，欢迎关注微信公众号《猿禹宙》、点赞、转发和赞赏。每一位读者的认可都是我持续创作的动力。

![公众号](/images/wechat-blog.png)
