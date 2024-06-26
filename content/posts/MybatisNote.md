---
title: "MybatisNote"
date: 2024-06-24T20:26:50+08:00
Description:
tags: []
draft: false
---
# 简介

> MyBatis是一款优秀的持久层框架，使用Mybatis可以轻松的实现Java程序向数据库发送SQL语句
>
> 而且对于SQL查询回来的结果进行方便的封装

# 使用Mybatis案例

> 目的：使用mybatis技术将一个user对象保存到数据库的user表中

## 创建数据库

```sql
create database mybatis;
use mybatis;

create table user(
    id int unsigned primary key auto_increment comment 'ID',
    name varchar(100) comment '姓名',
    age tinyint unsigned comment '年龄',
    gender tinyint unsigned comment '性别, 1:男, 2:女',
    phone varchar(11) comment '手机号'
) comment '用户表';

insert into user(id, name, age, gender, phone) VALUES (null,'白眉鹰王',55,'1','18800000000');
insert into user(id, name, age, gender, phone) VALUES (null,'金毛狮王',45,'1','18800000001');
insert into user(id, name, age, gender, phone) VALUES (null,'青翼蝠王',38,'1','18800000002');
insert into user(id, name, age, gender, phone) VALUES (null,'紫衫龙王',42,'2','18800000003');
insert into user(id, name, age, gender, phone) VALUES (null,'光明左使',37,'1','18800000004');
insert into user(id, name, age, gender, phone) VALUES (null,'光明右使',48,'1','18800000005');
```



## 更新配置文件

```xml
    <dependencies>
        <!--mysql-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.28</version>
        </dependency>
        <!--mybatis-->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.9</version>
        </dependency>
        <!--junit-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.26</version>
        </dependency>
    </dependencies>
```

## 创建User类

> main/java/com/itheima/domain/User

```java
package com.itheima.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    // 实体类属性务必使用包装类型
    private Integer id;

    private String name;
    private Integer age;
    private Integer gender;
    private String phone;

}
```

## 创建Mapper接口

> main/java/com/itheima/domain/UserMapper

```java
package com.itheima.mapper;

import com.itheima.domain.User;
import org.apache.ibatis.annotations.Insert;
// 接口
public interface UserMapper {

    // 方法：注解 sql
    // #{}表示占位符号，里面内容跟参数类型有关系，
    // 1. 如果参数是一个实体对象，#{}里面写的是对象中的属性名

    @Insert("insert into user values(null,#{name},#{age},#{gender},#{phone})")
    void save(User user);
}
```

## 创建User测试类

> test/java/com/itheima/test/UserMapperTest

```java
package com.itheima.test;

import com.itheima.domain.User;
import com.itheima.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

public class UserMapperTest {
    // 测试新增
    @Test
    public void testSave() throws IOException {
        // 1. 提前准备好要保存的对象
        User user = new User();
        user.setName("贾维斯");
        user.setAge(66);
        user.setGender(1);
        user.setPhone("12312312345");

        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.save(user);

        //保存之后,打印出user中得id
        System.out.println(user);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }
}
```

## 创建配置文件

> 配置文件中的主要用于声明数据库信息和接口位置
>
> main/resources/SqlMapConfig.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <settings>
        <!--在控制台输出发送的sql日志-->
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>

    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>

            <!--目前只关注这部分内容,它的作用就是声明要连接的数据信息-->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis"/>
                <property name="username" value="root"/>
                <property name="password" value="Grh474593"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <!--声明含有sql的接口所在包-->
        <package name="com.itheima.mapper"/>
    </mappers>
</configuration>
```

## 测试

```java
package com.itheima.test;

import com.itheima.domain.User;
import com.itheima.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

public class UserMapperTest {
    // 测试新增
    @Test
    public void testSave() throws IOException {
        // 1. 提前准备好要保存的对象
        User user = new User();
        user.setName("贾维斯");
        user.setAge(66);
        user.setGender(1);
        user.setPhone("12312312345");

        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.save(user);

        //保存之后,打印出user中得id
        System.out.println(user);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }
}
```



# Mybatis实现增删改

增加数据

```java
   // 接口
