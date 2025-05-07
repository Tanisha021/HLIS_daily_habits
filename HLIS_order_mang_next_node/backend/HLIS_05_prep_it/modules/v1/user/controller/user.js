const response_code = require("../../../../utilities/response-error-code");
const constant = require("../../../../config/constant");
const common = require("../../../../utilities/common");
const userModel = require("../models/user-model");
const authModel = require("../models/auth-model");
const { default: localizify } = require('localizify');
const validationRules = require('../../../validation_rules');
const middleware = require("../../../../middleware/validators");
const { t } = require("localizify");


class User {

    async signUp(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
        const rules = validationRules.signUp;

        let message = {
            required: req.language.required,
            'email_id': t('email'),
            'password_.min': t('passwords_min'),
            'full_name': t('user_name'),
        };
    
        let keywords = {
            'email_id': t('email'),
            'password_.min': t('passwords_min'),
            'full_name': t('user_name'),
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        
        const responseData = await authModel.signUp(request_data);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async login(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
        const rules = validationRules.login;

        let message={
            required: req.language.required,
            email: t('email'),
            'password_.min': t('passwords_min')
        }

        let keywords={
            'email_id': t('rest_keywords_email_id'),
            'password_':t('rest_keywords_password')
        }
            const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
            console.log("Valid",valid);
            if (!valid) return;
            
            const responseData = await authModel.login(request_data);

            return common.response(res, responseData);
        }catch(error){
            console.error("Error in login:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }

    }
    async logout(req, res) {
        try {
            const user_id = req.owner_id;
            console.log("User ID in controller:", user_id);
            const responseData = await authModel.logout(user_id);
    
            return common.response(res, responseData);
        } catch (error) {
            console.error("Error in logout:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async addHabitType(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
            const rules = validationRules.addHabitType;
          
        let message = {
            required: req.language.required,
            string: t('must_be_string'),
        };
    
        let keywords = {
            "name": t('name'),
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        const user_id = req.owner_id;
        const responseData = await userModel.addHabitType(request_data,user_id);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async createHabit(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
            const rules = validationRules.createHabit;
          
        let message = {
            required: req.language.required,
            'name': t('name'),
            'habit_type_id': t('habit_type_id'),
            'goal_type': t('goal_type'),
            'goal_target': t('goal_target'),
            'reminder_time': t('reminder_time'),
            'message': t('message'),
            string: t('must_be_string'),
            integer: t('must_be_integer'),
            'goal_target.min': t('goal_target_min')
        };
        // postman value for this
        // reminder_time TIME NOT NULL,
        // {
        //     "name": "Learning",
        //     "habit_type_id": 1,
        //     "goal_type": "daily",
        //     "goal_target": 1,
        //     "reminder_time": "10:00:00",
        //     "message": "Keep learning new things"
        // }
        let keywords = {
            'name': t('name'),
            'habit_type_id': t('habit_type_id'),
            'goal_type': t('goal_type'),
            'goal_target': t('goal_target'),
            'reminder_time': t('reminder_time'),
            'message': t('message'),
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        const user_id = req.owner_id;
        const responseData = await userModel.createHabit(request_data,user_id);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async logHabit(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
            const rules = validationRules.logHabit;
          
        let message = {
            required: req.language.required,
           string: t('must_be_string'),
            integer: t('must_be_integer')
        };
        // postman value for this
        //  habit_id INTEGER NOT NULL REFERENCES tbl_habits(habit_id) ON DELETE CASCADE,
    // date datetime NOT NULL,
    // status enum ('completed','not-completed'),
        // {
        //     "habit_id": 1,
        //     "date": "2023-10-01 00:00:00",
        //     "status": "completed"
        // }    

        let keywords = {
            'habit_id': t('habit_id'),
            'status': t('status')
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        const user_id = req.owner_id;
        const responseData = await userModel.logHabit(request_data,user_id);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

        async getLogs(req, res) { 
            try{   
             
            const user_id = req.owner_id; 
            const responseData = await userModel.getLogs(user_id);
            return common.response(res, responseData);
    
            }catch(error){
                console.error("Error in signup:", error);
                return common.response(res, {
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + error
                });
            }
        }
        async getHabitStreaks(req, res) {
            try{
             
            const user_id = req.owner_id;
            const responseData = await userModel.getHabitStreaks(user_id);
            return common.response(res, responseData);
    
            }catch(error){
                console.error("Error in signup:", error);
                return common.response(res, {
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + error
                });
            }
        }
        async getSuggestedHabits(req, res) {
            try{
             
            const user_id = req.owner_id;
            const responseData = await userModel.getSuggestedHabits(user_id);
            return common.response(res, responseData);
    
            }catch(error){
                console.error("Error in signup:", error);
                return common.response(res, {
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + error
                });
            }
        }
        async getHabitTypes(req, res) {
            try{
             
            const user_id = req.owner_id;
            const responseData = await userModel.getHabitTypes(user_id);
            return common.response(res, responseData);
    
            }catch(error){
                console.error("Error in signup:", error);
                return common.response(res, {
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + error
                });
            }
        }
        async getAllReminder(req, res) {
            try{
             
            const user_id = req.owner_id;
            const responseData = await userModel.getAllReminder(user_id);
            return common.response(res, responseData);
    
            }catch(error){
                console.error("Error in signup:", error);
                return common.response(res, {
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + error
                });
            }
        }     



};
module.exports = new User();
