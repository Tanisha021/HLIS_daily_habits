const crypto = require("crypto");
const algorithm = 'AES-256-CBC';
const key = Buffer.from("4fa3c5b6f6a8318be1e0f1e342a1c2a9569f85f74f4dbf37e70ac925ca78e147", 'hex');
const iv = Buffer.from("15a8f725eab7c3d34cc4e1a6e8aa1f9a", 'hex');

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted; 
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
} 

const encrypted = encrypt(`
      
   {
            "habit_id": 2,
            "status": "completed"
        }  
  `);
  const decrypted = decrypt("f7c448ea191861b183bc830c6a482ea74fc1530dc8d560b3fc00fda726ee535fc80ca31921df81b67ec6c1f7d3cf229f5e6465774af8ff97cd28e687dc9b58193957279d2a1c5432fc8bc62e36c2e930ece8648989c75c7d27c779c2de38090cecd4fe6b6671f9d1efdfe850ae330a0204cb5b2a6d417d1eb834079684c2cd2eb239629e2ec31ca8aae8732da459dc5d7ad5a512b201d9b30de8ceca979fb837410c4f6750d81c7bfac07c05bbbc1529fbca561acb4b4c833c7c96a77fb1c91f85cbaa536593463c8118a5122551c44bf4c340eef3e87361a011e3b83060e8f99d47f5a21e5da9d79453cb3bc18414a15237d08cf22759f3f6f20dc9b22780e8947acea62bbfa3176534e43e9510571b2d3e34903b3b4fd1cae90fea86448b9e00aae00936573528f8d7af0a92e2689efa06361cfff5b054032c901dcf0dd2543e4d9821a35eab2f088b588fdc0dae33e9402342c5a025c6c9d6097c3c208f1f8ae29163465e3cdcf2ec260aa1a519733be697365861dcce36d6efe397fa5a89");
  
  console.log('Encrypted:', encrypted);
  console.log('Decrypted:', decrypted);
  
  /*
  

    {
            "name": "Learning",
            "habit_type_id": 1,
            "goal_type": "daily",
            "goal_target": 1,
            "reminder_time": "10:00:00",
            "message": "Keep learning new things"
        }

          // {
        //     "habit_id": 1,
        //     "date": "2023-10-01 00:00:00",
        //     "status": "completed"
        // } 

  {
  "page": 1,
  "price_range": [20000, 80000]
}

  {
    "payment_type": "cod",
    "address_id": 1
}
    {
  "address_line": "123, Park Avenue",
  "city": "Ahmedabad",
  "state": "Gujarat",
  "country": "India",
  "pincode": "380015"
}

  
   {
    "email_id": "tan8@example.com",
    "password_": "password1"
  }
// {
//   "full_name": "abc",
//   "email_id": "tan8@example.com",
//   "phone_number": "1524567801",
//   "code_id": 1,
//   "password_": "password1",
//   "device_token": "xyz123",
//   "device_type": "Android",
//   "time_zone": "Asia/Kolkata",
//   "os_version": "13.0",
//   "app_version": "2.1.5",
//   "verify_with":"m"
// }


 {
  "phone_number": "1524567801",
  "otp": "6830"
}
*/