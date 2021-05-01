import Agenda from "agenda"
import { NotificationInterface, UserNotification } from "./models/userNotification";
import JobCreator from "./JobCreators/JobCreator";
import mongoose from "mongoose";
import { User } from "./models/user"
import express from "express"
import NotificationController from "./Controllers/NotificationController";
import addUsers from "./scripts/populate_users";
import addNotifications from "./scripts/populate_notifications";

const app = express();
app.use(express.json());
const port: number = Number(process.env.PORT);
const user = new User();
const mongoConnectionStringAgenda = process.env.MONGO_URL_AGENDA;
const mongoConnectionStringMain = process.env.MONGO_URL_MAIN;
const agenda = new Agenda({ db: { address: mongoConnectionStringAgenda } });

const notificationController = new NotificationController(agenda);
app.use("/", notificationController.router);

const server = app.listen( port, async () => {
  /** These initial scripts are just to populate the user and notification table with some values */
  await mongoose.connect(mongoConnectionStringMain, { useNewUrlParser: true });
  await addUsers()
  await addNotifications()

  const notificationList: NotificationInterface[] = await UserNotification.find().populate("user")
  const jobCreator = new JobCreator(notificationList, agenda, null)

  jobCreator.createListeners();
  await agenda.start();
  jobCreator.createJobs();

  console.log(`server started at http://localhost:${ port }`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server')
  await agenda.stop();
  server.close(() => {
    console.log('HTTP server closed')
  })
})




