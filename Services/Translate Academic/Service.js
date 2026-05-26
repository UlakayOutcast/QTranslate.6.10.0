function serviceHeader() {
    return new ServiceHeader(84, "Translate.academic", "Dictionaries and encyclopedias on Academician." + Const.NL2 + "https://translate.academic.ru/", Capability.DICTIONARY)
}

function serviceHost(a, b, c) {
    return "https://translate.academic.ru"
}

function serviceLink(a, b, c) {
    return "https://translate.academic.ru"
}
SupportedLanguages = [-1, "", "af", "az", "sq", "ar", "hy", "eu", "be", "bg", "ca", "zh", "zh", "hr", "cs", "da", "nl", "en", "et", "fi", -1, "fr", "gl", "de", "el", "ht", "he", "hi", "hu", "is", "id", "it", "ga", "ja", "ka", "ko", "lv", "lt", "mk", "ms", "mt", "no", "fa", "pl", "pt", "ro", "ru", "sr", "sk", "sl", "es", "sw", "sv", "th", "tr", "uk", "ur", "vi", "cy", "yi", "eo", "hmn", "la", "lo", "kk", "uz", "si", "tg", "te", "km", "mn", "kn", "ta", "mr", "bn", "tt"];

function serviceDictionaryRequest(a, b, c) {
    a = buildUri(a, b, c);
    return new RequestData(HttpMethod.GET, a)
}

function serviceDictionaryResponse(a, b, c, e) {
    var d ="";

	b = b.replace(/href="\//g, 'href="'+serviceHost()+'/');

	var doc = new ActiveXObject("htmlfile");
	doc.write(b);

	var elementToRemove_1 = doc.getElementById("header");
	if (elementToRemove_1) {
	  elementToRemove_1.parentNode.removeChild(elementToRemove_1);
	}
	
	var elementToRemove_2 = doc.getElementById("footer");
	if (elementToRemove_2) {
	  elementToRemove_2.parentNode.removeChild(elementToRemove_2);
	}

	var elementToRemove_3 = doc.getElementById("ad_top");
	if (elementToRemove_3) {
	  elementToRemove_3.parentNode.removeChild(elementToRemove_3);
	}
	
	var elementToRemove_4 = doc.getElementById("content");
	if (elementToRemove_4) {
	  elementToRemove_4.style.margin = "0";
	}
	
	var elementToRemove_5 = doc.getElementById("page");
	if (elementToRemove_5) {
	  elementToRemove_5.style.padding = "0";
	  elementToRemove_5.style.width = "100%";
	}
	
	b = doc.documentElement.outerHTML;
	
	b = updateHtmlLinks(b, d); 
	a = buildUri(a, c, e); 
	d += a;
	
    return new ResponseData(b, c, e, d)
}

function buildUri(a, b, c) {
    return "/"+ encodeGetParam(a)+"/"+codeFromLanguage(c)+"/ru/"
};