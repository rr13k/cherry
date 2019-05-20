console.dir('init js!')
window.ipc = require('electron').ipcRenderer;
var { session} = require('electron').remote;
window._session = session
var VIEWID = null
var ISINPUT = false
var ISFILE = false


window._id = 77

function addFunt(){  //为表单注册录制事件
    var framesList = document.getElementsByTagName("iframe")
    console.dir(typeof framesList)
    console.dir(framesList)
    if(typeof framesList =='undefined'){
        return false
    }
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
        framesList[i].contentWindow.window.iframeId = i  //记录为第几个表单
        window.ddc = framesList[i].contentWindow;
        var _tag,newFramesId  //记录当前tag和最新选择的表单ID
        framesList[i].contentWindow.document.onmousedown = function(e){ //判断是否点击了input被遮挡
            console.dir('表单内')
            VIEWID = localStorage.getItem("VIEWID");
            newFramesId = e.path[e.path.length -1].iframeId  //记录所属表单
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
                newDom = readXPath(e.path[0])
                _tag = e.path[0].tagName
            }
            if(_ISINPUT){
                let _myValue = _x(my_input_dom,framesList[newFramesId].contentWindow.document)[0].value
                if(_myValue){  //如果之前激活了input对象,并输入了内容则记录
                    var domObject = new Object();
                    domObject.type = "js"
                    domObject.dom = my_input_dom
                    domObject.value = _myValue
                    domObject.describe = "inputToData"
                    domObject.iframe = newFramesId
                    domObject.order = 0
                    domObject.contentIndex = VIEWID
                    ipc.send("sendCMD",domObject)
                    _ISINPUT = false
                    console.dir(JSON.stringify(domObject))
                }
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
            domObject.iframe = newFramesId
            domObject.order = 0
            domObject.contentIndex = VIEWID
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




function domClick(dom){
    console.dir('执行啦')
    // console.dir( _x(dom)[0])
    $(_x(dom)[0]).click()
    $(_x(dom)[0]).blur()
    // _x(dom)[0].click()
}

window.domClick = domClick

function findChildType(dom){  //ok          
    if(dom.type == 'file'){
        return dom
    }    
    console.dir(dom)
    for(var i=0;i<dom.childNodes.length;i++){
        // if(dom.childNodes[i].childNodes > 0){
        //     findChildType(dom.childNodes[i])
        // }
        if(dom.childNodes[i].type == 'file'){
            return dom.childNodes[i]
        }
    }
    return false
}

window.findChildType = findChildType

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

window.onmousedown = function(e){
    VIEWID = localStorage.getItem("VIEWID");
    console.dir(VIEWID)
    if(ISFILE != false){
        var domObject = new Object();
        // domObject.dom = readXPath(ISFILE)
        console.dir(ISFILE)
        domObject.img = _x(my_input_dom)[0].files[0].path
        domObject.describe = "updateFile"
        domObject.type = "py"
        ipc.send("sendCMD",domObject)
        console.dir(JSON.stringify(domObject))
        ISFILE = false
        ISINPUT = false
    }

    ISFILE = findChildType(e.path[0])
    var newDom = readXPath(e.path[0])
    window.newDom = newDom
    if(ISINPUT){
        if(_x(my_input_dom)[0].value){  //如果之前激活了input对象,则记录输入的内容
            var domObject = new Object();
            domObject.type = "js"
            domObject.dom = my_input_dom
            domObject.value = _x(my_input_dom)[0].value
            domObject.describe = "inputToData"
            domObject.contentIndex = VIEWID
            domObject.iframe = null
            domObject.order = 0
            ipc.send("sendCMD",domObject)
            ISINPUT = false
        }
    }

    if(e.path[0].tagName == "INPUT"){  //判断是否为input,如果为input则记录此元素
        window.my_input_dom = newDom
        ISINPUT = true
    }
 
    // 记录点击的操作
    console.dir('点击了162')
    var domObject = new Object();
    domObject.dom = newDom
    domObject.type = "js"
    domObject.value = null
    if(ISFILE!= false){
        domObject.file = true
    }
    domObject.describe = "click"
    domObject.iframe = null
    domObject.contentIndex = VIEWID
    domObject.order = 0
    console.dir(JSON.stringify(domObject))
    ipc.send("sendCMD",domObject)
    // MYDB.defaults({cases:[]}).write();
}.bind(window)


document.onkeydown  = function(event){
    var e = event || window.event;
    if (e && e.keyCode == 13) { //回车键的键值为13
        // $("#login").click(); //调用登录按钮的登录事件
        if(_x(my_input_dom)[0].value){  //先发送input指令
            let domObject = new Object();
            domObject.type = "js"
            domObject.dom = my_input_dom
            domObject.value = _x(my_input_dom)[0].value
            domObject.describe = "inputToData"
            domObject.contentIndex = VIEWID
            domObject.iframe = null
            domObject.order = 0
            ipc.send("sendCMD",domObject)
            ISINPUT = false
        }
        let domObject = new Object();
            domObject.type = "js"
            domObject.dom = my_input_dom
            domObject.value = null
            domObject.describe = "submit"
            domObject.contentIndex = VIEWID
            domObject.iframe = null
            domObject.order = 0
            ipc.send("sendCMD",domObject)
    }

}