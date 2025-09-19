import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import cors from "cors";
//nodeimport { text } from "body-parser";


const app = express();
const upload = multer();
const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY);

// init ai
const geminiAI = {
  text : "gemini-2.5-flash-lite",
  model: "gemini-2.5-flash",
  Image: "gemini-2.5-flash",
  document: "gemini-2.5-flash-lite",
  chat: "gemini-2.5-pro",
  
}

//init app backend
app.use(cors());
app.use(express.json()); // -> untuk mengizinkan mengunakan 'Conten-type: application/json' di header
//app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// inisiasi route (app sub funcion):
// .get(), .post(),.put(), .patch(), .delete(). -> yg umum di pakai
app.post('/generate-text',async(req,res)=>{
    //handle request yg diterima user
    const {body} = req;

    // guard clausa
    if(!body){
        res.status(400).send("tidak ada yg terkirim");
        return;

        
    }

    if(typeof body !== 'object'){
        res.status(400).send("tidak sesuai format");
        return;

    }

    const {message} = body;
    
    if(!message || typeof message !== 'string'){
        res.status(400).send("tidak ada pesan atau foramt tidak sesuai");
        return;

    }

    const model = ai.getGenerativeModel({ model: geminiAI.text });
    const result = await model.generateContent(message);

    res.status(200).json({
        reply: result.response.text()
    });



});


app.post('/chat',async(req,res)=>{
   const {conversation} = req.body;
   
   // guard conversation array
   if(!conversation|| !Array.isArray(conversation)){
    res.status(400).json({
        success: false,
        data:null,
        message:'Percakapan tidak valid'
    });
   }

   //cek integritas
   let isDataInvalid = false;

   conversation.forEach((item)=>{
    if(!item){
        isDataInvalid = true;
    }
    else if(typeof item !== 'object'){
        isDataInvalid = true;
    }
    else if(!item.role || !item.message){
        isDataInvalid = true;
    }


   });



   if(isDataInvalid){
     return res.status(400).json({
         success: false,
        data:null,
        message:'data tidak valid'
     });

    }
     const konten= conversation.map(item=>{
        return{
            role: item.role,
            parts:[{
                text: item.message
            }]
        }

    });
     

    try{
        const chatModel = ai.getGenerativeModel({ model: geminiAI.chat });
        const result = await chatModel.generateContent({ contents: konten });
        return res.status(200).json({
            success:true,
            data: result.response.text(),
            //replay: response.text
        });

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            data: null,
            message: e.message
        });
    }

});
// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "buatkan saya website berisi html, css, dan javascript, dan untuk stylnya menggunakan tailwind css",
//   });
//   console.log(response.text);
// }

// await main();
// panggil si app-nya di sini
const port = 3000;

app.listen(port, () => {
    console.log("I LOVE YOU a", port);
});