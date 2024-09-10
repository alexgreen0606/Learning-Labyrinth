import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import MenuBar from '../components/MenuBar';
import { Box, Tab, Tabs, TextField, Tooltip } from '@mui/material';
import robot from "../images/robot.jpg";
import Tips from '../components/Tips';
import {
    createMazeAttempt,
    getBestAttempt,
    getMostRecentAttempt,
    setCurrentAnimatedAttempt,
    testMazeAttempt
} from '../store/mazeAttempts';
import MazeAnimation from '../components/MazeAnimation';
import Messenger from '../components/Messenger';
import RobotMessageDisplay from '../components/RobotMessageDisplay';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import { showSuccess } from '../store/success';
import '../styles/userAttemptMaze.css';

const UserAttemptMaze = () => {

    const dispatch = useDispatch();

    // placeholder code whenever there is no user code in the text field
    const SAMPLE_CODE = "do {\n" +
        "   robot.moveForward();\n" +
        "} while (robot.scanForward() == GridTypeEnum.PATH);"

    // Global states for the current maze and mazeId being attempted
    const currentMazeId = useSelector(state => state.mazes.currentMazeId)

    // the best maze attempt made by the user
    const bestAttempt = useSelector(state => state.mazeAttempts.bestAttempt)

    // the most recent maze attempt made by the user
    const mostRecentAttempt = useSelector(state => state.mazeAttempts.mostRecentAttempt)

    // the most recent maze attempt made by the user
    const currentAnimatedAttempt = useSelector(state => state.mazeAttempts.currentAnimatedAttempt)

    // the code currently typed by the user
    const [userCode, setUserCode] = useState('');

    // determines whether to show the best, most recent,
    // or current attempt to the user (0 = best, 1 = recent, 2 = current)
    const [currentTab, setCurrentTab] = useState(2);

    // boolean to determine if current tab can be changed
    const [allowAttemptChange, setAllowAttemptChange] = useState(false);

    // tracks if this is the first load of this page
    const [firstHistoryLoad, setFirstHistoryLoad] = useState(true)

    /**
     * On page load, retrieve the best and most recent attempt from the database.
     */
    useEffect(() => {
        dispatch(getMostRecentAttempt(currentMazeId))
        dispatch(getBestAttempt(currentMazeId))
    }, [])

    /**
     * This method will run any time the best attempt for this maze
     * has changed. The method will only execute the FIRST time a best maze
     * attempt has been loaded from the database.
     */
    useEffect(() => {
        if (bestAttempt !== null && firstHistoryLoad) {
            displayBestAttempt()
            setAllowAttemptChange(true)
            setFirstHistoryLoad(false)
        }
    }, [bestAttempt])

    /**
     * This method calls the desired method to display either the best attempt or 
     * most recent.
     */
    const handleToggleSwitchForPastAttempts = (event, newValue) => {
        if (newValue === 0) {
            displayBestAttempt()
        } else if (newValue === 1) {
            displayMostRecentAttempt()
        } else {
            dispatch(setCurrentAnimatedAttempt(null))
            setCurrentTab(2)
        }
    }

    /**
     * Updates the userCode local state whenever a user types in
     * the coding text field.
     */
    const handleUserCodeChange = (event) => {
        if (currentTab !== 2) {
            setCurrentTab(2)
        }
        dispatch(setCurrentAnimatedAttempt(null))
        setUserCode(event.target.value)
    }
    /**
     * Calls the api to create a new maze attempt.
     */
    const handleSubmit = () => {
        dispatch(createMazeAttempt(userCode, currentMazeId))
    }
    /**
     * Calls the api to create a new maze attempt.
     */
    const handleTest = () => {
        dispatch(testMazeAttempt(userCode, currentMazeId))
    }

    /**
     * Displays the user's best attempt code and movement list.
     */
    const displayBestAttempt = () => {
        setCurrentTab(0)
        dispatch(setCurrentAnimatedAttempt({ ...bestAttempt }))
        setUserCode(bestAttempt.javaText)
    }
    /**
     * Displays the user's most recent attempt code and movement list.
     */
    const displayMostRecentAttempt = () => {
        setCurrentTab(1)
        dispatch(setCurrentAnimatedAttempt({ ...mostRecentAttempt }))
        setUserCode(mostRecentAttempt.javaText)
    }

    return (
        <>
            <MenuBar />
            <div className='robot-and-message'>
                <Tooltip
                    title={<Tips />}
                    placement='right-start'
                >
                    <img src={robot} alt='Robot Mascot' style={{ width: '100px' }}></img>
                </Tooltip>
                <div className='message'
                >
                    <RobotMessageDisplay />
                </div>
            </div>
            <div className='fields-and-animation-container'>
                <div className='fields-and-animation'>
                    {/* Tabs for rotating between the current, best, and most recent code */}
                    <Box className='code-tabs'>
                        <Tabs
                            value={currentTab}
                            onChange={handleToggleSwitchForPastAttempts}
                        >
                            <Tab
                                label="Best Code"
                                disabled={!allowAttemptChange || bestAttempt === null}
                            />
                            <Tab
                                label="Most Recent Code"
                                disabled={!allowAttemptChange || mostRecentAttempt === null}
                            />
                            <Tab
                                label="Current Code"
                                disabled={!allowAttemptChange}
                            />
                        </Tabs>
                    </Box>
                    {/* Copy to Clipboard Button */}
                    <Tooltip title="Copy Code to Clipboard">
                        <div className='copy-button'>
                            <IconButton
                                onClick={() => {
                                    window.navigator.clipboard.writeText(userCode);
                                    dispatch(showSuccess("Code copied to clipboard."))
                                }}
                                aria-label="copy">
                                <ContentCopyIcon />
                            </IconButton>
                        </div>
                    </Tooltip>
                    {/* Code Input Box */}
                    <TextField
                        className='code-field'
                        label="Your Code Here"
                        placeholder={SAMPLE_CODE}
                        multiline
                        rows={14}
                        variant="filled"
                        value={userCode}
                        onChange={handleUserCodeChange}
                    />
                    {/* Box for displaying the current animation */}
                    <MazeAnimation widthInPixels={350} />
                </div>
                {/* Buttons for compiling and saving the current code */}
                <div style={{ width: '600px' }}>
                    <Button
                        variant="outlined"
                        onClick={handleTest}
                        disabled={currentAnimatedAttempt !== null}
                    >Compile</Button>
                    <Button
                        style={{ right: "-72%" }}
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        disabled={currentAnimatedAttempt !== null && currentAnimatedAttempt.id !== null}
                    >Save</Button>
                </div>
            </div>
            <Messenger />
        </>
    );
}

export default UserAttemptMaze;