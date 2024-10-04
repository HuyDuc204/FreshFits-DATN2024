let createNewBlog = async (req, res) => {
    try {
        let data = await blogService.createNewBlog(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}