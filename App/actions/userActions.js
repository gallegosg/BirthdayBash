export function saveUser(snap) {
    return({
        type: 'SAVE_USER',
        bday: snap.birthday,
        uid: snap.uid,
        avatar: snap.avatar,
        name: snap.name
    })
  }

  export function removeUser() {
    return({
        type: 'REMOVE_USER',
    })
  }

  export function newAvatar(uri) {
      return ({
          type: 'NEW_AVATAR',
          avatar: uri
      })
  }

  export const updateName = (name) => {
    return ({
        type: 'UPDATE_NAME',
        name,
    })
  }

  export const updateEmail = (email) => {
    return ({
        type: 'UPDATE_EMAIL',
        email,
    })
  }