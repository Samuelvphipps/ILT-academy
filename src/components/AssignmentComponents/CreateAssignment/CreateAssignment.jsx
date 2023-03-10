import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { useParams, useHistory } from 'react-router-dom';
import axios from "axios";
import FormData from "form-data";
const Swal = require('sweetalert2');

//MUI imports
import { PrimaryMainTheme } from "../../PrimaryMainTheme/PrimaryMainTheme";
import { ThemeProvider } from '@mui/system';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
    TextareaAutosize,
    Typography,
    FormLabel,
    Radio,
    RadioGroup,
    FormGroup,
    Input,
    Box,
    Checkbox,
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    FormControlLabel,
    Select,
    Button
} from '@mui/material';

function CreateAssignment() {
    //import user
    const user = useSelector(store => store.user);
    //setup
    const dispatch = useDispatch();
    const params = useParams();
    const history = useHistory();

    // //console.log(user.accessLevel)
    // import useState and create state for selected file on video upload
    const [assignmentVideo, setAssignmentVideo] = useState('');
    //use usestate to track content of WYSIWYG
    const [assignmentContent, setAssignmentContent] = useState('');
    //useState to track assignment title
    const [assignmentTitle, setAssignmentTitle] = useState('');

    //submission types
    const [textField, setTextField] = useState(false);
    const [fileSubmission, setFileSubmission] = useState(false);
    const [postClass, setPostClass] = useState(false);
    const [videoSubmission, setVideoSubmission] = useState(false);
    const [orientation, setOrientation] = useState(false);

    const submitAssignment = (evt) => {
        evt.preventDefault();
        //console.log('in submit assignment');
        //ensure there is content in the WYSIWYG
        if (assignmentContent.length <= 10) {
            alert('Must put content into the assignment');
            return
        }

        //dispatch to the SAGA for serverpost route
        dispatch({
            type: 'CREATE_ASSIGNMENT',
            payload: {
                assignmentVideo,
                assignmentContent,
                assignmentTitle,
                moduleId: params.moduleId,
                postClass,
                textField,
                // name to match database, lef as submission so there isnt confusion on this page
                file: fileSubmission,
                video: videoSubmission,
                seriesId: params.seriesId,
            }
        })
        //push to modules view
        Swal.fire({
            title: 'Success!',
            confirmButtonColor: '#f96b61'

        })
            .then((result) => {
                history.push(`/admin/modules/${params.seriesId}`);
            })
    }


    // //console.log('assignmentcontent', assignmentContent);

    //! handleImageUploadBefore will not run async - creates two img elements
    const handleImageUploadBefore = (files, info, uploadHandler) => {
        // uploadHandler is a function
        // //console.log(files, info)
        // create async in scope to use uploadHandler fn from Suneditor to use url
        //
        const callBack = async () => {
            //create new formdata
            let formData = new FormData();
            //append
            formData.append('image', files[0]);
            //post
            const response = await axios.post('/api/assignments/imagefield', formData, {                
                headers: {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            });
            //console.log('response', response.data);
            //attribute the s3URL to the img tag
            uploadHandler(response.data);
        }
        //call async fn for upload
        callBack();
        // uploadHandler();

    }
    //suneditor fn
    const handleChange = (content) => {
        setAssignmentContent(content);
    }

    const populateAssignment = async () => {
        setAssignmentTitle('5. Unpacking Your Key Insights and Observations');
        setPostClass(true);
    }

    //testing logs
    //console.log('submission types, textfield:', textField, 'fileSubmission', fileSubmission, 'video', videoSubmission);
    // //console.log('pre class should be false:', postClass);
    // //console.log('video submission', videoSubmission);
    return (
        <>
            <ThemeProvider theme={PrimaryMainTheme}>
                <Typography
                    variant="h1"
                    color='primary'
                    sx={{ textAlign: 'center' }}
                >
                    Create New Assignment
                </Typography>
                <Box sx={{
                    backgroundColor: '#80808017',
                    margin: '1rem',
                    borderRadius: '10px',
                    paddingBottom: '2rem',
                }}>
                    <form onSubmit={submitAssignment}>
                        <Grid2 container spacing={2}>
                            <Grid2 item sm={1}></Grid2>
                            <Grid2 item sm={4}>
                                <InputLabel
                                    color='primary'
                                    sx={{
                                        color: '#f96b61',
                                        fontWeight: 'bold',
                                        marginBottom: 0,
                                        fontSize: '22px'
                                    }}
                                    onClick={populateAssignment}
                                >
                                    Assignment Name
                                </InputLabel>
                                <OutlinedInput
                                    sx={{ marginTop: 0, backgroundColor: 'white', fontSize: '20px' }}
                                    required
                                    type='text'
                                    placeholder="Assignment Name"
                                    onChange={(evt) => setAssignmentTitle(evt.target.value)}
                                    value={assignmentTitle}
                                    autoFocus
                                    variant='outligned'
                                    require
                                />
                            </Grid2>
                            <Grid2 item sm={7} >

                                <InputLabel
                                    sx={{
                                        color: '#f96b61',
                                        fontWeight: 'bold',
                                        marginBottom: 0,
                                        fontSize: '22px'
                                    }}
                                >
                                    Upload Video
                                </InputLabel>
                                <OutlinedInput
                                    sx={{
                                        marginTop: 0, backgroundColor: 'white', fontSize: '20px'
                                    }}
                                    accept="video/*"
                                    type='file'
                                    name="selectedVideo"
                                    inputProps={{ accept: 'video/*' }}
                                    onChange={(evt) => setAssignmentVideo(evt.target.files[0])}
                                    color='primary'
                                />
                            </Grid2>
                        </Grid2>
                        <Grid2 container spacing={2}>
                            <Grid2 item sm={1}></Grid2>
                            <Grid2 item sm={10}>
                                {/* WYSIWYG 
                                cannot refactor or the defaults break                                
                                */}
                                <SunEditor
                                    //handle change to update state for post
                                    onChange={handleChange}
                                    setOptions={{
                                        height: 800,
                                        buttonList: [
                                            ['font', 'align'],
                                            ['fontSize'],
                                            ['italic'],
                                            ['bold'],
                                            ['underline'],
                                            ['video'],
                                            ['image'],
                                            ['link']
                                        ],
                                        videoHeightShow: false,
                                        videoWidthShow: false,
                                        videoFileInput: false,
                                        videoUrlInput: false,
                                        videoRatioShow: false,
                                        //autoset video info to prevent smashed vid bug
                                        videoWidth: "603px",
                                        videoHeight: "339px",
                                    }}
                                    //call on imageupload to generate url for html content
                                    onImageUploadBefore={handleImageUploadBefore}
                                />
                            </Grid2>
                            <Grid2 item sm={1}></Grid2>
                        </Grid2>
                        <Grid2 container sx={{ textAlign: 'center', alignContent: 'top' }} spacing={2}>
                            <Grid2 item sm={2}></Grid2>
                            <Grid2 item sm={4}>
                                <FormControl>
                                    <FormLabel><Typography variant="h3" sx={{ fontSize: '20px', marginTop: 0 }}>Pre/Post-Class?</Typography></FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue=""
                                        name="radio-buttons-group"
                                        require
                                    >
                                        <FormControlLabel
                                            control={<Radio required />}
                                            value={false}
                                            onChange={(evt) => setPostClass(evt.target.value)}
                                            label="Pre-Class"
                                        />
                                        <FormControlLabel
                                            control={<Radio required />}
                                            value={true}
                                            onChange={(evt) => setPostClass(evt.target.value)}
                                            label="Post-Class"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid2>
                            <Grid2 item sm={4}>
                                <FormGroup sx={{ display: 'inline' }}>
                                    <FormLabel>
                                        <Typography
                                            variant="h3"
                                            sx={{ fontSize: '20px' }}
                                        >
                                            Submission Type
                                        </Typography>
                                    </FormLabel>
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        labelPlacement='top'
                                        value={true}
                                        onChange={() => setTextField(!textField)}
                                        label="Text Field"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        labelPlacement='top'
                                        value={true}
                                        onChange={() => setFileSubmission(!fileSubmission)}
                                        label="File"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        labelPlacement='top'
                                        value={true}
                                        onChange={() => setVideoSubmission(!videoSubmission)}
                                        label="Video"
                                        variant='body1'
                                        color='primary'
                                    />
                                </FormGroup>
                            </Grid2>
                            <Grid2 item sm={2}></Grid2>
                        </Grid2>
                        <Grid2 container sx={{ textAlign: 'right' }} spacing={2}>
                            <Grid2 item sm={1}></Grid2>
                            <Grid2 item sm={10}>
                                <Button
                                    sx={{ marginTop: '1rem' }}
                                    size='large'
                                    type="submit"
                                    variant="contained"
                                >
                                    <Typography variant="body1">Create Assignment</Typography>
                                </Button>
                            </Grid2>
                            <Grid2 item sm={1}></Grid2>
                        </Grid2>
                    </form>
                </Box>
            </ThemeProvider>
        </>
    )
}

export default CreateAssignment






// const getVideo = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: { width: 300 } })
//       .then(stream => {
//         let video = videoRef.current;
//         video.srcObject = stream;
//         video.play();
//       })
//       .catch(err => {
//         //console.error("error:", err);
//       });
//   };

//   const videoRef = useRef(null);


// <button>Take selfie</button>
//                 <video ref={videoRef}></video>
//                 <input 
//                     capture="camera"                
//                     type='file' 
//                     name="assignment_video"
//                     // onChange = {changeHandler}
//                 />

//                 useEffect(() => {
//                     getVideo();
//                   }, [videoRef]);