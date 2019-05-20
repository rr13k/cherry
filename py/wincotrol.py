__author__ = "renran"
from  pynput.mouse import Button  # 鼠标
from  pynput.mouse import  Controller  as  ControllerMouse
from pynput import mouse  #鼠标
from pynput.keyboard import Listener
from pynput.keyboard import Key # 键盘
from  pynput.keyboard import  Controller  as  Controllerkeyboard
from pynput import keyboard
from urllib import parse

import win32con # 需要安装pywin32模块
import win32gui
import win32clipboard as wc
import time, threading,json


class winControl:

    def __init__(self):
        self.mouseControl = ControllerMouse()
        self.keyboardControl = Controllerkeyboard()
        self.mouse = mouse
        self.Key = keyboard.Key
        self.threading = threading
        self.Listener = Listener
        self.oldCpText = ""
        self.wc = wc

    def move(self,x,y):
        self.mouseControl.position = (x,y)
        pass

    def updateFile(self,imgSrc='test.jpg',winTitle='打开'):
        imgSrc = parse.unquote(imgSrc)
        windowBox = win32gui.FindWindow(None,winTitle)
        if(windowBox > 0):
            btn = win32gui.FindWindowEx(windowBox, None, 'Button',None)
            childWin = win32gui.FindWindowEx(windowBox, None, 'ComboBoxEx32',None)  #逐级寻找
            childWin = win32gui.FindWindowEx(childWin, None, 'ComboBox',None)
            childWin = win32gui.FindWindowEx(childWin, None, 'Edit',None)
            if(childWin > 0):
                win32gui.SendMessage(childWin, win32con.WM_SETTEXT,None,imgSrc)
                win32gui.PostMessage(btn, win32con.WM_KEYDOWN, win32con.VK_RETURN, 0)
                win32gui.PostMessage(btn, win32con.WM_KEYUP, win32con.VK_RETURN, 0)
                self.keyboardControl.press(Key.enter)
                self.keyboardControl.release(Key.enter)
                return "ok"
            else:
                return 'found eroor! please contact author...'
        else:
            return 'file upload not open!'

    def scrollbar(self,y=0):
        self.mouseControl.scroll(0,y)  # 为正向上滚
        pass

    def click(self,x,y):
        self.move(x,y)
        self.mouseControl.press(Button.left)
        self.mouseControl.release(Button.left)
    
    def rightClick(self,x,y):
        self.move(x,y)
        self.mouseControl.press(Button.right)
        self.mouseControl.release(Button.right)

    def setValue(self,x,y,value):
        value = parse.unquote(value)
        self.click(x,y)
        self.allSelect()
        self.writePaste(value)
        self.paste()


    def allSelect(self):  # 全选
        self.keyboardControl.press(self.Key.ctrl)
        self.keyboardControl.press('a')
        self.keyboardControl.release(self.Key.ctrl)
        self.keyboardControl.release('a')

    def paste(self):
        self.keyboardControl.press(self.Key.ctrl_l)
        self.keyboardControl.press('v')
        self.keyboardControl.release(self.Key.ctrl_l)
        self.keyboardControl.release('v')

    def writePaste(self,value):
        self.wc.OpenClipboard()
        self.wc.EmptyClipboard()
        self.wc.SetClipboardData(win32con.CF_UNICODETEXT, value)
        self.wc.CloseClipboard()

    def closeAPP(self,x,y):
        self.click(x,y)
        self.keyboardControl.press(self.Key.ctrl)
        self.keyboardControl.press(self.Key.f4)
        self.keyboardControl.release(self.Key.ctrl)
        self.keyboardControl.release(self.Key.f4)

    def getPosition(self):
        return self.mouseControl.position
        
    # def drag(self,x,y,lx,ly):
    #     self.move(x,y)
    #     self.mouseControl.press(Button.left)
    #     self.mouseControl.move(lx,ly)
    #     self.mouseControl.release(Button.left)
        
def main():
    sd = winControl()
    sd.scrollbar()
    pass

if __name__ == '__main__':
    main()