const path = require('path');
const nconf = require('nconf');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const sparkPostTransport = require('nodemailer-sparkpost-transport');
const Queue = require('./queue');

const swig = require('./template-engine').getSwigEngine();

const mailFrom = nconf.get('mailFrom');
const viewsPath = path.join(__dirname, '..', '..', 'emails');
const sendgridApiKey = nconf.get('SENDGRID_API_KEY');
const emailQ = Queue.create('email');

function Mailer(options) {
  this.transport = nodemailer.createTransport(options);
}

Mailer.prototype.render = function render(template, options) {
  return swig.renderFile(path.join(viewsPath, template), options || {});
};

Mailer.prototype.renderFromString = function renderFromString(str, options) {
  return swig.render(str, {
    locals: options || {}
  });
};

Mailer.prototype.send = async function send(opts) {
  try {
    const options = opts || {};
    // TODO - pass default value
    // _.defaults(options, {
    //   from : config.emailFrom,
    //   bcc : config.bccEmails || []
    // });

    return this.transport.sendMail(options);
  } catch (e) {
    // TODO - log here
    return console.log('Send mail error', e);
  }
};

Mailer.prototype.sendMail = async function sendMail(template, emails, options) {
  try {
    const newOptions = Object.assign(options, {
      appConfig: {
        baseUrl: nconf.get('baseUrl'),
        logoUrl: nconf.get('logoUrl'),
        siteName: nconf.get('SITE_NAME'),
        facebookUrl: nconf.get('facebookUrl'),
        twitterUrl: nconf.get('twitterUrl')
      }
    });
    const output = options.renderFromString && options.renderTemplateContent ?
      this.renderFromString(options.renderTemplateContent, newOptions) :
      this.render(template, newOptions);
    const resp = await this.send({
      to: emails,
      from: options.from || mailFrom,
      subject: options.subject,
      html: output
    });

    return resp;
  } catch (e) {
    throw e;
  }
};

Mailer.prototype.close = () => this.transport.close();

let mailer;
const mailService = nconf.get('MAIL_SERVICE');
if (mailService === 'sparkpost') {
  mailer = new Mailer(sparkPostTransport({
    sparkPostApiKey: nconf.get('SPARKPOST_API_KEY')
  }));
} else {
  mailer = new Mailer(sgTransport({
    auth: {
      api_key: sendgridApiKey
    }
  }));
}

emailQ.process(async (job, done) => {
  try {
    await mailer.sendMail(job.data.template, job.data.emails, job.data.options);
  } catch (e) {
    // TODO - log error here
    console.log('Send email error', e);
  }

  done();
});

module.exports = {
  send(template, emails, options) {
    emailQ.createJob({ template, emails, options })
      .save();
  }
};
