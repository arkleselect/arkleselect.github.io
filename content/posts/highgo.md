---
title: 翰高数据库
description: Mac同局域网连接centos7虚拟机中翰高数据库
date: 2026-01-27
---

### 1. 编辑网络编辑器

虚拟机改成桥接/Net模式

```shell
# 
ip a
```

看同局域网物理机是否能ping通

### 2. 开放 5866 端口

虚拟机开放防火墙翰高数据库的端口

```shell
sudo firewall-cmd --zone=public --add-port=5866/tcp --permanent
sudo firewall-cmd --reload
```

### 3. 修改数据库配置

先找到翰高数据库配置文件

`find / -name postgresql.conf 2>/dev/null`

然后编辑conf配置文件，将监听本地改为`*`，然后添加端口5866

在pg_hba.conf末尾添加一行代码

```
host      all      all      0.0.0.0/0      md5
```

### 4. 重启数据库

找到服务

```vim
[root@localhost data]# systemctl list-units --type=service | grep -E "hgdb|highgo"
hgdb-4.5.service                   loaded active running hgdb
```

### 5. 测试连接

```vim
mortysmith@Mortys-MacBook-Air ~ % nc -zv 192.168.50.173 5866
Connection to 192.168.50.173 port 5866 [tcp/*] succeeded!
```
