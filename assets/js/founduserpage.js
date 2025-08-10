var addFriendButtons = document.querySelectorAll('.add-friend-button');
var withdrawRequestButtons = document.querySelectorAll('.withdraw-request-button');
var removeFriendButtons = document.querySelectorAll('.remove-friend-button');
var acceptFriendButtons = document.querySelectorAll('.accept-friend-button');
var declineFriendButtons = document.querySelectorAll('.decline-friend-button');
var acceptedFriendsList = document.querySelectorAll('.accepted-friends-list');

var friendItemDiv = async (userdata, id) => {
    let newdiv = document.createElement('div');
    newdiv.setAttribute("id", `friend-${userdata.data.id}`);
    newdiv.setAttribute("class", "found-user font-koho in-friends-list");

    newdiv.innerHTML += (
        `
        <div class="found-user-img">
            <img src="${userdata.data.avatar}" alt="User Image"> &nbsp; &nbsp;
            <span class="found-user-name"><a href="/profile/${userdata.data.id}">${userdata.data.username}</a></span>
        </div>
        `
    );

    let innerdiv = document.createElement('div');
    innerdiv.setAttribute('class', "request-buttons");
    
    let span = document.createElement('span');
    span.setAttribute('class', "request-button-icon remove-friend-button");
    span.setAttribute('data-thisusersid', `${userdata.data._id}`);
    span.innerHTML = "Remove Friend";

    // console.log('span: ', span);
    span.addEventListener('click', handleRemoveFriend);
    innerdiv.appendChild(span);
    newdiv.appendChild(innerdiv);

    return newdiv;
};

var addFriendButtonDiv = (userdata) => {
    let span = document.createElement('span');
    span.setAttribute('class', "request-button-icon add-friend-button");
    span.setAttribute('data-thisusersid', `${userdata.data._id}`)
    span.innerHTML += "Add Friend";
    span.addEventListener('click', handleAddFriend);
    return span;
};

var removeFriendButtonDiv = (userdata) => {
    let span = document.createElement('span');
    span.setAttribute('class', "request-button-icon remove-friend-button");
    span.setAttribute('data-thisusersid', `${userdata.data._id}`)
    span.innerHTML += "Remove Friend";
    span.addEventListener('click', handleRemoveFriend);
    return span;
};

var withdrawRequestButtonDiv = (userdata) => {
    let span = document.createElement('span');
    span.setAttribute('class', "request-button-icon withdraw-request-button");
    span.setAttribute('data-thisusersid', `${userdata.data._id}`)
    span.innerHTML += "Withdraw";
    span.addEventListener('click', handleWithdrawRequest);
    return span;
};

var acceptRequestButtonDiv = (userdata) => {
    let span = document.createElement('span');
    span.setAttribute('class', "request-button-icon accept-friend-button");
    span.setAttribute('data-thisusersid', `${userdata.data._id}`)
    span.innerHTML += "Accept";
    span.addEventListener('click', handleAcceptRequest);
    return span;
};

var declineRequestButtonDiv = (userdata) => {
    let span = document.createElement('span');
    span.setAttribute('class', "request-button-icon decline-friend-button");
    span.setAttribute('data-thisusersid', `${userdata.data._id}`)
    span.innerHTML += "Decline";
    span.addEventListener('click', handleDeclineRequest);
    return span;
};

function notycallerror(data) {
    new Noty({
        theme: 'sunset',
        text: data,
        type: 'error',
        layout: 'bottomRight',
        timeout: 1500
    }).show();
}

function notycallsuccess(data) {
    new Noty({
        theme: 'sunset',
        text: data,
        type: 'success',
        layout: 'bottomRight',
        timeout: 1500
    }).show();
}

function handleAddFriend() {
    axios.post('/addfriend', {
        userid: this.dataset.thisusersid
    })
    .then(async (data) => {
        // console.log(data);
        if(data.data.type == 'error') {
            notycallerror(data.data.text);
        } else {
            notycallsuccess(data.data.text);
            
            let newButton = await withdrawRequestButtonDiv(data.data);
            let parentNode = this.parentNode;
            while(parentNode.firstChild)
                parentNode.removeChild(parentNode.lastChild);

            parentNode.prepend(newButton);
        }
        return;
    })
    .catch(err => {
        console.log('Error in founduserpage > handleaddfriend:', err);
        return;
    })
}

function handleRemoveFriend() {
    axios.get('/removefriend', {
        params: {
            userid: this.dataset.thisusersid
        }
    })
    .then(async (data) => {
        if(data.data.type == 'error') {
            notycallerror(data.data.text);
        } else {
            notycallsuccess(data.data.text);

            if(this.parentNode.parentNode.id) {
                let mainparentNode = this.parentNode.parentNode;
                let parentofmainparent = mainparentNode.parentNode;
                mainparentNode.remove();
                if(parentofmainparent.childElementCount == 0) {
                    parentofmainparent.innerHTML = "<div class=\"none-in-list\">No friends to show here.</div>";
                }
            } else {
                let newButton = await addFriendButtonDiv(data.data);
                let parentNode = this.parentNode;
                while(parentNode.firstChild)
                    parentNode.removeChild(parentNode.lastChild);

                parentNode.prepend(newButton);
            }
        }
        return;
    })
    .catch(err => {
        console.log('Error in founduserpage > handleRemoveFriend:', err);
        return;
    })
}

