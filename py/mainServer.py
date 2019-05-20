__author__ = "renran"
from http.server import HTTPServer, BaseHTTPRequestHandler
from  wincotrol import winControl

import json,re
import win32api,win32con
import signal,os 

host = ('localhost', 8871)
_winControl = None

def nihao():
    win32api.MessageBox(0, "禁止访问没有权限的内存区域!", "错误！", win32con.MB_ICONERROR)

class Resquest(BaseHTTPRequestHandler):

    def _nihao(self):
        nihao()
    
    def _splitPath(self,_str):
        if "?" in _str:
            _re = re.compile(r'^(.+?)\?')
            path = re.findall(_re,_str)[0]
            _re = re.compile(r'[\?&](\w+)=([^&]+)')
            _data = re.findall(_re,_str)
            data = {}
            for  i in _data:
                data[i[0]] = i[1]
            return path,data
        else:
            return _str,False
            
    def do_GET(self,*Resquest):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        responseDate = {"state":200,"measage":"offer window situation api!"}
        myData = False
        myPath,myData = self._splitPath(self.path)
        if myData:
            try:
                x = myData["x"]
                y = myData["y"]
            except BaseException:
                pass

        if myPath == "/error":
            self._nihao()
            pass
        elif myPath == "/click":
            _winControl.click(x,y)

        elif myPath == "/scrollbar":
            print('调用滚轮')
            y = None
            try:
                y = myData["y"]
            except BaseException:
                pass
            print(y)
            _winControl.scrollbar(y)

        elif myPath == "/updateFile":
            try:
                img = myData["img"]
                if(hasattr(myData, 'winTitle')):
                    responsesData = _winControl.updateFile(img,myData["winTitle"])
                else:
                    responsesData = _winControl.updateFile(img)
            except BaseException:
                responsesData = _winControl.updateFile()
                pass
            responseDate["data"] = {"data":responsesData}

        elif myPath == "/setValue":
            value = myData["value"]
            _winControl.setValue(x,y,value)

        elif myPath == "/move":
            _winControl.move(x,y)

        elif myPath == "/rightClick":
            _winControl.rightClick(x,y)

        elif myPath == "/getPosition":
            x,y = _winControl.getPosition()
            responseDate["data"] = {"x":x,"y":y}
        
        self.wfile.write(json.dumps(responseDate).encode())

def onsignal_term(a,b):  
    print('收到SIGTERM信号')

if __name__ == '__main__':
    print(os.getpid())
    signal.signal(signal.SIGTERM,onsignal_term)  
    _winControl = winControl()
    server = HTTPServer(host, Resquest)
    print("Starting server, listen at: %s:%s" % host)
    server.serve_forever()
   