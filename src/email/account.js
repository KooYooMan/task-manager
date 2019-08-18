const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sgMail.send({
    to: 'vbnmqmn@gmail.com',
    from: 'vbnmqmn@gmail.com',
    subject: 'This is my first creation!',
    text: 'I hope this one actually get to you'
})