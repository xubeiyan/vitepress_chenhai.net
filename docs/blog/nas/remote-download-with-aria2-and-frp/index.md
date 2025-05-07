---
outline: deep
---

# 使用 Aria2 和 Frp 搭建远程下载网页版客户端

## 前言

有时候需要往放置于家里的 NAS 上下载东西（例如有些系统的镜像），但又处在不能访问家里网络的环境，因为一般来说为了安全，我们都无法通过互联网来访问一个处于内网的计算机（家里的 NAS）。示意图如下：

![](/images/nas_1.png "无法访问")

这样的需求越来越多，就催生了一类软件的发展——内网穿透软件。每个内网穿透的软件都面临一个问题，谁来提供公网接口。大部分的内网穿透软件都附带了一个公网服务器，你可以有限额地通过其提供的公网服务器连接你自己的内网服务器。

但我希望这个服务器也在自己控制之中，不会因为安全，审查，收费等问题影响使用。所以我们选用了 [frp](https://github.com/fatedier/frp) 来解决内网和公网计算机通信问题，使用 [aria2](https://aria2.github.io/) 作为下载软件。但是 aria2 是一个 [CLI(Command-line Interface)](https://zh.wikipedia.org/wiki/%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%95%8C%E9%9D%A2) 软件，不利于操作，于是我们使用 [webui-aria2](https://github.com/ziahamza/webui-aria2) 来提供一个网页界面。

## 搭建前置条件

### 服务器方面

1. 首先需要有一台可访问 `SSH` 的有公网 IP 的服务器，下文中都用 `<公网IP>` 代替
2. （可选）一个可用的域名，下文中都用 `<你的域名>` 代替

### NAS 方面

1. 可通过 Internet 访问到你那台公网 IP 的服务器的 NAS 计算机

## 搭建原理

工作原理如下图

## 搭建步骤

1. 首先需要在你的 NAS 上安装和配置好 aria2

> GitHub 下载地址为 [https://github.com/aria2/aria2/releases](https://github.com/aria2/aria2/releases)

例如在 Windows 64 位系统上就下载 `aria2-1.37.0-win-64bit-build1.zip`，下载后解压，里面只有一个可执行文件`aria2c.exe`，我们还需要写一个配置文件，名字无所谓，下文中我们使用 `aria2.conf`

下面有一份写满注释的配置文件，请自行编辑以下两个字段 `<DOWNLOAD_PATH>` 和 `<YOUR_SECRET>`，其余的部分，请自己酌情调整

<details>
<summary>配置文件（点击展开）</summary>

```
## '#'开头为注释内容, 选项都有相应的注释说明, 根据需要修改 ##
## 被注释的选项填写的是默认值, 建议在需要修改时再取消注释  ##

## 文件保存相关 ##

# 文件的保存路径(可使用绝对路径或相对路径), 默认: 当前启动位置
dir=<DOWNLOAD_PATH>
# 启用磁盘缓存, 0为禁用缓存, 需1.16以上版本, 默认:16M
disk-cache=32M
# 文件预分配方式, 能有效降低磁盘碎片, 默认:prealloc
# 预分配所需时间: none < falloc ? trunc < prealloc
# falloc和trunc则需要文件系统和内核支持
# NTFS建议使用falloc, EXT3/4建议trunc, MAC 下需要注释此项
file-allocation=falloc
# 断点续传
continue=true

## 下载连接相关 ##

# 最大同时下载任务数, 运行时可修改, 默认:5
max-concurrent-downloads=1
# 同一服务器连接数, 添加时可指定, 默认:1
max-connection-per-server=5
# 最小文件分片大小, 添加时可指定, 取值范围1M -1024M, 默认:20M
# 假定size=10M, 文件为20MiB 则使用两个来源下载; 文件为15MiB 则使用一个来源下载
min-split-size=10M
# 单个任务最大线程数, 添加时可指定, 默认:5
split=5
# 整体下载速度限制, 运行时可修改, 默认:0
#max-overall-download-limit=0
# 单个任务下载速度限制, 默认:0
#max-download-limit=0
# 整体上传速度限制, 运行时可修改, 默认:0
#max-overall-upload-limit=0
# 单个任务上传速度限制, 默认:0
#max-upload-limit=0
# 禁用IPv6, 默认:false
disable-ipv6=true

## 进度保存相关 ##

# 从会话文件中读取下载任务
input-file=aria2.session
# 在Aria2退出时保存`错误/未完成`的下载任务到会话文件
save-session=aria2.session
# 定时保存会话, 0为退出时才保存, 需1.16.1以上版本, 默认:0
save-session-interval=60

## RPC相关设置 ##

# 启用RPC, 默认:false
enable-rpc=true
# 允许所有来源, 默认:false
rpc-allow-origin-all=true
# 允许非外部访问, 默认:false
rpc-listen-all=true
# 事件轮询方式, 取值:[epoll, kqueue, port, poll, select], 不同系统默认值不同
#event-poll=select
# RPC监听端口, 端口被占用时可以修改, 默认:6800
#rpc-listen-port=6800
# RPC连接密钥
rpc-secret=<YOUR_SECRET>

## BT/PT下载相关 ##

# 当下载的是一个种子(以.torrent结尾)时, 自动开始BT任务, 默认:true
#follow-torrent=true
# BT监听端口, 当端口被屏蔽时使用, 默认:6881-6999
listen-port=51413
# 单个种子最大连接数, 默认:55
#bt-max-peers=55
# 打开DHT功能, PT需要禁用, 默认:true
enable-dht=false
# 打开IPv6 DHT功能, PT需要禁用
#enable-dht6=false
# DHT网络监听端口, 默认:6881-6999
#dht-listen-port=6881-6999
# 本地节点查找, PT需要禁用, 默认:false
#bt-enable-lpd=false
# 种子交换, PT需要禁用, 默认:true
enable-peer-exchange=false
# 每个种子限速, 对少种的PT很有用, 默认:50K
#bt-request-peer-speed-limit=50K
# 客户端伪装, PT需要
peer-id-prefix=-TR2770-
user-agent=Transmission/2.77
# 当种子的分享率达到这个数时, 自动停止做种, 0为一直做种, 默认:1.0
seed-ratio=0
# 强制保存会话, 话即使任务已经完成, 默认:false
# 较新的版本开启后会在任务完成后依然保留.aria2文件
#force-save=false
# BT校验相关, 默认:true
#bt-hash-check-seed=true
# 继续之前的BT任务时, 无需再次校验, 默认:false
bt-seed-unverified=true
# 保存磁力链接元数据为种子文件(.torrent文件), 默认:false
bt-save-metadata=true
```
</details>

* `<DOWNLOAD_PATH>` 是文件下载保存的位置，可以使用绝对路径或者相对路径，下文中我们假定为 `Aria2Data`
* `<YOUR_SECRET>` 是 RPC 连接的密钥，需要在 WebUI 连接中使用，下文中我们假定为 `your_secret`

除此之外还需要建立一个 `aria2.session`文件，留空即可

启动方式可以在命令行下执行

```cmd
> aria2c --conf aria2.conf
```

当看到类似下面的输出时，就启动成功了

```
02/20 16:44:52 [NOTICE] IPv4 RPC: listening on TCP port 6800
```

2. 在你的 NAS 上安装和配置好 frp 客户端

> GitHub 下载地址为 [https://github.com/fatedier/frp/releases](https://github.com/fatedier/frp/releases)

例如在 Windows 64 位系统上就下载 `frp_0.61.1_windows_amd64.zip`，解压后我们需要关心的是可执行文件 `frpc.exe` 和其配置文件 `frpc.toml`（另外 Windows Defender 会认为这个是病毒，导致下载失败或者解压就删除，需要关掉实时防护，或者把它加到例外中）

3. 在你的服务器上安装和配置好 webui-aria2

> GitHub 仓库地址为 [https://github.com/ziahamza/webui-aria2](https://github.com/ziahamza/webui-aria2)

需要安装 `nodejs`

> 下载地址位于 [https://nodejs.org/zh-cn](https://nodejs.org/zh-cn)

4. 在你的服务器上安装和配置好 frp 服务端

## 贴近生产环境

如果你不想某次重启 NAS 或者服务器之后给人演示的时候发现装 X 失败，就应该让整个架构足够健壮。下面是一些必要的步骤

### aria2 在 NAS 上自动启动

以我的 Windows Server 2020 为例，下面是 Windows 系统的启动流程

![](/images/nas_windows_boot_order.png "Windows 启动顺序")

可以看出，可以将 aria2 作为服务启动，也可以作为自启动程序启动。但我觉得后者配置要更简单一些，也更安全一些。而且 Windows 下自动登录在服务器上一般是必要措施，有现成工具实现。

> 使用 [https://learn.microsoft.com/en-us/sysinternals/downloads/autologon](https://learn.microsoft.com/en-us/sysinternals/downloads/autologon) 下载 AutoLogon，是爱好者开发的自动登录工具，但已被 Windows 官方收编，所以可以视为官方提供的工具

运行这个软件 `WinLogon.exe`，填入你需要自动登录的帐号密码即可，它不会保存明文的帐号密码，可以放心使用。

将 aria2 设为自启动，常见方法是把下面的 `cmd` 文件添加到“启动”目录。还是以 Windows 系统为例:

1. 按 `Win` + `R` 打开运行窗口，键入 `shell:startup` 打开启动文件夹

2. 新建 `aria2.cmd` 文件，写入以下内容（假设 `aria2.exe` 在 `D:\aria2`）

```
D:
cd D:\aria2
start aria2.exe --conf aria2.conf
```
3. 保存退出，然后计算机则会在下一次登入系统后启动 `aria2`

### frp 在 NAS 上自启动

### frp 在服务器上自启动