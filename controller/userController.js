//------------------------------userRoute-handeler----------------------------//

exports.getAllUsers = (req, res) => {
    res.status(200).json({ 
        status:'successful',
        requestedAt: req.requestTime,
        data: {message:`Done`}
})
};
exports.createUser = (req, res) => {
    res.status(201).json({ 
        status:'successful',
        requestedAt: req.requestTime,
        data: {message:`Done`}
})
};
exports.getUser = (req, res) => {
    res.status(200).json({
        status:'successful',
        requestedAt: req.requestTime,
        data: {message:`Done`}
})
};
exports.updateUser = (req, res) => {
    res.status(201).json({
        status:'successful',
        requestedAt: req.requestTime,
        data: {message:`Done`}
})
};
exports.deleteUser = (req, res) => {
    res.status(204).json({ 
        status:'successful',
        requestedAt: req.requestTime,
        data: {message:`Done`}
})
};
