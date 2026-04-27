export type JsQuestion = {
  category:
    | "执行机制"
    | "闭包与作用域"
    | "this 与原型"
    | "异步与 Promise"
    | "内存与性能"
    | "模块化与工程"
    | "浏览器运行时"
    | "手写题";
  question: string;
  answer: string;
  deepDive: string;
  talkingPoints: string[];
  codeExample?: string;
  codeExplanation?: string[];
};

export const jsCategories: JsQuestion["category"][] = [
  "执行机制",
  "闭包与作用域",
  "this 与原型",
  "异步与 Promise",
  "内存与性能",
  "模块化与工程",
  "浏览器运行时",
  "手写题",
];

export const jsQuestions: JsQuestion[] = [
  {
    category: jsCategories[0],
    question: "JS EventLoop 事件循环机制的完整执行过程是什么？",
    answer:
      "EventLoop 是 JS 主线程和宿主环境协作的调度模型。JS 引擎本身只有一个调用栈，同一时间只能执行一段 JS；浏览器或 Node.js 负责把定时器、网络、DOM 事件、文件 I/O 等异步能力放到宿主环境里处理。完整流程可以这样理解：先执行全局 script 这个宏任务，期间同步函数按调用栈先进后出执行；遇到 setTimeout、事件监听、fetch 等异步 API 时，注册给宿主环境而不是立刻进入调用栈；当前宏任务执行完、调用栈清空后，事件循环会先清空微任务队列；微任务全部执行完后，浏览器才有机会执行样式计算、布局、绘制和 requestAnimationFrame；之后事件循环再取下一个宏任务继续执行。",
    deepDive:
      "更细一点说，宏任务不是一个统一 API 名称，而是一类 task，例如 script、setTimeout、setInterval、DOM 事件回调、MessageChannel、网络回调等。微任务包括 Promise reaction、queueMicrotask、MutationObserver 等。关键规则是：每执行完一个宏任务，都会进行一次 microtask checkpoint，也就是不断取出并执行微任务，直到微任务队列为空；如果微任务执行过程中又产生新的微任务，新微任务也会在本次 checkpoint 继续执行，所以微任务可以“插队”到下一个宏任务之前。浏览器渲染不是每条 JS 后都发生，而通常发生在宏任务结束、微任务清空之后，并且浏览器会根据帧率、页面是否可见、是否需要更新来决定是否渲染。requestAnimationFrame 回调通常在下一帧绘制前执行，适合读写动画相关状态；requestIdleCallback 则更偏空闲时做低优先级任务。Node.js 也有 EventLoop，但阶段更多，例如 timers、poll、check，并且 process.nextTick 优先级高于普通 Promise 微任务，所以回答时要区分浏览器和 Node。",
    talkingPoints: [
      "JS 引擎负责执行调用栈，浏览器/Node 这样的宿主环境负责异步能力和任务调度。",
      "全局 script 本身就是一个宏任务；同步代码先执行，异步 API 只是注册回调。",
      "每个宏任务结束后都会清空微任务队列，微任务里新增的微任务也会在本轮继续清空。",
      "浏览器渲染通常发生在宏任务结束且微任务清空之后，微任务过多会阻塞渲染。",
      "requestAnimationFrame 通常在下一帧绘制前执行，setTimeout 是后续宏任务，两者不能简单等价。",
      "Node.js EventLoop 有自己的阶段模型，process.nextTick、Promise、setImmediate、setTimeout 的顺序要单独讨论。",
    ],
    codeExample: `console.log("script start");

setTimeout(() => {
  console.log("timeout 1");
  Promise.resolve().then(() => console.log("promise in timeout"));
}, 0);

Promise.resolve()
  .then(() => {
    console.log("promise 1");
    queueMicrotask(() => console.log("queueMicrotask"));
  })
  .then(() => console.log("promise 2"));

requestAnimationFrame(() => console.log("rAF"));

console.log("script end");`,
    codeExplanation: [
      "第一步执行全局 script 宏任务，所以先输出 `script start`，然后注册 setTimeout 回调、Promise 微任务链、rAF 回调，最后输出 `script end`。",
      "第二步全局 script 结束，调用栈清空，进入 microtask checkpoint，先执行第一个 Promise.then，输出 `promise 1`，并追加一个 `queueMicrotask`。",
      "第三步继续清空微任务队列：Promise 链上的下一个 then 和 queueMicrotask 都会在进入下一个宏任务前执行。实际顺序取决于它们入队时机，这段代码通常会输出 `promise 1`、`queueMicrotask`、`promise 2`。",
      "第四步浏览器有机会处理渲染帧，rAF 通常会在下一次绘制前执行；如果当前环境没有可见渲染帧，rAF 时机可能被延后。",
      "第五步进入后续宏任务，执行 setTimeout，输出 `timeout 1`；这个宏任务内部又创建 Promise 微任务，所以 `promise in timeout` 会在该宏任务结束后、下一宏任务前执行。",
      "因此常见输出可理解为：script start -> script end -> promise 1 -> queueMicrotask -> promise 2 -> rAF -> timeout 1 -> promise in timeout。rAF 与 timer 的相对顺序可能受浏览器帧调度影响，面试时要说明这一点。",
    ],
  },
  {
    category: "执行机制",
    question: "执行上下文、调用栈、词法环境和变量环境之间是什么关系？",
    answer:
      "JS 执行代码时会创建执行上下文，执行上下文入栈形成调用栈。每个执行上下文里有词法环境、变量环境和 this 绑定。词法环境保存 let/const、块级作用域和外部环境引用；变量环境主要保存 var 和函数声明。作用域链就是通过外部环境引用逐级查找变量形成的。",
    deepDive:
      "面试里不要只说“栈先进后出”。更高级的回答是：执行上下文解决“当前代码在哪执行”，词法环境解决“变量去哪找”，调用栈解决“函数调用顺序和返回位置”。闭包之所以能访问外层变量，是因为内部函数保留了对外层词法环境的引用，而不是复制了一份变量。",
    talkingPoints: [
      "执行上下文包含词法环境、变量环境和 this 绑定。",
      "调用栈管理函数调用关系，栈溢出通常来自递归过深。",
      "作用域链来自词法环境的 outer reference。",
    ],
    codeExample: `const x = 1;

function outer() {
  const y = 2;
  return function inner() {
    return x + y;
  };
}

const fn = outer();
fn(); // 3`,
    codeExplanation: [
      "`inner` 执行时自己的作用域没有 `x/y`，会沿作用域链查找。",
      "`outer` 执行结束后，`y` 仍被 `inner` 的闭包引用。",
      "`x` 来自全局词法环境，`y` 来自 outer 的词法环境。",
    ],
  },
  {
    category: "执行机制",
    question: "变量提升、TDZ、var/let/const 的区别是什么？",
    answer:
      "`var` 会被提升并初始化为 undefined，存在函数作用域；`let/const` 也会被提升，但在声明执行前处于暂时性死区 TDZ，访问会报错，并且具备块级作用域。`const` 限制的是绑定不能重新赋值，不代表对象内容不可变。",
    deepDive:
      "TDZ 的价值是避免变量在声明前被误用。高级回答可以补充：提升不是代码真的移动了，而是引擎在创建执行上下文时先建立绑定。`let/const` 的绑定存在，但未初始化，所以访问会抛 ReferenceError。",
    talkingPoints: [
      "`var` 函数作用域，`let/const` 块级作用域。",
      "TDZ 表示绑定存在但未初始化。",
      "`const obj` 不能重新绑定，但 `obj.a` 可以改。",
    ],
    codeExample: `console.log(a); // undefined
var a = 1;

console.log(b); // ReferenceError
let b = 2;`,
  },
  {
    category: "执行机制",
    question: "严格模式会影响哪些行为？",
    answer:
      "严格模式会让一些静默失败变成显式报错，禁止隐式创建全局变量，普通函数独立调用时 this 为 undefined，不再默认指向 window，同时也限制 delete 变量、重复参数名等不安全写法。",
    deepDive:
      "严格模式的目标是让错误更早暴露，并为 JS 引擎优化提供更稳定的语义。模块和 class 默认运行在严格模式下，所以现代工程里很多严格模式行为其实已经默认存在。",
    talkingPoints: [
      "普通函数独立调用时 this 不再自动指向全局对象。",
      "未声明变量赋值会抛错。",
      "ESM 和 class 默认严格模式。",
    ],
  },
  {
    category: "闭包与作用域",
    question: "闭包是什么？它为什么可能导致内存泄漏？",
    answer:
      "闭包是函数和其词法环境的组合。只要内部函数被外部引用，它就可以继续访问外层函数的变量。闭包本身不是内存泄漏，但如果闭包长期引用大对象、DOM 节点、定时器上下文或缓存数据，就会阻止这些对象被 GC 回收。",
    deepDive:
      "面试时要避免把闭包说成“函数套函数”。真正关键是外层词法环境被内部函数引用并延长生命周期。内存泄漏发生在这些引用不再有业务价值却仍然可达，比如事件监听没有解绑、缓存 Map 不清理、定时器闭包持有页面数据。",
    talkingPoints: [
      "闭包延长变量生命周期。",
      "泄漏的根因是无用对象仍然可达。",
      "事件监听、定时器、缓存和 DOM 引用是高频泄漏点。",
    ],
    codeExample: `function bindHugeData(button: HTMLButtonElement) {
  const hugeData = new Array(100000).fill("data");

  function onClick() {
    console.log(hugeData.length);
  }

  button.addEventListener("click", onClick);
  return () => button.removeEventListener("click", onClick);
}`,
    codeExplanation: [
      "`onClick` 闭包持有 `hugeData`。",
      "如果组件销毁时不 removeEventListener，`hugeData` 仍可能无法释放。",
      "返回 cleanup 函数可以显式断开引用链。",
    ],
  },
  {
    category: "闭包与作用域",
    question: "React hooks 中的闭包旧值问题怎么产生？",
    answer:
      "函数组件每次渲染都会创建新的函数作用域。effect、定时器、事件回调会捕获当次渲染的 state/props。如果依赖数组缺失，回调就可能一直读取旧渲染里的值，这就是 hooks 中常见的闭包旧值问题。",
    deepDive:
      "解决思路不是盲目禁用 eslint，而是让依赖数组描述真实同步关系。对于不需要触发 effect 重建但又要读取最新值的场景，可以用 ref 保存最新值；对于基于旧 state 更新新 state 的场景，优先使用函数式更新。",
    talkingPoints: [
      "每次 render 都有独立闭包。",
      "依赖数组缺失会让 effect 读取旧值。",
      "函数式 setState 和 ref 是常见修复手段。",
    ],
    codeExample: `setCount((count) => count + 1);

const latestValue = useRef(value);
useEffect(() => {
  latestValue.current = value;
}, [value]);`,
  },
  {
    category: "闭包与作用域",
    question: "循环闭包为什么容易出错？",
    answer:
      "`var` 是函数作用域，循环里的多个回调共享同一个变量绑定，异步执行时通常会读到循环结束后的最终值。`let` 是块级作用域，每轮循环都会创建新的绑定，因此可以得到符合预期的值。",
    deepDive:
      "这道题本质考的是变量绑定，而不是 setTimeout。用 IIFE、函数参数、let 都能解决，但现代代码优先用 let。面试时可以顺带说明“闭包捕获的是变量绑定，不是当时的值”。",
    talkingPoints: [
      "`var` 回调共享同一个 i。",
      "`let` 每轮循环创建新绑定。",
      "闭包捕获变量绑定，而不是复制值。",
    ],
  },
  {
    category: "this 与原型",
    question: "this 的绑定规则有哪些？箭头函数有什么特殊之处？",
    answer:
      "this 绑定规则通常按优先级理解：new 绑定、显式绑定、隐式绑定、默认绑定。箭头函数没有自己的 this，它捕获外层词法作用域中的 this，因此不能用 call/apply/bind 改变，也不适合作为构造函数。",
    deepDive:
      "this 不是函数定义时固定的，普通函数的 this 取决于调用方式；箭头函数的 this 取决于创建时外层作用域。面试时可以用“谁调用不一定决定全部，优先级才关键”来回答，尤其 new 绑定优先级高于 bind 的大多数直觉。",
    talkingPoints: [
      "普通函数 this 看调用方式。",
      "箭头函数 this 看定义位置外层作用域。",
      "new 绑定优先级最高，箭头函数不能 new。",
    ],
    codeExample: `const obj = {
  name: "A",
  normal() {
    return this.name;
  },
  arrow: () => this,
};

obj.normal(); // "A"`,
  },
  {
    category: "this 与原型",
    question: "new 的执行过程是什么？",
    answer:
      "`new` 会创建一个新对象，把新对象的原型指向构造函数的 prototype，用新对象作为 this 执行构造函数，最后如果构造函数返回对象则返回该对象，否则返回新创建的对象。",
    deepDive:
      "这道题经常和原型链、class、instanceof 一起考。class 只是语法层封装，本质仍然依赖原型链。手写 myNew 时要特别注意构造函数显式返回对象的情况。",
    talkingPoints: [
      "创建对象。",
      "连接原型。",
      "绑定 this 执行构造函数。",
      "构造函数返回对象时优先返回该对象。",
    ],
  },
  {
    category: "this 与原型",
    question: "原型链、class 和继承的关系是什么？",
    answer:
      "JS 对象通过 [[Prototype]] 形成原型链。构造函数的 prototype 会成为实例的原型；class 是基于原型机制的语法糖。extends 会建立两条关系：子类实例继承父类 prototype 上的方法，子类构造函数也继承父类构造函数上的静态属性。",
    deepDive:
      "面试里不要只说 class 是语法糖，还要能解释实例方法在 prototype 上，字段通常在实例上，静态方法在构造函数上。属性查找先查自身，再沿原型链向上查找。",
    talkingPoints: [
      "实例方法通常挂在 prototype。",
      "属性查找沿原型链进行。",
      "extends 同时处理实例继承和静态继承。",
    ],
  },
  {
    category: "异步与 Promise",
    question: "浏览器事件循环中宏任务、微任务和渲染时机是什么关系？",
    answer:
      "一次事件循环通常会执行一个宏任务，然后清空所有微任务，之后浏览器有机会进行渲染。`Promise.then`、`queueMicrotask` 属于微任务；`setTimeout`、用户事件、网络回调通常按宏任务理解。微任务过多会阻塞渲染，导致页面卡顿。",
    deepDive:
      "高级回答要补充：requestAnimationFrame 通常在下一次渲染前执行，适合读取或更新动画相关状态；长任务应拆分，避免持续占用主线程。事件循环不是只为背输出顺序，更是理解页面响应、渲染和性能的基础。",
    talkingPoints: [
      "宏任务后会清空微任务。",
      "微任务过多也会阻塞渲染。",
      "rAF 更适合动画和渲染前更新。",
    ],
    codeExample: `console.log("sync");
setTimeout(() => console.log("timeout"));
Promise.resolve().then(() => console.log("promise"));
queueMicrotask(() => console.log("microtask"));`,
    codeExplanation: [
      "`sync` 先执行。",
      "两个微任务会在 timeout 之前执行。",
      "同一轮宏任务结束后，事件循环会先清空微任务队列。",
    ],
  },
  {
    category: "异步与 Promise",
    question: "async/await 和 Promise 链的执行顺序怎么理解？",
    answer:
      "`async` 函数会返回 Promise，`await` 后面的代码可以理解为被放进微任务中继续执行。`await` 会先让出当前执行权，等待右侧 Promise resolve 后，再恢复执行后续代码。",
    deepDive:
      "面试里可以把 `await expr` 转换成 `Promise.resolve(expr).then(...)` 来理解，但要注意错误处理会进入 reject 分支，可用 try/catch 捕获。async/await 改善可读性，不改变 Promise 的异步本质。",
    talkingPoints: [
      "async 函数总是返回 Promise。",
      "await 后续逻辑进入微任务。",
      "try/catch 可以捕获 await 的 reject。",
    ],
  },
  {
    category: "异步与 Promise",
    question: "Promise 状态机、错误穿透和 finally 怎么理解？",
    answer:
      "Promise 有 pending、fulfilled、rejected 三种状态，一旦 settled 就不可逆。then/catch 会返回新的 Promise，错误会沿链路向后传播，直到遇到 reject handler。finally 不接收成功值或失败原因，它适合做清理，并且默认会把原来的结果继续向后传。",
    deepDive:
      "thenable 同化是 Promise 的关键细节：如果 resolve 一个带 then 方法的对象，Promise 会尝试采用它的状态。手写 Promise 时这块最容易漏。业务中 finally 常用于关闭 loading、释放锁、清理临时状态。",
    talkingPoints: [
      "Promise 状态一旦确定不可逆。",
      "then/catch 会产生新 Promise。",
      "finally 用于清理，默认透传原结果。",
    ],
  },
  {
    category: "内存与性能",
    question: "JS 垃圾回收的可达性原则是什么？",
    answer:
      "现代 JS 垃圾回收主要基于可达性分析。从根对象出发，能被访问到的对象就是可达的，不能被访问到的对象可以被回收。常见根包括全局对象、当前调用栈、闭包引用、DOM 引用等。",
    deepDive:
      "内存泄漏本质是对象已经不再有业务价值，但仍然从 GC Roots 可达。闭包、全局缓存、事件监听、定时器、Detached DOM 都是常见来源。WeakMap 的价值在于 key 是弱引用，不会因为缓存关系阻止对象被回收。",
    talkingPoints: [
      "GC 看可达性，不看你是否还想用。",
      "泄漏来自无用对象仍然可达。",
      "WeakMap 适合为对象附加元数据缓存。",
    ],
  },
  {
    category: "内存与性能",
    question: "前端常见内存泄漏有哪些？怎么排查？",
    answer:
      "常见泄漏包括未清理定时器、事件监听未解绑、闭包持有大对象、全局 Map 缓存无限增长、DOM 删除后仍被 JS 引用、第三方库实例未销毁。排查可以用 Chrome DevTools Memory 的 heap snapshot、allocation timeline，对比操作前后对象数量和 retained size。",
    deepDive:
      "高级排查思路是复现、拍基线快照、执行可疑操作、触发 GC、再拍快照，对比新增且未释放的对象。不要只看 shallow size，更要看 retained size 和 retaining path，找到是谁把对象留住。",
    talkingPoints: [
      "先稳定复现，再拍 heap snapshot。",
      "关注 retained size 和 retaining path。",
      "组件卸载时清理 timer、listener、observer、第三方实例。",
    ],
    codeExample: `useEffect(() => {
  const timer = window.setInterval(fetchStatus, 5000);
  window.addEventListener("resize", handleResize);

  return () => {
    window.clearInterval(timer);
    window.removeEventListener("resize", handleResize);
  };
}, []);`,
  },
  {
    category: "内存与性能",
    question: "防抖、节流、长任务拆分分别解决什么问题？",
    answer:
      "防抖用于等用户停止触发后再执行，例如搜索输入；节流用于固定频率执行，例如滚动监听；长任务拆分用于避免主线程长时间被占用，例如大量数据处理分批执行。",
    deepDive:
      "性能优化不是只背 debounce/throttle。要先判断瓶颈：高频事件用防抖/节流，渲染数据太多用虚拟列表，计算太重用 Web Worker 或分片，资源太大用懒加载和代码分割。",
    talkingPoints: [
      "防抖等停止，节流控频率。",
      "长任务超过 50ms 会影响交互响应。",
      "计算重可以分片或放 Web Worker。",
    ],
  },
  {
    category: "模块化与工程",
    question: "CommonJS 和 ESM 有什么区别？",
    answer:
      "CommonJS 是运行时加载，导出的是值的拷贝或对象引用，常用于 Node 传统生态；ESM 是静态模块系统，编译阶段可分析依赖，导出是 live binding，更利于 tree shaking 和静态优化。",
    deepDive:
      "ESM 的静态性让 bundler 能提前构建依赖图，而 CommonJS 的动态 require 更难静态分析。Node.js 中 ESM 和 CJS 互操作有不少边界，例如默认导出、命名导出、路径扩展名、package type 字段。",
    talkingPoints: [
      "CJS 运行时加载，ESM 静态分析。",
      "ESM 导出是 live binding。",
      "tree shaking 更依赖 ESM 静态结构。",
    ],
  },
  {
    category: "模块化与工程",
    question: "tree shaking 为什么有时不生效？",
    answer:
      "tree shaking 依赖静态 import/export、无副作用判断和压缩器删除未使用代码。如果库使用 CommonJS、存在顶层副作用、package.json 缺少 sideEffects 标记，或者代码被动态访问，tree shaking 都可能不理想。",
    deepDive:
      "工程上要优先使用 ESM 入口，避免从大包根路径引入所有内容；库作者要正确配置 `exports`、`module`、`sideEffects`。同时注意 CSS import、polyfill、全局注册这类副作用不能随便标记为无副作用。",
    talkingPoints: [
      "静态 ESM 是 tree shaking 基础。",
      "顶层副作用会阻止安全删除。",
      "sideEffects 配置要准确，不能为了体积乱标 false。",
    ],
  },
  {
    category: "模块化与工程",
    question: "循环依赖会导致什么问题？",
    answer:
      "循环依赖会让模块在未完全初始化时被另一个模块读取，导致拿到 undefined、半初始化对象或执行顺序异常。ESM 因为 live binding 表现和 CJS 不完全相同，但循环依赖仍然会让代码难以推理。",
    deepDive:
      "循环依赖通常说明模块边界有问题。解决方式包括抽出共同依赖、反转依赖、延迟加载、把类型依赖和运行时依赖分离。大型项目里应通过 lint 或依赖图工具持续监控循环依赖。",
    talkingPoints: [
      "循环依赖让初始化顺序变得脆弱。",
      "抽 shared module 或反转依赖是常见解法。",
      "类型循环和运行时循环要区分。",
    ],
  },
  {
    category: "浏览器运行时",
    question: "DOM 事件模型和事件委托怎么理解？",
    answer:
      "DOM 事件通常经历捕获、目标、冒泡三个阶段。事件委托利用冒泡机制，把多个子元素事件统一绑定到父元素上处理，减少监听器数量，并能自然支持动态新增子元素。",
    deepDive:
      "事件委托适合列表、菜单、表格等大量同类节点。但不是所有事件都冒泡，例如 focus/blur 传统上不冒泡，可用 focusin/focusout。事件处理里要注意 target 和 currentTarget 的区别。",
    talkingPoints: [
      "捕获从外到内，冒泡从内到外。",
      "target 是触发源，currentTarget 是当前监听节点。",
      "事件委托减少监听器并支持动态节点。",
    ],
    codeExample: `list.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest("[data-id]");
  if (!button) return;
  console.log(button.getAttribute("data-id"));
});`,
  },
  {
    category: "浏览器运行时",
    question: "Cookie、localStorage、sessionStorage、IndexedDB 怎么选？",
    answer:
      "Cookie 会随请求发送，适合小型认证状态但要注意 httpOnly、secure、sameSite；localStorage 持久但易受 XSS 影响，不适合存敏感 token；sessionStorage 随标签页生命周期；IndexedDB 适合大量结构化离线数据。",
    deepDive:
      "安全角度上，敏感登录凭证优先 httpOnly secure cookie，并结合 CSRF 防护。前端缓存用户偏好可以用 localStorage；大型离线缓存、草稿箱、文件切片元数据可以用 IndexedDB。",
    talkingPoints: [
      "敏感 token 不建议放 localStorage。",
      "Cookie 要配置 httpOnly/secure/sameSite。",
      "IndexedDB 适合大量结构化数据。",
    ],
  },
  {
    category: "浏览器运行时",
    question: "XSS、CSRF 和 CORS 分别是什么？",
    answer:
      "XSS 是恶意脚本注入并在用户页面执行；CSRF 是诱导用户浏览器带着登录态请求目标站点；CORS 是浏览器的跨域资源访问控制机制。三者不是一类问题：XSS 是脚本注入，CSRF 是跨站请求伪造，CORS 是浏览器安全策略。",
    deepDive:
      "防 XSS 要做输出编码、sanitize、CSP，避免直接信任 HTML；防 CSRF 要用 SameSite Cookie、CSRF token、双重提交、检查 Origin/Referer；CORS 要精确配置 origin、credentials、methods，不要生产环境随意 `*`。",
    talkingPoints: [
      "XSS 解决脚本注入。",
      "CSRF 解决跨站借用登录态。",
      "CORS 是浏览器限制跨域读响应，不是服务端鉴权。",
    ],
  },
  {
    category: "手写题",
    question: "如何手写 bind、new、Promise 并发控制？",
    answer:
      "这类手写题考的不是背代码，而是语言机制理解。bind 要处理 this、预置参数和 new 调用；new 要处理原型和构造函数返回对象；并发控制要维护任务队列、运行中数量、结果顺序和错误处理。",
    deepDive:
      "高级面试里，手写题通常会继续追问边界条件：bind 后还能 new 吗？Promise.all 如何保持顺序？并发控制遇到 reject 是否继续？超时和重试如何组合？所以实现时要主动说明取舍。",
    talkingPoints: [
      "手写题要讲清楚边界。",
      "Promise 结果顺序和完成顺序不是一回事。",
      "并发控制本质是调度器。",
    ],
  },
  {
    category: "手写题",
    question: "深拷贝为什么复杂？JSON 方案有什么问题？",
    answer:
      "深拷贝复杂是因为 JS 数据类型和引用关系复杂。JSON 序列化会丢失 undefined、Symbol、函数、Date、RegExp、Map、Set、循环引用、原型和不可枚举属性。工程上要根据需求选择拷贝深度和支持范围，而不是追求万能 deepClone。",
    deepDive:
      "结构化克隆 `structuredClone` 已经覆盖很多场景，但仍不适合函数、DOM 节点等。手写 deepClone 时至少要处理循环引用、数组、对象、Date，进阶再考虑 Map、Set、RegExp、descriptor 和 prototype。",
    talkingPoints: ["JSON 深拷贝会丢类型。", "循环引用需要 WeakMap。", "工程上要明确支持范围。"],
  },
  {
    category: "手写题",
    question: "如何实现 retry、timeout、race、allSettled、any？",
    answer:
      "这些题都围绕 Promise 组合。retry 是失败后按次数重新执行任务；timeout 是用一个定时 reject 的 Promise 和原任务竞争；race 谁先 settle 就采用谁；allSettled 等所有任务 settle 并保留成功/失败结果；any 任意一个成功就成功，全部失败才失败。",
    deepDive:
      "面试时要强调：传给 retry 的应该是函数而不是已创建的 Promise，否则无法重新发起；timeout 要清理 timer；allSettled 不应该短路；any 失败时应返回 AggregateError。",
    talkingPoints: [
      "retry 接收 task factory。",
      "timeout 要释放 timer。",
      "allSettled 不短路，any 成功短路。",
    ],
  },
];
