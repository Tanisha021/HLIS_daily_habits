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
  const decrypted = decrypt("f7c448ea191861b183bc830c6a482ea7972f42daf470211493235fd1bbfc865e6f35da25a44ef1874a85098b8ebcb0b273fd6d4fde3c863f45f38ad50cfa23cbca8e45383f820d794e0b2e90ed8b808bbe478fe57751ac3091386d4f6e08efe1b1850dddc812365bd3c21e5088eff511ffef56ffcf7c2a40f45afda168c15de92f48a2ede6debda9161563419d6b4a363a7d226d15cff4b499761e30b7d4601ce68ffe7a61de72359d945c56c89e34f93ec2f27de0050bd2308f53588e52f5babc562476f43abcb5f133100c79f7070b3c121d2b5fa113440d2ba81c31fb0ec1f9433394c8e0134867274bebef04d48225c66ec313d2a75150af0ac8ef9b65fbd6f81a5a00bd28d141c8838fb5e2dc39ef185fe02e47642f91efa727da52856285d9df9f16add1d9398a37a4b08b2c906abd8c6358b5881451514adbe73ca12d4ab9f8f7d164c0459115789ae3a56d453ce0d9bdbdb6771b9ddb35f249fac3533d844cb328886c4d8ac530a93a1db27a5dd58e03eb444c6643525332e2303d40b5c00a431e0a4bf2abdd70ffc699c724f992af90a9671d8e2e22e7027e380fddc073ac79b4f4682a3dbcfcd97e3109938ea5129c525db62dbccc57ca265555df3df5b1315023869cb8e290a2b114de3ed4bc54aad57869cdd801068de3aad35f");
  
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