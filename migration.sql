-- Cloudflare D1 数据迁移脚本
-- 生成时间: 2/7/2026, 2:51:32 AM

-- 【说明】请分块复制以下 SQL 到 Cloudflare D1 Console 运行，以免超出系统限制。

-- ==========================================
-- 第一部分: 博文数据 (Posts)
-- ==========================================
INSERT OR REPLACE INTO posts (slug, title, date, description, content) VALUES ('20240903', 'Hugo博客添加评论系统 | utterances', '2024-09-03', '使用utterances为自己的博客添加评论系统', '
参考官方文档:[**utterances**](https://utteranc.es/)

### 1. 创建一个存储评论系统的仓库

先创建一个仓库，一定要是公开的，比如我的是comments
### 2. 授权评论系统

点击链接，选择你刚才创建的仓库。

### 3. 在hugo主题中新建一个模块comments
路径：themes/mytheme/layouts/partials/comments.html，粘贴代码
```html
<div>    
    <div class="pagination__title">
        <span class="pagination__title-h" style="font-size: 20px;">评论</span>
        <br/>
    </div>
    <div id="tcomment"></div>
    <script src="https://utteranc.es/client.js"
            repo="你的github用户名/你创建的仓库名" 
            issue-term="title"
            theme="github-light"
            crossorigin="anonymous"
            async>
    </script>
</div>
```
修改repo="你的github用户名/你创建的仓库名" ，例如我的repo="arkleselect/comments" 
然后在你的hugo中控制文章页面的代码中引用comments
我的是在single.html
```html
 {{ partial "comments.html" . }}
```
![](https://raw.githubusercontent.com/arkleselect/blog/main/img/1725365699072.jpg)
### 4. 修改配置文件
在hugo的根目录配置文件中添加参数
💡注意不是主题文件夹的配置文件
如果配置文件是yaml结尾的文件（config.yaml）则粘贴如下代码
```yaml
utteranc:
    enable: true
    repo: "你的GitHub用户名/你创建的仓库名" 
    issueTerm: "title"
    theme: "github-light"  

```
修改repo: "你的GitHub用户名/你创建的仓库名" ，例如我的repo="arkleselect/comments" 
如果你是toml结尾的文件（hugo.toml），选择这个
```toml
[params.utterances] 
    enable = true
    repo: "你的GitHub用户名/你创建的仓库名" 
    issueTerm = "title"
    theme = "github-light"
```
参考
https://www.shaohanyun.top/posts/env/hugo_comments/
~
');
INSERT OR REPLACE INTO posts (slug, title, date, description, content) VALUES ('260206', 'Minimal Load', '2026-02-06', '关于新主题', '## 前面

起因是刷X的时候看到了Warp，想着试一下怎么样，正好想试一下在收藏夹里吃灰很久的 <https://reactbits.dev/> 组件库，当时刷这个的时候一眼就相中了这个背景，非常喜欢这个酷酷的特效，然后就扔个了Warp让他根据这个组件来给我做一个首页，然后只有这个又感觉太简单了，干脆就让他在生成五六个符合这个风格的小组件，没想到意外的切合！完了感觉有了动力，就直接把我之前的网站扔给了他让他把内容移过来，结果也是在意料之中，自己又改了改，缝缝补补

这个“合集”页面是最难弄的，当时想破脑汁也不知道怎么改，他老是给我生成方方正正的，要不就是直接用的shadcn的组件，毫无风格，最终我还是选择了最简单的

一开始合集后面是“分类”页面，因为是之前的网站挪过来的，所以改完了合集下一个又改分类，这个折腾了好久，最终放弃了，然后突然想到了一个点子，直接把分类改成一个图标不就好了，然后这个图标点一下还可以做一个交互，于是就按照这个思路打开了小红书，搜索”酷酷的Icon“哈哈哈哈哈哈哈哈，一开始选了五六个，然后用贴图一个一个放过去看了一下，还是最后这个留下来的最顺眼，起初我是想弄一个X的图标的，我都想好了风格了，但是词穷给AI表达不出来，刷小红书又找不到，所以放弃了，完了现在再看这个突然就越看越顺眼，我还是比较相信我的审美的🤩

日常页面也是让AI根据风格生成的，改了四五版，脑子里也没想法，最终没招了就用这个吧
关于呢开始我是想弄一个“时间轴”的，但是看起来一点也不顺眼，干脆砍了，又双叒叕让AI给我弄了一下，哎这次居然还行，正好reactbits组件库也有一个我想弄得滚动logo，放到这里刚刚好毫无违和感。

虽然没有服务器，通过AI知道了可以通过GitHub Page + Cloudflare来弄，Cloudflare来转发，那这样我不用买服务器，直接买个域名不就好了，于是开始想域名，给了AI一个慵懒的关键词，又要有机械感，最终从20个域名里选了这个minimalload

后面还会考虑弄一个照片墙，很喜欢ins的那种，抽空给团团弄一个嘻嘻
');
INSERT OR REPLACE INTO posts (slug, title, date, description, content) VALUES ('AISadTalker', 'AI数字人SadTalker', '2025-07-21', '微软开源模型，一张照片就可以自动对嘴型，让图片使用你定制的声音讲话', '
## 第一步：环境准备

### 1.1 安装 Anaconda

如果你还没装，可以从官网安装：https://www.anaconda.com/

### 1.2 创建虚拟环境

```bash
conda create -n sadtalker python=3.10 -y
conda activate sadtalker
```

---

## 第二步：安装 Edge-TTS

### 2.1 安装 edge-tts

```bash
pip install edge-tts
```

### 2.2 文本合成为语音 WAV

```bash
edge-tts --text "你好，欢迎来到数字人世界！" --voice zh-CN-XiaoxiaoNeural > output.wav
```

💡 **常见语音名称**：

- 中文女声：`zh-CN-XiaoxiaoNeural`
- 中文男声：`zh-CN-YunxiNeural`
- 英文女声：`en-US-JennyNeural`
- 英文男声：`en-US-GuyNeural`

---

## 第三步：安装PyTorch

### 3.1 查看电脑配置

```bash
C:\Users\wa1yb>nvidia-smi
Wed Jul 16 13:50:51 2025
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 576.80                 Driver Version: 576.80         CUDA Version: 12.9     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                  Driver-Model | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 3080      WDDM  |   00000000:01:00.0  On |                  N/A |
|  0%   54C    P8             23W /  340W |     665MiB /  10240MiB |      3%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A            1660    C+G   ...4__8wekyb3d8bbwe\Video.UI.exe      N/A      |
|    0   N/A  N/A            2144      C   ...al\Programs\Ollama\ollama.exe      N/A      |
|    0   N/A  N/A           10884    C+G   ...Brains\jbr\bin\cef_server.exe      N/A      |
|    0   N/A  N/A           11020    C+G   C:\Windows\explorer.exe               N/A      |
|    0   N/A  N/A           12284    C+G   ...Chrome\Application\chrome.exe      N/A      |
|    0   N/A  N/A           13224    C+G   ...h_cw5n1h2txyewy\SearchApp.exe      N/A      |
|    0   N/A  N/A           13348    C+G   ...Chrome\Application\chrome.exe      N/A      |
|    0   N/A  N/A           13616    C+G   ...ogram Files\ToDesk\ToDesk.exe      N/A      |
|    0   N/A  N/A           13856    C+G   ...ntrolPanel\SystemSettings.exe      N/A      |
|    0   N/A  N/A           14472    C+G   ...h_cw5n1h2txyewy\SearchApp.exe      N/A      |
|    0   N/A  N/A           14496    C+G   ...App_cw5n1h2txyewy\LockApp.exe      N/A      |
|    0   N/A  N/A           16168    C+G   ...crosoft\OneDrive\OneDrive.exe      N/A      |
|    0   N/A  N/A           16172    C+G   ...5n1h2txyewy\TextInputHost.exe      N/A      |
|    0   N/A  N/A           16472    C+G   ...xyewy\ShellExperienceHost.exe      N/A      |
|    0   N/A  N/A           18128    C+G   ...10.6_32bit_Green\Snipaste.exe      N/A      |
|    0   N/A  N/A           18716    C+G   ...de\Microsoft VS Code\Code.exe      N/A      |
|    0   N/A  N/A           21488    C+G   ....0.3351.83\msedgewebview2.exe      N/A      |
+-----------------------------------------------------------------------------------------+
```

从官方中找到适合自己电脑配置的下载命令

[PyTorch Foundation](https://pytorch.org/)

### 3.2 运行代码

```bash
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

## 第四步：安装 SadTalker

### 4.1 克隆项目

```bash
git clone https://github.com/OpenTalker/SadTalker.git
cd SadTalker
```

### 4.2 安装依赖

```bash
pip install -r requirements.txt
```

💡手动下载兼容python3.10版本的各种包

卸载残留依赖

```bash
pip uninstall basicsr tb-nightly -y
```

无依赖安装

```bash
pip install basicsr==1.4.2 --no-deps
```

还报错先安装这个

```bash
pip install tensorboard
```

### 4.3 下载预训练模型

运行以下脚本（也可手动下载）：

```bash
python scripts/download_models.py
```

如果无法自动下载，手动访问：

https://github.com/OpenTalker/SadTalker#checkpoints

将模型放入：

```
checkpoints/
├── gfpgan
├── hub
├── ...
```

---

## 第五步：准备素材

### 5.1 人脸图像

放一张图片到当前目录，比如命名为 `face.jpg`

建议使用 **正脸、清晰、单人图像**

---

## 第六步：生成数字人视频

### 6.1 命令行运行 SadTalk

```bash
python inference.py --driven_audio examples\driven_audio\shuZhang.wav --source_image examples\source_image\shuZhang.png --result_dir results --enhancer gfpgan --preprocess resize
```

运行完成后，视频会保存在 `./results` 目录下。

---

### 💡核心参数说明

| 参数名           | 功能解释（大白话）                                                                                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--driven_audio` | 输入的语音文件，驱动嘴型用的（比如 `.wav`）。                                                                                                                                                                                  |
| `--source_image` | 输入的人脸图片，会让它动起来。                                                                                                                                                                                                 |
| `--result_dir`   | 输出结果保存在哪个文件夹。                                                                                                                                                                                                     |
| `--enhancer`     | 是否美颜增强，可选 `gfpgan`（补全修复脸部） 或 `RestoreFormer`（柔和修复）等。                                                                                                                                                 |
| `--preprocess`   | 输入图像怎么处理，可选项：- `full`: 自动对整图做人脸检测和裁剪（推荐）- `crop`: 你自己裁好图了就用这个- `resize`: 直接按模型输入尺寸缩放（无裁剪）- `extcrop`: 外部手动裁好的图- `extfull`: 外部整图（不裁剪），只 resize 一下 |

### 其他可选参数

| 参数名            | 功能解释                                                             |
| ----------------- | -------------------------------------------------------------------- |
| `--face_enhancer` | 同 `--enhancer`，有些版本用这个名字。                                |
| `--pose_style`    | 表情动作**风格**：`0-47` 数字编号（控制头动方向等风格），默认 0。    |
| `--batch_size`    | 一次处理几张图或几帧（用在视频或大批量处理时）。                     |
| `--fps`           | 输出视频的帧率（默认一般是 25）。                                    |
| `--still`         | 是否保持**头部不动**，只动嘴，适合照片人像（加上这个参数就不动头）。 |
| `--use_ref_video` | 用参考视频提取姿势（比如模仿某人说话时的头部动作）。                 |
| `--ref_info`      | 和 `--use_ref_video` 配合，指定参考视频信息。                        |
| `--size`          | 输出**图像分辨率**，如 `256`、`512`，但需模型支持。                  |
| `--input_yaw`     |
`--input_pitch`
`--input_roll` | 自定义头部角度（左转、抬头、歪头）。 |
| `--expression_scale` | **表情强度**倍率，控制嘴动幅度（默认 1.0）。 |

## 可选：运行 Gradio Web 界面

```bash
python app_sadtalker.py
```

打开浏览器访问：`http://127.0.0.1:7860`

## 常见错误

### 模块名字缺失

环境安装完了运行显示

![image.png](attachment:859bffe4-7f73-40bf-abfc-bb02ace46065:image.png)

找到博客

[深度学习No module named ‘torchvision.transforms.functional_tensor‘问题解决_no module named ''torchvision.transforms-CSDN博客](https://blog.csdn.net/2301_79442295/article/details/142788495)

出现`ModuleNotFoundError: No module named ''torchvision.transforms.functional_tensor''`的原因大概是原先的“名字”改了，但是安装的`basicsr`包中的名字没有改，所以会报错。

只要在`miniconda3/lib/python3.12/site-packages/basicsr/data/degradations.py`文件中第8行将

原`from torchvision.transforms.functional_tensor import rgb_to_grayscale`

改成`from torchvision.transforms._functional_tensor import rgb_to_grayscale`

或者改成`from torchvision.transforms.functional import rgb_to_grayscale`

均能够解决问题。

**三个模型版本**

![image.png](attachment:bb310e20-310b-4920-bab2-824deeba23dd:image.png)

### **fps错误**

![image.png](attachment:43d61c7e-7bfe-4225-851c-f82a098b2876:image.png)

```bash
when I use imageio 2.28.1, get this error, and then use 2.19.3, it''s ok!

pip install imageio==2.19.3
pip install imageio-ffmpeg==0.4.7
```
');
INSERT OR REPLACE INTO posts (slug, title, date, description, content) VALUES ('PaddleTrain', 'Paddle训练模型', '2026-01-26', '使用百度飞浆预训练模型训练手写体OCR识别', '
# 1. 写在前面

模型（推理模型）分为预测模型和识别模型，模型拿到数据需要先使用预测模型将文本框选出来，然后再使用识别模型来识别文本

训练模型总体分为4个步骤：第一步：标注数据，并生成相关配置文件 第二步：训练预测模型 第三步：训练识别模型 第四步：将两个模型导出为推理模型

首先标注数据使用PPOCRLabel，将准备好的图片打开，可以使用自动标注将图片中需要识别的文本标注出来，然后人工修改模型预测错的数据，也可以直接自己框选并写入数据

[PPOCRLabel使用教程](https://www.notion.so/Paddle-21bacaa3402a8080b515ddaa1af48307?pvs=21)

可以从训练曲线中参考到训练模型过程中模型在识别时学习的过程

### 1. 准确率 (Accuracy)

在训练一百轮中，整体表现稳定提升，说明模型学习效果不断增强。

![](https://raw.githubusercontent.com/arkleselect/blog/main/img/Accuracy.jpg)

### 2. 总损失（Loss）

![](https://raw.githubusercontent.com/arkleselect/blog/main/img/Total%20Loss.jpg)

**Loss**：模型在一次前向计算后，所有任务（子损失）误差的加权和。它反映了模型整体预测结果与真实标签之间的差距。

$Total Loss = CTCLoss + NRTRLoss$

第 2 轮约 93，迅速降到第 10 轮 ~17，然后平滑下降到第 50 轮 ~1.7，再到第 100 轮 ~0.85。训练初期收敛最快，中后期趋于平缓。

### 3. CTCLoss

![](https://raw.githubusercontent.com/arkleselect/blog/main/img/CTCLoss.jpg)

**CTCLoss**：它惩罚模型把字符预测到错误的时刻或多余的空白，数值越小说明模型在序列对齐和字符识别上越准确。

从 ~90 降到 ~0.23，第 10–20 轮后就降至个位数，第 40 轮后接近 1，至第 100 轮降至 ~0.23。

是整体 loss 降低的主力。

### 4. 归一化编辑距离 (Norm Edit Distance)

![](https://raw.githubusercontent.com/arkleselect/blog/main/img/Normalized.jpg)

**编辑距离**：衡量预测文本和真实文本在字符层面需要多少次“增删改”操作才能互相转换。

**归一化**：用编辑距离除以真实文本长度，得到一个 0–1 之间的比值。如果值越接近0，表示预测文本与真实文本差异越小，预测的越准确。

第 30+ 轮后即超过 0.90，到第 60 轮接近 0.98，表明预测文本与真实文本高度一致。

### 5. 模型收敛

**收敛** 是训练进入“平稳”阶段，模型已基本学到数据规律，还未出现明显分歧。    

&nbsp;

在训练开始时，损失（Loss）通常会快速下降，准确率迅速上升；当训练到一定轮数后，指标变化变得非常缓慢，曲线趋于平稳，这种状态就叫“收敛”

即模型已经基本学到了数据中的规律，再继续训练改进也会很有限。

训练模型到”收敛“的时候表明训练达到了最佳或接近最佳状态，可以考虑停止训练、保存模型，或者改用更细的学习率再做微调。

如果`epoch_num`（迭代次数）过高，会导致模型过拟合

### 6. 过拟合

**过拟合** 是训练和泛化能力开始脱钩，虽然训练集表现更好，但验证／测试集性能变差，需加以干预。

**过拟合示例：**

- 训练 loss 从 0.5 → 0.2 → 0.1 → 0.05；验证 loss 从 0.6 → 0.3 → 0.25 → 0.35。
- 验证 loss 在第三次迭代后回升，说明模型开始记忆训练集噪声，泛化能力下降。
- 

过拟合会导致什么？

**正常学习**：你看了很多苹果、香蕉、橙子的照片，还是真实的水果。考试时，给你没见过角度的苹果、香蕉、橙子，你都能认出来——这就是「泛化好」，模型没过拟合。

**过拟合**：你只记住了教科书里那几张苹果、香蕉、橙子的照片的每一个细节（比如苹果旁边那片叶子的形状、香蕉背景的光线角度），连截图里边的阴影都背下来了。但考试时给你一张真实市场上卖的苹果照片，因为背景不同、光线不同，你反而认不出这是苹果了。——模型把训练集（教科书图片）记得滚瓜烂熟，却学不到“苹果是圆圆的、有柄、红色或青色”这个本质，就叫过拟合。

过拟合就像死记硬背教科书上的样本，而不是理解背后的规律，结果一遇到新场景就傻眼。

**判定依据**：

- **Loss 曲线趋于平缓**：每个 epoch 的 loss 下降很少。
- **Accuracy / norm_edit_dis 曲线趋于平稳**：指标几乎不再提升。

# 2. 训练步骤

## 2.1 标注数据

ppocrlabel安装位置

```shell
D:\\anaconda3\\envs\\paddle38\\lib\\site-packages
```

安装路径

```shell
C:\\Users\\wa1yb\\.conda\\envs\\paddle39\\Lib\\site-packages\\PPOCRLabel>
```

启动命令

```shell
python PPOCRLabel.py --lang ch
```

**将数据集划分(训练集/验证集/测试集)**

```python
**python gen_ocr_train_val_test.py --trainValTestRatio 6:2:2 –-datasetRootPath ./train_data --detRootPath ./train_data/det --recRootPath ./train_data/rec**
```

参数说明：

- trainValTestRatio 是训练集、验证集、测试集的图像数量划分比例，根据实际情况设定，默认是6:2:2

- datasetRootPath 是PPOCRLabel标注的完整数据集存放路径。默认路径是 …/train_data/
  
  就是步骤6的结果文件夹train_data文件夹。

- detRootPath 是输出训练文字检测的数据集存放路径。默认路径是 …/train_data/det

- recRootPath 是输出训练文字识别的数据集存放路径。默认路径是 …/train_data/rec

## 2.2 训练检测模型

### **2.2.1 修改配置文件**

![](https://raw.githubusercontent.com/arkleselect/blog/main/img/test.png) 

配置文件

```jsx
Global:
  debug: false
  use_gpu: true
  epoch_num: 300 # 迭代次数
  log_smooth_window: 20
  print_batch_step: 10
  save_model_dir: ./output/en_PP-OCRv3_det/
  pretrained_model: ./Temp/myModel/en_PP-OCRv3_det/latest
  save_epoch_step: 5
  eval_batch_step:
  - 0
  - 100  # 验证频率 只在最后评估 让训练连续进行更久
  cal_metric_during_train: false
  checkpoints: null
  save_inference_dir: null
  infer_img: ./Temp/testImage/
  save_res_path: ./checkpoints/det_db/predicts_db.txt
  distributed: true
  d2s_train_image_shape: [3, -1, -1]
  amp_dtype: bfloat16
#  amp_dtype: float16

Architecture:
  name: DistillationModel
  algorithm: Distillation
  model_type: det
  Models:
    Student:
      pretrained:
      model_type: det
      algorithm: DB
      Transform: null
      Backbone:
        name: MobileNetV3
        scale: 0.5
        model_name: large
        disable_se: true
      Neck:
        name: RSEFPN
        out_channels: 96
        shortcut: True
      Head:
        name: DBHead
        k: 50
    Student2:
      pretrained:
      model_type: det
      algorithm: DB
      Transform: null
      Backbone:
        name: MobileNetV3
        scale: 0.5
        model_name: large
        disable_se: true
      Neck:
        name: RSEFPN
        out_channels: 96
        shortcut: True
      Head:
        name: DBHead
        k: 50
    Teacher:
      freeze_params: true
      return_all_feats: false
      model_type: det
      algorithm: DB
      Backbone:
        name: ResNet_vd
        in_channels: 3
        layers: 50
      Neck:
        name: LKPAN
        out_channels: 256
      Head:
        name: DBHead
        kernel_list: [7,2,2]
        k: 50

Loss:
  name: CombinedLoss
  loss_config_list:
  - DistillationDilaDBLoss:
      weight: 1.0
      model_name_pairs:
      - ["Student", "Teacher"]
      - ["Student2", "Teacher"]
      key: maps
      balance_loss: true
      main_loss_type: DiceLoss
      alpha: 5
      beta: 10
      ohem_ratio: 3
  - DistillationDMLLoss:
      model_name_pairs:
      - ["Student", "Student2"]
      maps_name: "thrink_maps"
      weight: 1.0
      key: maps
  - DistillationDBLoss:
      weight: 1.0
      model_name_list: ["Student", "Student2"]
      balance_loss: true
      main_loss_type: DiceLoss
      alpha: 5
      beta: 10
      ohem_ratio: 3

Optimizer:
  name: Adam
  beta1: 0.9
  beta2: 0.999
  lr:
    name: Cosine
    learning_rate: 0.001
    warmup_epoch: 2
  regularizer:
    name: L2
    factor: 5.0e-05

PostProcess:
  name: DistillationDBPostProcess
  model_name: ["Student"]
  key: head_out
  thresh: 0.3
  box_thresh: 0.6
  max_candidates: 1000
  unclip_ratio: 1.5

Metric:
  name: DistillationMetric
  base_metric_name: DetMetric
  main_indicator: hmean
  key: "Student"

Train:
  dataset:
    name: SimpleDataSet
    data_dir: ./Temp/train_data/images
    label_file_list:
      - ./Temp/train_data/det/train.txt
    ratio_list: [1.0]
    transforms:
    - DecodeImage:
        img_mode: BGR
        channel_first: false
    - DetLabelEncode: null
    - CopyPaste:
    - IaaAugment:
        augmenter_args:
        - type: Fliplr
          args:
            p: 0.5
        - type: Affine
          args:
            rotate:
            - -10
            - 10
        - type: Resize
          args:
            size:
            - 0.5
            - 3
    - EastRandomCropData:
        size:
        - 960
        - 960
        max_tries: 50
        keep_ratio: true
    - MakeBorderMap:
        shrink_ratio: 0.4
        thresh_min: 0.3
        thresh_max: 0.7
    - MakeShrinkMap:
        shrink_ratio: 0.4
        min_text_size: 8
    - NormalizeImage:
        scale: 1./255.
        mean:
        - 0.485
        - 0.456
        - 0.406
        std:
        - 0.229
        - 0.224
        - 0.225
        order: hwc
    - ToCHWImage: null
    - KeepKeys:
        keep_keys:
        - image
        - threshold_map
        - threshold_mask
        - shrink_map
        - shrink_mask
  loader:
    shuffle: true
    drop_last: false
    batch_size_per_card: 8
    num_workers: 4

Eval:
  dataset:
    name: SimpleDataSet
    data_dir: ./Temp/train_data/images
    label_file_list:
      - ./Temp/train_data/det/val.txt
    transforms:
      - DecodeImage: # load image
          img_mode: BGR
          channel_first: False
      - DetLabelEncode: # Class handling label
      - DetResizeForTest:
      - NormalizeImage:
          scale: 1./255.
          mean: [0.485, 0.456, 0.406]
          std: [0.229, 0.224, 0.225]
          order: ''hwc''
      - ToCHWImage:
      - KeepKeys:
          keep_keys: [''image'', ''shape'', ''polys'', ''ignore_tags'']
  loader:
    shuffle: False
    drop_last: False
    batch_size_per_card: 1 # must be 1
    num_workers: 2
```

### **2.2.2** 启动训练

在PaddleOCR-release-2.8.1根目录下，执行命令开始训练：

```python
python .\\tools\\train.py -c .\\Temp\\configs\\en_PP-OCRv3_det_cml.yml
```

### **2.2.3** 测试模型

测试**训练好**的`检测模型`检测图片是否准确

```python
python tools/infer_det.py -c .\\Temp\\configs\\en_PP-OCRv3_det_cml.yml -o Global.pretrained_model=/output/en_PP-OCR_v3_det/latest.pdparams Global.infer_img="D:\\Files\\PythonProject\\Important final code\\PaddleOCR-3.0.2\\testImages\\001.png"
```

测试**导出后**的`检测模型` 检测图片是否准确

```python
python .\\tools\\infer\\predict_det.py --det_model_dir="./inference_model/v3det_model/Student" --image_dir="./Temp/testImages/003.png" --use_gpu=true
```

## 2.3 训练识别模型

配置文件

```jsx
Global:
  debug: false
  use_gpu: true
  epoch_num: 300
  save_model_dir: ./output/en_PP-OCRv4_rec
  pretrained_model: ./Temp/en_PP-OCRv4_rec_train/best_accuracy
#  checkpoints: ./output/en_PP-OCRv4_rec/latest
  checkpoints: null
  log_smooth_window: 20
  print_batch_step: 10
  save_epoch_step: 10
  eval_batch_step:
  - 0
  - 9999999
  cal_metric_during_train: true
  save_inference_dir: null
  use_visualdl: false
  infer_img: ./Temp/testImage/
  character_dict_path: ppocr/utils/en_dict.txt
  max_text_length: 25
  infer_mode: false
  use_space_char: true
  distributed: true
  save_res_path: ./output/rec/predicts_ppocrv3.txt
Optimizer:
  name: Adam
  beta1: 0.9
  beta2: 0.999
  lr:
    name: Cosine
    learning_rate: 0.0005
    warmup_epoch: 5
  regularizer:
    name: L2
    factor: 3.0e-05
Architecture:
  model_type: rec
  algorithm: SVTR_LCNet
  Transform: null
  Backbone:
    name: PPLCNetV3
    scale: 0.95
  Head:
    name: MultiHead
    head_list:
    - CTCHead:
        Neck:
          name: svtr
          dims: 120
          depth: 2
          hidden_dims: 120
          kernel_size:
          - 1
          - 3
          use_guide: true
        Head:
          fc_decay: 1.0e-05
    - NRTRHead:
        nrtr_dim: 384
        max_text_length: 25
Loss:
  name: MultiLoss
  loss_config_list:
  - CTCLoss: null
  - NRTRLoss: null
PostProcess:
  name: CTCLabelDecode
Metric:
  name: RecMetric
  main_indicator: acc
  ignore_space: false
Train:
  dataset:
    name: MultiScaleDataSet
    ds_width: false
    data_dir: ./Temp/train_data/images
    ext_op_transform_idx: 1
    label_file_list:
    - ./Temp/train_data/rec/train.txt
    transforms:
    - DecodeImage:
        img_mode: BGR
        channel_first: false
    - RecConAug:
        prob: 0.5
        ext_data_num: 2
        image_shape:
        - 48
        - 320
        - 3
        max_text_length: 25
    - RecAug: null
    - MultiLabelEncode:
        gtc_encode: NRTRLabelEncode
    - KeepKeys:
        keep_keys:
        - image
        - label_ctc
        - label_gtc
        - length
        - valid_ratio
  sampler:
    name: MultiScaleSampler
    scales:
    - - 320
      - 32
    - - 320
      - 48
    - - 320
      - 64
    first_bs: 96
    fix_bs: false
    divided_factor:
    - 8
    - 16
    is_training: true
  loader:
    shuffle: true
    batch_size_per_card: 16
    drop_last: true
    num_workers: 8
Eval:
  dataset:
    name: SimpleDataSet
    data_dir: ./Temp/train_data/images
    label_file_list:
    - ./Temp/train_data/rec/val.txt
    transforms:
    - DecodeImage:
        img_mode: BGR
        channel_first: false
    - MultiLabelEncode:
        gtc_encode: NRTRLabelEncode
    - RecResizeImg:
        image_shape:
        - 3
        - 48
        - 320
    - KeepKeys:
        keep_keys:
        - image
        - label_ctc
        - label_gtc
        - length
        - valid_ratio
  loader:
    shuffle: false
    drop_last: false
    batch_size_per_card: 16
    num_workers: 4
profiler_options: null
```

### 启动训练

```jsx
python tools/train.py -c .\\Temp\\configs\\en_PP-OCRv4_rec.yml
```

测试训练好的`识别模型`检测图片是否准确

```python
python tools/infer_rec.py -c .\\Temp\\configs\\en_PP-OCRv4_rec.yml -o Global.pretrained_model=.\\output/en_PP-OCRv4_rec/best_accuracy.pdparams Global.infer_img="D:\\Files\\PaddleOCR-2.8.1\\Temp\\testImages\\577.png" 
```

### 评估性能

在训练过程中可以及时对已经训练好的模型进行评估模型效果

**在验证集上评估已经训练好的模型的性能表现**，不继续训练，仅计算准确率、编辑距离和损失值等指标。

```python
python .\\tools\\eval.py -c .\\Temp\\configs\\en_PP-OCRv4_rec.yml -o Global.checkpoints=.\\output\\en_PP-OCRv4_rec\\latest
```

## 2.4 导出推理模型

分别将上面训练好的检测、识别模型导出为推理模型

1. 导出检测模型

```python
python .\\tools\\export_model.py -c .\\Temp\\configs\\en_PP-OCRv3_det_cml.yml -o Global.pretrained_model=.\\Temp\\output\\en_PP-OCRv3_det\\latest Global.save_inference_dir=./inference_model/det_model/
```

1. 导出识别模型

```python
python .\\tools\\export_model.py -c .\\Temp\\configs\\en_PP-OCRv4_rec.yml -o Global.pretrained_model=.\\output/en_PP-OCRv4_rec/best_accuracy Global.save_inference_dir=./inference_model/rec_model/ 
```

# 3. 测试模型

```jsx
import os
from paddleocr import PaddleOCR
from PIL import Image
from paddleocr.tools.infer.utility import draw_ocr

# 初始化OCR模型
ocr = PaddleOCR(
    lang="ch",
    use_gpu=False,
    det_model_dir="inference_model/v3det_model/Student",
    rec_model_dir="inference_model/rec_model",
    rec_char_dict_path=''inference_model/en_dict.txt'',
    # det_db_thresh=0.1,   # 文字检测阈值 默认0.3
    # det_db_box_thresh=0.1,  # 框后处理阈值
    # det_db_unclip_ratio=3.0,  # 扩展框比例，值太小可能导致框过小或断裂
)

# 输入文件夹路径
img_folder = ''testImages''
output_folder = ''results_with_boxes''
os.makedirs(output_folder, exist_ok=True)

img_extensions = [''.png'', ''.jpg'', ''.jpeg'']

for filename in os.listdir(img_folder):
    if any(filename.lower().endswith(ext) for ext in img_extensions):
        img_path = os.path.join(img_folder, filename)
        print(f"Processing: {img_path}")

        img = Image.open(img_path).convert(''RGB'')
        result = ocr.ocr(img_path)

        # 输出识别结果和置信度
        for line in result[0]:
            text = line[1][0]
            score = line[1][1]
            print(f"{filename}\\t{text}\\t{score:.4f}")

        # 画图：检测框坐标和文字内容
        boxes = [line[0] for line in result[0]]  # 检测框坐标
        texts = [line[1][0] for line in result[0]]  # 识别文本
        scores = [line[1][1] for line in result[0]]  # 置信度

        # PaddleOCR自带的绘图工具画图
        img_with_boxes = draw_ocr(img, boxes, texts, scores)

        # 保存图片
        img_with_boxes = Image.fromarray(img_with_boxes)
        save_path = os.path.join(output_folder, f"{os.path.splitext(filename)[0]}_with_boxes.png")
        img_with_boxes.save(save_path)
        print(f"Saved result to: {save_path}\\n")
```

# 4. 虚拟环境

```jsx
conda activate paddle38
```

# ５.模型使用

时间：2025/10/10

环境

```jsx
paddleocr             2.8.1
paddlepaddle-gpu      2.6.2
paddlex               3.2.1
```

代码test [Model.py](http://Model.py)

```jsx
import os
import sys
import argparse
import json
from paddleocr import PaddleOCR

def main():
    parser = argparse.ArgumentParser(description="Single image OCR")
    parser.add_argument("image_path", help="输入图片路径")
    args = parser.parse_args()

    image_path = args.image_path
    if not os.path.isfile(image_path):
        print(json.dumps({
            "success": False,
            "error": f"文件不存在: {image_path}"
        }, ensure_ascii=False))
        sys.exit(1)

    try:
        # PaddleOCR 2.8.1 调用训练模型
        ocr = PaddleOCR(
            use_gpu=True,
            det_model_dir=r"D:\\Files\\PythonProject2\\src\\main\\resources\\models\\det_model_v3\\Student",
            rec_model_dir=r"D:\\Files\\PythonProject2\\src\\main\\resources\\models\\rec_model_v4",
            rec_char_dict_path=r"D:\\Files\\PythonProject2\\src\\main\\resources\\models\\en_dict.txt"
        )

        result = ocr.ocr(image_path, cls=True)

        lines = []
        full_text = ""
        for line in result[0]:
            box = line[0]
            text = line[1][0]
            score = line[1][1]
            full_text += text
            lines.append({
                "box": box,
                "text": text,
                "score": score
            })

        print(json.dumps({
            "success": True,
            "full_text": full_text.strip(),
            "lines": lines
        }, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"OCR处理失败: {str(e)}"
        }, ensure_ascii=False))
        sys.exit(2)

if __name__ == "__main__":
    main()
```

执行

```jsx
PS D:\\Files\\PythonProject2> python .\\testModel.py .\\img.png
[2025/10/10 13:37:41] ppocr DEBUG: Namespace(help=''==SUPPRESS=='', use_gpu=True, use_xpu=False, use_npu=False, use_mlu=False, ir_optim=True, use_tensorrt=False, min_subgraph_size=15, precision=''fp32'', gpu_mem=500, gpu_id=0, image_dir=None, page_num=0, det_algorithm=''DB'', det_model_dir=''D:\\\\Files\\\\PythonProject2\\\\src\\\\main\\\\resources\\\\models\\\\det_model_v3\\\\Student'', det_limit_side_len=960, det_limit_type=''max'', det_box_type=''quad'', det_db_thresh=0.3, det_db_box_thresh=0.6, det_db_unclip_ratio=1.5, max_batch_size=10, use_dilation=False, det_db_score_mode=''fast'', det_east_score_thresh=0.8, det_east_cover_thresh=0.1, det_east_nms_thresh=0.2, det_sast_score_thresh=0.5, det_sast_nms_thresh=0.2, det_pse_thresh=0, det_pse_box_thresh=0.85, det_pse_min_area=16, det_pse_scale=1, scales=[8, 16, 32], alpha=1.0, beta=1.0, fourier_degree=5, rec_algorithm=''SVTR_LCNet'', rec_model_dir=''D:\\\\Files\\\\PythonProject2\\\\src\\\\main\\\\resources\\\\models\\\\rec_model_v4'', rec_image_inverse=True, rec_image_shape=''3, 48, 320'', rec_batch_num=6, max_text_length=25, rec_char_dict_path=''D:\\\\Files\\\\PythonProject2\\\\src\\\\main\\\\resources\\\\models\\\\en_dict.txt'', use_space_char=True, vis_font_path=''./doc/fonts/simfang.ttf'', drop_score=0.5, e2e_algorithm=''PGNet'', e2e_model_dir=None, e2e_limit_side_len=768, e2e_limit_type=''max'', e2e_pgnet_score_thresh=0.5, e2e_char_dict_path=''./ppocr/utils/ic15_dict.txt'', e2e_pgnet_valid_set=''totaltext'', e2e_pgnet_mode=''fast'', use_angle_cls=False, cls_model_dir=''C:\\\\Users\\\\33226/.paddleocr/whl\\\\cls\\\\ch_ppocr_mobile_v2.0_cls_infer'', cls_image_shape=''3, 48, 192'', label_list=[''0'', ''180''], cls_batch_num=6, cls_thresh=0.9, enable_mkldnn=False, cpu_threads=10, use_pdserving=False, warmup=False, sr_model_dir=None, sr_image_shape=''3, 32, 128'', sr_batch_num=1, draw_img_save_dir=''./inference_results'', save_crop_res=False, crop_res_save_dir=''./output'', use_mp=False, total_process_num=1, process_id=0, benchmark=False, save_log_path=''./log_output/'', show_log=True, use_onnx=False, return_word_box=False, output=''./output'', table_max_len=488, table_algorithm=''TableAttn'', table_model_dir=None, merge_no_span_structure=True, table_char_dict_path=None, layout_model_dir=None, layout_dict_path=None, layout_score_threshold=0.5, layout_nms_threshold=0.5, kie_algorithm=''LayoutXLM'', ser_model_dir=None, re_model_dir=None, use_visual_backbone=True, ser_dict_path=''../train_data/XFUND/class_list_xfun.txt'', ocr_order_method=None, mode=''structure'', image_orientation=False, layout=True, table=True, ocr=True, recovery=False, use_pdf2docx_api=False, invert=False, binarize=False, alphacolor=(255, 255, 255), lang=''ch'', det=True, rec=True, type=''ocr'', savefile=False, ocr_version=''PP-OCRv4'', structure_version=''PP-StructureV2'')
[2025/10/10 13:37:45] ppocr WARNING: Since the angle classifier is not initialized, it will not be used during the forward process
[2025/10/10 13:37:46] ppocr DEBUG: dt_boxes num : 5, elapsed : 1.3364863395690918
[2025/10/10 13:37:46] ppocr DEBUG: rec_res num  : 5, elapsed : 0.13319826126098633
{"success": true, "full_text": "0317WS2022D100012", "lines": [{"box": [[16.0, 4.0], [122.0, 4.0], [122.0, 83.0], [16.0, 83.0]], "text": "0317", "score": 0.8762916922569275}, {"box": [[148.0, 11.0], [248.0, 11.0], [248.0, 82.0], [148.0, 82.0]], "text": "WS", "score": 0.9998351335525513}, {"box": [[252.0, 17.0], [379.0, 12.0], [382.0, 81.0], [256.0, 86.0]], "text": "2022", "score": 0.9991670250892639}, {"box": [[432.0, 18.0], [524.0, 23.0], [521.0, 83.0], [429.0, 79.0]], "text": "D10", "score": 0.9650375247001648}, {"box": [[16.0, 90.0], [114.0, 90.0], [114.0, 151.0], [16.0, 151.0]], "text": "0012", "score": 0.9996055960655212}]}
```

# 6. 检测模型参数量

```jsx
import paddle
import os

def count_inference_model_params(model_prefix: str, use_gpu=False):
    """
    统计 Paddle 推理模型 (.pdmodel + .pdiparams) 参数总量
    model_prefix: 文件前缀，例如 D:\\...\\rec_model_v4\\inference
    """
    if not os.path.exists(model_prefix + ".pdmodel") or not os.path.exists(model_prefix + ".pdiparams"):
        raise FileNotFoundError(f"找不到模型文件: {model_prefix}.pdmodel 或 {model_prefix}.pdiparams")

    paddle.enable_static()
    place = paddle.CUDAPlace(0) if use_gpu else paddle.CPUPlace()
    exe = paddle.static.Executor(place)

    inference_program, feed_target_names, fetch_targets = paddle.static.load_inference_model(
        path_prefix=model_prefix, executor=exe
    )

    total_params = 0
    for block in inference_program.blocks:
        for var in block.vars.values():
            if var.persistable and var.name not in feed_target_names:
                try:
                    shape = var.shape
                except RuntimeError:
                    continue
                param_count = 1
                for dim in shape:
                    param_count *= dim
                total_params += param_count
    return total_params

if __name__ == "__main__":
    det_model_prefix = r"D:\\Files\\PythonProject2\\src\\main\\resources\\models\\det_model_v3\\Student\\inference"
    rec_model_prefix = r"D:\\Files\\PythonProject2\\src\\main\\resources\\models\\rec_model_v4\\inference"

    det_params = count_inference_model_params(det_model_prefix, use_gpu=False)
    rec_params = count_inference_model_params(rec_model_prefix, use_gpu=False)

    print(f"检测模型参数量: {det_params}")
    print(f"识别模型参数量: {rec_params}")
```

输出

```jsx
PS D:\\Files\\PythonProject2> python .\\testModelsCanShu.py
I1010 13:56:04.597359  3416 program_interpreter.cc:212] New Executor is Running.
检测模型参数量: 592625
识别模型参数量: 1890532
```

# 临时记录

start_epoch:188 验证集评估结果

```python
[2025/06/25 16:15:36] ppocr INFO: resume from .\\output\\en_PP-OCRv4_rec\\latest
[2025/06/25 16:15:36] ppocr INFO: metric in ckpt ***************
[2025/06/25 16:15:36] ppocr INFO: acc:0
[2025/06/25 16:15:36] ppocr INFO: is_float16:False
[2025/06/25 16:15:36] ppocr INFO: start_epoch:188
[2025/06/25 16:15:39] ppocr INFO: metric eval ***************
[2025/06/25 16:15:39] ppocr INFO: acc:0.9583332834201415
[2025/06/25 16:15:39] ppocr INFO: norm_edit_dis:0.9878472228551793
[2025/06/25 16:15:39] ppocr INFO: fps:63.97288645081185
```

```python
[2025/06/26 09:05:29] ppocr INFO: resume from .\\output\\en_PP-OCRv4_rec\\latest
[2025/06/26 09:05:29] ppocr INFO: metric in ckpt ***************
[2025/06/26 09:05:29] ppocr INFO: acc:0
[2025/06/26 09:05:29] ppocr INFO: is_float16:False
[2025/06/26 09:05:29] ppocr INFO: start_epoch:301
[2025/06/26 09:05:30] ppocr INFO: metric eval ***************
[2025/06/26 09:05:30] ppocr INFO: acc:0.9635416164822075
[2025/06/26 09:05:30] ppocr INFO: norm_edit_dis:0.9891493061206958
[2025/06/26 09:05:30] ppocr INFO: fps:265.29454544496195
```

```python
[2025/06/25 18:24:53] ppocr INFO: epoch: [270/300], global_step: 300, lr: 0.000058, acc: 1.000000, norm_edit_dis: 1.0
00000, CTCLoss: 0.049039, NRTRLoss: 0.620189, loss: 0.669288, avg_reader_cost: 0.06627 s, avg_batch_cost: 8.51739 s, avg_samples: 70.4, ips: 8.26544 samples/s, eta: 0:39:29, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:25:28] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:25:28] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\iter_epoch_270
[2025/06/25 18:26:19] ppocr INFO: epoch: [271/300], global_step: 310, lr: 0.000057, acc: 1.000000, norm_edit_dis: 1.0
00000, CTCLoss: 0.048249, NRTRLoss: 0.620180, loss: 0.668467, avg_reader_cost: 0.11603 s, avg_batch_cost: 8.57698 s, avg_samples: 72.0, ips: 8.39456 samples/s, eta: 0:37:53, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:26:36] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:27:45] ppocr INFO: epoch: [272/300], global_step: 320, lr: 0.000055, acc: 0.989583, norm_edit_dis: 0.9
99132, CTCLoss: 0.059071, NRTRLoss: 0.620167, loss: 0.679213, avg_reader_cost: 0.07585 s, avg_batch_cost: 8.61765 s, avg_samples: 68.8, ips: 7.98361 samples/s, eta: 0:36:19, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:27:45] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:28:54] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:29:11] ppocr INFO: epoch: [274/300], global_step: 330, lr: 0.000053, acc: 0.994792, norm_edit_dis: 0.9
99566, CTCLoss: 0.057062, NRTRLoss: 0.620193, loss: 0.677321, avg_reader_cost: 0.13713 s, avg_batch_cost: 8.65757 s, avg_samples: 70.4, ips: 8.13162 samples/s, eta: 0:34:36, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:30:03] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:30:37] ppocr INFO: epoch: [275/300], global_step: 340, lr: 0.000051, acc: 1.000000, norm_edit_dis: 1.0
00000, CTCLoss: 0.058556, NRTRLoss: 0.620187, loss: 0.678740, avg_reader_cost: 0.07255 s, avg_batch_cost: 8.54815 s, avg_samples: 72.0, ips: 8.42288 samples/s, eta: 0:33:00, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:31:12] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:32:02] ppocr INFO: epoch: [276/300], global_step: 350, lr: 0.000049, acc: 0.994792, norm_edit_dis: 0.9
99566, CTCLoss: 0.062293, NRTRLoss: 0.620185, loss: 0.682432, avg_reader_cost: 0.06702 s, avg_batch_cost: 8.54973 s, avg_samples: 73.6, ips: 8.60846 samples/s, eta: 0:31:25, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:32:20] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:33:28] ppocr INFO: epoch: [277/300], global_step: 360, lr: 0.000048, acc: 0.994792, norm_edit_dis: 0.9
99566, CTCLoss: 0.053074, NRTRLoss: 0.620199, loss: 0.673219, avg_reader_cost: 0.06782 s, avg_batch_cost: 8.59742 s, avg_samples: 67.2, ips: 7.81629 samples/s, eta: 0:29:51, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:33:29] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:34:37] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:34:54] ppocr INFO: epoch: [279/300], global_step: 370, lr: 0.000046, acc: 0.994792, norm_edit_dis: 0.9
99566, CTCLoss: 0.045486, NRTRLoss: 0.620186, loss: 0.667856, avg_reader_cost: 0.12697 s, avg_batch_cost: 8.59989 s, avg_samples: 70.4, ips: 8.18615 samples/s, eta: 0:28:07, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:35:46] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:36:20] ppocr INFO: epoch: [280/300], global_step: 380, lr: 0.000044, acc: 0.989583, norm_edit_dis: 0.9
99092, CTCLoss: 0.057158, NRTRLoss: 0.620180, loss: 0.677308, avg_reader_cost: 0.07080 s, avg_batch_cost: 8.54077 s, avg_samples: 73.6, ips: 8.61749 samples/s, eta: 0:26:32, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:36:54] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:36:55] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\iter_epoch_280
[2025/06/25 18:37:46] ppocr INFO: epoch: [281/300], global_step: 390, lr: 0.000043, acc: 0.989583, norm_edit_dis: 0.9
99006, CTCLoss: 0.057158, NRTRLoss: 0.620190, loss: 0.677308, avg_reader_cost: 0.11939 s, avg_batch_cost: 8.60828 s, avg_samples: 72.0, ips: 8.36404 samples/s, eta: 0:24:57, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:38:04] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:39:11] ppocr INFO: epoch: [282/300], global_step: 400, lr: 0.000041, acc: 0.984375, norm_edit_dis: 0.9
98639, CTCLoss: 0.056775, NRTRLoss: 0.620197, loss: 0.677154, avg_reader_cost: 0.07201 s, avg_batch_cost: 8.55105 s, avg_samples: 67.2, ips: 7.85869 samples/s, eta: 0:23:22, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:39:12] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:40:21] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:40:38] ppocr INFO: epoch: [284/300], global_step: 410, lr: 0.000039, acc: 0.984375, norm_edit_dis: 0.9
98639, CTCLoss: 0.053467, NRTRLoss: 0.620176, loss: 0.673645, avg_reader_cost: 0.13797 s, avg_batch_cost: 8.66229 s, avg_samples: 73.6, ips: 8.49660 samples/s, eta: 0:21:39, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:41:30] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:42:04] ppocr INFO: epoch: [285/300], global_step: 420, lr: 0.000038, acc: 0.989583, norm_edit_dis: 0.9
98875, CTCLoss: 0.058270, NRTRLoss: 0.620152, loss: 0.678415, avg_reader_cost: 0.07106 s, avg_batch_cost: 8.63264 s, avg_samples: 72.0, ips: 8.34044 samples/s, eta: 0:20:05, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:42:39] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:43:58] ppocr INFO: epoch: [286/300], global_step: 430, lr: 0.000036, acc: 0.994792, norm_edit_dis: 0.9
99527, CTCLoss: 0.053610, NRTRLoss: 0.620160, loss: 0.676677, avg_reader_cost: 0.07294 s, avg_batch_cost: 11.40486 s, avg_samples: 70.4, ips: 6.17281 samples/s, eta: 0:18:38, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB    
[2025/06/25 18:44:18] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:45:32] ppocr INFO: epoch: [287/300], global_step: 440, lr: 0.000035, acc: 1.000000, norm_edit_dis: 1.0
00000, CTCLoss: 0.044965, NRTRLoss: 0.620161, loss: 0.665135, avg_reader_cost: 0.06975 s, avg_batch_cost: 9.39042 s, avg_samples: 68.8, ips: 7.32662 samples/s, eta: 0:17:05, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:45:33] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:46:48] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:47:07] ppocr INFO: epoch: [289/300], global_step: 450, lr: 0.000033, acc: 1.000000, norm_edit_dis: 1.0
00000, CTCLoss: 0.045696, NRTRLoss: 0.620164, loss: 0.665892, avg_reader_cost: 0.14613 s, avg_batch_cost: 9.47883 s, avg_samples: 73.6, ips: 7.76467 samples/s, eta: 0:15:23, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:48:03] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:48:40] ppocr INFO: epoch: [290/300], global_step: 460, lr: 0.000032, acc: 1.000000, norm_edit_dis: 1.0
00000, CTCLoss: 0.047539, NRTRLoss: 0.620172, loss: 0.667690, avg_reader_cost: 0.06608 s, avg_batch_cost: 9.31875 s, avg_samples: 70.4, ips: 7.55466 samples/s, eta: 0:13:48, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:49:18] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:49:19] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\iter_epoch_290
[2025/06/25 18:50:14] ppocr INFO: epoch: [291/300], global_step: 470, lr: 0.000031, acc: 1.000000, norm_edit_dis: 1.0
00000, CTCLoss: 0.049244, NRTRLoss: 0.620185, loss: 0.669500, avg_reader_cost: 0.11283 s, avg_batch_cost: 9.36815 s, avg_samples: 72.0, ips: 7.68562 samples/s, eta: 0:12:13, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB     
[2025/06/25 18:50:33] ppocr INFO: save model in ./output/en_PP-OCRv4_rec\\latest
[2025/06/25 18:51:48] ppocr INFO: epoch: [292/300], global_step: 480, lr: 0.000029, acc: 0.994792, norm_edit_dis: 0.9
99132, CTCLoss: 0.052151, NRTRLoss: 0.620176, loss: 0.672631, avg_reader_cost: 0.07306 s, avg_batch_cost: 9.35568 s, avg_samples: 68.8, ips: 7.35382 samples/s, eta: 0:10:38, max_mem_reserved: 12193 MB, max_mem_allocated: 11824 MB 
```

# 安装依赖

```jsx
python -m pip install scikit-image imgaug lmdb rapidfuzz -i <https://mirrors.aliyun.com/pypi/simple/>
```

```jsx
 python -m pip install "numpy<2.0" --force-reinstall -i <https://mirrors.aliyun.com/pypi/simple/>
```
');
INSERT OR REPLACE INTO posts (slug, title, date, description, content) VALUES ('gpt-sovits-clone', 'GPT-SoVITS声音克隆', '2025-07-20', '使用GPT-SoVITS克隆自己的声音，相似度99%', '
### **GPT-SoVITS声音克隆**

视频教程

[你的声音，现在是我的了！- 手把手教你用 GPT-SoVITS 克隆声音！_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1P541117yn/?vd_source=8f9b14b0102a379257ba7bbd631822eb)

## 第一步：环境部署

选择环境

- Python 3.10
- PyTorch 2.5.1
- CUDA 12.4

### 1.1 创建并进入虚拟环境

```bash
conda create -n GPT python=3.10。18
conda activate GPT
```

### 1.2 使用阿里源下载

```bash
pip install torch==2.1.0+cu118 torchvision==0.16.0+cu118 torchaudio==2.1.0 --index-url https://download.pytorch.org/whl/cu118
```

### 1.3 安装依赖

```bash
pip install -r requirements.txt
```

### 1.4 运行脚本

```bash
python webui.py
```

### 1.5 下载整合包

可以运行后去官方下载整合包

https://github.com/RVC-Boss/GPT-SoVITS/blob/main/docs/cn/README.md

![image.png](attachment:7ab48c49-5ff9-46c1-ab5f-232d9645bb8d:image.png)

选择第一个，第二个是英伟达50系显卡

![image.png](attachment:56a5e364-9926-438d-aed7-f5136a6255bc:image.png)

下载完后也是在项目根目录运行代码

```bash
python webui.py
```

## 第二步：整合音频

### 2.1 人声分离

点击开启人声分离UI，等待打开另一个页面

![image.png](attachment:ec7f3b0b-e532-4027-90e3-851dbc0a9645:image.png)

在打开的新网页中选择模型，然后输入音频路径(文件夹)

![image.png](attachment:ce6abc5f-a283-41a7-933c-d0e017d80704:image.png)

右下角输出`Success` 后关闭这个webUI

分离后的音频默认在这个文件夹

![image.png](attachment:5e336401-fdb6-4edc-9ca8-7fa19ab6c3c5:image.png)

### 2.2 音频切割

使用切割工具输入刚才分离好的`音频路径`和设置`输出路径`，然后点击`开启语音切分`

![image.png](attachment:93275638-f674-4f6f-a501-b4924c9aa943:image.png)

### 2.3 生成list文件

设置切割好的音频所在文件夹和输出路径后开始切分

![image.png](attachment:fff7ad71-0f9a-4f01-8518-8c254cfe5910:image.png)

### 2.3 打标

切分好后设置list路径后点击按钮

![image.png](attachment:455bdc46-690b-4444-be58-a8a0d7af51ef:image.png)

之后会打开另一个页面，在新页面中 右边听录音，按照句子停顿 在左边文本框修改停顿点

![image.png](attachment:d475b136-ce10-4ff6-8612-49e067f15b7e:image.png)

每一页修改好后点击`Submit Text` 保存一下，然后点击`Next Index`进入下一页，如果想删除音频在`Yes`打勾并点击`Delete Audio`

![image.png](attachment:9b2269f4-c11e-469f-aeb2-73de9886504d:image.png)

## 3. 训练音色

### 3.1 一件三连

1. 模型昵称
2. 标注文件路径
3. 切割音频路径

按图依次选择，输入训练`模型昵称`、打标并修改后的`list路径`、`切割音频路径`

![image.png](attachment:9494ee47-b3e9-4a12-a54c-82841807dcd2:image.png)

然后点击底部一件三连按钮，直到看到红框位置输出`已完成`

![image.png](attachment:073e32d8-b79e-4326-abe9-2caf899db923:image.png)

## 4. 模型微调

### 4.1 训练GPT与SoVITS

音色训练好后再选择微调模型，

![image.png](attachment:567d3278-66ee-4593-b3b8-7d6971468ebf:image.png)

然后依次点击两个按钮

![image.png](attachment:e8f808b7-955f-43f5-b066-d843ac543a83:image.png)

注意在这里选择训练模型的版本的时候

![image.png](attachment:7060aa94-be5e-4ddd-87da-ace8a9793034:image.png)

执行两个按钮后会在对应文件夹下生成模型

![image.png](attachment:d19712e5-28ee-4175-99cf-2f5581b4dd25:image.png)

## 5. 推理模型

微调好后再开始推理

### 5.1 选择模型

依次在模型列表中选择两个模型

- `e`代表训练轮数
- `s`代表训练步数

默认是选择数字最高的，如果效果不好，可以再选择其他的重新训练

![image.png](attachment:8804af4e-ce10-4851-a839-4ee9dbe3e494:image.png)

选择好后点击`开启TTS推理` ，然后等待打开另一个页面（如果没打开可能cmd页面卡了，打开cmd后按一下空格后按回车）

然后需要在打开的新页面中上传参考音频，训练的时候用的谁的音频，参考音频也要用谁的，5s左右，可以从切割的音频中选择一个上传

> 💡上传**参考音频**和**生成后**的音频**影响很大**，如果是要`平静`的那就上传平静的，如果是要`激动` 的，那就上传激动的参考音频
> 

### 5.2 上传音频

上传音频后输入音频对应的`文本`和`语言`

![image.png](attachment:99a0eb7d-c431-44db-a8ae-ac8efcc23269:image.png)

然后在右边输入要生成的文本

![image.png](attachment:3026fc25-2d6b-4332-8a2d-ec30d7afb670:image.png)

### 5.3 合成语音

最后点击`合成语音` 

![image.png](attachment:648823b4-571e-4c40-92b1-b95e8ed021ef:image.png)
');
INSERT OR REPLACE INTO posts (slug, title, date, description, content) VALUES ('highgo', '翰高数据库', '2026-01-27', 'Mac同局域网连接centos7虚拟机中翰高数据库', '
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
');


-- ==========================================
-- 第二部分: 日记数据 (Daily)
-- ==========================================
INSERT OR REPLACE INTO daily (filename, date, content, image_url) VALUES ('250722.md', '250722', '不想玩马可波罗了，这次是真的不想玩了
', '');
INSERT OR REPLACE INTO daily (filename, date, content, image_url) VALUES ('250723.md', '250723', '

练会你离开的事实第三段了，发现第四段也不难哈哈哈哈哈哈哈哈
等用这一百块的琴练会了再买个好点的试试效果🌝
', '');
INSERT OR REPLACE INTO daily (filename, date, content, image_url) VALUES ('250724.md', '250724', '

想买琴了想买琴了想买琴了想买琴了想买琴了想买琴了想买琴了想买琴了
', '');
INSERT OR REPLACE INTO daily (filename, date, content, image_url) VALUES ('250730.md', '250730', '终于会前五段了，可以稍微一丢丢的弹下来，今天想录下来，结果练的时候弹的好好的，一打开录音就啥也不会了，录了20多遍，效果还不是很好。 哭哭哭

先把前五段练好了再学后面的叭～
', '');
INSERT OR REPLACE INTO daily (filename, date, content, image_url) VALUES ('250807.md', '250807', '突然觉得现在好弱，记得小时候还能一口气做30个俯卧撑，现在做10个都费劲，仰卧起坐都能做两三百个，现在100个累死了，哭
', '');
INSERT OR REPLACE INTO daily (filename, date, content, image_url) VALUES ('250903.md', '250903', '希望我的团团快快长大～
', '');
INSERT OR REPLACE INTO daily (filename, date, content, image_url) VALUES ('251005.md', '251005', '

族长，其实我掌控了两个元素，只是族里大多数人都是一个元素，所以我为了融合进去隐藏了另一个元素，但在族里的这三百年，我发现我在这里过的时间越长，我越会逃避，再后来由于一直隐藏另一个元素，导致产生了心魔，我怕有一天他会战胜我自己，所以，请杀了我,他即将战胜我，我无法面对
', '');
INSERT OR REPLACE INTO daily (filename, date, content, image_url) VALUES ('251126.md', '251126', '

首页要怎嚒写啊啊啊啊啊啊啊啊，喜欢Cynosura的，但是要我也这样弄却有一股莫名的羞耻感🌚
', '');
INSERT OR REPLACE INTO daily (filename, date, content, image_url) VALUES ('260126.md', '260126', '

希望我的选择不会太差
', '');


-- ==========================================
-- 第三部分: 瞬间数据 (Moments)
-- ==========================================
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_0317.md', 'Moment_0317', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/IMG_0317.png', '
Archive_Entry: 0317
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_1134.md', 'Moment_1134', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/IMG_1134.jpg', '
Archive_Entry: 1134
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_1231.md', 'Moment_1231', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/300427.jpg', '
Archive_Entry: 1231
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_1259.md', 'Moment_1259', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/IMG_1259.jpg', '
Archive_Entry: 1259
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_1566.md', 'Moment_1566', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/IMG_1566.JPG', '
Archive_Entry: 1566
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_2203.md', 'Moment_2203', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/IMG_2203.jpg', '
Archive_Entry: 2203
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_2372.md', 'Moment_2372', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/IMG_2372.jpg', '
Archive_Entry: 2372
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_289201.md', 'Moment_289201', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/289201_livephoto.png', '
Archive_Entry: 289201
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_7269.md', 'Moment_7269', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/IMG_7269.png', '
Archive_Entry: 7269
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_7842.md', 'Moment_7842', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/IMG_7842.png', '
Archive_Entry: 7842
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_8696.md', 'Moment_8696', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/IMG_8696.png', '
Archive_Entry: 8696
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_9967.md', 'Moment_9967', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/IMG_9967.heic', '
Archive_Entry: 9967
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_9988.md', 'Moment_9988', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/IMG_9988.jpg', '
Archive_Entry: 9988
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_add79ed.md', 'Moment_add79ed', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/add79edcf9eb6c856cdcf1b90613e457.JPG', '
Archive_Entry: add79ed
');
INSERT OR REPLACE INTO moments (filename, title, date, image_url, content) VALUES ('img_heic.md', 'Moment_HEIC_Archive', '2026-02-06', 'https://raw.githubusercontent.com/arkleselect/blog/main/img/6713640ca176cb1a4e7ad16fe7999e88.HEIC', '
Archive_Entry: HEIC_IMAGE
');
