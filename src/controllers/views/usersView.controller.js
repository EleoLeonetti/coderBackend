const { userModel } = require("../../daos/Mongo/models/users.model")

class UsersViewController {
    constructor(){
        this.model = userModel
    }

    upload = async (req, res) => {
        const uid = req.params.uid
        res.render('uploadDocuments', { uid: uid })
    }

    handleRole = async (req, res) => {
        try {
            const { uid } = req.params
            const { status } = req.body
            
            const { first_name, 
                    last_name ,
                    email, 
                    birthdate,
                    cart,
                    role,
                    documents,
                    last_connection, 
                    userStatus
                } = await this.model.findOne({_id: uid})
            
        
            res.render('handleRole', { first_name, last_name, email, birthdate, cart, role, documents, last_connection, userStatus, uid })
        } catch (error) {
            res.status(500).send({status: 'error', message: error.message})
        }
    }
    
}

module.exports = UsersViewController