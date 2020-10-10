module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const genero = { ...req.body }
        if(req.params.id) genero.id = req.params.id

        try {
            existsOrError(genero.name, 'Nome não informado')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(genero.id){
            app.db('generos')
                .update(genero)
                .where({ id: genero.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('generos')
                .insert(genero)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código do Gênero não informado')
            const subcategory = await app.db('generos')
                .where({ parentId: req.params.id })
            
            notExistsOrError(subcategory, 'Genero possui subgêneros.')

            const articles = await app.db('generos')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, 'Genero possui livros')

            const rowsDeleted = await app.db('generos')
                .where({ id: req.params.id }).del()
                
                existsOrError(rowsDeleted, 'Genero não foi encontrado.')
                
                res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const withPath = generos => {
        const getParent = (generos, parentId) => {
            const parent = generos.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = generos.map(genero => {
            let path = genero.name
            let parent = getParent(generos, genero.parentId)

            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(generos, parent.parentId)
            }
            return { ...genero, path }
        })

        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const get = (req, res) => {
        app.db('generos')
            .then(generos => res.json(withPath(generos)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('generos')
            .where({ id: req.params.id }).first()
            .then(genero => res.json(genero))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (catgories,  tree) => {
        if(!tree) tree = generos.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(catgories, catgories.filter(isChild))
            return parentNode
        })
        return tree
    
    }

    const getTree = (req, res) => {
        app.db('generos')
        .then(generos => res.status(200).json(toTree(generos)))
        .catch(err => res.status(500).send(err))
    }
    return { save, remove, get, getById, getTree }
}