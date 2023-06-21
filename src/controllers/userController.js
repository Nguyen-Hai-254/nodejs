import userServices from "../services/userServices";
import client from "../config/configRedis";

const handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter!'
        })
    }

    let userData = await userServices.handleUserLogin(email, password);

    // errorCode = 0 => OK
    // errorCode = 1 => Missing input parameter
    // errorCode = 2 => Your's email is't exist
    // errorCode = 3 => Wrong password
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user: userData.user ? userData.user : {}
    })
}

const handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing required parameter',
            data: {}
        })
    }

    const cacheData = await client.get(id);
    // console.log(JSON.stringify(cacheData, null, 2));
    // console.log("cacheData: ", id, cacheData);
    if (cacheData) {
        return res.status(200).json({
            errCode: 0,
            fromCache: true,
            message: 'OK',
            data: cacheData
        })
    }

    let data = await userServices.getAllUsers(id);

    // if (data.message === 'OK') {
    //     console.log("Check");
    //     await client.set(id, JSON.stringify(data.data));
    // }

    await client.set('id: 52', {name: 'hai'});
    console.log('get(52): ', await client.get('id: 52'));

    return res.status(200).json({
        errCode: data.errCode,
        message: data.message,
        data: data.data ? data.data : {}
    })
}

const handleInsertUser = async (req, res) => {
    let data = req.body;

    if (!data || !data.email || !data.password || !data.firstName || !data.lastName) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter!'
        })
    }

    const cacheData = await client.get(data.email);
    console.log('cache: ', data.email, ' ', cacheData);
    if (cacheData) {
        return res.status(200).json({
            errCode: 2,
            fromCache: true,
            message: 'Your email is already exist, please chance your email!'
        })
    }

    let userData = await userServices.insertUser(data);
    if (userData.errCode === 0) {
        delete data.password;
        await client.set(data.email, JSON.stringify(data));
    }

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message
    });
}

const handleEditUser = async (req, res) => {
    let data = req.body;
    if (!data || !data.id || !data.email || !data.password || !data.firstName || !data.lastName) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter!'
        })
    }
    let dataUser = await userServices.editUser(data);
    return res.status(200).json({
        errCode: dataUser.errCode,
        message: dataUser.message
    })
}

const handleDeleteUser = async (req, res) => {
    let data = req.body;
    if (!data || !data.id) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter!'
        })
    }

    let userData = await userServices.deleteUser(data.id);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message
    })
}

const handleUploadUser = async (req, res) => {
    if (req.file == undefined) {
        return res.status(400).send("Please upload an excel file!");
    }

    let messageRes = await userServices.uploadUser(req.file.filename, req.file.originalname);

    return res.status(200).json({
        messageRes
    })
};

module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleInsertUser,
    handleEditUser,
    handleDeleteUser,
    handleUploadUser,
}