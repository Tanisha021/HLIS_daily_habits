const response_code = require("../../../../utilities/response-error-code");
const constant = require("../../../../config/constant");
const common = require("../../../../utilities/common");
const adminModel = require("../models/admin-model");
// const authModel = require("../models/auth-model");
const Validator = require('Validator')
const {default: localizify} = require('localizify');
const validationRules  = require('../../../validation_rules');
const middleware = require("../../../../middleware/validators");
const { t } = require("localizify");
const { item_id } = require("../../../../language/en");

class Admin {
    async login_admin(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
        const rules = validationRules.login_admin;

        let message={
            required: req.language.required,
            email_id: t('email'),
            'password_.min': t('passwords_min')
        }

        let keywords={
            'email_id': t('rest_keywords_email_id'),
            'password_':t('rest_keywords_password')
        }
            const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
            console.log("Valid",valid);
            if (!valid) return;
            
            const responseData = await adminModel.login_admin(request_data);

            return common.response(res, responseData);
        }catch(error){
            console.error("Error in login:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }

    }

    async canViewProgress(req, res) {
        // let requested_data = req.body;
        const { id } = req.params
        if (!id) {
            return common.response(res, {
                code: response_code.BAD_REQUEST,
                message: t('user_id_required')
            });
        }
        try { 
            const responseData = await adminModel.canViewProgress(id);  
            return common.response(res, responseData);

        } catch (error) {
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async getAllUsers(req, res) {

        try { 
            const responseData = await adminModel.getAllUsers();  
            return common.response(res, responseData);

        } catch (error) {
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    



};
module.exports = new Admin();