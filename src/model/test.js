window.ipc = require('electron').ipcRenderer;
// window.newFramesId = null
var { session} = require('electron').remote;
window._session = session

function addFunt(){  //为表单注册录制事件
    var framesList = document.getElementsByTagName("iframe")
    window.fr = framesList
    for(var i=0;i<framesList.length;i++){
        framesList[i].contentWindow.document._x = _x
    }
}

function framesInject(){
    const framesList = document.getElementsByTagName("iframe")
    const framesList2 = document.getElementsByTagName("webview")
    console.dir(framesList2)
    var _ISINPUT = false

    var newDom
    for(var i=0;i<framesList.length;i++){
        framesList[i].contentWindow.document.iframeId = i  //记录为第几个表单
        var _tag,newFramesId  //记录当前tag和最新选择的表单ID
        framesList[i].contentWindow.document.onmousedown = function(e){ //判断是否点击了input被遮挡
            newFramesId = this.iframeId  //记录所属表单
            if(e.path[0].tagName != "INPUT"  &&  window.getComputedStyle(e.path[0]).position == "absolute"){
                var  fu =  e.path[0].parentElement
                console.dir(fu)
                for(var z=0;z<fu.children.length;z++){
                    if(fu.children[z].tagName == "INPUT"){
                        newDom = readXPath(fu.children[z])
                        console.dir(newDom)
                        _tag = "INPUT"
                    }
                }
            }else{
                console.log(38)
                newDom = readXPath(e.path[0])
                _tag = e.path[0].tagName
            }
            // i =0
            if(_ISINPUT){
                let _myValue = _x(my_input_dom,framesList[newFramesId].contentWindow.document)[0].value
                if(_myValue){  //如果之前激活了input对象,并输入了内容则记录
                    var domObject = new Object();
                    domObject.type = "js"
                    domObject.dom = my_input_dom
                    domObject.value = _myValue
                    domObject.describe = "inputToData"
                    domObject.iframe = this.iframeId
                    domObject.order = 0
                    ipc.send("sendCMD",domObject)
                    _ISINPUT = false
                    console.dir(JSON.stringify(domObject))
                }
            }
            if(e.path[0].tagName == "A"){   // 让页面在窗口内进行跳转，不打开新窗口。
                 e.path[0].setAttribute('target','_self')
            }
            if(_tag == "INPUT"){  //判断是否为input,如果为input则记录此元素
                window.my_input_dom = newDom
                _ISINPUT = true
            }
            // 记录点击的操作
            var domObject = new Object();
            domObject.dom = newDom
            domObject.type = "js"
            domObject.value = null
            domObject.describe = "click"
            domObject.iframe = this.iframeId
            domObject.order = 0
            ipc.send("sendCMD",domObject)
            console.dir(JSON.stringify(domObject))
        }
    }
}

setTimeout(function(){
    addFunt()
    framesInject()
},800)

function readXPath(element) {  //通过元素获取xpath
    if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
        return '//*[@id=\"' + element.id + '\"]';
    }
    //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
    if (element == document.body) {//递归到body处，结束递归
        return '/html/' + element.tagName.toLowerCase();
    }
    var ix = 1,//在nodelist中的位置，且每次点击初始化
         siblings = element.parentNode.childNodes;//同级的子元素

    for (var i = 0, l = siblings.length; i < l; i++) {
        var sibling = siblings[i];
        //如果这个元素是siblings数组中的元素，则执行递归操作
        if (sibling == element) {
            return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
            //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
        } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
            ix++;
        }
    }
};

window.readXPath = readXPath
function _x(STR_XPATH,_document) { //通过xptah获取元素
    var xresult
    if(_document){
        xresult = _document.evaluate(STR_XPATH, _document, null, XPathResult.ANY_TYPE, null);
    }else{
        xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    }
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }
    return xnodes;
}
window._x = _x
var ISINPUT = false

window.onmousedown = function(e){
    var newDom = readXPath(e.path[0])
    console.dir(ISINPUT)
    if(ISINPUT){
        if(_x(my_input_dom)[0].value){  //如果之前激活了input对象,则记录输入的内容
            var domObject = new Object();
            domObject.type = "js"
            domObject.dom = my_input_dom
            domObject.value = _x(my_input_dom)[0].value
            domObject.describe = "inputToData"
            domObject.iframe = null
            domObject.order = 0
            ipc.send("sendCMD",domObject)
            ISINPUT = false
        }
    }
    console.dir(e.path[0].tagName)
    if(e.path[0].tagName == "A"){   // 让页面在窗口内进行跳转，不打开新窗口。
         e.path[0].setAttribute('target','_self')
    }

    if(e.path[0].tagName == "INPUT"){  //判断是否为input,如果为input则记录此元素
        window.my_input_dom = newDom
        ISINPUT = true
    }
 
    // 记录点击的操作
    var domObject = new Object();
    domObject.dom = newDom
    domObject.type = "js"
    domObject.value = null
    domObject.describe = "click"
    domObject.iframe = null
    domObject.order = 0
    ipc.send("sendCMD",domObject)
    // MYDB.defaults({cases:[]}).write();
}.bind(window)