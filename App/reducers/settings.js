const initialState = {
    bubbleColor: '#48b1bf',
}

export default function settings(state = initialState, action) {
		switch(action.type) {
            case 'SAVE_BUBBLE_COLOR':
                return {
                    ...state,
                    bubbleColor: action.color
                }
            default:
                return state
        }
}