const pool = require("../../config/database")

module.exports = {

    viewProduct: callBack => {
        pool.query("SELECT * FROM items WHERE item_id NOT IN (SELECT item_id FROM claim WHERE claim_status = 'Approved' or claim_status='Pending')",
        (err,result,field)=>{
            // console.log("dadadadad")
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
        pool.query("SELECT * FROM items where item_id in (SELECT item_id FROM claim where claim_status=?) and item_name LIKE ?",
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
            // console.log("dadadadad")
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
        console.log(`This is final path `+imageName); 
        console.log(data)
        pool.query("INSERT INTO items(item_name,item_image,found_location,found_by,found_date) VALUES (?,?,?,?,?)",
            [data.item_name,
            imageName,
            data.found_location,
            data.found_by,
            data.found_date
            ],
            (err, result, fields) => {
                console.log(err)
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
        // console.log(data)
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
        pool.query(`UPDATE claim
        SET claim_status = 
            CASE
                WHEN claim_id = ? AND item_id = ? THEN 'Approved'
                WHEN claim_id != ? AND item_id = ? THEN 'Rejected'
                ELSE claim_status
            END;
        `,
        [data.claim_id,data.item_id,data.claim_id,data.item_id],
        (err,result,fields)=>{
            console.log(err)
            if(err){
                return callBack(err,null)
            }
            return callBack(null,result)
        }
        )
    },
    rejectItemsService:(data,callBack)=>{
        pool.query(`UPDATE claim
        SET claim_status = 'Rejected' where claim_id=? and item_id=?
        `,
        [data.claim_id,data.item_id],
        (err,result,fields)=>{
            console.log(err)
            if(err){
                return callBack(err,null)
            }
            return callBack(null,result)
        }
        )
    }
}