function handleWithdrawRequest() {
    axios.get('/withdrawrequest', {
        params: {
            userid: this.dataset.thisusersid
        }
    })
    .then(async (data) => {
        if(data.data.type == 'error') {
            notycallerror(data.data.text);
        } else {
            notycallsuccess(data.data.text);

            if(this.parentNode.parentNode.id) {
                let mainparentNode = this.parentNode.parentNode;
                let parentofmainparent = mainparentNode.parentNode;
                mainparentNode.remove();
                if(parentofmainparent.childElementCount == 0) {
                    parentofmainparent.innerHTML += "<div class=\"none-in-list\">No request sent.</div>";
                }
            } else {
                let newButton = await addFriendButtonDiv(data.data);
                let parentNode = this.parentNode;
                while(parentNode.firstChild)
                    parentNode.removeChild(parentNode.lastChild);

                parentNode.prepend(newButton);
            }
        }
        return;
    })
    .catch(err => {
        console.log('Error in founduserpage > handleWithdrawRequest:', err);
        return;
    })
}

function handleAcceptRequest() {
    axios.get('/acceptRequest', {
        params: {
            userid: this.dataset.thisusersid
        }
    })
    .then(async (data) => {
        if(data.data.type == 'error') {
            notycallerror(data.data.text);
        } else {
            notycallsuccess(data.data.text);

            if(this.parentNode.parentNode.id) {
                let mainparentNode = this.parentNode.parentNode;
                let parentofmainparent = mainparentNode.parentNode;
                await mainparentNode.remove();

                if(parentofmainparent.childElementCount == 0)
                    parentofmainparent.innerHTML = "<div class=\"none-in-list\">No request pending.</div>";

                let maxx = 0;
                await Array.from(acceptedFriendsList[0].getElementsByTagName('div')).forEach(div => {
                    let idval = parseInt(div.id.split('-')[1]);
                    if(idval > maxx)
                        maxx = idval
                })
                
                let newDiv = await friendItemDiv(data.data, maxx+1);
                let currFirstDiv = acceptedFriendsList[0].firstElementChild;
                if(currFirstDiv.className == "none-in-list") {
                    acceptedFriendsList[0].removeChild(acceptedFriendsList[0].firstElementChild);
                }

                await acceptedFriendsList[0].appendChild(newDiv);
            } else {
                let newButton = await removeFriendButtonDiv(data.data);
                let parentNode = this.parentNode;
                while(parentNode.firstChild)
                    parentNode.removeChild(parentNode.lastChild);

                parentNode.prepend(newButton);
            }
        }
    })
    .catch(err => {
        console.log('Error in founduserpage > handleAcceptRequest: ', err);
        return;
    })
}

function handleDeclineRequest() {
    axios.get('/declineRequest', {
        params: {
            userid: this.dataset.thisusersid
        }
    })
    .then(async (data) => {
        if(data.data.type == 'error') {
            notycallerror(data.data.text);
        } else {
            notycallsuccess(data.data.text);

            if(this.parentNode.parentNode.id) {
                let mainparentNode = this.parentNode.parentNode;
                let parentofmainparent = mainparentNode.parentNode;
                await mainparentNode.remove();

                if(parentofmainparent.childElementCount == 0)
                    parentofmainparent.innerHTML = "<div class=\"none-in-list\">No request pending.</div>";

            } else {
                let newButton = await addFriendButtonDiv(data.data);
                let parentNode = this.parentNode;
                while(parentNode.firstChild)
                    parentNode.removeChild(parentNode.lastChild);

                parentNode.prepend(newButton);
            }
        }
    })
    .catch(err => {
        console.log('Error in founduserpage > handleDeclineRequest: ', err);
        return;
    })
}

Array.from(addFriendButtons).forEach(
    addFriendButton => addFriendButton.addEventListener('click', handleAddFriend)
)

Array.from(removeFriendButtons).forEach(
    removeFriendButton => removeFriendButton.addEventListener('click', handleRemoveFriend)
)

Array.from(withdrawRequestButtons).forEach(
    withdrawButton => withdrawButton.addEventListener('click', handleWithdrawRequest)
)

Array.from(acceptFriendButtons).forEach(
    acceptFriendButton => acceptFriendButton.addEventListener('click', handleAcceptRequest)
)

Array.from(declineFriendButtons).forEach(
    declineFriendButton => declineFriendButton.addEventListener('click', handleDeclineRequest)
)

