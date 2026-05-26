function serviceHeader() {
    return new ServiceHeader(94, "Translatero", "Simultaneous translation for 99 languages with examples of the use of words in context." + Const.NL2 + "https://ru.translatero.com" + Const.NL2 + "© 2023 Translatero.com - contextual dictionary and online translator", Capability.TRANSLATE)
}

function serviceHost(e, t, n) {
    return "https://ru.translatero.com"
}

function serviceLink(e, t, n) {
    return "https://ru.translatero.com"
}

function serviceTranslateRequest(a, b, c) {

    return new RequestData(HttpMethod.POST, "/", "from="+codeFromLanguage(b)+"&text="+encodePostParam(a)+"&submit_translate=%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4&to="+codeFromLanguage(c),
	"Content-Type: application/x-www-form-urlencoded" + Const.NL +
	"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"+ Const.NL +
	"Accept-Language: en-US,en;q=0.5" + Const.NL +
	"Host: ru.translatero.com" + Const.NL +
	"Origin: https://ru.translatero.com" + Const.NL +
	"Referer: https://ru.translatero.com/anglijskij-russkij/perevod/" + Const.NL +
	"Connection: keep-alive"  + Const.NL +
	"Cookie: " + cookie_translatero.split(";")[0] + Const.NL + 
	"User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0"
	)
}

function serviceTranslateResponse(a, b, c, d) {
	// var doc = new ActiveXObject("htmlfile");
	// doc.write(b);
	// b = doc.getElementById("translit");
	// b = b.value;
	// doc = "";
	
	var regex = /<textarea.*?id="translit".*?>(.*?)<\/textarea>/;
	var match = regex.exec(b);

	if (match && match.length > 1) {
	  b = match[1];
	} else {
	  b = "Element not found or empty";
	}
	
    return new ResponseData(b, c, d, null, a)
}
SupportedLanguages = [-1,"",-1,"az",-1,"ar","hy",-1,"be","bg","ca",-1,-1,"hr","cs","da","nl","en","et","fi",-1,"fr",-1,"de","el",-1,"he","hi","hu",-1,"id","it",-1,"ja","ka","ko","lv","lt",-1,"ms",-1,"no","fa","pl","pt","ro","ru","sr","sk","sl","es",-1,"sv","th","tr","uk","ur","vi",-1,"yi",-1,-1,"la",-1,"kk","uz",-1,"tg","te",-1,-1,-1,"ta",-1,"bn","tt"];

	var xmlHttp1 = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
	xmlHttp1.open("GET", "https://ru.translatero.com/anglijskij-russkij/perevod/", false);
	xmlHttp1.send(null);
 	cookie_translatero = xmlHttp1.getResponseHeader("Set-Cookie");