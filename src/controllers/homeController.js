import db from "../models/index";
import CRUDservices from "../services/CRUDservices"

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        return res.render("homePage.ejs", {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }
}

let createNewUser = async (req, res) => {
    let message = await CRUDservices.createNewUser(req.body);
    console.log(message);
    return res.send("Create User");
}

let displayGetCRUD = async (req, res) => {
    let users = await CRUDservices.getAllUser();

    return res.render("displayCRUD.ejs", { data: users });
}

let editCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDservices.getUserInfoById(userId);

        return res.render("editUserCRUD.ejs", { userData: userData });
    }
    else {
        return res.send("User not found!");
    }

}

let updateUser = async (req, res) => {
    let data = req.body;

    let allUser = await CRUDservices.updateUserData(data);

    return res.render('displayCRUD.ejs', { data: allUser });
}

let deleteUser = async (req, res) => {
    let id = req.query.id;
    if (id) {
        let allUser = await CRUDservices.deleteUserById(id);

        return res.render("displayCRUD.ejs", { data: allUser });
    }
    else {
        return res.send("Not found User!");
    }

}

module.exports = {
    getHomePage,
    createNewUser,
    displayGetCRUD,
    editCRUD,
    updateUser,
    deleteUser,
}