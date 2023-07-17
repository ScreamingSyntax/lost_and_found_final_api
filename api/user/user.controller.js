const { viewItemsService, claimItemsService, claimItemService, searchProductService, verifyReportService, addReportService, viewProductByDate, viewProductByName } = require('./user.service')
const { fetchDateTime } = require('../../tools/date.time')
const moment = require("moment-timezone");
const pool = require('../../config/database');
moment.tz.setDefault("Asia/Kathmandu");
const{ transporter} = require('../../otp/otp')

module.exports = {
    viewItemController: (req, res) => {
        const data = req.body;
        viewItemsService(data, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Error Fetching Items"
                })
            }
            return res.json({
                success: 0,
                data: results
            })
        })
    },
    viewProductByOrderDate: (req, res) => {
        viewProductByDate((err, result) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Error Fetching Data"
                })
            }
            return res.json({
                success: 1,
                data: result
            })
        })
    },
    viewProductByName: (req, res) => {
        viewProductByName((err, result) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Error Fetching Data"
                })
            }
            return res.json({
                success: 1,
                data: result
            })
        })
    },
    claimByUserController: (req, res) => {
        const data = req.body;
        console.log(`This is requested`,data)
        fetchDateTime().then((value) => {
            if (value == false) {
                return res.json({
                    success: 0,
                    message: "Error fetching date and time"
                })
            }
            current_date = moment(value).format("YYYY-MM-DD");
            claimItemService(data, current_date, (err, results) => {
                if (err) {
                    return res.json({
                        success: 0,
                        message: "Server Issue"
                    })
                }
                return res.json({
                    success: 1,
                    message: "Your request is pending, Please visit SSD"
                })
            })
        })
    },
    searchProductController: (req, res) => {
        const data = req.body;
        searchProductService(data, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Issue"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    addReportController: (req, res) => {
        console.log(req.body)
        data = req.body
        send_otp = req.body.otp
        let date;
        fetchDateTime().then((value) => {
            if (value == false) {
                return res.json({
                    success: 0,
                    message: "Server Error d/t"
                })
            }
            current_date = moment(value).format("YYYY-MM-DD");
            verifyReportService(data, (err, results) => {
                if (err) {
                    return res.json({
                        success: 0,
                        message: "Server Error vrs"
                    })
                }
                if (send_otp == results[0].otp) {
                    addReportService(data, current_date, (err, results) => {
                        if (err) {
                            return res.json({
                                success: 0,
                                message: "Server Isssue ars"
                            })
                        }
                        var mailOptions={
                            to: req.body.email,
                            subject: "Otp for registration is: ",
                            html: `
                            <!DOCTYPE html>
                     <html>
                     <head>
                       <title>Lost and Found Application - Team Elevate</title>
                       <style>
                         body {
                           font-family: 'Poppins', sans-serif;
                           background-color: #f5f5f5;
                           display: flex;
                           align-items: center;
                           justify-content: center;
                           min-height: 100vh;
                         }
                     
                         .container {
                           max-width: 500px;
                           padding: 40px;
                           background-color: #ffffff;
                           border-radius: 5px;
                           box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                           text-align: center;
                         }
                     
                         h1 {
                           color: #3498db;
                           font-size: 30px;
                           margin-top: 0;
                         }
                         h3{
                           color: #3498db;
                           font-size: 15px;
                           margin: 20 0;
                         }
                         p {
                           color: #777777;
                           font-size: 16px;
                           line-height: 1.5;
                           margin-bottom: 20px;
                         }
                     
                         .otp-container {
                           background-color: #f5f5f5;
                           border: 2px solid #3498db;
                           border-radius: 5px;
                           padding: 10px;
                           display: inline-block;
                         }
                     
                         .otp {
                           font-weight: bold;
                           color: #3498db;
                           font-size: 24px;
                         }
                     
                         .link {
                           color: #3498db;
                           text-decoration: none;
                           transition: color 0.3s ease;
                         }
                     
                         .link:hover {
                           color: #ff7f50;
                         }
                     
                         .social-icons {
                           margin-top: 20px;
                           display: flex;
                           justify-content: center;
                         }
                     
                         .social-icons a {
                           display: inline-block;
                           margin-right: 10px;
                           width: 40px;
                           height: 40px;
                           line-height: 40px;
                           text-align: center;
                           border-radius: 50%;
                           background-color: #3498db;
                           color: #ffffff;
                           text-decoration: none;
                         }
                     
                       </style>
                     
                     </head>
                     <body>
                     <div class="container fade-in scale-in">
                       <h1>Lost and Found</h1>
                       <p>
                         Thank you for choosing our Lost and Found application developed by Team Elevate from Itahari International College. We are dedicated to helping you find your lost belongings and reconnect with your valuable items.
                         Your report has been successfully submitted! We will contact you as soon as we get any information about this.
                       </p>
                     </div>
                     </body>
                     </html>
                            `
                          };
                          transporter.sendMail(mailOptions, (error, info) => {});
                        return res.json({
                            success: 1,
                            message: "Successfully Added Report"
                        })
                    })
                }
                if (send_otp != results[0].otp) {
                    return res.json({
                        success: 0,
                        message: "Wrong Otp"
                    })
                }
            })

        });
    }
}