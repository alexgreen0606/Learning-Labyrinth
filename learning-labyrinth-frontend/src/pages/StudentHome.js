import React, { useEffect, useState } from 'react';
import { Pagination, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getMazes, clearCurrMaze, setCurrMaze, changeCurrPage, getPopularMazes } from '../store/mazes'
import { useNavigate } from 'react-router-dom';
import { hideError } from '../store/error'
import { hideSuccess } from '../store/success'
import MenuBar from '../components/MenuBar';
import MazeRow from '../components/MazeRow';
import { clearMazeAttempts } from '../store/mazeAttempts';
import Divider from '@mui/material/Divider';
import { v4 as uuidv4 } from 'uuid';
import '../styles/studentHome.css'

const StudentHome = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // list of all mazes from the database
    const mazes = useSelector(state => state.mazes.mazes);

    // list of all 3 most popular mazes from the database
    const popularMazes = useSelector(state => state.mazes.popularMazes);

    // the id of the currently selected maze
    const currentMazeId = useSelector(state => state.mazes.currentMazeId)

    // the current page being viewed by the user
    const currentPage = useSelector(state => state.mazes.currentPage)

    // the total count of pages of mazes
    const [pageCount, setPageCount] = useState(0);

    // the list of mazes shown in the top row
    const [visibleMazesTopRow, setVisibleMazesTop] = useState([]);

    // the list of mazes shown in the bottom row
    const [visibleMazesBottomRow, setVisibleMazesBottom] = useState([]);

    // the list of 3 mazes displayed in the side bar
    const [visiblePopularMazes, setVisiblePopularMazes] = useState([]);

    // keeps track of whether this is the first load of this component on the DOM
    const [firstPageLoad, setFirstPageLoad] = useState(true)

    // the total amount of mazes to be displayed on this page
    const MAZES_PER_PAGE = 6;

    /**
     * On page load, clear the global states from /attemptMaze and
     * get all mazes from the database.
     */
    useEffect(() => {
        dispatch(hideError());
        dispatch(hideSuccess());
        dispatch(clearCurrMaze());
        dispatch(clearMazeAttempts());
        dispatch(getPopularMazes());
        dispatch(getMazes());
    }, [])

    /**
     * This method runs whenever the current maze is set.
     * If the current maze id is set, navigate to the attempt page to begin the 
     * maze attempt.
     * If the current maze id is set, navigate to the attempt page to begin the 
     * maze attempt.
     */
    useEffect(() => {
        if (firstPageLoad) {
            setFirstPageLoad(false)
            return;
        }
        if (currentMazeId) {
            navigate('/attemptMaze')
        }
    }, [currentMazeId])

    /**
    * This method runs whenever the current page or the mazes are modified.
    * The method updates the page count for the paginator and sets the array of
    * mazes to be displayed to the user.
    */
    useEffect(() => {
        if (mazes) {
            // if the current page is no longer present (due to maze delete), jump to last page in paginator
            const pageCount = Math.ceil(mazes.length / MAZES_PER_PAGE)
            // if the current page is no longer present (due to maze delete), jump to last page in paginator
            if (currentPage > pageCount) {
                dispatch(changeCurrPage(pageCount))
            }
            setPageCount(pageCount);
            // the start index of visible mazes based on page being viewed
            const startIndex = (currentPage - 1) * MAZES_PER_PAGE;
            setVisiblePopularMazes(popularMazes);
            setVisibleMazesTop(mazes.slice(startIndex, startIndex + MAZES_PER_PAGE / 2));
            setVisibleMazesBottom(mazes.slice(startIndex + MAZES_PER_PAGE / 2, startIndex + MAZES_PER_PAGE));
        }
    }, [mazes, currentPage, popularMazes])

    /**
     * Sets the current page to the value selected in the paginator.
     * 
     * @param {*} event 
     * @param {*} value - the value selected in the paginator
     */
    const handlePageChange = (event, value) => {
        dispatch(changeCurrPage(value))
    }

    /**
     * Sets the global state of the current maze to the selected maze.
     * 
     * @param {*} mazeId - the id of the selected maze
     * @param {*} layout - the layout array of the selected maze
     */
    const handleMazeClick = (mazeId, layout) => {
        dispatch(setCurrMaze(mazeId, layout))
    }

    return (
        <>
            <MenuBar></MenuBar>
            <div className='homepage'
            >
                <div className='popular-mazes-and-catalog'>
                    <div className='popular-mazes'>
                        <Typography
                            variant="h5"
                            component="div"
                            fontFamily='Copperplate'
                            className='popular-label'
                        >POPULAR</Typography>
                        <MazeRow
                            key={uuidv4()}
                            mazeList={visiblePopularMazes}
                            onMazeClick={handleMazeClick}
                        ></MazeRow>
                    </div>
                    <Divider
                        orientation='vertical'
                        variant="middle"
                        className='divider'
                    ></Divider>
                    <div className='maze-rows'>
                        <Typography
                            variant="h4"
                            component="div"
                            fontFamily='Copperplate'
                            className='catalog-label'
                        >MAZE CATALOG</Typography>
                        <div className='maze-top-row'>
                            <MazeRow
                                key={uuidv4()}
                                mazeList={visibleMazesTopRow}
                                onMazeClick={handleMazeClick}
                            ></MazeRow>
                        </div>
                        <div className='maze-bottom-row'>
                            <MazeRow
                                key={uuidv4()}
                                mazeList={visibleMazesBottomRow}
                                onMazeClick={handleMazeClick}
                            ></MazeRow>
                        </div>
                        <div className='paginator'>
                            <Pagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentHome;