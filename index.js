const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); // นำเข้า bcryptjs
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors'); // นำเข้า CORS
const crypto = require('crypto'); // เพิ่มบรรทัดนี้
const verifyToken = require('./middleware/verifyToken');
const { promisify } = require('util');
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const saltRounds = 10;
const { addPointToBlockchain , getUserPoints , redeemPointOnBlockchain , transferPointOnBlockchain , getPointTransactionsByUserId } = require('./controllers/pointController'); ;

const app = express();
const port = 4000;

// ตั้งค่า HDWalletProvider พร้อมกับ mnemonic และ RPC URL
const provider = new HDWalletProvider({
  privateKeys: [
      "1ade856e918869905a865767b536faf16d671d9454e3d535a358d70ff64d79e8",
    ],
    providerOrUrl: "https://rpc-amoy.polygon.technology",
});

// สร้าง instance ของ Web3 และเชื่อมต่อกับ provider
const web3 = new Web3(provider);

// ใช้ body-parser เพื่ออ่านข้อมูลในรูปแบบ JSON
app.use(bodyParser.json());

// อนุญาตเฉพาะ Origin จาก http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// การตั้งค่าเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin', // เปลี่ยนเป็นรหัสผ่านของคุณ
    database: 'LoyaltySystem'
});

// เชื่อมต่อกับฐานข้อมูล
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// แปลง db.query ให้เป็น Promise เพื่อรองรับ async/await
const query = promisify(db.query).bind(db);


//=========================================================== Signup

// Endpoint สำหรับบันทึกข้อมูลผู้ใช้ใหม่
app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, password ,storeName } = req.body;

  // เข้ารหัสรหัสผ่านด้วย bcrypt
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO admins (first_name, last_name, email, password , store_name) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [firstName, lastName, email, hashedPassword,storeName], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.status(201).json({ message: 'User registered successfully' });
  });
});


