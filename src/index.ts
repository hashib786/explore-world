import { readFile } from "fs";
import { join } from "path";
import crypto from "crypto";
import dns from "dns";
import EventEmitter from "events";
import http from "http";

// setImmediate(() => console.log("setImmediate"));

// setTimeout(() => {
//   console.log("This is in Settimeout");
// }, 0);http

// process.env.UV_THREADPOOL_SIZE = 1;
// console.log(process.env);

// dns.lookup("example.org", (err, address, family) => {
//   console.log("address: %j family: IPv%s", address, family);
// });

// const start = Date.now();

// const readFunc = (error: NodeJS.ErrnoException | null, data: string) => {
//   console.log("data");

//   crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", (err, key) => {
//     console.log(Date.now() - start, "crypto 😊😊😊");
//   });
//   crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", (err, key) => {
//     console.log(Date.now() - start, "crypto 😊😊😊");
//   });
//   crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", (err, key) => {
//     console.log(Date.now() - start, "crypto 😊😊😊");
//   });
//   crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", (err, key) => {
//     console.log(Date.now() - start, "crypto 😊😊😊");
//   });
//   crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", (err, key) => {
//     console.log(Date.now() - start, "crypto 😊😊😊");
//   });
// };
// readFile(join(process.cwd(), "/test-file.txt"), "utf-8", readFunc);

type fullName = {
  name: string;
  lastName: string;
};

const myEvent = new EventEmitter();

myEvent.on("test", ({ name, lastName }: fullName): void => {
  console.log(`The First Name: ${name} and Last Name: ${lastName}`);
});

const HName: fullName = { name: "Hashib", lastName: "Raja" };
myEvent.emit("test", HName);

const server = http.createServer();
server.on("connect", (req, res) => {
  res.end("Hello World");
});

server.on("close", () => {
  server.on("close", () => {
    console.log("closing");
  });
  console.log("closing");
});

server.emit("close", () => {
  console.log("close");
});
