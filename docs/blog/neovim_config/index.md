---
outline: deep
---

# 个人觉得可用的 `neovim` 配置教程

源自 [Youtube](https://www.youtube.com/watch?v=Mtgo-nP_r8Y)

有 [GitHub仓库](https://github.com/NvChad/NvChad) 和 [官网](https://nvchad.com/docs/quickstart/install)

> 觉得好的一点是它写了卸载方法页面（笑

## 前期需求

一共需要两个东西，我们每个都列出可行的安装方案

### Neovim 0.10

1. 首先可以尝试使用包管理安装，
   
   使用包管理安装，请参考[此页面](https://github.com/neovim/neovim/blob/master/INSTALL.md)

   但根据我的经验，包管理带的都不是最新版（此论断总结于20240619，v0.10.0发布于20240516）
   > 验证方法: 可以启动`neovim`，并附上 `-v` 或者 `--version` 参数

    ```bash
    $ nvim -v
    NVIM v0.10.0
    Build type: Release
    LuaJIT 2.1.1713484068
    Run "nvim -V1 -v" for more info
    ```
2. 如果不是 `v0.10.0`，可以使用直接安装的方式（大多数情况）
  * （可省略）首先卸载掉包管理安装的 `nvim`，这里以 `Debian/Ubuntu` 的举例：

    ```bash
    $ apt remove nvim
    ```

  * 下载编译好的二进制文件（`wget` 和 `curl` 自行选用）到 HOME 目录（即`~`）
    ```bash
    # 使用wget下载
    $ wget https://github.com/neovim/neovim/releases/download/v0.10.0/nvim-linux64.tar.gz
    ```
    或者
    ```bash
    # 使用cURL下载 -L 表示会跟随服务器的Redirect跳转 -J 表示使用服务器提供的文件名 -O表示将返回写入文件
    $ curl -LJO https://github.com/neovim/neovim/releases/download/v0.10.0/nvim-linux64.tar.gz
    ```

  * 解压 `nvim-linux64.tar.gz`
    ```bash
    $ tar xvzf nvim-linux64.tar.gz
    ```

  * 先尝试运行下可否启动（如果启动成功则可以到下一步，不行则参考第3种情况）
    ```bash
    $ cd nvim-linux64/bin && ./nvim
    ```
  * 将下面添加到 `~/.bashrc` （或者`~/.zshrc`等） 中，修改 `PATH` 环境变量
    ```bash
    export PATH="$PATH:~/nvim-linux64/bin"
    ```
  * 使修改生效到当前终端（新建终端连接也可）
    ```bash
    $ source ~/.bashrc
    ```

3. 如果因为 `GLIBC` 库版本导致直接安装的启动失败

   > 较早的版本 `Linux`, 例如 `Ubuntu 18.04`, 是没有 `v0.10.0` 所需的最小版本 `glibc 2.31` 的
   
   具体表现为，启动 `nvim` 时，会提示
   ```bash
   nvim: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.28` not found (required by nvim)

   nvim: /lib/x86_64-linux-gnu/libm.so.6: version `GLIBC_2.29` not found (required by nvim)
   ```

   可以按照此 [GitHub](https://github.com/neovim/neovim-releases/releases/tag/v0.10.0) 的 Release 下载区，下载使用 `glibc v2.27` 构建的 `neovim`

   ```bash 
   # 使用 wget 下载
   $ wget https://github.com/neovim/neovim-releases/releases/download/v0.10.0/nvim-linux64.tar.gz
   ```

   剩余步骤和上一种情况相同

4. 最终方案即是从源码构建（前面两种方法可以覆盖大部分的情况，如果你的 `Linux` 版本够老或者够 mini，就可能遇到这种情况）
   
   请参考这个[页面](https://github.com/neovim/neovim/blob/master/INSTALL.md#install-from-source)

### Nerd Font作为终端字体（很多图标用其他字体就只能看豆腐块）

在 [Nerd Font](https://www.nerdfonts.com/font-downloads) 上下载带图标的自己喜欢的字体，并应用到终端上（推荐 JetbrainsMono Nerd Font 或者 UbuntuSans Nerd Font）

#### putty
* 先在 `Session` 中找到并选中你的 vps，选中然后点击 `Load`，载入配置
* 再在 `Window` -> `Appearance` 中调整字体 `Font settings` -> `Change`，选择刚下载的字体，点击 `Apply` 应用
* 最后回到  `Session`，找到并选中你的 vps，然后点击 `Save`，保存配置到这个 vps 配置

## 安装

### 安装起始配置

```bash
$ git clone https://github.com/NvChad/starter ~/.config/nvim && nvim
```

执行命令后会启动 `nvim` 自动完成安装

#### 可能出现的问题

* GitHub 访问问题（限中国大陆），请调整 `git` 所需的代理，因为插件也会从 GitHub 上下载

  ```
  # 使用本机IP及1080端口的socks5代理
  git config --global http.proxy 'socks5://127.0.0.1:1080' 
  git config --global https.proxy 'socks5://127.0.0.1:1080'
  ```
* `~/.config` 文件夹不存在，无法克隆项目，执行 `mkdir ~/.config` 即可
* `~/.config/nvim` 文件夹不为空，无法克隆项目，执行 `rm -rf ~/.config/nvim` 即可 

### 安装Mason.nvim

启动 `nvim` 中执行 `:MasonInstallAll` （在一般模式下键入 `:MasonInstallAll`，按`Enter`键）

### （可选）删除 `~/.config/nvim/.git` 文件夹

> 此文件夹会非常大，保存有 `git` 仓库的历史

```bash
$ rm -rf ~/.config/nvim/.git
```
## 使用

> 下面命令中出现的 `<leader>` 默认指的是 `Space` 键

### 常用命令

* `<leader> + ch` 打开按键速查表，打开后按 `:q` 退出

(不想总结了，自己看吧)
