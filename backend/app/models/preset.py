from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class AnalysisCard(BaseModel):
    id: str
    name: str
    icon: str
    description: str

class Preset(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    color: str
    target_audience: str
    report_style: List[str]
    focus_analysis: List[str]
    temperature: float
    custom_cards: List[AnalysisCard] = []

# Standard cards that appear for all presets
STANDARD_CARDS = [
    AnalysisCard(
        id="summary",
        name="Краткое содержание",
        icon="📝",
        description="Общий обзор разговора"
    ),
    AnalysisCard(
        id="ai_judge",
        name="ИИ-судья",
        icon="⚖️",
        description="Объективная оценка качества общения"
    ),
    AnalysisCard(
        id="emotion_timeline",
        name="Временная шкала эмоций",
        icon="📈",
        description="Как менялись эмоции в ходе разговора"
    ),
    AnalysisCard(
        id="ai_chatbot",
        name="ИИ-чатбот",
        icon="🤖",
        description="Задайте вопросы об анализе разговора"
    ),
    AnalysisCard(
        id="suggested_responses",
        name="Предложенные ответы",
        icon="💡",
        description="Конкретные фразы для улучшения общения"
    )
]

# Default preset - uses current settings
DEFAULT_PRESET = Preset(
    id="default",
    name="Стандартный",
    description="Базовый анализ разговоров с балансом эмоциональных и фактических данных",
    icon="🔍",
    color="neon-blue",
    target_audience="Все пользователи",
    report_style=["Сбалансированный тон", "Факты и эмоции"],
    focus_analysis=["Общий анализ", "Эмоциональная динамика", "Скрытые смыслы"],
    temperature=0.7,
    custom_cards=[]
)

# Teen Navigator preset
TEEN_NAVIGATOR_PRESET = Preset(
    id="teen_navigator",
    name="Подростковый Навигатор",
    description="Специализированный анализ подростковой коммуникации с фокусом на эмоциональную безопасность, распознавание токсичных паттернов и поддержку здоровых отношений",
    icon="🚀",
    color="neon-purple",
    target_audience="Подростки, родители подростков, школьные психологи",
    report_style=["Современный и неформальный язык", "Активное использование эмодзи и визуальных элементов", 
                 "Короткие, легко усваиваемые абзацы", "Интерактивные элементы и рекомендации в формате 'как бы ты поступил?'"],
    focus_analysis=["Выявление признаков давления или буллинга", "Анализ групповой динамики", 
                   "Распознавание скрытых эмоций и неуверенности", "Определение здоровых и нездоровых коммуникационных паттернов"],
    temperature=0.85,
    custom_cards=[
        AnalysisCard(
            id="safety_check",
            name="Проверка безопасности",
            icon="🛡️",
            description="Индикаторы буллинга или давления, уровень эмоциональной безопасности коммуникации, рекомендации по защите личных границ"
        ),
        AnalysisCard(
            id="emotion_dictionary",
            name="Словарь эмоций",
            icon="🧠",
            description="Расшифровка скрытых эмоций в простых терминах, примеры из разговора с объяснением подтекста, интерактивный тест 'Угадай эмоцию'"
        ),
        AnalysisCard(
            id="social_compass",
            name="Социальный компас",
            icon="🧭",
            description="Анализ групповой динамики, выявление 'внутренних кругов' и исключений, советы по навигации в социальных ситуациях"
        )
    ]
)

# Family Balance preset
FAMILY_BALANCE_PRESET = Preset(
    id="family_balance",
    name="Семейный Баланс",
    description="Глубокий анализ семейной коммуникации с фокусом на баланс потребностей всех членов семьи, распознавание паттернов и циклов",
    icon="🏡",
    color="neon-turquoise",
    target_audience="Пары, семьи с детьми, семейные терапевты",
    report_style=["Теплый, поддерживающий тон", "Сбалансированное внимание к перспективам всех сторон", 
                "Акцент на решениях, а не проблемах", "Практические рекомендации и упражнения"],
    focus_analysis=["Циклические паттерны коммуникации", "Баланс близости и автономии", 
                   "Выражение и принятие потребностей", "Ролевые модели в семейной системе", "Невысказанные ожидания"],
    temperature=0.7,
    custom_cards=[
        AnalysisCard(
            id="communication_cycles",
            name="Коммуникационные циклы",
            icon="🔄",
            description="Визуализация повторяющихся паттернов коммуникации, точки триггера и эскалации, способы прерывания негативных циклов"
        ),
        AnalysisCard(
            id="needs_map",
            name="Карта потребностей",
            icon="❤️",
            description="Анализ выраженных и невыраженных потребностей каждой стороны, зоны совпадения и расхождения потребностей, рекомендации по выражению потребностей"
        ),
        AnalysisCard(
            id="family_roles",
            name="Семейные роли",
            icon="👨‍👩‍👧‍👦",
            description="Анализ распределения ролей в семейной динамике, баланс ответственности и принятия решений, рекомендации по гармонизации ролей"
        )
    ]
)

# Strategic HR preset
STRATEGIC_HR_PRESET = Preset(
    id="strategic_hr",
    name="Стратегический HR",
    description="Продвинутый анализ деловой коммуникации для HR-специалистов с фокусом на командную динамику, лидерство, распределение ролей",
    icon="📊",
    color="neon-blue",
    target_audience="HR-директора, менеджеры, руководители команд",
    report_style=["Профессиональный, деловой тон", "Количественные метрики и визуализации", 
                "Структурированный формат с ключевыми выводами", "Сопоставление с лучшими практиками"],
    focus_analysis=["Качество лидерства и делегирования", "Вовлеченность членов команды", 
                   "Эффективность принятия решений", "Психологическая безопасность в команде", "Коммуникационные барьеры"],
    temperature=0.5,
    custom_cards=[
        AnalysisCard(
            id="team_analytics",
            name="Командная аналитика",
            icon="📋",
            description="Квантифицированные метрики коммуникации, распределение времени говорения/участия, эффективность достижения целей обсуждения"
        ),
        AnalysisCard(
            id="psychological_safety",
            name="Психологическая безопасность",
            icon="🌱",
            description="Уровень психологической безопасности в команде, анализ открытости и доверия в коммуникации"
        ),
        AnalysisCard(
            id="professional_growth",
            name="Профессиональный рост",
            icon="📈",
            description="Анализ коммуникационных навыков членов команды, области для развития, персонализированные рекомендации по обучению"
        )
    ]
)

# List of all available presets
ALL_PRESETS = [
    DEFAULT_PRESET,
    TEEN_NAVIGATOR_PRESET,
    FAMILY_BALANCE_PRESET,
    STRATEGIC_HR_PRESET
]

# Get preset by ID
def get_preset_by_id(preset_id: str) -> Optional[Preset]:
    for preset in ALL_PRESETS:
        if preset.id == preset_id:
            return preset
    return DEFAULT_PRESET

# Pydantic models for API requests/responses
class PresetCreate(BaseModel):
    name: str
    description: str
    icon: str
    color: str
    target_audience: str
    report_style: List[str]
    focus_analysis: List[str]
    temperature: float
    custom_cards: List[AnalysisCard] = []

class PresetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    target_audience: Optional[str] = None
    report_style: Optional[List[str]] = None
    focus_analysis: Optional[List[str]] = None
    temperature: Optional[float] = None
    custom_cards: Optional[List[AnalysisCard]] = None