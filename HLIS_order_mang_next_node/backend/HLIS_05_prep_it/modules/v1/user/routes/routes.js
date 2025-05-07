const User = require('../controller/user');  

const customerRoute = (app) => {

    // --------AUTH API's------------------

    app.post("/v1/user/signup", User.signUp);
    app.post("/v1/user/login", User.login);
    app.post("/v1/user/logout", User.logout);

    // ---------POST API's------------------

    app.post("/v1/user/add-habit-type", User.addHabitType);
    app.post("/v1/user/create-habit", User.createHabit);
    app.post("/v1/user/log-habit", User.logHabit);
    
    // --------GET API's------------------

    app.get("/v1/user/get-logs", User.getLogs);
    app.get("/v1/user/get-habit-streaks", User.getHabitStreaks);
    app.get("/v1/user/get-suggested-habits", User.getSuggestedHabits);
    app.get("/v1/user/get-habits-type", User.getHabitTypes);


    

};
   

module.exports = customerRoute;



