
// This is to allow the FE to get the session details of the backend.
exports.verifySession = (req, res) =>{
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ message: "Unauthorized. Please log in." });
    }
}
