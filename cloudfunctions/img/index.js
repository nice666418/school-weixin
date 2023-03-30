// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env : 'dbcloud-0g1vrlmq7a736a4e'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.fileContent)
  try {
    return await cloud.uploadFile({
      fileContent: new Buffer(event.fileContent, 'base64'),
      cloudPath: event.cloudPath // 使用随机文件名
    })
  } catch (e) {
    return e
  }
}