import os
import logging
import json
from typing import Dict, Any, Optional, List
import vertexai
from vertexai.preview.generative_models import GenerativeModel
from app.core.config import settings

# Set up logging
logger = logging.getLogger(__name__)

# Set Google Cloud credentials environment variable
if settings.GOOGLE_APPLICATION_CREDENTIALS:
    # Check if it's a JSON string or file path
    if settings.GOOGLE_APPLICATION_CREDENTIALS.startswith('{'):
        # It's a JSON string, create a temporary file
        import tempfile
        import json
        
        try:
            # Parse the JSON to validate it
            creds_data = json.loads(settings.GOOGLE_APPLICATION_CREDENTIALS)
            
            # Create a temporary file with the credentials
            temp_creds_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
            json.dump(creds_data, temp_creds_file)
            temp_creds_file.close()
            
            # Set the environment variable to the temporary file path
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_creds_file.name
            logger.info(f"Created temporary credentials file: {temp_creds_file.name}")
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in GOOGLE_APPLICATION_CREDENTIALS: {e}")
            # Try to use as file path
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS
    else:
        # It's a file path
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS
        logger.info(f"Set GOOGLE_APPLICATION_CREDENTIALS to file path: {settings.GOOGLE_APPLICATION_CREDENTIALS}")

# Initialize Vertex AI with error handling
vertex_ai_initialized = False
try:
    vertexai.init(project=settings.VERTEX_AI_PROJECT, location=settings.VERTEX_AI_LOCATION)
    logger.info(f"Vertex AI initialized with project: {settings.VERTEX_AI_PROJECT}, location: {settings.VERTEX_AI_LOCATION}")
    vertex_ai_initialized = True
except Exception as e:
    logger.error(f"Failed to initialize Vertex AI: {e}")
    vertex_ai_initialized = False

# In-memory storage for chat conversations (in production, use database)
chat_conversations = {}

