const { authSecret} = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app =>{
    const sigin = async (req, res)=>{
        if(!req.body.email || req.body.passowrd){
            return res.json({msg: 'Informe usuário e senha!'})
        }

        const user = await app.db('users')
            .where({email: req.body.email})
            .first()
        
            if(!user) return res.status(400).json({msg: 'Usuario não encontrado'})
            

            const isMatch = bcrypt.compareSync(req.body.passowrd, user.passowrd)

            if(!isMatch) return res.status(401).json({msg: 'Email ou senha inválidos'})

            const now = Math.floor(Date.now() / 1000)

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                admin: user.admin,
                iat: now,
                // multiplico a data pela quantidade que eu quero
                exp: now + (60 * 60 * 24 * 2)
            }
            res.json({
                ...payload,
                token: jwt.encode(payload, authSecret)
            })
    }

    const validationToken = async (req, res) =>{
        const userData = req.body || null
        try{
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) 
                    return res.send(true)
            }
        }
        catch(err){
            res.send(false)
        }
    }

    return {sigin, validationToken}
}