import { User } from "../models/user";
import path from "path"
import { promises as fs } from "fs";;

const addUsers = async () => {
  const data = await fs.readFile(path.resolve("/Users/sidharthrejikumar/interview/stack_finance/src/scripts/users.json"))

  const jsonData = JSON.parse(data.toString());
  for(const val of jsonData){
    const user = new User({
      _id: val.id ,
      name: val.name,
      email: val.email,
      password: val.password,
    });
    await user.save()
  }
}

export default addUsers;