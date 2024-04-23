// 🌟new

import { all, fork } from 'redux-saga/effects';
import BasicInfoSaga from '../../pages/logi/basicinfo/saga/BasicInfoSaga';
import EstimateSaga from 'pages/logi/estimate/saga/EstimateSaga';
import LogisticsInfoSaga from 'pages/logi/basicinfo/saga/LogisticsInfoSaga';
import SalesSaga from 'pages/logi/delivery/saga/SalesSaga';

export default function* LogiRootSaga() {
  yield all([fork(BasicInfoSaga), fork(EstimateSaga), fork(LogisticsInfoSaga), fork(SalesSaga)]);
}
