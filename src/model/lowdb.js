

// function lowdb(){
//     console.log(46)
// }



// module.exports.lowdb = lowdb;

// export class App extends React.Componet {
//     class lowdb{
//         init(){
//             var db = require('lowdb')
//             var FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
//             var adapter = new FileSync('db.json'); // 申明一个适配器
//             this.db = db(adapter)  // 以上初始化数据库
//             return  this.db
//         }
//     }
//     // ..code
// }




// export default Tx ;{
//     console.log(123)
// }


class Point() {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

export default {
    Point
  }