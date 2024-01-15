// nodemailer.config.js


import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pingeweb50@gmail.com',
    pass: 'ruywhiqsxlfdygln'
  },
});


