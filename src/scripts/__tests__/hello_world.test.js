import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const internsPath = join(__dirname, "../../documents/interns.json");
const interns = JSON.parse(readFileSync(internsPath, "utf-8"));

const helloWorld = () => console.log("Hello, World!");

helloWorld();
