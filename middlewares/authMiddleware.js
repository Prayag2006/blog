export const ensureAuth = (req, res, next) => {
    const userId = req.cookies?.userid;
    if (!userId) {
        return res.redirect('/login');
    }
    next();
};
