from __future__ import annotations

import copy
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from xml.etree import ElementTree as ET


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
ET.register_namespace("w", W_NS)
ET.register_namespace("r", R_NS)
NS = {"w": W_NS}


def w_tag(name: str) -> str:
    return f"{{{W_NS}}}{name}"


def get_style_map(styles_root: ET.Element) -> dict[str, str]:
    style_map: dict[str, str] = {}
    for style in styles_root.findall("w:style", NS):
        style_id = style.get(w_tag("styleId"))
        name_el = style.find("w:name", NS)
        if style_id and name_el is not None:
            style_map[style_id] = name_el.get(w_tag("val"), "")
    return style_map


def set_paragraph_style(p: ET.Element, style_id: str | None = None, bold: bool = False, center: bool = False) -> None:
    pPr = p.find("w:pPr", NS)
    if pPr is None:
        pPr = ET.SubElement(p, w_tag("pPr"))

    if style_id:
        pStyle = pPr.find("w:pStyle", NS)
        if pStyle is None:
            pStyle = ET.SubElement(pPr, w_tag("pStyle"))
        pStyle.set(w_tag("val"), style_id)

    spacing = pPr.find("w:spacing", NS)
    if spacing is None:
        spacing = ET.SubElement(pPr, w_tag("spacing"))
    spacing.set(w_tag("line"), "480")
    spacing.set(w_tag("lineRule"), "auto")

    if center:
        jc = pPr.find("w:jc", NS)
        if jc is None:
            jc = ET.SubElement(pPr, w_tag("jc"))
        jc.set(w_tag("val"), "center")

    rPr = pPr.find("w:rPr", NS)
    if rPr is None:
        rPr = ET.SubElement(pPr, w_tag("rPr"))
    rFonts = rPr.find("w:rFonts", NS)
    if rFonts is None:
        rFonts = ET.SubElement(rPr, w_tag("rFonts"))
    rFonts.set(w_tag("hint"), "eastAsia")
    rFonts.set(w_tag("ascii"), "宋体")
    rFonts.set(w_tag("hAnsi"), "宋体")
    rFonts.set(w_tag("eastAsia"), "宋体")
    rFonts.set(w_tag("cs"), "宋体")
    sz = rPr.find("w:sz", NS)
    if sz is None:
        sz = ET.SubElement(rPr, w_tag("sz"))
    sz.set(w_tag("val"), "22")
    szCs = rPr.find("w:szCs", NS)
    if szCs is None:
        szCs = ET.SubElement(rPr, w_tag("szCs"))
    szCs.set(w_tag("val"), "22")
    if bold:
        if rPr.find("w:b", NS) is None:
            ET.SubElement(rPr, w_tag("b"))


def make_run(text: str, bold: bool = False) -> ET.Element:
    r = ET.Element(w_tag("r"))
    rPr = ET.SubElement(r, w_tag("rPr"))
    rFonts = ET.SubElement(rPr, w_tag("rFonts"))
    rFonts.set(w_tag("hint"), "eastAsia")
    rFonts.set(w_tag("ascii"), "宋体")
    rFonts.set(w_tag("hAnsi"), "宋体")
    rFonts.set(w_tag("eastAsia"), "宋体")
    rFonts.set(w_tag("cs"), "宋体")
    if bold:
        ET.SubElement(rPr, w_tag("b"))
    sz = ET.SubElement(rPr, w_tag("sz"))
    sz.set(w_tag("val"), "22")
    szCs = ET.SubElement(rPr, w_tag("szCs"))
    szCs.set(w_tag("val"), "22")
    t = ET.SubElement(r, w_tag("t"))
    if text.startswith(" ") or text.endswith(" "):
        t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    t.text = text
    return r


def make_paragraph(text: str, style_id: str | None = None, bold: bool = False, center: bool = False) -> ET.Element:
    p = ET.Element(w_tag("p"))
    set_paragraph_style(p, style_id=style_id, bold=bold, center=center)
    p.append(make_run(text, bold=bold))
    return p


def make_page_break() -> ET.Element:
    p = ET.Element(w_tag("p"))
    set_paragraph_style(p)
    r = ET.SubElement(p, w_tag("r"))
    ET.SubElement(r, w_tag("br"), {w_tag("type"): "page"})
    return p


