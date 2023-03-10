import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchModules(action) {
    // //console.log(`🔴 action.payload is `, action.payload); //action.payload is series id
    try{
        let modules =  yield axios.get(`api/modules/${action.payload}`) //get modules from database
         //console.log('feature GET response', modules)
 
         yield put({
             type: 'SET_MODULES', //dispatch to modules.reducer
             payload: modules.data
         })
     } catch{
         //console.log('error in modulesSaga')
     }
}

function* fetchCohortModules(action) {
    //console.log(`🔴 action.payload is `, action.payload); //action.payload is module id
    let cohortId = action.payload.cohortId;
    let seriesId = action.payload.seriesId;
    try{
        let cohortModules =  yield axios.get(`api/modules/cohort/${cohortId}/${seriesId}`) //get modules from database
         //console.log('feature GET response', cohortModules)
 
         yield put({
             type: 'SET_COHORT_MODULES', //dispatch to modules.reducer
             payload: cohortModules.data
         })
     } catch{
         //console.log('error in modulesSaga fetchCohortModules')
     }
}

function* publishCohortModule(action) {
    //console.log(`🍍 action.payload is `, action.payload);
    let cohortId = action.payload.cohortId;
    let moduleId = action.payload.moduleId;
    let seriesId = action.payload.seriesId;

    try{
        yield axios.post(`api/modules/publish/${cohortId}/${moduleId}`)

        //update cohort modules redux

        yield put({
            type:'FETCH_COHORT_MODULES',
            payload: {
                cohortId: cohortId,
                seriesId: seriesId
            }
        });

        //fetch assignment for series for render

        yield put({
            type:'FETCH_SERIES_ASSIGNMENTS',
            payload: seriesId
        });


    } catch{
        //console.log('error in modules.sage publishCohortModule')
    }
}

//make a new module
function* createModule(action) {
    // //console.log('in createModule SAGA', action.payload);

    try{
        //send new module to server
        yield axios.post('/api/modules', action.payload);

        //update redux
        yield put({
            type: 'FETCH_MODULES',
            payload: action.payload.seriesId
        });

    } catch (err) {
        //console.error('in createModule SAGA error:', err.message);
    }

}

function* deleteModule(action) {
    // //console.log('in deleteModule SAGA with payload of:', action.payload);
    try{
        //axios.delete to server
        yield axios.delete(`/api/modules/${action.payload.id}`);

        //update redux status
        yield put({
            type: 'FETCH_MODULES',
            payload: action.payload.seriesId
        });
        
    } catch (err){
        //console.error('error in deleteModule SAGA:', err.message)
    }
}

function* modulesSaga() {
  yield takeLatest('FETCH_MODULES', fetchModules);
  yield takeLatest('FETCH_COHORT_MODULES', fetchCohortModules);
  yield takeLatest('PUBLISH_MODULE', publishCohortModule);
  yield takeLatest('CREATE_MODULE', createModule);
  yield takeLatest('DELETE_MODULE', deleteModule);
}

export default modulesSaga;