module.exports.home = (req, res) => {
    res.render('home', {
        title: 'ChitChat'
    });
}

module.exports.signupPage = (req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect('/profile/' + req.user._id);
    }

    res.render('signup', {
        title: 'SignUp | ChitChat'
    });
}

module.exports.signinPage = (req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect('/profile/' + req.user._id);
    }

    res.render('signin', {
        title: 'Sign In | ChitChat'
    });
}