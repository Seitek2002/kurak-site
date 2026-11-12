/**
 * Меню услуг. Категории названы задачами клиента, а не отделами агентства
 * (концепция, раздел «Меню услуг»). Список черновой: собственница правит и дополняет.
 *
 * Каждая категория = свой «лоскут»: цвет и узор. Цвет категории сквозной по сайту:
 * меню, кейсы, руководители, подборка.
 */

export type CategoryId =
  | "smm"
  | "pr"
  | "events"
  | "brand"
  | "sales"
  | "digital"
  | "team"
  | "invest";

export type TaskTag = "launch" | "sales" | "rebrand" | "hiring";

export const TASKS: { id: TaskTag; label: string }[] = [
  { id: "launch", label: "Запуск" },
  { id: "sales", label: "Рост продаж" },
  { id: "rebrand", label: "Ребрендинг" },
  { id: "hiring", label: "Найм" },
];

export type Service = {
  id: string;
  title: string;
  /** Что входит: три коротких пункта */
  includes: [string, string, string];
  /** С какой задачей обычно приходят. Сценарий, а не факт и не кейс. */
  ask: string;
  tags: TaskTag[];
};

export type Lead = {
  /** null: имя ещё не прислали, на сайте стоит пометка-пропуск */
  name: string | null;
  role: string;
  withPartners?: boolean;
};

export type Category = {
  id: CategoryId;
  n: string;
  goal: string;
  short: string;
  lead: Lead;
  motif: Motif;
  services: Service[];
};

export type Motif =
  | "hourglass"
  | "diagonal"
  | "diamond"
  | "geese"
  | "pinwheel"
  | "strips"
  | "checker"
  | "star";

