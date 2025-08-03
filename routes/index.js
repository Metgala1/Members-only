 const {Router} = require("express");
 const router = Router()
 const authController = require("../controllers/authController")
 router.get("/", (req,res) => {
    res.render("index", {title: "Home"})
 })

router.get("/sign-up", authController.sign_up_get);
router.post("/sign-up", authController.sign_up_post);

router.get("/log-in", authController.log_in_get);
router.post("/log-in", authController.log_in_post);


 module.exports = router