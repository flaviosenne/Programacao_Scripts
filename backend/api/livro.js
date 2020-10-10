
const queries = require('./queries')
module.exports = app => {
    const {existsOrError} = app.api.validation

    const save = (req, res) => {
        const livro = { ...req.body}
        if(req.params.id) livro.id = req.params.id

        try{
            existsOrError(livro.name, 'Nome não informado')
            existsOrError(livro.description, 'Descrição não informado')
            existsOrError(livro.generosId, 'Genero não informado')
            existsOrError(livro.imageUrl, 'URL da imagem não informada')
            existsOrError(livro.userId, 'Autor não informado')
            existsOrError(livro.content, 'Conteudo não informado')
        }
        catch(err){
            res.status(400).send(err)
        }

        if(livro.id){
            app.db('livros')
            .update(livro)
            .where({id: livro.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }else{
            app.db('livros')
            .insert(livro)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async(req, res) => {
        try{
            const rowsDeleted = await app.db('livros')
                    .where({id: req.params.id}).del()

            try{
                existOrError(rowsDeleted, 'Livro não foi encontrado')
            }
            catch(err){
                return res.status(400).send(err)
            }

            res.status(204).send()
        }catch(err){
            res.status(500).send(err)
        }
    }

    const limit = 5

    const get = async (req, res) => {
        const page = req.query.page || 1
        
        const result = await app.db('livros').count('id').first()
        
        const count = parseInt(result.count)

        app.db('livros')
        .select('id', 'name', 'description')
        .limit(limit).offset(page * limit - limit)
        .then(livros => res.json({data: livros, count, limit}))
        .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('livros')
        .where({id: req.params.id})
        .first()
        .then(livro => {
            livro.content = livro.content.toString()
            return res.json(livro)
        })
        .catch(err => res.status(500).send(err))
    }
 
    const getByGenero = async(req, res) =>{

        const generoId = req.params.id

        const page = req.query.page || 1
        const categories = await app.db.raw(queries.generoWithChildren, 
            generoId)

        const ids = categories.rows.map(c => c.id)

        app.db({a: 'livros', u: 'users'})
        .select('a.id', 'a.name', 'a.description', 'a.imageUrl', {
            author: 'u.name'
        })
        .limit(limit).offset(page * limit - limit)
        .whereRaw('?? = ??', ['u.id', 'a.userId'])
        .whereIn('generoId', ids)
        .orderBy('a.id', 'desc')
        .then(livros => res.json(livros))
        .catch(err => res.status(500).send(err))

    }

    return { save, remove, get, getById, getByGenero }
}