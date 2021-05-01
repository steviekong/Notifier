import { UserNotification } from "../models/userNotification";
import path from "path"
import { promises as fs } from "fs";

const addNotifications = async () => {
  const data = await fs.readFile(path.resolve("/Users/sidharthrejikumar/interview/stack_finance/src/scripts/notification.json"))
  const jsonData = JSON.parse(data.toString());
  for(const val of jsonData){
    const notification = new UserNotification({
      medium: val.medium,
      cron: val.cron,
      user: val.user,
      subject: val.subject,
      text: val.text
    });
    await notification.save()
  }
}

export default addNotifications;