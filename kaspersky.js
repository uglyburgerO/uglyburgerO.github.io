(function(){
var AvNs = {SIGNATURE:"7D8B79A2-8974-4D7B-A76A-F4F29624C06Brzzds53jw0MDraTnD0QSfwzGQR0NFEsepzs4hykDnDpvrc2PVeAbqksBeuy-FZ4qp0fODYmLzcp-fVzOeZ6Xlg",PREFIX:"https://gc.kis.v2.scr.kaspersky-labs.com/",INJECT_ID:"FD126C42-EBFA-4E12-B309-BB3FDD723AC1",RESOURCE_ID:"E3E8934C-235A-4B0E-825A-35A08381A191",IsWebExtension: function(){return false;}}; var AvNs = (function IeJsonMain(context) 
{
    function GetClass(obj) {
        if (typeof obj === "undefined")
            return "undefined";
        if (obj === null)
            return "null";
        return Object.prototype.toString.call(obj)
            .match(/^\[object\s(.*)\]$/)[1];
    }
    var exports = {}, undef;
    function ObjectToJson(object) {
        if (object === null || object === Infinity || object === -Infinity || object === undef)
            return "null";
        var className = GetClass(object);
        if (className === "Boolean") {
            return "" + object;
        } else if (className === "Number") {
            return window.isNaN(object) ? "null" : "" + object;
        } else if (className === "String") {
            var escapedStr = "" + object;
            return "\"" + escapedStr.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + "\"";
        }
        if (typeof object === "object") {
            if (!ObjectToJson.check) ObjectToJson.check = [];
            for (var i=0, chkLen=ObjectToJson.check.length ; i&lt;chkLen ; ++i) {
                if (ObjectToJson.check[i] === object) {
                    throw new TypeError();
                }
            }
            ObjectToJson.check.push(object);
            var str = '';
            if (className === "Array" || className === "Array Iterator") {
                for (var index = 0, length = object.length; index &lt; length; ++index) {
                    str += ObjectToJson(object[index]) + ',';
                }
                ObjectToJson.check.pop();
                return "["+str.slice(0,-1)+"]";
            } else {
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        str += '"' + property + '":' + ObjectToJson(object[property]) + ',';
                    }
                }
                ObjectToJson.check.pop();
                return "{"+str.slice(0,-1)+"}";
            }
        }
        return undef;
    }
    exports.stringify = function stringify(source) {
        return ObjectToJson(source);
    };
    var parser = {
        source : null,
        grammar : /^[\x20\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/,
        ThrowError : function ThrowError() {
            throw new SyntaxError('JSON syntax error');
        },
        NextToken : function NextToken(token) {
            this.source = token.input.slice(token[0].length);
            return this.grammar.exec(this.source);
        },
        ParseArray : function ParseArray(){
            var token = this.grammar.exec(this.source),
                parseItem = token &amp;&amp; token[1] !== ']',
                result = [];
            for(;;token = this.NextToken(token)) {
                if (!token)
                    this.ThrowError();
                if (parseItem) {
                    result.push(this.ParseValue(token));
                    token = this.grammar.exec(this.source);
                } else {
                    if (token[1]) {
                        if (token[1] === ']') {
                            break;
                        } else if (token[1] !== ',') {
                            this.ThrowError();
                        }
                    } else {
                        this.ThrowError();
                    }
                }
                parseItem = !parseItem;
            }
            return result;
        },
        ParseObject : function ParseObject(){
            var propertyName, parseProperty = true, result = {};
            for(var token = this.grammar.exec(this.source);;token = this.NextToken(token)) {
                if (!token)
                    this.ThrowError();
                if (parseProperty) {
                    if (token[1] &amp;&amp; token[1] === '}') {
                        break;
                    } else if (token[1] || token[2] || !token[3]) {
                        this.ThrowError();
                    }
                    propertyName = token[3];
                    token = this.NextToken(token);
                    if (!token || !token[1] || token[1] !== ':')
                        this.ThrowError();
                    parseProperty = false;
                } else {
                    if (!propertyName)
                        this.ThrowError();
                    result[ propertyName ] = this.ParseValue(token);
                    token = this.NextToken(this.grammar.exec(this.source));
                    if (token[1]) {
                        if (token[1] === '}') {
                            break;
                        } else if (token[1] !== ',') {
                            this.ThrowError();
                        }
                    } else {
                        this.ThrowError();
                    }
                    propertyName = undef;
                    parseProperty = true;
                }
            }
            return result;
        },
        ParseValue : function ParseValue(token){
            if (token[1]) {
                switch (token[1]){
                    case '[' :
                        this.source = this.source.slice(token[0].length);
                        return this.ParseArray();
                    case '{' :
                        this.source = this.source.slice(token[0].length);
                        return this.ParseObject();
                    case 'true' :
                        return true;
                    case 'false' :
                        return false;
                    case 'null' :
                        return null;
                    default:
                        this.ThrowError();
                }
            } else if (token[2]) {
                return  +token[2];
            }
            return token[3].replace(/\\(?:u(.{4})|(["\\\/'bfnrt]))/g, function replaceCallback(substr, utfCode, esc){
                if(utfCode)
                {
                    return String.fromCharCode(parseInt(utfCode, 16));
                }
                else
                {
                    switch(esc) {
                        case 'b': return '\b';
                        case 'f': return '\f';
                        case 'n': return '\n';
                        case 'r': return '\r';
                        case 't': return '\t';
                        default:
                            return esc;
                    }
                }
            });
        },
        Parse : function Parse(str) {
            if ('String' !== GetClass(str))
                throw new TypeError();
            this.source = str;
            var token = this.grammar.exec(this.source);
            if (!token)
                this.ThrowError();
            return this.ParseValue(token);
        }
    };
    exports.parse = function parse(source) {
        return parser.Parse(source);
    };
    if (window.JSON)
    {
        var originStringify = JSON.stringify;
        function StringifyWrapper(source)
        {
            if (Array.prototype.toJSON || String.prototype.toJSON)
                return exports.stringify(source);
            return originStringify(source);
        }
        context["JSONStringify"] = JSON.stringify ? StringifyWrapper : exports.stringify;
        context["JSONParse"] = JSON.parse || exports.parse;
    }
    else
    {
        context["JSONStringify"] = exports.stringify;
        context["JSONParse"] = exports.parse;
    }
    return context;
})(AvNs || {});
(function CommonMain(ns)
{
    ns.XMLHttpRequest = window.XMLHttpRequest;
    ns.XDomainRequest = window.XDomainRequest;
    ns.XMLHttpRequestOpen = window.XMLHttpRequest &amp;&amp; window.XMLHttpRequest.prototype.open;
    ns.XMLHttpRequestSend = window.XMLHttpRequest &amp;&amp; window.XMLHttpRequest.prototype.send;
    ns.XMLHttpRequestAbort = window.XMLHttpRequest &amp;&amp; window.XMLHttpRequest.prototype.abort;
    ns.XMLHttpRequestSetRequestHeader = window.XMLHttpRequest &amp;&amp; window.XMLHttpRequest.prototype.setRequestHeader;
    var originalCreateTreeWalker = document.createTreeWalker;
    ns.CreateTreeWalker = function CreateTreeWalker(root, whatToShow, filter, entityReferenceExpansion)
    {   
        if (typeof (originalCreateTreeWalker) !== "function")
            throw new Error("document.createTreeWalker not implemented");
        return originalCreateTreeWalker.call(document, root, whatToShow, filter, entityReferenceExpansion);
    };
    ns.EmptyFunc = function EmptyFunc()
    {
    };
    ns.MaxRequestDelay = 2000;
    ns.Log = ns.EmptyFunc;
    ns.SessionLog = ns.Log;
    ns.SessionError = ns.Log;
    function GetHostAndPort(url)
    {
        if (!url)
            return "";
        var urlString = typeof url !== "string" ? url.toString() : url;
        var hostBeginPos = urlString.indexOf("//");
        if (hostBeginPos === -1)
        {
            urlString = document.baseURI || "";
            hostBeginPos = urlString.indexOf("//");
            if (hostBeginPos === -1)
                return "";
        }
        hostBeginPos += 2;
        var hostEndPos = urlString.indexOf("/", hostBeginPos);
        if (hostEndPos === -1)
            hostEndPos = urlString.length;
        var originParts = urlString.substring(0, hostEndPos).split("@");
        var origin = originParts.length &gt; 1 ? originParts[1] : originParts[0];
        return origin[0] === "/" ? document.location.protocol + origin : origin;
    }
    ns.IsCorsRequest = function IsCorsRequest(url, initiator)
    {
        try
        {
            var urlOrigin = GetHostAndPort(url);
            var initiatorOrigin = GetHostAndPort(initiator);
            return Boolean(urlOrigin) &amp;&amp; Boolean(initiatorOrigin) &amp;&amp; urlOrigin !== initiatorOrigin;
        }
        catch (e)
        {
            ns.SessionLog("Error check CORS request, url: " + url + " , initiator: " + initiator + ", error: " + e.message);
            return false;
        }
    };
    ns.TryCreateUrl = function TryCreateUrl(url)
    {
        try
        {
            return new URL(url);
        }
        catch (e)
        {
            ns.SessionLog("Can't create URL from " + url);
            return null;
        }
    };
    ns.TrySendMessage = function TrySendMessage(port, message)
    {
        try
        {
            port.postMessage(message);
        }
        catch (e)
        {
            if (e.message &amp;&amp; e.message.startsWith("Attempt to postMessage on disconnected port"))
                ns.SessionLog("Attempt to postMessage on disconnected port: " + JSON.stringify(message));
            else
                ns.SessionError(e, "nms_back");
        }
    };
    ns.GetResourceSrc = function GetResourceSrc(resourceName)
    {
        return ns.GetBaseUrl() + ns.RESOURCE_ID + resourceName;
    };
    ns.IsRelativeTransport = function IsRelativeTransport()
    {
        return ns.PREFIX === "/";
    };
    ns.GetBaseUrl = function GetBaseUrl()
    {
        if (!ns.IsRelativeTransport())
            return ns.PREFIX;
        return document.location.protocol + "//" + document.location.host + "/";
    };
    var originalAddEventListener = document.addEventListener;
    var originalWindowAddEventListener = window.addEventListener;
    ns.AddEventListener = function AddEventListener(element, name, func, pluginId)
    {
        if (typeof originalAddEventListener === "function")
        {
            var callingFunction = element === window ? originalWindowAddEventListener : originalAddEventListener;
            callingFunction.call(element,
                name,
                function EventListenerCallback(e)
                {
                    try
                    {
                        func(e || window.event);
                    }
                    catch (ex)
                    {
                        ns.SessionError(ex, pluginId);
                    }
                }, 
                true);
        }
        else
        {
            element.attachEvent("on" + name, 
                function EventListenerCallback(e)
                {
                    try
                    {
                        func.call(element, e || window.event);
                    }
                    catch (ex)
                    {
                        ns.SessionError(ex, pluginId);
                    }
                });
        }
    };
    ns.AddRemovableEventListener = function AddRemovableEventListener(element, name, func)
    {
        if (originalAddEventListener)
        {
            var callingFunction = element === window ? originalWindowAddEventListener : originalAddEventListener;
            callingFunction.call(element, name, func, true);
        }
        else
        {
            element.attachEvent("on" + name, func);
        }
    };
    ns.RemoveElement = function RemoveElement(element)
    {
        element &amp;&amp; element.parentNode &amp;&amp; element.parentNode.removeChild(element);
    };
    ns.RunModule = function RunModule(func, timeout)
    {
        if (document.readyState === "loading")
        {
            if (timeout)
                ns.SetTimeout(func, timeout);
            var delayFunc = function DelayFunc() { ns.SetTimeout(func, 0); };
            if (document.addEventListener)
                ns.AddEventListener(document, "DOMContentLoaded", delayFunc);
            ns.AddEventListener(window, "load", delayFunc);
        }
        else
        {
            ns.SetTimeout(func, 0); 
        }
    };
    ns.RemoveEventListener = function RemoveEventListener(element,  name, func)
    {
        if (element.removeEventListener)
            element.removeEventListener(name, func, true);
        else
            element.detachEvent("on" + name, func);
    };
    var oldSetTimeout = setTimeout;
    ns.SetTimeout = function SetTimeout(func, timeout, pluginId)
    {
        return oldSetTimeout(function TimerCallback()
            {
                try
                {
                    func();
                }
                catch (e)
                {
                    ns.SessionError(e, pluginId);
                }
            },
            timeout);
    };
    var oldSetInterval = setInterval;
    ns.SetInterval = function SetInterval(func, interval, pluginId)
    {
        return oldSetInterval(function IntervalCallback()
            {
                try
                {
                    func();
                }
                catch (e)
                {
                    ns.SessionError(e, pluginId);
                }
            },
            interval);
    };
    ns.GetOwnerNode = function GetOwnerNode(element)
    {
        return element.ownerNode || element.owningElement;
    };
    function InsertStyleRule(style, rule)
    {
        try
        {
            if (style.styleSheet)
            {
                style.styleSheet.cssText += rule + "\n";
            }
            else
            {
                style.appendChild(document.createTextNode(rule));
                ns.SetTimeout(function TimerCallback()
                    {
                        if (!style.sheet)
                            return;
                        var rules = style.sheet.cssRules || style.sheet.rules;
                        if (rules &amp;&amp; rules.length === 0)
                            style.sheet.insertRule(rule);
                    }, 500);
            }
        }
        catch (e)
        {
            if (e.message === "can't access dead object")
                ns.SessionLog("Trying to set css for dead object");
            else
                throw e;
        }
    }
    function FindStyle(document, style)
    {
        for (var i = 0; i &lt; document.styleSheets.length; ++i)
        {
            var ownerNode = ns.GetOwnerNode(document.styleSheets[i]);
            if (ownerNode &amp;&amp; ownerNode.className === "abn_style" &amp;&amp; ownerNode.textContent === style.textContent)
                return ownerNode;
        }
        return null;
    }
    function AddDocumentStyles(document, rules)
    {
        if (typeof rules !== "object" || rules.constructor !== Array)
            return [];
        var styles = [];
        for (var i = 0, len = rules.length; i &lt; len;)
        {
            var style = document.createElement("style");
            style.type = "text/css";
            style.className = "abn_style";
            style.setAttribute("nonce", ns.ContentSecurityPolicyNonceAttribute);
            for (var n = 0; n &lt; 4 &amp;&amp; i &lt; len; ++n, ++i)
            {
                var rule = rules[i];
                if (document.querySelectorAll)
                {
                    InsertStyleRule(style, rule);
                }
                else
                {
                    var styleBegin = rule.lastIndexOf("{");
                    if (styleBegin === -1)
                        continue;
                    var styleText = rule.substr(styleBegin);
                    var selectors = rule.substr(0, styleBegin).split(",");
                    if (style.styleSheet)
                    {
                        var cssText = "";
                        for (var j = 0; j !== selectors.length; ++j)
                            cssText += selectors[j] + styleText + "\n";
                        style.styleSheet.cssText += cssText;
                    }
                    else
                    {
                        for (var k = 0; k !== selectors.length; ++k)
                            style.appendChild(document.createTextNode(selectors[k] + styleText));
                    }
                }
            }
            var inserted = FindStyle(document, style);
            if (inserted &amp;&amp; inserted.parentNode)
                inserted.parentNode.removeChild(inserted);
            if (document.head)
            {
                document.head.appendChild(style);
            }
            else
            {
                var head = document.getElementsByTagName("head")[0];
                if (head)
                {
                    head.appendChild(style);
                }
                else
                {
                    ns.AddEventListener(document, "load", function AddStyle()
                    {
                        var element = document.head || document.getElementsByTagName("head")[0];
                        if (!element)
                            return;
                        for (var l = 0; l !== styles.length; ++l)
                            element.appendChild(styles[l]); 
                    });
                }
            }
            styles.push(style);
        }
        return styles;
    }
    ns.AddStyles = function AddStyles(rules)
    {
        return AddDocumentStyles(document, rules);
    };
    ns.GetCurrentTime = function GetCurrentTime()
    {
        try
        {
            var date = new Date();
            if (date &amp;&amp; date.getTime)
                return date.getTime();
            throw new Error("Cannot call getTime for date: " + date);
        }
        catch (e)
        {
            ns.SessionError(e);
            return 0;
        }
    };
    ns.GetPageScroll = function GetPageScroll()
    {
        var documentScrollLeft = 0;
        var documentScrollTop = 0;
        if (document.documentElement)
        {
            documentScrollLeft = document.documentElement.scrollLeft;
            documentScrollTop = document.documentElement.scrollTop;
        }
        var bodyScrollLeft = 0;
        var bodyScrollTop = 0;
        if (document.body)
        {
            bodyScrollLeft = document.body.scrollLeft;
            bodyScrollTop = document.body.scrollTop;
        }
        return { left: documentScrollLeft || bodyScrollLeft || 0, top: documentScrollTop || bodyScrollTop || 0 };
    };
    ns.GetPageHeight = function GetPageHeight()
    {
        return document.documentElement.clientHeight || document.body.clientHeight;
    };
    ns.GetPageWidth = function GetPageWidth()
    {
        return document.documentElement.clientWidth || document.body.clientWidth;
    };
    ns.IsDefined = function IsDefined(variable)
    {
        return typeof variable !== "undefined";
    };
    ns.StopProcessingEvent = function StopProcessingEvent(evt)
    {
        if (evt.preventDefault)
            evt.preventDefault();
        else
            evt.returnValue = false;
        if (evt.stopPropagation)
            evt.stopPropagation();
        if (ns.IsDefined(evt.cancelBubble))
            evt.cancelBubble = true;
    };
    function Base64EncodeUnicode(str)
    {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1)
            {
                return String.fromCharCode("0x" + p1);
            }));
    }
    ns.ToBase64 = function ToBase64(value)
    {
        if (ns.IsDefined(window.btoa))
            return Base64EncodeUnicode(value);
        var Base64Alphabit = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var plain = value;
        var padLength = 0;
        if (plain.length % 3)
        {
            padLength = 3 - (plain.length % 3);
            for (var j = 0; j &lt; padLength; ++j)
                plain += "\0";
        }
        var result = "";
        for (var i = 0; i &lt; plain.length; i += 3)
        {
            var byte1 = plain.charCodeAt(i);
            var byte2 = plain.charCodeAt(i + 1);
            var byte3 = plain.charCodeAt(i + 2);
            var temp = (byte1 &lt;&lt; 16) | (byte2 &lt;&lt; 8) | byte3;
            var sixBit1 = (temp &gt;&gt; 18) &amp; 0x3f;
            var sixBit2 = (temp &gt;&gt; 12) &amp; 0x3f;
            var sixBit3 = (temp &gt;&gt; 6) &amp; 0x3f;
            var sixBit4 = temp &amp; 0x3f;
            result += Base64Alphabit.charAt(sixBit1) + Base64Alphabit.charAt(sixBit2) + Base64Alphabit.charAt(sixBit3) + Base64Alphabit.charAt(sixBit4);
        }
        if (padLength &gt; 0)
        {
            result = result.slice(0, result.length - padLength);
            for (var k = 0; k &lt; padLength; ++k)
                result += "=";
        }
        return result;
    };
    ns.StartLocationHref = document.location.href;
    ns.IsTopLevel = window &amp;&amp; window === window.top;
    ns.IsElementVisibleCheckApplicable = function IsElementVisibleCheckApplicable()
    {
        return window &amp;&amp; window.getComputedStyle;
    };
    ns.IsElementVisible = function IsElementVisible(element)
    {
        return window.getComputedStyle(element).visibility === "visible";
    };
    ns.GetPageStartTime = function GetPageStartTime()
    {
        return window &amp;&amp; window.performance &amp;&amp; window.performance.timing &amp;&amp; window.performance.timing.domContentLoadedEventStart
            ? window.performance.timing.domContentLoadedEventStart
            : 0;
    };
    ns.GetPageStartNavigationTime = function GetPageStartNavigationTime()
    {
        return window &amp;&amp; window.performance &amp;&amp; window.performance.timing &amp;&amp; window.performance.timing.navigationStart
            ? window.performance.timing.navigationStart
            : 0;
    };
    var historyChangeSubscribers = [];
    function NotifyHistoryChanged()
    {
        try
        {
            for (var i = 0; i &lt; historyChangeSubscribers.length; ++i)
            {
                try
                {
                    historyChangeSubscribers[i].notify();
                }
                catch (e)
                {
                    ns.SessionError(e, historyChangeSubscribers[i].injector);
                }
            }
        }
        catch (e)
        {
            ns.SessionError(e, "common");
        }
    }
    ns.SubscribeHistoryChanged = function SubscribeHistoryChanged(injector, callback)
    {
        historyChangeSubscribers.push({ injector: injector, notify: callback });
    };
    ns.UnsubscribeHistoryChanged = function UnsubscribeHistoryChanged(injector)
    {
        for (var i = 0; i &lt; historyChangeSubscribers.length; ++i)
        {
            if (historyChangeSubscribers[i].injector === injector)
            {
                historyChangeSubscribers.splice(i, 1);
                return;
            }
        }
    };
    if (window.history)
    {
        var oldBack = window.history.back;
        var oldForward = window.history.forward;
        var oldGo = window.history.go;
        var oldPushState = window.history.pushState;
        var oldReplaceState = window.history.replaceState;
        window.history.back = function WrapperBack()
        {
            oldBack.apply(window.history);
            NotifyHistoryChanged();
        };
        window.history.forward = function WrapperForward()
        {
            oldForward.apply(window.history);
            NotifyHistoryChanged();
        };
        window.history.go = function WrapperGo()
        {
            oldGo.apply(window.history, arguments);
            NotifyHistoryChanged();
        };
        window.history.pushState = function WrapperPushState()
        {
            oldPushState.apply(window.history, arguments);
            NotifyHistoryChanged();
        };
        window.history.replaceState = function WrapperReplaceState()
        {
            oldReplaceState.apply(window.history, arguments);
            NotifyHistoryChanged();
        };
    }
    return ns;
})(AvNs);
(function CommonMutation(ns)
{
    function IsElementNode(node)
    {
        return node.nodeType === 1; 
    }
    function IsNodeContainsElementWithTag(node, observeTag)
    {
        try
        {
            return observeTag === "*" || (IsElementNode(node) &amp;&amp; ((node.tagName &amp;&amp; node.tagName.toLowerCase() === observeTag) || node.getElementsByTagName(observeTag).length &gt; 0));
        }
        catch (e)
        {
            return false;
        }
    }
    function MutationChangeObserver(observeTag, pluginId)
    {
        var m_observer = null;
        var m_callback = null;
        var m_functionCheckInteresting = observeTag ? function functionCheckInteresting(node) { return IsNodeContainsElementWithTag(node, observeTag); } : IsElementNode;
        function ProcessNodeList(nodeList)
        {
            for (var i = 0; i &lt; nodeList.length; ++i)
            {
                if (m_functionCheckInteresting(nodeList[i]))
                    return true;
            }
            return false;
        }
        function ProcessDomChange(records)
        {
            try
            {
                if (!m_callback)
                    return;
                for (var i = 0; i &lt; records.length; ++i)
                {
                    var record = records[i];
                    if ((record.addedNodes.length &amp;&amp; ProcessNodeList(record.addedNodes))
                        || (record.removedNodes.length &amp;&amp; ProcessNodeList(record.removedNodes)))
                    {
                        m_callback();
                        return;
                    }
                }
            }
            catch (e)
            {
                ns.SessionError(e, pluginId);
            }
        }
        this.Start = function Start(callback)
        {
            m_callback = callback;
            m_observer = new MutationObserver(ProcessDomChange);
            m_observer.observe(document, { childList: true, subtree: true });
        };
        this.Stop = function Stop()
        {
            if (m_observer)
                m_observer.disconnect();
            m_observer = null;
            m_callback = null;
        };
    }
    function DomEventsChangeObserver(observeTag, pluginId)
    {
        var m_callback = null;
        var m_functionCheckInteresting = observeTag ? function functionCheckInteresting(node) { return IsNodeContainsElementWithTag(node, observeTag); } : IsElementNode;
        function ProcessEvent(event)
        {
            try
            {
                if (!m_callback)
                    return;
                if (m_functionCheckInteresting(event.target))
                    m_callback();
            }
            catch (e)
            {
                ns.SessionError(e, pluginId);
            }
        }
        this.Start = function Start(callback)
        {
            ns.AddRemovableEventListener(window, "DOMNodeInserted", ProcessEvent);
            ns.AddRemovableEventListener(window, "DOMNodeRemoved", ProcessEvent);
            m_callback = callback;
        };
        this.Stop = function Stop()
        {
            ns.RemoveEventListener(window, "DOMNodeInserted", ProcessEvent);
            ns.RemoveEventListener(window, "DOMNodeRemoved", ProcessEvent);
            m_callback = null;
        };
    }
    function TimeoutChangeObserver(observeTag)
    {
        var m_interval = null;
        var m_callback = null;
        var m_tagCount = 0;
        var m_attribute = "klot_" + ns.GetCurrentTime();
        function IsChangesOccure(nodeList)
        {
            for (var i = 0; i &lt; nodeList.length; ++i)
            {
                if (!nodeList[i][m_attribute])
                    return true;
            }
            return false;
        }
        function FillTagInfo(nodeList)
        {
            m_tagCount = nodeList.length;
            for (var i = 0; i &lt; m_tagCount; ++i)
                nodeList[i][m_attribute] = true;
        }
        function TimeoutProcess()
        {
            if (!m_callback)
                return;
            var nodeList = observeTag ? document.getElementsByTagName(observeTag) : document.getElementsByTagName("*");
            if (nodeList.length !== m_tagCount || IsChangesOccure(nodeList))
            {
                FillTagInfo(nodeList);
                m_callback();
            }
        }
        this.Start = function Start(callback)
        {
            m_callback = callback;
            FillTagInfo(document.getElementsByTagName(observeTag));
            m_interval = ns.SetInterval(TimeoutProcess, 10 * 1000);
            if (document.readyState !== "complete")
                ns.AddEventListener(window, "load", TimeoutProcess);
        };
        this.Stop = function Stop()
        {
            clearInterval(m_interval);
            m_callback = null;
        };
    }
    ns.GetDomChangeObserver = function GetDomChangeObserver(observeTag, pluginId)
    {
        var observeTagLowerCase = observeTag ? observeTag.toLowerCase() : observeTag;
        if (window.MutationObserver &amp;&amp; document.documentMode !== 11)    
            return new MutationChangeObserver(observeTagLowerCase, pluginId);
        if (window.addEventListener)
            return new DomEventsChangeObserver(observeTagLowerCase, pluginId);
        return new TimeoutChangeObserver(observeTagLowerCase);
    };
    return ns;
})(AvNs);
(function Md5Main(ns) {
    function md5cycle(x, k) {
        var a = x[0],
        b = x[1],
        c = x[2],
        d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a &lt;&lt; s) | (a &gt;&gt;&gt; (32 - s)), b);
    }
    function ff(a, b, c, d, x, s, t) {
        return cmn((b &amp; c) | ((~b) &amp; d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
        return cmn((b &amp; d) | (c &amp; (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
        return cmn(b^c^d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
        return cmn(c^(b | (~d)), a, b, x, s, t);
    }
    function md51(s) {
        var n = s.length,
        state = [1732584193, -271733879, -1732584194, 271733878],
        i;
        for (i = 64; i &lt;= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i &lt; s.length; i++)
            tail[i &gt;&gt; 2] |= s.charCodeAt(i) &lt;&lt; ((i % 4) &lt;&lt; 3);
        tail[i &gt;&gt; 2] |= 0x80 &lt;&lt; ((i % 4) &lt;&lt; 3);
        if (i &gt; 55) {
            md5cycle(state, tail);
            for (i = 0; i &lt; 16; i++)
                tail[i] = 0;
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
    }
    function md5blk(s) {
        var md5blks = [],
        i;
        for (i = 0; i &lt; 64; i += 4) {
            md5blks[i &gt;&gt; 2] = s.charCodeAt(i) +
                 (s.charCodeAt(i + 1) &lt;&lt; 8) +
                 (s.charCodeAt(i + 2) &lt;&lt; 16) +
                 (s.charCodeAt(i + 3) &lt;&lt; 24);
        }
        return md5blks;
    }
    var hex_chr = '0123456789abcdef'.split('');
    function rhex(n) {
        var s = '',
        j = 0;
        for (; j &lt; 4; j++)
            s += hex_chr[(n &gt;&gt; (j * 8 + 4)) &amp; 0x0F]+hex_chr[(n &gt;&gt; (j * 8)) &amp; 0x0F];
        return s;
    }
    function hex(x) {
        for (var i = 0; i &lt; x.length; i++)
            x[i] = rhex(x[i]);
        return x.join('');
    }
    ns.md5 = function md5(s) {
        return hex(md51(s));
    };
    function add32(a, b) {
        return (a + b) &amp; 0xFFFFFFFF;
    }
    if (ns.md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
        add32 = function add32(x, y) {
            var lsw = (x &amp; 0xFFFF) + (y &amp; 0xFFFF),
            msw = (x &gt;&gt; 16) + (y &gt;&gt; 16) + (lsw &gt;&gt; 16);
            return (msw &lt;&lt; 16) | (lsw &amp; 0xFFFF);
        }
    }
})(AvNs);
(function AjaxTransportMain(ns)
{
var ajaxRequestProvider = (function ajaxRequestProvider()
    {
        return {
            GetAsyncRequest: function GetAsyncRequest()
                {
                    var xmlhttp = ns.XDomainRequest ? new ns.XDomainRequest() : new ns.XMLHttpRequest();
                    if (!ns.XDomainRequest)
                    {
                        xmlhttp.open = ns.XMLHttpRequestOpen;
                        xmlhttp.send = ns.XMLHttpRequestSend;
                        xmlhttp.abort = ns.XMLHttpRequestAbort;
                        xmlhttp.setRequestHeader = ns.XMLHttpRequestSetRequestHeader;
                    }
                    xmlhttp.onprogress = ns.EmptyFunc;
                    return xmlhttp;
                }
        };
    })();
var restoreSessionCallback = ns.EmptyFunc;
var PingPongCallReceiver = function PingPongCallReceiver(caller)
{
    var m_caller = caller;
    var m_isProductConnected = false;
    var m_pingWaitResponse = false;
    var m_requestDelay = ns.MaxRequestDelay;
    var m_requestTimer = null;
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    var m_updateCallback = ns.EmptyFunc;
    var m_pluginId = "ajax";
    var m_waitRequestsCount = 0;
    var m_stopped = false;
    function SendRequest()
    {
        try 
        {
            m_waitRequestsCount++;
            m_caller.Call(
                "from",
                null,
                null,
                function CallCallback(result, parameters, method)
                {
                    m_pingWaitResponse = false;
                    m_isProductConnected = true;
                    if (parameters === "undefined" || method === "undefined") 
                    {
                        m_errorCallback("AJAX pong is not received. Product is deactivated");
                        m_waitRequestsCount--;
                        return;
                    }
                    if (method)
                    {
                        ns.SetTimeout(function TimerCallback() { SendRequest(); }, 0, m_pluginId);
                        m_callCallback(method, parameters);
                    }
                    m_waitRequestsCount--;
                },
                function ErrorCallback(error)
                {
                    m_pingWaitResponse = false;
                    m_isProductConnected = false;
                    restoreSessionCallback();
                    m_errorCallback(error);
                    m_waitRequestsCount--;
                }
                );
            m_pingWaitResponse = true;
        }
        catch (e)
        {
            m_errorCallback("Ajax send ping exception: " + (e.message || e));
        }
    }
    function Ping()
    {
        try
        {
            if (m_stopped)
                return;
            if (m_pingWaitResponse)
            {
                m_requestTimer = ns.SetTimeout(Ping, 100, m_pluginId);
                return;
            }
            m_requestDelay = m_updateCallback();
            if (typeof (m_requestDelay) === "undefined")
                return;
            SendRequest();
            m_requestTimer = ns.SetTimeout(Ping, m_requestDelay, m_pluginId);
        }
        catch (e)
        {
            m_errorCallback("Send ping request: " + (e.message || e));
        }
    }
    this.StartReceive = function StartReceive(callCallback, errorCallback, updateCallback)
    {
        m_isProductConnected = true;
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        m_updateCallback = updateCallback;
        m_requestDelay = m_updateCallback();
        m_requestTimer = ns.SetTimeout(Ping, m_requestDelay, m_pluginId);
        m_stopped = false;
    };
    this.ForceReceive = function ForceReceive()
    {
        clearTimeout(m_requestTimer);
        m_requestTimer = ns.SetTimeout(Ping, 0, m_pluginId);
    };
    this.StopReceive = function StopReceive()
    {
        m_stopped = true;
        if (m_requestTimer)
        {
            clearTimeout(m_requestTimer);
            m_requestTimer = null;
        }
        m_callCallback = ns.EmptyFunc;
        m_errorCallback = ns.EmptyFunc;
        m_updateCallback = ns.EmptyFunc;
    };
    this.IsStarted = function IsStarted()
    {
        return m_requestTimer !== null;
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_isProductConnected;
    };
    this.GetWaitRequests = function GetWaitRequests()
    {
        if (m_requestTimer)
        {
            clearTimeout(m_requestTimer);
            m_requestTimer = null;
        }
        return m_waitRequestsCount;
    };
};
var LongPoolingReceiver = function LongPoolingReceiver(caller)
{
    var m_caller = caller;
    var m_isProductConnected = false;
    var m_isStarted = false;
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    var m_pluginId = "long_pooling";
    function SendRequest(onResponseCallback)
    {
        try 
        {
            m_isProductConnected = true;
            m_caller.Call(
                "longpooling",
                null,
                null,
                onResponseCallback,
                function ErrorCallback(error)
                {
                    m_isProductConnected = false;
                    restoreSessionCallback();
                    m_errorCallback(error);
                },
                true
                );
        }
        catch (e)
        {
            ns.SessionError(e, "ajax_longpooling");
            m_errorCallback("Ajax send ping exception: " + (e.message || e));
        }
    }
    function OnResponse(result, parameters, method)
    {
        if (!ns.IsDefined(parameters) || !ns.IsDefined(method))
        {
            m_errorCallback("AJAX pong is not received. Product is deactivated");
            return;
        }
        ns.SetTimeout(function TimerCallback() { SendRequest(OnResponse); }, 0, m_pluginId);
        if (method)
            m_callCallback(method, parameters);
    }
    this.StartReceive = function StartReceive(callCallback, errorCallback)
    {
        m_isStarted = true;
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        SendRequest(OnResponse);
    };
    this.ForceReceive = ns.EmptyFunc;
    this.StopReceive = function StopReceive()
    {
        m_isStarted = false;
        m_callCallback = ns.EmptyFunc;
        m_errorCallback = ns.EmptyFunc;
    };
    this.IsStarted = function IsStarted()
    {
        return m_isStarted;
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_isProductConnected;
    };
    this.GetWaitRequests = function GetWaitRequests()
    {
        return 0;
    };
};
var AjaxCallerImpl = function AjaxCallerImpl(onLongPoolingEnable)
{
    var m_path = ns.GetBaseUrl() + ns.SIGNATURE;
    var m_longPoolingRequest = null;
    var m_pluginId = "ajax_caller";
    function NoCacheParameter() 
    {
        return "&amp;nocache=" + Math.floor((1 + Math.random()) * 0x10000).toString(16);
    }
    function PrepareRequestObject(command, commandAttribute, isPost, isSecondCall)
    {
        var request = ajaxRequestProvider.GetAsyncRequest();
        if (request)
        {
            var urlPath = m_path + "/" + command;
            if (commandAttribute)
                urlPath += "/" + commandAttribute;
            var timestampArgument = "tm=" + encodeURIComponent((new Date()).toISOString());
            if (isPost)
            {
                urlPath += ((urlPath.indexOf("?") === -1) ? "?" : "&amp;");
                urlPath += timestampArgument;
                if (isSecondCall)
                    urlPath += "&amp;second=true";
                request.open("POST", urlPath);
            }
            else
            {
                if (urlPath.indexOf("?") === -1)
                    urlPath += "?get";
                urlPath += NoCacheParameter();
                urlPath += "&amp;" + timestampArgument;
                request.open("GET", urlPath, true);
            }
            if (request.setRequestHeader &amp;&amp; ns.IsRelativeTransport())
                request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
        return request;
    }
    function ClearRequest(request)
    {
        request.onerror = ns.EmptyFunc;
        request.onload = ns.EmptyFunc;
    }
    function GetResponseText(request)
    {
        try
        {
            if (!ns.IsDefined(request.status) || request.status === 200)
                return request.responseText.toString();
        }
        catch (e)
        {
            ns.SessionLog(e);
        }
        return "";
    }
    function AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall, isSecondCall)
    {
        try
        {
            var request = PrepareRequestObject(command, commandAttribute, Boolean(data), isSecondCall);
            if (!request) 
            {
                callbackError &amp;&amp; callbackError("Cannot create AJAX request!");
                return;
            }
            request.onerror = function onerror()
                {
                    ClearRequest(request);
                    if (!ns.IsDefined(isSecondCall))
                        AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall, true);
                    else
                        callbackError &amp;&amp; callbackError("AJAX request error for calling " + command + "/" + commandAttribute);
                };
            request.onload = function onload()
                {
                    try
                    {
                        ClearRequest(request);
                        if (callbackResult)
                        {
                            var responseText = GetResponseText(request);
                            if (responseText)
                            {
                                callbackResult(responseText);
                                return;
                            }
                            if (!ns.IsDefined(isSecondCall))
                            {
                                AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall, true);
                                return;
                            }
                            if (callbackError)
                                callbackError("AJAX request with unsupported url type!"); 
                        }
                    }
                    catch (e)
                    {
                        ns.SessionError(e, m_pluginId);
                    }
                };
            if (isLongPoolingCall)
                m_longPoolingRequest = request;
            request.send(data);
        }
        catch (e)
        {
            if (callbackError)
                callbackError("AJAX request " + command  + "/" + commandAttribute + " exception: " + (e.message || e));
        }
    }
    this.Start = function Start(callbackSuccess)
    {
        callbackSuccess();
    };
    this.SendLog = function SendLog(message)
    {
        AsyncCall("log?" + encodeURIComponent(message));
    };
    this.SendResult = function SendResult(methodName, data)
    {
        AsyncCall("callResult", methodName, data);
    };
    function TryJsonParse(str)
    {
        try
        {
            return ns.JSONParse(str);
        }
        catch (e)
        {
            return null;
        }
    }
    this.Call = function Call(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall) 
    {
        AsyncCall(
            command,
            commandAttribute,
            data,
            function CallCallback(responseText)
            {
                var commandResponse = TryJsonParse(responseText);
                if (!commandResponse)
                {
                    callbackError &amp;&amp; callbackError("Wrong body of call command. Body is: '" + responseText +
                        "', command is " + command + " command attribute is " + commandAttribute);
                    return;
                }
                if (commandResponse.result === -1610612735)
                {
                    AsyncCall(
                        command,
                        commandAttribute,
                        data,
                        function callCallback(response)
                        {
                            if (!callbackResult)
                                return;
                            commandResponse = ns.JSONParse(response);
                            callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
                        },
                        callbackError,
                        isLongPoolingCall
                        );
                }
                else if (callbackResult)
                {
                    callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
                }
            },
            callbackError,
            isLongPoolingCall
            );
    };
    this.SessionErrorCall = function SessionErrorCall(message)
    {
        AsyncCall("logerr", null, message);
    };
    this.UnhandledExceptionCall = function UnhandledExceptionCall(message)
    {
        AsyncCall("except", null, message);
    };
    this.Shutdown = function Shutdown()
    {
        if (m_longPoolingRequest)
        {
            if (m_longPoolingRequest.abort)
                m_longPoolingRequest.abort();
            ClearRequest(m_longPoolingRequest);
            m_longPoolingRequest = null;
        }
    };
    this.InitCall = function InitCall(initData, callbackResult, callbackError)
    {
        restoreSessionCallback = callbackError;
        if (ns.StartLocationHref === "data:text/html,chromewebdata")
            return callbackError();
        AsyncCall(
            "init?data=" + encodeURIComponent(ns.ToBase64(ns.JSONStringify(initData))),
            null,
            null,
            function AsyncCallCallback(responseText)
            {
                try
                {
                    var initSettings = ns.JSONParse(responseText);
                    m_path = ns.GetBaseUrl() + initSettings.ajaxId + "/" + initSettings.sessionId;
                    if (initSettings.longPooling)
                        onLongPoolingEnable();
                    callbackResult(initSettings);
                } 
                catch (e)
                {
                    restoreSessionCallback &amp;&amp; restoreSessionCallback("Error " + e.name + ": " + e.message);
                }
            },
            callbackError
            );
    };
};
ns.Caller = function AjaxCaller()
{
    var m_switchToLongPooling = false;
    var m_caller = new AjaxCallerImpl(OnLongPoolingEnable);
    var m_receiver = new PingPongCallReceiver(m_caller);
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    function StartLongPooling(needRestartReceive)
    {
        m_receiver = new LongPoolingReceiver(m_caller);
        if (needRestartReceive)
            m_receiver.StartReceive(m_callCallback, m_errorCallback);
        ns.SessionLog("Switch to longpooling, receiver restarted: " + needRestartReceive);
    }
    function RestartReceiver()
    {
        var requestsCount = m_receiver.GetWaitRequests();
        if (requestsCount !== 0)
        {
            ns.SessionLog("Wait requests count: " + requestsCount);
            ns.SetTimeout(RestartReceiver, 100, "ajax_caller");
        }
        else
        {
            m_receiver.StopReceive();
            StartLongPooling(true);
        }
    }
    function SwitchToLongPooling()
    {
        var needRestartReceive = m_receiver.IsStarted();
        if (needRestartReceive)
            RestartReceiver();
        else
            StartLongPooling(false);
    }
    function OnLongPoolingEnable()
    {
        if (document.readyState === "complete")
            SwitchToLongPooling();
        else
            m_switchToLongPooling = true;
    }
    this.Start = function Start(callbackSuccess)
    {
        m_caller.Start(callbackSuccess);
    };
    this.SendLog = function SendLog(message)
    {
        m_caller.SendLog(message);
    };
    this.SendResult = function SendResult(methodName, data)
    {
        m_caller.SendResult(methodName, data);
    };
    this.Call = function Call(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall)
    {
        m_caller.Call(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall);
    };
    this.SessionErrorCall = function SessionErrorCall(message)
    {
        m_caller.SessionErrorCall(message);
    };
    this.UnhandledExceptionCall = function UnhandledExceptionCall(message)
    {
        m_caller.UnhandledExceptionCall(message);
    };
    this.Shutdown = function Shutdown()
    {
        m_caller.Shutdown();
    };
    this.InitCall = function InitCall(initData, callbackResult, callbackError)
    {
        return m_caller.InitCall(initData, callbackResult, callbackError);
    };
    this.GetReceiver = function GetReceiver()
    {
        return this;
    };
    this.StartReceive = function StartReceive(callCallback, errorCallback, updateCallback)
    {
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        m_receiver.StartReceive(callCallback, errorCallback, updateCallback);
    };
    this.ForceReceive = function ForceReceive()
    {
        m_receiver.ForceReceive();
    };
    this.StopReceive = function StopReceive()
    {
        m_receiver.StopReceive();
    };
    this.IsStarted = function IsStarted()
    {
        return m_receiver.IsStarted();
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_receiver.IsProductConnected();
    };
    ns.AddEventListener(window, "load", function onLoad()
    {
        if (m_switchToLongPooling)
            SwitchToLongPooling();
    }, "ajax_caller");
};
return ns;
})(AvNs);
var avSessionInstance = null;
(function SessionMain(ns)
{
    var runners = {};
    var lastPostponedInitTime = (new Date()).getTime();
    var postponedInitTimeout = null;
    var enableTracing = false;
    var initPending = false;
    var ajaxId = "";
    var sessionId = "";
    if (ns.WORK_IDENTIFIERS)
    {
        var workIdentifiers = ns.WORK_IDENTIFIERS.split(",");
        for (var id = 0; id &lt; workIdentifiers.length; ++id)
        {
            if (window[workIdentifiers[id]])
            {
                ns.AddRunner = ns.EmptyFunc;
                ns.AddRunner2 = ns.EmptyFunc;
                return;
            }
            window[workIdentifiers[id]] = true;
        }
    }
    function removeThisScriptElement(injectId)
    {
        var pattern = injectId.toLowerCase();
        for (var i = 0, scriptsCount = document.scripts.length; i &lt; scriptsCount; ++i) 
        {
            var tag = document.scripts[i];
            if (typeof tag.src === "string" &amp;&amp; tag.src.length &gt; 45 
                &amp;&amp; tag.src.toLowerCase().indexOf(pattern) &gt; 0 
                &amp;&amp; (/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/main.js/).test(tag.src))
            {
                tag.parentElement.removeChild(tag);
                break; 
            }
        }
    }
    if (ns.INJECT_ID)
        removeThisScriptElement(ns.INJECT_ID);
    var CallReceiver = function CallReceiver(caller)
    {
        var m_plugins = {};
        var m_receiver = caller.GetReceiver();
        var m_caller = caller;
        var m_selfMethods = {};
        function GetPluginIdFromMethodName(methodName)
        {
            if (methodName)
            {
                var names = methodName.split(".", 2);
                if (names.length === 2)
                    return names[0];
            }
            return null;
        }
        function GetPluginMethods(pluginId)
        {
            var plugin = m_plugins[pluginId];
            return plugin ? plugin.methods : null;
        }
        function CheckCommonMethodName(methodName)
        {
            if (methodName)
            {
                var names = methodName.split(".", 2);
                if (names.length === 1 &amp;&amp; names[0] === methodName)
                    return true;
            }
            return false;
        }
        this.RegisterMethod = function RegisterMethod(methodName, callback)
        {
            var pluginId = GetPluginIdFromMethodName(methodName);
            if (pluginId)
            {
                var methods = GetPluginMethods(pluginId);
                if (methods)
                {
                    if (methods[methodName])
                        return;
                    methods[methodName] = callback;
                }
                else
                {
                    throw new Error("Cannot registered " + methodName);
                }
            }
            else if (CheckCommonMethodName(methodName))
            {
                if (m_selfMethods[methodName])
                    throw new Error("Already registered method " + methodName);
                m_selfMethods[methodName] = callback;
            }
        };
        function CallPluginMethod(pluginId, methodName, args)
        {
            var callback = null;
            if (pluginId)
            {
                var methods = GetPluginMethods(pluginId);
                if (methods) 
                    callback = methods[methodName];
            } 
            else
            {
                callback = m_selfMethods[methodName];
            }
            if (callback)
            {
                var result = {};
                try 
                {
                    if (args)
                        callback(ns.JSONParse(args));
                    else
                        callback();
                    result.success = true;
                    m_caller.SendResult(methodName, ns.JSONStringify(result));
                    return true;
                }
                catch (e)
                {
                    result.success = false;
                    m_caller.SendResult(methodName, ns.JSONStringify(result));
                    ns.SessionError(e, (pluginId ? pluginId : "common"));
                    return false;
                }
            }
            ns.SessionLog("Cannot call " + methodName + " for plugin " + (pluginId ? pluginId : "common"));
            return false;
        }
        function CallMethod(methodName, args)
        {
            var pluginId = GetPluginIdFromMethodName(methodName);
            if (pluginId || CheckCommonMethodName(methodName))
                CallPluginMethod(pluginId, methodName, args);
        }
        function ReportPluginError(pluginId, status)
        {
            var onError = m_plugins[pluginId].onError;
            if (onError)
                onError(status);
        }
        function ReportError(status)
        {
            for (var pluginId in m_plugins)
            {
                if (Object.prototype.hasOwnProperty.call(m_plugins, pluginId))
                    ReportPluginError(pluginId, status);
            }
        }
        function UpdateDelay()
        {
            var newDelay = ns.MaxRequestDelay;
            var currentTime = ns.GetCurrentTime();
            for (var pluginId in m_plugins)
            {
                if (!Object.prototype.hasOwnProperty.call(m_plugins, pluginId))
                    continue;
                try 
                {   
                    var onPing = m_plugins[pluginId].onPing;
                    if (onPing)
                    {
                        var delay = onPing(currentTime);
                        if (delay &lt; newDelay &amp;&amp; delay &gt; 0 &amp;&amp; delay &lt; ns.MaxRequestDelay)
                            newDelay = delay;
                    }
                }
                catch (e)
                {
                    ReportPluginError(pluginId, "UpdateDelay: " + (e.message || e));
                }
            }
            return newDelay;
        }
        this.RegisterPlugin = function RegisterPlugin(pluginId, callbackPing, callbackError, callbackShutdown)
        {
            if (m_plugins[pluginId])
                return;
            var plugin = {
                onError: callbackError,
                onPing: callbackPing,
                onShutdown: callbackShutdown,
                methods: {}
            };
            m_plugins[pluginId] = plugin;
            if (!m_receiver.IsStarted())
                m_receiver.StartReceive(CallMethod, ReportError, UpdateDelay);
        };
        function IsPluginListEmpty()
        {
            for (var key in m_plugins)
            {
                if (Object.prototype.hasOwnProperty.call(m_plugins, key))
                    return false;
            }
            return true;
        }
        this.UnregisterPlugin = function UnregisterPlugin(pluginId)
        {
            delete m_plugins[pluginId];
            if (IsPluginListEmpty())
                m_receiver.StopReceive();
        };
        this.ForceReceive = function ForceReceive()
        {
            m_receiver.ForceReceive();
        };
        this.StopReceive = function StopReceive()
        {
            m_receiver.StopReceive();
        };
        this.UnregisterAll = function UnregisterAll()
        {
            if (IsPluginListEmpty())
                return;
            for (var key in m_plugins)
            {
                if (Object.prototype.hasOwnProperty.call(m_plugins, key)) 
                    m_plugins[key].onShutdown();
            }
            m_plugins = {};
        };
        this.IsEmpty = IsPluginListEmpty;
        this.IsProductConnected = function IsProductConnected()
        {
            return m_receiver.IsProductConnected();
        };
    };
    function LocalizationObjectFromDictionary(dictionary)
    {
        var object = {};
        if (dictionary)
        {
            for (var i = 0; i &lt; dictionary.length; i++)
                object[dictionary[i].name] = dictionary[i].value;
        }
        return object;
    }
    function SettingsObjectFromSettingsJson(settingsJson)
    {
        var object = {};
        if (settingsJson)
            object = ns.JSONParse(settingsJson);
        return object;
    }
    var AvSessionClass = function AvSessionClass(caller)
    {
        var self = this;
        var m_caller = caller;
        var m_callReceiver = new CallReceiver(caller);
        function BeaconSend(command, commandAttribute, data)
        {
            try
            {
                var maxBeaconPackageSize = 64 * 1024;
                var size = maxBeaconPackageSize;
                if (typeof window.TextEncoder === "function")
                    size = data ? (new TextEncoder("utf-8").encode(data)).length : 0;
                if (navigator &amp;&amp; navigator.sendBeacon &amp;&amp; size &lt; maxBeaconPackageSize)
                {
                    var urlPath = ns.GetBaseUrl() + ajaxId + "/" + sessionId + "/" + command + "/" + commandAttribute + "?tm=" + encodeURIComponent((new Date()).toISOString());
                    return navigator.sendBeacon(urlPath, data);
                }
            }
            catch (e)
            {
                ns.Log("Error on beacon send " + e);
            }
            return false;
        }
        function Call(methodName, argsObj, callbackResult, callbackError)
        {
            if (!m_callReceiver.IsProductConnected())
                return;
            var callback = function callback(result, args, method)
                {
                    if (callbackResult)
                        callbackResult(result, args ? ns.JSONParse(args) : null, method);
                };
            var data = (argsObj)
                ? ns.JSONStringify(
                    {
                        result: 0,
                        method: methodName,
                        parameters: ns.JSONStringify(argsObj)
                    }
                    )
                : null;
            m_caller.Call("to", methodName, data, callback, callbackError);
        }
        function OnUnloadCall(methodName, arrayOfArgs)
        {
            var data = (arrayOfArgs)
                ? ns.JSONStringify(
                    {
                        result: 0,
                        method: methodName,
                        parameters: ns.JSONStringify(arrayOfArgs)
                    }
                    )
