import { evalFile } from "./test/fileRead"

const filePath = process.argv[2]
const val = await evalFile(filePath)
if (val.type !== 'void') {
    console.log(val.value)
}
