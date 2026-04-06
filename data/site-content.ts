export const navItems = [
  { href: "#positioning", label: "定位" },
  { href: "#matrix", label: "知识矩阵" },
  { href: "#path", label: "方法路径" },
  { href: "#artifacts", label: "内容资产" },
  { href: "#contact", label: "合作入口" }
] as const;

export const signals = [
  {
    eyebrow: "Trust",
    value: "01",
    description: "首页首先建立信任感，而不是立刻销售。气质正确，后续模块才有说服力。"
  },
  {
    eyebrow: "Density",
    value: "04",
    description: "信息密度被重新分层，重点更清楚，用户不会在第一屏就被冗余说明淹没。"
  },
  {
    eyebrow: "Motion",
    value: "12",
    description: "滚动、灯光、卡片微动和空间景深一起工作，页面像一个正在运行的系统。"
  },
  {
    eyebrow: "Intent",
    value: "100",
    description: "每个区块都围绕知识体系化和个人品牌化两个关键词，不再只是内容堆叠。"
  }
] as const;

export const modules = [
  {
    slug: "foundation",
    index: "Module 01",
    tag: "Foundation",
    title: "涉外专利入门认知",
    description: "帮助新手建立完整的涉外专利坐标系，不只是认识名词，而是理解制度节点之间的逻辑关系。",
    overview:
      "这一模块解决的是最根本的问题：为什么很多人学了大量涉外专利概念，仍然无法形成判断。原因通常不是知识不够，而是没有形成结构化坐标系。",
    items: [
      "PCT、巴黎公约、国家阶段的整体路径搭建",
      "五局差异与不同市场下的策略基线",
      "把知道流程升级为会做路径判断"
    ],
    outcomes: [
      "能用一张完整结构图解释涉外申请路径",
      "能识别不同局别与市场中的核心差异",
      "能从流程认知切到初步策略判断"
    ],
    sections: [
      {
        title: "制度坐标",
        body: "把巴黎公约优先权、PCT 国际阶段、国家阶段和地区性进入之间的关系拆成一张真正能用的地图。"
      },
      {
        title: "五局差异",
        body: "不再只记忆 USPTO、EPO、CNIPA、JPO、KIPO 的名称，而是理解它们在审查语气、时间轴和文书风格上的差异。"
      },
      {
        title: "路径选择",
        body: "把学习结果落回具体情境，知道什么情况下应该先看流程，什么情况下应该先看市场和策略。"
      }
    ],
    metrics: [
      { label: "Core Layers", value: "03" },
      { label: "Essential Paths", value: "08" },
      { label: "Reading Time", value: "2.5h" }
    ],
    quote: "学习涉外专利的第一步不是背概念，而是先建立一张不会迷路的地图。"
  },
  {
    slug: "execution",
    index: "Module 02",
    tag: "Execution",
    title: "实务文件与答复逻辑",
    description: "聚焦真正会拉开专业差距的工作场景，让网站直接呈现你处理案件、文件和表达的成熟度。",
    overview:
      "这里是最能体现专业门槛的部分。用户会从这里判断你是否真正做过案件、读过文件、写过答复，而不是只会讲概念。",
    items: [
      "EESR、US OA、EP 审查意见与答复结构",
      "翻译、措辞与语义风险控制的判断模型",
      "从案件阅读到成稿逻辑的连续训练"
    ],
    outcomes: [
      "会拆审查意见中的真正争点",
      "能看出翻译和改写中的风险点",
      "能把答复写作理解为结构化推演而不是经验拼接"
    ],
    sections: [
      {
        title: "文件拆解",
        body: "把 EESR、US OA、EP 报告拆成具备比较价值的框架，让用户真正理解不同体系下的文书逻辑。"
      },
      {
        title: "表达控制",
        body: "围绕 claim wording、术语替换、语义收缩和风险边界，建立更成熟的表达判断。"
      },
      {
        title: "成稿路径",
        body: "把从读文件、找争点、设计逻辑到写出答复的完整过程可视化，而不是只展示结果。"
      }
    ],
    metrics: [
      { label: "Case Layers", value: "06" },
      { label: "Response Scenes", value: "12" },
      { label: "Practice Depth", value: "ADV" }
    ],
    quote: "真正的专业差距，往往不是体现在知道什么，而是体现在如何写。"
  },
  {
    slug: "library",
    index: "Module 03",
    tag: "Library",
    title: "欧美专利阅读体系",
    description: "把精选书目、重点章节与实务映射整合成阅读系统，让输入不再停留在收藏层面。",
    overview:
      "很多人的书单看起来很满，但并没有真正形成判断能力。这一模块要解决的是从阅读到认知沉淀的转换问题。",
    items: [
      "经典文本筛选与阅读顺序设计",
      "关键概念对照与笔记沉淀的方法",
      "把阅读材料转成自己的判断语言"
    ],
    outcomes: [
      "建立有顺序的阅读栈而不是无序收藏",
      "知道哪些章节值得精读、哪些适合索引",
      "把笔记升级成可复用的表达素材"
    ],
    sections: [
      {
        title: "阅读层级",
        body: "把书目拆成基础、进阶和实务映射三层，让阅读不再只有推荐清单。"
      },
      {
        title: "笔记结构",
        body: "强调术语对照、章节卡片、案例映射和反复复用的笔记体系。"
      },
      {
        title: "输出转化",
        body: "最终目标不是读完，而是把读到的内容变成你自己的判断语言和内容资产。"
      }
    ],
    metrics: [
      { label: "Reading Tracks", value: "03" },
      { label: "Core Texts", value: "18" },
      { label: "Knowledge Yield", value: "HIGH" }
    ],
    quote: "读书真正有价值的部分，不在于看过，而在于它最终能不能变成你的语言。"
  },
  {
    slug: "leverage",
    index: "Module 04",
    tag: "Leverage",
    title: "AI 辅助知识工作流",
    description: "把专业经验、模板与 AI 操作流程接起来，让知识不仅能学，还能成为持续输出与变现能力。",
    overview:
      "这一层是品牌站真正拉开差距的部分。你不只是在做知识内容，而是在展示一套可扩展的个人操作系统。",
    items: [
      "知识拆解、归档、提示词与模板化协作",
      "从案例阅读到内容生产的流程设计",
      "把个人经验沉淀成可复用的操作系统"
    ],
    outcomes: [
      "把知识工作从手工流程升级为系统协作",
      "建立提示词、模板、案例和内容之间的连接",
      "把个人经验转成长期复利的产品能力"
    ],
    sections: [
      {
        title: "知识管线",
        body: "从资料抽取、知识整理、标签化归档到生成式协作，形成稳定可复用的知识工作流。"
      },
      {
        title: "内容生产",
        body: "把案件阅读、观点整理、脚本草稿和长文大纲串起来，降低输出成本。"
      },
      {
        title: "商业接口",
        body: "最终落点是个人品牌、咨询、会员内容或训练营等承接方式，让知识真正形成复利。"
      }
    ],
    metrics: [
      { label: "Workflow Nodes", value: "09" },
      { label: "Prompt Layers", value: "16" },
      { label: "Business Readiness", value: "ON" }
    ],
    quote: "AI 最重要的价值不是替你思考，而是帮你把经验组织成一个能反复运行的系统。"
  }
] as const;