public interface UserMapper {
	@Options(useGeneratedKeys = true,keyProperty = "age")
    @Insert("insert into user values(null,#{name},#{age},#{gender},#{phone})")
    void save(User user);
}
public class UserMapperTest {
    // 测试新增
    @Test
    public void testSave() throws IOException {
        // 1. 提前准备好要保存的对象
        User user = new User();
        user.setName("绿巨人");
        user.setAge(99);
        user.setGender(1);
        user.setPhone("13513212345");

        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.save(user);

        //保存之后,打印出user中得id
        System.out.println(user);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }
```

修改数据

```java
// 接口
public interface UserMapper {
        @Update("update user set name = #{name},age = #{age},gender = #{gender},phone = #{phone} where id = #{id}")
    void update(User user);
}

// 测试修改
    @Test
    public void testUpdate() throws IOException {
        // 1. 提前准备好要保存的对象
        User user = new User();
        user.setName("张三风");
        user.setAge(100);
        user.setGender(1);
        user.setPhone("13333212345");
        user.setId(1);

        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.update(user);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }
```

删除数据

```java
public interface UserMapper {
        @Delete("delete from user where id = #{id}")
    void deleteById(Integer id);
}

// 测试删除
    @Test
    public void testDeleteById() throws IOException {
        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.deleteById(1);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }
```

总的

> UserMapper.java

```java
package com.itheima.mapper;

import com.itheima.domain.User;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Update;

// 接口
public interface UserMapper {

    // 方法：注解 sql
    // #{}表示占位符号，里面内容跟参数类型有关系，
    // 1. 如果参数是一个实体对象，#{}里面写的是对象中的属性名

    // 主键返回
    // useGeneratedKeys = true 告诉mybatis，接下来要使用生成好的主键了，需要你给我查回来
    // keyProperty = "id" 只当mybatis返回来的主键需要保存到参数对象的哪个属性上
    @Options(useGeneratedKeys = true,keyProperty = "age")
    @Insert("insert into user values(null,#{name},#{age},#{gender},#{phone})")
    void save(User user);

    // 修改 按照id修改其他项
    // 表中字段名 = #{类中的属性名}
    @Update("update user set name = #{name},age = #{age},gender = #{gender},phone = #{phone} where id = #{id}")
    void update(User user);


    // #{}表示占位符号，里面内容跟参数类型有关系，
    // 1. 如果参数是一个实体对象，#{}里面写的是对象中的属性名
    // 2. 如果参数是一个简单类型参数(8中基本类型 + 8中包装类型 + String类型,${}可以随便写)，但是不能空着,推荐使用方法参数名

    // 删除 根据id删除
    @Delete("delete from user where id = #{id}")
    void deleteById(Integer id);

    // 小结:
    // 1. 在Mapper接口中添加新的方法，并且在方法上使用注解编写sql
    // 2. 在测试类中进行对应方法的测试
}
```

> UserMapperTest.java

```java
package com.itheima.test;

import com.itheima.domain.User;
import com.itheima.mapper.UserMapper;
import com.itheima.util.MybatisUtil;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

public class UserMapperTest {
    // 测试新增
    @Test
    public void testSave() throws IOException {
        // 1. 提前准备好要保存的对象
        User user = new User();
        user.setName("绿巨人");
        user.setAge(99);
        user.setGender(1);
        user.setPhone("13513212345");

        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.save(user);

        //保存之后,打印出user中得id
        System.out.println(user);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }

    // 测试新增（使用工具类简化版）
    @Test
    public void testSaveSimple() throws IOException {
        // 1. 提前准备好要保存的对象
        User user = new User();
        user.setName("绿巨人");
        user.setAge(99);
        user.setGender(1);
        user.setPhone("13513212345");

        SqlSession sqlSession = MybatisUtil.getsqlSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.save(user);

        //保存之后,打印出user中得id
        System.out.println(user);

        MybatisUtil.close(sqlSession);
    }


    // 测试修改
    @Test
    public void testUpdate() throws IOException {
        // 1. 提前准备好要保存的对象
        User user = new User();
        user.setName("张三风");
        user.setAge(100);
        user.setGender(1);
        user.setPhone("13333212345");
        user.setId(1);

        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.update(user);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }


