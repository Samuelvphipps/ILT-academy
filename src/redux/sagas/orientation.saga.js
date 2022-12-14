import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchOrientation() {
  
    try{
      console.log('IN FETCH MODULES ORIENTATION')
        let orientation =  yield axios.get(`api/orientation`) //get orientation from database
         console.log('feature GET response', orientation)
 
         yield put({
             type: 'SET_ORIENTATION', //dispatch to orientation.reducer
             payload: orientation.data
         })
     } catch{
         console.log('error in orientationSaga')
     }
}

// function* editCurrentStep(action) {
//     console.log('CURRENT STEP', action.payload)
// }

function* orientationSaga() {
  yield takeLatest('FETCH_ORIENTATION', fetchOrientation);
//   yield takeLatest('EDIT_CURRENT_STEP', editCurrentStep);
}

export default orientationSaga;