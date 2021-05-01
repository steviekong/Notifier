# Scheduled Notifier

Simple node app to send notifications to users via different channels email, slack etc. Only supports simple SMTP email delivery right now.

Built with TypeScript, Node, ExpressJS and MongoDB.

## Getting started

This development setup has only been tested on OSX 11.3. It will not work on windows systems.

### Prerequisites

- node v14.\*
- npm v6.14.\*
- MongoDB 4.4.5 \*

### Directory structure

`src` contains all the project files including models, controllers and scripts.

Example user data to populate the database is present in `src/scripts/users.json`
Example notification data to populate database is present `in src/scripts/notification.json`

You can add your own data here.

### Setup for Local deployment

1. Clone this repository

2. Install npm packages
   `npm install`
3. Add your SMTP sender email and password to the `.env` file.

Example:

```
SENDER_EMAIL=abcxyz@gmail.com
SENDER_EMAIL_PASSWORD=mysupersecretgmailpassword
```

For this to work with gmail you must allow less secure apps to access your gmail account.

You can change this setting here https://myaccount.google.com/lesssecureapps

Turn it back off after testing.

If you want to use another SMPT service you can change `/src/Configs/emailConfig.ts` to a valid SMPT config object supported by nodemailer.

3. Add your own email to `/src/scripts/users.json` so you can test the service.

4. Run the server
   `npm run start`

If the server starts successfully you should see the following

```
server started at http://localhost:3000
```

The express server should be running on http://localhost:3000.
The jobs within `in src/scripts/notification.json` will start and start firing notifications based on the cron job given.

### API

The express server exposes `/notification` which uses http POST.
This will fire a notification based on the following JSON input.

```json
{
  "medium": "EMAIL",
  "user": "608c14e4166000bb332192f7",
  "subject": "test",
  "text": "test"
}
```

Only medium currently supported is EMAIL.

**Have fun! 🙂 🎉**
