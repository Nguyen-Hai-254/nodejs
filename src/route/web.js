import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
const upload = require("../middlewares/upload")

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);

    router.post("/post_CRUD", homeController.createNewUser);
    router.get("/get_CRUD", homeController.displayGetCRUD);
    router.get("/edit_CRUD", homeController.editCRUD);
    router.post("/put_CRUD", homeController.updateUser);
    router.get("/delete_CRUD", homeController.deleteUser);

    router.post("/api/login", userController.handleLogin)
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.post("/api/insert-user", userController.handleInsertUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.post("/api/uploadUsers", upload.single("file"), userController.handleUploadUser);

    return app.use("/", router);
}

module.exports = initWebRoutes;