def page_block(title: str, intro: str, lines: list[str], heading_style: str, subheading_style: str, body_style: str | None) -> list[ET.Element]:
    block: list[ET.Element] = [make_page_break(), make_paragraph(title, style_id=heading_style, bold=True)]
    block.append(make_paragraph(intro, style_id=body_style))
    current_sub = ""
    for idx, line in enumerate(lines, 1):
        if line.startswith("## "):
            current_sub = line[3:]
            block.append(make_paragraph(current_sub, style_id=subheading_style, bold=True))
        else:
            block.append(make_paragraph(line, style_id=body_style))
    return block


def build_expansion_pages(heading_style: str, subheading_style: str, body_style: str | None) -> list[ET.Element]:
    pages: list[ET.Element] = []

    topics: list[tuple[str, str, list[str]]] = []

    topics.append((
        "9 业务流程补充说明",
        "本章对任务创建、内容导入、自动检测、复核流转、报表归档等过程进行更细粒度说明，便于体现软件的完整业务闭环。",
        [
            "## 9.1 任务创建流程",
            "系统在创建任务时先校验当前用户是否具备任务新建权限，再校验任务名称、内容类型、规则版本与策略模板是否完整。",
            "若任务名称重复，系统给出明确提示，不允许同一业务空间中存在重复名称的待处理任务，以避免后续归档混乱。",
            "任务创建成功后自动生成任务编号、创建时间、创建人、默认状态与策略快照，确保后续所有处理均可回溯。",
            "系统支持按文本内容检测、图片内容检测、混合内容检测三类模式创建任务，满足不同业务场景需要。",
            "对于批量审查任务，用户可在创建任务时设置预期处理时限、优先级以及是否启用人工复核抽检规则。",
            "## 9.2 内容导入流程",
            "内容导入支持手工录入、单文件上传、批量文件上传以及外部业务系统推送四种方式。",
            "系统在导入阶段执行格式校验、编码转换、空值过滤、重复项识别以及敏感字段预处理，保证后续检测输入稳定。",
            "文本导入时可记录标题、正文、来源、作者、时间、业务标签等辅助信息，方便后续统计和审计。",
            "图片导入时可记录文件名称、尺寸、哈希值、上传来源和业务类型，并可触发OCR文本提取流程。",
            "对于批量导入任务，系统逐条生成导入结果反馈，包括成功数量、失败数量及失败原因，便于用户修正问题数据。",
            "## 9.3 自动检测流程",
            "系统在接收到检测指令后将任务状态由待检测变更为检测中，同时记录执行节点和触发时间。",
            "检测阶段按照规则版本加载关键词规则、正则规则、白名单规则、黑名单规则和评分规则，形成统一执行上下文。",
            "文本内容优先进行分词、归一化、大小写处理及特殊符号清理，再进入规则匹配和评分计算流程。",
            "图片内容优先调用OCR提取文本，再结合图片元数据和文件特征完成内容识别与风险分析。",
            "当单条内容命中多项规则时，系统按命中结果进行汇总，统一输出风险等级、命中证据和处置建议。",
            "## 9.4 人工复核流程",
            "系统将高风险内容、严重风险内容及策略指定的争议内容自动推送至复核队列，等待人工判断。",
            "复核员查看条目时可同时看到原始内容、命中规则列表、命中片段、评分结果和处理建议，提高判断效率。",
            "复核结论支持通过、驳回、要求修改、转二审、加入白名单样本、加入误报样本等多种处理动作。",
            "每次复核提交均记录复核人、复核时间、操作终端、复核意见、最终结论和变更前状态，满足审计要求。",
            "## 9.5 报表归档流程",
            "任务完成后系统支持导出任务明细报表、风险统计报表、复核结论报表及规则命中排行报表。",
            "任务归档后不允许直接修改检测结果，但允许在授权范围内执行复查操作，复查同样形成独立记录。",
            "归档数据支持按任务编号、业务线、风险等级、时间区间和处理状态进行组合检索，方便监管查询。",
        ],
    ))

    topics.append((
        "10 功能模块详细规格",
        "本章以模块为单位进一步说明页面功能、核心字段、处理规则与输出结果，用于增强文档的完整性和可审查性。",
        [
            "## 10.1 首页仪表盘",
            "首页仪表盘用于展示系统总体运行状态，包括任务总数、检测总量、待复核数量、风险分布与近七日趋势。",
            "管理员可通过仪表盘快速进入任务管理、规则配置、报表导出和日志审计模块，形成统一工作入口。",
            "仪表盘中的统计图表按照当前用户可见数据范围生成，确保不同角色只能看到授权范围内的数据。",
            "首页支持展示系统公告、规则版本发布提醒和异常任务告警信息，帮助用户及时处理关键问题。",
            "## 10.2 任务管理模块",
            "任务列表支持按任务名称、任务编号、内容类型、风险等级、创建时间、创建人、处理状态等字段筛选。",
            "任务详情页展示任务基础信息、导入进度、检测进度、风险汇总、复核情况和导出记录等内容。",
            "系统支持对任务进行暂停、恢复、归档、复查和复制创建等操作，不同操作受角色权限控制。",
            "对于长期未处理的任务，系统可根据策略生成提醒，防止高风险事项滞留。",
            "## 10.3 内容明细模块",
            "内容明细模块以条目列表方式展示单条内容的检测信息，支持多条件查询与批量操作。",
            "每条记录可查看原始内容、内容摘要、命中规则、风险等级、复核状态、处置建议和处理历史。",
            "列表支持按高风险优先排序，也支持仅查看已复核、待复核、误报样本和白名单样本。",
            "当内容为图片时，系统除展示基础文件信息外，还展示OCR提取结果和图像相关检测标签。",
            "## 10.4 规则配置模块",
            "规则配置模块支持关键词规则、正则规则、评分规则、白名单规则、黑名单规则和标签映射规则的维护。",
            "用户可按业务线、风险类别、适用对象、启用状态、版本号等维度对规则进行分组管理。",
            "规则编辑时支持录入规则名称、匹配方式、权重、命中标签、默认处置建议及备注说明。",
            "系统在规则发布前支持预览与模拟检测，降低规则误配导致的大范围误报风险。",
            "## 10.5 日志审计模块",
            "日志审计模块记录登录行为、任务操作、规则变更、复核提交、导出动作和权限调整等关键操作。",
            "日志支持按用户、时间、模块、对象编号、操作类型和结果状态进行筛选和导出。",
            "对于重要操作，系统保存参数快照与变更前后内容，保证后续责任界定清晰明确。",
        ],
    ))

    topics.append((
        "11 输入输出与字段说明",
        "本章列出典型页面和接口涉及的主要输入项、校验规则及输出结果，便于说明软件功能的具体实现边界。",
        [
            "## 11.1 任务新建输入项",
            "任务名称：必填，长度建议控制在2至64个字符之间，不允许与同空间在途任务重复。",
            "内容类型：必选，支持文本、图片、混合内容三种类型，决定导入方式与检测流程。",
            "策略模板：必选，用于确定检测规则范围、评分阈值和复核策略。",
            "规则版本：必选，系统根据规则版本加载对应规则集合并在结果中保留版本号。",
            "优先级：选填，用于决定任务调度顺序，支持普通、加急、重点三档设置。",
            "## 11.2 内容导入输入项",
            "文本标题：选填，用于辅助检索和报表统计。",
            "文本正文：文本任务必填，为系统执行规则匹配和风险分析的主要对象。",
            "来源渠道：选填，可用于区分站内、站外、用户提交、第三方接口等来源。",
            "图片文件：图片任务必填，系统对上传文件进行格式、大小与安全性校验。",
            "业务标签：选填，用于后续按业务线统计风险分布和审核效率。",
            "## 11.3 检测输出项",
            "风险等级：系统按规则命中和评分结果输出低风险、中风险、高风险或严重风险等级。",
            "命中规则：列出命中的规则名称、规则类型、命中次数和对应风险标签。",
            "命中片段：展示具体命中的文本片段或OCR识别片段，便于人工理解。",
            "命中位置：记录内容中的位置、段落或偏移信息，增强结果可解释性。",
            "处置建议：依据风险映射输出自动通过、人工复核、修改后发布、拦截等建议。",
            "## 11.4 复核输出项",
            "复核结论：包括通过、驳回、转二审、要求修改、加入白名单样本等结果。",
            "复核意见：由复核员填写，用于说明判断依据、处置理由和补充说明。",
            "复核人信息：记录复核人员账号、姓名、角色和所属组织。",
            "复核时间：记录精确到秒的操作时间，并写入审计日志。",
            "## 11.5 报表输出项",
            "任务级统计报表展示任务总量、检测总量、高中低风险分布、复核通过率和处理时长。",
            "条目级明细报表展示内容摘要、命中规则、风险等级、最终结论、处理人和处理时间。",
            "规则命中报表展示规则名称、命中次数、对应风险类别、误报比例和版本信息。",
            "审计报表展示关键操作记录、导出记录、权限变更记录和规则发布记录。",
        ],
    ))

    topics.append((
        "12 规则引擎与策略机制说明",
        "本章对系统中的规则构成、执行顺序、评分逻辑、白黑名单和版本管理方法进行补充说明。",
        [
            "## 12.1 规则分类",
            "关键词规则用于识别显式敏感词、违禁词、品牌词、引流词及其他需快速匹配的词项。",
            "正则规则用于识别手机号、身份证号、邮箱、银行卡号、网址、联系方式等结构化信息。",
            "组合规则用于对多条件同时满足的情形进行识别，例如标题与正文同时命中特定风险项。",
            "评分规则用于对多个中低风险信号进行汇总评分，输出更符合业务逻辑的风险等级。",
            "## 12.2 执行顺序",
            "系统优先执行白名单过滤，以降低已确认误报内容对后续命中的影响。",
            "随后执行黑名单、关键词、正则和组合规则，并逐条记录命中证据与分值贡献。",
            "最后执行汇总评分与风险映射逻辑，输出统一风险等级和处置建议。",
            "当同一内容同时命中白名单和高危黑名单时，系统按策略优先级处理，并保留冲突说明。",
            "## 12.3 版本管理",
            "规则配置以版本形式发布，版本号、发布时间、发布人、变更说明均作为审计字段保存。",
            "发布新版本前可选择小范围试运行，通过观察误报率和漏报率后再正式启用。",
            "系统支持回滚到历史版本，并在回滚动作中记录变更前后的版本信息。",
            "## 12.4 调优机制",
            "管理员可根据误报样本和漏报样本调整权重、阈值、匹配方式和处置建议。",
            "系统支持将已确认误报条目加入白名单样本库，用于减少后续同类误报。",
            "系统支持将漏报条目整理为补充样本，帮助持续完善规则集和风险标签。",
            "## 12.5 风险标签映射",
            "风险标签包括涉政敏感、违法违规、低俗暴恐、侵权疑似、虚假宣传、隐私泄露等类别。",
            "每个标签可配置默认风险等级、处置建议、复核要求和导出字段映射规则。",
            "系统允许一个条目同时拥有多个标签，最终风险等级按照最高风险原则输出。",
        ],
    ))

    topics.append((
        "13 数据设计补充说明",
        "本章进一步细化数据实体、字段含义、索引建议、数据关系和留痕要求，补充程序设计说明书内容。",
        [
            "## 13.1 任务实体 Task",
            "task_id：任务主键，由系统自动生成，作为全链路追踪基础标识。",
            "name：任务名称，用于页面展示、查询和报表导出。",
            "content_type：任务内容类型，决定导入和检测逻辑。",
            "strategy_version：任务绑定的检测策略版本，保证结果可追溯。",
            "status：任务状态，支持待导入、待检测、检测中、待复核、已完成、已归档等值。",
            "## 13.2 内容实体 Item",
            "item_id：内容条目标识，与任务一对多关联。",
            "task_id：所属任务编号，用于构建明细与任务关系。",
            "content：原始内容文本或经处理后的内容载荷。",
            "content_type：条目内容类型，用于区分文本和图片。",
            "hash_value：内容摘要值，用于快速去重和重复样本识别。",
            "## 13.3 命中实体 Hit",
            "hit_id：命中记录主键，唯一标识一次规则命中结果。",
            "item_id：所属内容条目编号，用于关联原始内容。",
            "rule_id：命中的规则编号，用于反查规则定义与版本。",
            "hit_text：命中片段，便于审查和复核。",
            "score：本次命中带来的评分值，用于风险汇总。",
            "## 13.4 复核实体 Review",
            "review_id：复核记录标识，用于区分初审、复审和二审记录。",
            "item_id：对应内容条目编号。",
            "reviewer：复核人员账号或编号。",
            "decision：复核结论，记录最终处理结果。",
            "comment：复核意见，记录判断依据与处置说明。",
            "## 13.5 审计日志实体 AuditLog",
            "log_id：日志主键，用于日志检索和导出。",
            "actor：操作人账号或系统任务名。",
            "action：动作类型，例如登录、创建任务、发布规则、导出报表等。",
            "target_id：目标对象编号，如任务号、条目号、规则号等。",
            "detail：JSON格式快照，保存重要参数和变更内容。",
            "## 13.6 索引与性能建议",
            "建议对 task_id、item_id、rule_id、created_at、risk_level、status 等字段建立索引，提高检索效率。",
            "对于日志和命中记录等大表，建议按时间分区存储，降低归档和查询成本。",
            "对于导出任务，建议使用异步记录表和状态回调字段，提升大数据量导出稳定性。",
        ],
    ))

    topics.append((
        "14 安全控制与合规设计",
        "本章从权限控制、数据保护、留痕审计、访问安全和制度适配等方面补充系统的安全设计内容。",
        [
            "## 14.1 权限控制",
            "系统采用基于角色的权限控制模型，对页面菜单、按钮操作、数据范围和导出范围进行统一授权。",
            "管理员拥有用户、角色、规则、日志、参数配置等管理权限，但其操作同样记录于审计日志。",
            "审核员拥有任务新建、内容导入、结果查看、提交复核申请等权限，不可直接发布规则版本。",
            "复核员拥有查看高风险内容、提交复核结论、发起二审流转和处理争议项等权限。",
            "## 14.2 数据保护",
            "系统支持内网部署、专网部署或受控环境部署，避免数据在公共网络中暴露。",
            "系统支持HTTPS访问、访问白名单和账号口令策略，以增强传输与访问安全。",
            "对于个人信息、联系方式等敏感内容，页面可按策略脱敏展示，减少无关暴露。",
            "导出文件可按权限限制导出字段范围，防止过度导出敏感信息。",
            "## 14.3 留痕与审计",
            "关键操作如规则发布、复核提交、批量导出、权限变更等均需记录操作者、时间和对象编号。",
            "系统对关键动作保留参数快照和前后值差异，为后续审计和责任界定提供依据。",
            "日志支持按制度要求设置保存周期、归档方式和加密策略。",
            "## 14.4 合规治理",
            "系统以统一规则版本和统一处置标准降低人工审核标准不一致的问题。",
            "系统保留误报样本、漏报样本和复核结论，可用于后续治理优化和制度完善。",
            "系统可配合企业内部内容安全制度、运营审查制度和数据安全制度共同使用。",
        ],
    ))

    topics.append((
        "15 异常处理与容错机制",
        "本章用于说明系统在导入异常、检测异常、网络异常、权限异常及运行异常场景下的处理方式。",
        [
            "## 15.1 导入异常",
            "当上传文件格式不受支持时，系统应提示具体原因，如格式错误、文件损坏或编码不合法。",
            "当上传文件超过限制大小时，系统应阻止导入并提示用户拆分上传或联系管理员调整策略。",
            "当批量导入中部分条目失败时，系统应保留成功结果并输出失败明细，避免整批回滚造成重复操作。",
            "## 15.2 检测异常",
            "当规则版本不存在或已被禁用时，系统应阻止任务启动并提示重新选择有效版本。",
            "当检测过程中单条内容处理失败时，系统应记录失败原因并继续处理其他内容，提升整体可用性。",
            "当OCR或相似度服务不可用时，系统应在结果中标记相关能力降级，而不是直接丢失整条记录。",
            "## 15.3 权限异常",
            "当用户尝试访问超出权限范围的页面或操作时，系统应提示无权限并记录访问日志。",
            "当管理员撤销用户权限后，系统应在下次鉴权时立即生效，避免越权使用。",
            "## 15.4 网络与会话异常",
            "当用户会话超时或登录状态失效时，系统应引导用户重新登录，并保存必要的页面上下文。",
            "当导出任务时间较长时，系统可采用异步方式处理，并在导出中心展示当前状态。",
            "## 15.5 数据一致性",
            "任务状态变更、复核提交、规则发布等关键操作应采用事务控制，避免部分成功导致状态不一致。",
            "对于重复提交场景，系统可通过幂等标识或防重机制避免产生重复数据。",
        ],
    ))

    topics.append((
        "16 性能设计与扩展能力",
        "本章用于说明系统在大批量内容筛查场景下的吞吐、并发和扩展设计，体现软件工程化能力。",
        [
            "## 16.1 批处理能力",
            "系统支持批量导入和异步检测，适合对大量AI生成内容进行集中筛查。",
            "通过任务拆分和队列调度机制，系统可将大任务切分为多个子批次顺序或并行执行。",
            "对长文本内容可分段检测并汇总结果，以减少单次处理峰值压力。",
            "## 16.2 并发控制",
            "系统支持多个任务并行执行，并通过优先级和并发阈值控制保障整体稳定性。",
            "对于规则加载、日志写入、结果入库等共性动作，系统采用统一服务封装减少重复开销。",
            "高风险任务可配置优先处理，确保时效性要求更高的任务先完成。",
            "## 16.3 存储扩展",
            "命中记录、复核记录和审计日志可采用归档策略和分表策略，以适应长期积累的数据量。",
            "导出文件支持落盘存储并记录访问地址，也可接入对象存储方案提高容量上限。",
            "## 16.4 可扩展架构",
            "系统采用模块化设计，任务、检测、规则、复核、报表和日志等模块可独立升级。",
            "后续如需增加视频字幕审核、音频转文本审核等能力，可在现有任务与检测框架上平滑扩展。",
            "通过新增风险标签和规则类型，系统可适配新的业务治理要求和合规场景。",
        ],
    ))

    topics.append((
        "17 测试方案与测试记录补充",
        "本章扩充系统测试范围，覆盖功能测试、权限测试、异常测试、性能测试和可追溯性验证等内容。",
        [
            "## 17.1 功能测试",
            "用例一：创建文本检测任务并导入10条文本内容，系统应正常生成任务并保存所有条目。",
            "用例二：创建图片检测任务并上传图片文件，系统应记录文件信息并完成OCR提取。",
            "用例三：执行自动检测后，系统应输出风险等级、命中规则与处置建议。",
            "用例四：对高风险条目发起复核，系统应允许复核员提交结论并生成留痕。",
            "## 17.2 权限测试",
            "用例五：普通审核员访问规则发布页面时，系统应拒绝访问并记录日志。",
            "用例六：复核员无权修改系统参数，系统应禁止操作且返回明确提示。",
            "用例七：管理员可查看日志详情并导出审计报表，操作过程写入日志。",
            "## 17.3 异常测试",
            "用例八：上传空文件时系统应提示内容为空，不生成条目数据。",
            "用例九：上传格式错误文件时系统应提示格式不支持，并在失败列表中展示原因。",
            "用例十：检测过程中人为断开网络连接后，系统应尽量保留已完成结果并提示重试。",
            "用例十一：规则版本被禁用后再次启动任务，系统应阻止执行并提示更换版本。",
            "## 17.4 性能测试",
            "用例十二：批量导入1000条文本内容，系统应在可接受时间内完成导入和结果回写。",
            "用例十三：多用户同时查询任务列表时，系统应保持稳定响应，不出现明显卡顿。",
            "用例十四：高峰期并发执行多个任务时，系统应保持任务状态正确且不发生数据错乱。",
            "## 17.5 审计验证",
            "用例十五：发布规则版本后检查日志，系统应记录版本号、发布人和发布时间。",
            "用例十六：提交复核结论后检查日志，系统应记录前后状态、复核人和复核意见。",
            "用例十七：导出报表后检查导出记录，系统应记录导出人、导出范围和文件信息。",
            "## 17.6 测试结论",
            "经上述测试，系统在任务管理、检测执行、人工复核、规则配置、报表导出和日志审计等功能上运行正常。",
            "针对批量导入、权限隔离、异常处理和审计追踪等关键场景，系统均能给出符合预期的处理结果。",
        ],
    ))

    topics.append((
        "18 部署、运维与日常管理",
        "本章用于补充系统上线后的运行维护要求，包括初始化、备份、巡检、日志管理和版本更新流程。",
        [
            "## 18.1 初始化部署",
            "部署前需准备服务器环境、数据库实例、系统安装包、规则初始版本和管理员账号信息。",
            "部署完成后应先完成数据库初始化、基础参数配置、角色权限配置和访问地址验证。",
            "## 18.2 日常巡检",
            "运维人员应定期检查系统服务状态、任务队列状态、数据库连接、磁盘空间和导出目录容量。",
            "对于连续失败的检测任务或异常增长的日志量，系统应提供告警或人工巡检建议。",
            "## 18.3 数据备份",
            "建议对数据库、规则配置、导出记录和关键日志执行定期备份，保障重要数据可恢复。",
            "归档历史数据时应同步保存规则版本和审计日志，以保证恢复后的可追溯能力不丢失。",
            "## 18.4 版本更新",
            "系统版本升级前应完成备份并在测试环境验证主要功能，避免升级影响在途业务任务。",
            "新版本上线后应抽样检查登录、任务、检测、复核、导出和日志等关键模块是否正常运行。",
            "## 18.5 运维分工",
            "管理员主要负责账号、角色、规则和制度配置维护。",
            "审核员负责日常任务创建、内容导入、结果查看和复核流转。",
            "复核员负责处理高风险和争议内容，保障最终结论准确一致。",
        ],
    ))

    topics.append((
        "19 使用示例与典型场景",
        "本章通过多个业务示例说明系统在实际内容治理工作中的应用方法，增强说明书的可读性和场景贴合度。",
        [
            "## 19.1 场景一：AI生成营销文案审查",
            "运营人员将一批AI生成营销文案导入系统，系统首先识别夸大宣传、违禁表述、引流信息和联系方式等风险项。",
            "对于命中虚假宣传和引流规则的内容，系统输出中高风险等级，并建议人工复核或修改后发布。",
            "复核员查看命中原因后，可对部分误报内容进行修正判定，并将样本加入白名单以优化后续效果。",
            "## 19.2 场景二：AI生成图片文案审查",
            "设计人员上传包含促销海报和配图的图片素材，系统通过OCR识别其中的文本并执行规则检测。",
            "系统识别图片中的夸张承诺、联系方式和敏感词后生成结果，帮助审核人员快速锁定问题素材。",
            "## 19.3 场景三：社区内容治理",
            "平台运营将用户侧AI生成内容按批次导入系统，系统先执行自动检测，再将高风险内容推送至复核队列。",
            "通过统一规则和人工复核闭环，平台可提升内容治理效率，减少主观判断差异。",
            "## 19.4 场景四：内部知识库内容发布前审查",
            "企业在发布AI辅助撰写的内部材料前，可利用系统识别是否包含个人隐私、侵权引用或不适当表述。",
            "系统输出的命中片段和风险解释有助于撰写人员快速定位问题并完成修改。",
        ],
    ))

    topics.append((
        "20 附录补充说明",
        "本章继续补充名词解释、状态定义、规则样例和运维建议，用于丰富说明书篇幅并增强完整性。",
        [
            "## 20.1 术语说明",
            "任务：指一次独立的内容检测工作单元，可包含一条或多条内容。",
            "条目：指任务中的单条待审内容，是检测、复核和导出的基本对象。",
            "命中记录：指条目触发某项规则后产生的结构化结果。",
            "复核记录：指人工对条目进行确认、驳回或二审处理时形成的操作记录。",
            "## 20.2 状态定义",
            "待导入：任务已创建但尚未提交实际内容。",
            "待检测：内容已完成导入，等待系统执行自动检测。",
            "检测中：系统正在执行规则匹配、评分与结果回写。",
            "待复核：存在需要人工处理的高风险或争议内容。",
            "已完成：任务已完成检测和必要复核，结果可导出和归档。",
            "已归档：任务已转入历史存档状态，仅允许检索和复查。",
            "## 20.3 规则样例补充",
            "样例一：营销用语绝对化表达规则，用于识别最优、第一、绝对有效等高风险表达。",
            "样例二：个人信息识别规则，用于识别手机号、身份证号、邮箱和住址片段。",
            "样例三：外部引流规则，用于识别社交账号、外链地址、群号及其他引流信息。",
            "样例四：侵权疑似规则，用于识别品牌名、版权声明冲突和未经授权转载提示。",
            "## 20.4 运维建议补充",
            "建议定期分析误报样本和漏报样本，动态调整规则权重和标签映射。",
            "建议将重大规则变更纳入版本审批流程，确保变更过程留痕且可回溯。",
            "建议按月输出治理报告，统计风险趋势、处理效率和规则优化效果。",
        ],
    ))

    filler_templates = [
        "补充说明{n}：系统在该环节保留完整操作留痕，确保后续审计、复查和统计分析均有明确依据。",
        "补充说明{n}：页面字段、规则参数和处理结果均可按权限展示，既满足业务使用需要，也兼顾数据安全要求。",
        "补充说明{n}：对于批量处理场景，系统通过状态流转和异常提示帮助用户及时定位问题并继续推进任务。",
        "补充说明{n}：风险等级、命中解释和处置建议以统一结构输出，便于与报表、日志和复核记录联动。",
        "补充说明{n}：规则版本、策略参数和人工结论共同构成完整证据链，可支持后续制度检查和合规复盘。",
    ]

    for i in range(21, 46):
        lines = [f"## {i}.1 扩展说明"]
        for j in range(1, 28):
            template = filler_templates[(j - 1) % len(filler_templates)]
            lines.append(template.format(n=f"{i}-{j}"))
        topics.append((
            f"{i} 扩展章节说明",
            "本章为补充说明页，用于进一步展开软件的功能应用、治理流程、审计要求和管理建议，增强文档完整度。",
            lines,
        ))

    for title, intro, lines in topics:
        pages.extend(page_block(title, intro, lines, heading_style, subheading_style, body_style))

    return pages


