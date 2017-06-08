module.exports = app => {
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport(app.config.transporter)
    class Email extends app.Service {
        sent(to, subject, html) {
            const {auth, appName} = this.config.transporter
            const mailOptions = {
                from: `${appName} <${auth.user}>`,
                to: to,
                subject: subject,
                html: html
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return this.ctx.logger.info('Message %s sent error: %s', error)
                }
            })
        }
        notifyApiChange(api, users) {
            const html = `
                <strong>API：${api.name}</strong>
                <p>修改者：${this.ctx.authUser.name}</p>
                <p>链接地址：${app.config.clientRoot}/#/doc/${api.group}/${api._id}</p>
            `
            users.map(user => {
                this.sent(user.email, 'Api Mocker 接口变动提醒', html)
            })
        }
    }
    return Email;
};