
    const orderOfPrecedence = (entities) =>{
        let flatType = entities.filter(data => {
            return data.SplitType === 'FLAT'
        })
        
        let percentageType = entities.filter(data => {
            return data.SplitType === 'PERCENTAGE'
        })
        
        let ratioType = entities.filter(data => {
            return data.SplitType === 'RATIO'
        })
     return [...flatType, ...percentageType, ...ratioType]
    }

    // const validateS = (data) =>{
    //    data.filter(value =>{
    //     if(!value.SplitType || !value.SplitType ==='FLAT' || 
    //     !value.SplitType ==='PERCENTAGE' || !value.SplitType ==='RATIO'){
    //         return sendError(res, 'SplitType can be of type FLAT, PERCENTAGE, RATIO');
    //     }
    //    })
    // }

    const totalRatio = (entities) =>{
        let totalRatio = 0
        for (const entity of entities) {
            totalRatio += entity.SplitValue
        }
        return totalRatio;
    }

    const totalValue = (entities) => {
        let totalValue = 0
        for (const entity of entities) {
            totalValue += Number(entity.SplitValue)
        }

        return totalValue;
    }

    module.exports = {
        orderOfPrecedence,
        totalRatio,
        totalValue,
        // validateS
    }