/**
 * Author: Yanhao Wang
 */
var fpMap = {};
function myTrim(x) {
	return x.replace(/^\s+|\s+$/gm,'');
}
function createCookie(name, value, days) {
	var date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	document.cookie = name + "=" + value + ";expires=" + date.toGMTString() + ";path=/;";
}
function readCookie(name) {
	var items = document.cookie.split(';');
	for (var i = 0; i < items.length; i++) {
		var item = myTrim(items[i]);
		var pair = item.split('=');
		if (pair.length != 2) continue;
		if (pair[0] == name) return pair[1];
	}
	return "";
}
function getFP() {
	// user agent
	var ua = navigator.userAgent;
	// product
	var prod = navigator.product + "," + navigator.productSub;
	// vendor
	var vend = navigator.vendor + "," + navigator.vendorSub;
	// language
	var lan = navigator.language + ";" + navigator.languages;
	// cookie enabled
	var ce = navigator.cookieEnabled;
	// do not track
	var dnt = navigator.doNotTrack || "undefined";
	// platform
	var platform = navigator.platform;
	// cpuclass
	var cpuclass = navigator.cpuClass || "unknown";
	// plugins
	var plugins = getPlugins();
	// fonts
	var fonts = getFontList();

	// spuercookies
	var sc = testSuperCookie();
	// timezone
	var tz = new Date().getTimezoneOffset();
	// screen resolution
	var sr = "";
	if (screen.width > screen.height) sr = screen.height + "X" + screen.width + "X" + screen.colorDepth;
	else sr = screen.width + "X" + screen.height + "X" + screen.colorDepth;
	// html5
	var html5 = getHtml5();
	// css3
	var css3 = getCSS3();
	// non core detects
	var noncore = getNonCore();

	// Canvas: Pixel Extraction
	var pixel1 = "", pixel2 = "", pixelHash = "";
	if (isCanvasSupported()) {
		//pixel1 = getPixelExtraction("sans-serif");
		//pixel2 = getPixelExtraction("no-real-font-" + (Math.floor(Math.random * 1000)));
		var tmp = [];
		tmp.push(murmurhash3_32_gc(getPixelExtraction("sans-serif"), 31));
		tmp.push(murmurhash3_32_gc(getPixelExtraction("sans-serif-light"), 31));
		tmp.push(murmurhash3_32_gc(getPixelExtraction("sans-serif-thin"), 31));
		tmp.push(murmurhash3_32_gc(getPixelExtraction("sans-serif-condensed"), 31));
		tmp.push(murmurhash3_32_gc(getPixelExtraction("sans-serif-medium"), 31));
		tmp.push(murmurhash3_32_gc(getPixelExtraction("sans-serif-black"), 31));
		tmp.push(murmurhash3_32_gc(getPixelExtraction("sans-serif-condensed-light"), 31));
		tmp.push(murmurhash3_32_gc(getPixelExtraction("serif"), 31));
		tmp.push(murmurhash3_32_gc(getPixelExtraction("monospace"), 31));
		tmp.push(murmurhash3_32_gc(getPixelExtraction("Droid Sans"), 31));
		pixelHash = tmp.join("##");
	}

	// WebGL
	var gl = "";
	var teapot = undefined;
	try {
		var supportedWebGL = webgl_detect();
		console.log(supportedWebGL);
		if (supportedWebGL.length > 0) {
			teapot = new WebGLTeapot("test_webgl", "webgl", supportedWebGL[0]);
			teapot.run();
			//gl = teapot.canvas.toDataURL();
		}
	} catch (e) {}

	// set cookie
	if (readCookie("FP") == "") {
		createCookie("FP", Math.random().toString().substr(2), 1000);
	}
	var ck = readCookie("FP");

	function isCanvasSupported() {
		var elem = document.createElement('canvas');
		return !!(elem.getContext && elem.getContext('2d'));
	}



	// d = new FontDetector(); d.detect('font name');
	var FontDetector = function() {
		// a font will be compared against all the three default fonts.
		// and if it doesn't match all 3 then that font is not available.
		var baseFonts = ['monospace', 'sans-serif', 'serif'];

		//we use m or w because these two characters take up the maximum width.
		// And we use a LLi so that the same matching fonts can get separated
		var testString = "mmmmmmmmmmlli";

		//we test using 72px font size, we may use any size. I guess larger the better.
		var testSize = '72px';

		var h = document.getElementsByTagName("body")[0];

		// create a SPAN in the document to get the width of the text we use to test
		var s = document.createElement("span");
		s.style.fontSize = testSize;
		s.innerHTML = testString;
		var defaultWidth = {};
		var defaultHeight = {};
		for (var index in baseFonts) {
			//get the default width for the three base fonts
			s.style.fontFamily = baseFonts[index];
			h.appendChild(s);
			defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
			defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
			h.removeChild(s);
		}

		function detect(font) {
			var detected = false;
			for (var index in baseFonts) {
				s.style.fontFamily = font + ',' + baseFonts[index]; // name of the font along with the base font for fallback.
				h.appendChild(s);
				var matched = (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]);
				h.removeChild(s);
				detected = detected || matched;
			}
			return detected;
		}

		this.detect = detect;
	};

	function getFontList() {
		var res = [];
		var baseFonts = ['sans-serif', 'sans-serif-light', 'sans-serif-thin', 'sans-serif-condensed', 'sans-serif-medium', 'sans-serif-black', 'sans-serif-condensed-light', 'serif', 'monospace', 'Droid Sans'];
		var testString = "mmmmmmmmmmlli";
		var testSize = '96px';

		var h = document.getElementsByTagName("fp")[0];
		var s = document.createElement("span");
		s.style.fontSize = testSize;
		s.innerHTML = testString;
		for (var index in baseFonts) {
			//get the default width for the three base fonts
			s.style.fontFamily = baseFonts[index];
			h.appendChild(s);
			res.push("" + s.offsetWidth + "X" + s.offsetHeight);
			h.removeChild(s);
		}
		return res.join("##");
	}

	function getPixelExtraction(fontfamily) {
		var canvas = document.createElement('canvas');
		canvas.width = 350;
		canvas.height = 30;
		var ctx = canvas.getContext('2d');
		var txt = 'Cwm fjordbank glyphs vext quiz 0123456789';
		ctx.textBaseline = "alphabetic";
		ctx.fillStyle = "#f60";
		ctx.fillRect(125, 1, 102, 24);
		ctx.fillStyle = "#069";
		ctx.font = "14px " + fontfamily;
		ctx.fillText(txt, 2, 18);
		return canvas.toDataURL();
	}

	function getPlugins() {
		var plugins = "";
		if (navigator.plugins) {
			var np = navigator.plugins;
			var plist = new Array();

			for (var i = 0; i < np.length; i++) {
				plist[i] = np[i].name + ";";
				plist[i] += np[i].description + ";";
				plist[i] += np[i].filename + ";";
				for (var n = 0; n < np[i].length; n++) {
					plist[i] += "(" + np[i][n].description + ";" + np[i][n].type + ";" + np[i][n].suffixes + ";)";
				}
			}
			// plist.sort();
			plugins += plist.length + "##";
			for (i = 0; i < np.length; i++)
				plugins += plist[i] + "##";
		}
		return plugins;
	}

	function getHtml5() {
		var html5 = "";
		html5 += "application_Cache:" + Modernizr.applicationcache + ";";
		html5 += "Canvas:" + Modernizr.canvas + ";";
		html5 += "Canvas_Text:" + Modernizr.canvastext + ";";
		html5 += "Drag_Drop:" + Modernizr.draganddrop + ";";
		html5 += "hashchange:" + Modernizr.hashchange + ";";
		html5 += "History:" + Modernizr.history + ";";
		html5 += "HTML5_Audio:" + Modernizr.audio + ";";
		html5 += "HTML5_Video:" + Modernizr.video + ";";
		html5 += "IndexedDB:" + Modernizr.indexeddb + ";";

		//input attributes
		var msg = "";
		for (var attr in Modernizr.input) {
			msg += attr + ',';
		}
		html5 += "Input_Attributes:" + msg + ";";
		//input types
		msg = "";
		for (var attr in Modernizr.inputtypes) {
			msg += attr + ',';
		}
		html5 += "Input_Types:" + msg + ";";

		html5 += "localStorage:" + Modernizr.localstorage + ";";
		html5 += "postMessage:" + Modernizr.postmessage + ";";
		html5 += "sessionStorage:" + Modernizr.sessionstorage + ";";
		html5 += "Web_Sockets:" + Modernizr.websockets + ";";
		html5 += "Web_SQL_Database:" + Modernizr.websqldatabase + ";";
		html5 += "Web_Workers:" + Modernizr.webworkers + ";";
		html5 += "Geolocation_API:" + Modernizr.geolocation + ";";
		html5 += "Inline_SVG:" + Modernizr.inlinesvg + ";";
		html5 += "SMIL:" + Modernizr.smil + ";";
		html5 += "SVG:" + Modernizr.svg + ";";
		html5 += "SVG_Clip_Paths:" + Modernizr.svgclippaths + ";";
		html5 += "Touch_events:" + Modernizr.touch + ";";
		html5 += "WebGl:" + Modernizr.webgl;
		return html5;
	}

	function getCSS3() {
		var css3 = "";
		css3 += "font_face:" + Modernizr.fontface + ";";
		css3 += "background_size:" + Modernizr.backgroundsize + ";";
		css3 += "border_image:" + Modernizr.borderimage + ";";
		css3 += "border_radius:" + Modernizr.borderradius + ";";
		css3 += "box_shadow:" + Modernizr.boxshadow + ";";
		css3 += "Flexible_Box_Model:" + Modernizr.flexbox + ";";
		css3 += "HSLA:" + Modernizr.hsla + ";";
		css3 += "Multiple_Backgrounds:" + Modernizr.multiplebgs + ";";
		css3 += "Opacity:" + Modernizr.opacity + ";";
		css3 += "RGBA:" + Modernizr.rgba + ";";
		css3 += "text_shadow:" + Modernizr.textshadow + ";";
		css3 += "CSS_Animations:" + Modernizr.cssanimations + ";";
		css3 += "CSS_Columns:" + Modernizr.csscolumns + ";";
		css3 += "Generated_Content" + Modernizr.generatedcontent + ";"
		css3 += "CSS_Gradients:" + Modernizr.cssgradients + ";";
		css3 += "CSS_Reflections:" + Modernizr.cssreflections + ";";
		css3 += "CSS_2D_Transforms:" + Modernizr.csstransforms + ";";
		css3 += "CSS_3D_Transforms:" + Modernizr.csstransforms3d + ";";
		css3 += "CSS_Transitions:" + Modernizr.csstransitions;
		return css3;
	}

	function getNonCore() {
		var res = "";
		res += (Modernizr.adownload ? "1" : "0");
		res += (Modernizr.audiodata ? "1" : "0");
		res += (Modernizr.webaudio ? "1" : "0");
		res += (Modernizr.battery ? "1" : "0");
		res += (Modernizr.lowbattery ? "1" : "0");
		res += (Modernizr.blobconstructor ? "1" : "0");
		res += (Modernizr.todataurljpeg ? "1" : "0");
		res += (Modernizr.todataurlpng ? "1" : "0");
		res += (Modernizr.todataurlwebp ? "1" : "0");
		res += (Modernizr.contenteditable ? "1" : "0");
		res += (Modernizr.contentsecuritypolicy ? "1" : "0");
		res += (Modernizr.contextmenu ? "1" : "0");
		res += (Modernizr.cookies ? "1" : "0");
		res += (Modernizr.cors ? "1" : "0");
		res += (Modernizr.bgpositionshorthand ? "1" : "0");
		res += (Modernizr.bgpositionxy ? "1" : "0");
		res += (Modernizr.bgrepeatspace ? "1" : "0");
		res += (Modernizr.bgrepeatround ? "1" : "0");
		res += (Modernizr.bgsizecover ? "1" : "0");
		res += (Modernizr.boxsizing ? "1" : "0");
		res += (Modernizr.csscalc ? "1" : "0");
		res += (Modernizr.cubicbezierrange ? "1" : "0");
		res += (Modernizr["display-runin"] ? "1" : "0");
		res += (Modernizr["display-table"] ? "1" : "0");
		res += (Modernizr.cssfilters ? "1" : "0");
		res += (Modernizr.csshyphens ? "1" : "0");
		res += (Modernizr.softhyphens ? "1" : "0");
		res += (Modernizr.softhyphensfind ? "1" : "0");
		res += (Modernizr.lastchild ? "1" : "0");
		res += (Modernizr.cssmask ? "1" : "0");
		res += (Modernizr.mediaqueries ? "1" : "0");
		res += (Modernizr["object-fit"] ? "1" : "0");
		res += (Modernizr.overflowscrolling ? "1" : "0");
		res += (Modernizr.pointerevents ? "1" : "0");
		res += (Modernizr.csspositionsticky ? "1" : "0");
		res += (Modernizr.cssremunit ? "1" : "0");
		res += (Modernizr.regions ? "1" : "0");
		res += (Modernizr.cssresize ? "1" : "0");
		res += (Modernizr.cssscrollbar ? "1" : "0");
		res += (Modernizr.subpixelfont ? "1" : "0");
		res += (Modernizr.supports ? "1" : "0");
		res += (Modernizr.userselect ? "1" : "0");
		res += (Modernizr.cssvhunit ? "1" : "0");
		res += (Modernizr.cssvmaxunit ? "1" : "0");
		res += (Modernizr.cssvminunit ? "1" : "0");
		res += (Modernizr.cssvwunit ? "1" : "0");
		res += (Modernizr.customprotocolhandler ? "1" : "0");
		res += (Modernizr.dataview ? "1" : "0");
		res += (Modernizr.classlist ? "1" : "0");
		res += (Modernizr.dataset ? "1" : "0");
		res += (Modernizr.microdata ? "1" : "0");
		res += (Modernizr.details ? "1" : "0");
		res += (Modernizr.outputelem ? "1" : "0");
		res += (Modernizr.progressbar ? "1" : "0");
		res += (Modernizr.meter ? "1" : "0");
		res += (Modernizr.ruby ? "1" : "0");
		res += (Modernizr.time ? "1" : "0");
		res += (Modernizr.track ? "1" : "0");
		res += (Modernizr.texttrackapi ? "1" : "0");
		res += (Modernizr.emoji ? "1" : "0");
		res += (Modernizr.strictmode ? "1" : "0");
		res += (Modernizr.devicemotion ? "1" : "0");
		res += (Modernizr.deviceorientation ? "1" : "0");
		res += (Modernizr["exif-orientation"] ? "1" : "0");
		res += (Modernizr.filereader ? "1" : "0");
		res += (Modernizr.filesystem ? "1" : "0");
		res += (Modernizr.fileinput ? "1" : "0");
		res += (Modernizr.formattribute ? "1" : "0");
		res += (Modernizr.speechinput ? "1" : "0");
		res += (Modernizr.formvalidation ? "1" : "0");
		res += (Modernizr.fullscreen ? "1" : "0");
		res += (Modernizr.gamepads ? "1" : "0");
		res += (Modernizr.getusermedia ? "1" : "0");
		res += (Modernizr.ie8compat ? "1" : "0");
		res += (Modernizr.sandbox ? "1" : "0");
		res += (Modernizr.seamless ? "1" : "0");
		res += (Modernizr.srcdoc ? "1" : "0");
		res += (Modernizr.apng ? "1" : "0");
		res += (Modernizr.webp ? "1" : "0");
		res += (Modernizr.json ? "1" : "0");
		res += (Modernizr.olreversed ? "1" : "0");
		res += (Modernizr.mathml ? "1" : "0");
		res += (Modernizr.lowbandwidth ? "1" : "0");
		res += (Modernizr.eventsource ? "1" : "0");
		res += (Modernizr.xhr2 ? "1" : "0");
		res += (Modernizr.notification ? "1" : "0");
		res += (Modernizr.performance ? "1" : "0");
		res += (Modernizr.pointerlock ? "1" : "0");
		res += (Modernizr.quotamanagement ? "1" : "0");
		res += (Modernizr.raf ? "1" : "0");
		res += (Modernizr.scriptasync ? "1" : "0");
		res += (Modernizr.scriptdefer ? "1" : "0");
		res += (Modernizr.stylescoped ? "1" : "0");
		res += (Modernizr.svgfilters ? "1" : "0");
		res += (Modernizr.unicode ? "1" : "0");
		res += (Modernizr.datauri ? "1" : "0");
		res += (Modernizr.userdata ? "1" : "0");
		res += (Modernizr.vibrate ? "1" : "0");
		res += (Modernizr.webintents ? "1" : "0");
		res += (Modernizr.websocketsbinary ? "1" : "0");
		res += (Modernizr.framed ? "1" : "0");
		res += (Modernizr.sharedworkers ? "1" : "0");
		return res;
	}

	function testSuperCookie() {
		try {
			localStorage.fptest = "FP";
			sessionStorage.fptest = "FP";
		} catch (ex) {}

		var supported = "";
		//DOM localStorage
		try {
			if (localStorage.fptest == "FP") {
				supported += "1";
			} else {
				supported += "0";
			}
		} catch (ex) {
			supported += "0";
		}

		//DOM sessionStorage
		try {
			if (sessionStorage.fptest == "FP") {
				supported += "1";
			} else {
				supported += "0";
			}
		} catch (ex) {
			supported += "0";
		}

		//IE userData
		try {
			oPersistDiv.setAttribute("remember", "remember this value");
			oPersistDiv.save("oXMLStore");
			oPersistDiv.setAttribute("remember", "overwritten!");
			oPersistDiv.load("oXMLStore");
			if ("remember this value" == (oPersistDiv.getAttribute("remember"))) {
				supported += "1";
			} else {
				supported += "0";
			}
		} catch (ex) {
			supported += "0";
		}
		return supported;
	}

	function murmurhash3_32_gc(key, seed) {
		var remainder, bytes, h1, h1b, c1, c2, k1, i;

		remainder = key.length & 3; // key.length % 4
		bytes = key.length - remainder;
		h1 = seed;
		c1 = 0xcc9e2d51;
		c2 = 0x1b873593;
		i = 0;

		while (i < bytes) {
			k1 =
				((key.charCodeAt(i) & 0xff)) |
				((key.charCodeAt(++i) & 0xff) << 8) |
				((key.charCodeAt(++i) & 0xff) << 16) |
				((key.charCodeAt(++i) & 0xff) << 24);
			++i;

			k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
			k1 = (k1 << 15) | (k1 >>> 17);
			k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

			h1 ^= k1;
			h1 = (h1 << 13) | (h1 >>> 19);
			h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
			h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
		}

		k1 = 0;

		switch (remainder) {
			case 3:
				k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
			case 2:
				k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
			case 1:
				k1 ^= (key.charCodeAt(i) & 0xff);

				k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
				k1 = (k1 << 15) | (k1 >>> 17);
				k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
				h1 ^= k1;
		}

		h1 ^= key.length;

		h1 ^= h1 >>> 16;
		h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
		h1 ^= h1 >>> 13;
		h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
		h1 ^= h1 >>> 16;

		return h1 >>> 0;
	}

	function webgl_detect() {
		var supported = [];
		if (!!window.WebGLRenderingContext) {
			var canvas = document.createElement("canvas"),
				names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
				context = false;
			for (var i = 0; i < 4; i++) {
				try {
					context = canvas.getContext(names[i]);
					if (context && typeof context.getParameter == "function") {
						// WebGL is enabled
						supported.push(names[i]);
					}
				} catch (e) {}
			}
			// WebGL is supported, but disabled
			return supported;
		}
		// WebGL not supported
		return supported;
	}

	fpMap = {"cookie": ck, "ua": ua, "prod": prod, "vend": vend, "lan": lan, "ce": ce, "dnt": dnt, "platform": platform, "cpuclass": cpuclass, "plugins": plugins, "fontlist": fonts, "sc": sc, "tz": tz, "sr": sr, "html5": html5, "css3": css3, "noncore": noncore, "pixelhash": pixelHash, "webgl": gl};
	//return JSON.stringify(fpMap);
	//return fpMap;
	setTimeout(function(){
		//console.log(teapot.canvas.toDataURL());
		// if (teapot != undefined) fpMap["webgl"] = murmurhash3_32_gc(teapot.canvas.toDataURL(), 31);
		// //ajaxSendFP("http://wyhao.org/android/browser/collectfp.php", JSON.stringify(fpMap));
		// var data = [];
		// for (key in fpMap) {
		// 	if (key == "cookie") continue;
		// 	var val = fpMap[key];
		// 	if (key == 'plugins' || key == 'pixelhash' || key == 'fontlist') {
		// 		val = val.replace(/##/g, '<br / >');
		// 	} else if (key == 'html5' || key == 'css3') {
		// 		val = val.replace(/;/g, '<br / >');
		// 	}
		// 	data.push({"qidname": key, "qidvalue": val});
		// }
		// $('#browserfp').bootstrapTable('load', data);
		/*
		$("#uploadButton").removeClass("disabled");
		$('#uploadButton').click(function() {
			ajaxSendFP("http://223.3.94.43:8090/webfp/uploadfp", JSON.stringify({"uploadFP": fpMap}));
		});
		*/
		ajaxSendFP("http://223.3.71.241/webfp/uploadfp", JSON.stringify({"uploadFP": fpMap}));
	}, 1500);
}

// Ajax
function ajaxSendFP(url, data) {
	//console.log(data.toString());
	var xmlhttp;
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari, Android
		xmlhttp = new XMLHttpRequest();
	} else {
		// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 ) {
			if(xmlhttp.status == 200){
				// ok
				var data = JSON.parse(xmlhttp.responseText);
				console.log(data);
				createCookie('FpID', data['FpID'], 1000);
			} else {
				//alert(xmlhttp.status);
				// error
			}
		}
	}
	xmlhttp.open("POST", url, true);
	xmlhttp.send(data);
}

//main();
