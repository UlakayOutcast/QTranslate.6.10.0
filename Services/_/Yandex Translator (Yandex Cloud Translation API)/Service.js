// ============================================
// Yandex Translator (Yandex Cloud Translation API)
// Обновленная версия для QTranslate 6.10.0
// Использует Yandex Cloud Translation API
// ============================================

function serviceHeader() {
    return new ServiceHeader(
        11, 
        "Yandex Cloud", 
        "Yandex Cloud Translation API - Neural machine translation service." + Const.NL2 + 
        "https://cloud.yandex.com/services/translate" + Const.NL2 + 
        "© 2024 Yandex", 
        Capability.TRANSLATE | Capability.DETECT_LANGUAGE | Capability.LISTEN
    );
}

function serviceHost(a, b, c) {
    // Для озвучки используем отдельный хост
    if (a === Capability.LISTEN) {
        return "https://tts.api.cloud.yandex.net";
    }
    // Для перевода и определения языка
    return "https://translate.api.cloud.yandex.net";
}

function serviceLink(a, b, c) {
    var host = "https://translate.yandex.com";
    if (a) {
        b = isLanguage(b) ? codeFromLanguage(b) : "";
        c = isLanguage(c) ? codeFromLanguage(c) : "";
        host += format("/?lang={0}-{1}&text={2}", b, c, encodeGetParam(a));
    }
    return host;
}

// Поддерживаемые языки для Yandex Cloud Translation API
// Полный список: https://cloud.yandex.com/ru/docs/translate/operations/translate
SupportedLanguages = [
    -1, "auto-detect",
    "af",    // Африкаанс
    "am",    // Амхарский
    "ar",    // Арабский
    "az",    // Азербайджанский
    "ba",    // Башкирский
    "be",    // Беларуский
    "bg",    // Болгарский
    "bn",    // Бенгальский
    "bs",    // Боснийский
    "ca",    // Каталонский
    "cs",    // Чешский
    "cy",    // Валлийский
    "da",    // Датский
    "de",    // Немецкий
    "el",    // Греческий
    "en",    // Английский
    "es",    // Испанский
    "et",    // Эстонский
    "fa",    // Персидский
    "fi",    // Финский
    "fr",    // Французский
    "ga",    // Ирландский
    "gd",    // Шотландский (гельский)
    "he",    // Иврит
    "hi",    // Хинди
    "hr",    // Хорватский
    "ht",    // Гаитянский креольский
    "hu",    // Венгерский
    "hy",    // Армянский
    "id",    // Индонезийский
    "is",    // Исландский
    "it",    // Итальянский
    "ja",    // Японский
    "jv",    // Яванский
    "ka",    // Грузинский
    "kk",    // Казахский
    "ko",    // Корейский
    "lt",    // Литовский
    "lv",    // Латвийский
    "mk",    // Македонский
    "mn",    // Монгольский
    "ms",    // Малайский
    "mt",    // Мальтийский
    "nl",    // Нидерландский
    "no",    // Норвежский
    "pa",    // Пенджабский
    "pl",    // Польский
    "pt",    // Португальский
    "ro",    // Румынский
    "ru",    // Русский
    "sk",    // Словацкий
    "sl",    // Словенский
    "sq",    // Албанский
    "sr",    // Сербский
    "sv",    // Шведский
    "sw",    // Суахили
    "ta",    // Тамильский
    "te",    // Телугу
    "th",    // Тайский
    "tr",    // Турецкий
    "tt",    // Татарский
    "udm",   // Удмуртский
    "uk",    // Украинский
    "ur",    // Урду
    "uz",    // Узбекский
    "vi",    // Вьетнамский
    "xh",    // Коса
    "zh"     // Китайский
];

// Генерация UUID для запросов
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

// Формируем запрос на перевод
function serviceTranslateRequest(a, b, c) {
    a = limitSource(a, 10000);
    
    // Yandex Cloud API ожидает массив текстов
    var body = stringifyJSON({
        "sourceLanguageCode": codeFromLanguage(b || AUTO_DETECT_LANGUAGE),
        "targetLanguageCode": codeFromLanguage(c || ENGLISH_LANGUAGE),
        "texts": [a],
        "folderId": Options.YandexFolderId || "",
        "speller": true
    });
    
    var endpoint = "/translate/v2/translate";
    
    var headers = postHeader(true) + Const.NL +
        "Authorization: Bearer " + (Options.YandexApiKey || "") + Const.NL +
        "Content-Type: application/json" + Const.NL +
        "X-Request-Id: " + generateUUID();
    
    return new RequestData(HttpMethod.POST, endpoint, body, headers);
}

// Обрабатываем ответ от Yandex Cloud Translation API
function serviceTranslateResponse(a, b, c, d) {
    var response;
    try {
        response = parseJSON(b);
    } catch (e) {
        return new ResponseData("Translation failed: Invalid response", c, d);
    }
    
    var translation = "";
    var detectedLanguage = c;
    
    if (response && response.translations && response.translations.length > 0) {
        translation = response.translations[0].text;
        
        // Если язык источника был auto, получаем определенный язык
        if (response.detectedLanguage) {
            detectedLanguage = languageFromCode(response.detectedLanguage.code);
        }
    }
    
    // Проверяем, нужно ли словарь
    var nextRequest = null;
    if (a && !/[\n\r]/.test(a) && 3 >= a.split(" ").length) {
        nextRequest = "dictionaryRequest";
    }
    
    return new ResponseData(translation, detectedLanguage, d, null, nextRequest);
}

