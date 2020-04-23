const baseApiUrl = 'https://copsbot-api.herokuapp.com/api'
const localStorageKey = 'odgGN3sp9mCp9p8cegn'

const getUser = () => {
    const user = JSON.parse(localStorage.getItem(localStorageKey))
    if (user)
        return user
    else
        location = '/login.html'
}

const setUser = (_id, username, region, role, token) => {
    const user = {
        _id,
        username,
        region,
        role,
        token
    }
    localStorage.setItem(localStorageKey, JSON.stringify(user))
}

const removeUser = () => {
    localStorage.removeItem(localStorageKey)
}

const checkUserAdmin = () => {
    const user = getUser()
    if (user.role !== 'admin')
        location = '/login.html'
}

const checkUserSuperAdmin = () => {
    const user = getUser()
    if (user.role !== 'superadmin')
        location = '/login.html'
}

const logout = () => {
    removeUser()
    location = '/login.html'
}