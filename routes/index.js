 const {Router} = require("express");
 const router = Router()
 const authController = require("../controllers/authController")
 const ensureAuthenticated = require("../middleware/auth")
 const { getAllMessages } = require("../models/message");
 const messageController = require("../controllers/messageController");


router.get("/sign-up", authController.sign_up_get);
router.post("/sign-up", authController.sign_up_post);

router.get("/log-in", authController.log_in_get);
router.post("/log-in", authController.log_in_post);


router.get("/membership", ensureAuthenticated, authController.membership_get);
router.post("/membership", ensureAuthenticated, authController.membership_post);

router.get("/admin", ensureAuthenticated, authController.admin_get);
router.post("/admin", ensureAuthenticated, authController.admin_post);


router.get("/:id/edit", ensureAuthenticated, messageController.edit_get);
router.post("/:id/edit", ensureAuthenticated, messageController.edit_post);

router.get("/new-message", ensureAuthenticated, authController.message_create_get);
router.post("/new-message", ensureAuthenticated, authController.message_create_post);



router.get("/log-out", authController.log_out_get);

router.get("/", async (req,res, next) => {
    try{
    const messages = await getAllMessages();
    res.render("index", {messages})
     }catch(err){
        next(err)
     }
})

 module.exports = router