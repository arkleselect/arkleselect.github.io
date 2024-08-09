---
date: 2024-08-09 22:27:14
layout: post
title: "Java进阶(一)"
subtitle: ""
description: ""
image: https://raw.githubusercontent.com/arkleselect/blog/main/img/%E3%80%90%E7%B2%89%E7%BA%A2%E8%89%B2%E7%9A%84%E5%A4%B4%E5%8F%91%E3%80%912024-08-06%2012_59_11.png
optimized_image: https://raw.githubusercontent.com/arkleselect/blog/main/img/%E3%80%90%E7%B2%89%E7%BA%A2%E8%89%B2%E7%9A%84%E5%A4%B4%E5%8F%91%E3%80%912024-08-06%2012_59_11.png
category: 笔记
tags:
author: wpprqi
---
## Static
Static是一个静态关键字，可以修饰成员变量，成员方法
修饰成员变量<br>
有static修饰的成员变量，在此类中只有一份，它可以被该类的所有对象共享，推荐的写法是：`类名.类变量`<br>
没有static修饰的成员变量那就是实例变量，它属于对象，并且每个对象都有一份，使用的方法是：`对象.实例变量`<br>
修饰成员方法<br>
有static修饰的成员方法就是类方法，或者说是静态方法，属于类，推荐的写法是：`类名.类方法`
	没有static修饰的成员方法就是实例方法，属于对象，写法是`对象.实例方法`
应用<br>
	类方法应用的场景一般是工具类，比如我在另一个方法中需要反复用到一个方法生成两个随机数并且让这两个随机数相加，那么可以写一个工具类，用的时候可以直接调取这个工具类来实现，这样就避免了反复写代码。
## 代码块
静态代码块，在类中使用static包裹，会随着类的加载执行一次，一般用来初始化类变量
实例代码块，用{}包括，每次创建对象都会执行，并且会在构造器之前执行，用来初始化实例变量
局部代码块，在方法内执行
## 设计模式
### 目的
设计模式主要是为了放程序具更好的复用性（避免重复写相同的代码）、可读性（规范编程，利于维护）、可扩展性（方便后期增加需求）、可靠性（追加需求后，对原有功能并不影响）、设计模式的精髓在于可以让程序呈现高内聚，低耦合的特性、在开发中非常重要。
### 单例设计模式
单例设计模式是一种创建型设计模式，可以保证一个类中只有一个实例，并且可以提供一个可访问该实例的全局节点
因为它同时解决了两个问题，所以违反了[单一职责原则]( "[单一职责原则 - aoguren - 博客园 (cnblogs.com)](https://www.cnblogs.com/aoguren/p/5468770.html)")
譬如，如果创建了一个对象，过了一会又想再创建一个刚才的对象，正常来讲创建的两个对象会拥有两个地址，而单例设计模式不管你创建多少次对象，得到的对象都是同一个。

![Pasted image 20240809195032.png](https://vip.helloimg.com/i/2024/08/09/66b6093748804.png)

所有的单例设计实现都有着两个相同的步骤
- 将构造函数设为私有，防止其他对象new一个新对象
- 新建一个静态构建方法作为构造函数，该函数会 “偷偷” 调用私有构造函数来创建对象， 并将其保存在一个静态成员变量中。 此后所有对于该函数的调用都将返回这一缓存对象。

## 举例
政府是单例模式的一个很好的示例。 一个国家只有一个官方政府。 不管组成政府的每个人的身份是什么， ​ “某政府” 这一称谓总是鉴别那些掌权者的全局访问节点。

<br>

参考来源：
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[设计模式——七大原则 - Java程序员进阶 - 博客园 (cnblogs.com)](https://www.cnblogs.com/zhengzhaoxiang/p/13977057.html#autoid-0-5-0)
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[单例设计模式 (refactoringguru.cn)](https://refactoringguru.cn/design-patterns/singleton)

