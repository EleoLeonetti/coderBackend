const passport        = require('passport')
const { userService } = require("../repositories")
const { createHash }  = require("../utils/hashPassword")


class UserController {
    constructor(){
        this.service = userService
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.service.getUsers({ }, {limit: 5, page: 1})
            if (!users) {
                return res.send({ message: 'No users found' });
            }
    
            const result = users.docs.map(({ _id, first_name, last_name, email, birthdate, cart, role, documents, last_connection, status }) => ({
                _id,
                first_name,
                last_name,
                email,
                birthdate,
                cart,
                role,
                documents,
                last_connection,
                status
            }))
    
            res.send({ status: 'success', payload: { ...users, docs: result } })

        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }

    getUser = async (req, res) => { 
        const { uid } = req.params

        try{
            const user = await this.service.getUser({_id: uid})
            if(!user){
                return res.send({status: 'error', message: "User not found"})   
            }
            res.send({status: 'success', payload: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                birthdate: user.birthdate,
                cart: user.cart,
                role: user.role,
                documents: user.documents,
                last_connection: user.last_connection,
                userStatus: user.userStatus
            }})
                
        }catch(error){
                res.status(500).send({status: 'error', message: error.message})
        }
     }

    createUser = async (req, res) => {
        const { first_name, last_name, birthdate, email, role, password, cart, documents, last_connection } = req.body
        try {
            if(first_name === '' || last_name === ''  || email === '' || password === '' || birthdate === ''){
                return res.send({status: 'error', message: "All fields are required"})
            }
            const user = await this.service.getUser({email})
            if(user) {
                return res.send({status: 'error', message: 'Email already register'})
            }

            const newUser = {
                first_name,
                last_name,
                email,
                birthdate,
                password: createHash(password),
                cart,
                role,
                documents,
                last_connection
            }
        
            if(newUser.email === 'adminCoder@coder.com'){
                newUser.role = 'ADMIN'
            }

            let result = await this.service.createUser(newUser)
            res.send({status:'User created', payload: result})

        } catch (error) {
            res.send({status: 'error', message: error.message})
        }
    }

    updateUser = async (req, res) => {
        try {
            const { uid } = req.params
            const userToUpdate = req.body
            const result = await this.service.updateUser(uid, userToUpdate)

            if(!result){
                return res.send({status: 'error', message: 'User not found'})
            }
            res.send({status: 'success', payload: result})

        } catch (error) {
            res.status(500).send({status: 'error', message: error.message})
        }
    }

    deleteUser = async (req, res) => {
        const { uid } = req.params
        try {
            const result = await this.service.deleteUser(uid)
            if (!result) {
                return res.status(404).json({status: 'error', message: 'User not found'})
            }
            res.send({status: 'User deleted', payload: result})

        } catch (error) {
            res.status(500).send({message: error.message})
        }}

        uploadDocuments = async (req, res) => {
            const { uid } = req.params
            const { files } = req
        
            try {

                const user = await this.service.getUser({_id: uid})
                if (!user) {
                    return res.status(404).json({ status: 'error', message: 'User not found' })
                }
    
                if (files.length !== 3) {
                    return res.status(400).json({ status: 'error', message: 'Upload 3 files' });
                }
    
                const pdfFiles = []
    
                for (const file of files) {
                    if (file.mimetype !== 'application/pdf') {
                        return res.status(400).json({ status: 'error', message: 'Only PDF files allowed' })
                    }
    
                    pdfFiles.push(file)
                }

                user.documents = pdfFiles.map(file => ({
                    documentType: file.mimetype, 
                    path: file.path 
                }))
                user.userStatus = 'PENDING'
                await user.save()
                res.status(200).json({ status: 'success', message: 'PDF documents uploaded successfully' })

            } catch (error) {
                res.status(500).json({ status: 'error', message: error.message })
            }
        } 

        handleRole = async (req, res) => {
            const { uid }    = req.params
            const { userStatus } = req.body
        
            try {
                const user = await this.service.getUser({_id: uid})
                if (!user) {
                    return res.status(404).json({ status: 'error', message: 'User not found' })
                }
        
                if (!user.documents || user.documents.length !== 3) {
                    return res.status(400).json({ status: 'error', message: 'User must upload exactly 3 documents' })
                }
        
                if (userStatus === 'APPROVED') {
                    user.role = 'USER_PREMIUM'
                } else {
                    user.role = 'USER'
                }
            
                await user.save()

                res.status(200).json({ status: 'success', message: 'User status updated successfully' })

            } catch (error) {
                res.status(500).json({ status: 'error', message: error.message })
            }
        }
}

module.exports = UserController