//app.get('/api/profile', verifyToken, async (req, res) => {
  app.get('/api/admin/profile/:id',  (req, res) => {
  console.log('/api/admin/profile');
  const adminId = req.params.id; // Assuming `verifyToken` middleware attaches `user` to `req`

  try {
    const query = 'SELECT store_name, first_name, last_name FROM admins WHERE id = ?';
    db.query(query, [adminId], (error, results) => {
      if (error) {
        console.error('Error fetching admin profile:', error);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Admin profile not found' });
      }

      // Send back the profile data
      const adminProfile = results[0];
      res.json(adminProfile);
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//===========================================================

//================================ Login Admin =========================

app.post('/api/login', (req, res) => {
  console.log('/api/login');
   const { email, password } = req.body;
 
   // ค้นหาผู้ใช้จากฐานข้อมูล
   const query = 'SELECT * FROM admins WHERE email = ?';
   db.query(query, [email], (err, results) => {
     if (err) return res.status(500).json({ message: 'Server error' });
     if (results.length === 0) {
       return res.status(401).json({ message: 'Invalid email or password' });
     }
 
     const user = results[0];
 
     // ตรวจสอบรหัสผ่าน
     const isMatch = bcrypt.compareSync(password, user.password);
     if (!isMatch) {
       return res.status(401).json({ message: 'Invalid email or password' });
     }
 
     // สร้างโทเค็น JWT
     const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
 
     res.json({ message: 'Login successful', token , id: user.id  });
   });
 });

 //============================= Login Admin =============================


 //============================= Register ===============================
 app.post('/api/check-phone', async (req, res) => {
  const { phone } = req.body;
  
  // Query to check if the phone number exists in the database
  const query = 'SELECT * FROM user WHERE phone = ?';
  
  db.query(query, [phone], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    
    // Check if the phone number exists
    if (results.length === 0) {
      return res.json({ exists: false });
    } else {
      return res.json({ exists: true });
    }
  });
});


 //============================= Register ===============================
// // 1. สร้าง User ใหม่
// app.post('/api/user', (req, res) => {
//     const { name, email, phone, created_id } = req.body;
//     const query = `INSERT INTO User (name, email, phone, created_id) VALUES (?, ?, ?, ?)`;
//     db.query(query, [name, email, phone, created_id], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send(err);
//         }
//         res.send({ message: 'User created successfully', userId: result.insertId });
//     });
// });

// // 2. ดึงข้อมูล User ทั้งหมด
app.get('/api/users', (req, res) => {
    const query = `SELECT * FROM User`;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.send(results);
    });
});


  // ฟังก์ชันสำหรับสร้าง OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }
  
// Endpoint สำหรับส่ง OTP และบันทึกหมายเลขโทรศัพท์
app.post('/api/send-otp', (req, res) => {
    const { phone } = req.body;
    const otp_code = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60000); // หมดอายุใน 5 นาที
  
    // บันทึก OTP ลงในตาราง otp
    const otpQuery = 'INSERT INTO otp (phone, otp_code, expires_at) VALUES (?, ?, ?)';
    db.query(otpQuery, [phone, otp_code, expires_at], (err, result) => {
      if (err) {
        console.error('Failed to save OTP:', err);
        return res.status(500).json({ message: 'Server error' });
      }
  
      console.log(`OTP for ${phone}: ${otp_code}`);
      // ในที่นี้จะแสดง OTP ใน console แทนการส่ง SMS จริง
      
      res.json({ message: 'OTP sent successfully', otp_code }); // สำหรับทดสอบส่ง OTP กลับไปยัง client
     
    });
  });

  // Endpoint สำหรับตรวจสอบ OTP
app.post('/api/verify-otp', (req, res) => {
    const { phone, otp_code } = req.body;
  
    // ค้นหา OTP ที่ตรงกับเบอร์โทรศัพท์และรหัส OTP และยังไม่ถูกใช้
    const otpQuery = 'SELECT * FROM otp WHERE phone = ? AND otp_code = ? AND is_verified = FALSE AND expires_at > NOW()';
    db.query(otpQuery, [phone, otp_code], (err, results) => {
      if (err) {
        console.error('Failed to verify OTP:', err);
        return res.status(500).json({ message: 'Server error' });
      }
  
      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      // อัปเดตสถานะ OTP เป็น "verified"
      const updateOtpQuery = 'UPDATE otp SET is_verified = TRUE WHERE otp_id = ?';
      db.query(updateOtpQuery, [results[0].otp_id], (err, result) => {
        if (err) {
          console.error('Failed to update OTP status:', err);
          return res.status(500).json({ message: 'Server error' });
        }
  
        // เพิ่มข้อมูลผู้ใช้ลงในตาราง users
        const insertUserQuery = 'INSERT INTO user (phone, created_at) VALUES (?, NOW())';
        db.query(insertUserQuery, [phone, results[0].otp_id], (err, result) => {
          if (err) {
            console.error('Failed to insert user:', err);
            return res.status(500).json({ message: 'Server error' });
          }
  
          // ส่งข้อความแสดงความสำเร็จกลับไปยัง client
          //res.json({ message: 'OTP verified successfully and user added' });
          const query = 'SELECT user_id FROM user WHERE phone = ?';
          db.query(query, [phone], (err, results) => {
            if (err) {
              return res.status(500).json({ message: 'Server error' });
            }
        
            if (results.length === 0) {
              return res.status(400).json({ message: 'User not found' });
            }

            const user = results[0];
             res.json({ success: true, message: 'OTP verified successfully', userId: user.user_id });
            
          });
        });
      });
    });
  });

  app.post('/api/check-pin', (req, res) => {
    const { userId } = req.body;
  
    const query = 'SELECT pin_code FROM user WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error checking pin_code:', err);
        return res.status(500).json({ message: 'Server error' });
      }
  
      if (results.length > 0 && results[0].pin_code) {
        res.json({ hasPin: true }); // มี pin_code แล้ว
      } else {
        res.json({ hasPin: false }); // ยังไม่มี pin_code
      }
    });
  });

  app.post('/api/set-pin', async (req, res) => {
    const { userId, pin , name } = req.body;
  
    try {
      const hashedPin = await bcrypt.hash(pin, saltRounds);
      const query = 'UPDATE user SET pin_code = ? , name = ? WHERE user_id = ?';
      db.query(query, [hashedPin, name ,userId], (err, result) => {
        if (err) throw err;
        res.json({ message: 'PIN set successfully' });
      });
    } catch (error) {
      console.error('Error setting PIN:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/customer-login', (req, res) => {
    const { phone, pin_code } = req.body;
  
    const query = 'SELECT user_id, pin_code , name FROM user WHERE phone = ?';
    db.query(query, [phone], async (err, results) => {
      if (err) {
        console.error('Error checking login:', err);
        return res.status(500).json({ message: 'Server error' });
      }
  
      if (results.length === 0) {
        return res.status(400).json({ success: false, message: 'ไม่พบผู้ใช้งาน' });
      }
  
      const user = results[0];
      const isPinCorrect = await bcrypt.compare(pin_code, user.pin_code);
  
      if (isPinCorrect) {
        res.json({ success: true, message: 'เข้าสู่ระบบสำเร็จ', userId: user.user_id , customerName : user.name });
      } else {
        res.status(400).json({ success: false, message: 'PIN ไม่ถูกต้อง' });
      }
    });
  });

  // Endpoint เพื่อดึงข้อมูลผู้ใช้ตาม userId
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT phone , name FROM user WHERE user_id = ?'; // ปรับคอลัมน์และชื่อ table ให้สอดคล้องกับโครงสร้างฐานข้อมูลของคุณ
    
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error retrieving user data:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
        console.log(result[0]);
      res.json({ phone: result[0].phone , name : result[0].name });
    });
  });

  app.get('/api/users/phone/:phone', (req, res) => {
    const phone = req.params.phone;
    const query = 'SELECT user_id FROM user WHERE phone = ?'; // ปรับคอลัมน์และชื่อ table ให้สอดคล้องกับโครงสร้างฐานข้อมูลของคุณ
  
    db.query(query, [phone], (err, result) => {
      if (err) {
        console.error('Error retrieving user data:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      console.log(result[0]);
      res.json({ userId: result[0].user_id });
    });
  });

  // Endpoint สำหรับเพิ่ม Point บน blockchain
app.post('/api/add-point', async (req, res) => {
    //console.log(req.body); // เพิ่มบรรทัดนี้เพื่อตรวจสอบข้อมูลใน req.body
    const { userId, phone, point } = req.body;

    try {
        const result = await addPointToBlockchain(userId, phone, point);
        res.status(200).json({ message: 'Point added successfully to blockchain', transaction: result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add point to blockchain ##', error: error.message });
    }
});

app.post('/api/redeem-point', async (req, res) => {
  const { userId, point } = req.body;

  try {
      // เรียกใช้ฟังก์ชัน redeemPointOnBlockchain เพื่อใช้คะแนนจาก blockchain
      const result = await redeemPointOnBlockchain(userId, point);
      
      // ส่งผลลัพธ์การทำธุรกรรมกลับไปredeem-reward
      res.status(200).json({ message: 'Point redeemed successfully from blockchain', transaction: result });
  } catch (error) {
      // ส่งข้อความผิดพลาดกลับไปในกรณีที่การทำธุรกรรมล้มเหลว
      res.status(500).json({ message: 'Failed to redeem point from blockchain', error: error.message });
  }
});

app.post('/api/redeem-reward', async (req, res) => {
  const { userId, rewardId, userPoints } = req.body; // รับ userPoints จาก client

  console.log(userId, rewardId, userPoints);

  try {
    // ตรวจสอบข้อมูลรางวัลจากตาราง rewards
    const rewardResults = await query('SELECT * FROM rewards WHERE reward_id = ?', [rewardId]);

    const reward = rewardResults[0];
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    const pointsRequired = reward.points_required;

    // เช็คว่า userPoints เพียงพอหรือไม่
    if (userPoints < pointsRequired) {
      return res.status(400).json({ message: 'คะแนนของคุณไม่เพียงพอในการแลกรางวัลนี้' });
    }

    // ทำการแลกรางวัล: บันทึกลงใน reward_redeems
    await query('INSERT INTO reward_redeems (user_id, reward_id, redeemed_at) VALUES (?, ?, NOW())', [userId, rewardId]);

    // อัปเดตจำนวนครั้งที่แลกในตาราง rewards
    await query('UPDATE rewards SET redeemed_count = redeemed_count + 1 WHERE reward_id = ?', [rewardId]);


    // บันทึกข้อมูลการแลกรางวัลลงใน Blockchain
    console.log('Recording transaction on blockchain...');
    const transactionResult = await redeemPointOnBlockchain(userId, userPoints);

    res.status(200).json({
      message: `คุณได้แลกรางวัล ${reward.name} สำเร็จ!`,
      transaction: transactionResult
    });
  } catch (error) {
    console.error('Error processing redeem reward:', error);
    res.status(500).json({ message: 'Failed to process redeem reward request' });
  }
});


// ดึงคูปองที่ยังไม่ได้ใช้
app.get('/api/coupons/available', (req, res) => {
  const { userId } = req.query;
  
  // ใช้ callback function แทนการใช้ Promises
  db.query(`
    SELECT rr.id, rr.user_id, rr.reward_id, rr.redeemed_at, rr.is_used, 
           r.name AS name, r.description AS reward_description, r.image_url AS image_url, r.points_required
    FROM reward_redeems rr
    JOIN rewards r ON rr.reward_id = r.reward_id
    WHERE rr.user_id = ? 
  `, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching available coupons:', err);
      return res.status(500).json({ message: 'Error fetching available coupons' });
    }
    
    // ส่งผลลัพธ์กลับไปยัง client
    res.status(200).json(result);
  });
});

// API สำหรับใช้คูปอง
app.post('/api/coupons/use', (req, res) => {
  const { couponId } = req.body;

  // ตรวจสอบว่ามี couponId ถูกส่งมาหรือไม่
  if (!couponId) {
    return res.status(400).json({ message: 'Coupon ID is required' });
  }

  // ค้นหาและตรวจสอบสถานะคูปองว่าใช้ได้หรือไม่
  const queryCheck = `SELECT * FROM reward_redeems WHERE id = ? AND is_used = 0`;
  db.query(queryCheck, [couponId], (err, results) => {
    if (err) {
      console.error('Error checking coupon:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // ตรวจสอบว่าคูปองนี้มีอยู่และยังไม่ได้ใช้
    if (results.length === 0) {
      return res.status(400).json({ message: 'Coupon is either invalid or already used' });
    }

    // อัปเดตสถานะคูปองให้เป็นใช้แล้ว (is_used = 1)
    const queryUpdate = `UPDATE reward_redeems SET is_used = 1 WHERE id = ?`;
    db.query(queryUpdate, [couponId], (err, result) => {
      if (err) {
        console.error('Error updating coupon status:', err);
        return res.status(500).json({ message: 'Failed to update coupon status' });
      }

      res.status(200).json({ message: 'Coupon used successfully' });
    });
  });
});



app.post('/api/transfer-point', async (req, res) => {
  const { fromUserId, toUserId, point } = req.body;
  console.log(fromUserId);
  console.log(toUserId);
  console.log(point);

  try {
      // เรียกใช้ฟังก์ชัน transferPointOnBlockchain เพื่อโอนคะแนนบน blockchain
      const result = await transferPointOnBlockchain(fromUserId, toUserId, point);

      // ส่งผลลัพธ์การทำธุรกรรมกลับไป
      res.status(200).json({ message: 'Point transferred successfully on blockchain', transaction: result });
  } catch (error) {
      // ส่งข้อความผิดพลาดกลับไปในกรณีที่การทำธุรกรรมล้มเหลว
      res.status(500).json({ message: 'Failed to transfer point on blockchain', error: error.message });
  }
});



// Endpoint สำหรับดึงคะแนนของผู้ใช้จาก Blockchain
app.get('/api/user-points/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const userPoints = await getUserPoints(id);
        res.status(200).json({ message: 'User points fetched successfully', userPoints });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user points', error: error.message });
    }
});

app.get('/api/rewards', (req, res) => {
    const query = 'SELECT reward_id, name, points_required, redeemed_count, image_url , status FROM rewards';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving rewards data:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        // Map through results to format them into an array of reward objects
        const rewards = results.map((reward) => ({
            reward_id: reward.reward_id,
            name: reward.name,
            points_required: reward.points_required,
            redeemed_count: reward.redeemed_count,
            image_url: reward.image_url,
            status : reward.status
        }));

        res.json(rewards);
    });
});

