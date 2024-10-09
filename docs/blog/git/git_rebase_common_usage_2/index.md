---
outline: deep
---

# Git Rebase 两个常用功能(二)

我们在开发的时候要养成“勤提交(commit)，谨慎推送(push)”的习惯。即在本地可以很细碎的提交，因为本地做的一切操作，都可随时反悔、调整、撤销等等，但如果推送到远端之后，如果要改写你的操作，很有可能会影响到别的人，所以推送到远端这个操作就要慎重。

我们分几个例子来描述`rebase`在修改提交历史中的作用。首先我们假设我们在`dev`分支上，然后有如下的提交：

```shell
$ git log --graph
```
```txt
* commit c24b828139a038e42e23bb1f033dae2eb6acb582 (HEAD -> dev)
| Author: 1 <1@1.cn>
| Date:   Thu Sep 19 09:46:04 2024 +0800
|
|     add b.txt
|
* commit a748e80fdc7260dbc500968f43ab42566d4eacdd 
| Author: 1 <1@1.cn> 
| Date:   Thu Sep 19 09:45:38 2024 +0800
|
|     modify a.txt
|
* commit d51aa2a61c3a6f150718d82fd9a0bf27a885d097
  Author: 1 <1@1.cn>
  Date:   Thu Sep 19 09:44:55 2024 +0800

      add 1.txt
```

假设，我在提交了很多之后（指增加了`c24b828`）这个提交之后，想要修改`a748e80`这个提交的文件内容和提交消息(commit message)，我该怎么做？这就需要`rebase`出场了

## 修改提交历史

我们以修改`a748e80`这个提交的`a.txt`的内容，并把提交消息修改得更正式一点。例如`fix(a.txt): add one line and another line`，顺便把作者改成`2<2@1.cn>`为例子讲述

首先使用`git rebase -i`这个命令，`-i`表示使用交互式操作。我们如果要修改`a748e80`这个提交，则需要输入它之前的那个提交，例如`git rebase -i d51aa2a`或者`git rebase -i a748e80~1`，会进入这个修改界面（其实是`vim`编辑某个文件）

```
pick a748e80 modify a.txt
pick c24b828 add b.txt

# ...
```

可以看出这里面的提交顺序和`git log`输出的顺序是颠倒的，要修改`pick a748e80 modify a.txt`中的`pick`为`edit`，改成这样

```
edit a748e80 modify a.txt
pick c24b828 add b.txt

# ...
```

保存并退出，就可以看到这样的输出：

```
Stopped at a748e80...  modify a.txt
You can amend the commit now, with

  git commit --amend

Once you are satisfied with your changes, run

  git rebase --continue

```

这时我们就可以修改`a.txt`里面的内容，例如将`one line`修改为`one line, more`，然后看一下`git status`的输出
```shell
$ git status
```
```
interactive rebase in progress; onto d51aa2a
Last command done (1 command done):
   edit a748e80 modify a.txt
Next command to do (1 remaining command):
   pick c24b828 add b.txt
  (use "git rebase --edit-todo" to view and edit)
You are currently editing a commit while rebasing branch 'dev' on 'd51aa2a'.
  (use "git commit --amend" to amend the current commit)
  (use "git rebase --continue" once you are satisfied with your changes)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   a.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

可以看出此时暂存区里现象还有修改后的`a.txt`，我们需要先把刚才对`a.txt`的修改增加到这次提交中，即使用`git add -A`，然后使用`git commit --amend`来修改当前`a748e80`这次提交的提交消息，如果要修改提交作者和邮箱则需要加入`--author="2<2@1.cn>"`。
```shell
$ git commit --amend --author="2 <2@1.cn>"
```

我们修改提交信息为如下并保存退出

```
fix(a.txt): add one line and another line
```
可以看到修改后的提交信息：
```
[detached HEAD 614399f] fix(a.txt): add one line and another line
 Author: 2 <2@1.cn>
 Date: Thu Sep 19 09:45:38 2024 +0800
 1 file changed, 1 insertion(+)
```

这个命令可以执行多次，修改至你满意为止。觉得可以继续了则执行`git rebase --continue`，会跳转到下一个需要操作的地方，由于我们的这里没有修改，则输出了变基完成的消息

```
Successfully rebased and updated refs/heads/dev.
```

然后看一下提交历史，可以看到第二个提交的SHA，消息，作者和邮箱都被修改了，最新的提交的SHA也发生了修改（因为它是基于第二个提交的）
```shell
$ git log --graph 
```
```
* commit 79795e81c4d26fa078797ca21bcae453f6aa2b99 (HEAD -> dev) // [!code warning]
| Author: 1 <1@1.cn>
| Date:   Thu Sep 19 09:46:04 2024 +0800
|
|     add b.txt
|
* commit 0bdc17daa9873e6a90f63fb8f249301374f867b5 // [!code warning]
| Author: 2 <2@1.cn> // [!code warning]
| Date:   Thu Sep 19 09:45:38 2024 +0800
|
|     fix(a.txt): add one line and another line
|
* commit d51aa2a61c3a6f150718d82fd9a0bf27a885d097
  Author: 1 <1@1.cn>
  Date:   Thu Sep 19 09:44:55 2024 +0800

      add 1.txt
