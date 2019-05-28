
const { validationResult } = require('express-validator/check');

/**
 * Render home page
 * @param {Object} req Requisição do usuário
 * @param {Object} res resposta do servidor
 * @param {Object} next Função next
 * @returns HTML
 */
const index = (req, res, next) => {
    res.render("index")
}

/**
 * Response with name
 * @param {Object} req Requisição do usuário
 * @param {Object} res resposta do servidor
 * @param {Object} next Função next
 * @returns string
 */
const hello = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    res.end(`hello ${req.body.name}`)
}

module.exports = {
    index,
    hello
}