    // 测试删除
    @Test
    public void testDeleteById() throws IOException {
        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.deleteById(1);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }
}
```



**工具类** 

> com/itheima/util/MybatisUtil.java

```java
package com.itheima.test;

import com.itheima.domain.User;
import com.itheima.mapper.UserMapper;
import com.itheima.util.MybatisUtil;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

public class UserMapperTest {
    // 测试新增
    @Test
    public void testSave() throws IOException {
        // 1. 提前准备好要保存的对象
        User user = new User();
        user.setName("绿巨人");
        user.setAge(99);
        user.setGender(1);
        user.setPhone("13513212345");

        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.save(user);

        //保存之后,打印出user中得id
        System.out.println(user);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }

    // 测试修改
    @Test
    public void testUpdate() throws IOException {
        // 1. 提前准备好要保存的对象
        User user = new User();
        user.setName("张三风");
        user.setAge(100);
        user.setGender(1);
        user.setPhone("13333212345");
        user.setId(1);

        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.update(user);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }


    // 测试删除
    @Test
    public void testDeleteById() throws IOException {
        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.deleteById(1);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }
}
```



# 抽取工具类（扩展）

**重复代码** 

```java
package com.itheima.test;

import com.itheima.domain.User;
import com.itheima.mapper.UserMapper;
import com.itheima.util.MybatisUtil;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

public class UserMapperTest {
    // 测试新增
    @Test
    public void testSave() throws IOException {
        // 1. 提前准备好要保存的对象
        User user = new User();
        user.setName("绿巨人");
        user.setAge(99);
        user.setGender(1);
        user.setPhone("13513212345");

        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.save(user);

        //保存之后,打印出user中得id
        System.out.println(user);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }

    // 测试修改
    @Test
    public void testUpdate() throws IOException {
        // 1. 提前准备好要保存的对象
        User user = new User();
        user.setName("张三风");
        user.setAge(100);
        user.setGender(1);
        user.setPhone("13333212345");
        user.setId(1);

        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.update(user);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }


