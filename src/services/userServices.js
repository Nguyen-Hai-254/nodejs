import { where } from "sequelize";
import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);
const readXlsxFile = require("read-excel-file/node");


let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let user = await db.User.findOne({
                attributes: ['email', 'roleId', 'password'],
                where: { email: email },
                raw: true
            })

            if (user) {
                let check = await bcrypt.compareSync(password, user.password);
                if (check) {
                    userData.errCode = 0;
                    userData.message = 'OK';
                    delete user.password;
                    userData.user = user;
                }
                else {
                    userData.errCode = 3;
                    userData.message = `Wrong password`;
                }
            }
            else {
                userData.errCode = 2;
                userData.message = `Your's email is't exist`;
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }

    })
}

const getAllUsers = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};

            if (id && id === 'all') {
                let allUser = await db.User.findAll({
                    attributes: { exclude: ['password'] }
                });
                data.errCode = 0;
                data.message = 'OK';
                data.data = allUser;
            }
            else if (id && id !== 'all') {
                let dataUser = await db.User.findOne({
                    where: { id: id },
                    attributes: { exclude: ['password'] }
                })
                if (dataUser === null) {
                    data.errCode = 0;
                    data.message = 'User not found!';
                    data.data = dataUser;
                }
                else {
                    data.errCode = 0;
                    data.message = 'OK';
                    data.data = dataUser;
                }
            }
            else {
                data.errCode = 0;
                data.message = `Missing id's user`;
                data.data = dataUser;
            }

            resolve(data);
        } catch (e) {
            reject(e);
        }
    })
}

const insertUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isEmailExist = await db.User.findOne({
                where: { email: user.email },
                attributes: { exclude: ['password'] }
            });

            if (isEmailExist !== null) {
                userData.errCode = 2;
                userData.message = 'Your email is already exist, please chance your email!';
                // userData.data = []
            }
            else {
                let hashPassword = await hashUserPassword(user.password);

                await db.User.create({
                    email: user.email,
                    password: hashPassword,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                    gender: user.gender === '1' ? true : false,
                    roleId: user.roleId,
                })

                userData.errCode = 0;
                userData.message = 'Create new User successful!';
                // userData.data = []
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let userFound = await db.User.findOne({
                where: { id: data.id }
            })

            if (!userFound) {
                userData.errCode = 2;
                userData.message = 'User is not found! Please try again';
                resolve(userData);
            }
            let emailIsExist = await db.User.findOne({
                where: { email: data.email }
            })

            if (!emailIsExist || emailIsExist.id == data.id) {
                let hashPassword = await hashUserPassword(data.password);
                await db.User.update({
                    email: data.email,
                    password: hashPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
                },
                    { where: { id: data.id } });

                userData.errCode = 0;
                userData.message = 'Edit user successful!';
            }
            // if (emailIsExist && emailIsExist.email !== data.email) {
            else {
                userData.errCode = 3;
                userData.message = 'Email is already exist';
            }


            resolve(userData);

        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let idUserIsExist = await db.User.findOne({
                where: { id: id },
                attributes: { exclude: ['password'] }
            })

            if (!idUserIsExist) {
                userData.errCode = 2;
                userData.message = 'Id of user is not exist';
            }
            else {
                await db.User.destroy({
                    where: { id: id }
                })

                userData.errCode = 0;
                userData.message = 'Delete user successful!';
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

const uploadUser = (fileName, originalName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let path = __dirname + "../../../resources/" + fileName;
            
            readXlsxFile(path).then((rows) => {
                rows.shift();

                rows.forEach(async (row) => {
                    let user = {
                        email: row[0],
                        password: row[1],
                        firstName: row[2],
                        lastName: row[3],
                        address: row[4],
                        phoneNumber: row[5],
                        gender: row[6],
                        roleId: row[7],
                    };

                    await insertUser(user);
                });
                
                resolve({
                    message: "Uploaded the file successfully: " + originalName
                });
            });
        } catch (error) {
            reject({
                message: "Could not upload the file: " + originalName,
                error: error
            });
        }
    })

}

module.exports = {
    handleUserLogin,
    getAllUsers,
    insertUser,
    editUser,
    deleteUser,
    uploadUser,
}