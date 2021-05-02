import Agenda from "agenda";
import assert from "assert";
import mongoose from "mongoose";
import JobCreator from "../Services/JobCreatorService";
import { User, UserInterface } from "../models/user";
import { SingleNotification } from "../types/singleNotification";
import {NotificationInterface, UserNotification } from "../models/userNotification";

describe('JobCreatorService', () => {
  const agenda = new Agenda({ db: { address: process.env.MONGO_URL_AGENDA_TEST } });
  let user: UserInterface;

  before(async () => {
    await mongoose.connect(process.env.MONGO_URL_AGENDA_TEST, { useNewUrlParser: true });
    user = new User({
      "_id": "608c14e4166000bb332192f7",
      "name": "sid",
      "email": "test@.com",
      "password": "somehash"
    });
    await user.save()
  });

  it('Should create one job that runs once', async () => {
    const notification: SingleNotification = {
      medium: "EMAIL",
      user: "608c14e4166000bb332192f7",
      subject: "test",
      text: "test"
    }
    const jobCreator  = new JobCreator(null, agenda, notification);
    await jobCreator.createOneJob()

    const jobs = await agenda.jobs({name: "sendemail"})
    assert(jobs.length === 1);
    assert((jobs[0].toJSON().repeatInterval === undefined))
  });

  it('Should create one job that has a cron tab and does repeat', async () => {
    const notification: NotificationInterface = new UserNotification({
      medium: "EMAIL",
      user,
      cron: "* * * * *",
      subject: "test",
      text: "test"
    })
    const id = await notification.save()
    const jobCreator  = new JobCreator([notification], agenda, null);
    jobCreator.createJobs()

    const jobs = await agenda.jobs({name: "sendemail"})
    assert(jobs.length === 1);
    assert(jobs[0].toJSON().repeatInterval = "* * * * *")
    assert(jobs[0].toJSON().nextRunAt !== null)
  });

  afterEach(async() => {
    await agenda.cancel({ name: "sendemail" });
  });

  after(async() =>  {
    await user.remove()
  });
});