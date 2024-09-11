const response = (res, statusCode, message, data = null) => {
    const responseObject = {
        status: statusCode < 400 ? 'success' : 'error', 
        message,
        data
    };

    // Send the response with the provided status code and response object
    return res.status(statusCode).json(responseObject);
};

module.exports = response;
