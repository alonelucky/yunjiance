const nodemailer = require("nodemailer")
// 引入配置文件
const mailCfg = require("./config").mail
// 创建邮件发送
const mailer = nodemailer.createTransport(mailCfg)

// 发送函数
function sendMail(obj){
    // 邮件发送信息
    let mailMsg = {
        // 为自身<>必须
        from: `自定义监控 <xiaqiubo123@163.com>`,
        // 接收人
        to: mailCfg.receive,
        // 邮件标题
        subject :"网站异常",
        // 邮件正文-纯文本
        text: JSON.stringify(obj),
        // 邮件正文-富文本,开启html后,text内容无效
        // html:"<h1></h1>"
    }
    // 执行发送
    mailer.sendMail(mailMsg).then(info=>{
        console.log(info)
    }).catch(err=>{
        console.error(err)
    })
}

module.exports = sendMail