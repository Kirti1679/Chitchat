const User = require('../models/user');

function catchedError(controller, err, res) {
    console.log(`error occured ${controller} controller: ${err}`);
    return res.status(404).json({
        type: 'error',
        text: 'Some error occured'
    });
}

function friendNotFound(controller, res) {
    console.log(`In ${controller} controller, friendid is null`);
    return res.status(200).json({
        type: 'error',
        text: 'User is not in our database'
    })
}

function successMessage(message, res, data) {
    return res.status(200).json({
        type: 'success',
        text: message,
        data: data
    });
}

function failureMessage(message, res) {
    return res.status(200).json({
        type: 'error',
        text: message
    });
}

module.exports.addfriend = async (req, res) => {
    try {
        let friendid = req.body.userid;

        if(!friendid) {
            friendNotFound("addFriend", res);
            return;
        }

        let friend = await User.findById(friendid);
        let thisuser = await User.findById(req.user.id);

        if(thisuser.sentRequests.find(request => request.userid == friendid)) {
            console.log('Request already sent')
            return res.status(200).json({
                type: 'error',
                text: 'Request already sent'
            });
        }

        if(thisuser.friendsList.find(friend => friend.userid == friendid)) {
            console.log('User is already a friend')
            return res.status(200).json({
                type: 'error',
                text: 'User is already a friend'
            })
        }

        await thisuser.sentRequests.push({userid: friendid});
        await friend.pendingRequests.push({userid: req.user.id});
        await thisuser.save();
        await friend.save();

        // console.log('thisuser (/addfriend): ', thisuser);
        // console.log('friend (/addfriend): ', friend);
        successMessage('Friend request sent!', res, friend);
    } catch(err) {
        catchedError("addFriend", err, res);
    }
}

module.exports.withdrawRequest = async (req, res) => {

    try {
        let friendid = req.query.userid;

        if(!friendid) {
            friendNotFound("withDrawRequest", res);
            return;
        }

        let friend = await User.findById(friendid);
        let thisuser = await User.findById(req.user.id);

        if(thisuser.sentRequests.find(request => request.userid == friendid)) {
            thisuser.sentRequests = await thisuser.sentRequests.filter(request => request.userid != friendid);
            friend.pendingRequests = await friend.pendingRequests.filter(request => request.userid != req.user.id);

            await thisuser.save();
            await friend.save();
            
            // console.log('thisuser (/withdrawrequest): ', thisuser);
            // console.log('friend (/withdrawrequest): ', friend);
            successMessage('Friend request withdrawn', res, friend);
        } else {
            failureMessage('No request sent to user', res);
        }

    } catch(err) {
        catchedError("withdrawRequest", err, res);
    }
}

module.exports.removeFriend = async (req, res) => {
    try {
        let friendid = req.query.userid;

        if(!friendid) {
            friendNotFound("removeFriend", res);
            return;
        }

        let friend = await User.findById(friendid);
        let thisuser = await User.findById(req.user.id);

        if(thisuser.friendsList.find(friend => friend.userid == friendid)) {
            thisuser.friendsList = await thisuser.friendsList.filter(friend => friend.userid != friendid);
            friend.friendsList = await friend.friendsList.filter(friend => friend.userid != req.user.id);

            await thisuser.save();
            await friend.save();

            successMessage('User successfully unfriended', res, friend);
        } else {
            failureMessage('User not found in your friend list', res);
        }

    } catch(err) {  
        catchedError("removeFriend", err, res);
    }
}

module.exports.acceptRequest = async (req, res) => {
    try {
        let friendid = req.query.userid;

        if(!friendid) {
            friendNotFound("acceptRequest", res);
            return;
        }

        let friend = await User.findById(friendid);
        let thisuser = await User.findById(req.user.id);

        await User.findOneAndUpdate({_id: friendid}, {
            $pull: {
                "sentRequests": {
                    "userid": req.user.id
                }
            }
        })

        await User.findOneAndUpdate({_id: req.user.id}, {
            $pull: {
                "pendingRequests": {
                    "userid": friendid
                }
            }
        })

        await friend.friendsList.push({userid: req.user.id});
        await thisuser.friendsList.push({userid: friendid});
        await friend.save();
        await thisuser.save();

        successMessage('User added to friends', res, friend);
    } catch(err) {
        catchedError("acceptRequest", err, res);
    }
}

module.exports.declineRequest = async (req, res) => {
    try {
        let friendid = req.query.userid;

        if(!friendid) {
            friendNotFound("declineRequest", res);
            return;
        }

        let friend = await User.findById(friendid);
        let thisuser = await User.findById(req.user.id);

        await User.findOneAndUpdate({_id: friendid}, {
            $pull: {
                "sentRequests": {
                    "userid": req.user.id
                }
            }
        })

        await User.findOneAndUpdate({_id: req.user.id}, {
            $pull: {
                "pendingRequests": {
                    "userid": friendid
                }
            }
        })

        await friend.save();
        await thisuser.save();

        successMessage('Friend request declined', res, friend);
    } catch(err) {
        catchedError("declineRequest", err, res);
    }
}

module.exports.sendFriends = async (req, res) => {
    try {

        let user = await User.findOne({_id: req.user.id})
        .populate({
            path: 'sentRequests.userid'
        })
        .populate({
            path: 'pendingRequests.userid'
        })
        .populate({
            path: 'friendsList.userid'
        });

        let friendList = user.friendsList;
        let pendingRequests = user.pendingRequests;
        let sentRequests = user.sentRequests;

        // console.log('friendList: ', friendList);
        // console.log('pendingRequests: ', pendingRequests);
        // console.log('sentRequests: ', sentRequests);

        return res.render('friends', {
            title: 'Friends Section',
            sentRequests: sentRequests,
            pendingRequests: pendingRequests,
            friendList: friendList
        })

    } catch(err) {
        console.log('Error (sendFriends controller): ', err);
        return;
    }
}