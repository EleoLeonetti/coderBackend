const { Router }        = require('express')
const UserController    = require('../controllers/users.controller')
const { uploader }      = require('../utils/uploader')
const { passportCall }  = require('../passport-jwt/passportCall.middleware')
const { authorization } = require('../passport-jwt/authorization.middleware')

const router = Router()

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    uploadDocuments,
    handleRole
} = new UserController()

router
    .get('/', [passportCall('jwt'), authorization(['ADMIN'])], getUsers)
    .get('/:uid', getUser)
    .post('/', createUser)
    .put('/:uid', [passportCall('jwt'), authorization(['ADMIN'])], updateUser)
    .delete('/:uid', [passportCall('jwt'), authorization(['ADMIN'])], deleteUser)
    .post('/uploadDocs/:uid', uploader.array('documents'), uploadDocuments)
    .post('/premium/:uid', handleRole)

module.exports = router