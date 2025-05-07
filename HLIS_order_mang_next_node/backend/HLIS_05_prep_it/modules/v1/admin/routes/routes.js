const Admin = require('../controller/admin');  

const adminRoute = (app) => {
    app.post("/v1/admin/login", Admin.login_admin);
    app.get("/v1/admin/canViewProgress/:id", Admin.canViewProgress);
    app.get("/v1/admin/getAllUsers", Admin.getAllUsers);


};

module.exports = adminRoute;    


