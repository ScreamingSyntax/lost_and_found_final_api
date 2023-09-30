const pool = require("../../config/database")


module.exports = {

    viewProduct: callBack => {
        pool.query("SELECT * FROM items WHERE item_id NOT IN (SELECT item_id FROM claim WHERE claim_status = 'Approved' or claim_status='Pending')",
        (err,result,field)=>{
           
            if(err){
                return callBack(err,null);
            }
            else{
                return callBack(null,result);
            }
        }
        )
    },
    searchProductService :(data,callBack)=>{
        pool.query("SELECT * FROM `items` JOIN claim ON items.item_id = claim.item_id WHERE claim.claim_status=? and item_name like ? order by items.item_id",
        [data.status,`%${data.item_name}%`],
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
    searchUnclaimedProductService :(data,callBack)=>{
        pool.query("SELECT * FROM items WHERE item_id NOT IN (SELECT item_id FROM claim WHERE claim_status = 'Approved' or claim_status='Pending') and item_name LIKE ?",
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
    sortByStatus: (data,callBack )=> {
        pool.query("SELECT * FROM `items` JOIN claim ON items.item_id = claim.item_id WHERE claim.claim_status=? order by items.item_id",
        [data.status],
        (err,result,field)=>{
            if(err){
                return callBack(err,null);
            }
            else{
                return callBack(null,result);
            }
        }
        )
    },
    addItem: (data,filePath, callBack) => {
        const imageName = filePath;
        const initialPath = "upload/images";
        console.log(data)
        pool.query("INSERT INTO items(item_name,item_image,found_location,found_by,found_date) VALUES (?,?,?,?,?)",
            [data.item_name,
            imageName,
            data.found_location,
            data.found_by,
            data.found_date
            ],
            (err, result, fields) => {
    
                if (err) {
                    return callBack(err, null);
                } else {
                    return callBack(null, result);
                }
            }
        );
    },   
    removeItem:(data,callBack)=>{ 
        pool.query("Delete from items where item_image = ?",
        [data.item_image],
        (err, result, fields)=>{
            if(err){
                return callBack(err,null);
            }
            else{
                return callBack(null,result);
            }
        }
        )
    } ,
    updateItemName:(data,imagePath,callBack)=>{
        pool.query("UPDATE items SET item_name = ?, item_image = ?, found_location = ?, found_by = ?, found_date = ? where item_id = ?",
        [data.item_name,
        imagePath,
        data.found_location,
        data.found_by,
        data.found_date, 
        data.item_id   
    ],
        (err,result,fields)=>{
            
            if(err){
                return callBack(err,null);
            }
            else{
                return callBack(null,result);
            }
        }
        )
    },
    approveItemsService:(data,callBack)=>{
        pool.query(`
        UPDATE claim
        SET claim_status = 
            CASE
                WHEN claim_id = ? AND item_id = ? THEN 'Approved'
                WHEN claim_id != ? AND item_id = ? THEN 'Rejected'
                ELSE claim_status
            END;
        `,
        [data.claim_id,data.item_id,data.claim_id,data.item_id],
        (err,result,fields)=>{
       
            if(err){
                return callBack(err,null)
            }
            return callBack(null,result)
        }
        )
    },
    rejectItemsService:(data,callBack)=>{
        pool.query(`UPDATE claim
        SET claim_status = 'Rejected' where claim_id=? and item_id=?`,
        [data.claim_id,data.item_id],
        (err,result,fields)=>{
          
            if(err){
                return callBack(err,null)
            }
            return callBack(null,result)
        }
        );
    },
    showReportsService:(callBack)=>{
        pool.query("select users.userName, users.email, report.lost_location, report.report_title, report_description, report.report_date, report.is_found from users right join report on users.userID = report.userID order by is_found",
        [],
        (err,result)=>{
            console.log(err)
            if (err){
                return callBack(err,null)
            }
            return callBack(null,result)
        }
        );
    },
    detailedReportViewService:(data,callBack)=>{
        pool.query('SELECT * FROM report where report_id=?',
        [data.report_id],
        (err,result)=>{
            if(err){
                return callBack(err,null);
            }
            return callBack(null,result);
        }
        );
    },
    adminLoginService:(data,callBack)=>{
        // console.log(data)
        pool.query("SELECT * FROM admin_lost where user_name=?",
        [data.user_name],
        (err,result)=>{
            // console.log(`Asli data ${result}`)
            if(err){
                return callBack(err,null)
            }
            return callBack(null,result)
        }
        )
    },
    searchReportViewService:(data,callBack)=>{
        console.log(data.reported_by)
        pool.query("SELECT * from report where reported_by LIKE ?",
        [`%${data.reported_by}%`],
        (err,result)=>{
            if(err){
                return callBack(err,null);
            }
            return callBack(null,result);
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
    viewSpecificCategoriesService:(type,callBack)=>{
        pool.query("Select * from lost_category where type = ?",
        [type],
        (err,result)=>{
            if(err){
                return callBack(err,null)
            }
            return callBack(null,result)
        }
        )
    },
    addCategoriesService:(data,callBack)=>{
        pool.query("INSERT into lost_category(type) values (?) ",
        [data.type],
        (err,result)=>{
            console.log(err)
            if(err){
                return callBack(err,null);
            }
            return callBack(null,result);
        });
    },
}

