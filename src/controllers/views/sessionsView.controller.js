class SessionsViewController {
    constructor(){
    }

    register = async (req, res) => {
        res.render('register')
    }

    login = async (req, res) => {
        res.render('login')
    }
    
}

module.exports = SessionsViewController
