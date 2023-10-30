import nodemailer from "nodemailer";

async function sendEmail({ to, cc, bcc, subject, html, attachments = [] } = {}) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.gmail, // generated ethereal user
            pass: process.env.gmailPass, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"TasksOrganizer" <${process.env.gmail}>`, // sender address
        to,
        cc,
        bcc,
        subject,
        html,
        attachments
    });


    return info.rejected.length ? false : true
}



// html


export const html = (message, code) => {
    console.log({message, code});
    return `  
    <p 
    style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #000000; text-decoration: none; color: #000000;
    text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #ED9728; display: inline-block;">${message}
  </p>
                         
         <p 
            style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #000000; text-decoration: none; color: #000000;
            text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #ED9728; display: inline-block;">${code}
       </p>
  `
}


export default sendEmail
