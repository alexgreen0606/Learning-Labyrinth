import { createSlice } from '@reduxjs/toolkit'
import { MAZE_BASE_URL } from './baseUrls';
import axios from 'axios';
import { showSuccess } from './success'
import { showError } from './error'

// Create the maze attempt object to be maintained in the redux store
const slice = createSlice({
    name: 'mazes',
    initialState: {
        mazes: null,
        popularMazes: null,
        currentMazeId: null,
        currentMazeLayout: JSON.parse(JSON.stringify([[0,0],[0,0]])),
        currentPage: 1
    },
    reducers: {
        updateMazes: (state, action) => {
            state.mazes = [...action.payload];
        },
        updatePopularMazes: (state, action) => {
            state.popularMazes = [...action.payload];
        },
        updateCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },
        emptyMazes: (state) => {
            state.mazes = null;
        },
        updateCurrentMaze: (state, action) => {
            state.currentMazeId = action.payload.currentMazeId
            state.currentMazeLayout = action.payload.currentMazeLayout
        },
        emptyCurrMaze: (state) => {
            state.currentMazeId = null;
            state.currentMazeLayout = JSON.parse(JSON.stringify([[0,0],[0,0]]));
        }
    },
});
export default slice.reducer

// create the client to interact with the API
const client = axios.create({
    baseURL: MAZE_BASE_URL
});

// Converts a string of ints to an int array
const stringToArray = (string) => {
    const array = [];
    const size = Math.sqrt(string.length);
    for (let x = 0; x < size; x++) {
        let xArray = [];
        for (let y = 0; y < size; y++) {
            xArray.push(parseInt(string.charAt((x*size)+y)));
        }
        array.push([...xArray]);
    }
    return [...array];

}

// Converts an array of ints to a string
const arrayToString = (array) => {
    let string = '';
    for (let x = 0; x < array.length; x++) {
        for (let y = 0; y < array.length; y++) {
            string += array[x][y].toString()
        }
    }
    return string;
}

const { updateMazes, emptyMazes, emptyCurrMaze, updateCurrentMaze, updateCurrentPage, updatePopularMazes } = slice.actions

/**
 * Retrieves all the mazes from the database.
 */
export const getMazes = () => async dispatch => {
    const token = localStorage.getItem('token');
    client.get(`/getMazes?token=${token}`)
        .then((response) => {
            const mazeList = [];
            for (let i = 0; i < response.data.length; i++) {
                let currMaze = response.data[i];
                currMaze.layout = stringToArray(currMaze.layout)
                mazeList.push({...currMaze});
            }
            dispatch(updateMazes([...mazeList]));
        })
        .catch((error) => {
            console.log(error)
        })
}

/**
 * Retrieves the 3 most popular mazes from the database.
 */
export const getPopularMazes = () => async dispatch => {
    client.get(`/getPopularMazes`)
        .then((response) => {
            const mazeList = [];
            for (let i = 0; i < response.data.length; i++) {
                let currMaze = response.data[i];
                currMaze.layout = stringToArray(currMaze.layout)
                mazeList.push({...currMaze});
            }
            dispatch(updatePopularMazes([...mazeList]));
        })
        .catch((error) => {
            console.log(error)
        })
}

/**
 * Creates a new maze given the layout array.
 */
export const createMaze = (layoutArray) => async dispatch => {
    const token = localStorage.getItem('token');
    const arrayString = arrayToString(layoutArray);
    client.post(
        `/createMaze?` +
        `size=${layoutArray.length}` +
        `&layout=${arrayString}` +
        `&creatorToken=${token}`
        )
        .then((response) => {
            dispatch(updateCurrentMaze({
                currentMazeId: response.data.id, 
                currentMazeLayout: layoutArray
            }));
            dispatch(showSuccess("Maze saved successfully."))
        })
        .catch(() => {
            dispatch(showError("Error saving maze."))
        })
}

/**
 * Updates the given maze by id to the given layout array.
 */
export const updateMaze = (layoutArray, mazeId) => async dispatch => {
    const token = localStorage.getItem('token');
    const arrayString = arrayToString(layoutArray);
    client.put(
        `/updateMaze?` +
        `id=${mazeId}` +
        `&size=${layoutArray.length}` +
        `&layout=${arrayString}` +
        `&creatorToken=${token}`
        )
        .then(() => {
            dispatch(updateCurrentMaze({currentMazeId: mazeId, currentMazeLayout: layoutArray}));
            dispatch(showSuccess("Maze saved successfully."))
        })
        .catch(() => {
            dispatch(showError("Error saving maze."))
        })
}

/**
 * Removes the given maze from the database by its id.
 */
export const deleteMaze = (mazeId) => async dispatch => {
    const token = localStorage.getItem('token');
    client.delete(
        `/delete?` +
        `id=${mazeId}&` +
        `creatorToken=${token}`
        )
        .then(() => {
            dispatch(emptyCurrMaze())
        })
        .catch(() => {
            dispatch(showError("Error deleting maze."))
        })
}

/**
 * Sets the current maze being viewed by the user.
 */
export const setCurrMaze = (mazeId, layout) => dispatch => {
    dispatch(updateCurrentMaze({currentMazeId: mazeId, currentMazeLayout: layout}));
}

/**
 * Changes the page of mazes being viewed by the user in the paginator.
 */
export const changeCurrPage = (newPage) => dispatch => {
    dispatch(updateCurrentPage(newPage))
}

/**
 * Clears the maze object in the store (when logging out).
 */
export const clearMazes = () => dispatch => {
    dispatch(emptyMazes());
}

/**
 * Clears the current maze being viewed (when returning to homepage).
 */
export const clearCurrMaze = () => dispatch => {
    dispatch(emptyCurrMaze());
}