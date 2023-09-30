const pool = require('../../config/database')
const {transporter} = require('../../otp/otp')
const { report } = require('./user.router')

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
    verifyOtpService:(data,callBack)=>{
        pool.query("select otp from otp_data where email = ? and name = ? ",
        [data.email,data.name],
        (err,result)=>{
            console.log(data.email)
            console.log(data.name)
            if(err){
                return callBack(err,result);
            }
            return callBack(null,result);
        })
    },
    getUserByEmailService:(email,callBack)=>{
        pool.query("SELECT * FROM USERS where email = ?",
        [email],
        (err,result)=>{
            if(err){
                return callBack(err,null)
            }
            return callBack(null,result)
        }
        )
    },
    registerUserService:(data,callBack)=>{
        pool.query("INSERT INTO users(userName,email,password) values ( ? , ? , ?) ",
        [data.name,data.email,data.password],
        (err,result,fields)=>{
            if(err){
                return callBack(err,null);
            }

            return callBack(null,result);
        }
        )
    },
    loginUserService:(data,callBack)=>{
        pool.query("Select email,password from users",
        [data.email,data.password],
        (err,result)=>{
            if(err){
                return callBack(err,null);
            }
            return callBack(null,result);
        }
        )
    },
    viewItemsService:(data,callBack)=>{
        pool.query("SELECT * FROM items WHERE item_id NOT IN (SELECT item_id FROM claim WHERE claim_status='Approved')",
        (err,result,fields)=>{
            if (err){
                return callBack(err,null);
            }
            return callBack(null,result);
        })
    },
    claimItemService:(data,date,claimed_by,callBack)=>{
        console.log(`Service wala date ${date}`)
        pool.query(`INSERT INTO claim(item_id,claimed_by,claimed_by_email,claim_status,claimed_date) values(?,?,?,?,?)`,
        [data.item_id,claimed_by,data.claimed_by_email,"Pending",date],
        (err,result,fields)=>{
            if(err){
                console.log(err)
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
    searchItemSortByNameService:(data,callBack)=>{
        pool.query(`select item_id from items  where item_name like ? and item_id not in (SELECT item_id from claim where claim_status='Approved') order by item_name`,
        [`%${data.name}%`],
        (err,result)=>{
            if (err){
                return callBack(err,null);
            }
            return callBack(null,result)
        }
        )
    }, searchItemSortByDateService:(data,callBack)=>{
        pool.query(`select item_id from items  where item_name like ? and item_id not in (SELECT item_id from claim where claim_status='Approved') order by found_date`,
        [`%${data.name}%`],
        (err,result)=>{
            if (err){
                return callBack(err,null);
            }
            return callBack(null,result)
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
    addReportService:(userID,date,data,callBack)=>{
        console.log(data)
        pool.query("INSERT into report(userID,lost_location,report_title,report_description,report_date,is_found) values (?,?,?,?,?,?)",
        [userID,data.lost_location,data.report_title,data.report_description,date,'false'],
        (err,result,field)=>{
            if(err){
                return callBack(err,null);
            }
            return callBack(null,result)
        });
    },
    viewReportService:(data,callBack)=>{
        pool.query("select report.report_id, report.lost_location,report.report_title,report.report_description,report.report_date,report.is_found from users right join report on users.userID = report.userID where users.email = ? ",
        [data.email],
        (err,result,field)=>{
            if (err){
                return callBack(err,null);
            }
            return callBack(null,result)
        })
    },
    lostItemFoundService:(data,callBack)=>{
        pool.query(" update report set is_found=1 where report_id = ?",
        [data.report_id],
        (err,result,field)=>{
            if(err){
                return callBack(err,null);
            }
            return callBack(null,result)
        }
        )
    },
    viewReportCategoriesService:(callBack)=>{
        pool.query("SELECT * from lost_category",
        [],
        (err,result)=>{
            if(err){
                return callBack(err,null);
            }
            return callBack(null,result);
        })
    },
}