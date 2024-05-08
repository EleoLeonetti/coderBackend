const UserController  = require("./users.controller")
const { userService } = require("../repositories")
const { createToken } = require("../utils/jwt")
const { isValidPassword, createHash } = require("../utils/hashPassword")

class SessionController {
    constructor() {
        this.service = userService
        this.controller = new UserController()
    }

    register = async (req, res) => {
        try {
            const { first_name, last_name, birthdate, email, role, password } = req.body
            if(first_name === '' || last_name === '' || email === '' || password === ''){
                return res.send({status: 'error', message: "All fields are required"})
            }
            const user = await this.service.getUser({email})
            if(user) {
                return res.send({status: 'error', message: 'Email already exist'})
            }

            const newUser = {
                first_name,
                last_name,
                email,
                birthdate,
                password: createHash(password),
                role
            }
        
            if(newUser.email === 'adminCoder@coder.com'){
                newUser.role = 'admin'
            }
        
            let result = await this.service.createUser(newUser)

            const token = createToken({
                id: result._id
            })

            res.cookie('token', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true
            }).send({status: 'Success', message: 'Registered'})
            
        } catch (error) {
            res.status(500).send({status: 'error', message: error.message})
        }    
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body
            if(email === '' || password === ''){
                return res.send({status: 'error', message: "All fields are required"})
            }
    
            const user = await this.service.getUser({email})
            if(!user) return res.status(401).send({status: 'error', message: 'Wrong email or password'})
    
            if(!isValidPassword(password, {password: user.password})) return res.status(401).send({status: 'error', message: 'Wrong email or password'})

            user.last_connection = new Date()
            await user.save()

            const token = createToken({
                id: user._id,
                email: user.email,
                role: user.role
            })
    
            res.cookie('token', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true
            }).send({status: 'Success', message: 'Logged in'})
        } catch (error) {
            res.status(500).send({status: 'error', message: error.message})
        }
        
    }

    logout = (req, res) => {
        try {
            res.clearCookie('token').send({status: 'Success', message: 'Logged out'})
        } catch (error) {
            res.status(500).send({status: 'error', message: error.message})
        }   
    }
}

module.exports = SessionController