/**
 * Render home page
 * @param {Object} req Requisição do usuário
 * @param {Object} res resposta do servidor
 * @param {Object} next Função next
 * @returns HTML
 */
const index = (req, res, next) => {
    res.end("hey friend")
}

module.exports = {
    index
}