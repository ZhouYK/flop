/**
 * Created by ink on 2018/3/22.
 */
import './flop.less'
const main = ({format, timeType, deadline, afterEnd}) => {
  let timestamp
  if (timeType === 'countdown') {
    timestamp = deadline.getTime()
  }
  const allUl = {}
  const allUlOperatedFnc = {}
  const partialArr = format.split(' ')
  //根据格式，生成对应格式位的进制
  const getConversionByType = (type) => (index) => {
    switch (type) {
      case 'mm':
      case 'ss':
        if (index === 0) {
          return 6
        } else if (index  === 1) {
          return 10
        }
      case 'hh':
        if (index === 0) {
          return 2
        } else if (index === 1) {
          return 10
        }
      //这种情况只会出现在倒计时或者计时，不会出现在记录时间上
      case 'hhhh':
        return 10
      default:
        ;
    }
  }
  //生成li元素
  const generateLi = (number) => {
    let li = document.createElement('li')
    let header = document.createElement('header')
    let footer = document.createElement('footer')
    let headerSection = document.createElement('section')
    let footerSection = document.createElement('section')
    headerSection.innerHTML = footerSection.innerHTML = number
    header.appendChild(headerSection)
    footer.appendChild(footerSection)
    li.appendChild(header)
    li.appendChild(footer)
    return li
  }
  //生成ul列表
  //根据格式来确认每个单位的数据，生成多少个ul来展示
  const generateList = (value) => {
    let listNum = value.length
    let partialArr = []
    while (listNum > 0) {
      let conversion = getConversionByType(value)(value.length - listNum)
      let ul = document.createElement('ul')
      ul.classList.add('time-flop')
      ul.classList.add(`${value}`)
      let listLength = conversion
      while (listLength > 0) {
        let lis = generateLi(conversion - listLength)
        ul.appendChild(lis)
        listLength -= 1
      }
      partialArr.push(ul)
      listNum -= 1
    }
    return partialArr
  }
  //计算所有数值
  const caculateTimeToValue = () => {
    let hoursNumber, minutesNumber, secondsNumber
    if (timeType === 'time') {
      const now = new Date()
      hoursNumber = now.getHours()
      minutesNumber = now.getMinutes()
      secondsNumber = now.getSeconds()
    } else if (timeType === 'countdown') {
      const now = Date.now()
      if(timestamp <= now) {
        return afterEnd()
      }
      const futureGap = timestamp - now
      hoursNumber = Math.floor(futureGap / (1000 * 3600))
      minutesNumber = Math.floor((futureGap - hoursNumber * 3600 * 1000) / (60 * 1000))
      secondsNumber = Math.floor((futureGap - hoursNumber * 3600 * 1000 - minutesNumber * 60 * 1000) / 1000)
    }
    const zeroPrefix = (value, unit) => {
      const valueLength = value.length,
        unitLength = unit.length
      let preStr = ''
      if (valueLength < unitLength) {
        preStr = `${'0'.repeat(unitLength - valueLength)}`
      }
      return Array.from(`${preStr}${value}`)
    }
    const hours = zeroPrefix(hoursNumber.toString(10), partialArr[0])
    const minutes = zeroPrefix(minutesNumber.toString(10), partialArr[1])
    const seconds = zeroPrefix(secondsNumber.toString(10), partialArr[2])
    const timeMap = {}
    partialArr.forEach((item, index) => {
      let value
      if (item === 'hhhh' || item === 'hh') {
        value = hours
      } else if (item === 'mm') {
        value = minutes
      } else if (item === 'ss') {
        value = seconds
      }
      timeMap[item] = value
    })

    for (let key in allUlOperatedFnc) {
      allUlOperatedFnc[key].map((fn, index) => {
        //对应ul列的处理函数，并传入对应的值
        fn(timeMap[key][index])
      })
    }
    setTimeout(caculateTimeToValue, 1000)
  }
  //更新对应的ul列
  const counter = (ulDomList) => {
    const listArr = ulDomList.querySelectorAll('li')
    const colInfo = {
      elList: Array.from(listArr),
      value: {
        before: undefined,
        current: undefined
      }
    }
    //影响进位，还是减位 以及数字显示
    let flag
    if (timeType === 'time' || timeType === 'timing') {
      flag = 1
    } else if (timeType === 'countdown') {
      flag = -1
    }
    return (conversion) => (valueStr) => {
      let value = Number(valueStr)
      const max = conversion - 1
      const min = 0
      colInfo.value.before = colInfo.value.current
      colInfo.value.current = value
      const {before, current} = colInfo.value
      const {elList} = colInfo
      let beforeIndex = value - flag
      let preBeforeIndex = beforeIndex - flag
      if (flag > 0) {
        if (beforeIndex < min) {
          beforeIndex = max
          preBeforeIndex = beforeIndex - flag
        }
        if (preBeforeIndex < min) {
          preBeforeIndex = max
        }
      } else {
        if (beforeIndex > max) {
          beforeIndex = min
          preBeforeIndex = beforeIndex - flag
        }
        if (preBeforeIndex > max) {
          preBeforeIndex = min
        }
      }
      elList.map((item, index) => {
        if (index !== preBeforeIndex && index !== beforeIndex && index !== current) {
          const classList = item.classList
          classList.remove('before')
          classList.remove('active')
        }
      })
      let preBeforeDomClassList = elList[preBeforeIndex].classList
      let beforeDomClassList = elList[beforeIndex].classList
      preBeforeDomClassList.remove('before')
      beforeDomClassList.remove('active')
      beforeDomClassList.add('before')
      let currentDomClassList = elList[current].classList
      currentDomClassList.add('active')
    }
  }
  //入口函数
  const generateAll = (container) => {
    //倒计时时间已到
    if (timeType === 'countdown' && timestamp <= Date.now()) {
      return afterEnd()
    }
    const fragment = document.createDocumentFragment()
    for(let value of partialArr) {
      allUl[value] = generateList(value)
      allUlOperatedFnc[value] = []
    }
    const objectKeys = Object.keys(allUl)
    const objectKeysLength = objectKeys.length
    let count = 0
    const appendChild = key => {
      count++
      const arr = allUl[key]
      if (count > 1 && count <= objectKeysLength) {
        const semicolon = document.createElement('span')
        semicolon.classList.add('semicolon')
        semicolon.innerHTML = ':'
        fragment.appendChild(semicolon)
      }
      arr.map((list, index) => {
        fragment.appendChild(list)
        const conversion = getConversionByType(key)(index)
        allUlOperatedFnc[key].push(counter(list)(conversion))
      })
    }
    for(let key in allUl) {
      appendChild(key)
    }
    container.appendChild(fragment)
    caculateTimeToValue()
  }
  return generateAll
}
//整理入参
const flop = ({format, timeType, deadline, afterEnd} = {format: 'hh mm ss', timeType: 'time'}) => {
  const supportedType = ['time','countdown']
  const supporteFormat = ['hh mm ss', 'hhhh mm ss']
  const options = {}
  format = !format ? 'hh mm ss' : format
  options.format = format
  if (!supporteFormat.includes(format)) throw new Error('sorry, `format` type is not supported now! the supported type is: `hh mm ss`.There will be more format in future')

  timeType = !timeType ? 'time' : timeType
  if (!supportedType.includes(timeType)) {
    throw new Error('sorry, `timeType` type is not supported now! the surpported types are: time, countdown, I will involve more types in future')
  }
  options.timeType = timeType

  if (timeType === 'countdown') {
    if (!(deadline instanceof Date)) throw new Error('the `deadline` needs to be Date type')
    deadline = !deadline ? new Date(Date.now() + 3600 * 1000) : deadline
    options.deadline = deadline
    if(!afterEnd || typeof afterEnd !== 'function') {
      afterEnd = () => {}
      console.warn('the `afterEnd` needs to be a function')
    }
    options.afterEnd = afterEnd
  }
  return main(options)
}
//const factory = (require, exports) => {
//  return flop
//}
//const wrapFnc = (fn) => {
//  if (module && typeof module.exports === 'object') {
//    let v = fn(require, exports)
//    if (v !== undefined) module.exports = v
//  } else if (typeof define === 'function' && define.amd) {
//    define(['require', 'exports'], fn)
//  }
//}
//wrapFnc(factory)
export default flop