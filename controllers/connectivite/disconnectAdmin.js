const disconnectAdmin = (req, res) => {
    res.clearCookie('acces-token', { path: '/' });
    res.json({ status: "success", success: "Vous vous êtes deconnecté" });
}

module.exports = disconnectAdmin;