const Responses = {
    fieldAddedSuccessResponse: id => {
        return {
            code: 200,
            id: id,
            message: "Field added successfully",
            date: new Date().getTime()
        }
    },
    fieldAddedErrorResponse: errorMessage => {
        return {
            code: 400,
            message: errorMessage || "Error adding field",
            date: new Date().getTime()
        }
    },
}

module.exports = Responses