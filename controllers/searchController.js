const User = require('../models/user');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

module.exports.search = async (req, res) => {
    if(req.user) {
        try {
            let foundusers = await User.fuzzySearch(req.query.searcheduser, {username: {$ne: req.user.username}});
            let thisuser = await User.findById({_id: req.user.id});
            return res.render('foundusers', {
                foundusers: foundusers,
                thisuser: thisuser,
                title: "Users"
            });
        } catch(err) {
            console.log('Some error occured in /search: ', err);
            return;
        }
    } else {
        console.log('Req.user is not defined in /search');
        return;
    }
}
