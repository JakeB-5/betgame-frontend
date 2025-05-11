import {appendFileSync, appendFile} from "fs";
import moment from "moment";
import path from "path";

const logPath = path.join(__dirname, '../','logs')

const logFileName = (ph='') => {
  const date = moment(Date.now()).format('YYYY-MM-DD HH')

  let fileName = `${date}`
  if(ph)
    fileName = `${fileName}.${ph}.log`
  return fileName
}

const logFilePath = (ph='') => path.join(logPath, logFileName(ph))
export const writeLog = (msg, ph='') => {
  appendFileSync(logFilePath(ph), `[${moment(Date.now()).format('mm:ss')}] ${msg} \n`)
}