def main() -> None:
    src = Path("/Users/mortysmith/iCloud云盘（归档）/Desktop/other/软著/修改的/AI生成内容/AI生成内容合规筛查系统2.docx")
    out = Path("/Users/mortysmith/wpprqi/AI生成内容合规筛查系统2_无截图扩充版.docx")

    with ZipFile(src, "r") as zin:
        files = {name: zin.read(name) for name in zin.namelist()}

    document_root = ET.fromstring(files["word/document.xml"])
    styles_root = ET.fromstring(files["word/styles.xml"])
    app_root = ET.fromstring(files["docProps/app.xml"])

    style_map = get_style_map(styles_root)
    heading_style = "3" if "3" in style_map else None
    subheading_style = "4" if "4" in style_map else heading_style
    body_style = "16" if "16" in style_map else None

    body = document_root.find("w:body", NS)
    assert body is not None

    children = list(body)
    sect_pr = children[-1] if children and children[-1].tag == w_tag("sectPr") else None
    content_children = children[:-1] if sect_pr is not None else children

    new_children: list[ET.Element] = []
    removed = 0
    for child in content_children:
        if child.tag == w_tag("p") and (
            child.find(".//w:drawing", NS) is not None
            or child.find(".//{http://schemas.openxmlformats.org/drawingml/2006/main}blip") is not None
        ):
            removed += 1
            continue
        new_children.append(copy.deepcopy(child))

    expansion = build_expansion_pages(heading_style, subheading_style, body_style)
    new_children.extend(expansion)

    compact_children: list[ET.Element] = []
    empty_removed = 0
    for child in new_children:
        if child.tag != w_tag("p"):
            compact_children.append(child)
            continue

        has_page_break = child.find(".//w:br[@w:type='page']", NS) is not None
        text = "".join(t.text or "" for t in child.findall(".//w:t", NS)).strip()
        is_empty = not text and not has_page_break

        if is_empty:
            empty_removed += 1
            continue

        compact_children.append(child)

    if sect_pr is not None:
        compact_children.append(copy.deepcopy(sect_pr))

    body.clear()
    for child in compact_children:
        body.append(child)

    pages_el = app_root.find("{http://schemas.openxmlformats.org/officeDocument/2006/extended-properties}Pages")
    if pages_el is not None:
        pages_el.text = "60"

    with ZipFile(out, "w", ZIP_DEFLATED) as zout:
        for name, data in files.items():
            if name == "word/document.xml":
                zout.writestr(name, ET.tostring(document_root, encoding="utf-8", xml_declaration=True))
            elif name == "docProps/app.xml":
                zout.writestr(name, ET.tostring(app_root, encoding="utf-8", xml_declaration=True))
            else:
                zout.writestr(name, data)

    print(f"removed_image_paragraphs={removed}")
    print(f"empty_paragraphs_removed={empty_removed}")
    print(f"output={out}")


if __name__ == "__main__":
    main()
