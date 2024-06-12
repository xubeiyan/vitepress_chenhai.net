---
outline: deep
---

# 个人觉得可用的 Tmux 配置教程

## 缘起

最初是参考 [Dream of Code 的 tmux 配置](https://github.com/dreamsofcode-io/tmux)

但这个你拿到也不知道怎么用，他的来源是这个视频 -> [Youtube](https://youtube.com/watch?v=DzNmUNvnB04)

但每次在新的终端中，配置都会忘记怎么弄，他也没有总结，于是记录下来，不至于每次去翻

## 步骤

### 1. 安装 tmux

首先我们需要安装 `tmux`，可以参考其 [GitHub 的 wiki 页面](https://github.com/tmux/tmux/wiki/Installing)

> 但很多 `Linux` 发行版的包管理里面的版本都非常老了，比如我的VPS上的 `Ubuntu 18.04`，带的是`v2.6`，截至本教程的更新时间（20240612）时，`tmux` 版本为 `v3.4`。导致你不得不用手动安装的方式

#### 使用包管理

还是使用包管理比较简单

| 平台  	                | 包管理命令             |
| ---------                 | ---------------       |
| Arch Linux                | `pacman -S tmux`      |
| Debian or Ubuntu          | `apt install tmux`    |
| Fedora                    | `dnf install tmux`    |
| RHEL or CentOS            | `yum install tmux`    |
| macOS (using Homebrew)    | `brew install tmux`   |
| macOS (using MacPorts)    | `port install tmux`   |
| openSUSE                  | `zypper install tmux` |

#### （或者）手动安装

参考 wiki 页面，略微有些复杂，不熟悉 make 那一套建议不要尝试

### 2. 配置文件

配置文件放置于特定位置，推荐放置文件夹 `~/.tmux.conf` 或者 `~/.config/tmux/tmux.conf`, 记住此位置下面会用到

以前者举例，新建一个配置文件：

```bash
touch ~/.tmux.conf
```

编辑这个配置文件，这里使用 `vim`

```bash
vim ~/.tmux.conf
```

粘贴其提供的 [GitHub上的配置](https://github.com/dreamsofcode-io/tmux/blob/main/tmux.conf)

<details>
<summary>个人修改版的配置（增加了中文注释，点击展开）</summary>

```
set-option -sa terminal-overrides ",xterm*:Tc"
set -g mouse on

# 这里将前缀按键 <Prefix> 修改为了Ctrl+Space
# 但中文Windows大多数这个快捷键是切换中英文输入，故未修改，仍然使用Ctrl+b
# unbind C-b
# set -g prefix C-Space
# bind C-Space send-prefix

# 使用Vim的光标切换 Ctrl+b h/j/k/l 切换活动窗格(Panel)
bind h select-pane -L
bind j select-pane -D 
bind k select-pane -U
bind l select-pane -R

# 设置窗口起始下标为1
set -g base-index 1
set -g pane-base-index 1
set-window-option -g pane-base-index 1
set-option -g renumber-windows on


# 使用Alt+↑/↓/←/→无需前缀Ctrl+b切换活动窗格
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# 使用Shift+←/→无需前缀Ctrl+b切换当前窗口
bind -n S-Left  previous-window
bind -n S-Right next-window

# 使用Alt+Shift+h/j/k/l无需前缀Ctrl+b切换当前窗口
bind -n M-H previous-window
bind -n M-L next-window

set -g @catppuccin_flavour 'mocha'

set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'christoomey/vim-tmux-navigator'
# 这行是tmux主题(theme)，可以替换为自己想要的主题
set -g @plugin 'dreamsofcode-io/catppuccin-tmux'
set -g @plugin 'tmux-plugins/tmux-yank'

run '~/.tmux/plugins/tpm/tpm'

# 使用vi模式
set-window-option -g mode-keys vi
# 绑定一些按键，在复制模式下，v开始选择，Ctrl+v开始方形选择，y复制选择的内容
bind-key -T copy-mode-vi v send-keys -X begin-selection
bind-key -T copy-mode-vi C-v send-keys -X rectangle-toggle
bind-key -T copy-mode-vi y send-keys -X copy-selection-and-cancel

# 增加新建窗格时跟随原有目录的功能（比较实用）
bind '"' split-window -v -c "#{pane_current_path}"
bind % split-window -h -c "#{pane_current_path}"
```
</details>

保存退出后，如在 `tmux` 中，使用 `tmux source ~/.tmux.conf`（这个位置可以根据前面设置的更改） 重新加载此文件

### 3. 执行插件安装

重新加载此文件后，需要再按 `Ctrl+b Shift+i` 来让 `tmux` 安装这些插件，才能获得样式更改，至此调整结束

## 总结

`tmux` 可以解决几个关键问题

* 传统终端只能打开一个窗口，有时候需要平行运行很多工作时，不得不启动多个终端，十分不便
* 传统终端内启动的进程会随着终端的关闭而结束，而 `tmux` 不会，于是可以启动各种进程，无需担心终端关闭而停止进程
* 传统终端生态丰富程度远远不及 `tmux`, 后者也并不是重新实现终端，而且可以实现多人操控同一个终端

翻译了一个[Tmux速查表](https://chenhai.net/tools/tmux-cheat-sheet-cn/)，欢迎食用和提出建议