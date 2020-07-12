import {fun} from '@/common/index'
import { isDev } from '@/common/env'

/**
 * 异常类——构造函数模式
 */
export function Exception () {

}

/**
 * 异常类——es6模式
 */
// export class Exception {
//   constructor () {
//   }
//
//   handle
// }

/**
 * 自定义处理错误
 * @param msg
 * @constructor
 */
function handle (e) {
  if (e === 'nocare' || e.message === 'nocare') return
  let { message = '错误信息', type = 'toast', icon = 'none' } = e
  if (typeof e !== 'object') {
    message = e
  }
  // 开发模式下，全部都弹出来
  if (isDev) { type = 'modal'; message = '开发调试信息:' + message; console.log(e) }
  if (type === 'toast') fun.info({msg:message})
  if (type === 'modal') fun.warning({msg:message})

  return ({
    message,
    type,
    icon
  })
}

Exception.prototype = {
  constructor: Exception
}
Exception.handle = handle
