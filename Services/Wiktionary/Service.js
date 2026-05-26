function serviceHeader() {
    return new ServiceHeader(82, "Wiktionary", "is a multilingual, web-based project to create a free content dictionary of terms (including words, phrases, proverbs, linguistic reconstructions, etc.) in all natural languages and in a number of artificial languages." + Const.NL2 + "https://wiktionary.org/" + Const.NL2 + "Definitions and other text are available under the Creative Commons Attribution-ShareAlike License; additional terms may apply.", Capability.DICTIONARY)
}

function serviceHost(a, b, c) {
    a = codeFromLanguage(a == Capability.DICTIONARY ? c : b);
    a == UNKNOWN_LANGUAGE_CODE && (a = SupportedLanguages[ENGLISH_LANGUAGE]);
    return format("https://{0}.wiktionary.org", a)
}

function serviceLink(a, b, c) {
    return "https://www.wiktionary.org/"
}
SupportedLanguages = [-1, "", "af", "az", "sq", "ar", "hy", "eu", "be", "bg", "ca", "zh", "zh", "hr", "cs", "da", "nl", "en", "et", "fi", -1, "fr", "gl", "de", "el", "ht", "he", "hi", "hu", "is", "id", "it", "ga", "ja", "ka", "ko", "lv", "lt", "mk", "ms", "mt", "no", "fa", "pl", "pt", "ro", "ru", "sr", "sk", "sl", "es", "sw", "sv", "th", "tr", "uk", "ur", "vi", "cy", "yi", "eo", "hmn", "la", "lo", "kk", "uz", "si", "tg", "te", "km", "mn", "kn", "ta", "mr", "bn", "tt"];

function serviceDictionaryRequest(a, b, c) {
    a = buildUri(a, b, c);
    return new RequestData(HttpMethod.GET, a)
}

function serviceDictionaryResponse(a, b, c, e) {
    var d;
    // if (b)   

	b = b.replace(/<li class="mw-empty-elt"(\sid=".*?")?><\/li>/g, "");

	// b = removeAttributes(b + "></div>", ["id", "name", "class"]), 
	d = serviceHost(Capability.DICTIONARY, c, e), 
	b = b.replace(/href="\.\//g, 'href="/wiki/');
	b = updateHtmlLinks(b, d); 
	a = buildUri(a, c, e);
	d += a;
	
    return new ResponseData(b, c, e, d)
}

function buildUri(a, b, c) {
    return "/api/rest_v1/page/html/" + encodeGetParam(a)
};