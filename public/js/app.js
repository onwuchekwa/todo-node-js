$(document).ready(function(){
    $('#addTask').on('submit', function() {
        window.location.reload();
    });
});

const toggleTaskStatus = (event, id) => {
    const{name} = event.target;

    fetch('/users/dashboard', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            id
        })
    }).then(response => response.json()).then(status => {
        console.log(status);
        window.location.reload();
    }).catch(err => console.log(err))
}

const deleteTask = (id) => {
    fetch('/users/dashboard', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id
        })
    })
    .then(response => response.json()).then(status => {
        console.log(status);
        window.location.reload();
    }).catch(err => console.log(err))
}