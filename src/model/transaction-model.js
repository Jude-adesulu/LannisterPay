class TransactionModel {
    constructor(data){
        this.ID = data.ID;
        this.Balance = data.Balance;
        this.SplitBreakdown = data.SplitBreakdown;
    }
}

module.exports = TransactionModel;