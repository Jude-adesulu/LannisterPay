
const sendSuccess = (res, data = {}, statusCode) => {
    const response = {
        data
    };
    return res.status(statusCode).json(response);
}

const sendError = (res, message, statusCode) => {
    const response = {
        success: false,
        message: message,
        errorCode: statusCode
    };
    return res.status(statusCode).json(response);
}

module.exports = {
    sendSuccess,
    sendError
}