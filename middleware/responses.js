module.exports = {
    
    handleError: function (err, req, res, next) {
        
        var logger      = require('../utils/logger.js');
        
        logError(err);
               
        function logError(error) {
            logger.error({
                message: error.message,
                stack: error.stack
            });
        }
        
        
    }
}