// Endpoint to get reward details by reward_id
app.get('/api/rewards/:reward_id', (req, res) => {
    const { reward_id } = req.params;
    const query = 'SELECT reward_id, name, description, image_url, points_required, status FROM rewards WHERE reward_id = ?';

    db.query(query, [reward_id], (err, results) => {
        if (err) {
            console.error('Error fetching reward details:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Reward not found' });
        }

        res.json(results[0]);
    });
});


app.post('/api/add-rewards', (req, res) => {
    const { name, description, image_url, points_required } = req.body;
    const query = 'INSERT INTO rewards (name, description, image_url, points_required,status) VALUES (?, ?, ?, ?,1)';
    
    db.query(query, [name, description, image_url, points_required], (err, result) => {
      if (err) {
        console.error('Error adding reward:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.status(201).json({ message: 'Reward added successfully' });
    });
});

app.post('/api/delete-rewards', (req, res) => {
    const { reward_id } = req.body;
    const query = 'UPDATE rewards SET status = 0  , updated_at = NOW() WHERE reward_id = ?';
    
    db.query(query, [reward_id], (err, result) => {
      if (err) {
        console.error('Error deleting reward:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Reward not found' });
      }
      
      res.status(200).json({ message: 'Reward marked as deleted successfully' });
    });
});

app.put('/api/update-reward/:reward_id', (req, res) => {
    const { reward_id } = req.params;
    const { name, description, image_url, points_required, status } = req.body;

    const query = `
        UPDATE rewards 
        SET 
            name = ?, 
            description = ?, 
            image_url = ?, 
            points_required = ?, 
            status = ?,        -- corrected this line
            updated_at = NOW()
        WHERE 
            reward_id = ?
    `;

    db.query(query, [name, description, image_url, points_required, status, reward_id], (err, result) => {
        if (err) {
            console.error('Error updating reward:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reward not found' });
        }

        res.status(200).json({ message: 'Reward updated successfully' });
    });
});


