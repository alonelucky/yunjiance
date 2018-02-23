const http = require("http")
const https = require("https")
const url = require("url")
const fs = require("fs")
// 引入邮件发送模块
const sendMail = require("./mail")
// 引入配置文件
const config = require("./config")

// 获取需要监控的站点列表
let webArr = null
try {
   webArr = fs.readFileSync("./website.txt").toString().split("\n")
   // 仅获取以http开头的行
   webArr = webArr.filter(item=>{
        return (/^(http)/).test(item)
   })
}catch(e){
    console.log("请检查是否存在website.txt文件")
    console.log(e)
    return
}

// 以http方式请求
function httpGet(url){
    return new Promise((resolve,reject)=>{
        http.get(url,res=>{
            resolve(res.statusCode)
        }).on("error",(e)=>{
            reject(e)
        })
    })
}

// 以https方式请求
function httpsGet(url){
    return new Promise((resolve,reject)=>{
        https.get(url,res=>{
            resolve(res.statusCode)
        }).on("error",(e)=>{
            reject(e)
        })
    })
}

// 程序主函数
function main(){
    // 遍历站点列表
    webArr.map(item=>{
        // 解析请求协议
        let protocol = url.parse(item).protocol
        let code = 0
        let info = {
            website:item
        }
        // 将请求协议http/https分别处理
        if(protocol=="https:"){
            // 进行请求
            httpsGet(item).then(code=>{
                // 输出请求结果 时间-站点-状态码
                console.log(`[${new Date().toLocaleString()}] - ${item} - ${code}`)
                // 如果请求状态码大于400,则发送邮件提醒
                if(code>=400){
                    info.code=code
                    info.time=new Date().toLocaleString()
                    sendMail(info)
                }
            }).catch(e=>{
                // 如果请求错误,则直接提醒
                console.log(`[${new Date().toLocaleString()}] - ${item} - ${e}`)
                info.error=e
                info.time=new Date().toLocaleString()
                sendMail(info)
            })
        }else{
            httpGet(item).then(code=>{
                // 输出请求结果 时间-站点-状态码
                console.log(`[${new Date().toLocaleString()}] - ${item} - ${code}`)
                // 如果请求状态码大于400,则发送邮件提醒
                if(code>=400){
                    info.code=code
                    info.time=new Date().toLocaleString()
                    sendMail(info)
                }
            }).catch(e=>{
                // 如果请求错误,则直接提醒
                console.log(`[${new Date().toLocaleString()}] - ${item} - ${e}`)
                info.error=e
                info.time=new Date().toLocaleString()
                sendMail(info)
            })
        }
    })
    // 定时调用
    setTimeout(main,1000*60)
}
main()


