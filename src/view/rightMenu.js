function _handleNodeClick(event, data, node, dom) {  //右键点击树形图,4个参数分别为event、data、node、dom
    var { remote } = require('electron')
    var { Menu, MenuItem } = remote
    var menu = new Menu()
    console.dir(data)
    switch (data.type) {
        case "projects":
            if (node.level < 3) {
                menu.append(new MenuItem({
                    label: '新建子目录', click() {
                        var num = self.addProjectId()
                        data.children.push({ "label": "new children", "type": "projects", "children": [], "id": num.projectsConts })
                        window.MYDB.get('projects')
                            .write()
                    }
                }))
            }
            menu.append(new MenuItem({
                label: '新建cases集', click() {
                    var num = self.addProjectId()
                    data.children.push({ "label": "$ cases", "type": "cases", "children": [], "id": num.projectsConts })
                    window.MYDB.get('projects')
                        .write()
                }
            }))

            menu.append(new MenuItem({
                label: '重命名', click() {
                    console.dir(event.path[0])
                    data.label = "rename"
                    self.renameDom = data
                    self.ReName(event.path[0].offsetLeft, event.path[0].offsetTop + 90, event.path[0].clientWidth, event.path[0].clientHeight)
                    window.MYDB.get('projects')
                        .write()
                }
            }))

            menu.append(new MenuItem({
                label: 'Delete', click() {
                    var parent = node.parent;
                    var children = parent.data.children || parent.data;
                    var _index = self.projectData.findIndex(d => d.id == data.id);
                    children.splice(_index, 1);
                    window.MYDB.get('projects')
                        .write()
                    self.reload()
                    // self.initProjectData()
                }
            }))
            break;

        case "cases":
            menu.append(new MenuItem({
                label: '添加cookie', click() {
                    var num = self.addProjectId()
                    data.children.push({ "label": "cookie配置", "type": "requestHd", "id": num.projectsConts })
                    window.MYDB.get('projects')
                        .write()
                }
            }))

            menu.append(new MenuItem({
                label: '重命名', click() {
                    data.label = "rename"
                    self.renameDom = data
                    self.ReName(event.path[0].offsetLeft, event.path[0].offsetTop + 90, event.path[0].clientWidth, event.path[0].clientHeight)
                    window.MYDB.get('projects')
                        .write()
                }
            }))

            menu.append(new MenuItem({
                label: 'Delete', click() {
                    var parent = node.parent;
                    var children = parent.data.children || parent.data;
                    console.dir(children)
                    var _index = self.projectData.findIndex(d => d.id == data.id);
                    children.splice(_index, 1);  //error
                    window.MYDB.get('projects')
                        .write()
                    self.reload()
                    // self.initProjectData()
                }
            }))
            break;
        case "requestHd":
            menu.append(new MenuItem({
                label: 'Delete', click() {
                    var parent = node.parent;
                    var children = parent.data.children || parent.data;
                    var _index = self.projectData.findIndex(d => d.id == data.id);
                    children.splice(_index, 1);  //error
                    window.MYDB.get('projects')
                        .write()
                    self.reload()
                }
            }))
        default:
            break;
    }

    menu.popup({ window: remote.getCurrentWindow() })
}

export {
    _handleNodeClick
}