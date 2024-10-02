import allcodeService from '../services/allcodeService';

let handleCreateNewAllCode = async (req, res) => {
    try {
        let data = await allcodeService.handleCreateNewAllCode(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllCodeService = async (req, res) => {
    try {
        let data = await allcodeService.getAllCodeService(req.query.type)
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


let getAllCategoryBlog = async (req, res) => {
    try {
        let data = await allcodeService.getAllCategoryBlog(req.query.type)
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}



let handleUpdateAllCode = async (req, res) => {
    try {
        let data = await allcodeService.handleUpdateAllCode(req.body)
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


module.exports = {
    handleCreateNewAllCode: handleCreateNewAllCode,
    getAllCodeService: getAllCodeService,
    getAllCategoryBlog: getAllCategoryBlog,
    handleUpdateAllCode: handleUpdateAllCode
}