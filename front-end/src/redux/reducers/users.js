
const initialstate = {
    user: {},
}

const users = (state = initialstate, action) => {
    switch (action.type) {
        case "GET_CURRENT_USER":
            return Object.assign({}, state, {
                user: action.data
            })
        default:
            return state
    }
}

export default users