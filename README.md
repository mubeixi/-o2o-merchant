## 二开说明

### 项目运行方式
1.安装node和npm  
2.安装请使用[yarn](https://yarn.bootcss.com/)  
3.yarn install  
4.yarn run dev  

### 常见问题

#### 依赖安装失败
需要删除node_modules文件夹，然后重装。  
此外由于本项目使用了scss，墙内安装node-sass会有问题。强烈推荐使用cnpm安装

#### 便捷上线
根目录下提供了test.js和push.js，基于shelljs提供自动拉取最新代码、编译打包、上传（ftp/git）的脚本范本。
方便快速上线（如果用git提交需要自己配置hwebhook)



