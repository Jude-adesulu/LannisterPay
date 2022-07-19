const { sendSuccess, sendError } = require('../utils/response-handler');
const {transaction} = require('../validation/index');
const transactionModel = require('../model/transaction-model');
const { orderOfPrecedence, totalRatio, totalValue } = require('../utils/computation-operands');

module.exports = {
     SplitPayment: async (req, res, next) => {
        try{

            //Validate user entries
            await transaction.validateAsync(req.body);
            
            const { ID, Amount, SplitInfo } = req.body;

            let current_bal = Number(Amount);
            let totalSplitValue = totalValue(SplitInfo);
            let reorderSplitType = orderOfPrecedence(SplitInfo);
            //initialize the open ratio balance
            let openRatioBal = 0;
            //Split breakdown
            let SplitBreakdown = [];

            //Get all entries with type ratio
            let ratioTypeSum = reorderSplitType.filter(entity => {
                return entity.SplitType === 'RATIO';
            })
            //Check if Total splitvalue is more than balance
            if(totalSplitValue > current_bal){
                return sendError(res, 'Total split values cant be greater than Balance', 400);
            }
            
            for( const data of reorderSplitType){
                if(Number(data.SplitValue) > current_bal){
                    return sendError(res, 'Split value cant be greater than Balance', 400);
                }
                if(Number(data.SplitValue) < 0) {
                    return sendError(res, 'Split value cant be less than 0', 400);
                }

                //Compute FLAT
                if (data.SplitType === 'FLAT') {
                    current_bal -= Number(data.SplitValue)
                }

                //Compute PERCENTAGE
                if (data.SplitType === 'PERCENTAGE') {
                        let percentage = data.SplitValue / 100 * current_bal;
                        current_bal -= Number(percentage);
                        openRatioBal = current_bal;
                }

                //Compute RATIO
                if (data.SplitType === 'RATIO') {
                        const ratioSum = totalRatio(ratioTypeSum)
                        const ratio = (data.SplitValue /ratioSum) * openRatioBal
                        current_bal-= Number(ratio);
                }

                //push SplitType value and id into SplitBreakdown
                SplitBreakdown.push({
                    "SplitEntityId": data.SplitEntityId,
                    "Amount": data.SplitValue
                });
                
                //if Balance is less than 0 return error message
                if (current_bal < 0){
                    return sendError(res, 'Final balance cant be less than 0', 400);
                }
            }
            
            let response = {
                ID,
                Balance: current_bal,
                SplitBreakdown
            }
            // Return computation to the user
            return sendSuccess(res, new transactionModel(response), 200);
    
        }catch(err){
            //check if Joi error is thrown
            if(err.isJoi) return sendError(res, err.details[0].message, 422);
            //handle other errors
            return sendError (res, err.message, 400);
        }
    }
}