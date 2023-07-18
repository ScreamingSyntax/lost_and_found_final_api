const pool = require('../../config/database')
const {transporter} = require('../../otp/otp')

module.exports={
    viewProductByDate:callBack=>{
        pool.query("SELECT * FROM items WHERE item_id NOT IN (SELECT item_id FROM claim WHERE claim_status='Approved') order by found_date desc",
        (err,result)=>{
            if(err){
                return callBack(err,null)
            }
            return callBack(null,result)
        }
        )
    },
    viewProductByName:callBack=>{
        pool.query("SELECT * FROM items WHERE item_id NOT IN (SELECT item_id FROM claim WHERE claim_status='Approved') order by item_name",
        (err,result)=>{
            if(err){
                return callBack(err,null)
            }
            return callBack(null,result)
        }
        )
    },
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
    verifyReportService:(data,callBack)=>{
        pool.query("Select otp FROM otp_data where email = ? and name=?",
        [data.email,data.name],
        (err,result,field)=>{
            // console.log(result)
            if(err){
                return callBack(err,null);
            }
            return callBack(null,result);
        }
        )
    },
    addReportService:(data,date,callBack)=>{
        console.log(date)
        pool.query("INSERT into report(reported_by,reported_by_email,report_title,report_description,report_date,lost_location) values (?,?,?,?,?,?)",
        [data.name,data.email,data.title,data.description,date,data.lost_location],
        (err,result,field)=>{
            if(err){
                return callBack(err,null);
            }
            
            return callBack(null,result)
        });
    },
}