export const CATEGORIES: Category[] = [
  {
    id: "smm",
    n: "01",
    goal: "Чтобы о вас узнали",
    short: "SMM",
    lead: { name: null, role: "Руководитель SMM" },
    motif: "hourglass",
    services: [
      {
        id: "smm-strategy",
        title: "Стратегия и ведение соцсетей",
        includes: ["Аудит и стратегия на квартал", "Контент-план и публикации", "Ответы подписчикам и отчёт"],
        ask: "Аккаунт есть, но живёт рывками и не приводит клиентов",
        tags: ["launch", "sales"],
      },
      {
        id: "smm-content",
        title: "Контент-продакшн: фото, видео, дизайн",
        includes: ["Съёмки продукта и команды", "Reels и короткие ролики", "Дизайн постов и сторис"],
        ask: "Нужен контент, за который не стыдно перед конкурентами",
        tags: ["launch", "rebrand"],
      },
      {
        id: "smm-target",
        title: "Таргетированная реклама",
        includes: ["Кабинеты и пиксели", "Креативы и тесты аудиторий", "Отчёт по заявкам каждую неделю"],
        ask: "Реклама крутится, а заявки редкие и дорогие",
        tags: ["sales", "launch"],
      },
      {
        id: "smm-bloggers",
        title: "Работа с блогерами",
        includes: ["Подбор блогеров под аудиторию", "Сценарии и договорённости", "Контроль выходов и охватов"],
        ask: "Хочется, чтобы о вас рассказали люди, которым верят",
        tags: ["launch", "sales"],
      },
    ],
  },
  {
    id: "pr",
    n: "02",
    goal: "Чтобы о вас говорили",
    short: "PR",
    lead: { name: null, role: "Руководитель PR" },
    motif: "diamond",
    services: [
      {
        id: "pr-media",
        title: "Публикации в СМИ",
        includes: ["Инфоповоды и пресс-релизы", "Договорённости с редакциями", "Подборка вышедших материалов"],
        ask: "Есть что рассказать, но журналисты о вас не знают",
        tags: ["launch", "rebrand"],
      },
      {
        id: "pr-personal",
        title: "Личный бренд руководителя",
        includes: ["Позиционирование и темы", "Соцсети руководителя", "Выступления и интервью"],
        ask: "Основатель сильный, но его знают только сотрудники",
        tags: ["rebrand", "hiring"],
      },
      {
        id: "pr-crisis",
        title: "Антикризисный PR",
        includes: ["Быстрая оценка ситуации", "Позиция и тексты для ответа", "Работа с комментариями и СМИ"],
        ask: "О компании пишут плохое, и это видят клиенты",
        tags: ["rebrand"],
      },
    ],
  },
  {
    id: "events",
    n: "03",
    goal: "Чтобы вас увидели вживую",
    short: "Ивенты",
    lead: { name: "Бибинур", role: "Руководитель ивент-отдела" },
    motif: "star",
    services: [
      {
        id: "ev-brand",
        title: "Бренд-ивенты и презентации",
        includes: ["Концепция и сценарий", "Площадка, подрядчики, тайминг", "Съёмка и посты по следам"],
        ask: "Открываетесь или запускаете продукт и хотите, чтобы это заметили",
        tags: ["launch"],
      },
      {
        id: "ev-forum",
        title: "Конференции и форумы",
        includes: ["Программа и спикеры", "Регистрация и логистика гостей", "Сцена, техника, трансляция"],
        ask: "Нужно собрать отрасль в одном зале",
        tags: ["sales", "rebrand"],
      },
      {
        id: "ev-corporate",
        title: "Корпоративные мероприятия",
        includes: ["Идея под вашу команду", "Организация под ключ", "Фото и видео на память"],
        ask: "Команда выросла, и её пора собрать вместе",
        tags: ["hiring"],
      },
    ],
  },
  {
    id: "brand",
    n: "04",
    goal: "Чтобы вас узнавали",
    short: "Брендинг",
    lead: { name: "Нурчик", role: "Ведущий дизайнер" },
    motif: "diagonal",
    services: [
      {
        id: "br-position",
        title: "Позиционирование и ребрендинг",
        includes: ["Исследование рынка и клиентов", "Платформа бренда", "План перехода на новый образ"],
        ask: "Вас путают с конкурентами, или бренд вырос из старого образа",
        tags: ["rebrand", "launch"],
      },
      {
        id: "br-identity",
        title: "Айдентика и фирменный стиль",
        includes: ["Логотип и знак", "Цвета, шрифты, носители", "Брендбук для команды"],
        ask: "Каждый макет выглядит по-своему, и бренд не складывается",
        tags: ["rebrand", "launch"],
      },
    ],
  },
  {
    id: "sales",
    n: "05",
    goal: "Чтобы покупали",
    short: "Продажи",
    lead: { name: "Оксана", role: "Проект-менеджер, вместе с партнёрами", withPartners: true },
    motif: "pinwheel",
    services: [
      {
        id: "sa-dept",
        title: "Настройка отдела продаж",
        includes: ["Аудит воронки и звонков", "Скрипты и регламенты", "Обучение менеджеров"],
        ask: "Заявки приходят, а продаж меньше, чем могло бы быть",
        tags: ["sales"],
      },
      {
        id: "sa-crm",
        title: "Внедрение CRM",
        includes: ["Система под ваш процесс", "Воронки и интеграции", "Обучение команды"],
        ask: "Клиенты теряются между WhatsApp, таблицами и памятью менеджера",
        tags: ["sales"],
      },
      {
        id: "sa-auto",
        title: "Автоматизация бизнес-процессов",
        includes: ["Разбор рутинных процессов", "Боты и интеграции", "Отчёты без ручного сбора"],
        ask: "Сотрудники тратят часы на то, что может делать бот",
        tags: ["sales"],
      },
    ],
  },
  {
    id: "digital",
    n: "06",
    goal: "Чтобы было где покупать",
    short: "Сайты и приложения",
    lead: { name: "Оксана", role: "Проект-менеджер, вместе с партнёрами", withPartners: true },
    motif: "checker",
    services: [
      {
        id: "di-site",
        title: "Сайты и лендинги",
        includes: ["Структура и тексты", "Дизайн и разработка", "Аналитика и пиксели с первого дня"],
        ask: "Клиенты ищут вас в интернете и находят конкурентов",
        tags: ["launch", "rebrand", "sales"],
      },
      {
        id: "di-app",
        title: "Мобильные приложения",
        includes: ["Прототип и сценарии", "Дизайн и разработка", "Публикация в App Store и Google Play"],
        ask: "Покупатели возвращаются, и им нужен удобный повод",
        tags: ["sales"],
      },
    ],
  },
  {
    id: "team",
    n: "07",
    goal: "Чтобы было кому работать",
    short: "Найм",
    lead: { name: "Оксана", role: "Проект-менеджер, маркетолог" },
    motif: "geese",
    services: [
      {
        id: "te-hire",
        title: "Набор сотрудников",
        includes: ["Профиль кандидата", "Поиск и первые интервью", "Шорт-лист и выход на работу"],
        ask: "Бизнес растёт быстрее, чем вы успеваете нанимать",
        tags: ["hiring", "launch"],
      },
      {
        id: "te-hrbrand",
        title: "HR-бренд и реклама вакансий",
        includes: ["Образ работодателя", "Тексты и визуал вакансий", "Реклама на нужную аудиторию"],
        ask: "Вакансии висят неделями, а откликов мало",
        tags: ["hiring"],
      },
    ],
  },
  {
    id: "invest",
    n: "08",
    goal: "Чтобы расти",
    short: "Инвестиции",
    lead: { name: "Оксана", role: "Проект-менеджер, маркетолог" },
    motif: "strips",
    services: [
      {
        id: "in-pitch",
        title: "Подготовка к привлечению и питч-дек",
        includes: ["Упаковка модели и цифр", "Питч-дек и презентация", "Подготовка к встречам с инвесторами"],
        ask: "Бизнес готов к росту, и нужен партнёр с деньгами",
        tags: ["launch"],
      },
    ],
  },
];

export const SERVICE_INDEX: Record<string, { service: Service; category: Category }> =
  Object.fromEntries(
    CATEGORIES.flatMap((category) =>
      category.services.map((service) => [service.id, { service, category }]),
    ),
  );

export const CATEGORY_INDEX = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

/** Готовые сеты, как комбо у Додо, но без цен. */
export type Bundle = {
  id: string;
  title: string;
  line: string;
  services: string[];
};

export const BUNDLES: Bundle[] = [
  {
    id: "launch",
    title: "Запуск бизнеса",
    line: "От имени и логотипа до первых клиентов и открытия.",
    services: ["br-position", "br-identity", "di-site", "smm-strategy", "smm-target", "ev-brand"],
  },
  {
    id: "rebrand",
    title: "Ребрендинг под ключ",
    line: "Новый образ, который замечают клиенты, пресса и сотрудники.",
    services: ["br-position", "br-identity", "smm-content", "pr-media", "di-site"],
  },
  {
    id: "flow",
    title: "Поток заявок",
    line: "Реклама приводит людей, отдел продаж их не теряет.",
    services: ["smm-target", "smm-strategy", "sa-dept", "sa-crm"],
  },
];
