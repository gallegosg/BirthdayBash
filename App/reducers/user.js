const initialState = {
}

export default function user(state = initialState, action) {
		switch(action.type) {
            case 'SAVE_USER':
                return action
            case 'REMOVE_USER':
                return action
            case 'NEW_AVATAR':
                return {
                    ...state,
                    avatar: action.avatar
                }
            case 'UPDATE_NAME':
                return {
                    ...state,
                    name: action.name
                }
            case 'UPDATE_EMAIL':
                return {
                    ...state,
                    email: action.email
                }
			default: 
				return state;
		}
}