    // 测试删除
    @Test
    public void testDeleteById() throws IOException {
        // 2. 使用mybatis提供的api根据UserMapper接口创建对象
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        //2-4 获取UserMapper对象,调用方法
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        userMapper.deleteById(1);

        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }
}
```

**提取工具类** 

```java
package com.itheima.util;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class MybatisUtil {

    // 获取sqlsession
    public static SqlSession getsqlSession() throws IOException {
        //2-1 读取配置文件,读成一个输入流
        InputStream inputStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        //2-2 创建SqlSessionFactory对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2-3 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        return sqlSession;
    }

    // 提交事务 释放资源
    public static void close(SqlSession sqlSession){
        //2-5 提交事务
        sqlSession.commit();

        //2-6 释放资源
        sqlSession.close();
    }
}
```

# #和$的区别(面试题)

> 区别

- #{}表示占位符，可以防止SQL注入问题，同类型的SQL只编译以此

- $表示字符串拼接,使用它存在SQL注入问题，每次SQL都会重新编译



# Mybatis查询

## 环境准备

```sql
-- 员工管理
create table emp (
  id int unsigned primary key auto_increment comment 'ID',
  username varchar(20) not null unique comment '用户名',
  password varchar(32) default '123456' comment '密码',
  name varchar(10) not null comment '姓名',
  gender tinyint unsigned not null comment '性别, 说明: 1 男, 2 女',
  image varchar(300) comment '图像',
  job tinyint unsigned comment '职位, 说明: 1 班主任,2 讲师, 3 学工主管, 4 教研主管, 5 咨询师',
  entrydate date comment '入职时间',
  dept_id int unsigned comment '部门ID',
  create_time datetime not null comment '创建时间',
  update_time datetime not null comment '修改时间'
) comment '员工表';

INSERT INTO emp
	(id, username, password, name, gender, image, job, entrydate,dept_id, create_time, update_time) VALUES
	(1,'jinyong','123456','金庸',1,'1.jpg',4,'2000-01-01',2,now(),now()),
	(2,'zhangwuji','123456','张无忌',1,'2.jpg',2,'2015-01-01',2,now(),now()),
	(3,'yangxiao','123456','杨逍',1,'3.jpg',2,'2008-05-01',2,now(),now()),
	(4,'weiyixiao','123456','韦一笑',1,'4.jpg',2,'2007-01-01',2,now(),now()),
	(5,'changyuchun','123456','常遇春',1,'5.jpg',2,'2012-12-05',2,now(),now()),
	(6,'xiaozhao','123456','小昭',2,'6.jpg',3,'2013-09-05',1,now(),now()),
	(7,'jixiaofu','123456','纪晓芙',2,'7.jpg',1,'2005-08-01',1,now(),now()),
	(8,'zhouzhiruo','123456','周芷若',2,'8.jpg',1,'2014-11-09',1,now(),now()),
	(9,'dingminjun','123456','丁敏君',2,'9.jpg',1,'2011-03-11',1,now(),now()),
	(10,'zhaomin','123456','赵敏',2,'10.jpg',1,'2013-09-05',1,now(),now()),
	(11,'luzhangke','123456','鹿杖客',1,'11.jpg',5,'2007-02-01',3,now(),now()),
	(12,'hebiweng','123456','鹤笔翁',1,'12.jpg',5,'2008-08-18',3,now(),now()),
	(13,'fangdongbai','123456','方东白',1,'13.jpg',5,'2012-11-01',3,now(),now()),
	(14,'zhangsanfeng','123456','张三丰',1,'14.jpg',2,'2002-08-01',2,now(),now()),
	(15,'yulianzhou','123456','俞莲舟',1,'15.jpg',2,'2011-05-01',2,now(),now()),
	(16,'songyuanqiao','123456','宋远桥',1,'16.jpg',2,'2010-01-01',2,now(),now()),
	(17,'chenyouliang','123456','陈友谅',1,'17.jpg',NULL,'2015-03-21',NULL,now(),now());
```

## 导入工程

> D:\Java_Work\Project\Web\day04-01-mybatis

## 数据封装

> 执行查询SQL是会有结果集返回来的，mybatis会将结果封装到我们指定的实体中
>
> - 实体类属性名 和 数据库查询结果集中名称一致的字段，mybatis会自动封装
>
> - 实体类属性名 和 数据库查询结果集中名称不一致的字段，不能自动封装，需要我们手动处理

### 三种形式

- 开启驼峰命名：字段名与属性名符合驼峰命名规则，mybatis自动通过规则映射

  ```java
  // 开启驼峰命名自动映射，即从数据库字段名 a_column 映射到Java 属性名 aColumn
  <setting name="mapUnderscoreToCamelCase" value="true"/>
  ```

  

- 起别名：在SQL语句中，对不一样的列名起别名，别名和实体类属性名一样

```java
@Select("select id, username, password, name, gender, image, job, entrydate ed, dept_id deptId, create_time createTime, update_time updateTime from emp")
public Emp findAll();
```



- 手动结果映射：通过 @Results及@Result 进行手动结果映射

```java
@Select("select * from emp")
@Results({
		@Result(column = "dept_id", property = "deptId"),       		 		 @Result(column = "entrydate", property = "ed")
})
public Emp findAll();
```



## 驼峰映射

> 当表中字段和类中属性的关系分别是`_和驼峰`写法时，可开启mybatis自动驼峰映射

```xml
<setting name="mapUnderscoreToCamelCase" value="true"/>
```


# 查询案例

## 查询所有

```java
    //查询
    @Select("select * from emp")
    List<Emp> findAll();
    
    //查询所有
    @Test
    public void testFindAll() {
        SqlSession sqlSession = MybatisUtil.getSqlSession();
        EmpMapper empMapper = sqlSession.getMapper(EmpMapper.class);

        List<Emp> empList = empMapper.findAll();
        empList.forEach(e -> System.out.println(e));//lambda方式打印

        MybatisUtil.close(sqlSession);
    }
```

**问题** 

> 实体类属性名 和 数据库查询结果集中名称不一致的字段会得到null



**解决方法** 

- 方法一 ：起别名

> 表中字段和类中属性完全没有关系时，可以使用别名来修改sql返回集中字段的名称

```java
    //查询
    @Select("select id, username, password, name, gender, image, job, entrydate as ed, dept_id, create_time, update_time from emp")
    List<Emp> findAll2();

    //查询所有
    @Test
    public void testFindAll2() {
        SqlSession sqlSession = MybatisUtil.getSqlSession();
        EmpMapper empMapper = sqlSession.getMapper(EmpMapper.class);

        List<Emp> empList = empMapper.findAll2();
        empList.forEach(e -> System.out.println(e));//lambda方式打印

        MybatisUtil.close(sqlSession);
    }
```



- 方法二：自定义映射

> 当表中字段和类中属性完全没有关系时，可以通过`@Results`进行手动结果映射

```java
    //查询
    @Results({//@Results: 自定义结果映射
            @Result(column = "entrydate", property = "ed"),//@Result一条映射规则 (column = "数据表中字段名", property = "实体类属性名")
            @Result(column = "dept_id", property = "deptId")
    })
    @Select("select * from emp")
    List<Emp> findAll3();
    