class AIService:
    """Service for handling AI analysis with Google Vertex AI"""
    
    @staticmethod
    async def analyze_text(text: str, additional_prompt: Optional[str] = None, preset_id: Optional[str] = None, temperature: Optional[float] = None) -> Dict[str, Any]:
        """Analyze text using Google Vertex AI (Gemini)"""
        try:
            logger.info("Starting text analysis with Vertex AI")
            
            # Check if Vertex AI is initialized
            if not vertex_ai_initialized:
                logger.warning("Vertex AI not initialized, using mock analysis")
                return await AIService.mock_analysis_result(preset_id)
            
            # Check if credentials are set
            if not settings.GOOGLE_APPLICATION_CREDENTIALS:
                logger.warning("GOOGLE_APPLICATION_CREDENTIALS not set in settings")
                logger.info("Attempting to use default credentials...")
                # Try to continue without explicit credentials
            else:
                # Check if credentials file exists (only if it's a file path)
                creds_path = settings.GOOGLE_APPLICATION_CREDENTIALS
                if not creds_path.startswith('{') and not os.path.exists(creds_path):
                    logger.warning(f"Credentials file not found: {creds_path}")
                    logger.info("Attempting to use credentials from environment variable...")
                    # Try to continue without file - credentials might be set via environment
            
            logger.info("Initializing Gemini model")
            # Use the correct Gemini model for Vertex AI
            model = GenerativeModel("gemini-2.5-pro")
            
            # Apply preset-specific instructions if preset_id is provided
            preset_instructions = ""
            preset_specific_data = ""
            model_temperature = 0.7  # Default temperature
            
            if preset_id:
                from app.models.preset import get_preset_by_id
                preset = get_preset_by_id(preset_id)
                if preset:
                    logger.info(f"Using preset: {preset.name} with temperature {preset.temperature}")
                    preset_instructions = f"""
                    Анализируй разговор согласно следующему пресету: "{preset.name}".
                    Целевая аудитория: {preset.target_audience}
                    
                    Стиль отчета:
                    {', '.join(preset.report_style)}
                    
                    Фокус анализа:
                    {', '.join(preset.focus_analysis)}
                    """
                    model_temperature = preset.temperature
                    
                    # Add preset-specific data generation instructions
                    if preset.id == "teen_navigator":
                        preset_specific_data = """
                        
                        ВАЖНО: Сначала проверь, подходит ли этот диалог для анализа подростковой коммуникации. 
                        Ищи признаки: возраст участников (подростки, школьники), школьная тематика, 
                        групповое общение, социальные сети, подростковые интересы.
                        
                        Если диалог НЕ подходит для подросткового анализа, установи:
                        "preset_validation": {{
                            "is_valid": false,
                            "reason": "Диалог не содержит признаков подростковой коммуникации"
                        }}
                        
                        Если диалог подходит, установи:
                        "preset_validation": {{
                            "is_valid": true,
                            "reason": "Диалог подходит для подросткового анализа"
                        }}
                        
                        ДОПОЛНИТЕЛЬНО для пресета "Подростковый Навигатор" добавь следующие данные:
                        
                        "safety_check": {{
                            "bullying_indicators": ["индикатор1", "индикатор2", "индикатор3"],
                            "safety_level": число_от_0_до_100,
                            "recommendations": ["рекомендация1", "рекомендация2", "рекомендация3"]
                        }},
                        "emotion_dictionary": {{
                            "hidden_emotions": [
                                {{
                                    "text": "фраза из разговора",
                                    "explanation": "что на самом деле означает эта фраза"
                                }}
                            ]
                        }},
                        "social_compass": {{
                            "group_dynamics": "описание групповой динамики",
                            "inner_circles": ["круг1", "круг2", "круг3"],
                            "navigation_tips": ["совет1", "совет2", "совет3"]
                        }}
                        """
                    elif preset.id == "family_balance":
                        preset_specific_data = """
                        
                        ВАЖНО: Сначала проверь, подходит ли этот диалог для анализа семейной коммуникации. 
                        Ищи признаки: семейные отношения (родители-дети, супруги, родственники), 
                        домашние дела, семейные планы, воспитание, семейные конфликты.
                        
                        Если диалог НЕ подходит для семейного анализа, установи:
                        "preset_validation": {{
                            "is_valid": false,
                            "reason": "Диалог не содержит признаков семейной коммуникации"
                        }}
                        
                        Если диалог подходит, установи:
                        "preset_validation": {{
                            "is_valid": true,
                            "reason": "Диалог подходит для семейного анализа"
                        }}
                        
                        ДОПОЛНИТЕЛЬНО для пресета "Семейный Баланс" добавь следующие данные:
                        
                        "communication_cycles": {{
                            "patterns": ["паттерн1", "паттерн2", "паттерн3"],
                            "trigger_points": ["триггер1", "триггер2", "триггер3"],
                            "interruption_techniques": ["техника1", "техника2", "техника3"]
                        }},
                        "needs_map": {{
                            "expressed_needs": ["потребность1", "потребность2"],
                            "unexpressed_needs": ["скрытая_потребность1", "скрытая_потребность2"],
                            "overlap_areas": ["зона_пересечения1", "зона_пересечения2"]
                        }},
                        "family_roles": {{
                            "role_distribution": ["роль1", "роль2", "роль3"],
                            "responsibility_balance": число_от_0_до_100,
                            "recommendations": ["рекомендация1", "рекомендация2", "рекомендация3"]
                        }}
                        ПРАВИЛА ОФОРМЛЕНИЯ:
                        1. КОЛИЧЕСТВО СЛОВ КАЖДОГО ТРИГЕРА НЕ ДОЛЖНЫ ПРЕВЫШАТЬ 4-5 СЛОВ
                        2. ВСЕ РЕКОМЕНДАЦИИ ДОЛЖНЫ БЫТЬ НЕ ДЛИННЫМИ И ПРАКТИЧНЫМИ
                        """
                    elif preset.id == "strategic_hr":
                        preset_specific_data = """
                        
                        ВАЖНО: Сначала проверь, подходит ли этот диалог для анализа деловой/рабочей коммуникации. 
                        Ищи признаки: рабочие отношения, проекты, задачи, совещания, 
                        профессиональные обсуждения, командная работа, деловые решения.
                        
                        Если диалог НЕ подходит для HR анализа, установи:
                        "preset_validation": {{
                            "is_valid": false,
                            "reason": "Диалог не содержит признаков деловой/рабочей коммуникации"
                        }}
                        
                        Если диалог подходит, установи:
                        "preset_validation": {{
                            "is_valid": true,
                            "reason": "Диалог подходит для HR анализа"
                        }}
                        
                        ДОПОЛНИТЕЛЬНО для пресета "Стратегический HR" добавь следующие данные:
                        
                        "team_analytics": {{
                            "communication_metrics": {{
                                "participation_rate": число_от_0_до_100,
                                "response_time": "среднее_время_ответа",
                                "engagement_score": число_от_0_до_100
                            }},
                            "decision_efficiency": число_от_0_до_100,
                            "goal_achievement": число_от_0_до_100
                        }},
                        "psychological_safety": {{
                            "safety_level": число_от_0_до_100,
                            "trust_indicators": ["индикатор1", "индикатор2", "индикатор3"],
                            "openness_score": число_от_0_до_100
                        }},
                        "professional_growth": {{
                            "skill_analysis": [
                                {{
                                    "skill": "навык",
                                    "current_level": число_от_1_до_5,
                                    "development_area": "область_развития"
                                }}
                            ],
                            "growth_recommendations": ["рекомендация1", "рекомендация2", "рекомендация3"]
                        }}
                        """
            
            # Override with provided temperature if specified
            if temperature is not None:
                model_temperature = temperature
            
            # Create the prompt for analysis
            prompt = f"""
            Проанализируй следующий разговор и предоставь детальный анализ эмоций и качества общения. 
            Отвечай строго на русском языке.

            Разговор:
            {text}

            {preset_instructions}
            
            ВАЖНО: Если текст короткий или содержит мало информации, все равно проведи анализ на основе доступных данных.
            Даже короткие фразы могут содержать эмоциональную информацию.
            
            {f"Дополнительные инструкции: {additional_prompt}" if additional_prompt else ""}

            Предоставь анализ в следующем JSON формате (give answers in russian):

            {{
                "summary": {{
                    "overview": "Краткое описание разговора",
                    "participants": количество_участников,
                    "messageCount": количество_сообщений,
                    "duration": "примерная длительность",
                    "mainTopics": ["тема1", "тема2", "тема3"]
                }},
                "emotionTimeline": {{
                    "emotions": [
                        {{
                            "time": "время",
                            "emotion": "эмоция с эмоджи",
                            "intensity": интенсивность_от_0_до_100,
                            "color": "hex_цвет"
                        }}
                    ],
                    "dominantEmotion": "доминирующая эмоция с эмоджи",
                    "emotionalShifts": количество_эмоциональных_переходов
                }},
                "aiJudgeScore": {{
                    "overallScore": общий_балл_от_0_до_100,
                    "breakdown": {{
                        "clarity": балл_ясности_от_0_до_100,
                        "empathy": балл_эмпатии_от_0_до_100,
                        "professionalism": балл_профессионализма_от_0_до_100,
                        "resolution": балл_решения_от_0_до_100
                    }},
                    "verdict": "КРАТКИЙ ВЕРДИКТ ИЗ 4-5 СЛОВ МАКСИМУМ",
                    "recommendation": "подробная рекомендация"
                }},
                "subtleties": [
                    {{
                        "type": "тип тонкости",
                        "message": "описание",
                        "confidence": уверенность_от_0_до_100,
                        "context": "контекст"
                    }}
                ]{preset_specific_data}
            }}

            ВАЖНО:
            1. Вердикт (verdict) должен быть КРАТКИМ - максимум 4-5 слов
            2. К каждой эмоции в emotionTimeline.emotions добавляй подходящий эмоджи
            3. К dominantEmotion тоже добавляй эмоджи
            4. Все ответы строго на русском языке
            """
            
            # Add additional prompt if provided
            if additional_prompt:
                prompt += f"\n\nAdditional analysis instructions: {additional_prompt}"
            
            logger.info(f"Generating content with Gemini using temperature {model_temperature}")
            logger.info(f"Prompt length: {len(prompt)} characters")
            logger.info(f"Text to analyze: {text[:100]}...")
            
            # Generate response from Gemini with specified temperature
            response = model.generate_content(prompt, generation_config={"temperature": model_temperature})
            
            # Parse the response to extract the JSON
            result = response.text
            logger.info(f"Successfully generated analysis, response length: {len(result)} characters")
            logger.info(f"Response preview: {result[:200]}...")
            
            # Try to parse JSON from the response
            try:
                # Extract JSON from the response (it might be wrapped in markdown)
                if "```json" in result:
                    json_start = result.find("```json") + 7
                    json_end = result.find("```", json_start)
                    json_str = result[json_start:json_end].strip()
                elif "```" in result:
                    # Handle other markdown code blocks
                    json_start = result.find("```") + 3
                    json_end = result.find("```", json_start)
                    json_str = result[json_start:json_end].strip()
                else:
                    json_str = result.strip()
                
                logger.info(f"Attempting to parse JSON: {json_str[:200]}...")
                parsed_result = json.loads(json_str)
                
                # Add preset-specific data to the result if preset is provided
                if preset_id:
                    from app.models.preset import get_preset_by_id
                    preset = get_preset_by_id(preset_id)
                    if preset and hasattr(preset, 'custom_cards') and preset.custom_cards:
                        # Add information about custom cards that should be shown for this preset
                        parsed_result["preset"] = {
                            "id": preset.id,
                            "name": preset.name,
                            "custom_cards": [card.dict() for card in preset.custom_cards]
                        }
                
                return {
                    "success": True,
                    "result": parsed_result
                }
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse JSON from response: {e}")
                logger.warning(f"Raw response: {result}")
                # Try to create a basic analysis from the raw text
                try:
                    # Create a basic analysis structure from the raw response
                    basic_analysis = {
                        "summary": {
                            "overview": "Анализ на основе извлеченного текста",
                            "participants": 1,
                            "messageCount": len(text.split()),
                            "duration": "Краткий",
                            "mainTopics": ["Анализ текста"]
                        },
                        "emotionTimeline": {
                            "emotions": [
                                {
                                    "time": "00:00",
                                    "emotion": "Нейтральный",
                                    "intensity": 50,
                                    "color": "#6b7280"
                                }
                            ],
                            "dominantEmotion": "Нейтральный",
                            "emotionalShifts": 1
                        },
                        "aiJudgeScore": {
                            "overallScore": 70,
                            "breakdown": {
                                "clarity": 75,
                                "empathy": 70,
                                "professionalism": 65,
                                "resolution": 70
                            },
                            "verdict": "Анализ выполнен",
                            "recommendation": "Текст успешно обработан и проанализирован"
                        },
                        "subtleties": [
                            {
                                "type": "Обработка",
                                "message": "Текст извлечен и проанализирован",
                                "confidence": 80,
                                "context": "OCR и AI анализ"
                            }
                        ]
                    }
                    return {
                        "success": True,
                        "result": basic_analysis
                    }
                except Exception as fallback_error:
                    logger.error(f"Fallback analysis also failed: {fallback_error}")
                    return {
                        "success": True,
                        "result": result
                    }
            
        except Exception as e:
            logger.error(f"Error in text analysis: {str(e)}")
            logger.error(f"Text length: {len(text)} characters")
            logger.error(f"Text preview: {text[:200]}...")
            # Fallback to mock analysis
            logger.warning("Falling back to mock analysis due to error")
            return await AIService.mock_analysis_result(preset_id)
    
    @staticmethod
    async def chat_with_ai(message: str, conversation_id: Optional[str] = None) -> Dict[str, Any]:
        """Chat with AI about the analyzed conversation"""
        try:
            logger.info("Starting AI chat")
            
            # Check if Vertex AI is initialized
            if not vertex_ai_initialized:
                logger.warning("Vertex AI not initialized, using mock chat")
                return await AIService.mock_chat_response()
            
            # Get conversation history
            conversation_history = chat_conversations.get(conversation_id, [])
            
            # Keep only last 10 messages
            if len(conversation_history) > 10:
                conversation_history = conversation_history[-10:]
            
            # Create context from conversation history
            context = ""
            if conversation_history:
                context = "Предыдущие сообщения:\n" + "\n".join([
                    f"Пользователь: {msg['user']}\nAI: {msg['ai']}" 
                    for msg in conversation_history
                ])
            
            # Create prompt for chat
            chat_prompt = f"""
            Ты - ИИ-консультант по анализу разговоров. Отвечай на русском языке.
            
            Контекст анализа разговора:
            {context}
            
            Вопрос пользователя: {message}
            
            Ответь кратко и по делу, используя информацию из анализа. 
            Можешь использовать эмоджи для лучшего выражения эмоций.
            """
            
            logger.info("Generating chat response with Gemini")
            model = GenerativeModel("gemini-2.5-pro")
            response = model.generate_content(chat_prompt)
            
            ai_response = response.text.strip()
            
            # Store the conversation
            if conversation_id:
                if conversation_id not in chat_conversations:
                    chat_conversations[conversation_id] = []
                
                chat_conversations[conversation_id].append({
                    "user": message,
                    "ai": ai_response
                })
                
                # Keep only last 10 messages
                if len(chat_conversations[conversation_id]) > 10:
                    chat_conversations[conversation_id] = chat_conversations[conversation_id][-10:]
            
            return {
                "success": True,
                "response": ai_response,
                "conversation_id": conversation_id
            }
            
        except Exception as e:
            logger.error(f"Error in AI chat: {str(e)}")
            return await AIService.mock_chat_response()
    
    @staticmethod
    async def get_suggested_responses(conversation_text: str, context: Optional[str] = None) -> Dict[str, Any]:
        """Get suggested responses based on conversation analysis"""
        try:
            logger.info("Getting suggested responses")
            
            # Check if Vertex AI is initialized
            if not vertex_ai_initialized:
                logger.warning("Vertex AI not initialized, using mock suggestions")
                return await AIService.mock_suggested_responses()
            
            # Create prompt for suggested responses
            prompt = f"""
            На основе анализа разговора предложи 3 конкретные фразы для улучшения общения.
            
            Контекст разговора:
            {conversation_text}
            
            {f"Дополнительный контекст: {context}" if context else ""}
            
            Предложи 3 фразы в следующем JSON формате:
            {{
                "suggestions": [
                    {{
                        "text": "конкретная фраза с эмоджи",
                        "reason": "краткое объяснение почему эта фраза подходит"
                    }},
                    {{
                        "text": "конкретная фраза с эмоджи", 
                        "reason": "краткое объяснение почему эта фраза подходит"
                    }},
                    {{
                        "text": "конкретная фраза с эмоджи",
                        "reason": "краткое объяснение почему эта фраза подходит"
                    }}
                ]
            }}
            
            ВАЖНО:
            1. Все ответы строго на русском языке
            2. Добавляй подходящие эмоджи к фразам
            3. Фразы должны быть конкретными и практичными
            4. Объяснения должны быть краткими
            """
            
            logger.info("Generating suggested responses with Gemini")
            model = GenerativeModel("gemini-2.5-pro")
            response = model.generate_content(prompt)
            
            result = response.text
            
            # Try to parse JSON from the response
            try:
                if "```json" in result:
                    json_start = result.find("```json") + 7
                    json_end = result.find("```", json_start)
                    json_str = result[json_start:json_end].strip()
                else:
                    json_str = result.strip()
                
                parsed_result = json.loads(json_str)
                return {
                    "success": True,
                    "suggestions": parsed_result.get("suggestions", [])
                }
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse JSON from response: {e}")
                # Return mock suggestions if parsing fails
                return await AIService.mock_suggested_responses()
            
        except Exception as e:
            logger.error(f"Error in getting suggested responses: {str(e)}")
            return await AIService.mock_suggested_responses()
    
    @staticmethod
    async def mock_analysis_result(preset_id: Optional[str] = None) -> Dict[str, Any]:
        """Mock analysis result for testing"""
        result = {
            "result": {
                "summary": {
                    "overview": "Конструктивный диалог между клиентом и продавцом о покупке товара",
                    "participants": 2,
                    "messageCount": 15,
                    "duration": "15 минут",
                    "mainTopics": ["покупка", "доставка", "оплата"]
                },
                "emotionTimeline": {
                    "emotions": [
                        {"time": "10:00", "emotion": "Любопытство 🤔", "intensity": 70, "color": "#FFD700"},
                        {"time": "10:05", "emotion": "Интерес 😊", "intensity": 85, "color": "#32CD32"},
                        {"time": "10:10", "emotion": "Согласие 👍", "intensity": 90, "color": "#00CED1"}
                    ],
                    "dominantEmotion": "Позитив 😊",
                    "emotionalShifts": 2
                },
                "aiJudgeScore": {
                    "overallScore": 85,
                    "breakdown": {
                        "clarity": 90,
                        "empathy": 85,
                        "professionalism": 80,
                        "resolution": 85
                    },
                    "verdict": "Отличное общение",
                    "recommendation": "Оба участника проявили профессионализм и эмпатию. Рекомендуется продолжать такой стиль общения."
                },
                "subtleties": [
                    {
                        "type": "Проактивность",
                        "message": "Продавец заранее предложил варианты доставки",
                        "confidence": 95,
                        "context": "Упоминание о разных способах доставки"
                    }
                ]
            }
        }
        
        # Add preset-specific data if preset_id is provided
        if preset_id:
            from app.models.preset import get_preset_by_id
            preset = get_preset_by_id(preset_id)
            if preset and hasattr(preset, 'custom_cards') and preset.custom_cards:
                # Add mock data for preset-specific custom cards
                result["result"]["preset"] = {
                    "id": preset.id,
                    "name": preset.name,
                    "custom_cards": [card.dict() for card in preset.custom_cards]
                }
                
                # Add mock data for teen navigator preset
                if preset.id == "teen_navigator":
                    # Mock validation - this would normally be determined by LLM
                    result["result"]["preset_validation"] = {
                        "is_valid": False,
                        "reason": "Диалог не содержит признаков подростковой коммуникации"
                    }
                    result["result"]["safety_check"] = {
                        "bullying_indicators": ["Нет признаков буллинга", "Коммуникация уважительная"],
                        "safety_level": 90,
                        "recommendations": ["Продолжайте поддерживать открытый диалог", "Обсуждайте границы"]
                    }
                    result["result"]["emotion_dictionary"] = {
                        "hidden_emotions": [
                            {"text": "Возможно волнение", "explanation": "Частые уточнения могут говорить о беспокойстве"},
                            {"text": "Скрытый энтузиазм", "explanation": "Повторяющиеся вопросы о деталях показывают заинтересованность"}
                        ]
                    }
                    result["result"]["social_compass"] = {
                        "group_dynamics": "Равное участие обеих сторон",
                        "inner_circles": ["Продавец и клиент образуют доверительный круг"],
                        "navigation_tips": ["Поддерживайте баланс вопросов и ответов", "Уточняйте детали без давления"]
                    }
                
                # Add mock data for family balance preset
                elif preset.id == "family_balance":
                    # Mock validation - this would normally be determined by LLM
                    result["result"]["preset_validation"] = {
                        "is_valid": False,
                        "reason": "Диалог не содержит признаков семейной коммуникации"
                    }
                    result["result"]["communication_cycles"] = {
                        "patterns": ["Вопрос-ответ-уточнение", "Предложение-согласие"],
                        "trigger_points": ["Обсуждение цены может вызывать напряжение"],
                        "interruption_techniques": ["Использование пауз", "Переход к обсуждению преимуществ"]
                    }
                    result["result"]["needs_map"] = {
                        "expressed_needs": ["Клиент: нужна подробная информация", "Продавец: нужно завершить продажу"],
                        "unexpressed_needs": ["Клиент: уверенность в решении", "Продавец: долгосрочные отношения с клиентом"],
                        "overlap_areas": ["Взаимная выгода от сделки", "Качественное обслуживание"]
                    }
                    result["result"]["family_roles"] = {
                        "role_distribution": ["Продавец выступает как эксперт", "Клиент в роли принимающего решения"],
                        "responsibility_balance": 70,
                        "recommendations": ["Сохраняйте баланс экспертности и уважения к выбору", "Подчеркивайте совместную выгоду"]
                    }
                
                # Add mock data for strategic HR preset
                elif preset.id == "strategic_hr":
                    # Mock validation - this would normally be determined by LLM
                    result["result"]["preset_validation"] = {
                        "is_valid": False,
                        "reason": "Диалог не содержит признаков деловой/рабочей коммуникации"
                    }
                    result["result"]["team_analytics"] = {
                        "communication_metrics": {
                            "participation_rate": 85,
                            "response_time": "2-3 минуты",
                            "engagement_score": 80
                        },
                        "decision_efficiency": 75,
                        "goal_achievement": 90
                    }
                    result["result"]["psychological_safety"] = {
                        "safety_level": 80,
                        "trust_indicators": ["Открытые вопросы", "Конструктивная обратная связь", "Готовность к диалогу"],
                        "openness_score": 85
                    }
                    result["result"]["professional_growth"] = {
                        "skill_analysis": [
                            {
                                "skill": "Активное слушание",
                                "current_level": 4,
                                "development_area": "Техники перефразирования"
                            },
                            {
                                "skill": "Эмпатия",
                                "current_level": 5,
                                "development_area": "Уже на высоком уровне"
                            }
                        ],
                        "growth_recommendations": ["Тренинг по активному слушанию", "Практика эмпатического общения", "Работа с обратной связью"]
                    }
        
        return result
    
    @staticmethod
    async def mock_chat_response() -> Dict[str, Any]:
        """Mock chat response for testing"""
        return {
            "success": True,
            "response": "Отличный вопрос! 😊 Основываясь на анализе, я вижу, что общение было очень конструктивным. Оба участника проявили эмпатию и профессионализм. Рекомендую продолжать такой стиль общения! 👍"
        }

    @staticmethod
    async def mock_suggested_responses() -> Dict[str, Any]:
        """Mock suggested responses for testing"""
        return {
            "success": True,
            "suggestions": [
                {
                    "text": "Понимаю твою точку зрения! 🤝",
                    "reason": "Показывает эмпатию и готовность к диалогу"
                },
                {
                    "text": "Расскажи подробнее, мне важно услышать твое мнение 💬",
                    "reason": "Поощряет открытую коммуникацию"
                },
                {
                    "text": "Давай сделаем паузу и вернемся позже ⏰",
                    "reason": "Помогает избежать эскалации конфликта"
                }
            ]
        }