// Формируем запрос на определение языка
function serviceDetectLanguageRequest(a) {
    a = limitSource(a, 10000);
    
    var body = stringifyJSON({
        "texts": [a],
        "folderId": Options.YandexFolderId || ""
    });
    
    var endpoint = "/translate/v2/detect";
    
    var headers = postHeader(true) + Const.NL +
        "Authorization: Bearer " + (Options.YandexApiKey || "") + Const.NL +
        "Content-Type: application/json" + Const.NL +
        "X-Request-Id: " + generateUUID();
    
    return new RequestData(HttpMethod.POST, endpoint, body, headers, null, "serviceDetectLanguageResponse");
}

// Обрабатываем ответ на определение языка
function serviceDetectLanguageResponse(a, b, c, d) {
    var response;
    try {
        response = parseJSON(b);
    } catch (e) {
        return UNKNOWN_LANGUAGE;
    }
    
    if (response && response.detections && response.detections.length > 0) {
        return languageFromCode(response.detections[0].languageCode);
    }
    
    return UNKNOWN_LANGUAGE;
}

// Формируем запрос на словарь
function dictionaryRequest(a, b, c) {
    a = prepareSource(a);
    
    // Для словаря используем отдельный endpoint
    // Note: Yandex Cloud не предоставляет словарь, поэтому можно использовать старую систему
    // или пропустить эту функцию
    
    // Пока оставим как в старой версии, но с обновленным хостом
    var endpoint = "/dicservice.json/lookup";
    
    var params = format(
        "?srv=android&uuid={0}&text={1}&lang={2}-{3}",
        generateUUID(),
        encodeGetParam(a),
        codeFromLanguage(b),
        codeFromLanguage(c)
    );
    
    var headers = getHeader() + Const.NL + 
        "Referer: https://translate.yandex.com/";
    
    return new RequestData(HttpMethod.GET, endpoint + params, null, headers, null, "dictionaryResponse");
}

// Обрабатываем ответ словаря
function dictionaryResponse(a, b, c, d) {
    var response;
    try {
        response = parseJSON(b);
    } catch (e) {
        return new ResponseData("", c, d);
    }
    
    var result = "";
    
    if (response && response.def) {
        for (var i = 0; i < response.def.length; i++) {
            var entry = response.def[i];
            if (entry.tr) {
                result += Const.NL + entry.text + (entry.ts ? " [" + entry.ts + "]" : "") + " " + entry.tr[0].pos + Const.NL;
                
                for (var j = 0; j < entry.tr.length; j++) {
                    var translation = entry.tr[j];
                    result += (j > 0 ? (j + 1) + ". " : "    ") + translation.text;
                    
                    if (translation.syn) {
                        for (var k = 0; k < translation.syn.length; k++) {
                            result += ", " + translation.syn[k].text;
                        }
                    }
                    
                    result += Const.NL;
                    
                    if (translation.mean) {
                        result += "    (" + translation.mean.map(function(m) { return m.text; }).join(", ") + ")" + Const.NL;
                    }
                    
                    if (translation.ex) {
                        for (var l = 0; l < translation.ex.length; l++) {
                            var example = translation.ex[l];
                            result += "        " + example.text + " - " + example.tr.map(function(t) { return t.text; }).join(", ") + Const.NL;
                        }
                    }
                }
            }
        }
    }
    
    return result && (result = Const.NL + result), new ResponseData(result, c, d);
}

// Формируем запрос на озвучку
function serviceListenRequest(a, b, c) {
    b = codeFromLanguage(b);
    
    // Yandex Cloud TTS API
    var endpoint = "/v1/tts:synthesize";
    
    // Маппинг языков для TTS
    var ttsLang = b;
    switch(b) {
        case "en": ttsLang = "en_US"; break;
        case "ru": ttsLang = "ru_RU"; break;
        case "tr": ttsLang = "tr_TR"; break;
        case "de": ttsLang = "de_DE"; break;
        case "fr": ttsLang = "fr_FR"; break;
        case "es": ttsLang = "es_ES"; break;
        case "it": ttsLang = "it_IT"; break;
        case "pt": ttsLang = "pt_BR"; break;
        case "uk": ttsLang = "uk_UA"; break;
        case "pl": ttsLang = "pl_PL"; break;
        case "sv": ttsLang = "sv_SE"; break;
        case "fi": ttsLang = "fi_FI"; break;
        case "da": ttsLang = "da_DK"; break;
        case "nl": ttsLang = "nl_NL"; break;
        case "cs": ttsLang = "cs_CZ"; break;
        case "hu": ttsLang = "hu_HU"; break;
        case "bg": ttsLang = "bg_BG"; break;
        case "ro": ttsLang = "ro_RO"; break;
        case "sk": ttsLang = "sk_SK"; break;
        case "sl": ttsLang = "sl_SI"; break;
        case "hr": ttsLang = "hr_HR"; break;
        case "el": ttsLang = "el_GR"; break;
        case "hi": ttsLang = "hi_IN"; break;
        case "ja": ttsLang = "ja_JP"; break;
        case "ko": ttsLang = "ko_KR"; break;
        case "zh": ttsLang = "zh_CN"; break;
        case "ca": ttsLang = "ca_ES"; break;
        case "ar": ttsLang = "ar_AE"; break;
        default: ttsLang = b + "_" + b.toUpperCase();
    }
    
    var body = stringifyJSON({
        "text": a,
        "lang": ttsLang,
        "voice": "oksana", // или "zahari", "jane" и др.
        "emotion": "neutral",
        "speed": c ? 0.7 : 1.0,
        "format": "mp3",
        "folderId": Options.YandexFolderId || ""
    });
    
    var headers = postHeader(true) + Const.NL +
        "Authorization: Bearer " + (Options.YandexApiKey || "PasteApiKeyHere") + Const.NL +
        "Content-Type: application/json" + Const.NL +
        "X-Request-Id: " + generateUUID();
    
    return new RequestData(HttpMethod.POST, endpoint, body, headers);
}