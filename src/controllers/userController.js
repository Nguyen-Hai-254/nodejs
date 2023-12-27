import userServices from "../services/userServices";
import fs from "fs";

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
    if (userData.errCode === 0) {
        await client.set(email, JSON.stringify(userData.user), {
            EX: 300,
            NX: true
        })
        try {
            // await fs.appendFile(__dirname + "../../../resources/txt/UserInfo.txt", JSON.stringify(userData.user));
            let dataFile = await fs.readFileSync(__dirname + "../../../resources/txt/UserInfo.txt", 'utf-8');
            if (dataFile) {
                let newData = dataFile.split();
                newData.push(userData.user);
                console.log(newData);
                await fs.writeFileSync(__dirname + "../../../resources/txt/UserInfo.txt", JSON.stringify(newData),
                    {
                        flag: 'w+'
                    }, err => { console.log(err) }
                );
            }
            else {
                await fs.writeFileSync(__dirname + "../../../resources/txt/UserInfo.txt", JSON.stringify(userData.user),
                    {
                        flag: 'a'
                    }, err => { console.log(err) }
                );
            }




        } catch (e) {
            console.log(e);
        }
    }
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user: userData.user ? userData.user : {}
    })
}

const handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    let data = await userServices.getAllUsers(id);

    if (data.message === 'OK') {
        await client.set(id, JSON.stringify(data.data), {
            EX: 1,
            NX: true
        });
    }

    return res.status(200).json({
        errCode: data.errCode,
        message: data.message,
        data: data.data ? data.data : {}
    })
}

const handleInsertUser = async (req, res) => {
    let data = req.body;

    let userData = await userServices.insertUser(data);
    if (userData.errCode === 0) {
        delete data.password;
        await client.set(data.email, JSON.stringify(data), {
            EX: 1,
            NX: true
        });
    }

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        userData: userData.data ? userData.data : {}
    });
}

const handleEditUser = async (req, res) => {
    let data = req.body;

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

const handleReadFileTxt = async (req, res) => {
    try {
        const data = await JSON.parse(fs.readFileSync(__dirname + "../../../resources/txt/UserInfo.txt", 'utf-8'));
        let newData;
        console.log('data: ', data);
        data.map(data => {
            newData = JSON.parse(data);
        })
        console.log('newData: ', newData);
        return res.status(200).json({
            message: 'OK',
            data: JSON.parse(data)
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Fail to read file',
            error: e
        })
    }
}

module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleInsertUser,
    handleEditUser,
    handleDeleteUser,
    handleUploadUser,
    handleReadFileTxt
}