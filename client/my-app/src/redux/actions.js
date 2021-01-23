export const UPDATE_USER = 'UPDATE_USER';

export const updateUser = data =>{
    return {
        type: UPDATE_USER,
        user: data.user,
    }
}

