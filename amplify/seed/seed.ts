import { readFile } from "node:fs/promises";
import {
  addToUserGroup,
  createAndSignUpUser,
} from "@aws-amplify/seed";
import { Amplify } from "aws-amplify";
import { password, username } from "./testuser";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: "utf8" }));
Amplify.configure(outputs);


const user = await createAndSignUpUser({
  username: username,
  password: password,
  signInAfterCreation: false,
  signInFlow: "Password",
});

await addToUserGroup(user, "admin");