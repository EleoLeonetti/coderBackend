const bcrypt = require('bcrypt')

//Función para encriptar contraseña
exports.createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10) )

//Función para validar la contraseña que ingresa el usuario (retorna true o false)
exports.isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)