// สร้าง API สำหรับล้างธุรกรรมที่ค้าง
app.get('/api/replace-pending-transaction', async (req, res) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];
    const gasPrice = 30;

    const nonce = await web3.eth.getTransactionCount(fromAddress, 'pending'); // ดึง Nonce ปัจจุบัน


    if (!fromAddress || !nonce || !gasPrice) {
      return res.status(400).json({ message: 'Missing required fields: fromAddress, nonce, gasPrice' });
    }

    // ตรวจสอบว่ามี Private Key ในไฟล์ .env หรือไม่
    const privateKey = "1ade856e918869905a865767b536faf16d671d9454e3d535a358d70ff64d79e8";
    if (!privateKey) {
      return res.status(500).json({ message: 'Private key is not set in the environment variables' });
    }

    // ตั้งค่าธุรกรรม "dummy"
    const txParams = {
      from: fromAddress,
      to: fromAddress, // ส่งไปยัง address ตัวเองเพื่อให้เป็นธุรกรรม dummy
      nonce: web3.utils.toHex(nonce), // กำหนด nonce ที่ค้าง
      gas: 21000, // ใช้ Gas Limit มาตรฐานสำหรับการโอน
      gasPrice: web3.utils.toWei(gasPrice.toString(), 'gwei'), // แปลง gasPrice เป็น gwei
      value: '0x0', // ไม่ส่งค่าเงินใด ๆ
      data: '0x' // ไม่ใส่ข้อมูลเพิ่มเติม
    };

    // ลงนามธุรกรรม
    const signedTx = await web3.eth.accounts.signTransaction(txParams, privateKey);

    // ส่งธุรกรรมที่ลงนามแล้ว
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .on('receipt', receipt => {
        console.log('Transaction successful:', receipt);
        res.json({
          message: 'Transaction replaced successfully',
          transactionHash: receipt.transactionHash,
          receipt
        });
      })
      .on('error', error => {
        console.error('Error sending dummy transaction:', error);
        res.status(500).json({ message: 'Failed to replace transaction', error: error.message });
      });
  } catch (error) {
    console.error('Error in replace-pending-transaction API:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

// API สำหรับดึงประวัติการทำธุรกรรมของผู้ใช้
app.get('/api/user-point-history/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);

  try {
    const transactions = await getPointTransactionsByUserId(userId);

    // ตรวจสอบว่ามีข้อมูลธุรกรรมหรือไม่
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transaction history found for this user' });
    }

    const userData = await new Promise((resolve, reject) => {
      const query = 'SELECT phone, name FROM user WHERE user_id = ?';
      db.query(query, [userId], (err, result) => {
        if (err) {
          console.error('Error retrieving user data:', err);
          reject('Database error');
        } else {
          resolve(result[0]);
        }
      });
    });

    res.status(200).json({ history: transactions, user: userData });
  } catch (error) {
    console.error('Error processing user point history:', error);
    res.status(500).json({ message: 'Failed to fetch transaction history', error: error.message });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
