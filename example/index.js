/**
 * Created by ink on 2018/3/23.
 */
import flop from '../src/flop'
flop({
  format: 'hh mm ss'
})(document.getElementById('timer'))
flop({
  format: 'hhhh mm ss',
  timeType: 'countdown',
  deadline: new Date('2018-10-01 00:00:00')
})(document.getElementById('countdown'))
