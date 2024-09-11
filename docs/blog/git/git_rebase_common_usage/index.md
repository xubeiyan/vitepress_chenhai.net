---
outline: deep
---

# Git Rebase 两个常用功能

个人觉得对于`Git`这个工具，能说自己会用必须要基本掌握`git rebase`这条命令。这个命令也是非常强大的，下面就讲述一下两个开发中非常常用的场景：

* 多人开发中避免不必要的`merge`操作
* 修改自己的提交历史

由于各种Git GUI工具五花八门，所讲述的功能不一定所有的GUI都支持，所以这里就以`CLI`（命令行接口）为例子来讲述。

## 避免不必要的`merge`

这是开发中最常遇到的问题，大概的`GitFlow`图形如下

![图1](/images/git_rebase_1.png)

最后合并阶段就是很头疼的问题，`dev`分支上充满了无意义（个人认为）的`merge`提交，而且大多数人不是很在意出现冲突后的合并。有些时候你会发现你明明删除掉的代码在`merge`之后它又回来了（这是真实发生过的事情）

其实这个问题可以使用`git rebase`解决。

### 使用`rebase`拯救臃肿的`dev`分支

可以看出，`dev`分支臃肿的原因是充满了`merge`提交，要如何消除这些`merge`呢？我们分几种情况讨论：

### 本地当前分支已经`merge`到`dev`中，且已经推送到了远端

抱歉，这种情况除了改写远端别无他法。而多人开发中这意味着如果你强制覆盖了远端，即使用了`--force`选项，那么其他人就无法顺利地将自己的修改提交到远端，会引发更大的问题，所以这种情况下请等待下次吧。

### 本地当前分支已经`merge`到`dev`中，但尚未推送到远端

大概图例如下：

![图2](/images/git_rebase_2.png)

这是最后的拯救机会，首先要移除本地的这个merge提交，但注意要使用混合模式，即`git reset`的默认模式，这种会将你的修改保留，但移除掉对分支树的修改，一般只需执行

```shell
git reset HEAD~1
```

这个命令的意思是，撤销`HEAD`指向的提交（即本地的最新的提交），执行成功后大概图例如下：

![图3](/images/git_rebase_3.png)

这就到了最简单的情况——

### 本地当前分支尚未`merge`到`dev`中

这里我们要做的事情就很简单了，即把上面一张图中的分支树变成下图这样

![图4](/images/git_rebase_4.png)

这里就完美说明了`rebase`这个词的含义，即将`3`这个提交的上一级提交(即base)，例子中是`1`，更换为`2`这个提交。它的命令也比较简单：

```shell
git rebase dev
```

它代表了会把当前分支（即`git status`显示的分支）的内容`rebase`到`dev`分支上，即会把如果你的提交和`dev`分支上没有冲突的话，那就可以很轻松的完成。下面是一个简单的例子：

```shell
# rebase前
$ git log --all --oneline --graph
* 6355958 (dev) add other commit
| * 4717a58 (HEAD -> feature/new) add new feature, modify 1.txt
|/
* ab0643c first commit, create 1.txt

$ git rebase dev
Successfully rebased and updated refs/heads/feature/new.

# rebase后
$ git log --all --oneline --graph
* aa98dad (HEAD -> feature/new) add new feature, modify 1.txt
* 6355958 (dev) add other commit
* ab0643c first commit, create 1.txt
```

它的好处我们在上图也可以看出来，完全没有`merge`提交，提交历史清晰，向远端提交也没有任何压力，直接`git push origin HEAD:dev`即可，因为前面的内容完全一致，远端只需执行`Fast-Forward`合并即可。

同时也可以看出，这个`rebase`命令是会删除老的在`feature\new`分支上的`SHA`为`4717a58`的提交，再在`dev`分支上`SHA`为`6355958`这次提交后追加一个新的`aa98dad`的新提交的，虽然内容完全一样，但它已经是一个新提交了。

> 但有些开发环境的合并分支并不能直接使用`merge`，而是使用`Pull Request`，这种情况就不适用这个方案，因为这种情况下`dev`分支极有可能是不允许直接`merge`的，所以最后的`git push origin HEAD:dev`并不能执行成功

### `Git`的改变

你可能会好奇我根本没有做`merge`，它这个`merge`提交是怎么生成的？

答案就在这个`git pull`上面，一般我们在准备要合并自己的分支到`dev`时，会习惯性的执行`git pull`，这个命令相当于两个命令的结合`git fetch`和`git merge`(仅限老版本的`Git`，默认`pull`是基于`merge`，新版本的`Git`安装式会询问`pull`是基于`rebase`还是`merge`)，它会拉取远端分支上的内容，将其merge到本地分支中，所以这次`merge`提交是由`pull`请求生成的。

但新版的`Git`已经意识到这个问题，开始将`pull`的合并策略改为可调整的，如果用`rebase`的话就可以减少很多麻烦的工作。

## 调整你的`commit`历史

有时候我们需要修改你的提交，分出新的，合并多个，调换顺序，移除某些，这些功能依然可以使用`rebase`完成。
