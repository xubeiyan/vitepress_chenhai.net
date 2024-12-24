---
outline: deep
---

# JavaScript 的 ??= 运算符：让取默认值更简单

> 本文翻译自 [JavaScript's ??= Operator: Default Values Made Simple](https://www.trevorlasn.com/blog/javascript-nullish-coalescing-assignment-operator)

本文描述了如何在 `JavaScript` 中使用 `??=` 运算符优雅地处理 `null` 和 `undefined`。

空值合并赋值运算符（nullish coalescing assignment operator） **`??=`** 在 JavaScript 历史中年纪尚轻，它在 [ECMAScript 2021 (ES12)](https://262.ecma-international.org/12.0/index.html) 中以“逻辑赋值运算符”的身份加入了标准。

`??=` 运算符通常被用作变量的保护者。它使得变量仅在 `null` 或者 `undefined` 时才会被赋予新值。

```javaScript
// 老旧方法（2021标准前）
if (user.name === null || user.name === undefined) {
  user.name = 'Anonymous';
}

// 或者使用空值合并运算符（nullish coalescing operator）(??)
user.name = user.name ?? 'Anonymous';

// 新方法（ES2021 及之后）
username ??= 'Anonymous';
```

当你使用例如 `user.name ??= 'Anonymous'` 的代码时，该运算符首先会检查 `user.name` 是否为 `null` 或者 `undefined`。

如果它是 `null` 或者 `undefined`，则会被赋值为 `Anonymous`——也就是说，如果不是，即使是诸如 0 或者空字符串，那它也不会被改变。

## 为什么 ??= 比其他方法好

在 `??=` 出现之前，我们有很多种方法来处理默认值。但它们都有各自的缺点。我们来看下面的代码：

```javaScript
// 使用 if 判断，啰嗦且重复
if (user.name === null || user.name === undefined) {
  user.name = 'Anonymous';
}

// 使用 || 运算符，会错误地多捕获一些值
user.name = user.name || 'Anonymous';  // 会替换掉 '', 0, false

// 使用三元运算符，表达式会非常长且难理解
user.name = user.name === null || user.name === undefined
  ? 'Anonymous'
  : user.name;

// 使用 ??=，清晰准确
user.name ??= 'Anonymous';
```

`??=` 运算符给予了之前方法未有的准确，它只会在在对应变量无值的时候触发，解决了当变量为零，空字符串，或者假时属于合法的值的问题。

```javascript
let score = 0;
score ??= 100;    // 保持 0

let tag = '';
tag ??= 'default'; // 保持空字符串

let active = false;
active ??= true;   // 保持假
```

这个运算符的精确性帮助我们在进行边界检测时避免 bug 的产生，当你在构建用户界面或者表单数据的时候，大多数情况下希望保留原始的0，空字符串等，而不是使用默认值代替他们。