

let createNewBanner = async (req, res) => {
    try {
        let data = await bannerService.createNewBanner(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailBanner = async (req, res) => {
    try {
        let data = await bannerService.getDetailBanner(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    createNewBanner: createNewBanner,
    getDetailBanner: getDetailBanner
}