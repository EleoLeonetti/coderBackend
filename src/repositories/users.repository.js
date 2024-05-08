class UserRepository {
    constructor(dao){
        this.dao = dao
    }

    async getUsers({ page = 1, limit = 10 }) {
        return await this.dao.get({ page, limit })
    }

    async getUser(filter) {
        return await this.dao.getBy(filter)
    }

    async createUser(newUser) {
        return await this.dao.create(newUser)
    }

    async updateUser(uid, userToUpdate) {
        return await this.dao.update(uid, userToUpdate)
    }

    async deleteUser(uid) {
        return await this.dao.delete(uid)
    }
}

module.exports = UserRepository