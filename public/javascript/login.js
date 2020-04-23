removeUser()

$('#loginForm').submit(async e => {
    e.preventDefault()
    const data = {}
    $(document.querySelector('#loginForm').elements).serializeArray().map(item => {
        if (item.name) {
            data[item.name] = item.value
        }
    })
    const result = await fetch(`${baseApiUrl}/dashboard/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const json = await result.json()
    if (json.status !== 200)
        alert(json.message)
    else {
        setUser(json.user._id, json.user.username, json.user.region, json.user.role, json.token)
        if (json.user.role === 'superadmin')
            location = '/superadmin.html'
        else
            location = '/admin.html'
    }
})