        //查询所有
    @Test
    public void testFindAll3() {
        SqlSession sqlSession = MybatisUtil.getSqlSession();
        EmpMapper empMapper = sqlSession.getMapper(EmpMapper.class);

        List<Emp> empList = empMapper.findAll3();
        empList.forEach(e -> System.out.println(e));//lambda方式打印

        MybatisUtil.close(sqlSession);
    }
```





## 条件查询

> 当查询方法出现多个查询条件时，需要使用@Param注解设置对应关系

```java
	//#{} 里面的内容
    //1. 如果参数是一个对象类型, #{}写的是对象中的属性名
    //2. 如果参数是一个简单类型(8基本 + 8包装 +String) ,#{}可以随便写, 但是推荐写方法形参名
    //3. 如果参数是多个简单类型的参数, #{}中写的是@Param注解中的值
    //条件查询
    @Select("select * from emp where name = #{name} and gender = #{gender} and entrydate between #{begin} and #{end}")
    List<Emp> findList(@Param("name") String name, @Param("gender") Short gender, @Param("begin") LocalDate begin, @Param("end") LocalDate end);
    
        //条件查询
    @Test
    public void testFindList() {
        SqlSession sqlSession = MybatisUtil.getSqlSession();
        EmpMapper empMapper = sqlSession.getMapper(EmpMapper.class);

        List<Emp> empList = empMapper.findList("张三丰", (short) 1, LocalDate.of(2002, 01, 01), LocalDate.of(2023, 12, 31));
        empList.forEach(e -> System.out.println(e));//lambda方式打印

        MybatisUtil.close(sqlSession);
    }
```

## 模糊查询

```java
    // 模糊查询
    // 这里不能直接用name like '%${name}%' 你会有Sql注入问题
    @Select("select * from emp where name like concat('%',#{name},'%') and gender = #{gender} and entrydate between #{begin} and #{end}")
    List<Emp> findListLike(@Param("name") String name, @Param("gender") Short gender, @Param("begin") LocalDate begin, @Param("end") LocalDate end);
```

```java
//模糊查询
    @Test
    public void testFindListLike() {
        SqlSession sqlSession = MybatisUtil.getSqlSession();
        EmpMapper empMapper = sqlSession.getMapper(EmpMapper.class);

        List<Emp> empList = empMapper.findListLike("张", (short) 1, LocalDate.of(2002, 01, 01), LocalDate.of(2023, 12, 31));
        empList.forEach(e -> System.out.println(e));//lambda方式打印

        MybatisUtil.close(sqlSession);
    }
```



- mybatis什么情况下会自动封装返回结果到实体类

​	当数据库返回的结果集中的字段名跟实体类中属性名称对应的时候，自动封装当字段名跟实体类中属性名称出现不对应的时候，不对应的字段无法封装

- 无法自动封装的时候，应该如何处理？


​	1）开启驼峰映射，开启驼峰映射，可以完成满足驼峰转换字段的赋值

​	2）在写sql的时候给字段起别名，让别名跟实体类属性名称对应

​	3）使用mybatis提供的@Results注解手动完成封装



# XML写SQL

## **映射文件定义规范** 

- XML文件的名称与Mapper接口名称一致，并且放置在相同包下（$\textcolor{red}{同包同名} $​ ）
- XML映射文件的namespace属性为Mapper接口全限定名一致
- XML映射文件中sql语句的id与Mapper 接口中的方法名一致，并保持返回类型一致



> 图有一个面试题，因为是根据XML映射文件中的id找方法，所以在EmpMapper中方法不能重载

测试

接口

```java
//注意: 对于同一个方法,使用xml写sql的话,就不能在使用注解写sql了
//@Select("select * from emp where id = #{id}")
Emp findById(Integer id);
```

XML配置文件

```java
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.itheima.mapper.EmpMapper">
    
