module.exports = app => {
    const save = (req, res) => {
        res.json('user save')
    }

    return {save}
}