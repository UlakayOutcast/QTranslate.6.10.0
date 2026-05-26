function serviceHeader() {
    return new ServiceHeader(98, "GrokAI", "xAI's AI Grok as a professional translator." + Const.NL2 + "https://grok.com/" + Const.NL2 + "\u00a9 xAI", Capability.TRANSLATE)
}

function serviceHost(a, b, c) {
    return "https://mtdev.bytequests.com"
}

function serviceLink(e, t, n) {
    return "https://www.machinetranslation.com/"
}

SupportedLanguages = [-1, -1, "af","az","sq","ar","hy","eu","be","bg","ca","zh-CN","zh-TW","hr","cs","da","nl","en","et","fi","tl","fr","gl","de","el","ht","iw","hi","hu","is","id","it","ga","ja","ka","ko","lv","lt","mk","ms","mt","no","fa","pl","pt","ro","ru","sr","sk","sl","es","sw","sv","th","tr","uk","ur","vi","cy","yi","eo","hmn","la","lo","kk","uz","si","tg","te","km","mn","kn","ta","mr","bn","tt"];

function serviceTranslateRequest(a, b, c) {
	
	function generateUUID() {
	var d987 = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r11 = (d987 + Math.random() * 16) % 16 | 0;
		d987 = Math.floor(d987 / 16);
		return (c === 'x' ? r11 : (r11 & 0x3 | 0x8)).toString(16);
	});
	return uuid;
	}

	bytequests = generateUUID();
	
   return new RequestData(
		HttpMethod.POST, 
		"/v1/translation/grok-ai", 
		stringifyJSON(
			{
				"text":a,
				"source_language_code":codeFromLanguage(b || AUTO_DETECT_LANGUAGE),
				"target_language_code":codeFromLanguage(c || ENGLISH_LANGUAGE),
				"share_id":bytequests
			}
		),
		"accept: application/json, text/plain, */*"+Const.NL+
		"accept-language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"+Const.NL+
		"cache-control: no-cache"+Const.NL+
		"pragma: no-cache"+Const.NL+
		"content-type: application/json"+Const.NL+
		"pragma: no-cache"+Const.NL+
		"sec-ch-ua: \"Google Chrome\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\""+Const.NL+
		"sec-ch-ua-mobile: ?0"+Const.NL+
		"sec-ch-ua-platform: \"Windows\""+Const.NL+
		"sec-fetch-dest: empty"+Const.NL+
		"sec-fetch-mode: cors"+Const.NL+
		"sec-fetch-site: cross-site"+Const.NL+
		"Referer: https://www.machinetranslation.com/"+Const.NL+
		"Referrer-Policy: strict-origin-when-cross-origin"
		)
}

function serviceTranslateResponse(a, b, c, d) {
	ff = parseJSON(b);
	if (ff.response.translated_text){
		b = ff.response.translated_text;
	}
    return new ResponseData(b, c, d)
};