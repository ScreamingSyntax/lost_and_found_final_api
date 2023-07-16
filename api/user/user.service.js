const pool = require('../../config/database')

module.exports={
    viewItemsService:(data,callBack)=>{
        pool.query("SELECT * FROM items WHERE item_id NOT IN (SELECT item_id FROM claim WHERE claim_status='Approved')",
        (err,result,fields)=>{
            
            if (err){
                return callBack(err,null)
            }
            return callBack(null,result)
        })
    },
    claimItemService:(data,date,callBack)=>{
        
        pool.query(`INSERT INTO claim(item_id,claimed_by,claimed_by_email,claim_status,claimed_date) values(?,?,?,?)`,
        [data.item_id,data.claimed_by,data.claimed_by_email,"Pending",date],
        (err,result,fields)=>{
      
            if(err){
                return callBack(err,null)
            }
            return callBack(null,result)
        }
        )
    },
    searchProductService :(data,callBack)=>{
        pool.query("SELECT * FROM items where item_id not in (SELECT item_id FROM claim WHERE claim_status=\"Approved\") and item_name LIKE ?",
        [`%${data.item_name}%`],
        (err,result,field)=>{
            
            if (err){
                return callBack(err,null)
            }
            else{
                return callBack(null,result)
            }
        }
        )
    },
}