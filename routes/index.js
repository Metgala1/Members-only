 const {Router} = require("express");
 const router = Router()
 const authController = require("../controllers/authController")
 const ensureAuthenticated = require("../middleeare/auth")
 const { getAllMessages } = require("../models/message");
 const messageController = require("../controllers/messageController");
 const {getAllUsers} = require("../models/user")


router.get("/sign-up", authController.sign_up_get);
router.post("/sign-up", authController.sign_up_post);

router.get("/log-in", authController.log_in_get);
router.post("/log-in", authController.log_in_post);


router.get("/membership", ensureAuthenticated, authController.membership_get);
router.post("/membership", ensureAuthenticated, authController.membership_post);

router.get("/admin", ensureAuthenticated, authController.admin_get);
router.post("/admin", ensureAuthenticated, authController.admin_post);


router.get("/message/:id/edit", ensureAuthenticated, messageController.edit_get);
router.post("/message/:id/edit", ensureAuthenticated, messageController.edit_post);

router.post("/message/:id/delete", ensureAuthenticated, messageController.delete_post)

router.get("/new-message", ensureAuthenticated, authController.message_create_get);
router.post("/new-message", ensureAuthenticated, authController.message_create_post);



router.get("/log-out", authController.log_out_get);

router.get("/", async (req,res, next) => {
    try{
    const messages = await getAllMessages();
    const users = await getAllUsers()
    res.render("index", {messages, users})
     }catch(err){
        next(err)
     }
})

 module.exports = router