export const pathSteps = [
  {
    label: "01 / Position",
    title: "先用品牌气质建立判断门槛",
    description: "用户先感受到审美、秩序和专业性，才会愿意把注意力交给更深的知识内容。"
  },
  {
    label: "02 / Structure",
    title: "再把知识拆成清晰的成长路径",
    description: "模块化排布让内容不再松散，用户可以快速理解每个板块在体系中的位置。"
  },
  {
    label: "03 / Experience",
    title: "用电影感动效增加页面的生命感",
    description: "GSAP 驱动的节奏、磁吸按钮、层叠视差和 3D 场景一起工作，视觉更有记忆点。"
  },
  {
    label: "04 / Conversion",
    title: "最后把流量导向更具体的合作关系",
    description: "首页只负责建立品牌与信任，后续可以继续扩成详情页、样章页、咨询页和会员页。"
  }
] as const;

export const artifacts = [
  {
    slug: "eesr-response-slice",
    eyebrow: "Artifact 01",
    tag: "Case Slice",
    title: "案件切片页面",
    description: "把真实文件、要点提炼、判断逻辑和答复思路做成可浏览的案例型详情页。",
    longDescription:
      "案例切片页的意义不是展示你做过什么，而是展示你如何思考。通过文件摘录、争点分层、术语选择和答复路径，用户能直接感受到你的专业判断风格。",
    details: [
      ["EESR / US OA / EP 响应结构", "精选示例"],
      ["风险点标注与表达取舍", "判断展示"],
      ["从原文到输出框架", "可复用流程"]
    ],
    highlights: [
      "审查意见拆分与争点归类",
      "核心术语与风险边界标注",
      "答复结构的逻辑设计与改写路径"
    ]
  },
  {
    slug: "reading-stack-system",
    eyebrow: "Artifact 02",
    tag: "Reading Stack",
    title: "阅读与书单体系",
    description: "不只是列出推荐书目，而是展示你如何把经典文本变成自己判断体系的一部分。",
    longDescription:
      "这一页更像一张阅读地图。用户能够看见哪些文本负责打底，哪些负责拓展判断边界，哪些会被映射回实际案件与内容产出。",
    details: [
      ["分层书单与学习顺序", "路径设计"],
      ["重点章节摘录与概念索引", "知识整理"],
      ["实务映射与个人笔记系统", "认知沉淀"]
    ],
    highlights: [
      "基础、进阶与实务三层阅读路径",
      "笔记索引与概念对照体系",
      "从阅读到输出的知识转译策略"
    ]
  },
  {
    slug: "ai-workflow-ops",
    eyebrow: "Artifact 03",
    tag: "AI Workflow",
    title: "AI 协作工作流",
    description: "把你的知识产品从内容升级为操作系统，这是后续最容易形成差异化的部分。",
    longDescription:
      "这一类页面承担的是方法论展示功能。用户会看到 AI 在你的知识系统里并不是装饰，而是参与知识抽取、整理、生成和发布的完整工作流节点。",
    details: [
      ["知识抽取、分类与模板化", "效率升级"],
      ["阅读总结到内容生成的链路", "输出系统"],
      ["个人品牌与商业化接口", "长期复利"]
    ],
    highlights: [
      "案例、模板、提示词和内容之间的连接方式",
      "可复用的知识工作节点设计",
      "品牌内容生产与商业承接链路"
    ]
  }
] as const;

export function getModuleBySlug(slug: string) {
  return modules.find((item) => item.slug === slug);
}

export function getArtifactBySlug(slug: string) {
  return artifacts.find((item) => item.slug === slug);
}
