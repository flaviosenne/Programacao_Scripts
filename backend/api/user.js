const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const {existsOrErr, notExistsOrError, equalsOrError} = app.api.validation

    const encryptPassword = password =>{
        const salt = bcrypt.genSaltSync(10)

        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body}

        if(req.params.id) user.id = req.params.id

        try{
            existsOrErr(user.name, 'Nome não informado')
            existsOrErr(user.email, 'Email não informado')
            existsOrErr(user.password, 'Senha não informada')
            existsOrErr(user.confirmPassword, 'Consfirmação de senha inválida')
        
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users')
            .where({email: user.email}).first()

            if(!user.id){
                notExistsOrError(userFromDB, 'Usuario já cadastrado')
            }
        }
        catch(err){
            return res.status(400).json(err)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if(user.id){
            app.db('users').update(user)
            .where({id: user.id})
            .then(() => res.status(204).send())
            .catch(err => res.status(500).json(err))
        }else{
            app.db('users').insert(user)
            .then(() => res.status(204).send())
            .catch((err) => res.status(500).send(err))
        }
    }

    const get = async (req, res)=>{
        app.db('users')
        .select('id', 'name','email', 'admin')
        .then(users => res.json(users))
        .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res)=>{
        console.log(req.params.id)
        app.db('users')
        .select('id', 'name','email', 'admin')
        .where({id: req.params.id})
        .then(users => res.json(users))
        .catch(err => res.status(500).send(err))
    }

    return {save, get, getById}
}