    <select id="findById" resultType="com.itheima.domain.Emp">
        select * from emp where id = #{id}
    </select>
</mapper>
```

测试

```java
//根据id查询
@Test
public void testFindById() {
    SqlSession sqlSession = MybatisUtil.getSqlSession();
    EmpMapper empMapper = sqlSession.getMapper(EmpMapper.class);

    Emp emp = empMapper.findById(1);
    System.out.println(emp);

    MybatisUtil.close(sqlSession);
}
```


# 动态SQL

## if  where

if：

- 使用test确定条件，只有条件结果为true，if包起来的语句才生效
- 对应日期 数值类型，我们只需要跟null比对，但是如果是字符串类型，还需要跟''比较

where：

- 只有当where子句中至少有一个条件成立的时候，才会给我们添加where关键字
- 他会自动去除where后面紧跟着的第一个and或者or关键字

```xml
<select id="findByCondition3" resultType="com.itheima.domain.Emp">
        select * from emp
        <where>
            <if test="name != null and name != ''">
                name like concat('%',#{name},'%')
            </if>
            <if test="gender != null">
                and gender = #{gender})
            </if>
            <if test="begin != null and end != null">
                and entrydate between #{begin} and #{end}
            </if>
        </where>
    </select>
```

```java
List<Emp> findByCondition3(@Param("name") String name, @Param("gender") Short gender,
                               @Param("begin") LocalDate begin, @Param("end") LocalDate end);
```

```java
@Test
    public void testFindByCondition3() {
        SqlSession sqlSession = MybatisUtil.getSqlSession();
        EmpMapper empMapper = sqlSession.getMapper(EmpMapper.class);

        List<Emp> empList = empMapper.findList("张三丰", null, LocalDate.of(2002, 01, 01), LocalDate.of(2023, 12, 31));
        empList.forEach(e -> System.out.println(e));//lambda方式打印

        MybatisUtil.close(sqlSession);
    }
```

## if  set

set：

- set代码块中必须至少有一个条件是成立的
- set去除代码块中最后一个,(逗号)，并且添加一个set关键字

```xml
<update id="update">
        update emp
        <set>
            <if test="username != null and username != ''">
                username = #{username},
            </if>
            <if test="password != null and password != ''">
                password = #{password},
            </if>
            <if test="name != null and name != ''">
                name = #{name},
            </if>
            <if test="gender != null">
                gender = #{gender},
            </if>
            <if test="image != null and image != ''">
                image = #{image},
            </if>
            <if test="job != null">
                job = #{job},
            </if>
            <if test="ed != null">
                entrydate = #{ed},
            </if>
            <if test="deptId != null">
                dept_id = #{deptId},
            </if>
            <if test="createTime != null">
                create_time = #{createTime},
            </if>
            <if test="updateTime != null">
                update_time = #{updateTime},
            </if>
        </set>
            where id = #{id}
    </update>
```

## if-foreach

foreach：

- collection = "变量的集合"，必须跟方法中参数部分使用@Param指定的值
- item = "临时变量" 必须跟#{}里面保持一致
- 





- ```
   
  
  separator = "分隔符"
  open = "开始符"
  close = "结束符"
  ```



## 抽取公共sql

原来代码

```xml
	<select id="findById" resultType="com.itheima.domain.Emp">
        select * from emp where id = #{id}
    </select>

    <select id="findByCondition3" resultType="com.itheima.domain.Emp">
        select * from emp
        <where>
            <if test="name != null and name != ''">
                name like concat('%',#{name},'%')
            </if>
            <if test="gender != null">
                and gender = #{gender})
            </if>
            <if test="begin != null and end != null">
                and entrydate between #{begin} and #{end}
            </if>
        </where>
    </select>
```

抽取后

```xml
    <!--抽取公共sql-->
    <sql id = "selectUser">
        select * from emp
    </sql>

    <select id="findById" resultType="com.itheima.domain.Emp">
        <include refid="selectUser"/>where id = #{id}
    </select>

    <select id="findByCondition3" resultType="com.itheima.domain.Emp">
        <include refid="selectUser"/>
        <where>
            <if test="name != null and name != ''">
                name like concat('%',#{name},'%')
            </if>
            <if test="gender != null">
                and gender = #{gender})
            </if>
            <if test="begin != null and end != null">
                and entrydate between #{begin} and #{end}
            </if>
        </where>
    </select>
```