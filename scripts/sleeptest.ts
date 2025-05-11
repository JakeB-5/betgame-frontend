


const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}
let in_processing = false


const processor = async () => {
  in_processing = true

  console.log('processor')
  await sleep(5000)
  in_processing = false

}

(async () => {
  //sendTelMessage(`Start Game Processor`)

  try {
    await processor()
  } catch (e) {
    console.error(e)
  }
  //return
  setInterval(async () => {
    //console.log(`Start Running Processor`)
    try {
      if (!in_processing)
        await processor()
    } catch (err) {
      console.error(err)
    }
  }, 1000)

})()


