exports.authorization = role => {
  return async (req, res, next) => {
      try {
        if(!req.user) return res.status(401).send({status: 'error', message: 'Unauthorized'})
       
        if(!role.includes(req.user.role.toUpperCase())) return
        next()

      } catch (error) {
          next(error)
      }
  };
};