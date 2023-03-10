import axios from 'axios';
import { put, takeLatest, takeEvery } from 'redux-saga/effects';

//IMPORT FORM DATA FOR FILE SEND
import FormData from 'form-data';

//ROUTE: '/api/assignments'

function* fetchAssignments() {

    try {
        //console.log('IN FETCH MODULES ASSIGNMENTS 🖇️')
        let assignments = yield axios.get(`api/assignments`) //get assignments from database
        //  //console.log('feature GET response', assignments.data)

        yield put({
            type: 'SET_ASSIGNMENTS', //dispatch to assignments.reducer
            payload: assignments.data
        })
    } catch {
        //error route tested
        //console.log('error in assignmentsSaga')
    }
}

function* createAssignment(action) {
    // //console.log('in createAssignment SAGA with payload of:', action.payload);

    //create payload object
    let data = action.payload;
    //new formdata for payload to multer and router
    let formData = new FormData();

    // //console.log('video', data.assignmentVideo);
    // //console.log('video[0]', data.assignmentVideo);
    //req.file
    formData.append('assignmentVideo', data.assignmentVideo);

    //req.body
    formData.append('assignmentTitle', data.assignmentTitle);
    formData.append('assignmentContent', data.assignmentContent);
    formData.append('moduleId', data.moduleId);
    formData.append('postClass', data.postClass);
    formData.append('textField', data.textField);
    formData.append('file', data.file);
    formData.append('video', data.video);
    formData.append('seriesId', data.seriesId);
    //post to server

    try {
        //send FormData to server for db query
        yield axios.post('/api/assignments', formData, {
            //must include this header, it is what Multer uses to id file
            headers: {
                headers: { "Content-Type": "multipart/form-data" },
            }
        });
        //get posts redux and rerender after store is updated
    } catch (err) {
        //error route tested
        //console.error('in createAssignment SAGA error', err);
    }
}

function* fetchSelectedAssignment(action) {
    //console.log('in fetchSelectedAssignment saga with payload of:', action.payload);
    try {
        //get selectedAssignment from server with assignmentId of... 
        const selectedAssignment = yield axios.get(`/api/assignments/${action.payload}`);
        //console.log('response from GET assignment by ID', selectedAssignment.data);

        //send results to redux store
        yield put({
            type: 'SET_SELECTED_ASSIGNMENT',
            payload: selectedAssignment.data
        });

    } catch (err) {
        //error route tested
        //console.error('in fetchSelectedAssignment error', err);
    }

}

function* fetchSeriesAssignments(action) {
    //get all assignments from series with id of action.payload (seriesId)
    try {
        //get assignments in series from server
        const seriesAssignments = yield axios.get(`/api/assignments/series/${action.payload}`);
        // //console.log('response from GET assignment by series', seriesAssignments.data);

        //send results to redux store
        yield put({
            type: 'SET_SERIES_ASSIGNMENTS',
            payload: seriesAssignments.data
        });

    } catch (err) {
        //error route tested
        //console.error('in fetchSelectedAssignment error', err);
    }
}


function* deleteAssignment(action) {
    // //console.log('in deleteAssignment SAGA with payload of:', action.payload);

    try {
        //send id via axios delete request
        yield axios.delete(`/api/assignments/${action.payload}`)
    } catch (err) {
        //console.error('in deleteAssignment SAGA with error:', err);
    }

}

function* fetchEditAssignment(action) {
    //console.log('in fetchEditAssignment saga with payload of:', action.payload);
    try {
        //get selectedAssignment from server
        const editAssignment = yield axios.get(`/api/assignments/${action.payload}`);

        // //console.log('in fetchEditAssignments with response of:', editAssignment.data);

        //send results to redux store
        yield put({
            type: 'SET_EDIT_ASSIGNMENT',
            payload: editAssignment.data
        });
    } catch (err) {
        //error route tested
        //console.error('in fetchEditAssignment error', err);
    }
}

function* updateAssignment(action) {
    // //console.log('in updateAssignment with a payload of:', action.payload);

    //assign payload to data
    let data = action.payload;
    //new formdata
    let formData = new FormData;
    formData.append('id', data.id);
    formData.append('media', data.media);
    formData.append('name', data.name);
    formData.append('content', data.content);
    formData.append('postClass', data.postClass);
    formData.append('textField', data.textField);
    formData.append('file', data.file);
    formData.append('video', data.video);

    try {
        //send updates to the server
        yield axios.put('/api/assignments', formData, {

            headers: {
                headers: { "Content-Type": "multipart/form-data" },
            }
        })

        //update redux
        yield put({
            type: 'FETCH_ASSIGNMENTS',
        })
    } catch (err) {
        //console.error('in editAssignment SAGA put route:', err);
    }
}


function* assignmentsSaga() {
    yield takeLatest('FETCH_ASSIGNMENTS', fetchAssignments);

    //CREATE Assignment
    yield takeEvery('CREATE_ASSIGNMENT', createAssignment);

    //fetch selected assignment for details view
    yield takeEvery('FETCH_SELECTED_ASSIGNMENT', fetchSelectedAssignment);

    //DELETE assignment
    yield takeEvery('DELETE_ASSIGNMENT', deleteAssignment);

    //FETCH EDIT ASSIGNMENT
    yield takeEvery('FETCH_EDIT_ASSIGNMENT', fetchEditAssignment);


    yield takeLatest('FETCH_SERIES_ASSIGNMENTS', fetchSeriesAssignments);

    // EDIT ASSIGNMENT
    yield takeEvery('UPDATE_ASSIGNMENT', updateAssignment);


}

export default assignmentsSaga;