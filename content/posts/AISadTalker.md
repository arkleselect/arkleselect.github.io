---
title: AI数字人SadTalker
description: 微软开源模型，一张照片就可以自动对嘴型，让图片使用你定制的声音讲话
date: 2025-07-21
---

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

[深度学习No module named ‘torchvision.transforms.functional_tensor‘问题解决_no module named 'torchvision.transforms-CSDN博客](https://blog.csdn.net/2301_79442295/article/details/142788495)

出现`ModuleNotFoundError: No module named 'torchvision.transforms.functional_tensor'`的原因大概是原先的“名字”改了，但是安装的`basicsr`包中的名字没有改，所以会报错。

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
when I use imageio 2.28.1, get this error, and then use 2.19.3, it's ok!

pip install imageio==2.19.3
pip install imageio-ffmpeg==0.4.7
```