```

这就是修改提交历史的方法，下面讲述压缩提交的例子。

## 压缩提交

通常我们在自己本地开发的时候，是尽量提交越多越好，但如果要合并到开发分支时，则尽量压缩成一个提交，这依然可以使用`rebase`来完成。

假设有这样的一个`git`项目，执行`git log --oneline --graph`后输出如下：

```txt
* 20b9f90 (HEAD -> dev) add comment
* 21c71b3 fix(1.txt): remove feature 2
* e68c383 feature(1.txt): add feature 2 and 3
* 4b0664b feature(1.txt): add feature 1
* 1010858 (origin/dev) v0.1.0
```

因为最终要提交到远端，所以想要将`21c71b3`,`e68c383`,`4b0664b`和`20b9f90`压缩成一个提交，则使用`rebase`来完成。注意`rebase`只能用来修改当前***未提交到远端***的提交消息，例如上面的日志中从`21c71b3`到`4b0664b`的提交。

使用`git rebase -i 4b0664b~1`来对`4b0664b`开始的（包括此提交）进行变基，执行命令后打开编辑界面（其实是`vim`)。

```txt
pick 4b0664b feature(1.txt): add feature 1
pick e68c383 feature(1.txt): add feature 2 and 3
pick 21c71b3 fix(1.txt): remove feature 2
pick 20b9f90 add comment

# Rebase 1010858..20b9f90 onto 1010858 (4 commands)
...
```

要删除和合并提交需要使用两个关键字`squash`和`fixup`。

* **`squash`** 用于将提交消息合并到前一个提交
* **`fixup`** 则只保留文件修改，忽视掉提交消息

在这个例子中，我们需要将`e68c383`和`21c71b3`前面的`pick`修改为`squash`，而将`20b9f90`前面的`pick`修改为`fixup`。如下：

```txt
pick 4b0664b feature(1.txt): add feature 1
squash e68c383 feature(1.txt): add feature 2 and 3
squash 21c71b3 fix(1.txt): remove feature 2
fixup 20b9f90 add comment

# Rebase 1010858..20b9f90 onto 1010858 (4 commands)
...
```

修改完毕后保存，`Git`会打开新的提交消息的窗口

```txt
# This is a combination of 4 commits.
# This is the 1st commit message:

feature(1.txt): add feature 1

# This is the commit message #2:

feature(1.txt): add feature 2 and 3

# This is the commit message #3:

fix(1.txt): remove feature 2

# The commit message #4 will be skipped:

# add comment
```
可以看出之前的3条消息被保留了下来，而第4条`add comment`被注释了，我们将其综合修改为下面的样子

```
feature(1.txt): add feature 1 and 3

# add comment
```

然后保存，输出了这样的结果：
```
[detached HEAD 10bc0f9] feature(1.txt): add feature 1 and 3
 Date: Thu Sep 19 11:19:43 2024 +0800
 1 file changed, 4 insertions(+)
Successfully rebased and updated refs/heads/dev.
```

最后再使用`git log --oneline --graph`查看日志：
```
* 10bc0f9 (HEAD -> dev) feature(1.txt): add feature 1 and 3 // [!code warning]
* 1010858 (origin/dev) v0.1.0
```

这样就可以`git push origin`提交到远端了，别人协作时只会看到你的这一条提交，可以和之前的`rebase`变换自己的提交的基础提交的操作结合，得到干净清晰的提交历史。

## 拆分提交

拆分提交属于上面情况的逆向操作，这属于比较少见的需求了，但`Git`仍然提供了这个功能的实现。

来看例子，假设我们有这样的提交历史，由`git log --oneline --graph`生成

```
* ceb1a59 (HEAD -> master) add 2.txt
* f277ed7 add first line and second line
* 69dbfcc add 1.txtt
```

其中`f277ed7`这个提交，修改的文件`1.txt`如下：

```
first line
second line
```

如果我想把这个`f277ed7`拆分为两个提交，提交消息分别为`add first line`和`add second line`，该怎么做呢？当然也是使用`git rebase`。

> [!WARNING]
> 这个操作只能修改 ***未提交到远端*** 的提交，如果提交到了远端且在多人合作，不要进行这种操作。

### 

回到`69dbfcc`这个提交或者说`f277ed7`的前一个提交

```bash
git rebase -i 69dbfcc
```

或者

```bash
git rebase -i f277ed7~
```

执行了命令之后，会打开一个编辑对话框，它的前几行类似如下，注意旧的提交是在前面的：

```
pick f277ed7 add first line and second line
pick ceb1a59 add 2.txt

...
```

我们需要拆分`f277ed7`这个提交，就把它前面的`pick`修改为`edit`，并保存退出，注意此时并不需要直接修改文件，而是撤销当前提交的修改，执行如下命令

```
git reset HEAD~
```

注意`reset`在这里默认是混合模式，即删除提交消息，而保留文件修改，所以此时的`1.txt`的内容仍是

```
first line
second line
```

而`git log --online --graph`的结果已是

```
* 69dbfcc (HEAD) add 1.txt
```

我们只需将`1.txt`修改成只有第一行的样子，再`git commit -a`，在打开的消息提交框中输入第一次的提交消息`add first line`，然后继续修改`1.txt`修改为原来有两行的样子，并再次`git commit -a`，在进行下一步前，建议使用`git log --oneline --graph`查看一下提交日志

```
* 71d9049 (HEAD) add second line
* e4b7564 add first line
* 69dbfcc add 1.txt
```

是我们想要的样子，接着只需`git rebase --continue`即可继续`rebase`，由于已经没有需要操作的，所以提示成功：

```
Successfully rebased and updated refs/heads/master.
```

然后再`git log --oneline --graph`看一下提交日志：

```
* 44d4e85 (HEAD -> dev) add 2.txt   // [!code warning]
* 71d9049 add second line   // [!code ++]
* e4b7564 add first line    // [!code ++]
* 69dbfcc add 1.txt
```

可以清楚地看到，原来的`f277ed7`提交已经被拆分为了`e4b7564`和`71d9049`两个提交，而之后的提交的`SHA`都发生了改变。