/**
 * Created by zhouyunkui on 2016/8/11.
 */
var os = require('os');
module.exports.getLocalIP=function() {
    var ifaces = os.networkInterfaces();
    for(var i in ifaces){
        if(ifaces[i] instanceof Array){
            for(var j=0;j<ifaces[i].length;j++){
                for(var k in ifaces[i][j]){
                    if((/family/i).test(k)){
                        if((ifaces[i][j][k]+"").toLowerCase()==="ipv4"){
                            if(ifaces[i][j].address!=="127.0.0.1"){
                                return ifaces[i][j].address
                            }
                        }
                    }
                }
            }
        }
    }
}
