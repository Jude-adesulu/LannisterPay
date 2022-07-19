const { sendSuccess, sendError } = require('../utils/response-handler');
const {transaction} = require('../validation/index');
const transactionModel = require('../model/transaction-model');
const { orderOfPrecedence, totalRatio, totalValue } = require('../utils/computation-operands');

module.exports = {
     SplitPayment: async (req, res, next) => {
        try{
            await transaction.validateAsync(req.body);
    
            const { ID, Amount, SplitInfo } = req.body;

            let current_bal = Number(Amount);
            let totalSplitValue = totalValue(SplitInfo);
            let reorderSplitType = orderOfPrecedence(SplitInfo);
            let openRatioBal = 0;
            let SplitBreakdown = [];

    
            let ratioTypeSum = reorderSplitType.filter(entity => {
                return entity.SplitType === 'RATIO';
            })
    
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
                if (data.SplitType === 'FLAT') {
                    current_bal -= Number(data.SplitValue)
                }
                if (data.SplitType === 'PERCENTAGE') {
                        let percentage = data.SplitValue / 100 * current_bal;
                        current_bal -= Number(percentage);
                        openRatioBal = current_bal;
                }

                if (data.SplitType === 'RATIO') {
                        const ratioSum = totalRatio(ratioTypeSum)
                        const ratio = (data.SplitValue /ratioSum) * openRatioBal
                        current_bal-= Number(ratio);
                }
    
                SplitBreakdown.push({
                    "SplitEntityId": data.SplitEntityId,
                    "Amount": data.SplitValue
                });
    
                if (current_bal < 0){
                    return sendError(res, 'Final balance cant be less than 0', 400);
                }
            }
    
            let response = {
                ID,
                Balance: current_bal,
                SplitBreakdown
            }
    
            return sendSuccess(res, new transactionModel(response), 200);
    
        }catch(err){
            if(err.isJoi) return sendError(res, err.details[0].message, 422);
            return sendError (res, err.message, 400);
        }
    }
}